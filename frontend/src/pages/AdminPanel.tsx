import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { itemService, Item } from '../services/itemService';
import { useAuth } from '../context/AuthContext';

const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [stats, setStats] = useState({
    totalItems: 0,
    totalPending: 0,
    totalVerified: 0,
    totalRejected: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'admin') {
      loadAllItems();
      loadStats();
    }
  }, [user]);

  const loadAllItems = async () => {
    try {
      setLoading(true);
      const response = await itemService.getAllItems();
      if (response.success && response.data) {
        setItems(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const loadStats = async () => {
    try {
      const response = await itemService.getAllItems();
      if (response.success && response.data) {
        const allItems = response.data.data || [];
        const pendingCount = allItems.filter((item: any) => item.verification_status === 'pending').length;
        const verifiedCount = allItems.filter((item: any) => item.verification_status === 'verified').length;
        const rejectedCount = allItems.filter((item: any) => item.verification_status === 'rejected').length;
        
        setStats({
          totalItems: allItems.length,
          totalPending: pendingCount,
          totalVerified: verifiedCount,
          totalRejected: rejectedCount
        });
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-red-500">Access denied. Admins only.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Panel</h1>
      
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link to="/admin/verification" className="bg-blue-50 p-4 rounded-lg hover:bg-blue-100 transition-colors">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">Items Pending Verification</h2>
          <p className="text-2xl font-bold text-blue-600">{stats.totalPending}</p>
        </Link>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-green-800 mb-2">Verified Items</h2>
          <p className="text-2xl font-bold text-green-600">{stats.totalVerified}</p>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Rejected Items</h2>
          <p className="text-2xl font-bold text-red-600">{stats.totalRejected}</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Total Items</h2>
          <p className="text-2xl font-bold text-gray-600">{stats.totalItems}</p>
        </div>
      </div>
      
      <div className="mb-6 bg-blue-50 p-4 rounded-lg">
        <h2 className="text-xl font-semibold text-blue-800 mb-2">Quick Actions</h2>
        <Link 
          to="/admin/verification" 
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Manage Item Verifications
        </Link>
      </div>
      
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Recent Items</h2>
      
      {items.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-600">No items found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.slice(0, 5).map(item => (
            <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                  <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                    item.type === 'lost' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {item.type.toUpperCase()}
                  </span>
                  <span className={`ml-2 inline-block px-2 py-1 text-xs font-semibold rounded ${
                    item.verification_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    item.verification_status === 'verified' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {item.verification_status.toUpperCase()}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">by {item.user?.name || 'Unknown'}</p>
                  <p className="text-sm text-gray-600">{new Date(item.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <p className="mt-2 text-gray-600">{item.description}</p>
              <div className="mt-3 flex items-center">
                <span className="text-sm text-gray-500 mr-4">
                  <i className="fas fa-map-marker-alt mr-1"></i>
                  {item.location}
                </span>
                <span className="text-sm text-gray-500">
                  Status: <span className="font-medium">{item.status}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;