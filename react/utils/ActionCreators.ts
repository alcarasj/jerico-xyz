import {
  VerifyImageStartAction,
  VerifyImageSuccessAction,
  VerifyImageFailureAction,
  VerifyImageAction,
  GetExhibitsStartAction,
  GetExhibitsSuccessAction,
  GetExhibitsFailureAction,
  GetExhibitsAction,
  SetCounterAction,
  SetImageAction,
  Exhibit,
  VERIFY_IMAGE_START,
  VERIFY_IMAGE_SUCCESS,
  VERIFY_IMAGE_FAILURE,
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
    .then((exhibits: Exhibit[]) => dispatch(getExhibitsSuccess(exhibits)))
    .catch(error => dispatch(getExhibitsFailure(error)));
};

const verifyImageStart = (): VerifyImageStartAction => ({ type: VERIFY_IMAGE_START });
const verifyImageFailure = (error: Error): VerifyImageFailureAction => ({ type: VERIFY_IMAGE_FAILURE, payload: error });
const verifyImageSuccess = (): VerifyImageSuccessAction => ({ type: VERIFY_IMAGE_SUCCESS });
export const verifyImage = (dispatch: (action: VerifyImageAction) => void): void => {
  dispatch(verifyImageStart());
  sendAPIRequest('/api/art')
    .then(() => verifyImageSuccess())
    .catch(error => verifyImageFailure(error))
};

export const setCounter = (newValue: number): SetCounterAction => ({ type: SET_COUNTER, payload: newValue });
export const setImage = (file: File): SetImageAction => ({ type: SET_IMAGE, payload: file });