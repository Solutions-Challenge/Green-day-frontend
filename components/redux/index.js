import imageReducer from './reducer/index'
import { combineReducers } from 'redux'

export const rootReducer = combineReducers({
    changeImage: imageReducer
})