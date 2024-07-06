// 使用`rtk`的createSlice,来创建reducer和action creator
import { createSlice } from "@reduxjs/toolkit";
import { AuthState } from "../../interface";

const authState: AuthState = {
  roleCode: [1, 1, 4, 5, 1, 4]
}

const enum AuthActionTypeEnum {
  ADD_CODE = "addCode",
  DELETE_CODE = "deleteCode",
  UNIQUE_CODE = "uniqueCode"
}

const authSlice = createSlice({
  name: "auth",
  initialState: authState,
  reducers: {
    [AuthActionTypeEnum.ADD_CODE]: (state, action) => {
      // 在 createSlice 内部，这种“变异”代码是可以接受的，因为 Redux Toolkit 使用了 Immer 库来处理状态的不可变性更新。这意味着你可以直接修改状态对象，而不需要手动创建其副本。
      state.roleCode.push(action.payload)
    },
    [AuthActionTypeEnum.DELETE_CODE]: (state, action) => {
      state.roleCode = state.roleCode.filter(item => item !== action.payload)
    },
    [AuthActionTypeEnum.UNIQUE_CODE]: {
      reducer: (state, action) => {
        console.log('[debug]in reducer函数 prepare函数可以处理改变reducer case中获取的action',)
        state.roleCode.push(action.payload.time)
      },
      prepare: (time: number, text: string) => {
        console.log("在调用 对应 的action createor时,就会调用prepare函数,并获得对应的参数", 'time=', time, 'text=', text)
        return {
          payload: {
            time: generateUniqueId(time)
            ,
            text: text + "mutate"
          },
          meta: null,
          error: false,
        }
      }
    }
  }
})

function generateUniqueId (time: number) {
  return time.toString(36) + Math.random().toString(36).substr(2, 5);
}

export const { addCode, deleteCode,uniqueCode } = authSlice.actions//addCode,deleteCode都是action creator
export default authSlice.reducer