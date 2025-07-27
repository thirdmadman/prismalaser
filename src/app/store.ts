import { combineSlices, configureStore } from '@reduxjs/toolkit';

import { editorSlice } from './features/editor/editorSlice';
import type { Action, ThunkAction } from '@reduxjs/toolkit';

const rootReducer = combineSlices(editorSlice);
export type TRootState = ReturnType<typeof rootReducer>;

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    // Adding the api middleware enables caching, invalidation, polling,
    // and other useful features of `rtk-query`.
    // middleware: (getDefaultMiddleware) => {
    //   return getDefaultMiddleware().concat(quotesApiSlice.middleware);
    // },
  });
};

export type TAppStore = ReturnType<typeof makeStore>;
export type TAppDispatch = TAppStore['dispatch'];
export type TAppThunk<ThunkReturnType = void> = ThunkAction<ThunkReturnType, TRootState, unknown, Action>;
