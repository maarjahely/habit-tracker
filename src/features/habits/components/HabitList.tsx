import { Card, CardContent, Checkbox, Stack, Typography, IconButton, Chip, TextField, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectVisibleHabits, selectCompletedToday, toggleCompleteForDate, removeHabit, setSearch, setActiveTag } from '../habitsSlice';

export default function HabitList() {
  const dispatch = useAppDispatch();
  const habits = useAppSelector(selectVisibleHabits);
  const completed = useAppSelector(selectCompletedToday);

  const isDone = (id: string) => completed.includes(id);

  return (
    <Stack gap={2}>
      <Stack direction="row" gap={1} alignItems="center">
        <TextField size="small" label="Search habits" onChange={e => dispatch(setSearch(e.target.value))} />
        <Button onClick={() => dispatch(setActiveTag('all'))}>All</Button>
        {['health', 'work', 'mind'].map(t => (
          <Chip key={t} label={t} onClick={() => dispatch(setActiveTag(t))} />
        ))}
      </Stack>

      <Stack gap={1}>
        {habits.map(h => (
          <Card key={h.id} variant="outlined">
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack direction="row" gap={1} alignItems="center">
                  <Checkbox
                    checked={isDone(h.id)}
                    onChange={() => dispatch(toggleCompleteForDate({ habitId: h.id }))}
                  />
                  <div>
                    <Typography variant="subtitle1">{h.title}</Typography>
                    <Stack direction="row" gap={1} mt={0.5}>
                      {h.tags.map(t => <Chip key={t} size="small" label={t} />)}
                    </Stack>
                  </div>
                </Stack>
                <IconButton color="error" onClick={() => dispatch(removeHabit(h.id))}>
                  <DeleteIcon />
                </IconButton>
              </Stack>
            </CardContent>
          </Card>
        ))}
        {habits.length === 0 && (
          <Typography color="text.secondary">No habits yet — add one!</Typography>
        )}
      </Stack>
    </Stack>
  );
}
