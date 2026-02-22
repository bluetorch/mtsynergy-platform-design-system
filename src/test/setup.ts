import '@testing-library/jest-dom/vitest';
// Mock ResizeObserver for headlessui components
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
} as unknown as typeof ResizeObserver;
