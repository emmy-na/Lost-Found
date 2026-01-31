import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to Lost & Found</h1>
      <p className="text-lg mb-8 max-w-2xl mx-auto">
        Report lost items or found items to help reunite people with their belongings.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-blue-600">Report Lost Item</h2>
          <p className="mb-4">Have you lost something? Report it here so others can help you find it.</p>
          <Link 
            to="/items/new" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
          >
            Report Lost Item
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-green-600">Report Found Item</h2>
          <p className="mb-4">Found something? Report it here so the owner can claim it.</p>
          <Link 
            to="/items/new" 
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition"
          >
            Report Found Item
          </Link>
        </div>
      </div>
      
      <div className="mt-12">
        <Link 
          to="/items" 
          className="inline-block bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition"
        >
          Browse All Items
        </Link>
      </div>
    </div>
  );
};

export default Home;