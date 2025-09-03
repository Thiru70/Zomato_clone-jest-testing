// src/components/Cart.jsx
import React from 'react';
import { useCart } from '../contexts/CartContext';

function Cart() {
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  // Safely calculate total
  const total = Array.isArray(cartItems)
    ? cartItems.reduce((sum, item) => {
        const price = typeof item.price === 'number' ? item.price : 0;
        const quantity = typeof item.quantity === 'number' ? item.quantity : 0;
        return sum + price * quantity;
      }, 0)
    : 0;

  // Empty cart fallback
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
        <p className="text-gray-600">Add some delicious items to your cart!</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-6">Your Cart</h2>
      <div className="bg-white rounded-lg shadow-md p-6">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center py-4 border-b">
            <img
              src={item.image || '/placeholder.png'}
              alt={item.name || 'Item'}
              className="w-20 h-20 object-cover rounded"
            />
            <div className="flex-grow ml-4">
              <h3 className="text-lg font-semibold">{item.name || 'Unnamed Item'}</h3>
              <p className="text-gray-600">
                £{typeof item.price === 'number' ? item.price.toFixed(2) : '0.00'}
              </p>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                -
              </button>
              <span className="mx-3">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                +
              </button>
              <button
                onClick={() => removeFromCart(item.id)}
                className="ml-4 text-red-500"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        <div className="mt-6 text-right">
          <div className="text-xl font-semibold">
            Total: £{total.toFixed(2)}
          </div>
          <button className="mt-4 bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition">
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
