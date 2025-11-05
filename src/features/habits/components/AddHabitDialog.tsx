import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, TextField, Chip } from '@mui/material';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (title: string, tags: string[]) => void;
}

const schema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  tags: z.array(z.object({ value: z.string().trim().min(1) })),
});

type FormValues = z.infer<typeof schema>;

export default function AddHabitDialog({ open, onClose, onSubmit }: Props) {
  const { control, handleSubmit, reset, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: { title: '', tags: [] },
  });

  const { errors, isValid, isDirty } = formState;

  const [tagInput, setTagInput] = useState('');

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tags',
  });

  const addTag = () => {
    const tag = tagInput.trim();
    if (!tag) return;
    if (!fields.some((field) => field.value === tag)) {
      append({ value: tag });
    }
    setTagInput('');
  };

  const submit = handleSubmit(({ title, tags }) => {
    onSubmit(
      title.trim(),
      tags.map((t) => t.value)
    );
    reset();
    setTagInput('');
    onClose();
  });

  const handleClose = () => {
    reset();
    setTagInput('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>Add Habit</DialogTitle>
      <DialogContent>
        <form onSubmit={submit} noValidate>
          <Stack gap={2} mt={1}>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Title"
                  {...field}
                  autoFocus
                  error={!!errors.title}
                  helperText={errors.title?.message}
                />
              )}
            />

            <Stack direction="row" gap={1}>
              <TextField
                label="Add tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <Button type="button" onClick={addTag}>
                Add
              </Button>
            </Stack>

            <Stack direction="row" gap={1} flexWrap="wrap">
              {fields.map((field, idx) => (
                <Chip key={field.id} label={field.value} onDelete={() => remove(idx)} />
              ))}
            </Stack>
          </Stack>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={submit} disabled={!isDirty || !isValid}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
