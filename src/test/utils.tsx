import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ErrorBoundary } from '../components/ErrorBoundary';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Mock chrome.storage.local
const mockChromeStorage = {
  get: vi.fn(),
  set: vi.fn(),
  remove: vi.fn(),
};

// Mock chrome object
global.chrome = {
  storage: {
    local: mockChromeStorage,
  },
} as any;

export * from '@testing-library/react';
export { customRender as render, mockChromeStorage }; 