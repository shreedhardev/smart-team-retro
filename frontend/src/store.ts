import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WhiteboardState {
  lines: any[];
}
const initialState: WhiteboardState = { lines: [] };

const whiteboardSlice = createSlice({
  name: 'whiteboard',
  initialState,
  reducers: {
    setLines(state, action: PayloadAction<any[]>) {
      state.lines = action.payload;
    },
    addLine(state, action: PayloadAction<any>) {
      state.lines.push(action.payload);
    }
  }
});

export const { setLines, addLine } = whiteboardSlice.actions;

export const store = configureStore({
  reducer: {
    whiteboard: whiteboardSlice.reducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;