# 1. react-redux配合`TypeScript`一起使用

## 1. 定义`RootState`和`Dispatch Types`

+ 使用`configureStore`不应该需要任何额外的类型。但是，您可能想要提取`RootState`类型和`Dispatch`类型，以便根据需要引用它们。从`store`本身推断这些类型意味着当您添加更多状态片段或修改中间件设置时，它们会正确更新。

```ts
import { configureStore } from '@reduxjs/toolkit'
// ...

const store = configureStore({
  reducer: {
    posts: postsReducer,
    comments: commentsReducer,
    users: usersReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
```