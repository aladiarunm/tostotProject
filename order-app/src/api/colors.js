// api/colors.js

import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api/colors';

export const getColors = async () => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    const response = await axios.get(`${API_BASE_URL}/data`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    console.log("Inside get colors");
    console.log("Raw color data:", response.data);

    if (response.data) {
    // const data = Array.isArray(response.data) 
    //     ? response.data 
    //     : response.data.colors || [];

    return {
        success: true,
         data: response.data.data // <-- directly return the array
    };
    }
    return {
      success: false,
      message: (response.data && response.data.message) || 'Failed to fetch colors'
      
    };
  } catch (error) {
    let errorMessage = 'An error occurred while fetching colors';

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

export const addColor = async (colorData) => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    const response = await axios.post(`${API_BASE_URL}/addColor`, colorData, {
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
        message: response.data.message || 'Failed to add color'
      };
    }
  } catch (error) {
    let errorMessage = 'An error occurred while adding color';

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

export const updateColor = async (id, colorData) => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    const response = await axios.put(`${API_BASE_URL}/updateColor/${id}`, colorData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data) {
      return {
        success: true,
        data: response.data.data
      };
    } else {
      return {
        success: false,
        message: response.data.message || 'Failed to update color'
      };
    }
  } catch (error) {
    let errorMessage = 'An error occurred while updating color';

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

export const deleteColor = async (id) => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    const response = await axios.delete(`${API_BASE_URL}/deleteColor/${id}`, {
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
        message: response.data.message || 'Failed to delete color'
      };
    }
  } catch (error) {
    let errorMessage = 'An error occurred while deleting color';

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


// // mock api

// let colors = [
//   {
//     id: 1,
//     name: "Red",
//     code: "#FF0000",
//     description: "Bright red color",
//     status: "A",
//     created_on: "2025-06-17T10:30:00",
//     last_modified_on: "2025-06-17T10:30:00"
//   },
//   {
//     id: 2,
//     name: "Green",
//     code: "#00FF00",
//     description: "Natural green color",
//     status: "A",
//     created_on: "2025-06-17T10:35:00",
//     last_modified_on: "2025-06-17T10:35:00"
//   },
//   {
//     id: 3,
//     name: "Blue",
//     code: "#0000FF",
//     description: "Ocean blue shade",
//     status: "I",
//     created_on: "2025-06-17T10:40:00",
//     last_modified_on: "2025-06-17T10:45:00"
//   },
//   {
//     id: 4,
//     name: "Black",
//     code: "#000000",
//     description: "Standard black color",
//     status: "D",
//     created_on: "2025-06-17T10:50:00",
//     last_modified_on: "2025-06-17T10:50:00"
//   }
// ]


// const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// export const getColors = async () => {
//   await delay(700);
//   return { success: true, data: colors };
// };

// export const addColor = async (newColor) => {
//   await delay(500);
//   const id = colors.length ? Math.max(...colors.map((b) => b.id)) + 1 : 1;
//   const now = new Date().toISOString();
//   // By default, if status is not provided, we'll use 'A' (active)
//   const color = { id, ...newColor, status: newColor.status || 'A', created_on: now, last_modified_on: now };
//   colors.push(color);
//   return { success: true, data: color };
// };

// export const updateColor = async (id, updatedData) => {
//   await delay(500);
//   const index = colors.findIndex((b) => b.id === id);
//   if (index === -1) return { success: false, error: 'Color not found' };

//   // Update the color and modify its last_modified_on timestamp
//   const now = new Date().toISOString();
//   colors[index] = {
//     ...colors[index],
//     ...updatedData,
//     last_modified_on: now,
//   };
//   return { success: true, data: colors[index] };
// };

// export const deleteColor = async (id) => {
//   await delay(500);
//   const index = colors.findIndex((b) => b.id === id);
//   if (index === -1) return { success: false, error: 'Color not found' };

//   // Remove the color from the array (or you could update its status to 'D' for deleted)
//   colors.splice(index, 1);
//   return { success: true };
// };
