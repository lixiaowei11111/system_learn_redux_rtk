import { useSelector, useDispatch } from "react-redux"

import { selectCount, selectCountByCreateSelector } from "../redux/modules/counter/selector"
import { incrementAction, decrementAction } from "../redux/modules/counter/action"
import { Button } from "antd"
import { addCode, uniqueCode } from "../redux/modules/auth/reducer"
import { authSelector } from "../redux/modules/auth/selector"

const fetchSomeData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(5)
    }, 5000)
  })
}

const UseReactRedux = () => {

  const count = useSelector(selectCount)
  const roleCode = useSelector(authSelector)
  const dispatch = useDispatch()

  const countByCreateSelector = useSelector(selectCountByCreateSelector)

  const handleDecrement = () => {
    dispatch(decrementAction(33))
  }

  const handleIncrement = () => {
    dispatch(incrementAction(44))
  }

  const handleAsyncIncrement = () => {
    const fetch = (dispatch, getState) => {
      fetchSomeData().then((res) => {
        const state = getState()
        console.log("state", state.counter.count)
        dispatch(incrementAction(res + state.counter.count))
      })
    }
    dispatch(fetch);
  }

  const handleExecuteReducerHasPrepareFn = () => {
    dispatch(uniqueCode(Date.now(), "哈哈哈"))
    // 在调用 对应 的action createor时,就会调用prepare函数,并获得对应的参数 time= 1720256204081 text= 哈哈哈
    // reducer.ts:28 [debug]in reducer函数 prepare函数可以处理改变reducer case中获取的action
  }

  // 打印一下rtk中的createSlice函数返回对象的action creator
  console.log(addCode(114514))//{type: 'auth/addCode', payload: 114514}
  // 执行以下带有prepare函数的action creator
  uniqueCode(Date.now(), "哈哈哈")

  // 在调用 对应 的action createor时,就会调用prepare函数,并获得对应的参数 time= 1720256201351 text= 哈哈哈

  return (
    <div>
      <div>配合react_redux,从useSelector((state)=&gt;state.counter.count){count}</div>
      <Button onClick={handleDecrement}>-</Button>
      <Button onClick={handleIncrement}>+</Button>
      <Button onClick={handleAsyncIncrement}>async +</Button>
      <div> relsect的createSelector记忆化函数countByCreateSelector{countByCreateSelector}</div>
      =====================================RTK
      <div>
        <div>{roleCode}</div>
        <Button onClick={handleExecuteReducerHasPrepareFn}>执行带有prepare的reducer</Button>
      </div>


    </div>
  )
}

export default UseReactRedux