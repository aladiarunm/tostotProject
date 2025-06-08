// // api/brands.js

import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api/brands';

export const getBrands = async () => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    const response = await axios.get(`${API_BASE_URL}/data`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    console.log("Inside get brands");
    console.log("Raw brand data:", response.data);

    if (response.data) {
    // const data = Array.isArray(response.data) 
    //     ? response.data 
    //     : response.data.brands || [];

    return {
        success: true,
         data: response.data.data // <-- directly return the array
    };
    }
    return {
      success: false,
      message: (response.data && response.data.message) || 'Failed to fetch brands'
      
    };
  } catch (error) {
    let errorMessage = 'An error occurred while fetching brands';

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

export const addBrand = async (brandData) => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    const response = await axios.post(`${API_BASE_URL}/addBrand`, brandData, {
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
        message: response.data.message || 'Failed to add brand'
      };
    }
  } catch (error) {
    let errorMessage = 'An error occurred while adding brand';

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

export const updateBrand = async (id, brandData) => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    const response = await axios.put(`${API_BASE_URL}/updateBrand/${id}`, brandData, {
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
        message: response.data.message || 'Failed to update brand'
      };
    }
  } catch (error) {
    let errorMessage = 'An error occurred while updating brand';

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

export const deleteBrand = async (id) => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    const response = await axios.delete(`${API_BASE_URL}/deleteBrand/${id}`, {
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
        message: response.data.message || 'Failed to delete brand'
      };
    }
  } catch (error) {
    let errorMessage = 'An error occurred while deleting brand';

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


// mock api

// let brands = [
//   {
//     id: 1,
//     name: 'Cotton Classics',
//     description: 'Premium cotton apparel and fabrics',
//     status: 'A', // 'A' for active, 'I' for inactive, 'D' for deleted
//     created_on: new Date().toISOString(),
//     last_modified_on: new Date().toISOString(),
//   },
//   {
//     id: 2,
//     name: 'Silk & Satin',
//     description: 'Luxury silk and satin textile products',
//     status: 'A',
//     created_on: new Date().toISOString(),
//     last_modified_on: new Date().toISOString(),
//   },
//   {
//     id: 3,
//     name: 'Denim Dynasty',
//     description: 'Quality denim wear and accessories',
//     status: 'I',
//     created_on: new Date().toISOString(),
//     last_modified_on: new Date().toISOString(),
//   },
//   {
//     id: 4,
//     name: 'Wool Wonders',
//     description: 'Cozy wool textiles and knitwear',
//     status: 'A',
//     created_on: new Date().toISOString(),
//     last_modified_on: new Date().toISOString(),
//   },
//   {
//     id: 5,
//     name: 'Linen Legacy',
//     description: 'Breathable linen fabrics and apparel',
//     status: 'A',
//     created_on: new Date().toISOString(),
//     last_modified_on: new Date().toISOString(),
//   },
// ];


// const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// export const getBrands = async () => {
//   await delay(700);
//   return { success: true, data: brands };
// };

// export const addBrand = async (newBrand) => {
//   await delay(500);
//   const id = brands.length ? Math.max(...brands.map((b) => b.id)) + 1 : 1;
//   const now = new Date().toISOString();
//   // By default, if status is not provided, we'll use 'A' (active)
//   const brand = { id, ...newBrand, status: newBrand.status || 'A', created_on: now, last_modified_on: now };
//   brands.push(brand);
//   return { success: true, data: brand };
// };

// export const updateBrand = async (id, updatedData) => {
//   await delay(500);
//   const index = brands.findIndex((b) => b.id === id);
//   if (index === -1) return { success: false, error: 'Brand not found' };

//   // Update the brand and modify its last_modified_on timestamp
//   const now = new Date().toISOString();
//   brands[index] = {
//     ...brands[index],
//     ...updatedData,
//     last_modified_on: now,
//   };
//   return { success: true, data: brands[index] };
// };

// export const deleteBrand = async (id) => {
//   await delay(500);
//   const index = brands.findIndex((b) => b.id === id);
//   if (index === -1) return { success: false, error: 'Brand not found' };

//   // Remove the brand from the array (or you could update its status to 'D' for deleted)
//   brands.splice(index, 1);
//   return { success: true };
// };
