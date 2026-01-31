import api from './api';

interface ItemData {
  title: string;
  description: string;
  type: 'lost' | 'found';
  location: string;
  contact_info?: string;
}

interface UpdateItemData {
  title?: string;
  description?: string;
  type?: 'lost' | 'found';
  location?: string;
  status?: 'pending' | 'claimed' | 'resolved';
  contact_info?: string;
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
    const response = await api.post('/items', data);
    return response.data;
  },

  async updateItem(id: number, data: UpdateItemData): Promise<ApiResponse<any>> {
    const response = await api.put(`/items/${id}`, data);
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
  }
};