import { useSelector, useDispatch } from "react-redux"

import { selectCount } from "../redux/modules/counter/selector"
import { CounterActionTypeEnum } from "../redux/modules/counter/action"
import { Button } from "antd"

const UseReactRedux = () => {

  const count=useSelector(selectCount)
  const dispatch=useDispatch()

  const handleDecrement = () => {
    dispatch({type:CounterActionTypeEnum.DECREMENT,payload:33})
  }

  const handleIncrement = () => { 
    dispatch({type:CounterActionTypeEnum.INCREMENT,payload:44})
  }

  return (
    <div>
      <div>配合react_redux,从useSelector((state)=&gt;state.counter.count){count}</div>
      <Button onClick={handleDecrement}>-</Button>
      <Button onClick={handleIncrement}>+</Button>
    </div>
  )
}

export default UseReactRedux