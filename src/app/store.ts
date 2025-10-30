// src/app/store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import habitsReducer from '../features/habits/habitsSlice';
import { loadState, saveState, throttle } from './persist';

// Combine reducers into one root reducer
const rootReducer = combineReducers({
  habits: habitsReducer,
});

// Root state type
export type RootState = ReturnType<typeof rootReducer>;

// Load state from localStorage
const preloadedState: RootState | undefined = loadState<RootState>();

// Create store
export const store = configureStore({
  reducer: rootReducer,
  preloadedState,
});

// Dispatch type
export type AppDispatch = typeof store.dispatch;

// Persist only what we need
store.subscribe(
  throttle(() => {
    const state = store.getState();
    saveState<{ habits: RootState['habits'] }>({
      habits: state.habits
    });
  }, 800)
);
