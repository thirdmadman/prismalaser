// This file serves as a central hub for re-exporting pre-typed Redux hooks.
import { useDispatch, useSelector, useStore } from 'react-redux';

import type { TAppDispatch, TAppStore, TRootState } from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<TAppDispatch>();
export const useAppSelector = useSelector.withTypes<TRootState>();
export const useAppStore = useStore.withTypes<TAppStore>();
