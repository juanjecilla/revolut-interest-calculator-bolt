import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useHashAmount } from './useHashAmount';

beforeEach(() => {
  window.location.hash = '';
});

describe('useHashAmount', () => {
  it('defaults to 10000 when no hash present', () => {
    const { result } = renderHook(() => useHashAmount());
    expect(result.current.rawAmount).toBe('10000');
  });

  it('reads initial amount from URL hash', () => {
    window.location.hash = '#amount=25000';
    const { result } = renderHook(() => useHashAmount());
    expect(result.current.rawAmount).toBe('25000');
  });

  it('updates hash when setRawAmount called', () => {
    const { result } = renderHook(() => useHashAmount());
    act(() => {
      result.current.setRawAmount('50000');
    });
    expect(result.current.rawAmount).toBe('50000');
    expect(window.location.hash).toBe('#amount=50000');
  });

  it('ignores invalid hash values', () => {
    window.location.hash = '#amount=abc';
    const { result } = renderHook(() => useHashAmount());
    expect(result.current.rawAmount).toBe('10000');
  });

  it('ignores negative hash values', () => {
    window.location.hash = '#amount=-500';
    const { result } = renderHook(() => useHashAmount());
    expect(result.current.rawAmount).toBe('10000');
  });
});
