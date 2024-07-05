import { Button } from "antd";
import { useEffect,useState } from "react";
import store from "../redux";
import { CounterActionTypeEnum } from "../redux/modules/counter/action";

// 在没有react_redux的情况下使用redux

const NonReactRedux = () => {
 

  const [count,setCount]=useState(store.getState().counter.count)

  useEffect(()=>{
    // 注册subscribe回调,订阅变化
    const unsubscribe=store.subscribe(()=>{
      setCount(store.getState().counter.count)
    })

    // 组件卸载时注销回调
    return ()=>{
      unsubscribe
    }
  },[])

  const handleDecrement = () => {
    store.dispatch({type:CounterActionTypeEnum.DECREMENT,payload:33})
  }

  const handleIncrement = () => { 
    store.dispatch({type:CounterActionTypeEnum.INCREMENT,payload:44})
  }

  return (
    <>
      Count: {count}
      <Button onClick={handleDecrement}>-</Button>
      <Button onClick={handleIncrement}>+</Button>
    </>
  )
}


export default NonReactRedux