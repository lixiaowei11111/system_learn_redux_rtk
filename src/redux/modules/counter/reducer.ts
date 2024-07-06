import { type CounterState } from "../../interface";
import { CounterActionTypeEnum, type CounterAction } from "./action";

// 1.设计state
const counterState: CounterState = {
  count: 114514,
}

// 3. 设计reducer 纯函数 (state,action) => newState
const counter = (state: CounterState = counterState, action: CounterAction) => {
  switch (action.type) {
    case CounterActionTypeEnum.INCREMENT:
      return { count: state.count + action.payload };
    case CounterActionTypeEnum.DECREMENT:
      return { count: state.count - action.payload };
    default:
      return counterState;
  }
  
}



export default counter

