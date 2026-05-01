import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { CopyLinkButton } from './CopyLinkButton';

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('CopyLinkButton', () => {
  it('renders Share button initially', () => {
    vi.stubGlobal('navigator', {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
    render(<CopyLinkButton />);
    expect(screen.getByTitle('Copy shareable link')).toBeInTheDocument();
    expect(screen.getByText('Share')).toBeInTheDocument();
  });

  it('shows Copied! after successful clipboard write', async () => {
    vi.stubGlobal('navigator', {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
    render(<CopyLinkButton />);
    await act(async () => {
      fireEvent.click(screen.getByTitle('Copy shareable link'));
    });
    expect(screen.getByText('Copied!')).toBeInTheDocument();
  });

  it('resets to Share after 2 seconds', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.stubGlobal('navigator', {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
    render(<CopyLinkButton />);
    await act(async () => {
      fireEvent.click(screen.getByTitle('Copy shareable link'));
    });
    expect(screen.getByText('Copied!')).toBeInTheDocument();
    await act(async () => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByText('Share')).toBeInTheDocument();
  });

  it('uses execCommand fallback when clipboard API rejects', async () => {
    vi.stubGlobal('navigator', {
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error('blocked')) },
    });
    Object.defineProperty(document, 'execCommand', {
      value: vi.fn().mockReturnValue(true),
      writable: true,
      configurable: true,
    });
    render(<CopyLinkButton />);
    await act(async () => {
      fireEvent.click(screen.getByTitle('Copy shareable link'));
    });
    expect(screen.getByText('Copied!')).toBeInTheDocument();
    expect(document.execCommand).toHaveBeenCalledWith('copy');
  });
});
