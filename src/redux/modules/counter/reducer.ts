// import { type CounterState } from "../../interface";
// import { CounterActionTypeEnum, type CounterAction } from "./action";

// // 1.设计state
// const counterState: CounterState = {
//   count: 114514,
// }

// // 3. 设计reducer 纯函数 (state,action) => newState
// const counter = (state: CounterState = counterState, action: CounterAction) => {
//   switch (action.type) {
//     case CounterActionTypeEnum.INCREMENT:
//       return { count: state.count + action.payload };
//     case CounterActionTypeEnum.DECREMENT:
//       return { count: state.count - action.payload };
//     default:
//       return counterState;
//   }

// }



// export default counter

import { createAsyncThunk, createSlice, type PayloadAction, AsyncThunk } from "@reduxjs/toolkit";
import { CounterState } from "../../interface";
import { RootState ,AppDispatch} from "../../index";

const counterState: CounterState = {
  count: 114514,
}

export const enum CounterActionTypeEnum {
  INCREMENT = "increment",
  DECREMENT = "decrement",
  THUNK_INCREMENT = "thunkIncrement",
}

const fetchSomeData = (): Promise<number> => {
  return new Promise((resolve, _reject) => {
    setTimeout(() => {
      resolve(5)
    }, 5000)
  })
}



const counterSlice = createSlice({
  name: 'counter',
  initialState: counterState,
  reducers: {
    [CounterActionTypeEnum.INCREMENT]: (state, action: PayloadAction<number>) => {
      state.count += action.payload;
    },
    [CounterActionTypeEnum.DECREMENT]: (state, action: PayloadAction<number>) => {
      state.count -= action.payload;
    },
  },
})

export const { increment, decrement } = counterSlice.actions

export const fetchCounterData: AsyncThunk<
void, // 返回值类型，如果你的异步 action 不返回任何值，可以使用 void
number, // 传入参数的类型
{ dispatch: AppDispatch; state: RootState; }// ThunkAPI 的类型
> = createAsyncThunk(`counter/${CounterActionTypeEnum.THUNK_INCREMENT}`, async (value: number, { dispatch, getState }) => {
  const res = await fetchSomeData();
  const count = (getState() as RootState).counter.count;
  console.log('[debug] 调用thunk时传参进来的value',value)
  const val = res + value;
  dispatch(increment(val + count))
})

export default counterSlice.reducer