// API Configuration
const API_BASE_URL = 'https://blotter-backend-api.onrender.com/api';

// API Client
class APIClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  getToken() {
    return this.token;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(username, password, captchaToken) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password, captchaToken }),
    });

    if (data.success && data.data.token) {
      this.setToken(data.data.token);
    }

    return data;
  }

  async register(username, email, password, captchaToken) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password, captchaToken }),
    });
  }

  async verifyEmail(email, code) {
    const data = await this.request('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    });

    if (data.success && data.data.token) {
      this.setToken(data.data.token);
    }

    return data;
  }

  async resendCode(email) {
    return this.request('/auth/resend-code', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async completeProfile(userId, firstName, lastName, profilePhotoUri) {
    return this.request('/auth/complete-profile', {
      method: 'POST',
      body: JSON.stringify({ userId, firstName, lastName, profilePhotoUri }),
    });
  }

  async forgotPassword(email) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(email, code, newPassword) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, code, newPassword }),
    });
  }

  logout() {
    this.setToken(null);
    localStorage.removeItem('user');
  }

  // Reports endpoints
  async getReports() {
    return this.request('/reports');
  }

  async getReport(id) {
    return this.request(`/reports/${id}`);
  }

  async createReport(reportData) {
    return this.request('/reports', {
      method: 'POST',
      body: JSON.stringify(reportData),
    });
  }

  async updateReport(id, reportData) {
    return this.request(`/reports/${id}`, {
      method: 'PUT',
      body: JSON.stringify(reportData),
    });
  }

  async deleteReport(id) {
    return this.request(`/reports/${id}`, {
      method: 'DELETE',
    });
  }

  // Dashboard endpoints
  async getDashboardStats() {
    return this.request('/dashboard/stats');
  }

  // Officers endpoints
  async getOfficers() {
    return this.request('/officers');
  }

  async getOfficer(id) {
    return this.request(`/officers/${id}`);
  }

  // Hearings endpoints
  async getHearings() {
    return this.request('/hearings');
  }

  async createHearing(hearingData) {
    return this.request('/hearings', {
      method: 'POST',
      body: JSON.stringify(hearingData),
    });
  }

  // Notifications endpoints
  async getNotifications() {
    return this.request('/notifications');
  }

  async markNotificationRead(id) {
    return this.request(`/notifications/${id}/read`, {
      method: 'PATCH',
    });
  }

  // Upload endpoints
  async uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    const url = `${this.baseURL}/upload`;
    const headers = {};

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });

    return response.json();
  }
}

// Create global API instance
const api = new APIClient();

// Auth helpers
function isAuthenticated() {
  return !!api.getToken();
}

function getCurrentUser() {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

function setCurrentUser(user) {
  localStorage.setItem('user', JSON.stringify(user));
}

function requireAuth() {
  if (!isAuthenticated()) {
    window.location.href = '/login.html';
    return false;
  }
  return true;
}

// Toast notifications
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div style="display: flex; align-items: center; gap: 0.75rem;">
      <div style="font-weight: 600;">${message}</div>
      <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: var(--text-secondary); cursor: pointer; font-size: 1.25rem;">&times;</button>
    </div>
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 5000);
}

// Loading state
function showLoading(element) {
  const spinner = document.createElement('div');
  spinner.className = 'spinner';
  spinner.id = 'loading-spinner';
  element.appendChild(spinner);
}

function hideLoading() {
  const spinner = document.getElementById('loading-spinner');
  if (spinner) {
    spinner.remove();
  }
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Format status
function getStatusBadge(status) {
  const statusMap = {
    'pending': 'warning',
    'in_progress': 'info',
    'resolved': 'success',
    'closed': 'primary',
    'rejected': 'error',
  };

  const badgeType = statusMap[status] || 'primary';
  return `<span class="badge badge-${badgeType}">${status.replace('_', ' ')}</span>`;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { api, isAuthenticated, getCurrentUser, setCurrentUser, requireAuth, showToast, formatDate, getStatusBadge };
}
