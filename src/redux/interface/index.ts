export interface GlobalState{
  token:string,
}

export interface CounterState{
  count:number,
}

export interface AuthState{
  roleCode:number[]
}
export interface RootState{
  global:GlobalState,
  counter:CounterState,
  auth:AuthState
}