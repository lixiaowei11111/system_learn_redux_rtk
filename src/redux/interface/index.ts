export interface GlobalState{
  token:string,
}

export interface CounterState{
  count:number,
}
export interface RootState{
  global:GlobalState,
  counter:CounterState,
}