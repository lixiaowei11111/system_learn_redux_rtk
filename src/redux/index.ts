// reducer
import global from "./modules/global/reducer";
import counter from "./modules/counter/reducer";
// type
import { type RootState } from "./interface";
import { GlobalStateAction } from "./modules/global/action";
import { CounterAction } from "./modules/counter/action";

// enhancer
import { sayHiOnDispatch,includeMeaningOfLife } from "./enhancer";
// middleware
import { print1,print2,print3 } from "./middleware";
import { combineReducers, createStore,compose, applyMiddleware } from "redux";
// devtools
import { composeWithDevTools } from "@redux-devtools/extension";

type RootAction = GlobalStateAction | CounterAction;

function isGlobalStateAction (action: RootAction): action is GlobalStateAction {
  return 'global' in action;
}

function isCounterAction (action: RootAction): action is CounterAction {
  return 'counter' in action;
}
// 4.1 样板代码手动封装reducer
const rootReducer1 = (state: RootState, action: RootAction) => {
  return {
    global: isGlobalStateAction(action) ? global(state.global, action) : state.global,
    counter: isCounterAction(action) ? counter(state.counter, action) : state.counter
  }
}
// 4.2 使用redux提供的combineReducers函数来组合reducer

const rootReducer2 = combineReducers({
  global,
  counter,
})

// const composedEnhancers=compose(includeMeaningOfLife,sayHiOnDispatch)
const middlewareEnhancers=applyMiddleware(print1,print2,print3)

const composedEnhancers=composeWithDevTools({
  //增加options
})

// 使用createStore来创建store
const store = createStore(rootReducer2, undefined, composedEnhancers(middlewareEnhancers));
// createStore第二个参数接受一个初始值做参数

export default store