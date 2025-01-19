import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import CreateTaskPage from '@/app/dashboard/tasks/create/page';

describe('CreateTaskPage', () => {
  it('should render task creation form', () => {
    render(<CreateTaskPage />);
    
    expect(screen.getByRole('heading', { name: /create task/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/start date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/end date/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create/i })).toBeInTheDocument();
  });

  it('should show validation errors for invalid input', async () => {
    render(<CreateTaskPage />);
    const user = userEvent.setup();

    // Try to submit empty form
    await user.click(screen.getByRole('button', { name: /create/i }));

    expect(await screen.findByText(/title is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/description is required/i)).toBeInTheDocument();
  });

  it('should validate date range', async () => {
    render(<CreateTaskPage />);
    const user = userEvent.setup();

    // Fill in title and description
    await user.type(screen.getByLabelText(/title/i), 'Test Task');
    await user.type(screen.getByLabelText(/description/i), 'Test Description');

    // Set end date before start date
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() - 1);

    await user.click(screen.getByLabelText(/start date/i));
    await user.click(screen.getByText(startDate.getDate().toString()));

    await user.click(screen.getByLabelText(/end date/i));
    await user.click(screen.getByText(endDate.getDate().toString()));

    await user.click(screen.getByRole('button', { name: /create/i }));

    expect(await screen.findByText(/end date must be after start date/i)).toBeInTheDocument();
  });

  it('should successfully create task with valid input', async () => {
    render(<CreateTaskPage />);
    const user = userEvent.setup();

    // Fill in form with valid data
    await user.type(screen.getByLabelText(/title/i), 'Test Task');
    await user.type(screen.getByLabelText(/description/i), 'Test Description');
    
    // Set valid date range
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 1);

    await user.click(screen.getByLabelText(/start date/i));
    await user.click(screen.getByText(startDate.getDate().toString()));

    await user.click(screen.getByLabelText(/end date/i));
    await user.click(screen.getByText(endDate.getDate().toString()));

    // Select status
    await user.click(screen.getByLabelText(/status/i));
    await user.click(screen.getByText(/pending/i));

    // Submit form
    await user.click(screen.getByRole('button', { name: /create/i }));

    // Should show success message or redirect
    await waitFor(() => {
      expect(screen.queryByText(/title is required/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/description is required/i)).not.toBeInTheDocument();
    });

    expect(await screen.findByText(/task created successfully/i)).toBeInTheDocument();
  });

  it('should handle API errors gracefully', async () => {
    // Mock API error response
    server.use(
      http.post('/api/tasks', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    render(<CreateTaskPage />);
    const user = userEvent.setup();

    // Fill in form with valid data
    await user.type(screen.getByLabelText(/title/i), 'Test Task');
    await user.type(screen.getByLabelText(/description/i), 'Test Description');
    await user.click(screen.getByRole('button', { name: /create/i }));

    expect(await screen.findByText(/failed to create task/i)).toBeInTheDocument();
  });
}); 