import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';


export const fetchProfile = async () => {
  console.log('inside profile.js')
  try {
    const accessToken = localStorage.getItem('accessToken');
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user || !user.id) {
      throw new Error('User not found');
    }

    const response = await axios.get(`${API_BASE_URL}/admin/auth/user/${user.id}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (response.data) {
      return {
        success: true,
        data: response.data
      };
    } else {
      return {
        success: false,
        message: response.data.message || 'Profile Fetch failed'
      };
    }
  } catch (error) {
    let errorMessage = 'An error occurred during fetch';
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response.status === 401) {
        errorMessage = 'Unauthorized';
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

export const updateProfile = async (formData) => {
  console.log('inside updateProfile in profile.js')
  try {
    const accessToken = localStorage.getItem('accessToken');
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user || !user.id) {
      throw new Error('User not found');
    }

    const updatedUser = {
      id: user.id,
      username: user.username,
      firstName: formData.firstName,
      lastName: formData.lastName,
      role: formData.role,
      email: formData.email,
      phone: formData.phone
    };

    const response = await axios.put(`${API_BASE_URL}/admin/auth/user`, 
      updatedUser, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data) {
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return {
        success: true,
        data: updatedUser
      };
    } else {
      return {
        success: false,
        message: response.data.message || 'Profile Update failed'
      };
    }
  } catch (error) {
    let errorMessage = 'An error occurred during update';
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response.status === 401) {
        errorMessage = 'Unauthorized';
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

export const updatePassword = async (newPassword) => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user || !user.id) {
      throw new Error('User not found');
    }

    const response = await axios.put(`${API_BASE_URL}/admin/auth/user/${user.id}/password`, {
      password: newPassword
    }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data) {
      return {
        success: true,
        data: response.data
      };
    } else {
      return {
        success: false,
        message: response.data.message || 'Password Update failed'
      };
    }
  } catch (error) {
    let errorMessage = 'An error occurred during update';
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response.status === 401) {
        errorMessage = 'Unauthorized';
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
