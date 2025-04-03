import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';

// Mock window.matchMedia without using jest.fn()
window.matchMedia = (query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: () => {},
  removeListener: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => false,
});

// Cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
}); 