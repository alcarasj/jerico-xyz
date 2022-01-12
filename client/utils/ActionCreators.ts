import {
  GetExhibitsStartAction,
  GetExhibitsSuccessAction,
  GetExhibitsFailureAction,
  GetExhibitsAction,
  SetCounterAction,
  SetImageAction,
  Exhibit,
  GET_EXHIBITS_SUCCESS,
  GET_EXHIBITS_START,
  GET_EXHIBITS_FAILURE,
  SET_COUNTER,
  SET_IMAGE
} from './Types';
import { sendAPIRequest } from './Helpers';

const getExhibitsStart = (): GetExhibitsStartAction => ({ type: GET_EXHIBITS_START });
const getExhibitsFailure = (error: Error): GetExhibitsFailureAction => ({ type: GET_EXHIBITS_FAILURE, payload: error });
const getExhibitsSuccess = (exhibits: Exhibit[]): GetExhibitsSuccessAction => ({ type: GET_EXHIBITS_SUCCESS, payload: exhibits });
export const getExhibits = (dispatch: (action: GetExhibitsAction) => void): void => {
  dispatch(getExhibitsStart());
  sendAPIRequest('/api/art')
    .then(data => dispatch(getExhibitsSuccess(data.exhibits)))
    .catch(error => dispatch(getExhibitsFailure(error)));
};

export const setCounter = (newValue: number): SetCounterAction => ({ type: SET_COUNTER, payload: newValue });
export const setImage = (file: File): SetImageAction => ({ type: SET_IMAGE, payload: file });