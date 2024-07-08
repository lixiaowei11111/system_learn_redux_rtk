// import { RootState } from "../../interface"
import { RootState } from "../../index"
//  配合react_redux使用, 
//做为useSelector hook的参数,相当于vuex的getter或者一个useMemo
export const selectCount=(state:RootState)=>state.counter.count

// memoized selector
// import { createSelector } from "reselect" //移除reselct package
import { createSelector } from "@reduxjs/toolkit"

export const selectCountByCreateSelector=createSelector(
  // 传递一个或者多个 input selector
  (state:RootState)=>state.counter.count,
  // 一个输出选择器接受所有输入结果为参数,并返回最终结果
  count=>count*2
)

