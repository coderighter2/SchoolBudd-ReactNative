
import { combineReducers } from 'redux'
import { navReducer } from '../../navigations'
import auth from './auth'

const rootReducer = combineReducers({
  nav: navReducer,
  auth
})

export default rootReducer
