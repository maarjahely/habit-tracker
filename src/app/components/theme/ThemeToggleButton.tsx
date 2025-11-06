import { IconButton } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useThemeMode } from '../../theme/ThemeProvider';

export function ThemeToggleButton() {
  const { mode, toggle } = useThemeMode();

  return <IconButton onClick={toggle}>{mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}</IconButton>;
}
