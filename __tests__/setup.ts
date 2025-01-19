import '@testing-library/jest-dom';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { server } from './mocks/server';

beforeAll(() => {
  // Start the MSW server before all tests
  server.listen({ onUnhandledRequest: 'error' });
});

afterAll(() => {
  // Clean up after all tests are done
  server.close();
});

afterEach(() => {
  // Reset any runtime request handlers we may add during the tests
  server.resetHandlers();
}); 