import { atLimit } from './Helpers';
import { 
  AppState, 
  AppAction,
  VERIFY_IMAGE_START,
  VERIFY_IMAGE_SUCCESS,
  VERIFY_IMAGE_FAILURE,
  GET_EXHIBITS_SUCCESS,
  GET_EXHIBITS_FAILURE,
  GET_EXHIBITS_START,
  SET_IMAGE,
  SET_COUNTER
} from './Types';
import { INITIAL_APP_STATE } from './Settings';

const AppReducer = (state: AppState=INITIAL_APP_STATE, action: AppAction): AppState => {
  switch (action.type) {
  case VERIFY_IMAGE_START:
    return { ...state, isVerifying: true  };
  case VERIFY_IMAGE_SUCCESS:
    return { ...state, isVerifying: false };
  case VERIFY_IMAGE_FAILURE:
    return { ...state, isVerifying: false };
  case GET_EXHIBITS_START:
    return { ...state, isFetching: true };
  case GET_EXHIBITS_SUCCESS:
    return { ...state, isFetching: false, exhibits: action.payload };
  case GET_EXHIBITS_FAILURE:
    return { ...state, isFetching: false };
  case SET_COUNTER:
    return { ...state, counter: atLimit(state.counter) ? state.counter : action.payload }
  case SET_IMAGE:
    return { ...state, imageFileURL: URL.createObjectURL(action.payload) };
  default:
    return { ...state };
  }
};

export default AppReducer;