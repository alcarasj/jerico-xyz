export const GET_EXHIBITS_START = 'GET_EXHIBITS_START';
export const GET_EXHIBITS_SUCCESS = 'GET_EXHIBITS_SUCCESS';
export const GET_EXHIBITS_FAILURE = 'GET_EXHIBITS_FAILURE';
export const SET_COUNTER = 'SET_COUNTER';
export const SET_IMAGE = 'SET_IMAGE';

export interface Exhibit {
  name: string;
  description: string;
  dateCreated: string;
  collection: string;
  imageURL: string;
}

export interface AppState {
  imageFileURL: string;
  isFetching: boolean;
  counter: number;
  error: string;
  exhibits: Exhibit[];
}

export enum HttpMethod {
  GET = 'GET',
  POST=  'POST'
}

export interface GetExhibitsStartAction {
  readonly type: typeof GET_EXHIBITS_START;
}
export interface GetExhibitsSuccessAction {
  readonly type: typeof GET_EXHIBITS_SUCCESS;
  payload: Exhibit[];
}
export interface GetExhibitsFailureAction {
  readonly type: typeof GET_EXHIBITS_FAILURE;
  payload: Error;
}
export type GetExhibitsAction = GetExhibitsStartAction | GetExhibitsSuccessAction | GetExhibitsFailureAction;

export interface SetCounterAction {
  readonly type: typeof SET_COUNTER;
  payload: number;
}

export interface SetImageAction {
  readonly type: typeof SET_IMAGE;
  payload: File;
}

export type AppAction = GetExhibitsAction | SetCounterAction | SetImageAction;

export type MuiColor = "inherit" | "initial" | "primary" | "secondary" | "textPrimary" | "textSecondary" | "error";

export enum Tag {
  JAVA = "Java",
  NODE = "NodeJS",
  REACT = "React",
  PYTHON = "Python",
  SQL = "SQL",
  NOSQL = "NoSQL",
  JAVASCRIPT = "JavaScript",
  TYPESCRIPT = "TypeScript",
  SASS = "Sass",
  HTML = "HTML",
  GO = "Go"
}