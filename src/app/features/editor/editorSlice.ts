import { formatSchema, validateSchema } from './editorAPI';
import type { DMMF } from '@prisma/generator-helper';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createAppSlice } from '@/app/createAppSlice';
import type { ISchemaError } from '@/shared/lib/types';

export interface IEditorSliceState {
  text: string;
  schemaErrors: Array<ISchemaError>;
  dmmf: DMMF.Datamodel | null;
  status: 'idle' | 'loading' | 'failed';
  isEditorOpened: boolean;
}

const initialState: IEditorSliceState = {
  text: '',
  schemaErrors: [],
  dmmf: null,
  status: 'idle',
  isEditorOpened: true,
};

// If you are not using async thunks you can use the standalone `createSlice`.
export const editorSlice = createAppSlice({
  name: 'editor',
  initialState,
  reducers: (create) => ({
    setText: create.reducer((state, action: PayloadAction<string>) => {
      state.text = action.payload;
    }),
    setIsEditorOpened: create.reducer((state, action: PayloadAction<boolean>) => {
      state.isEditorOpened = action.payload;
    }),
    setSchemaErrors: create.reducer((state, action: PayloadAction<Array<ISchemaError>>) => {
      state.schemaErrors = action.payload;
    }),
    setDmmf: create.reducer((state, action: PayloadAction<DMMF.Datamodel>) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
      state.dmmf = action.payload as any;
    }),
    validateSchemaAsync: create.asyncThunk(
      async (sourceString: string) => {
        const response = await validateSchema(sourceString);
        return response;
      },
      {
        pending: (state) => {
          state.status = 'loading';
        },
        fulfilled: (state, action) => {
          const { isOk, data } = action.payload;
          state.status = 'idle';
          if (isOk) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const dataObject = JSON.parse(data);

            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            state.dmmf = dataObject;
            state.schemaErrors = [];
          } else {
            console.error(action.payload);
            state.status = 'failed';
          }
        },
        rejected: (state) => {
          state.status = 'failed';
        },
      }
    ),
    formatSchemaAsync: create.asyncThunk(
      async (sourceString: string) => {
        const response = await formatSchema(sourceString);
        return response;
      },
      {
        pending: (state) => {
          state.status = 'loading';
        },
        fulfilled: (state, action) => {
          state.status = 'idle';
          const { isOk, data } = action.payload;

          if (isOk) {
            state.text = data;
            state.schemaErrors = [];
          } else {
            console.error(action.payload);
            state.status = 'failed';
          }
        },
        rejected: (state) => {
          state.status = 'failed';
        },
      }
    ),
  }),
  selectors: {
    selectStatus: (editor) => editor.status,
    selectText: (editor) => editor.text,
    selectSchemaErrors: (editor) => editor.schemaErrors,
    selectDmmf: (editor) => editor.dmmf,
    selectIsEditorOpened: (editor) => editor.isEditorOpened,
  },
});

export const { setText, setSchemaErrors, setDmmf, validateSchemaAsync, formatSchemaAsync, setIsEditorOpened } =
  editorSlice.actions;
export const { selectStatus, selectText, selectSchemaErrors, selectDmmf, selectIsEditorOpened } = editorSlice.selectors;
