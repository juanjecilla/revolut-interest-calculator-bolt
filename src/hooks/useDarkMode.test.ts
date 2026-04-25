import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDarkMode } from './useDarkMode';

const STORAGE_KEY = 'revolut-calc-dark-mode';

beforeEach(() => {
  window.localStorage.clear();
  document.documentElement.classList.remove('dark');
});

afterEach(() => {
  window.localStorage.clear();
  document.documentElement.classList.remove('dark');
});

describe('useDarkMode', () => {
  it('initializes to light mode when no stored pref and system prefers light', () => {
    // matchMedia mock in setup.ts returns matches: false (light)
    const { result } = renderHook(() => useDarkMode());
    expect(result.current.dark).toBe(false);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('reads stored preference over system preference', () => {
    window.localStorage.setItem(STORAGE_KEY, 'true');
    const { result } = renderHook(() => useDarkMode());
    expect(result.current.dark).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('toggle flips dark state and updates DOM class', () => {
    const { result } = renderHook(() => useDarkMode());
    expect(result.current.dark).toBe(false);

    act(() => result.current.toggle());
    expect(result.current.dark).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    act(() => result.current.toggle());
    expect(result.current.dark).toBe(false);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('persists preference to localStorage on toggle', () => {
    const { result } = renderHook(() => useDarkMode());
    act(() => result.current.toggle());
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('true');

    act(() => result.current.toggle());
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('false');
  });
});
