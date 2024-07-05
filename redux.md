# 1. redux terminology

+ `immutable update`
  + 为了以不可变的方式更新值，您的代码必须复制现有的对象/数组，然后修改这些副本。
  + `immutable`还有一个作用是避免产生副作用,`reducer`最好是一个纯函数,不能在执行`reducer`的函数时,更改外部变量的状态

## 1. `Actions`

+ 一个`action`是一个普通的`JavaScript`对象，它有一个`type`字段。你可以把一个`action`看作是描述应用程序中发生的事件。

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

// 使用createStore来创建store
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
