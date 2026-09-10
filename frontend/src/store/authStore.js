import { create } from 'zustand';

const storedToken = localStorage.getItem('sevaconnect_token');
let storedUser = null;
try {
  const raw = localStorage.getItem('sevaconnect_user');
  if (raw) storedUser = JSON.parse(raw);
} catch (e) {
  console.error('Failed to parse stored user:', e);
}

export const useAuthStore = create((set) => ({
  token: storedToken || null,
  user: storedUser || null,
  isAuthenticated: !!storedToken && !!storedUser,
  role: storedUser?.role || null,

  setAuth: (token, user) => {
    localStorage.setItem('sevaconnect_token', token);
    localStorage.setItem('sevaconnect_user', JSON.stringify(user));
    set({
      token,
      user,
      isAuthenticated: true,
      role: user.role
    });
  },

  updateUser: (updatedUser) => {
    localStorage.setItem('sevaconnect_user', JSON.stringify(updatedUser));
    set((state) => ({
      user: updatedUser,
      role: updatedUser.role
    }));
  },

  setWorkerAvailability: (isAvailable) => {
    set((state) => {
      if (!state.user || !state.user.workerProfile) return state;
      const updatedUser = {
        ...state.user,
        workerProfile: {
          ...state.user.workerProfile,
          isAvailable
        }
      };
      localStorage.setItem('sevaconnect_user', JSON.stringify(updatedUser));
      return { user: updatedUser };
    });
  },

  logout: () => {
    localStorage.removeItem('sevaconnect_token');
    localStorage.removeItem('sevaconnect_user');
    set({
      token: null,
      user: null,
      isAuthenticated: false,
      role: null
    });
  }
}));
