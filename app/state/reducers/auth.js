import { LOGIN_SUCCESS, LOGOUT_SUCCESS, SET_PORTAL_TYPE } from '../constants'
const initialState = {
  isLoggedIn: false,
  portalType: ''
}

export default function dataReducer (state = initialState, action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoggedIn: true
      }
    case LOGOUT_SUCCESS:
      return {
        ...state,
        isLoggedIn: false
      }
    case SET_PORTAL_TYPE:
      return {
        ...state,
        portalType: action.payload
      }
    default:
      return state
  }
}