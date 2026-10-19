import { createSlice } from "@reduxjs/toolkit";
import { User } from "../UtilClasses/Types";

const initialState: { currentUser: User | null } = {
  currentUser: null,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    // action.payload represents the user signing in or null if signing out
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
  },
});

export const { setCurrentUser } = accountSlice.actions;
export default accountSlice.reducer;
