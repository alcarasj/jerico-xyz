import { AppState } from './Types';

export const LINKEDIN_URL = 'https://www.linkedin.com/in/jcalcaras';
export const GITHUB_URL = 'https://github.com/alcarasj';
export const EMAIL = 'jcalcaras@gmail.com';
export const STATIC_DIR = '../../../static/';
export const HOME_CARDS = [
  { 
    title: 'Computer Science',
    description: 'My primary area of interest and profession. I specialize in various disciplines such as data visualization, distributed systems and computer vision, and also hold a Master in Computer Science degree from Trinity College Dublin.'
  },
  { 
    title: 'Graphic Design',
    description: 'I am an amateur graphic designer that specializes in marketable artwork. My creations have been used for event posters, tickets and business cards.'
  },
  { 
    title: 'Music',
    description: 'One of my favourite hobbies is creating and listening to music. I am a self-taught guitarist that can provide original music for your content.'
  }
];
export const LIMIT = 5;
export const INITIAL_APP_STATE: AppState = {
  imageFileURL: '',
  isVerifying: false,
  isFetching: false,
  counter: 0,
  error: '',
  exhibits: []
}; 