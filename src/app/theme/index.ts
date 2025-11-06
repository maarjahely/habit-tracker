import { createTheme } from '@mui/material/styles';

export const makeTheme = (mode: 'light' | 'dark') =>
  createTheme({
    palette: { mode },
    shape: { borderRadius: 14 },
  });
