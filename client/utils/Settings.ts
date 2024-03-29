import { Tag } from './Types';

export const LINKEDIN_URL = 'https://www.linkedin.com/in/jcalcaras';
export const GITHUB_URL = 'https://github.com/alcarasj';
export const EMAIL = 'jcalcaras@gmail.com';
export const STATIC_DIR = '../../../static/';
export const HOME_CARDS = [
  { 
    title: 'Software Engineering',
    description: 'I\'m a professional full-stack software engineer specializing in SaaS/PaaS/IaaS product development and dev-ops. I also graduated with a Master in Computer Science degree from Trinity College Dublin in 2019.',
    linkTo: '/dev'
  },
  { 
    title: 'Web Design',
    description: 'I\'m an amateur web designer specializing in SaaS/PaaS/IaaS UI/UX design. I can also provide simple graphics for digital content such as event banners and album art.',
    linkTo: ''
  },
  { 
    title: 'Music',
    description: 'One of my favourite hobbies is creating and listening to music. I\'m a self-taught amateur guitarist that can provide original music for your content.',
    linkTo: ''
  }
];
export const DEV_XP_CARDS = [
  {
    from: { month: 4, year: 2022 },
    employer: "Microsoft",
    description: "Working as part of the Azure Attestation team using .NET.",
    tags: [Tag.CSHARP, Tag.CPP, Tag.SQL, Tag.NOSQL]
  },
  {
    from: { month: 1, year: 2020 },
    to: { month: 4, year: 2022 },
    employer: "IBM",
    description: "Worked as part of the UI and Identity teams in the Cloud IAM organization using J2EE/React/Express/Gin/Cloudant.",
    tags: [Tag.JAVA, Tag.TYPESCRIPT, Tag.JAVASCRIPT, Tag.REACT, Tag.SASS, Tag.GO, Tag.NOSQL],
  },
  {
    from: { month: 4, year: 2019 },
    to: { month: 5, year: 2020 },
    employer: "Applaud",
    description: "Full-stack development with React/Django/PostgreSQL from concept to production. Received the bronze award at the 2019 Irish National Startup Awards.",
    tags: [Tag.PYTHON, Tag.JAVASCRIPT, Tag.REACT, Tag.SQL]
  },
  {
    from: { month: 8, year: 2018 },
    to: { month: 4, year: 2019 },
    employer: "Keep Appy",
    description: "Full-stack development with React/React Native/Django/PostgreSQL.",
    tags: [Tag.PYTHON, Tag.JAVASCRIPT, Tag.REACT, Tag.SQL]
  },
  {
    from: { month: 11, year: 2017 },
    to: { month: 9, year: 2018 },
    employer: "Hosted Graphite",
    description: "Full-stack development with Django/MySQL.",
    tags: [Tag.PYTHON, Tag.JAVASCRIPT, Tag.HTML, Tag.SQL]
  }
];
export const EASTER_EGG_COUNTER_LIMIT = 5;
export const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];