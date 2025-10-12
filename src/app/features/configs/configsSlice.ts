import type { PayloadAction } from '@reduxjs/toolkit';
import { createAppSlice } from '@/app/createAppSlice';

type TThemeVariants = 'dark' | 'light';

export interface IConfigsSliceState {
  theme: TThemeVariants;
}

const initialState: IConfigsSliceState = {
  theme: 'light',
};

// If you are not using async thunks you can use the standalone `createSlice`.
export const configsSlice = createAppSlice({
  name: 'configs',
  initialState,
  reducers: (create) => ({
    setTheme: create.reducer((state, action: PayloadAction<TThemeVariants>) => {
      state.theme = action.payload;
    }),
  }),
  selectors: {
    selectTheme: (configs) => configs.theme,
  },
});

export const { setTheme } = configsSlice.actions;
export const { selectTheme } = configsSlice.selectors;
