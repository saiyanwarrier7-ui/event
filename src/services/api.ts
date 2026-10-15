import {
  UserProfile,
  TechnicalEvent,
  Registration,
  AdminStats,
  StudentListItem,
  TeamMember,
} from '../types';

const BASE_URL = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('nexustech_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const errorMsg = data?.error || `Request failed with status ${res.status}`;
    throw new Error(errorMsg);
  }

  return data as T;
}

export const api = {
  // Auth
  async login(email: string, password: string): Promise<{ token: string; user: UserProfile }> {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async register(data: {
    full_name: string;
    email: string;
    password: string;
    college_name: string;
    department: string;
    year_of_study: string;
    phone: string;
  }): Promise<{ token: string; user: UserProfile; message: string }> {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getCurrentUser(): Promise<{ user: UserProfile }> {
    return request('/auth/me');
  },

  async updateProfile(data: Partial<UserProfile>): Promise<{ message: string; user: UserProfile }> {
    return request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Events
  async getEvents(params?: {
    category?: string;
    search?: string;
    status?: string;
    includeDrafts?: boolean;
  }): Promise<{ events: TechnicalEvent[] }> {
    const query = new URLSearchParams();
    if (params?.category && params.category !== 'All') query.append('category', params.category);
    if (params?.search) query.append('search', params.search);
    if (params?.status) query.append('status', params.status);
    if (params?.includeDrafts) query.append('includeDrafts', 'true');

    const qs = query.toString() ? `?${query.toString()}` : '';
    return request(`/events${qs}`);
  },

  async getEventById(id: string): Promise<{ event: TechnicalEvent }> {
    return request(`/events/${id}`);
  },

  async createEvent(eventData: Partial<TechnicalEvent>): Promise<{ event: TechnicalEvent; message: string }> {
    return request('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  },

  async updateEvent(id: string, updates: Partial<TechnicalEvent>): Promise<{ event: TechnicalEvent; message: string }> {
    return request(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async deleteEvent(id: string): Promise<{ message: string }> {
    return request(`/events/${id}`, {
      method: 'DELETE',
    });
  },

  async updateEventStatus(id: string, status: string): Promise<{ event: TechnicalEvent; message: string }> {
    return request(`/events/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // Registrations
  async getMyRegistrations(): Promise<{ registrations: Registration[] }> {
    return request('/registrations/my');
  },

  async registerForEvent(data: {
    event_id: string;
    team_name?: string;
    team_members?: TeamMember[];
  }): Promise<{ registration: Registration; message: string }> {
    return request('/registrations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async cancelRegistration(id: string): Promise<{ message: string }> {
    return request(`/registrations/${id}/cancel`, {
      method: 'PATCH',
    });
  },

  // Admin
  async getAdminStats(): Promise<{ stats: AdminStats }> {
    return request('/admin/stats');
  },

  async getAdminRegistrations(params?: {
    eventId?: string;
    status?: string;
    search?: string;
  }): Promise<{ registrations: Registration[] }> {
    const query = new URLSearchParams();
    if (params?.eventId) query.append('eventId', params.eventId);
    if (params?.status && params.status !== 'All') query.append('status', params.status);
    if (params?.search) query.append('search', params.search);

    const qs = query.toString() ? `?${query.toString()}` : '';
    return request(`/admin/registrations${qs}`);
  },

  async updateRegistrationStatus(id: string, status: string): Promise<{ registration: Registration; message: string }> {
    return request(`/admin/registrations/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  async getAdminStudents(): Promise<{ students: StudentListItem[] }> {
    return request('/admin/students');
  },

  async exportRegistrationsCsv(eventId: string, eventTitle: string) {
    const token = localStorage.getItem('nexustech_token');
    const res = await fetch(`${BASE_URL}/admin/events/${eventId}/export-csv`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!res.ok) {
      throw new Error('Failed to export CSV. Please try again.');
    }

    const blob = await res.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `${eventTitle.replace(/[^a-zA-Z0-9_-]/g, '_')}_registrations.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(downloadUrl);
  },

  // Banner Presets & Upload
  async getBannerPresets(): Promise<{ presets: { title: string; category: string; url: string }[] }> {
    return request('/banners/presets');
  },

  async uploadBanner(file: File): Promise<{ url: string; message: string }> {
    const formData = new FormData();
    formData.append('banner', file);

    const token = localStorage.getItem('nexustech_token');
    const res = await fetch(`${BASE_URL}/upload/banner`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.error || 'Failed to upload image.');
    }
    return data;
  },

  // System & Database info
  async getSystemInfo(): Promise<any> {
    return request('/system/info');
  },
};
