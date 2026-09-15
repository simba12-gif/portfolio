export const SECTIONS = [
  { id: 'home', num: '01', name: 'Home', label: '01 — HOME' },
  { id: 'about', num: '02', name: 'About', label: '02 — ABOUT' },
  { id: 'skills', num: '03', name: 'Skills', label: '03 — SKILLS' },
  { id: 'work', num: '04', name: 'Work', label: '04 — WORK' },
  { id: 'contact', num: '05', name: 'Contact', label: '05 — CONTACT' },
]

export const SKILL_GROUPS = [
  {
    title: 'Programming',
    skills: ['Java', 'Python', 'JavaScript', 'SQL'],
  },
  {
    title: 'Web Development',
    skills: ['HTML', 'CSS', 'React.js', 'Tailwind CSS', 'Node.js', 'Express.js'],
  },
  {
    title: 'Databases',
    skills: ['MongoDB', 'MySQL', 'PostgreSQL'],
  },
  {
    title: 'Tools',
    skills: ['Git', 'GitHub', 'Docker', 'Postman', 'VS Code'],
  },
  {
    title: 'AI / Generative AI',
    skills: ['LLM Fundamentals', 'LangChain', 'LangGraph', 'Generative AI', 'Prompting'],
  },
]

export const PROJECTS = [
  {
    name: 'Auralis',
    kicker: 'GENERATIVE AI / FULL STACK',
    blurb:
      'AI-powered sales intelligence platform that analyzes customer conversations to surface objections, buyer personas, and sentiment — then generates adaptive, context-aware responses with a LangGraph multi-agent pipeline and RAG.',
    tech: [
      'React',
      'TypeScript',
      'FastAPI',
      'LangGraph',
      'LangChain',
      'Gemini',
      'RAG',
      'FAISS',
      'PostgreSQL',
      'Redis',
      'Docker',
      'WebSockets',
    ],
    live: 'https://auralis-client-five.vercel.app/',
    github: 'https://github.com/simba12-gif/auralisAI',
    image: '/projects/auralis.webp',
  },
  {
    name: 'DBLens',
    kicker: 'DEVELOPER TOOLING / DATA VIZ',
    blurb:
      'Interactive database visualization tool that turns SQL schemas into draggable, animated ER diagrams — with relationship mapping, PostgreSQL introspection, AI-powered schema queries, and 3D visualization.',
    tech: ['Next.js', 'TypeScript', 'Express', 'PostgreSQL', 'Three.js', 'Gemini AI'],
    live: null,
    github: 'https://github.com/simba12-gif/dblens',
    image: '/projects/dblens.webp',
  },
  {
    name: 'LeadForge',
    kicker: 'AI PRODUCT / MERN',
    blurb:
      'AI-powered lead generation platform that streamlines prospect discovery, lead management, and personalized outreach using intelligent filtering and OpenAI-powered content generation.',
    tech: ['MERN Stack', 'OpenAI API', 'Tailwind CSS'],
    live: 'https://leadforge-three-tau.vercel.app/',
    github: 'https://github.com/simba12-gif/LeadForge',
    image: '/projects/leadforge.webp',
  },
  {
    name: 'TrustFix',
    kicker: 'MARKETPLACE / FULL STACK',
    blurb:
      'Full-stack local service marketplace connecting customers and providers through role-based dashboards — booking, availability tracking, reviews, complaints, auth, and REST APIs.',
    tech: ['Flask', 'Python', 'MySQL', 'HTML', 'CSS', 'JavaScript'],
    live: 'https://trustfix-tiut.onrender.com/',
    github: 'https://github.com/simba12-gif/TrustFix',
    image: '/projects/trustfix.webp',
  },
]

// "Some numbers I'm proud of" (About section). LeetCode / GitHub figures are
// snapshots fetched 2026-09-13 — LeetCode blocks client-side CORS, so a static
// site can't refresh them live. Update occasionally:
//   LeetCode: https://leetcode.com/u/harshita404  ·  GitHub: github.com/simba12-gif
export const NUMBERS = [
  {
    value: '343',
    label: 'LeetCode problems solved',
    note: '153 easy · 164 medium · 26 hard',
  },
  {
    value: '10',
    label: 'GitHub repositories',
    note: 'public & shipping',
  },
  {
    value: String(PROJECTS.length).padStart(2, '0'),
    label: 'Projects built',
    note: 'full stack & generative AI',
  },
  {
    value: String(SKILL_GROUPS.flatMap((g) => g.skills).length),
    label: 'Technologies in the toolkit',
    note: 'from React to LangGraph',
  },
]

export const CONTACTS = [
  {
    label: 'Email',
    value: 'kakiharshita@gmail.com',
    href: 'mailto:kakiharshita@gmail.com',
    icon: 'mail',
    external: false,
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/kaki-harshita',
    href: 'https://linkedin.com/in/kaki-harshita',
    icon: 'linkedin',
    external: true,
  },
  {
    label: 'GitHub',
    value: 'github.com/simba12-gif',
    href: 'https://github.com/simba12-gif',
    icon: 'github',
    external: true,
  },
  {
    label: 'LeetCode',
    value: 'leetcode.com/u/harshita404',
    href: 'https://leetcode.com/u/harshita404',
    icon: 'leetcode',
    external: true,
  },
]
