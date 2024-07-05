import { GlobalState } from "../../interface";
import { type GlobalStateAction, GlobalStateActionTypeEnum } from "./action";
// 1. 设计state
const globalState: GlobalState = {
  token: "114514"
}

// 3. 写reducer
const global = (state: GlobalState = globalState, action: GlobalStateAction) => {
  switch (action.type) {
    case GlobalStateActionTypeEnum.SET_TOKEN:
      return { token: action.payload };
    case GlobalStateActionTypeEnum.CLEAR_TOKEN:
      return { token: "" };
    default:
      return state;
  }
  
}


export default global