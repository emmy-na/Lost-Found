import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
}

const ItemForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [item, setItem] = useState<Item | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'lost' as 'lost' | 'found',
    location: '',
    contact_info: '',
    status: 'pending' as 'pending' | 'claimed' | 'resolved',
  });
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      fetchItem();
    }
  }, [id]);

  const fetchItem = async () => {
    try {
      setLoading(true);
      const response = await itemService.getItemById(parseInt(id!));
      if (response.success) {
        const fetchedItem = response.data;
        setItem(fetchedItem);
        setFormData({
          title: fetchedItem.title,
          description: fetchedItem.description,
          type: fetchedItem.type,
          location: fetchedItem.location,
          contact_info: fetchedItem.contact_info || '',
          status: fetchedItem.status,
        });
        if (fetchedItem.image_url) {
          setPreviewUrl(fetchedItem.image_url);
        }
      }
    } catch (err) {
      setError('Failed to load item');
      console.error('Error fetching item:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setRemoveImage(false); // Reset remove image flag when new image is selected
      
      // Create a preview URL for the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImage(null);
      // If we're editing and removing the image, set preview to null
      if (isEditing) {
        setPreviewUrl(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const itemData = {
        ...formData,
        image: image || undefined,
        remove_image: removeImage
      };
      
      if (isEditing) {
        await itemService.updateItem(parseInt(id!), itemData);
      } else {
        await itemService.createItem(itemData);
      }
      
      navigate('/my-items');
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred while saving the item');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">{isEditing ? 'Edit Item' : 'Report an Item'}</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 mb-2">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="type" className="block text-gray-700 mb-2">Type *</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label htmlFor="location" className="block text-gray-700 mb-2">Location *</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 mb-2">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          ></textarea>
        </div>
        
        {isEditing && (
          <div className="mb-4">
            <label htmlFor="status" className="block text-gray-700 mb-2">Status *</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="pending">Pending</option>
              <option value="claimed">Claimed</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        )}
        
        <div className="mb-4">
          <label htmlFor="image" className="block text-gray-700 mb-2">Image (Optional)</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-gray-500 text-sm mt-1">Upload an image of the item (JPG, PNG, GIF, WEBP up to 10MB)</p>
          
          {(previewUrl || (isEditing && item?.image_url)) && (
            <div className="mt-4">
              <p className="text-gray-700 mb-2">Current Image:</p>
              <img 
                src={previewUrl || item?.image_url || ''}
                alt="Item" 
                className="max-h-64 max-w-full object-contain border rounded-md"
              />
              {isEditing && (
                <div className="mt-2">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={removeImage}
                      onChange={(e) => setRemoveImage(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700">Remove image</span>
                  </label>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="mb-6">
          <label htmlFor="contact_info" className="block text-gray-700 mb-2">Contact Info (Optional)</label>
          <input
            type="text"
            id="contact_info"
            name="contact_info"
            value={formData.contact_info}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-gray-500 text-sm mt-1">Phone number or email for interested parties to contact you</p>
        </div>
        
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-500 text-white py-2 px-6 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? (isEditing ? 'Updating...' : 'Submitting...') : (isEditing ? 'Update Item' : 'Submit Item')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ItemForm;