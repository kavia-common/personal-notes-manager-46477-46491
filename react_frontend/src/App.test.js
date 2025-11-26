import { render, screen } from '@testing-library/react';
import App from './App';

// PUBLIC_INTERFACE
// Smoke test: ensure the app renders the header brand title without runtime errors.
test('renders app header title', () => {
  render(<App />);
  const title = screen.getByText(/Personal Notes Manager/i);
  expect(title).toBeInTheDocument();
});
