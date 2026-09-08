/**
 * ============================================================================
 *  EDIT THIS FILE ONLY.
 * ============================================================================
 *  Every piece of text on the site comes from here. You never need to touch
 *  the HTML, CSS, or JS to make changes.
 *
 *  Any section whose list is left empty hides itself automatically, and the
 *  remaining sections renumber themselves. So delete freely.
 * ============================================================================
 */

window.PORTFOLIO = {
  /* --------------------------------------------------------------------------
   * 1. IDENTITY
   * ------------------------------------------------------------------------*/
  identity: {
    name: "Johnnel Artiaga",
    kicker: "Information Technology Student",
    // Small uppercase label above the name in the hero.
    eyebrow: "Information Technology · Cebu, Philippines",
    // Static line under the name. Keep it one sentence.
    headline: "IT student building full-stack web experiences.",
    // These type themselves out one after another in the hero.
    roles: [
      "I learn by building.",
      "I ship full-stack web apps.",
      "I put every project on GitHub.",
    ],
    // Short hero paragraph. The longer story lives in `about`.
    lede:
      "I build, ship, and learn in public. The two pieces of work I want you to see first are Spotibai and Leaf & Bloom.",
    // The three words in the full-bleed strip under the hero. Keep them short.
    hook: ["Build", "Ship", "Learn"],
    // Honest and specific beats grand and vague. Recruiters read this line.
    summary:
      "I'm an Information Technology student who learns by building and shipping. My main projects so far are Spotibai, a self-hosted music streaming app with a Vite front end, an Express API, and SQLite storage, and Leaf & Bloom, an eight-page e-commerce storefront built without a framework. Alongside coursework in C# and Java, I put every project I build on GitHub.",
    location: "Cebu City, Philippines",
    availability: "Open to internships",
    // Local avatar. Swap this path any time you want a different photo.
    photo: "assets/me.jpg",
    // Add your CV as assets/cv.pdf and set this to "assets/cv.pdf" to show
    // a Download CV button in the hero.
    resume: "",
  },

  /* --------------------------------------------------------------------------
   * 2. CONTACT & SOCIAL LINKS
   * ------------------------------------------------------------------------*/
  contact: {
    email: "holloying20s@gmail.com",
    pitch:
      "I'm looking for an internship or an opportunity to work on real software. I read every message and reply quickly.",
    socials: [
      { label: "GitHub", url: "https://github.com/jjart05", icon: "github" },
      // Add your LinkedIn once you have one — it matters a lot for internships:
      // { label: "LinkedIn", url: "https://linkedin.com/in/[username]", icon: "linkedin" },
    ],
  },

  /* --------------------------------------------------------------------------
   * 3. SECTION HEADINGS
   *    Numbers are added automatically based on which sections are visible,
   *    so you never end up with a gap like "05" followed by "07".
   * ------------------------------------------------------------------------*/
  sections: {
    about: {
      label: "About",
      title: "I learn by building.",
    },
    work: {
      label: "Projects",
      title: "Selected work",
      sub: "My work speaks louder than my resume.",
    },
    skills: {
      label: "Toolkit",
      title: "What I build with",
      sub: "Languages and tools I've actually shipped something in.",
    },
    experience: {
      label: "Journey",
      title: "My journey",
      sub: "Coursework and self-directed work — the honest path so far.",
    },
    education: {
      label: "Education",
      title: "Studies",
      sub: "",
    },
    testimonials: {
      label: "Kind words",
      title: "What people I've worked with say",
      sub: "",
    },
    contact: {
      label: "Contact",
      title: "Let's build something.",
    },
  },

  /* --------------------------------------------------------------------------
   * 4. STATS
   *    Keep these true — anyone can check your GitHub in ten seconds.
   *    Update the repo count as you push more work.
   * ------------------------------------------------------------------------*/
  stats: [
    { value: 6, suffix: "", label: "Projects built" },
    { value: 4, suffix: "", label: "Languages I code in" },
    { value: 2, suffix: "", label: "Apps deployed live" },
    { value: 9, suffix: "+", label: "Public repositories" },
  ],

  /* --------------------------------------------------------------------------
   * 5. THE SCROLLING BANNER under the hero.
   * ------------------------------------------------------------------------*/
  marquee: [
    "C#", "Java", "JavaScript", "HTML5", "CSS3", "Node.js",
    "Express", "SQLite", "Vite", "Git", "Visual Studio", "VS Code",
  ],

  /* --------------------------------------------------------------------------
   * 6. WHAT I DO — numbered capabilities in the About section.
   * ------------------------------------------------------------------------*/
  services: [
    {
      icon: "layout",
      title: "Web Development",
      body:
        "Multi-page, responsive sites built from scratch with HTML, CSS, and JavaScript — no page builders. Leaf & Bloom is eight pages with a working cart and checkout flow.",
    },
    {
      icon: "server",
      title: "Application Development",
      body:
        "C# in Visual Studio for Applications Development coursework, and Java for programming fundamentals. Node and Express when a project needs a real back end and a database.",
    },
    {
      icon: "gauge",
      title: "Learning in Public",
      body:
        "Every lab and side project goes on GitHub with a README that explains how to run it. I'd rather show the work than describe it.",
    },
  ],

  /* --------------------------------------------------------------------------
   * 7. SKILLS
   *    Only list things you could answer a question about in an interview.
   * ------------------------------------------------------------------------*/
  skills: [
    { group: "Languages", items: ["C#", "Java", "JavaScript", "SQL"] },
    { group: "Frontend", items: ["HTML5", "CSS3", "Vite", "Vanilla JS"] },
    { group: "Backend", items: ["Node.js", "Express", "SQLite", "REST APIs"] },
    { group: "Tools", items: ["Git", "GitHub", "VS Code", "Visual Studio", "Docker"] },
  ],

  /* --------------------------------------------------------------------------
   * 8. PROJECTS
   *
   *    `featured: true` gives a project a full-width editorial showcase.
   *    `gallery` is the stacked card carousel — click the front card to
   *    send it to the back and reveal the next screen. `image` is the
   *    fallback if gallery is empty.
   *
   *    Screenshots live in assets/.
   * ------------------------------------------------------------------------*/
  projects: [
    {
      featured: true,
      title: "Spotibai",
      tagline: "A self-hosted music streaming app with a Spotify-inspired interface.",
      body:
        "You upload your own MP3s and cover art, and Spotibai turns them into a full library you can search, sort, and organise into playlists. I built it as an npm workspace monorepo: a Vite client, an Express API, and SQLite through Node's built-in sqlite module. The part I'm proudest of is the audio streaming — the server answers HTTP Range requests with 206 Partial Content, so seeking through a track is instant instead of re-downloading it.",
      tags: ["Full-stack"],
      stack: ["Vite", "Express", "SQLite", "Docker", "Vercel"],
      metrics: [
        { value: "13", label: "player features shipped" },
        { value: "MIT", label: "open-source licence" },
      ],
      year: "2026",
      links: [
        { label: "Live demo", url: "https://spotibaii-ten.vercel.app", type: "primary" },
        { label: "Source", url: "https://github.com/jjart05/spotibaii", type: "ghost" },
      ],
      image: "assets/spotibai-home.png",
      gallery: [
        { src: "assets/spotibai-home.png", label: "Home" },
        { src: "assets/spotibai-library.png", label: "Your Library" },
        { src: "assets/spotibai-upload.png", label: "Upload music" },
      ],
    },
    {
      featured: true,
      title: "Leaf & Bloom",
      tagline: "An e-commerce storefront for a botanical studio, built without a framework.",
      body:
        "Eight hand-built pages covering the whole shopping journey: catalogue with sorting, cart, checkout review, services, feedback, and an admin view. It taught me how much structure you need in plain CSS and JavaScript before a site this size stops fighting you — and how to keep a layout readable from phone to desktop.",
      tags: ["Frontend"],
      stack: ["HTML5", "CSS3", "JavaScript", "Vercel"],
      metrics: [
        { value: "8", label: "pages built by hand" },
        { value: "3", label: "breakpoints supported" },
      ],
      year: "2026",
      links: [
        { label: "Live site", url: "https://leafbloom.vercel.app", type: "primary" },
        { label: "Source", url: "https://github.com/jjart05/leafandbloom_v4", type: "ghost" },
      ],
      image: "assets/leaf-home.png",
      gallery: [
        { src: "assets/leaf-home.png", label: "Home" },
        { src: "assets/leaf-shop.png", label: "Shop" },
        { src: "assets/leaf-about.png", label: "About" },
        { src: "assets/leaf-contact.png", label: "Contact" },
        { src: "assets/leaf-feedback.png", label: "Feedback" },
      ],
    },
    {
      title: "C# Applications Development Labs",
      tagline: "Coursework for CC-APPSDEV22, from first console app to advanced exercises.",
      body:
        "A running record of my Applications Development subject — weekly labs in C# covering language fundamentals through to the advanced exercises. Each lab is its own repository so I can see how my code has changed over the term.",
      tags: ["Coursework"],
      stack: ["C#", ".NET", "Visual Studio"],
      metrics: [],
      year: "2026",
      links: [
        { label: "Advanced C# lab", url: "https://github.com/jjart05/CC-APPSDEV22-2026-ARTIAGA-AdvancedCSharpLab", type: "ghost" },
        { label: "All repositories", url: "https://github.com/jjart05?tab=repositories", type: "ghost" },
      ],
      image: "",
    },
    {
      title: "Journal Entry",
      tagline: "A double-entry accounting tool that checks your debits against your credits.",
      body:
        "Built for an accounting subject: you record journal entries in the browser and it keeps the ledger balanced. Small project, but it's where the connection between a data model and the interface on top of it finally clicked for me.",
      tags: ["Frontend"],
      stack: ["JavaScript", "HTML5", "CSS3"],
      metrics: [],
      year: "2026",
      links: [
        { label: "Source", url: "https://github.com/jjart05/Journal-Entry", type: "ghost" },
      ],
      image: "",
    },
    {
      title: "SimpleCalc",
      tagline: "A calculator in Java — my first real program.",
      body:
        "Worth keeping because it's the honest starting point. Plain Java, no libraries, working through operator handling and input validation for the first time.",
      tags: ["Coursework"],
      stack: ["Java"],
      metrics: [],
      year: "2025",
      links: [
        { label: "Source", url: "https://github.com/jjart05/SimpleCalc", type: "ghost" },
      ],
      image: "",
    },
  ],

  /* --------------------------------------------------------------------------
   * 9. LEARNING JOURNEY
   *    You don't have job history yet, so this timeline covers coursework and
   *    self-directed work instead. Replace an entry with a real internship the
   *    moment you land one — that takes priority over everything here.
   *    Listed oldest-first so the page reads as a story while you scroll.
   * ------------------------------------------------------------------------*/
  experience: [
    {
      year: "2025",
      role: "Web development foundations",
      company: "Coursework & personal projects",
      period: "2025 — 2026",
      location: "University of Cebu",
      bullets: [
        "Built Leaf & Bloom, an eight-page responsive storefront, in plain HTML, CSS, and JavaScript.",
        "Wrote the Journal Entry accounting tool, connecting a debit-and-credit data model to a working interface.",
        "Started with SimpleCalc in Java and learned the fundamentals of program flow and input validation.",
      ],
      stack: ["HTML5", "CSS3", "JavaScript", "Java"],
    },
    {
      year: "2026",
      role: "Applications Development",
      company: "CC-APPSDEV22 coursework",
      period: "2026 — Present",
      location: "University of Cebu",
      bullets: [
        "Working through weekly C# labs in Visual Studio, from console basics to the advanced exercises.",
        "Pushing every lab to its own GitHub repository so my progress across the term is visible.",
        "Learning object-oriented structure properly: classes, inheritance, and where each belongs.",
      ],
      stack: ["C#", ".NET", "Visual Studio", "Git"],
    },
    {
      year: "2026",
      role: "Self-directed full-stack projects",
      company: "Personal work",
      period: "2026",
      location: "Remote",
      bullets: [
        "Built and deployed Spotibai, a music streaming app with a Vite client, Express API, and SQLite database.",
        "Implemented HTTP Range streaming so audio seeking works without re-downloading the file.",
        "Set up deployment configs for Vercel, Fly.io, Netlify, and Docker to learn how hosting actually differs.",
      ],
      stack: ["Node.js", "Express", "SQLite", "Vite", "Docker"],
    },
  ],

  /* --------------------------------------------------------------------------
   * 10. EDUCATION
   * ------------------------------------------------------------------------*/
  education: [
    {
      title: "BS Information Technology",
      org: "University of Cebu",
      period: "2024 — 2028",
      detail:
        "4th year · Currently studying",
    },
    // Add certifications as you earn them — free ones count and look good:
    // { title: "Cisco Networking Basics", org: "Cisco Networking Academy", period: "2026", detail: "" },
  ],

  /* --------------------------------------------------------------------------
   * 11. TESTIMONIALS
   *     Left empty on purpose, so this section is hidden. Never invent these.
   *     When an instructor or teammate says something good about your work,
   *     ask if you can quote them, then add it here:
   *     { quote: "...", author: "Their Name", title: "Instructor, Your School" }
   * ------------------------------------------------------------------------*/
  testimonials: [],

  /* --------------------------------------------------------------------------
   * 12. SITE SETTINGS
   * ------------------------------------------------------------------------*/
  settings: {
    defaultTheme: "dark",
    animatedBackground: true,
    siteUrl: "https://jjart05.github.io/portfolio",
    seoTitle: "Johnnel Artiaga — IT Student & Developer",
    seoDescription:
      "IT student in Cebu building full-stack web apps. Selected work includes Spotibai, a self-hosted music player, and Leaf & Bloom, a hand-built storefront.",
  },
};
