import type { PayloadAction } from '@reduxjs/toolkit';
import { createAppSlice } from '@/app/createAppSlice';

type TThemeVariants = 'dark' | 'light';

export interface IConfigsSliceState {
  theme: TThemeVariants;
  schemaEditorWidth: number | null;
}

const initialState: IConfigsSliceState = {
  theme: 'light',
  schemaEditorWidth: null,
};

// If you are not using async thunks you can use the standalone `createSlice`.
export const configsSlice = createAppSlice({
  name: 'configs',
  initialState,
  reducers: (create) => ({
    setTheme: create.reducer((state, action: PayloadAction<TThemeVariants>) => {
      state.theme = action.payload;
    }),
    setSchemaEditorWidth: create.reducer((state, action: PayloadAction<number | null>) => {
      state.schemaEditorWidth = action.payload;
    }),
  }),
  selectors: {
    selectTheme: (configs) => configs.theme,
    selectSchemaEditorWidth: (configs) => configs.schemaEditorWidth,
  },
});

export const { setTheme, setSchemaEditorWidth } = configsSlice.actions;
export const { selectTheme, selectSchemaEditorWidth } = configsSlice.selectors;
