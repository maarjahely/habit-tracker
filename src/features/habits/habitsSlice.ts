import { createSlice, createEntityAdapter, nanoid } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '../../app/store';

export type Habit = {
  id: string;
  title: string;
  tags: string[];
  createdAt: string;
  targetPerWeek?: number;
};

const habitsAdapter = createEntityAdapter<Habit>({
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
});

type ISODate = string;

type HabitsState = ReturnType<typeof habitsAdapter.getInitialState> & {
  logsByDate: Record<ISODate, string[]>;
  search: string;
  activeTag: string | 'all';
};

const initialState: HabitsState = {
  ...habitsAdapter.getInitialState(),
  logsByDate: {},
  search: '',
  activeTag: 'all',
};

const toISODate = (d = new Date()) => d.toISOString().slice(0, 10);

const habitsSlice = createSlice({
  name: 'habits',
  initialState,
  reducers: {
    addHabit: {
      prepare: (data: Omit<Habit, 'id' | 'createdAt'>) => ({
        payload: { ...data, id: nanoid(), createdAt: new Date().toISOString() } as Habit,
      }),
      reducer: (state, action: PayloadAction<Habit>) => {
        habitsAdapter.addOne(state, action.payload);
      },
    },
    removeHabit: habitsAdapter.removeOne,
    updateHabit: habitsAdapter.updateOne,
    setSearch: (state, action: PayloadAction<string>) => { state.search = action.payload; },
    setActiveTag: (state, action: PayloadAction<string | 'all'>) => { state.activeTag = action.payload; },

    toggleCompleteForDate: (state, action: PayloadAction<{ habitId: string; date?: ISODate }>) => {
      const { habitId, date = toISODate() } = action.payload;
      const day = state.logsByDate[date] ?? [];
      const idx = day.indexOf(habitId);
      if (idx >= 0) day.splice(idx, 1); else day.push(habitId);
      state.logsByDate[date] = day;
    },

    clearDay: (state, action: PayloadAction<{ date?: ISODate }>) => {
      const { date = toISODate() } = action.payload;
      state.logsByDate[date] = [];
    },
  },
});

export const {
  addHabit, removeHabit, updateHabit,
  setSearch, setActiveTag, toggleCompleteForDate, clearDay
} = habitsSlice.actions;

export default habitsSlice.reducer;

const baseSelectors = habitsAdapter.getSelectors<RootState>(s => s.habits);
export const selectAllHabits = baseSelectors.selectAll;
export const selectHabitById = baseSelectors.selectById;
export const selectLogsByDate = (state: RootState, dateISO: string) => state.habits.logsByDate[dateISO] ?? [];

export const selectCompletedToday = (state: RootState) => {
  const today = new Date();
  const iso = today.toISOString().slice(0, 10);
  return selectLogsByDate(state, iso);
};

export const selectVisibleHabits = (state: RootState) => {
  const q = state.habits.search.toLowerCase().trim();
  const tag = state.habits.activeTag;
  return selectAllHabits(state).filter(h => {
    const tagOK = tag === 'all' || h.tags.includes(tag);
    const qOK = !q || h.title.toLowerCase().includes(q);
    return tagOK && qOK;
  });
};
