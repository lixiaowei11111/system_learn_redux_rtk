import { create } from "zustand";



const useStore=create((set)=>{
  return{
    bears:0,
    increasePopulation:()=>set((state: { bears: number; })=>({bears:state.bears+1})),
    removeAllBears:()=>set({bears:0}),
    updateBears:(newBears:number)=>set({bears:newBears})
  }
})

export default useStore;