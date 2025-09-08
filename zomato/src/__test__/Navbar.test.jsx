import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { NavBar } from '../components/NavBar';
import { CartContext } from '../contexts/CartContext';

const mockCart = {
  cartItems: [{ id: 1, name: 'Test Item' }],
};

describe('NavBar Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('renders logo and cart icon', () => {
    render(
      <CartContext.Provider value={mockCart}>
        <MemoryRouter>
          <NavBar />
        </MemoryRouter>
      </CartContext.Provider>
    );

    expect(screen.getByAltText(/zomato logo/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /cart/i })).toBeInTheDocument();
  });

  test('shows username when logged in', () => {
    localStorage.setItem('username', 'JohnDoe');

    render(
      <CartContext.Provider value={mockCart}>
        <MemoryRouter>
          <NavBar />
        </MemoryRouter>
      </CartContext.Provider>
    );

    expect(screen.getByText(/hi, JohnDoe/i)).toBeInTheDocument();
  });

  test('toggles suggestions on bell click', () => {
    render(
      <CartContext.Provider value={mockCart}>
        <MemoryRouter>
          <NavBar foodSuggestion="Pizza" />
        </MemoryRouter>
      </CartContext.Provider>
    );

    const bellButton = screen.getByRole('button');
    fireEvent.click(bellButton);

    expect(screen.getByText(/suggestions/i)).toBeInTheDocument();
    expect(screen.getByText(/pizza/i)).toBeInTheDocument();

    fireEvent.click(bellButton);
    expect(screen.queryByText(/suggestions/i)).not.toBeInTheDocument();
  });
});
