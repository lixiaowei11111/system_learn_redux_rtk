import { Button } from "antd";
import { useEffect,useState } from "react";
import store from "../redux";
import { CounterActionTypeEnum } from "../redux/modules/counter/reducer";

const fetchSomeData=()=>{
  return new Promise((resolve,reject)=>{
    setTimeout(()=>{
      resolve(5)
    },5000)
  })
}


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
  const handleAsyncIncrement=()=>{
    const fetch=(dispatch,getState)=>{
      fetchSomeData().then((res)=>{
        const state=getState()
        console.log(state,"state",res,"res")
        dispatch({type:CounterActionTypeEnum.INCREMENT,payload:res+state.counter.count})
      })
    }
    store.dispatch(fetch);  
  }

  return (
    <>
      Count: {count}
      <Button onClick={handleDecrement}>-</Button>
      <Button onClick={handleIncrement}>+</Button>
      <Button onClick={handleAsyncIncrement}>async +</Button>
    </>
  )
}


export default NonReactRedux