import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { itemService } from '../services/itemService';

interface Item {
  id: number;
  title: string;
  description: string;
  type: 'lost' | 'found';
  location: string;
  status: 'pending' | 'claimed' | 'resolved';
  contact_info: string | null;
  image_url: string | null;
  created_at: string;
  verification_status: 'pending' | 'verified' | 'rejected';
  verification_notes?: string;
  verified_by?: number;
  verified_at?: string;
  verifier?: {
    id: number;
    name: string;
    email: string;
  };
}

const MyItems: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyItems();
  }, []);

  const fetchMyItems = async () => {
    try {
      setLoading(true);
      const response = await itemService.getMyItems();
      setItems(response.data || []);
    } catch (error) {
      console.error('Error fetching my items:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Items</h1>
        <Link 
          to="/items/new" 
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Report New Item
        </Link>
      </div>
      
      {items.length > 0 ? (
        <div className="space-y-4">
          {items.map(item => (
            <div key={item.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center mb-2">
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                    <span className={`ml-4 px-2 py-1 rounded-full text-xs ${
                      item.type === 'lost' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                    </span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                      item.status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : item.status === 'claimed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                    }`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                      item.verification_status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : item.verification_status === 'verified'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {item.verification_status.charAt(0).toUpperCase() + item.verification_status.slice(1)}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-2">{item.description}</p>
                  
                  {item.image_url && (
                    <div className="mb-3">
                      <img 
                        src={item.image_url} 
                        alt={item.title}
                        className="max-h-40 max-w-full object-contain border rounded-md"
                      />
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span>📍 {item.location}</span>
                    <span>📅 {new Date(item.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Link 
                    to={`/items/${item.id}/edit`} 
                    className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition"
                  >
                    Edit
                  </Link>
                  <Link 
                    to={`/items/${item.id}`} 
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">You haven't reported any items yet</p>
          <Link to="/items/new" className="text-blue-600 hover:underline mt-4 inline-block">
            Report your first item
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyItems;