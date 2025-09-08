import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SignUp } from '../components/SignUp';

// 🧪 Mock fetch
global.fetch = jest.fn();

// 🧪 Mock useNavigate
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

describe('SignUp Component', () => {
  beforeEach(() => {
    fetch.mockClear();
    mockedNavigate.mockClear();
    jest.useFakeTimers(); // ✅ Control setTimeout
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('renders form inputs', () => {
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();

    const passwordInputs = screen.getAllByLabelText(/password/i);
    expect(passwordInputs.length).toBeGreaterThanOrEqual(2);
  });

  test('shows error if passwords do not match', async () => {
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'pass1' },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'pass2' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    // ✅ Use findAllByText instead of findByText
    const errors = await screen.findAllByText(/passwords do not match/i);
    expect(errors.length).toBeGreaterThan(0);
  });

  test('successful signup shows modal and navigates', async () => {
    fetch.mockResolvedValueOnce({
      status: 200,
      json: async () => ({ message: 'Signup successful' }),
    });

    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    // ✅ Check for success modal
    expect(await screen.findByText(/signup successful/i)).toBeInTheDocument();

    // ✅ Advance timers to trigger navigation
    jest.advanceTimersByTime(2000);

    // ✅ Wait for and assert navigation
    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith('/signin');
    });
  });
});
