import api from './api';

interface ItemData {
  title: string;
  description: string;
  type: 'lost' | 'found';
  location: string;
  contact_info?: string;
  image?: File;
}

interface UpdateItemData {
  title?: string;
  description?: string;
  type?: 'lost' | 'found';
  location?: string;
  status?: 'pending' | 'claimed' | 'resolved';
  contact_info?: string;
  image?: File;
  remove_image?: boolean;
}

export interface Item {
  id: number;
  user_id: number;
  title: string;
  description: string;
  type: 'lost' | 'found';
  location: string;
  status: 'pending' | 'claimed' | 'resolved';
  contact_info?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
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

export interface VerificationData {
  verification_status: 'verified' | 'rejected';
  verification_notes?: string;
}

interface FilterParams {
  type?: string;
  location?: string;
  search?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export const itemService = {
  async getItems(filters?: FilterParams): Promise<ApiResponse<any>> {
    const params = new URLSearchParams();
    
    if (filters?.type) params.append('type', filters.type);
    if (filters?.location) params.append('location', filters.location);
    if (filters?.search) params.append('search', filters.search);
    
    const queryString = params.toString();
    const url = queryString ? `/items?${queryString}` : '/items';
    
    const response = await api.get(url);
    return response.data;
  },

  async getItemById(id: number): Promise<ApiResponse<any>> {
    const response = await api.get(`/items/${id}`);
    return response.data;
  },

  async createItem(data: ItemData): Promise<ApiResponse<any>> {
    const formData = new FormData();
    
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('type', data.type);
    formData.append('location', data.location);
    
    if (data.contact_info) {
      formData.append('contact_info', data.contact_info);
    }
    
    if (data.image) {
      formData.append('image', data.image);
    }
    
    const response = await api.post('/items', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },

  async updateItem(id: number, data: UpdateItemData): Promise<ApiResponse<any>> {
    const formData = new FormData();
    
    if (data.title) {
      formData.append('title', data.title);
    }
    if (data.description) {
      formData.append('description', data.description);
    }
    if (data.type) {
      formData.append('type', data.type);
    }
    if (data.location) {
      formData.append('location', data.location);
    }
    if (data.status) {
      formData.append('status', data.status);
    }
    if (data.contact_info) {
      formData.append('contact_info', data.contact_info);
    }
    if (data.image) {
      formData.append('image', data.image);
    }
    if (data.remove_image !== undefined) {
      formData.append('remove_image', String(data.remove_image));
    }
    
    const response = await api.put(`/items/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },

  async deleteItem(id: number): Promise<ApiResponse<any>> {
    const response = await api.delete(`/items/${id}`);
    return response.data;
  },

  async getMyItems(): Promise<ApiResponse<any>> {
    const response = await api.get('/my-items');
    return response.data;
  },

  // Admin-specific methods
  async getAllItems(): Promise<ApiResponse<any>> {
    const response = await api.get('/items'); // For admin, this would return all items
    return response.data;
  },

  async getItemsForVerification(): Promise<ApiResponse<any>> {
    const response = await api.get('/admin/items-for-verification');
    return response.data;
  },

  async verifyItem(id: number, data: VerificationData): Promise<ApiResponse<any>> {
    const response = await api.post(`/admin/verify-item/${id}`, data);
    return response.data;
  }
};