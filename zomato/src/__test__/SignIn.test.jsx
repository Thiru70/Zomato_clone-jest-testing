import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SignIn } from '../components/SignIn';

global.fetch = jest.fn();

describe('SignIn Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders email and password inputs', () => {
    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/your email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  test('successful login shows modal', async () => {
    fetch.mockResolvedValueOnce({
      status: 200,
      json: async () => ({}),
    });

    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/your email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText(/login successful/i)).toBeInTheDocument();
  });

  test('failed login shows error modal', async () => {
  fetch.mockResolvedValueOnce({
    status: 401,
    json: async () => ({ message: 'Invalid credentials' }),
  });

  render(
    <MemoryRouter>
      <SignIn />
    </MemoryRouter>
  );

  fireEvent.change(screen.getByLabelText(/your email/i), {
    target: { value: 'wrong@example.com' },
  });
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: 'wrongpass' },
  });

  fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

  const errorMessages = await screen.findAllByText(/invalid credentials/i);
  expect(errorMessages.length).toBeGreaterThan(0);
});

});
