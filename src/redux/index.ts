// reducer
import global from "./modules/global/reducer";
import counter from "./modules/counter/reducer";
import auth from './modules/auth/reducer'
// type
// import { type RootState as OldRootState } from "./interface";
// import { GlobalStateAction } from "./modules/global/action";
// import { CounterAction } from "./modules/counter/action";

// enhancer
// import { sayHiOnDispatch, includeMeaningOfLife } from "./enhancer";
// middleware
// import { print1, print2, print3, asyncFunctionMiddleware } from "./middleware";
// import { combineReducers, createStore, compose, applyMiddleware } from "redux";
// devtools
// import { composeWithDevTools } from "@redux-devtools/extension";
// redux-thunk 异步中间件
// import {thunk as thunkMiddleware} from 'redux-thunk'//^3.1.0

// configureSotre
import { configureStore } from "@reduxjs/toolkit";

// type RootAction = GlobalStateAction | CounterAction | (() => void);

// function isGlobalStateAction (action: RootAction): action is GlobalStateAction {
//   return 'global' in action;
// }

// function isCounterAction (action: RootAction): action is CounterAction {
//   return 'counter' in action;
// }
// // 4.1 样板代码手动封装reducer
// const rootReducer1 = (state: OldRootState, action: RootAction) => {
//   return {
//     global: isGlobalStateAction(action) ? global(state.global, action) : state.global,
//     counter: isCounterAction(action) ? counter(state.counter, action) : state.counter
//   }
// }
// 4.2 使用redux提供的combineReducers函数来组合reducer

// const rootReducer2 = combineReducers({
//   global,
//   counter,
// })

// // const composedEnhancers=compose(includeMeaningOfLife,sayHiOnDispatch)
// // const middlewareEnhancers = applyMiddleware(print1, print2, print3, asyncFunctionMiddleware)
// const middlewareEnhancers = applyMiddleware(print1, print2, print3, thunkMiddleware)

// const composedEnhancers = composeWithDevTools({
//   //增加options
// }) || compose

// 使用createStore来创建store
// const store = createStore(rootReducer2, undefined, composedEnhancers(middlewareEnhancers));
// createStore第二个参数接受一个初始值做参数

const store=configureStore({
  reducer:{
    global,
    counter,
    auth,
  }
})

export type RootState=ReturnType<typeof store.getState>
export type AppDispatch =typeof store.dispatch;

export default store