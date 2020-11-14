export const VERIFY_IMAGE_START = 'VERIFY_IMAGE_START';
export const VERIFY_IMAGE_SUCCESS = 'VERIFY_IMAGE_SUCCESS';
export const VERIFY_IMAGE_FAILURE = 'VERIFY_IMAGE_FAILURE';
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
  isVerifying: boolean;
  isFetching: boolean;
  counter: number;
  error: string;
  exhibits: Exhibit[];
}

export interface VerifyImageStartAction {
  readonly type: typeof VERIFY_IMAGE_START;
}
export interface VerifyImageSuccessAction {
  readonly type: typeof VERIFY_IMAGE_SUCCESS;
}
export interface VerifyImageFailureAction {
  readonly type: typeof VERIFY_IMAGE_FAILURE;
  payload: Error;
}
export type VerifyImageAction = VerifyImageStartAction | VerifyImageSuccessAction | VerifyImageFailureAction;

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

export type AppAction = VerifyImageStartAction | VerifyImageFailureAction | VerifyImageSuccessAction |
  GetExhibitsStartAction | GetExhibitsSuccessAction | GetExhibitsFailureAction | SetCounterAction | 
  SetImageAction;