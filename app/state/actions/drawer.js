import { SET_PORTAL_TYPE, RESET_PORTAL_TYPE } from "../constants";

export const setPortal = payload => {
  return {
    type: SET_PORTAL_TYPE,
    payload
  };
};

export const resetPortal = payload => {
  return {
    type: RESET_PORTAL_TYPE,
    payload
  };
};
