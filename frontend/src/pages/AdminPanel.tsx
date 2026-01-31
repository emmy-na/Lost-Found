import React, { useState, useEffect } from 'react';
import { itemService } from '../services/itemService';

interface Item {
  id: number;
  title: string;
  description: string;
  type: 'lost' | 'found';
  location: string;
  status: 'pending' | 'claimed' | 'resolved';
  contact_info: string | null;
  user: {
    id: number;
    name: string;
    email: string;
  };
  created_at: string;
}

const AdminPanel: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllItems();
  }, []);

  const fetchAllItems = async () => {
    try {
      setLoading(true);
      const response = await itemService.getAllItems(); // This would be an admin-specific endpoint
      setItems(response.data.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateItemStatus = async (itemId: number, newStatus: 'pending' | 'claimed' | 'resolved') => {
    try {
      await itemService.updateItem(itemId, { status: newStatus });
      // Refresh the list
      fetchAllItems();
    } catch (error) {
      console.error('Error updating item status:', error);
    }
  };

  const deleteItem = async (itemId: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await itemService.deleteItem(itemId);
        // Refresh the list
        fetchAllItems();
      } catch (error) {
        console.error('Error deleting item:', error);
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

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Title</th>
              <th className="py-3 px-4 text-left">Type</th>
              <th className="py-3 px-4 text-left">Location</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">User</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="py-3 px-4">{item.id}</td>
                <td className="py-3 px-4">{item.title}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    item.type === 'lost' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                  </span>
                </td>
                <td className="py-3 px-4">{item.location}</td>
                <td className="py-3 px-4">
                  <select
                    value={item.status}
                    onChange={(e) => updateItemStatus(item.id, e.target.value as any)}
                    className={`px-2 py-1 rounded text-xs ${
                      item.status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : item.status === 'claimed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                    }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="claimed">Claimed</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </td>
                <td className="py-3 px-4">{item.user.name} ({item.user.email})</td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="text-red-600 hover:text-red-800 mr-3"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {items.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No items found</p>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;