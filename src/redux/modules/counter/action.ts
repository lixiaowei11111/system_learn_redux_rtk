
// // 2.设计action,action通常是一个包含type和payload的对象
// export const incrementAction = (payload: number) => {
//   return {
//     type: CounterActionTypeEnum.INCREMENT,
//     payload,
//   }
// }
// export const decrementAction = (payload: number) => {
//   return {
//     type: CounterActionTypeEnum.DECREMENT,
//     payload,
//   }
// }

// export const enum CounterActionTypeEnum {
//   INCREMENT = "increment",
//   DECREMENT = "decrement"
// }

// export type CounterAction = ReturnType<typeof incrementAction> | ReturnType<typeof decrementAction>;