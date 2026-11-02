export const profile = {
  name: "Yashkumar Rank",
  initials: "YR",
  role: "Senior Software Developer",
  tagline: "Full-Stack, Mobile & Cloud Systems",
  location: "Surat, India",
  coords: "21.17°N 72.83°E",
  email: "yashsojitra0@gmail.com",
  phone: "+91 88669 90844",
  resume:
    "https://drive.google.com/file/d/1SwngkCdYYs2KOKP-0vil1qLNVqjBjKR3/view?usp=sharing",
  socials: {
    github: "https://github.com/yash1001-sojitra",
    linkedin: "https://www.linkedin.com/in/yashkumar-rank/",
    medium: "https://medium.com/@yashsojitra0",
  },
  about:
    "Senior Software Developer with 4 years of experience building robust mobile, web, and backend applications using Flutter, Dart, Node.js, and Firebase. Proven leader with hands-on experience architecting scalable systems and leading a 15-member engineering team across mobile, web, and backend projects, from technical design through production deployment. Google Cloud Certified (Associate Cloud Engineer & Professional Cloud Architect), with practical experience across Cloud Run, GKE, Cloud Build, and CI/CD automation. Skilled in clean architecture, rigorous code review, and performance optimization in fast-paced product environments.",
};

export const roles = [
  "Flutter apps at scale",
  "cloud-native backends",
  "agentic AI systems",
  "teams that ship",
];

export const stats = [
  { value: 4, suffix: "+", label: "Years shipping" },
  { value: 25, suffix: "+", label: "Apps released" },
  { value: 1, suffix: "M+", label: "Downloads" },
  { value: 15, suffix: "", label: "Engineers led" },
];

export const skillGroups = [
  {
    id: "mobile",
    name: "Mobile",
    items: ["Flutter", "Dart", "Android (Kotlin)", "iOS (Swift)", "BLoC & Provider"],
  },
  {
    id: "web",
    name: "Web",
    items: ["Node.js", "Nuxt.js", "Vue.js", "TypeScript / JavaScript", "REST & GraphQL"],
  },
  {
    id: "cloud",
    name: "Cloud & DevOps",
    items: [
      "Google Cloud Platform",
      "Cloud Run & GKE",
      "Cloud Build & CI/CD",
      "Terraform & Docker",
      "Microservices Architecture",
    ],
  },
  {
    id: "ai",
    name: "AI & Agents",
    items: [
      "Google ADK & Gemini Flash",
      "Model Context Protocol (MCP)",
      "LLM APIs & Prompt Engineering",
      "Retrieval-Augmented Generation",
      "Vector Search",
    ],
  },
  {
    id: "data",
    name: "Data & Backend",
    items: ["Firebase & Firestore", "PostgreSQL", "MongoDB", "Redis", "MySQL"],
  },
  {
    id: "tools",
    name: "Tools",
    items: [
      "Git & GitHub",
      "Postman",
      "VS Code & Android Studio",
      "JIRA & Agile/Scrum",
      "Linux & Shell Scripting",
    ],
  },
];

export const experience = [
  {
    company: "Aviato Consulting",
    role: "Senior Software Developer · Team Lead",
    period: "Mar 2024 — Present",
    current: true,
    points: [
      "Led a 15-member engineering team delivering mobile, web, and backend projects from architecture through deployment.",
      "Architected and delivered Flutter apps and Nuxt.js web portals integrated with Firebase, Node.js, and Google Cloud Platform.",
      "Designed cloud-native architectures on GCP using Cloud Run, GKE, and automated Cloud Build CI/CD pipelines.",
      "Standardized development workflows across the team through clean architecture patterns, rigorous code review, and automated testing.",
      "Mentored 15 engineers across Flutter, backend, and cloud domains, driving measurable improvements in sprint velocity and delivery.",
    ],
  },
  {
    company: "Aim2Excel",
    role: "Full Stack Mobile Developer",
    period: "Feb 2023 — Mar 2024",
    current: false,
    points: [
      "Delivered 25+ mobile apps across App Store and Google Play using Flutter, Dart, Firebase, and RESTful APIs, with flagship apps exceeding 1M+ downloads.",
      "Designed scalable state management using BLoC and Provider patterns, reducing codebase complexity and boosting screen load speeds.",
      "Implemented CI/CD pipelines automating build, test, and deployment workflows to Google Play Console and Apple App Store Connect.",
      "Integrated third-party SDKs, payment gateways, offline caching, and deep linking across production applications.",
    ],
  },
];

export type ProjectKind = "AI" | "Web" | "Mobile" | "Desktop";

export type Project = {
  title: string;
  /** two-letter monogram shown in the project badge */
  mark: string;
  description: string;
  kind: ProjectKind;
  url?: string;
  urlLabel?: string;
};

export const projects: Project[] = [
  {
    title: "NevamCX",
    mark: "NX",
    description: "AI-powered customer feedback & experience management platform",
    kind: "AI",
    url: "https://www.nevamcx.com/",
  },
  {
    title: "SearchOnMac",
    mark: "SM",
    description:
      "Native macOS search for files, apps, windows, tabs, clipboard, Mail and Calendar, matched by on-device AI",
    kind: "Desktop",
    url: "https://www.searchonmac.com/",
  },
  {
    title: "TrueLaunch",
    mark: "TL",
    description: "Launch board where app & game developers list projects and get structured feedback from real users",
    kind: "Web",
    url: "https://truelaunch.vascario.com/",
  },
  {
    title: "FireDraw",
    mark: "FD",
    description: "Browser-based Firestore visualizer to model collections, documents, subcollections and relationships",
    kind: "Web",
    url: "https://firedraw.dezoko.com/",
  },
  {
    title: "VASCARIO",
    mark: "VA",
    description: "Luxury streetwear brand from India, crafted for modern minimalists",
    kind: "Web",
    url: "https://vascario.com/",
  },
  {
    title: "AI Proposal Agent",
    mark: "AP",
    description: "Autonomous RFP & proposal generation agent with a RAG pipeline",
    kind: "AI",
    url: "https://spectrum-frontend-prod-graqjg6dna-ww.a.run.app",
  },
  {
    title: "School Analytics",
    mark: "SA",
    description: "AI-powered school analytics & performance intelligence platform",
    kind: "AI",
  },
  {
    title: "Liora Gyne",
    mark: "LG",
    description: "Clinic appointment management for doctors, gynecologists and hospital front desks",
    kind: "Mobile",
    url: "https://play.google.com/store/apps/details?id=com.liora.liora_doc",
    urlLabel: "Google Play",
  },
  {
    title: "4Billd Site Management",
    mark: "4B",
    description: "Project management & billing for contractors, civil engineers and site managers",
    kind: "Mobile",
    url: "https://play.google.com/store/apps/details?id=com.construction.fourbilld",
    urlLabel: "Google Play",
  },
];

export const studio = {
  name: "IYGroup Studio",
  tagline: "Software with a little more soul.",
  site: "https://iygroup.vascario.com/",
  playStore: "https://play.google.com/store/apps/dev?id=6452932018235854108",
  appStore: "https://apps.apple.com/us/developer/yashkumar-rank/id6810045831",
};

export type StudioApp = {
  title: string;
  mark: string;
  kind: "Game" | "App";
  description: string;
  play?: string;
  appStore?: string;
  page?: string;
};

const iy = (slug: string) => `${studio.site}apps/${slug}`;
const play = (id: string) => `https://play.google.com/store/apps/details?id=${id}`;

export const studioApps: StudioApp[] = [
  {
    title: "MindiCot",
    mark: "MC",
    kind: "Game",
    description: "India's beloved trick-taking card game (Mendicot / Mindi Kot)",
    play: play("com.iycreateapp.mindicot"),
    appStore: "https://apps.apple.com/us/app/mindicot/id6811308838",
    page: iy("mindicot"),
  },
  {
    title: "Number Merge : Cascade",
    mark: "NM",
    kind: "Game",
    description: "Relaxing yet addictive number puzzle",
    play: play("com.iycreateapp.numbermerge"),
    appStore: "https://apps.apple.com/app/number-merge-cascade/id6811371832",
    page: iy("number-merge"),
  },
  {
    title: "Arrow Path: Escape Maze",
    mark: "AR",
    kind: "Game",
    description: "Relaxing but challenging spatial logic puzzle",
    play: play("com.iygroup.arrowescape"),
    appStore: "https://apps.apple.com/app/arrow-path-escape-maze/id6817024079",
    page: iy("arrow-path"),
  },
  {
    title: "Orbit Guardian",
    mark: "OG",
    kind: "Game",
    description: "Fast-paced arcade planetary defense",
    appStore: "https://apps.apple.com/app/orbit-guardian/id6812650615",
    page: iy("orbit-guardian"),
  },
  {
    title: "MORPH : WORLD",
    mark: "MW",
    kind: "Game",
    description: "Minimalist puzzle: rotate your viewpoint to turn optical illusions into paths",
    play: play("com.iygroup.morph"),
    page: iy("morph"),
  },
  {
    title: "Tug of Territory",
    mark: "TT",
    kind: "Game",
    description: "Fast-paced 4-player arena battles",
    play: play("com.iygroup.tugofterritory"),
    page: iy("tug-of-territory"),
  },
  {
    title: "Crore Quiz Champion",
    mark: "CQ",
    kind: "Game",
    description: "Take the hot seat in a bilingual general-knowledge quiz",
    play: play("com.iygroup.kbc"),
    page: iy("kbc"),
  },
  {
    title: "Cric Beats",
    mark: "CB",
    kind: "App",
    description: "Live cricket scores & ball-by-ball commentary for every fan",
    play: play("com.iycreateapp.cricbeats"),
    page: iy("cric-beats"),
  },
  {
    title: "Utility Hub",
    mark: "UH",
    kind: "App",
    description: "QR scanner, PDF merger & reader, calculator and unit converter in one",
    play: play("com.utillity.utillity_hub"),
    page: iy("utility-hub"),
  },
  {
    title: "ZapCash Survey Rewards",
    mark: "ZC",
    kind: "App",
    description: "Short personalized opinion surveys that unlock rewards",
    play: play("com.nxStudio.opinionRewards.paidSurvey"),
    page: iy("zapcash-survey"),
  },
  {
    title: "Captcha Typing Online Job",
    mark: "CT",
    kind: "App",
    description: "Captcha challenges that build typing precision and earn bonuses",
    play: play("typingjobwork.captchasolve.onlineJob"),
    page: iy("captcha-typing"),
  },
  {
    title: "ClgBuddy",
    mark: "CL",
    kind: "App",
    description: "Campus social network & academic collaboration",
    play: play("com.iycreateapp.clgbuddy"),
  },
  {
    title: "MY Hostel",
    mark: "MH",
    kind: "App",
    description: "Hostel administration & resident management",
    play: play("com.iycreateapp.myhostel"),
  },
];

export const posts = [
  {
    topic: "Flutter · Android Native · Play Services",
    title: "Integrating Phone Number Hint in Flutter with Android Native Code",
    description:
      "Retrieving user phone numbers seamlessly using Google Play Services Identity and native Android platform channels in Flutter.",
    url: "https://medium.com/@yashsojitra0/integrating-phone-number-hint-in-flutter-with-android-native-code-b35889f39111",
  },
  {
    topic: "Flutter · Shorebird · Code Push",
    title: "Shorebird: The Developer’s Unexpected Wingman",
    description:
      "Over-the-air code push for Flutter apps: ship fixes directly to users without waiting for store review.",
    url: "https://medium.com/@yashsojitra0/shorebird-the-developers-unexpected-wingman-11036a5bc945",
  },
  {
    topic: "Firebase · Firestore · Data Modeling",
    title: "Using Firestore References to Avoid Redundancy: A Complete Guide",
    description:
      "Normalizing relational data in Cloud Firestore with DocumentReferences to keep NoSQL schemas lean and scalable.",
    url: "https://medium.com/@yashsojitra0/using-firestore-references-to-avoid-redundancy-a-complete-guide-ce6ce3f24423",
  },
];

export const education = [
  {
    period: "2023 — 2025",
    title: "M.Tech, Computer Science & Engineering",
    school: "Parul University",
    note: "Advanced software architecture, distributed cloud systems and intelligent systems.",
  },
  {
    period: "2019 — 2023",
    title: "B.E., Computer Science & Engineering",
    school: "Government College of Engineering, Bhavnagar",
    note: "Graduated with a CGPA of 8.0.",
  },
  {
    period: "2017 — 2019",
    title: "HSC, Science (GSHEB)",
    school: "Aashadeep Science Bhavan, Surat",
    note: "94.02 percentile rank.",
  },
  {
    period: "2015 — 2017",
    title: "SSC (GSEB)",
    school: "Baldha D.V.P Madhyamik Shala, Surat",
    note: "96 percentile rank.",
  },
];

export const certificates = [
  { src: "/certificates/google_cloud_associate.png", title: "Google Cloud — Associate Cloud Engineer" },
  { src: "/certificates/google_architech_udemy.jpg", title: "Udemy — GCP Professional Cloud Architect course" },
  ...["-1", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"].map(
    (n, i) => ({ src: `/certificates/certi${n}.png`, title: `Certificate ${String(i + 3).padStart(2, "0")}` }),
  ),
];

export const quote = {
  text: "Strive not to be a success, but rather to be of value.",
  author: "Albert Einstein",
};
