import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
  user: {
    id: number;
    name: string;
    email: string;
  };
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

const ItemDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      setLoading(true);
      const response = await itemService.getItemById(parseInt(id!));
      if (response.success) {
        setItem(response.data);
      } else {
        setError(response.message || 'Failed to load item');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred while fetching the item');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await itemService.deleteItem(parseInt(id!));
        navigate('/my-items');
      } catch (err: any) {
        setError(err.response?.data?.message || 'An error occurred while deleting the item');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <Link to="/items" className="text-blue-600 hover:underline">Back to Items</Link>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Item not found</p>
          <Link to="/items" className="text-blue-600 hover:underline mt-4 inline-block">
            Back to Items
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-3xl font-bold">{item.title}</h1>
        <Link to="/items" className="text-blue-600 hover:underline">← Back to Items</Link>
      </div>
      
      <div className="flex flex-wrap gap-6">
        <div className="flex-1 min-w-[300px]">
          {item.image_url && (
            <div className="mb-6">
              <img 
                src={item.image_url} 
                alt={item.title}
                className="w-full max-h-96 object-contain border rounded-md"
              />
            </div>
          )}
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Details</h2>
            <div className="space-y-3">
              <div>
                <span className="font-medium">Type:</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-sm ${
                  item.type === 'lost' 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                </span>
              </div>
              
              <div>
                <span className="font-medium">Status:</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-sm ${
                  item.status === 'pending' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : item.status === 'claimed'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                }`}>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </span>
              </div>
              
              <div>
                <span className="font-medium">Verification Status:</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-sm ${
                  item.verification_status === 'pending' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : item.verification_status === 'verified'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                }`}>
                  {item.verification_status.charAt(0).toUpperCase() + item.verification_status.slice(1)}
                </span>
              </div>
              
              {item.verification_notes && (
                <div>
                  <span className="font-medium">Verification Notes:</span> <span>{item.verification_notes}</span>
                </div>
              )}
              
              {item.verifier && (
                <div>
                  <span className="font-medium">Verified By:</span> <span>{item.verifier.name}</span>
                </div>
              )}
              
              {item.verified_at && (
                <div>
                  <span className="font-medium">Verified On:</span> <span>{new Date(item.verified_at).toLocaleDateString()}</span>
                </div>
              )}
              
              <div>
                <span className="font-medium">Location:</span> <span>{item.location}</span>
              </div>
              
              <div>
                <span className="font-medium">Posted by:</span> <span>{item.user.name}</span>
              </div>
              
              <div>
                <span className="font-medium">Posted on:</span> <span>{new Date(item.created_at).toLocaleDateString()}</span>
              </div>
              
              {item.contact_info && (
                <div>
                  <span className="font-medium">Contact Info:</span> <span>{item.contact_info}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex-1 min-w-[300px]">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{item.description}</p>
          
          <div className="mt-8">
            {user && item.user.id === user.id && ( // Compare with the authenticated user's ID
              <div className="flex space-x-4">
                <Link 
                  to={`/items/${item.id}/edit`} 
                  className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition"
                >
                  Edit
                </Link>
                <button 
                  onClick={handleDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;