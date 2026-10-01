const fs = require("fs");
const path = require("path");

function patchFile(filePath, isExportPack) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, "utf8");

  const targetThrow = 'throw new Error("Attempting to parse an unsupported color function \\"" + value.name + "\\"");';
  const packRef = isExportPack ? "exports.pack" : "pack";

  const replacement = `try {
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
                        var hexOrRgb = ctx.fillStyle;
                        if (hexOrRgb && hexOrRgb.indexOf('#') === 0) {
                            var r = parseInt(hexOrRgb.slice(1, 3), 16);
                            var g = parseInt(hexOrRgb.slice(3, 5), 16);
                            var b = parseInt(hexOrRgb.slice(5, 7), 16);
                            return ${packRef}(r, g, b, 1);
                        }
                        if (hexOrRgb && hexOrRgb.indexOf('rgba') === 0) {
                            var m = hexOrRgb.match(/[\\d.]+/g);
                            if (m && m.length >= 4) {
                                return ${packRef}(parseFloat(m[0]), parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3]));
                            }
                        }
                        if (hexOrRgb && hexOrRgb.indexOf('rgb') === 0) {
                            var m2 = hexOrRgb.match(/[\\d.]+/g);
                            if (m2 && m2.length >= 3) {
                                return ${packRef}(parseFloat(m2[0]), parseFloat(m2[1]), parseFloat(m2[2]), 1);
                            }
                        }
                    }
                }
            } catch (e) {}
            return 0x00000000;`;

  if (content.includes(targetThrow)) {
    content = content.replace(targetThrow, replacement);
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`[patch] Successfully patched: ${filePath}`);
  } else {
    console.log(`[patch] Target string not found or already patched: ${filePath}`);
  }
}

const root = path.join(__dirname, "..");
patchFile(path.join(root, "node_modules", "html2canvas", "dist", "html2canvas.esm.js"), false);
patchFile(path.join(root, "node_modules", "html2canvas", "dist", "html2canvas.js"), false);
patchFile(path.join(root, "node_modules", "html2canvas", "dist", "lib", "css", "types", "color.js"), true);
