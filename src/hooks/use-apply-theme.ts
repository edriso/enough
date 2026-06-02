import { useEffect } from 'react';
import { useEnoughStore } from '@/store/enough-store';

/** Reflects the theme and accent onto <html>. */
export function useApplyTheme(): void {
  const theme = useEnoughStore((state) => state.settings.theme);
  const accent = useEnoughStore((state) => state.settings.accent);
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.style.setProperty('--accent', accent);
  }, [theme, accent]);
}
