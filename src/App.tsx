import NonReactRedux from "./components/NonReactRedux"
import UseReactRedux from "./components/UseReactRedux"
import Init from "./components/Zustand/Init"

function App() {

  return (
    <>
    <h3>没有react_redux,直接使用redux</h3>
    <NonReactRedux />
    <br />
    <p>配合react_redux使用</p>
    <UseReactRedux />
    <div>zustand的使用</div>
    <Init />
    </>
  )
}

export default App
