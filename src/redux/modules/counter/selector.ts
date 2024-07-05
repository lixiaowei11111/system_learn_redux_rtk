import { RootState } from "../../interface"
//  配合react_redux使用, 
//做为useSelector hook的参数,相当于vuex的getter或者一个useMemo
export const selectCount=(state:RootState)=>state.counter.count