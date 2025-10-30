import { AppBar, Toolbar, Typography, Container, Stack, Button } from '@mui/material';
import AddHabitDialog from './features/habits/components/AddHabitDialog';
import HabitList from './features/habits/components/HabitList';
import { useState } from 'react';
import { useAppDispatch } from './app/hooks';
import { addHabit } from './features/habits/habitsSlice';

function App() {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ gap: 2 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>habit-tracker</Typography>
          <Button color="inherit" onClick={() => setOpen(true)}>Add Habit</Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 3 }}>
        <Stack gap={3}>
          <HabitList />
        </Stack>
      </Container>

      <AddHabitDialog
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={(title, tags) => dispatch(addHabit({ title, tags, targetPerWeek: undefined }))}
      />
    </>
  );
}

export default App
