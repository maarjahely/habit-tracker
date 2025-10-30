
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import habitsReducer from '../features/habits/habitsSlice';
import { loadState, saveState, throttle } from './persist';

const rootReducer = combineReducers({
  habits: habitsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const preloadedState: RootState | undefined = loadState<RootState>();

export const store = configureStore({
  reducer: rootReducer,
  preloadedState,
});

export type AppDispatch = typeof store.dispatch;

store.subscribe(
  throttle(() => {
    const state = store.getState();
    saveState<{ habits: RootState['habits'] }>({
      habits: state.habits
    });
  }, 800)
);
