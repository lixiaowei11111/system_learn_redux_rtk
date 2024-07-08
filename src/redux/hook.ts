import {useDispatch,useSelector } from "react-redux";
import type { AppDispatch,RootState } from "./index";

// 在整个应用中使用，而不是简单的使用 `useDispatch` 和 `useSelector`

export const useAppDispatch=useDispatch.withTypes<AppDispatch>()
export const useAppSelector=useSelector.withTypes<RootState>()