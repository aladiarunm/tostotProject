// api/materials.js

import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api/materials';

export const getMaterials = async () => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    const response = await axios.get(`${API_BASE_URL}/data`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    console.log("Inside get materials");
    console.log("Raw material data:", response.data);

    if (response.data) {
    // const data = Array.isArray(response.data) 
    //     ? response.data 
    //     : response.data.materials || [];

    return {
        success: true,
         data: response.data.data // <-- directly return the array
    };
    }
    return {
      success: false,
      message: (response.data && response.data.message) || 'Failed to fetch materials'
      
    };
  } catch (error) {
    let errorMessage = 'An error occurred while fetching materials';

    if (error.response) {
      const status = error.response.status;
      const msg = error.response.data?.message;

      if (status === 401) errorMessage = 'Unauthorized';
      else if (status === 400) errorMessage = 'Bad request - please check your input';
      else if (status >= 500) errorMessage = 'Server error - please try again later';
      else if (msg) errorMessage = msg;
    } else if (error.request) {
      errorMessage = 'Network error - please check your connection';
    }

    // Optional: console.error(error);

    return {
      success: false,
      message: errorMessage
    };
  }
};

export const addMaterial = async (materialData) => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    const response = await axios.post(`${API_BASE_URL}/addMaterial`, materialData, {
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
        message: response.data.message || 'Failed to add material'
      };
    }
  } catch (error) {
    let errorMessage = 'An error occurred while adding material';

    if (error.response) {
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
      errorMessage = 'Network error - please check your connection';
    }

    return {
      success: false,
      message: errorMessage
    };
  }
};

export const updateMaterial = async (id, materialData) => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    const response = await axios.put(`${API_BASE_URL}/updateMaterial/${id}`, materialData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    console.log(response);
    if (response.data) {
      return {
        success: true,
        data: response.data.data
      };
    } else {
      return {
        success: false,
        message: response.data.message || 'Failed to update material'
      };
    }
  } catch (error) {
    let errorMessage = 'An error occurred while updating material';

    if (error.response) {
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
      errorMessage = 'Network error - please check your connection';
    }

    return {
      success: false,
      message: errorMessage
    };
  }
};

export const deleteMaterial = async (id) => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    const response = await axios.delete(`${API_BASE_URL}/deleteMaterial/${id}`, {
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
        message: response.data.message || 'Failed to delete material'
      };
    }
  } catch (error) {
    let errorMessage = 'An error occurred while deleting material';

    if (error.response) {
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
      errorMessage = 'Network error - please check your connection';
    }

    return {
      success: false,
      message: errorMessage
    };
  }
};