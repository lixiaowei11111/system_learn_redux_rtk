import useStore from "../../zustand"
const Init = () => {

  const bears=useStore<{bears:number}>(state=>state.bears)

  return (
    <div>Init</div>
  )
}

export default Init