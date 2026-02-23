import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup, act } from '@testing-library/react';
import { ThemeProvider } from './ThemeProvider';
import { useTheme } from './useTheme';

function ThemeConsumer() {
  const { preference, resolvedTheme, setPreference } = useTheme();

  return (
    <div>
      <div data-testid="preference">{preference}</div>
      <div data-testid="resolvedTheme">{resolvedTheme}</div>

      <button type="button" onClick={() => setPreference('light')}>
        set-light
      </button>
      <button type="button" onClick={() => setPreference('dark')}>
        set-dark
      </button>
      <button type="button" onClick={() => setPreference('system')}>
        set-system
      </button>
    </div>
  );
}

function renderWithProvider(props?: {
  storageKey?: string;
  defaultPreference?: 'system' | 'light' | 'dark';
}) {
  return render(
    <ThemeProvider storageKey={props?.storageKey} defaultPreference={props?.defaultPreference}>
      <ThemeConsumer />
    </ThemeProvider>
  );
}

function installMatchMediaMock(initialMatches: boolean) {
  let matches = initialMatches;
  const listeners = new Set<(event: { matches: boolean; media: string }) => void>();

  const addEventListener = vi.fn(
    (type: string, cb: (event: { matches: boolean; media: string }) => void) => {
      if (type === 'change') {
        listeners.add(cb);
      }
    }
  );

  const removeEventListener = vi.fn(
    (type: string, cb: (event: { matches: boolean; media: string }) => void) => {
      if (type === 'change') {
        listeners.delete(cb);
      }
    }
  );

  const addListener = vi.fn((cb: (event: { matches: boolean; media: string }) => void) => {
    listeners.add(cb);
  });

  const removeListener = vi.fn((cb: (event: { matches: boolean; media: string }) => void) => {
    listeners.delete(cb);
  });

  const mql = {
    media: '(prefers-color-scheme: dark)',
    get matches() {
      return matches;
    },
    onchange: null,
    addEventListener,
    removeEventListener,
    addListener,
    removeListener,
  } as unknown as MediaQueryList;

  const matchMedia = vi.fn((query: string) => {
    if (query !== '(prefers-color-scheme: dark)') {
      return mql;
    }
    return mql;
  });

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: matchMedia,
  });

  const setMatches = (nextMatches: boolean) => {
    matches = nextMatches;
  };

  const fireChange = () => {
    const event = { matches, media: '(prefers-color-scheme: dark)' };
    listeners.forEach((cb) => cb(event));
  };

  return {
    matchMedia,
    addEventListener,
    removeEventListener,
    addListener,
    removeListener,
    setMatches,
    fireChange,
  };
}

describe('ThemeProvider (web theming runtime)', () => {
  const originalMatchMedia = window.matchMedia;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-mts-theme');
  });

  afterEach(() => {
    cleanup();
    localStorage.clear();
    document.documentElement.removeAttribute('data-mts-theme');

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: originalMatchMedia,
    });
  });

  it('initializes from localStorage when stored preference is dark', async () => {
    installMatchMediaMock(false);
    localStorage.setItem('mts-theme', 'dark');

    renderWithProvider();

    await waitFor(() => expect(screen.getByTestId('preference')).toHaveTextContent('dark'));
    expect(screen.getByTestId('resolvedTheme')).toHaveTextContent('dark');
    expect(document.documentElement.getAttribute('data-mts-theme')).toBe('dark');
  });

  it('initializes from localStorage when stored preference is light', async () => {
    installMatchMediaMock(true);
    localStorage.setItem('mts-theme', 'light');

    renderWithProvider();

    await waitFor(() => expect(screen.getByTestId('preference')).toHaveTextContent('light'));
    expect(screen.getByTestId('resolvedTheme')).toHaveTextContent('light');
    expect(document.documentElement.hasAttribute('data-mts-theme')).toBe(false);
  });

  it('initializes from localStorage when stored preference is system and resolves via matchMedia', async () => {
    const { matchMedia } = installMatchMediaMock(true);
    localStorage.setItem('mts-theme', 'system');

    renderWithProvider();

    await waitFor(() => expect(screen.getByTestId('preference')).toHaveTextContent('system'));
    expect(matchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
    expect(screen.getByTestId('resolvedTheme')).toHaveTextContent('dark');
    expect(document.documentElement.getAttribute('data-mts-theme')).toBe('dark');
  });

  it('defaults to system when localStorage is missing and respects matchMedia', async () => {
    installMatchMediaMock(true);

    renderWithProvider();

    await waitFor(() => expect(screen.getByTestId('preference')).toHaveTextContent('system'));
    expect(screen.getByTestId('resolvedTheme')).toHaveTextContent('dark');
    expect(document.documentElement.getAttribute('data-mts-theme')).toBe('dark');
  });

  it('treats invalid localStorage value as missing and falls back to defaultPreference', async () => {
    installMatchMediaMock(false);
    localStorage.setItem('mts-theme', 'nope');

    renderWithProvider();

    await waitFor(() => expect(screen.getByTestId('preference')).toHaveTextContent('system'));
    expect(screen.getByTestId('resolvedTheme')).toHaveTextContent('light');
  });

  it('setPreference persists to localStorage and updates DOM attribute', async () => {
    installMatchMediaMock(false);

    renderWithProvider();

    await waitFor(() => expect(screen.getByTestId('preference')).toHaveTextContent('system'));

    fireEvent.click(screen.getByRole('button', { name: 'set-dark' }));

    await waitFor(() => expect(screen.getByTestId('preference')).toHaveTextContent('dark'));
    expect(localStorage.getItem('mts-theme')).toBe('dark');
    expect(screen.getByTestId('resolvedTheme')).toHaveTextContent('dark');
    expect(document.documentElement.getAttribute('data-mts-theme')).toBe('dark');

    fireEvent.click(screen.getByRole('button', { name: 'set-system' }));

    await waitFor(() => expect(screen.getByTestId('preference')).toHaveTextContent('system'));
    expect(localStorage.getItem('mts-theme')).toBeNull();
  });

  it('updates resolvedTheme + DOM when system preference changes and cleans up listener when leaving system', async () => {
    const { setMatches, fireChange, addEventListener, removeEventListener } =
      installMatchMediaMock(false);

    renderWithProvider();

    await waitFor(() => expect(screen.getByTestId('preference')).toHaveTextContent('system'));
    expect(addEventListener).toHaveBeenCalled();
    expect(screen.getByTestId('resolvedTheme')).toHaveTextContent('light');
    expect(document.documentElement.hasAttribute('data-mts-theme')).toBe(false);

    act(() => {
      setMatches(true);
      fireChange();
    });

    await waitFor(() => expect(screen.getByTestId('resolvedTheme')).toHaveTextContent('dark'));
    expect(document.documentElement.getAttribute('data-mts-theme')).toBe('dark');

    fireEvent.click(screen.getByRole('button', { name: 'set-light' }));

    await waitFor(() => expect(screen.getByTestId('preference')).toHaveTextContent('light'));
    expect(removeEventListener).toHaveBeenCalled();
  });
});
