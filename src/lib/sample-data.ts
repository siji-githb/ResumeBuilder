import type { Resume } from "@/types/resume";

/**
 * Generates a RFC-4122-ish unique id without crypto dependency.
 * Good enough for local-only client-side keying.
 */
export function generateId(): string {
  return (
    Date.now().toString(36) +
    "-" +
    Math.random().toString(36).substring(2, 9)
  );
}

/**
 * Returns a fully-populated mock resume unified under Jane Marie Dela Cruz
 * combining full-stack software engineering strengths, modern tech stacks,
 * and high-impact metrics.
 */
export function createSampleResume(
  overrides: Partial<Pick<Resume, "id" | "settings">> = {}
): Resume {
  const templateId = overrides.settings?.templateId;
  if (templateId === "modern-sidebar") {
    const res = createModernSidebarSampleResume();
    if (overrides.id) res.id = overrides.id;
    if (overrides.settings) res.settings = { ...res.settings, ...overrides.settings };
    return res;
  }
  if (templateId === "chronological") {
    const res = createChronologicalSampleResume();
    if (overrides.id) res.id = overrides.id;
    if (overrides.settings) res.settings = { ...res.settings, ...overrides.settings };
    return res;
  }
  if (templateId === "functional") {
    const res = createFunctionalSampleResume();
    if (overrides.id) res.id = overrides.id;
    if (overrides.settings) res.settings = { ...res.settings, ...overrides.settings };
    return res;
  }
  if (templateId === "combination") {
    const res = createCombinationSampleResume();
    if (overrides.id) res.id = overrides.id;
    if (overrides.settings) res.settings = { ...res.settings, ...overrides.settings };
    return res;
  }

  const now = new Date().toISOString();
  return {
    id: overrides.id ?? generateId(),
    createdAt: now,
    updatedAt: now,
    settings: overrides.settings ?? {
      templateId: "ats-classic",
      fontFamily: "Calibri",
      fontSize: "base",
      paperSize: "letter",
      primaryColor: "#1e40af",
      documentTitle: "Jane Marie Dela Cruz - Resume",
    },
    basics: {
      fullName: "Jane Marie Dela Cruz",
      headline: "Full-Stack Software Engineer",
      email: "janemdelacruz@gmail.com",
      phone: "+63 917 123 4567",
      location: "Quezon City, Metro Manila, Philippines",
      website: "https://janedela-cruz.dev",
      linkedin: "linkedin.com/in/janemariedelacruz",
      github: "github.com/janedelacruz",
    },
    summary:
      "Results-driven Full-Stack Software Engineer with 4+ years of experience designing and scaling modern web applications using TypeScript, React, Next.js, and Node.js. Proven expertise in building high-throughput microservices, optimizing database performance, and architecting responsive, user-centric cloud solutions. Passionate about clean code, test-driven development, and collaborative innovation.",
    experience: [
      {
        id: generateId(),
        company: "Nexus Tech Solutions",
        role: "Senior Full-Stack Engineer",
        location: "Quezon City, Metro Manila",
        startDate: "Jan 2023",
        endDate: "Present",
        current: true,
        bulletPoints: [
          "Architected and delivered an enterprise analytics dashboard using Next.js, TypeScript, and GraphQL, cutting page load latency by 42% for over 80,000 monthly active users.",
          "Designed scalable RESTful and event-driven APIs with Node.js and Apache Kafka, handling 15M+ daily requests with 99.99% uptime.",
          "Mentored 5 junior engineers through code reviews, technical workshops, and pair programming to uphold clean architecture standards.",
        ],
      },
      {
        id: generateId(),
        company: "Vanguard Innovations",
        role: "Software Engineer",
        location: "Makati City, Metro Manila",
        startDate: "Jun 2021",
        endDate: "Dec 2022",
        current: false,
        bulletPoints: [
          "Engineered responsive client-facing interfaces with React, Redux Toolkit, and Tailwind CSS, increasing checkout conversion rates by 18%.",
          "Optimized PostgreSQL query execution plans and introduced Redis caching layers, reducing database CPU load by 35% during peak traffic.",
          "Established automated CI/CD pipelines using GitHub Actions and Docker, reducing deployment cycle times from 45 minutes to under 8 minutes.",
        ],
      },
    ],
    projects: [
      {
        id: generateId(),
        name: "CloudPulse – Infrastructure Analytics Platform",
        role: "Lead Creator",
        technologies: "Next.js, TypeScript, PostgreSQL, Tailwind CSS, Prisma",
        link: "https://cloudpulse-demo.dev",
        startDate: "Mar 2023",
        endDate: "Present",
        bulletPoints: [
          "Created an open-source workflow automation platform for developer teams, reaching 1,200+ GitHub stars within three months.",
          "Implemented end-to-end OAuth2 authentication, role-based access control (RBAC), and webhook notification pipelines.",
          "Integrated automated unit and integration test suites with Vitest and Playwright, maintaining 94% test coverage across core modules.",
        ],
      },
      {
        id: generateId(),
        name: "TaskForge – Agile Team Collaboration Suite",
        role: "Full-Stack Developer",
        technologies: "React, Node.js, WebSockets, PostgreSQL, Docker",
        link: "https://taskforge-demo.dev",
        startDate: "Aug 2022",
        endDate: "Dec 2022",
        bulletPoints: [
          "Engineered a real-time collaborative task management board with drag-and-drop workflow automation and WebSocket updates.",
          "Optimized query performance and index structures in PostgreSQL, processing and retaining 5M+ audit logs with automated retention policies.",
        ],
      },
    ],
    certifications: [
      {
        id: generateId(),
        name: "AWS Certified Solutions Architect – Associate",
        issuer: "Amazon Web Services",
        date: "2023",
      },
      {
        id: generateId(),
        name: "Meta Front-End Developer Professional Certificate",
        issuer: "Meta",
        date: "2022",
      },
      {
        id: generateId(),
        name: "Dean's Honor List",
        issuer: "University of the Philippines – Diliman",
        date: "2020 – 2023",
      },
    ],
    education: [
      {
        id: generateId(),
        institution: "University of the Philippines – Diliman",
        degree: "Bachelor of Science in Computer Science",
        fieldOfStudy: "Computer Science",
        location: "Quezon City, Metro Manila",
        startDate: "2017",
        endDate: "2021",
        gpa: "GWA: 1.25 (Dean's Lister)",
      },
    ],
    skills: [
      {
        id: generateId(),
        category: "Programming Languages & Core Tech",
        skills: ["TypeScript", "JavaScript", "Python", "SQL", "HTML5/CSS3", "PHP"],
      },
      {
        id: generateId(),
        category: "Frameworks & Libraries",
        skills: [
          "React",
          "Next.js",
          "Node.js",
          "Express",
          "Tailwind CSS",
          "Prisma",
          "Redux",
          "Figma",
        ],
      },
      {
        id: generateId(),
        category: "Cloud, Database & DevOps",
        skills: [
          "AWS (S3, Lambda, ECS)",
          "Docker",
          "PostgreSQL",
          "Redis",
          "Git & GitHub",
          "GitHub Actions",
          "RESTful APIs",
        ],
      },
      {
        id: generateId(),
        category: "Soft Skills",
        skills: [
          "Problem Solving",
          "Critical Thinking",
          "Adaptability",
          "Team Collaboration",
          "Time Management",
          "Attention to Detail",
        ],
      },
    ],
    references: [
      {
        id: generateId(),
        name: "Engr. Ricardo Morales",
        title: "Director of Engineering",
        company: "Nexus Tech Solutions",
        contact: "rmorales@nexustech.ph · +63 917 555 0192",
      },
    ],
  };
}

/**
 * Creates a blank resume with only the template pre-selected.
 */
export function createBlankResume(
  templateId: Resume["settings"]["templateId"]
): Resume {
  const now = new Date().toISOString();
  const defaultFont =
    templateId === "chronological" ||
    templateId === "functional" ||
    templateId === "combination"
      ? "Times New Roman"
      : "Calibri";

  return {
    id: generateId(),
    createdAt: now,
    updatedAt: now,
    settings: {
      templateId,
      fontFamily: defaultFont,
      fontSize: "base",
      paperSize: "letter",
      primaryColor: templateId === "modern-sidebar" ? "#111827" : "#1e40af",
      documentTitle: "Untitled Resume",
    },
    basics: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
    },
    summary: "",
    experience: [],
    projects: [],
    certifications: [],
    education: [],
    skills: [],
    references: [],
  };
}

/**
 * Jane Marie Dela Cruz - Sample Chronological Resume
 */
export function createChronologicalSampleResume(): Resume {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    createdAt: now,
    updatedAt: now,
    settings: {
      templateId: "chronological",
      fontFamily: "Times New Roman",
      fontSize: "base",
      paperSize: "letter",
      primaryColor: "#000000",
      documentTitle: "Chronological Resume",
    },
    basics: {
      fullName: "JANE MARIE DELA CRUZ",
      headline: "Full-Stack Software Engineer",
      location: "Brgy. San Isidro, Quezon City, Philippines",
      phone: "+63 917 123 4567",
      email: "janemdelacruz@gmail.com",
      website: "https://janedela-cruz.dev",
      linkedin: "linkedin.com/in/janemariedelacruz",
      github: "github.com/janedelacruz",
    },
    summary:
      "Motivated and detail-oriented Software Engineer and UP Diliman graduate with hands-on experience in full-stack web development, user interface design, and database systems. Proven track record of delivering reliable software solutions, collaborating in agile team environments, and providing excellent technical support.",
    education: [
      {
        id: generateId(),
        institution: "University of the Philippines – Diliman",
        degree: "Bachelor of Science in Computer Science",
        startDate: "2020",
        endDate: "2024",
        location: "Quezon City, Metro Manila",
        gpa: "GWA: 1.25 (Dean's Lister)",
      },
      {
        id: generateId(),
        institution: "Quezon City Science High School",
        degree: "Senior High School (STEM Strand)",
        startDate: "2018",
        endDate: "2020",
        location: "Quezon City",
        gpa: "With Highest Honors",
      },
    ],
    experience: [
      {
        id: generateId(),
        company: "Nexus Tech Solutions",
        role: "Software Engineer Intern",
        startDate: "August 2023",
        endDate: "Present",
        current: true,
        bulletPoints: [
          "Developed responsive user interface components with React, Next.js, and TypeScript.",
          "Optimized front-end asset loading, cutting page load latency by 35% on mobile devices.",
          "Collaborated with QA engineers to write automated component and integration tests.",
        ],
      },
      {
        id: generateId(),
        company: "University of the Philippines – Office of Student Affairs",
        role: "Student Web Developer & Assistant",
        startDate: "August 2022",
        endDate: "July 2023",
        current: false,
        bulletPoints: [
          "Maintained the university student portal and assisted in managing student organization records.",
          "Handled student and faculty technical inquiries regarding digital admissions and forms.",
          "Automated weekly event registration reports using spreadsheets and Google Apps Script.",
        ],
      },
    ],
    projects: [
      {
        id: generateId(),
        name: "TaskForge – Collaborative Project Workspace",
        startDate: "June 2022",
        endDate: "Present",
        bulletPoints: [
          "Designed and built an interactive project management application using Next.js and Tailwind CSS.",
          "Gathered user feedback from developer teams to improve task tracking and dashboard accessibility.",
        ],
      },
    ],
    skills: [
      {
        id: generateId(),
        category: "Core Technical Competencies",
        skills: [
          "TypeScript & JavaScript",
          "React & Next.js",
          "HTML5 & CSS3 / Tailwind CSS",
          "Node.js & RESTful APIs",
          "PostgreSQL & Redis",
          "Git & GitHub Version Control",
          "Figma UI/UX Prototyping",
        ],
      },
      {
        id: generateId(),
        category: "Professional & Soft Skills",
        skills: [
          "Problem Solving",
          "Critical Thinking",
          "Technical Documentation",
          "Team Collaboration",
          "Agile / Scrum Methodologies",
        ],
      },
    ],
    certifications: [
      {
        id: generateId(),
        name: "Dean's Lister",
        issuer: "University of the Philippines – Diliman",
        date: "2021 – 2023",
      },
      {
        id: generateId(),
        name: "Meta Front-End Developer Professional Certificate",
        issuer: "Meta",
        date: "2023",
      },
      {
        id: generateId(),
        name: "Best in Research & Software Capstone",
        issuer: "QC Science High School",
        date: "2020",
      },
    ],
    references: [
      {
        id: generateId(),
        name: "Dr. Elena Santos",
        title: "Associate Professor & Capstone Advisor",
        company: "University of the Philippines – Diliman",
        contact: "esantos@up.edu.ph · +63 918 234 5678",
      },
    ],
  };
}

/**
 * Jane Marie Dela Cruz - Sample Functional Resume
 */
export function createFunctionalSampleResume(): Resume {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    createdAt: now,
    updatedAt: now,
    settings: {
      templateId: "functional",
      fontFamily: "Times New Roman",
      fontSize: "base",
      paperSize: "letter",
      primaryColor: "#000000",
      documentTitle: "Functional Resume",
    },
    basics: {
      fullName: "JANE MARIE DELA CRUZ",
      headline: "Full-Stack Software Engineer & Front-End Developer",
      location: "Quezon City, Metro Manila, Philippines",
      phone: "+63 917 123 4567",
      email: "janemdelacruz@gmail.com",
      website: "https://janedela-cruz.dev",
      linkedin: "linkedin.com/in/janemariedelacruz",
      github: "github.com/janedelacruz",
    },
    summary:
      "Dedicated and versatile Software Engineer with demonstrated expertise in front-end architecture, API integration, and responsive web design. Combines strong technical problem-solving with effective communication and teamwork skills to build high-quality digital solutions.",
    skills: [
      {
        id: generateId(),
        category: "Software Engineering & Architecture",
        skills: [
          "Experienced in building scalable single-page and server-rendered web applications with React, Next.js, and TypeScript.",
          "Solid understanding of relational database schema design with PostgreSQL and state management with Redux/Zustand.",
          "Adept at designing modular, reusable component libraries adhering to modern design systems.",
        ],
      },
      {
        id: generateId(),
        category: "Web & Front-End Development",
        skills: [
          "Strong mastery of HTML5, CSS3, JavaScript (ES6+), and responsive mobile-first layouts using Tailwind CSS.",
          "Proficient in optimizing Core Web Vitals, reducing bundle sizes, and ensuring cross-browser compatibility.",
          "Experience integrating RESTful APIs, third-party authentication, and client-side data validation.",
        ],
      },
      {
        id: generateId(),
        category: "Teamwork, Leadership & Communication",
        skills: [
          "Collaborated across cross-functional teams in agile sprint planning, daily standups, and peer code reviews.",
          "Experienced in presenting technical project demos and authoring clear documentation for end users.",
          "Demonstrated leadership guiding student groups through software capstone and research milestones.",
        ],
      },
    ],
    education: [
      {
        id: generateId(),
        institution: "University of the Philippines – Diliman",
        degree: "Bachelor of Science in Computer Science",
        startDate: "2020",
        endDate: "2024",
        location: "Quezon City",
        gpa: "GWA: 1.25 (Dean's Lister)",
      },
      {
        id: generateId(),
        institution: "Quezon City Science High School",
        degree: "Senior High School (STEM Strand)",
        startDate: "2018",
        endDate: "2020",
        location: "Quezon City",
        gpa: "With Highest Honors",
      },
    ],
    experience: [
      {
        id: generateId(),
        company: "Nexus Tech Solutions",
        role: "Software Engineer Intern",
        startDate: "2023",
        endDate: "2024",
        current: false,
        bulletPoints: [
          "Built responsive UI features and conducted unit testing across core application routes.",
        ],
      },
      {
        id: generateId(),
        company: "University of the Philippines",
        role: "Student Technology Assistant",
        startDate: "2022",
        endDate: "2023",
        current: false,
        bulletPoints: [
          "Provided digital support, maintained campus web forms, and assisted in documentation.",
        ],
      },
    ],
    projects: [
      {
        id: generateId(),
        name: "CloudPulse – Developer Telemetry & Analytics Dashboard",
        startDate: "2023",
        endDate: "2024",
        bulletPoints: [
          "Developed an interactive telemetry dashboard with live WebSocket data streams.",
        ],
      },
    ],
    certifications: [
      {
        id: generateId(),
        name: "Meta Front-End Developer Professional Certificate",
        issuer: "Meta",
        date: "2023",
      },
      {
        id: generateId(),
        name: "Dean's Honor List",
        issuer: "UP Diliman",
        date: "2021 – 2023",
      },
      {
        id: generateId(),
        name: "Outstanding Academic Capstone Project",
        issuer: "UP Diliman",
        date: "2024",
      },
    ],
    references: [
      {
        id: generateId(),
        name: "Engr. Ricardo Morales",
        title: "Director of Engineering",
        company: "Nexus Tech Solutions",
        contact: "rmorales@nexustech.ph · +63 917 555 0192",
      },
    ],
  };
}

/**
 * Jane Marie Dela Cruz - Sample Combination Resume
 */
export function createCombinationSampleResume(): Resume {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    createdAt: now,
    updatedAt: now,
    settings: {
      templateId: "combination",
      fontFamily: "Times New Roman",
      fontSize: "base",
      paperSize: "letter",
      primaryColor: "#000000",
      documentTitle: "Combination Resume",
    },
    basics: {
      fullName: "JANE MARIE DELA CRUZ",
      headline: "Full-Stack Software Engineer",
      location: "Quezon City, Metro Manila, Philippines",
      phone: "+63 917 123 4567",
      email: "janemdelacruz@gmail.com",
      website: "https://janedela-cruz.dev",
      linkedin: "linkedin.com/in/janemariedelacruz",
      github: "github.com/janedelacruz",
    },
    summary:
      "Motivated and results-oriented Software Engineer offering a balanced combination of in-depth technical expertise and proven practical experience. Skilled in modern web technologies including TypeScript, Next.js, and Node.js, with demonstrated success contributing to production codebases and collaborating in agile teams.",
    skills: [
      {
        id: generateId(),
        category: "Technical & Development Competencies",
        skills: [
          "Proficient in TypeScript, JavaScript, Python, React, Next.js, Node.js, and Tailwind CSS.",
          "Hands-on experience architecting REST APIs, PostgreSQL databases, and Docker containerization.",
          "Strong focus on automated testing, code quality, and responsive UI/UX implementation.",
        ],
      },
      {
        id: generateId(),
        category: "Problem Solving & Systems Thinking",
        skills: [
          "Skilled at diagnosing performance bottlenecks and optimizing database query execution plans.",
          "Familiar with CI/CD deployment pipelines on AWS and GitHub Actions.",
          "Strong debugging skills across browser devtools and server-side logging.",
        ],
      },
      {
        id: generateId(),
        category: "Communication & Team Collaboration",
        skills: [
          "Effectively communicates technical concepts to both engineering peers and non-technical stakeholders.",
          "Active contributor in agile sprint rituals, retrospectives, and pair-programming sessions.",
          "Experienced in preparing concise technical specifications and user documentation.",
        ],
      },
    ],
    experience: [
      {
        id: generateId(),
        company: "Nexus Tech Solutions",
        role: "Software Engineer",
        startDate: "January 2023",
        endDate: "Present",
        current: true,
        bulletPoints: [
          "Engineered client-facing interfaces with React, TypeScript, and Tailwind CSS, improving load speed by 35%.",
          "Developed backend API endpoints using Node.js and PostgreSQL to support analytics dashboards.",
          "Participated in peer code reviews and sprint planning within a 10-person agile engineering team.",
        ],
      },
      {
        id: generateId(),
        company: "Vanguard Innovations",
        role: "Junior Web Developer",
        startDate: "June 2021",
        endDate: "December 2022",
        current: false,
        bulletPoints: [
          "Assisted in migrating legacy pages to modern Next.js architecture, improving mobile usability.",
          "Created automated unit test suites covering critical checkout and user onboarding workflows.",
          "Resolved bug tickets and improved UI consistency across multiple device viewports.",
        ],
      },
    ],
    education: [
      {
        id: generateId(),
        institution: "University of the Philippines – Diliman",
        degree: "Bachelor of Science in Computer Science",
        startDate: "2019",
        endDate: "2023",
        location: "Quezon City",
        gpa: "GWA: 1.25 (Dean's Lister)",
      },
      {
        id: generateId(),
        institution: "Quezon City Science High School",
        degree: "Senior High School (STEM Strand)",
        startDate: "2017",
        endDate: "2019",
        location: "Quezon City",
        gpa: "With Highest Honors",
      },
    ],
    projects: [
      {
        id: generateId(),
        name: "TaskForge – Agile Project Management Platform",
        startDate: "2022",
        endDate: "2023",
        bulletPoints: [
          "Built a collaborative task planning and project tracking workspace using React, Node.js, and PostgreSQL for over 5,000 active users.",
        ],
      },
    ],
    certifications: [
      {
        id: generateId(),
        name: "AWS Certified Solutions Architect – Associate",
        issuer: "Amazon Web Services",
        date: "2023",
      },
      {
        id: generateId(),
        name: "Meta Front-End Developer Professional Certificate",
        issuer: "Meta",
        date: "2022",
      },
      {
        id: generateId(),
        name: "Dean's Honor Award",
        issuer: "UP Diliman",
        date: "2023",
      },
    ],
    references: [
      {
        id: generateId(),
        name: "Engr. Ricardo Morales",
        title: "Director of Engineering",
        company: "Nexus Tech Solutions",
        contact: "rmorales@nexustech.ph · +63 917 555 0192",
      },
    ],
  };
}

/**
 * Jane Marie Dela Cruz - Sample Modern Sidebar Resume (with circular photo)
 */
export function createModernSidebarSampleResume(): Resume {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    createdAt: now,
    updatedAt: now,
    settings: {
      templateId: "modern-sidebar",
      fontFamily: "Arial",
      fontSize: "base",
      paperSize: "letter",
      primaryColor: "#111827",
      documentTitle: "Jane Marie Dela Cruz - Resume",
    },
    basics: {
      fullName: "Jane Marie Dela Cruz",
      headline: "Software Engineer & Front-End Developer",
      email: "janemdelacruz@gmail.com",
      phone: "+63 917 123 4567",
      location: "Diliman, Quezon City, Metro Manila",
      website: "https://janedela-cruz.dev",
      linkedin: "linkedin.com/in/janemariedelacruz",
      github: "github.com/janedelacruz",
    },
    summary:
      "A dedicated Software Engineer and BS Computer Science graduate seeking an impactful engineering role to apply modern web technologies and full-stack development skills. Experienced in building responsive web applications with TypeScript, React, and Next.js, optimizing database workflows, and collaborating in agile teams. Fast learner with strong analytical thinking and adaptability.",
    education: [
      {
        id: generateId(),
        institution: "University of the Philippines – Diliman",
        degree: "Bachelor of Science in Computer Science",
        startDate: "2020",
        endDate: "2024",
        location: "Quezon City, Metro Manila",
        gpa: "GWA: 1.25 (Dean's Lister)",
      },
      {
        id: generateId(),
        institution: "Quezon City National Science High School",
        degree: "Senior High School (STEM Strand)",
        startDate: "2018",
        endDate: "2020",
        location: "Quezon City",
        gpa: "WITH HIGHEST HONORS",
      },
      {
        id: generateId(),
        institution: "Quezon City Science High School",
        degree: "High School",
        startDate: "2014",
        endDate: "2018",
        location: "Quezon City",
        gpa: "WITH HONORS",
      },
      {
        id: generateId(),
        institution: "Diliman Preparatory School",
        degree: "Elementary",
        startDate: "2008",
        endDate: "2014",
        location: "Quezon City",
      },
    ],
    experience: [
      {
        id: generateId(),
        company: "Nexus Tech Solutions",
        role: "Software Engineer Intern",
        startDate: "2023",
        endDate: "2024",
        current: false,
        bulletPoints: [
          "Built responsive front-end components using React, Next.js, and Tailwind CSS.",
          "Collaborated with backend developers to integrate RESTful APIs and optimized state management.",
          "Assisted in code refactoring and writing automated component tests.",
        ],
      },
      {
        id: generateId(),
        company: "UP Diliman – Office of Student Affairs",
        role: "Student Web Developer",
        startDate: "2022",
        endDate: "2023",
        current: false,
        bulletPoints: [
          "Developed and maintained student portal web interfaces and notification services.",
          "Automated report generation workflows using Google Workspace APIs and spreadsheets.",
          "Assisted with basic office systems, record management, and digital inquiries.",
        ],
      },
    ],
    projects: [
      {
        id: generateId(),
        name: "CloudPulse – Cloud Infrastructure Monitoring Dashboard",
        startDate: "2024",
        bulletPoints: [
          "Real-time telemetry monitoring application with interactive metrics and alerts.",
        ],
      },
      {
        id: generateId(),
        name: "TaskForge – Collaborative Workflow Automation Platform",
        startDate: "2023",
        bulletPoints: [
          "Interactive Kanban board and automated task distribution system with live notifications.",
        ],
      },
      {
        id: generateId(),
        name: "E-Commerce Web Suite",
        startDate: "2023",
        bulletPoints: [
          "Developed full-featured academic web projects using HTML, CSS, JavaScript, React, and Node.js.",
        ],
      },
    ],
    skills: [
      {
        id: generateId(),
        category: "Soft Skills",
        skills: [
          "Problem Solving",
          "Critical Thinking",
          "Adaptability",
          "Team Collaboration",
          "Time Management",
          "Attention to Detail",
        ],
      },
      {
        id: generateId(),
        category: "Technical Skills",
        skills: [
          "HTML",
          "JavaScript",
          "CSS",
          "TypeScript",
          "React",
          "Next.js",
          "Responsive Web Design",
          "Tailwind CSS",
          "Figma",
          "Google Sheets / Microsoft Excel",
          "Git & GitHub",
        ],
      },
    ],
    certifications: [
      {
        id: generateId(),
        name: "Meta Front-End Developer Professional Certificate",
        issuer: "Meta",
        date: "2023",
      },
      {
        id: generateId(),
        name: "AWS Certified Cloud Practitioner",
        issuer: "Amazon Web Services",
        date: "2023",
      },
    ],
    references: [
      {
        id: generateId(),
        name: "Engr. Ricardo Morales",
        title: "Director of Engineering",
        company: "Nexus Tech Solutions",
        contact: "rmorales@nexustech.ph · +63 917 555 0192",
      },
    ],
  };
}

/**
 * Returns tailored sample data matching the selected template.
 */
export function getSampleResumeForTemplate(
  templateId: Resume["settings"]["templateId"]
): Resume {
  switch (templateId) {
    case "modern-sidebar":
      return createModernSidebarSampleResume();
    case "chronological":
      return createChronologicalSampleResume();
    case "functional":
      return createFunctionalSampleResume();
    case "combination":
      return createCombinationSampleResume();
    default:
      return createSampleResume({ settings: { templateId } as any });
  }
}
