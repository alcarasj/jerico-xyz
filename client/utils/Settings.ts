import { AppState } from './Types';

export const LINKEDIN_URL = 'https://www.linkedin.com/in/jcalcaras';
export const GITHUB_URL = 'https://github.com/alcarasj';
export const EMAIL = 'jcalcaras@gmail.com';
export const STATIC_DIR = '../../../static/';
export const HOME_CARDS = [
  { 
    title: 'Software Engineering',
    description: 'I am a professional full-stack software engineer specialising in SaaS/PaaS/IaaS product development and dev-ops. I also hold a Master in Computer Science degree from Trinity College Dublin. ',
    linkTo: '/dev'
  },
  { 
    title: 'Graphic Design',
    description: 'I am an amateur graphic designer that specializes in marketable artwork. My creations have been used for event posters, tickets and business cards.',
    linkTo: ''
  },
  { 
    title: 'Music',
    description: 'One of my favourite hobbies is creating and listening to music. I am a self-taught amateur guitarist that can provide original music for your content.',
    linkTo: ''
  }
];
export const LIMIT = 5;
export const INITIAL_APP_STATE: AppState = {
  imageFileURL: '',
  isFetching: false,
  counter: 0,
  error: '',
  exhibits: []
};