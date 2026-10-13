const fs = require("fs");
const path = require("path");

function patchFile(filePath, isExportPack) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, "utf8");

  const packRef = isExportPack ? "exports.pack" : "pack";

  // ── Target 1: original un-patched throw ─────────────────────────────────
  const originalThrow =
    'throw new Error("Attempting to parse an unsupported color function \\"" + value.name + "\\"");';

  // ── Target 2: old broken patch (reads ctx.fillStyle getter — fails in Chrome 112+
  //    because the getter returns "oklch(...)" instead of "#rrggbb" / "rgb(...)") ──
  const oldPatchSignature = "ctx.fillStyle = str;\n                        var hexOrRgb = ctx.fillStyle;";

  // ── Replacement: use getImageData() pixel sampling — always returns sRGB bytes ──
  //    Works for oklch, color-mix, hsl, hwb, lab, lch, and any future CSS color fn.
  const newReplacement = `try {
                var str = value.name + '(' + value.values.map(function(v) {
                    if (typeof v.number === 'number') return v.number + (v.type === 16 ? '%' : '');
                    return v.value || '';
                }).filter(Boolean).join(' ') + ')';
                if (typeof document !== 'undefined') {
                    var canvas = document.createElement('canvas');
                    canvas.width = canvas.height = 1;
                    var ctx = canvas.getContext('2d');
                    if (ctx) {
                        ctx.fillStyle = str;
                        ctx.fillRect(0, 0, 1, 1);
                        var imageData = ctx.getImageData(0, 0, 1, 1);
                        if (imageData && imageData.data) {
                            var r = imageData.data[0];
                            var g = imageData.data[1];
                            var b = imageData.data[2];
                            var a = imageData.data[3] / 255;
                            if (a > 0) return ${packRef}(r, g, b, a);
                        }
                    }
                }
            } catch (e) {}
            return 0x00000000;`;

  let patched = false;

  if (content.includes(originalThrow)) {
    content = content.replace(originalThrow, newReplacement);
    patched = true;
    console.log(`[patch] Applied fresh patch to: ${filePath}`);
  } else if (content.includes(oldPatchSignature)) {
    // Already has the old (broken) patch — upgrade it to the getImageData version
    const oldBlockStart = content.indexOf("try {\n                var str = value.name");
    const oldBlockEnd   = content.indexOf("return 0x00000000;", oldBlockStart) + "return 0x00000000;".length;
    if (oldBlockStart !== -1 && oldBlockEnd > oldBlockStart) {
      content = content.slice(0, oldBlockStart) + newReplacement + content.slice(oldBlockEnd);
      patched = true;
      console.log(`[patch] Upgraded old patch to getImageData in: ${filePath}`);
    }
  } else {
    console.log(`[patch] Nothing to patch (may already be up-to-date): ${filePath}`);
  }

  if (patched) fs.writeFileSync(filePath, content, "utf8");
}

const root = path.join(__dirname, "..");
patchFile(path.join(root, "node_modules", "html2canvas", "dist", "html2canvas.esm.js"), false);
patchFile(path.join(root, "node_modules", "html2canvas", "dist", "html2canvas.js"),     false);
patchFile(path.join(root, "node_modules", "html2canvas", "dist", "lib", "css", "types", "color.js"), true);
