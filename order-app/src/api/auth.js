import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/admin/auth/login`, {
      username,
      password
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.data) {
      return {
        success: true,
        accessToken: response.data.accessToken,
        user: response.data.user
      };
    } else {
      return {
        success: false,
        message: response.data.message || 'Login failed'
      };
    }
  } catch (error) {
    let errorMessage = 'An error occurred during login';
    
    if (error.response) {
      //The request was made and the server responded with a status code
     // that falls out of the range of 2xx
      if (error.response.status === 401) {
        errorMessage = 'Invalid username or password';
      } else if (error.response.status === 400) {
        errorMessage = 'Bad request - please check your input';
      } else if (error.response.status >= 500) {
        errorMessage = 'Server error - please try again later';
      } else if (error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
    } else if (error.request) {
     // The request was made but no response was received
      errorMessage = 'Network error - please check your connection';
    }

    return {
      success: false,
      message: errorMessage
    };
  }
};

export const logout = async () => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    await axios.post(`${API_BASE_URL}/admin/auth/logout`, {}, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false };
  }
};


//Mock authentication API
// export const login = async (username, password) => {
//     // Simulate API call delay
//     await new Promise(resolve => setTimeout(resolve, 1000));

//     if (username === 'admin' && password === 'admin123') {
//       return {
//         success: true,
//         accessToken: 'mock-jwt-token-123456',
//         user: {
//           id: 1,
//           username: 'admin',
//           name: 'Admin User',
//           email: 'admin@example.com',
//           role: 'admin'
//         }
//       };
//     } else {
//       return {
//         success: false,
//         message: 'Invalid username or password'
//       };
//     }
//   };

//   export const logout = async () => {
//     // Simulate API call delay
//     await new Promise(resolve => setTimeout(resolve, 500));
//     return { success: true };
//   };