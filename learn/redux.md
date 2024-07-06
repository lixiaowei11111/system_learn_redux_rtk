# 1. redux terminology

+ `immutable update`
  + 为了以不可变的方式更新值，您的代码必须复制现有的对象/数组，然后修改这些副本。
  + `immutable`还有一个作用是避免产生副作用,`reducer`最好是一个纯函数,不能在执行`reducer`的函数时,更改外部变量的状态

## 1. `Actions`

+ 一个`action`是一个普通的`JavaScript`对象，它**必须**有一个`type`字段。你可以把一个`action`看作是描述应用程序中发生的事件。

+ `type` 字段应该是一个字符串，给这个操作一个描述性的名称，比如 `"todos/todoAdded"`。我们通常会像这样写那个类型的字符串，`"domain/eventName"`，其中第一部分是这个操作所属的特性或类别，第二部分是发生的具体事情。

+ 一个`action`对象可以有其他字段，包含关于发生了什么的附加信息。按照惯例，我们把这些信息放在一个叫做`payload`的字段中。

+ 一个典型的操作对象可能看起来像这样：
```JavaScript
const addTodoAction = {
  type: 'todos/todoAdded',
  payload: 'Buy milk'
}
```

## 2. `Reducers`

+ 一个`reducer`是一个函数，它接收当前的`state`和一个`action`对象，决定如何更新状态（如果有必要），并返回新的状态：`(state, action) => newState`。您可以将`reducer`看作是一个事件监听器，根据接收到的动作（事件）类型处理事件。

+ `Reducers`必须*始终*遵循一些特定规则：
  + 他们应该只根据`state`和`action`参数计算新的状态值。
  + 他们不被允许修改现有`state`。相反，他们必须进行*不可变更新(`immutable updates`)*，通过复制现有状态并对复制的值进行更改。
  + 它们不得执行任何异步逻辑、计算随机值或引发其他`side eeffects`即副作用
  
+ 在`reducer`函数内部的逻辑通常遵循相同的一系列步骤：
  + 检查`reducer`是否关心这个`action`
    + 如果是，复制`state`，使用新值更新副本，并返回
    + 否则，返回现有状态不变

+ 这里是一个小例子，展示了每个reducer应该遵循的步骤：
```JavaScript
const initialState = { value: 0 }

function counterReducer(state = initialState, action) {
  // Check to see if the reducer cares about this action
  if (action.type === 'counter/incremented') {
    // If so, make a copy of `state`
    return {
      ...state,
      // and update the copy with the new value
      value: state.value + 1
    }
  }
  // otherwise return the existing state unchanged
  return state
}
```

+ [为什么这些函数被称为`reducer`](https://redux.js.org/tutorials/fundamentals/part-2-concepts-data-flow#reducers)?
+ `reducer`来源于`Array.prototype.reduce`这个函数
  我们可以说Redux reducer将一组操作(随着时间的推移)减少到一个状态。不同之处在于，使用Array.reduce()时，它会一次发生，而使用Redux时，它会在运行的应用程序的整个生命周期内发生。

## 3. `Store`

+ 当前的`Redux`应用`state`存储在一个名为`store`的对象中。

+ 通过传入一个`reducer`来创建`store`，并且具有一个名为`getState`的方法，该方法返回当前`state`值：

```JavaScript
import { configureStore } from '@reduxjs/toolkit'

const store = configureStore({ reducer: counterReducer })

console.log(store.getState())
// {value: 0}
```

## 4. `Dispatch`

+ Redux `store`上有一个名为`dispatch`的方法。**更新`state`的唯一方法是调用`store.dispatch()`并传入一个`action`对象。**
+ `store`将运行其`reducer`函数并保存其中的新`state`值，我们可以调用`getState()`来检索更新后的值。
```JavaScript
store.dispatch({ type: 'counter/incremented' })

console.log(store.getState())
// {value: 1}
```
+ **可以将派发操作视为应用程序中的“触发事件”**。发生了某些事情，我们希望存储知道。减速器就像事件侦听器，当它们听到它们感兴趣的操作时，它们会响应地更新状态。

## 5. `Selectors`

+ `Selectors`是一种函数，它们知道如何从`stor`的`state`值中提取特定的信息片段。

+ 随着应用程序规模的增长，这可以帮助避免在应用程序的不同部分需要读取相同数据时重复逻辑：

```JavaScript
const selectCounterValue = state => state.value

const currentValue = selectCounterValue(store.getState())
console.log(currentValue)
// 2
```
+ 相当于`vuex`的`getter`

## 6. 核心概念和原理

### 1. 单一数据源`Single Source of Turth`

+ 您的应用程序的**全局状态**存储为一个对象，存储在单个**`store`**中。

### 2. 状态只读`State is Ready-Only`

+ 改变`state`的唯一方式是`dispatch`一个`action`，一个描述发生了什么的对象。

### 3. 通过纯函数`reducer`实现改变`Changes are Made with Pure Reducer Functions`

+ Reducer 是纯函数，接受前一个`state`和一个`action`作为参数，并返回下一个状态。

## 7. Redux Application Data Flow

### 7.1 单向数据流
+ `state`描述了特定时间点应用程序的条件
+ `UI`根据该`state`进行渲染
+ 当发生某些事件（例如用户点击按钮）时，`state`根据发生的情况进行更新
+ `UI`根据新`state`重新渲染

### 7.2
+ 对于`Redux`，我们可以将这些步骤分解为更详细的内容:

+ 初始设置:
  + `Redux`的`store`是使用 `root reducer`函数创建的
  + `store`调用 `root reducer`一次，并将返回值保存为其初始`state`
  + 当`UI`第一次呈现时，`UI`组件访问`Redux`中`store`的当前`state`，并使用该数据来决定呈现什么。它们还订阅任何未来的`store`更新，以便知道`state`是否发生了变化。
+ 更新:
  + 应用程序中发生了一些事情，比如用户点击了一个按钮
  + 应用程序代码向`Redux`的`store`下`dispatches`一个`action`，比如`dispatch({type: 'counter/ increated '})`
  + `store`将使用以前的`state`和当前`action`再次运行`reducer`，并将返回值保存为新`state`
  + `store`通知所有订阅的`UI`部分`store`已更新
  + 每个需要从`store`获取数据的`UI`组件都会检查它们需要的`state`部分是否发生了变化。
  + 看到其数据发生变化的每个组件都会强制使用新数据进行重新渲染，这样它就可以更新屏幕上显示的内容

![](https://redux.js.org/assets/images/ReduxDataFlowDiagram-49fa8c3968371d9ef6f2a1486bd40a26.gif)

## 8. 组合`reducer`

+ `store`只能接受一个`reducer`,但是为了保持可维护性,往往需要将`reducer`拆开

### 8.1 手动拼接`reducer`

+ 现在有两个单独的`slice`文件，每个文件都有自己的slice`reducer`函数。上面说过，当创建`store`时，需要**一个**`root reducer`函数。那么，我们如何才能重新拥有一个根减速器，而不是把所有代码放在一个大函数中呢？

+ 由于`reducer`是普通的JS函数，我们可以将`slice reducer`重新导入到reducer.js中，并编写一个新的`root reducer`，其唯一任务是调用其他两个函数。

```JavaScript
import todosReducer from './features/todos/todosSlice'
import filtersReducer from './features/filters/filtersSlice'

export default function rootReducer(state = {}, action) {
  // always return a new object for the root state
  return {
    // the value of `state.todos` is whatever the todos reducer returns
    todos: todosReducer(state.todos, action),
    // For both reducers, we only pass in their slice of the state
    filters: filtersReducer(state.filters, action)
  }
}
```

### 8.2 使用`redux`提供的`combineReducers`函数
+ `redux`提供的`combineReducers`函数提供了上述样板代码的步骤

```JavaScript
import { combineReducers } from 'redux'

import todosReducer from './features/todos/todosSlice'
import filtersReducer from './features/filters/filtersSlice'

const rootReducer = combineReducers({
  // Define a top-level state field named `todos`, handled by `todosReducer`
  todos: todosReducer,
  filters: filtersReducer
})
export default rootReducer
```

## 9. `store`上的方法

### 9.1 `store`的职责
`store`汇集了构成您应用程序的`state`、`action`和`reducer`。`store`有几个职责：

1. 将当前应用程序`state`保存在内部

2. 通过`store.getState()`允许访问当前`state`

3. 通过`store.dispatch(action)`允许更新`state`

4. 通过`store.subscribe(listener)`注册侦听器回调

5. 通过`store.subscribe(listener)`返回的取消订阅函数处理侦听器的`unsubscribe`

需要注意的是，在 Redux 应用程序中只会有一个`store`。当您想要拆分数据处理逻辑时，您将使用`reducer`组合并创建多个可以组合在一起的`reducer`，而不是创建单独的`store`。

### 9.2 `createStore`创建`store`

+ `redux`核心库提供了`createStore`来创建`store`

+ `createStore`第二个参数`PreloadedState`接受一个初始值做参数
```JavaScript
const rootReducer2 = combineReducers({
  global,
  counter,
})

const store=createStore(rootReducer2);
```

+ `store`调用分发`action`
```JavaScript
// Omit existing React imports

import store from './store'

// Log the initial state
console.log('Initial state: ', store.getState())
// {todos: [....], filters: {status, colors}}

// Every time the state changes, log it
// Note that subscribe() returns a function for unregistering the listener
const unsubscribe = store.subscribe(() =>
  console.log('State after dispatch: ', store.getState())
)

// Now, dispatch some actions

store.dispatch({ type: 'todos/todoAdded', payload: 'Learn about actions' })
store.dispatch({ type: 'todos/todoAdded', payload: 'Learn about reducers' })
store.dispatch({ type: 'todos/todoAdded', payload: 'Learn about stores' })

store.dispatch({ type: 'todos/todoToggled', payload: 0 })
store.dispatch({ type: 'todos/todoToggled', payload: 1 })

store.dispatch({ type: 'filters/statusFilterChanged', payload: 'Active' })

store.dispatch({
  type: 'filters/colorFilterChanged',
  payload: { color: 'red', changeType: 'added' }
})

// Stop listening to state updates
unsubscribe()

// Dispatch one more action to see what happens

store.dispatch({ type: 'todos/todoAdded', payload: 'Try creating a store' })

// Omit existing React rendering logic
```

### 9.3 `store`内部的工作原理

+ 这里是一个在大约25行代码中展示的工作中的 `store`的微型示例：

+ **其实就是一个发布订阅模型下的事件中心**
```JavaScript
function createStore(reducer, preloadedState) {
  let state = preloadedState
  const listeners = []

  function getState() {
    return state
  }

  function subscribe(listener) {
    listeners.push(listener)
    return function unsubscribe() {
      const index = listeners.indexOf(listener)
      listeners.splice(index, 1)
    }
  }

  function dispatch(action) {
    state = reducer(state, action)
    listeners.forEach(listener => listener())
  }

  dispatch({ type: '@@redux/INIT' })

  return { dispatch, subscribe, getState }
}
```

### 9.4 `store`的配置
+ `rootReducers`:根reducer
+ `PreloadedState` :初始化状态
+ `StoreEnhancers`:增强`store`,利用`redux`提供的`compose`可以组装多个`Enhancer`函数
```JavaScript
  import { createStore, compose } from 'redux'
import rootReducer from './reducer'
import {
  sayHiOnDispatch,
  includeMeaningOfLife
} from './exampleAddons/enhancers'

const composedEnhancer = compose(sayHiOnDispatch, includeMeaningOfLife)

const store = createStore(rootReducer, undefined, composedEnhancer)

export default store
```
> 如果没有要加载的`Preloaded`,可以将`StoreEnhancer`做为第二个参数传进来`const store = createStore(rootReducer, storeEnhancer)`

### 9.5 MiddleWare
+ `Enhancer`很强大，因为它们可以覆盖或替换存储的任何方法：`dispatch`、`getState`和`subscribe`。
+ 我们已经看到您可以使用`store enhancers`来自定义 `Redux store`。**`Redux middleware` 实际上是在一个非常特殊的 `store enhancer`上实现的，这个增强器内置在 Redux 中，名为 `applyMiddleware`。**

```JavaScript
import { createStore, applyMiddleware } from 'redux'
import rootReducer from './reducer'
import { print1, print2, print3 } from './exampleAddons/middleware'

const middlewareEnhancer = applyMiddleware(print1, print2, print3)

// Pass enhancer as the second arg, since there's no preloadedState
const store = createStore(rootReducer, middlewareEnhancer)

export default store
```

+ **与`reducer`不同，中间件可以在内部产生副作用，包括超时和其他异步逻辑。**
+ **中间件在`store`的调度方法周围形成管道。当我们调用`store.dispatch(action)`时，实际上是在调用管道中的第一个中间件。**

### 9.6 自定义middleware
+ [自定义一个自己的middleware](https://redux.js.org/tutorials/fundamentals/part-4-store#writing-custom-middleware)
+ Redux中间件是作为一系列三个嵌套函数编写的。
```JavaScript
  // Middleware written as ES5 functions

// Outer function:
function exampleMiddleware(storeAPI) {
  return function wrapDispatch(next) {
    return function handleAction(action) {
      // Do anything here: pass the action onwards with next(action),
      // or restart the pipeline with storeAPI.dispatch(action)
      // Can also use storeAPI.getState() here

      return next(action)
    }
  }
}
```
+ `exampleMiddleware`：外部函数实际上是"中间件"本身。它将被`applyMiddleware`调用，并接收一个包含`store`的{`dispatch`, `getState`}函数的`storeAPI`对象。这些`dispatch`和`getState`函数实际上是`store`的一部分。如果调用此`dispatch`函数，它将发送动作到中间件管道的开头。这只会被调用一次。

+ `wrapDispatch`：中间函数接收一个名为`next`的函数作为其参数。这个函数实际上是管道中的下一个中间件。如果此中间件是序列中的最后一个，则`next`实际上是原始的 `store.dispatch` 函数。调用 `next(action)` 将动作传递给管道中的下一个中间件。这也只会被调用一次。

+ `handleAction`：最后，内部函数接收当前动作作为其参数，并在每次调度动作时被调用。

+ 您可以给这些中间件函数任意命名，但使用这些名称有助于记住每个函数的作用：
  + `Outer`: `someCustomMiddleware`（或您的中间件所取的任何名称）
  + `Middle`: `wrapDispatch`
  + `Inner`: `handleAction`

+ 使用箭头函数来编写一个自定义`middleware`
```JavaScript
const loggerMiddleware = storeAPI => next => action => {
  console.log('dispatching', action)
  let result = next(action)
  console.log('next state', storeAPI.getState())
  return result
}

const alwaysReturnHelloMiddleware = storeAPI => next => action => {
  const originalResult = next(action)
  // Ignore the original result, return something else
  return 'Hello!'
}

const delayedMessageMiddleware = storeAPI => next => action => {
  if (action.type === 'todos/todoAdded') {
    setTimeout(() => {
      console.log('Added a new todo: ', action.payload)
    }, 1000)
  }

  return next(action)
}
```

### 9.7 Redux DevTools
+ Redux专门设计为使人更容易理解状态随时间如何、何时、为何以及如何发生变化。
+ 将`DevTools`添加到`Store`
+ 安装`pnpm add @redux-devtools/extension`

```JavaScript
import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import rootReducer from './reducer'
import { print1, print2, print3 } from './exampleAddons/middleware'

const composedEnhancer = composeWithDevTools(
  // EXAMPLE: Add whatever middleware you actually want to use here
  applyMiddleware(print1, print2, print3)
  // other store enhancers if any
)

const store = createStore(rootReducer, composedEnhancer)
export default store
```

## 10. 在没有`react-redux`的情况下,在`react`中使用`redux`
```tsx
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
```

# 2. UI and React

## 2.1 在任何`UI`层中使用`Redux`都需要一些一致的步骤：
1. 创建 Redux store(`createStore`)
2. 订阅更新(`store.subscribe`)
3. 在订阅回调中(`store.subscribe(()=>{})`)
4. 获取当前的 `store` 状态(`store.getState()`)
5. 提取这部分 `UI` 需要的数据
6. 用数据更新 `UI`
7. 如果必要，使用初始状态渲染 `UI`
8. 通过触发 `Redux actions` 响应 `UI` 输入

```JavaScript
// 1) Create a new Redux store with the `createStore` function
const store = Redux.createStore(counterReducer)

// 2) Subscribe to redraw whenever the data changes in the future
store.subscribe(render)

// Our "user interface" is some text in a single HTML element
const valueEl = document.getElementById('value')

// 3) When the subscription callback runs:
function render() {
  // 3.1) Get the current store state
  const state = store.getState()
  // 3.2) Extract the data you want
  const newValue = state.value.toString()

  // 3.3) Update the UI with the new value
  valueEl.innerHTML = newValue
}

// 4) Display the UI with the initial store state
render()

// 5) Dispatch actions based on UI inputs
document.getElementById('increment').addEventListener('click', function () {
  store.dispatch({ type: 'counter/incremented' })
})
```

## 2.2 配合`react-redux`使用

### 1. `useSelector`从`store`读取`state`

+ **相当于`store.getState()`用于快速获取`store`里面的状态值**

+ `useSelector`接受一个函数，我们称之为**`selector`**函数。`selector`是一个函数，它将整个`store state`作为其参数，从`state`中读取某个值，并返回该结果。
+ `selector`可以从`redux store state`返回值，也可以基于该状态返回派生值。

```JavaScript
// src/redux/modules/counter/selector.ts 
import { RootState } from "../../interface"
//  配合react_redux使用, 
//做为useSelector hook的参数,相当于vuex的getter或者一个useMemo
export const selectCount=(state:RootState)=>state.counter.count

// UseReactRedux.tsx
import { useSelector } from "react-redux"

import { selectCount } from "../redux/modules/counter/selector"

const UseReactRedux = () => {

  const count=useSelector(selectCount)

  return (
    <div>
      <div>配合react_redux,从useSelector((state)=&gt;state.counter.count){count}</div>
    </div>
  )
}

export default UseReactRedux
```
+ 可以调用 store.subscribe() 来监听 store 的变化，因此我们可以尝试编写订阅 store 的代码在每个组件中。但是，这样很快会变得非常重复且难以处理。

+ 幸运的是，**`useSelector`会自动订阅 Redux store！**这样，每当一个`action`被派发时，它会立即再次调用其选择器函数。
+ **如果`selector`返回的值与上次运行时不同，useSelector 将强制我们的组件使用新数据重新渲染。**
+ 我们只需在组件中调用一次`useSelector()`，它就会为我们完成其余工作。
+ `useSelector`使用严格的`===`引用比较来比较其结果，因此组件将在选择器结果是新引用时重新渲染！这意味着，如果在选择器中创建新引用并返回它，您的组件可能会在每次分发操作时重新渲染，即使数据实际上并没有发生变化。
+ 值得一提的是，我们不必将选择器函数单独写成变量。您可以直接在调用useSelector时编写选择器函数，就像这样：
  ```JavaScript
  const todos = useSelector(state => state.todos)
  ```

### 2. `useDispatch`分发`action`

+ ***返回`store`上的`dispatch`方法,用于快速分发`action`,进行更改**

+ React-Redux的`useDispatch`钩子将`store`的`dispatch`方法作为其结果返回。（实际上，该钩子的实现确实是`return store.dispatch`。）

+ 因此，我们可以在任何需要分发操作的组件中调用`const dispatch = useDispatch()`，然后根据需要调用`dispatch(someAction)`。
  
```JavaScript
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
```

### 3. 通过`Provider`传递`store`

+ **注意,必须使用`react-redux`提供的`Provider`组件,而不是`react`自带的**
+ 这个`Provider`组件包裹顶层组件,给`useSelector`和`useDispatch`等`hook`提供`store`

+ 我们的组件现在可以从`store`中读取`state`，并向`store`分发`action`。但是，我们仍然遗漏了一些东西。`React-Redux hooks`(即`useDispatch`或者`useSelector`)在哪里以及如何找到正确的`Redux store`？钩子是一个JS函数，所以它**无法自动从store.js中导入存储**。

+ 相反，我们必须明确告诉React-Redux我们要在组件中使用哪个存储。
+ 我们通过在整个`<App>`周围渲染`<Provider>`组件，并将`Redux store`作为`<Provider>`的属性传递来实现这一点。一旦我们这样做了一次，应用程序中的每个组件都可以在需要时访问`Redux store`。


+ 这涵盖了在`React`中使用`React-Redux`的关键部分：
  + 调用`useSelector`钩子来读取`React`组件中的数据
  + 调用`useDispatch`钩子在`React`组件中分派动作
  + 在整个`<App>`组件周围放置`<Provider store={store}>`，以便其他组件可以与`store`通信

# 3. 异步逻辑和数据获取

+ 使用`redux`官方提供的中间件`redux-thunk`就行了,在`dispatch`时不在传入一个`action`对象,而是一个函数,在这个函数内部进行异步逻辑和`state`处理以及`dispatch`,如`dispatch((dispatch,getState)=>{//...异步逻辑})`,
+ Redux store本身并不了解异步逻辑。它只知道如何同步地`dispatch actions`，通过调用`root reducer`函数来更新状态，并通知`UI`有变化。
+ 任何异步都必须发生在`store`之外。
+ **Redux中间件被设计用来支持编写有副作用的逻辑。**
+ 当Redux中间件看到`dispatch action`时，它可以做任何事情:记录日志、修改action、延迟action、进行异步调用等等。此外，由于中间件围绕真正的商店形成了一个管道。`Dispatch`函数，这也意味着我们实际上可以传递一些不是普通`action`对象的东西来`Dispatch`，只要中间件拦截该值并且不让它到达`reducer`。

## 3.1 自定义一个异步中间件
+ 调用异步数据的实际场景就是`store.dispatch(asyncFunc)`,思路就是检测在`dispatch`中的`action`参数是否为一个对象,还是一个函数,如下
```JavaScript
const asyncFunctionMiddleware = storeAPI => next => action => {
// If the "action" is actually a function instead...
if (typeof action === 'function') {
  // then call the function and pass `dispatch` and `getState` as arguments
  return action(storeAPI.dispatch, storeAPI.getState)
}

// Otherwise, it's a normal action - send it onwards
return next(action)
}
```
+ 注册和调用异步中间件
```JavaScript
// 注册
const middlewareEnhancers = applyMiddleware(print1, print2, print3, asyncFunctionMiddleware)
const composedEnhancers = composeWithDevTools({
  //增加options
})||compose
const store = createStore(rootReducer2, undefined, composedEnhancers(middlewareEnhancers));
export default store
// 组件中调用
import { useSelector, useDispatch } from "react-redux"
import { selectCount } from "../redux/modules/counter/selector"
import { CounterActionTypeEnum } from "../redux/modules/counter/action"
import { Button } from "antd"

const fetchSomeData=()=>{
  return new Promise((resolve,reject)=>{
    setTimeout(()=>{
      resolve(5)
    },5000)
  })
}

const UseReactRedux = () => {
  const count=useSelector(selectCount)
  const dispatch=useDispatch()

  const handleAsyncIncrement=()=>{
    const fetch=(dispatch,getState)=>{
      fetchSomeData().then((res)=>{
        const state=getState()
        dispatch({type:CounterActionTypeEnum.INCREMENT,payload:res+state.counter.count})
      })
    }
    // dispatch一个异步函数,进入中间件函数逻辑
    dispatch(fetch);   
  }
  return (
    <div>
      <div>配合react_redux,从useSelector((state)=&gt;state.counter.count){count}</div>
      <Button onClick={handleAsyncIncrement}>async +</Button>
    </div>
  )
}
export default UseReactRedux
```

## 3.2 `Redux` 异步数据流
+ 中间件和异步逻辑是如何影响`Redux`应用程序的整体数据流的呢?
+ 就像普通的操作一样，我们首先需要在应用程序中处理用户事件，例如单击按钮。然后，我们调用`dispatch()`，并传入一些东西，可以是普通的操作对象、函数，或者中间件可以查找的其他值。
+ 一旦分发的值到达中间件，它就可以进行异步调用，然后在异步调用完成时分发一个真正的`action`对象。
+ 之前，我们看到了一个表示正常同步`Redux`数据流的图。当我们向`Redux`应用程序添加异步逻辑时，我们添加了一个额外的步骤，中间件可以运行类似AJAX请求的逻辑，然后`dispatch actions`。这使得异步数据流看起来像这样:

![redux async data flow](https://redux.js.org/assets/images/ReduxAsyncDataFlowDiagram-d97ff38a0f4da0f327163170ccc13e80.gif)

## 3.3 Redux Thunk Middleware

+ `redux`其实已经有了`异步函数中间件`的官方版本,称为`Redux Thunk Middleware`

+ `thunk middleware`允许**编写以`dispatch`和`getState`为参数的函数**。`thunk`函数内部可以有任何我们想要的异步逻辑，并且该逻辑可以根据需要`dispatch` `actions`和读取`store`状态。

  > “thunk”是一个编程术语，意思是“一段执行延迟工作的代码”。

+ 使用`redux`官方提供的`thunk middleware`,需要安装`redux-thunk`
+ 注册和使用和上述`3.1`的自定义中间件没有任何区别
  
```JavaScript
// redux-thunk 异步中间件
import {thunk as thunkMiddleware} from 'redux-thunk'//^3.1.0
onst middlewareEnhancers = applyMiddleware(print1, print2, print3, thunkMiddleware)

const composedEnhancers = composeWithDevTools({
  //增加options
}) || compose

const store = createStore(rootReducer2, undefined, composedEnhancers(middlewareEnhancers));
```

# 4. 标准Redux模式`Standard Redux Pattern`

## 4.1` Action`生成器函数`Action Creators`
+ 使用`distach`分发`action`对象时,通常都是以对象的形式分发的
```JavaScript
dispatch({ type: 'todos/todoAdded', payload: trimmedText })
```

+ 然而，在实践中，编写良好的Redux应用程序实际上不会在我们`dispatch`它们时内联地编写这些`action`对象。相反，我们使用“action creator”函数。

+ `action creator`是一个创建并返回`action`对象的**函数**。我们通常使用这些，这样我们就不必每次都手动编写操作对象:

```JavaScript
export const incrementAction = (payload: number) => {
  return {
    type: CounterActionTypeEnum.INCREMENT,
    payload,
  }
}
export const decrementAction = (payload: number) => {
  return {
    type: CounterActionTypeEnum.DECREMENT,
    payload,
  }
}
```
+ 然后我们通过调用`action creator`来使用它们，然后将生成的`action`对象直接传递给`dispatch`
```JavaScript
const handleDecrement = () => {
    dispatch(decrementAction(33))
  }

  const handleIncrement = () => { 
    dispatch(incrementAction(44))
  }
```
+ 相当于之前的声明`action`字面量
```JavaScript
const handleDecrement = () => {
    dispatch({type:CounterActionTypeEnum.DECREMENT,payload:33})
  }

  const handleIncrement = () => { 
    dispatch({type:CounterActionTypeEnum.INCREMENT,payload:44})
  }
```


## 4.2 Memoized Selectors

+ `useSelector`相当于一个`useMemo`,如果计算之后返回的引用不同(浅引用比较),会触发当前函数的`re-render`

+ 我们已经看到我们可以编写“选择器”函数，它接受Redux状态对象作为参数，并返回一个值:
```JavaScript
const selectTodos = state => state.todos
```
+ 但是如果需要对数据进行处理再返回
```JavaScript
const selectTodoIds = state => state.todos.map(todo => todo.id)
```
+ 然而，`array.map()`总是返回一个新的数组引用。`React-Redux`的`useSelector` `hook`会在每个`dispatch action`之后重新运行它的`selector`函数，**如果`selector`结果改变，它将强制组件重新渲染。**

+ 在上面的例子中，**调用`useSelector(selectTodoIds)`总是会导致组件在每个`action`之后重新渲染，因为它返回了一个新的数组引用!**

### 1. 使用`memoized selector`
+ `Momoization`是一种缓存——具体来说，就是保存昂贵计算的结果，然后在以后遇到相同的输入时重用这些结果。

+ **`Memoized selector functions`**保存了最近的结果，如果用相同的输入多次调用它们，就会返回相同的结果。如果用与上次不同的输入调用它们，它们将重新计算一个新的结果值，缓存它，并返回新的结果。

### 2. Memoizing Selectors with `createSelector`

+ `Reselect`库提供了`createSelector API`，可以生成记忆化的`selector`函数。`createSelector`接受一个或多个`input selector`函数和一个`output selector`作为参数，并返回新的`selector`函数。每次调用`selector`时:
  1. 所有的`input selector`都会被所有的参数调用
  2. 如果`input selector`的任何返回值发生了变化，`output selector`将重新运行
  3. 所有`input selector`的结果都将成为`output selector`的参数
  4. `output selector`的最终结果将被缓存以备下次使用

+ 手动安装`reselect`,使用其`createSelector`库
```JavaScript
// src/redux/modules/counter/selector.ts
import { createSelector } from "reselect"

export const selectCountByCreateSelector=createSelector(
  // 传递一个或者多个 input selector
  state=>state.counter.count,
  // 一个输出选择器接受所有输入结果为参数,并返回最终结果
  count=>count*2
)
// 使用
import { useSelector, useDispatch } from "react-redux"
import { selectCount,selectCountByCreateSelector } from "../redux/modules/counter/selector"

const UseReactRedux = () => {
  const count=useSelector(selectCount)

  const dispatch=useDispatch()

  const countByCreateSelector=useSelector(selectCountByCreateSelector)

  return (
    <div>
      <div> relsect的createSelector记忆化函数countByCreateSelector{countByCreateSelector}</div>
    </div>
  )
}

export default UseReactRedux
```
### 3. `createSelector`的返回作为另外一个`createSelector`的`input selector`
+ 如
```JavaScript
import { createSelector } from 'reselect'
import { StatusFilters } from '../filters/filtersSlice'

// omit other code

export const selectFilteredTodos = createSelector(
  // 第一个inut selector: all todos
  state => state.todos,
  // 第二个input selector: current status filter
  state => state.filters.status,
  // Output selector: 按照顺序接收所有input selector计算的值
  (todos, status) => {
    if (status === StatusFilters.All) {
      return todos
    }

    const completedStatus = status === StatusFilters.Completed
    // Return either active or completed todos based on filter
    return todos.filter(todo => todo.completed === completedStatus)
  }
)
// 可以使用这个新的“filtered todos”选择器作为另一个选择器的输入
export const selectFilteredTodoIds = createSelector(
  // Pass our other memoized selector as an input
  selectFilteredTodos,
  // And derive data in the output selector
  filteredTodos => filteredTodos.map(todo => todo.id)
)
```

## 4.3 Flux Standard Action
+ `store`本身并不关心你在`action`对象中放入了什么字段。它只关心那个`action.type`的存在，并且是一个`string`。这意味着可以在`action`中放入任何其他字段。

+ 然而，如果每个`action`的数据字段都使用不同的字段名，那么就很难提前知道需要在每个`reducer`中处理哪些字段。

+ 这就是为什么`Redux`社区提出了`Flux Standard Actions(Flux Standard Actions)`规范，或称`FSA`。这是一种建议的方法，用于组织操作对象中的字段，以便开发人员始终知道哪些字段包含什么样的数据。`FSA`模式在`Redux`社区中被广泛使用

### 1. [`FSA`的约定如下](https://redux.js.org/tutorials/fundamentals/part-7-standard-patterns#memoizing-selectors-with-createselector)
1. 如果你的`action`对象有任何实际/业务数据，你的`action`的**数据值**应该始终保存在`action.payload`中
2. 一个`action`也可以有一个`action.meta`。带有额外描述性数据的元字段
3. 一个`action`可以有一个`action.error`。包含错误信息的Error字段

+ 因此`redux`的`action`必须:
  + 是一个纯`JS`对象
  + 这个对象必须有`type`属性,且为`string`类型

+ 如果使用`FSA`模式编写`action`，则可以使一个`action`额外有
  1. have a `payload` field
  2. have an`error` field
  3. have a `meta` field


## 4.4 [规范化state(`Normalized State`)](https://redux.js.org/tutorials/fundamentals/part-7-standard-patterns#normalized-state)

+ 在较大的`Redux`应用程序中，通常会将数据存储在规范化的状态结构中。 “规范化”意味着：
  1. 确保每个数据片段只有一个副本
  2. 以允许根据ID直接查找项目的方式存储项目
  3. 基于ID引用其他项目，而不是复制整个项目

+ 例如，在一个博客应用程序中，你可能有指向用户和评论对象的帖子对象。可能有很多帖子是由同一个人发布的，所以如果每个帖子对象都包含整个用户对象，我们就会有很多相同用户对象的副本。相反，帖子对象会有一个用户ID值作为post.user，然后我们可以通过ID查找用户对象，如state.users[post.user]。

+ 这意味着我们通常将数据组织为对象而不是数组，其中项目ID是键，项目本身是值，如下所示：

+ 其实就是建议用`map`结构来存储
```JavaScript
const rootState = {
  todos: {
    status: 'idle',
    entities: {
      2: { id: 2, text: 'Buy milk', completed: false },
      7: { id: 7, text: 'Clean room', completed: true }
    }
  }
}
```

## 4.5 Thunks and Promises

# 5. 使用`Redux Toolkit`的现代`redux`

+ 安装`reduxjs/toolkit`

## 5.1 `configureStore`

+ 原来的`createStore`样板代码
```JavaScript
const rootReducer1 = (state: RootState, action: RootAction) => {
  return {
    global: isGlobalStateAction(action) ? global(state.global, action) : state.global,
    counter: isCounterAction(action) ? counter(state.counter, action) : state.counter
  }
}
const rootReducer2 = combineReducers({
  global,
  counter,
})
const middlewareEnhancers = applyMiddleware(print1, print2, print3, thunkMiddleware)
const composedEnhancers = composeWithDevTools({
  //增加options
}) || compose
const store = createStore(rootReducer2, undefined, composedEnhancers(middlewareEnhancers));
export default store
```

+ `Redux Toolkit`具有一个`configureStore API`，可以简化`store`的设置过程。`configureStore`包装了`Redux`核心的`createStore API`，并自动处理大部分`store`的设置。实际上，我们可以将其简化为一步操作：

```JavaScript
const rtkStore=configureStore({
  reducer:{
    global,
    counter,
  }
})
```
+ 调用 `configureStore` 一步完成了所有工作：
  1. 它将`global`和`cunter`组合成`root reducer`函数，该函数将处理类似于`{todos, filters}`的`root state`。(代替了`combineReducer`函数)
  2. 它使用该`root reducer`创建了一个`Redux store`。(代替了`createStore`函数和`StoreEnhancer`部分)
  3. 它自动添加了`thunk middleware`中间件。(代替了`redux-thunk`中的`thunk`的部分)
  4. 它自动添加了更多中间件，以检查常见错误，如意外地变异状态。
  5. 它自动设置了`Redux DevTools`扩展连接。(代替了`@redux-devtools/extension`的`composeWithDevTools`)

## 5.2 包清理`Package Cleanup`
+ `Redux Toolkit` 已经包含了我们正在使用的几个包，如 `redux`、`redux-thunk`和`reselect`，并重新导出了这些 API。所以，我们可以对项目进行一些清理。
+ 首先，我们可以将`createSelector`的导入切换为从 `@reduxjs/toolkit`而不是 `reselect`。然后，我们可以从 `package.json` 中移除这些单独列出的包。

## 5.3 编写`Slices`

### 1. `createSlice`是干嘛的
+ 随着我们向应用程序添加新功能，`slice`文件变得越来越大且更加复杂。特别是`glboalReducer`因为所有的嵌套对象扩展（用于不可变更新）变得难以阅读，并且我们编写了多个`action creator`函数。

+ **`Redux Toolkit` 提供了一个`createSlice API`，可以帮助我们简化`Redux reducer` 逻辑和 `actions`**。

+ **在`createSlice`内部，`mutating`代码是可以接受的，因为`Redux Toolkit`使用了`Immer`库来处理状态的不可变性更新。**
+ **这意味着你可以直接修改状态对象，而不需要手动创建其副本。**

+ `createSlice` 对我们来说做了几件重要的事情：
  1. 我们可以将 `case reducer` 编写为对象内部的函数，而不必编写 `switch/case` 语句。
  2. `Reducer` 可以编写更简短的不可变更新逻辑。
  3. 所有的`action creator`将根据我们提供的`reducer`函数自动生成。

### 2. 使用`createSlice`

#### 1.生成`action creator`和`reducer`

+ `createSlice` 接受一个包含三个主要选项字段的对象：
  1. name`: 一个字符串，将用作生成的`action`类型的前缀。
  2. `initialState`: `reducer`的初始状态。
  3. `reducers`: 一个对象，其中`key`是字符串，`value`是处理特定`actions`的"`case reducer`" 函数。

+ 这些选项字段帮助定义和配置一个 `Redux slice`，使得创建`reducer`和相应的`action creators`变得简单和直观。

```JavaScript
// 使用`rtk`的createSlice,来创建reducer和action creator
import { createSlice } from "@reduxjs/toolkit";
import { AuthState } from "../../interface";

const authState:AuthState={
  roleCode:[1,1,4,5,1,4]
}

const enum AuthActionTypeEnum{
  ADD_CODE="addCode",
  DELETE_CODE="deleteCode"
}

const authSlice=createSlice({
  name:"auth",
  initialState:authState,
  reducers:{
    [AuthActionTypeEnum.ADD_CODE]:(state,action)=>{
      // 在 createSlice 内部，这种“变异”代码是可以接受的，因为 Redux Toolkit 使用了 Immer 库来处理状态的不可变性更新。这意味着你可以直接修改状态对象，而不需要手动创建其副本。
      state.roleCode.push(action.payload)
    },
    [AuthActionTypeEnum.DELETE_CODE]:(state,action)=>{
      state.roleCode=state.roleCode.filter(item=>item!==action.payload)
    }
  }
})

export const {addCode,deleteCode}=authSlice.actions//addCode,deleteCode都是action creator
export default authSlice.reducer
```
在这个例子中，有几点需要注意:
  + 我们在`reducers`对象中编写`case reducer`函数，并给它们起可读的名字
  + `createSlice`将自动生成与我们提供的每个`case reducer`函数相对应的`action creator`
  + `createSlice`在`default`情况下自动返回现有的状态
  + **`createSlice`允许我们安全地“`mutate`”我们的`state`!**
  + 但是，如果我们想的话，也可以像以前一样创建不可变的副本

+ 当你使用`createSlice`创建一个`slice`后，生成的`action creators`将作为`slice.actions.addCode`等属性可用。通常我们会像之前手动编写的 `action creators` 一样，解构并单独导出它们。
+ 完整的 `reducer` 函数可以通过 `slice.reducer` 访问，并且通常会像之前一样使用 `export default slice.reducer` 导出。

```JavaScript
// 打印一下rtk中的createSlice函数返回对象的action creator
  console.log(addCode(114514))//{type: 'auth/addCode', payload: 114514}
  ```
+ 使用`createSlice`自动生成了`action.type`字符串，它结合了`slice`的`name`字段和我们编写的`case reducer`函数名`addCode`。默认情况下，`action creator` 接受一个参数，将其作为`payload`放入`action`对象中。

+ 在生成的`reducer`函数内部`createSlice`会检查派发的`action`的`action.type`是否与它生成的`action type`匹配。如果匹配，它会执行相应的 `case reducer` 函数。这与我们自己使用 `switch/case` 语句编写的模式完全相同，但 `createSlice` 自动为我们完成了这些工作。

#### 2. 使用`Immer`进行不可变更新`Immutable Updates`

+ 之前，我们谈论了`mutation`（直接修改现有对象/数组的值）和`immutability`（将值视为不可更改的内容）的概念。

+ `createSlice` 使用了一个名为 `Immer` 的库。`Immer` 使用特殊的 `JavaScript` 工具——代理（`Proxy`），来包装你提供的数据，并允许你编写可以`mutates`这些包装数据的代码。但是，**`Immer`会追踪你尝试进行的所有更改，然后使用这些更改列表来安全地返回一个不可变更新的值，就好像你手动编写了所有不可变更新逻辑一样。**

+ `RTk`中使用注意:
  > 在`Redux Toolkit`的`createSlice`和`createReducer`中，你只能编写`mutating`逻辑，因为它们内部使用了`Immer`！如果在没有`Immer`的情况下在 `reducers`中编写突变逻辑，会导致状态突变并引发`bug`！

#### 3. `createSlice`中`redcures`的`prepare`函数

+ 在`createSlice`中，如果需要传递多个参数或者执行一些预处理逻辑（比如生成唯一的 ID），可以通过添加一个"`prepare`回调函数" 来处理这些情况。
+ 我们可以传递一个对象，对象包含名为`reducer`和`prepare`的函数。
+ 当我们**调用**生成的`action creator`时，`prepare`函数将被调用，并传入相应的参数。
+ 这个函数**应该创建并返回一个对象，这个对象应该包含一个`payload`字段**，同时也可以选择性地包含`meta`和`error`字段，符合`Flux Standard Action`规范。

1. 添加一个`uniqueCode`类型
```JavaScript
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
```

2. 通过`@reduxjs/toolkit`提供的`createSelector`创建`selector`函数

```JavaScript
import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../interface/index";

export const authSelector = createSelector(
  (state: RootState) => state.auth.roleCode,
  roleCode => roleCode.join(",")
)
```

3. 通过`react-redux`提供的`useDispatch`和`useSelector分别来分发`uniqueCode`和获取`roleCode`
```JavaScript
import { useSelector, useDispatch } from "react-redux"
import { Button } from "antd"
import { uniqueCode } from "../redux/modules/auth/reducer"
import { authSelector } from "../redux/modules/auth/selector"

const UseReactRedux = () => {
  const count = useSelector(selectCount)
  const roleCode = useSelector(authSelector)
  const dispatch = useDispatch()

  const handleExecuteReducerHasPrepareFn = () => {
    dispatch(uniqueCode(Date.now(), "哈哈哈"))
    // 在调用 对应 的action createor时,就会调用prepare函数,并获得对应的参数 time= 1720256204081 text= 哈哈哈
    // reducer.ts:28 [debug]in reducer函数 prepare函数可以处理改变reducer case中获取的action
  }

  return (
    <div>
      <div>
        <div>{roleCode}</div>
        <Button onClick={handleExecuteReducerHasPrepareFn}>执行带有prepare的reducer</Button>
      </div>
    </div>
  )
}
```

## 5.4 编写`Thunk`
//TODO 以后用到再来梳理
+ 我们已经看到如何编写`thunks`来触发`“loading”`、`“request succeeded”`和`“request failed”`操作。我们必须编写`action creators`, `action types`和`reducers`来处理这些情况。

+ 因为这种模式太常见了，所以`Redux Toolkit`提供了`createAsyncThunk API`来为我们生成这些`thunk`。它还为那些不同的`request status`动作生成动作类型和动作创建器，并根据产生的`Promise`自动分发这些动作。

### 1. 使用`createAsyncThunk`
+ 让我们用`createAsyncThunk`生成一个`thunk`来替换`fetchTodos`中的`thunk`。
+ `createAsyncThunk`接受两个参数:
  + 一个字符串，将被用作生成的操作类型的前缀
  + 一个应该返回一个`Promise`的`“payload creator”`回调函数。这通常使用`async/await`语法编写，因为`async`函数自动返回一个`promise`。

## 5.5 标准化`state`
// TODO 以后用到再来梳理