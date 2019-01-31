import { SET_PORTAL_TYPE, RESET_PORTAL_TYPE } from "../constants";

const initialState = {
  drawerType: null,
  drawer: {},
  config: {}
};

export const DrawerReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PORTAL_TYPE:
      return {
        ...state,
        drawerType: action.payload.portalType
      };
    case RESET_PORTAL_TYPE:
      return {
        ...state,
        drawerType: null
      };
    default:
      return state;
  }
};
