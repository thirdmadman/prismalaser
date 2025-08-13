import { combineSlices, configureStore, createListenerMiddleware } from '@reduxjs/toolkit';

import { editorSlice, validateSchemaAsync } from './features/editor/editorSlice';
import { flowViewSlice, rearrangeNodes } from './features/flowView/flowViewSlice';
import type { Action, ThunkAction } from '@reduxjs/toolkit';

const rootReducer = combineSlices(editorSlice, flowViewSlice);
export type TRootState = ReturnType<typeof rootReducer>;

const listenerMiddleware = createListenerMiddleware();

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    // Adding the api middleware enables caching, invalidation, polling,
    // and other useful features of `rtk-query`.
    // middleware: (getDefaultMiddleware) => {
    //   return getDefaultMiddleware().concat(quotesApiSlice.middleware);
    // },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(listenerMiddleware.middleware),
  });
};

export type TAppStore = ReturnType<typeof makeStore>;
export type TAppDispatch = TAppStore['dispatch'];
export type TAppThunk<ThunkReturnType = void> = ThunkAction<ThunkReturnType, TRootState, unknown, Action>;

listenerMiddleware.startListening.withTypes<TRootState, TAppDispatch>()({
  predicate: (_action, currentState, previousState) => {
    return currentState.editor.dmmf !== previousState.editor.dmmf;
  },
  effect: (_action, listenerApi) => {
    const { editor } = listenerApi.getState();
    const { dmmf } = editor;

    listenerApi.dispatch(rearrangeNodes({ dmmf, layout: null }));
  },
});

listenerMiddleware.startListening.withTypes<TRootState, TAppDispatch>()({
  predicate: (_action, currentState, previousState) => {
    return currentState.editor.text !== previousState.editor.text;
  },
  effect: async (_action, listenerApi) => {
    const { editor } = listenerApi.getState();
    const { text } = editor;

    await listenerApi.delay(1000);

    try {
      console.log('object :>> ', text);
      localStorage.setItem('prismalaser.text', text);
    } catch (error) {
      console.error(error);
    }

    await listenerApi.dispatch(validateSchemaAsync(text));
  },
});
