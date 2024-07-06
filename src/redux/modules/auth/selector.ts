import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../interface/index";

export const authSelector = createSelector(
  (state: RootState) => state.auth.roleCode,
  roleCode => roleCode.join(",")
)