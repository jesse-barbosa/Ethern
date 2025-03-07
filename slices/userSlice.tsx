import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  id: number;
  name: string;
  email: string;
  imageURL: string;
}

const initialState: UserState = {
  id: 0,
  name: '',
  email: '',
  imageURL: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.imageURL = action.payload.imageURL;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;