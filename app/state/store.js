
import { createStore, applyMiddleware } from 'redux'
import app from './reducers'

export default function configureStore(middleware) {
  let store = createStore(app, applyMiddleware(middleware))
  return store
}
