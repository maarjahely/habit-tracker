import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, TextField, Chip } from '@mui/material';
import { useState } from 'react';

interface Props { open: boolean; onClose: () => void; onSubmit: (title: string, tags: string[]) => void }

export default function AddHabitDialog({ open, onClose, onSubmit }: Props) {
  const [title, setTitle] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const addTag = () => {
    const t = tagInput.trim();
    if (!t) return;
    if (!tags.includes(t)) setTags([...tags, t]);
    setTagInput('');
  };

  const submit = () => {
    if (!title.trim()) return;
    onSubmit(title.trim(), tags);
    setTitle(''); setTags([]); setTagInput(''); onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Add Habit</DialogTitle>
      <DialogContent>
        <Stack gap={2} mt={1}>
          <TextField label="Title" value={title} onChange={e => setTitle(e.target.value)} autoFocus />
          <Stack direction="row" gap={1}>
            <TextField label="Add tag" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTag()} />
            <Button onClick={addTag}>Add</Button>
          </Stack>
          <Stack direction="row" gap={1} flexWrap="wrap">
            {tags.map(t => <Chip key={t} label={t} onDelete={() => setTags(tags.filter(x => x !== t))} />)}
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={submit}>Create</Button>
      </DialogActions>
    </Dialog>
  );
}
