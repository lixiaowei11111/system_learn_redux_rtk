// import { GlobalState } from "../../interface";
// import { type GlobalStateAction, GlobalStateActionTypeEnum } from "./action";
// // 1. 设计state
// const globalState: GlobalState = {
//   token: "114514"
// }

// // 3. 写reducer
// const global = (state: GlobalState = globalState, action: GlobalStateAction) => {
//   switch (action.type) {
//     case GlobalStateActionTypeEnum.SET_TOKEN:
//       return { token: action.payload };
//     case GlobalStateActionTypeEnum.CLEAR_TOKEN:
//       return { token: "" };
//     default:
//       return state;
//   }

// }


// export default global

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../index";
import { GlobalState } from "../../interface";

const globalState: GlobalState = {
  token: "114514"
}

export enum GlobalStateActionTypeEnum {
  SET_TOKEN = "setToken",//设置Token
  CLEAR_TOKEN = "clearToken",//清空Token
}

const globalSlice = createSlice({
  name: "global",
  initialState: globalState,
  reducers: {
    [GlobalStateActionTypeEnum.SET_TOKEN]: (state, action: PayloadAction<string>) => {
      state.token = action.payload
    },
    [GlobalStateActionTypeEnum.CLEAR_TOKEN]: (state) => {
      state.token = ""
    },
  }
})

export const selectGlobalToken=(state:RootState)=>state.global.token

export const {setToken,clearToken}=globalSlice.actions
export default globalSlice.reducer