// src/components/CollectionDetails.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

function CollectionDetails({ collections }) {
  const { id } = useParams();
  const { addToCart } = useCart();
  
  const collection = collections.find(c => c.id === parseInt(id));

  if (!collection) {
    return <div className="p-4">Collection not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{collection.title}</h1>
        <p className="text-gray-600">{collection.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collection.items.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
              <p className="text-gray-600 mb-4">£{item.price.toFixed(2)}</p>
              <button
                onClick={() => addToCart(item)}
                className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CollectionDetails;