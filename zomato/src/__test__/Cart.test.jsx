import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Cart from '../components/Cart';
import { CartContext } from '../contexts/CartContext';



const mockCartItems = [
  {
    id: 1,
    name: 'Test Item',
    price: 5.5,
    quantity: 2,
    image: 'test.jpg',
  },
];

const mockRemoveFromCart = jest.fn();
const mockUpdateQuantity = jest.fn();

describe('Cart Component', () => {
  test('shows empty cart message when no items', () => {
    render(
      <CartContext.Provider
        value={{ cartItems: [], removeFromCart: jest.fn(), updateQuantity: jest.fn() }}
      >
        <Cart />
      </CartContext.Provider>
    );

    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });

  test('renders cart items and total', () => {
    render(
      <CartContext.Provider
        value={{
          cartItems: mockCartItems,
          removeFromCart: mockRemoveFromCart,
          updateQuantity: mockUpdateQuantity,
        }}
      >
        <Cart />
      </CartContext.Provider>
    );

    expect(screen.getByText(/test item/i)).toBeInTheDocument();
    expect(screen.getByText(/£5.50/)).toBeInTheDocument();
    expect(screen.getByText(/total: £11.00/i)).toBeInTheDocument();
  });

  test('calls updateQuantity and removeFromCart on button clicks', () => {
    render(
      <CartContext.Provider
        value={{
          cartItems: mockCartItems,
          removeFromCart: mockRemoveFromCart,
          updateQuantity: mockUpdateQuantity,
        }}
      >
        <Cart />
      </CartContext.Provider>
    );

    fireEvent.click(screen.getByText('-'));
    expect(mockUpdateQuantity).toHaveBeenCalledWith(1, 1);

    fireEvent.click(screen.getByText('+'));
    expect(mockUpdateQuantity).toHaveBeenCalledWith(1, 3);

    fireEvent.click(screen.getByText(/remove/i));
    expect(mockRemoveFromCart).toHaveBeenCalledWith(1);
  });
});
