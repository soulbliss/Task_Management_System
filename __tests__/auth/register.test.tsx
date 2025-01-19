import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import RegisterPage from '@/app/register/page';

describe('RegisterPage', () => {
  it('should render registration form', () => {
    render(<RegisterPage />);
    
    expect(screen.getByRole('heading', { name: /register/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  it('should show validation errors for invalid input', async () => {
    render(<RegisterPage />);
    const user = userEvent.setup();

    // Try to submit empty form
    await user.click(screen.getByRole('button', { name: /register/i }));

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  });

  it('should show error for invalid email format', async () => {
    render(<RegisterPage />);
    const user = userEvent.setup();

    // Enter invalid email
    await user.type(screen.getByLabelText(/email/i), 'invalid-email');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /register/i }));

    expect(await screen.findByText(/invalid email format/i)).toBeInTheDocument();
  });

  it('should successfully register with valid credentials', async () => {
    render(<RegisterPage />);
    const user = userEvent.setup();

    // Enter valid credentials
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(screen.queryByText(/email is required/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/password is required/i)).not.toBeInTheDocument();
    });

    // Should show success message or redirect
    expect(await screen.findByText(/registration successful/i)).toBeInTheDocument();
  });
}); 