import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import CollectionDetails from '../components/CollectionDetails';
import { CartContext } from '../contexts/CartContext';


const collections = [
  {
    id: 1,
    title: 'Test Collection',
    description: 'Test description',
    items: [
      { id: 1, name: 'Item 1', price: 10, image: 'test.jpg' },
    ],
  },
];

const mockAddToCart = jest.fn();

describe('CollectionDetails Component', () => {
  test('renders collection info and items', () => {
    render(
      <CartContext.Provider value={{ addToCart: mockAddToCart }}>
        <MemoryRouter initialEntries={['/collection/1']}>
          <Routes>
            <Route path="/collection/:id" element={<CollectionDetails collections={collections} />} />
          </Routes>
        </MemoryRouter>
      </CartContext.Provider>
    );

    expect(screen.getByText(/test collection/i)).toBeInTheDocument();
    expect(screen.getByText(/test description/i)).toBeInTheDocument();
    expect(screen.getByText(/item 1/i)).toBeInTheDocument();
  });

  test('calls addToCart when button clicked', () => {
    render(
      <CartContext.Provider value={{ addToCart: mockAddToCart }}>
        <MemoryRouter initialEntries={['/collection/1']}>
          <Routes>
            <Route path="/collection/:id" element={<CollectionDetails collections={collections} />} />
          </Routes>
        </MemoryRouter>
      </CartContext.Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));
    expect(mockAddToCart).toHaveBeenCalledWith(collections[0].items[0]);
  });

  test('shows collection not found if invalid id', () => {
    render(
      <CartContext.Provider value={{ addToCart: mockAddToCart }}>
        <MemoryRouter initialEntries={['/collection/999']}>
          <Routes>
            <Route path="/collection/:id" element={<CollectionDetails collections={collections} />} />
          </Routes>
        </MemoryRouter>
      </CartContext.Provider>
    );

    expect(screen.getByText(/collection not found/i)).toBeInTheDocument();
  });
});
