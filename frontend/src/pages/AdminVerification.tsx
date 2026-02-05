import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { itemService, Item, VerificationData } from '../services/itemService';

const AdminVerification: React.FC = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [verificationNotes, setVerificationNotes] = useState<{[key: number]: string}>({});
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [itemToReject, setItemToReject] = useState<number | null>(null);

  useEffect(() => {
    if (user?.role === 'admin') {
      loadItems(currentPage);
    }
  }, [user, currentPage]);

  const loadItems = async (page: number) => {
    try {
      setLoading(true);
      const response = await itemService.getItemsForVerification();
      if (response.success && response.data) {
        setItems(response.data.data || []);
        setTotalPages(Math.ceil((response.data.total || 1) / 10));
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (itemId: number) => {
    try {
      const data: VerificationData = {
        verification_status: 'verified'
      };
      
      if (verificationNotes[itemId]) {
        data.verification_notes = verificationNotes[itemId];
      }
      
      const response = await itemService.verifyItem(itemId, data);
      if (response.success) {
        setItems(prev => prev.filter(item => item.id !== itemId));
        alert('Item verified successfully!');
      } else {
        alert(response.message || 'Failed to verify item');
      }
    } catch (error) {
      console.error('Error verifying item:', error);
      alert('Error verifying item');
    }
  };

  const handleReject = async () => {
    if (itemToReject === null) return;
    
    try {
      const data: VerificationData = {
        verification_status: 'rejected',
        verification_notes: verificationNotes[itemToReject] || ''
      };
      
      const response = await itemService.verifyItem(itemToReject, data);
      if (response.success) {
        setItems(prev => prev.filter(item => item.id !== itemToReject));
        alert('Item rejected successfully!');
      } else {
        alert(response.message || 'Failed to reject item');
      }
      setShowRejectModal(false);
      setItemToReject(null);
    } catch (error) {
      console.error('Error rejecting item:', error);
      alert('Error rejecting item');
    }
  };

  const handleNoteChange = (itemId: number, note: string) => {
    setVerificationNotes(prev => ({
      ...prev,
      [itemId]: note
    }));
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
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Verification Panel</h1>
      
      {items.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-600">No items pending verification.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {item.image_url && (
                    <div className="md:w-1/4">
                      <img 
                        src={item.image_url} 
                        alt={item.title} 
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <div className={`${item.image_url ? 'md:w-3/4' : 'w-full'}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-800">{item.title}</h2>
                        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                          item.type === 'lost' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {item.type.toUpperCase()}
                        </span>
                        <span className="ml-2 inline-block px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded">
                          PENDING VERIFICATION
                        </span>
                      </div>
                    </div>
                    
                    <p className="mt-2 text-gray-600">{item.description}</p>
                    
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Location</p>
                        <p className="text-gray-800">{item.location}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Owner</p>
                        <p className="text-gray-800">{item.user.name} ({item.user.email})</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Contact Info</p>
                        <p className="text-gray-800">{item.contact_info || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Submitted</p>
                        <p className="text-gray-800">{new Date(item.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <label htmlFor={`notes-${item.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Verification Notes (optional)
                      </label>
                      <textarea
                        id={`notes-${item.id}`}
                        value={verificationNotes[item.id] || ''}
                        onChange={(e) => handleNoteChange(item.id, e.target.value)}
                        placeholder="Enter verification notes..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={2}
                      />
                    </div>
                    
                    <div className="mt-4 flex space-x-3">
                      <button
                        onClick={() => handleVerify(item.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                      >
                        Verify Item
                      </button>
                      <button
                        onClick={() => {
                          setItemToReject(item.id);
                          setShowRejectModal(true);
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                      >
                        Reject Item
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                >
                  Previous
                </button>
                
                <span className="mx-2">
                  Page {currentPage} of {totalPages}
                </span>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'bg-gray-200 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </div>
      )}
      
      {/* Reject Confirmation Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Rejection</h3>
            <p className="text-gray-600 mb-4">Are you sure you want to reject this item?</p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVerification;