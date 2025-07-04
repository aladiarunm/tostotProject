// api/category.js

import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api/category';

export const getCategories = async () => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    const response = await axios.get(`${API_BASE_URL}/data`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    //console.log("Inside get brands");
    //console.log("Raw brand data:", response.data);

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
      message: (response.data && response.data.message) || 'Failed to fetch category'
      
    };
  } catch (error) {
    let errorMessage = 'An error occurred while fetching category';

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

export const addCategory = async (categoryData) => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    const response = await axios.post(`${API_BASE_URL}/addCategory`, categoryData, {
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
        message: response.data.message || 'Failed to add category'
      };
    }
  } catch (error) {
    let errorMessage = 'An error occurred while adding category';

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

export const updateCategory = async (id, categoryData) => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    const response = await axios.put(`${API_BASE_URL}/updateCategory/${id}`, categoryData, {
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
        message: response.data.message || 'Failed to update category'
      };
    }
  } catch (error) {
    let errorMessage = 'An error occurred while updating category';

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

export const deleteCategory = async (id) => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    const response = await axios.delete(`${API_BASE_URL}/deleteCategory/${id}`, {
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
        message: response.data.message || 'Failed to delete category'
      };
    }
  } catch (error) {
    let errorMessage = 'An error occurred while deleting category';

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

// let categories = [
//   {
//     id: 1,
//     name: 'Apparel',
//     description: 'Clothing and accessories',
//     status: 'A',
//     created_on: new Date().toISOString(),
//     last_modified_on: new Date().toISOString(),
//   },
//   {
//     id: 2,
//     name: 'Textiles',
//     description: 'Fabrics, yarns, and cloth materials',
//     status: 'I',
//     created_on: new Date().toISOString(),
//     last_modified_on: new Date().toISOString(),
//   },
//   {
//     id: 3,
//     name: 'Footwear',
//     description: 'Shoes, sandals, and related accessories',
//     status: 'A',
//     created_on: new Date().toISOString(),
//     last_modified_on: new Date().toISOString(),
//   },
//   {
//     id: 4,
//     name: 'Accessories',
//     description: 'Belts, scarves, hats, and other clothing accessories',
//     status: 'A',
//     created_on: new Date().toISOString(),
//     last_modified_on: new Date().toISOString(),
//   },
// ];

// const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// export const getCategories = async () => {
//   await delay(500);
//   return { success: true, data: categories };
// };

// export const addCategory = async (newCategory) => {
//   await delay(500);
//   const exists = categories.find(
//     (c) => c.name.toLowerCase() === newCategory.name.toLowerCase()
//   );
//   if (exists) return { success: false, error: 'Category name must be unique' };

//   const id = categories.length ? Math.max(...categories.map((c) => c.id)) + 1 : 1;
//   const now = new Date().toISOString();
//   const category = {
//     id,
//     name: newCategory.name,
//     description: newCategory.description || '',
//     status: newCategory.status || 'A',
//     created_on: now,
//     last_modified_on: now,
//   };
//   categories.push(category);
//   return { success: true, data: category };
// };

// export const updateCategory = async (id, updatedData) => {
//   await delay(500);
//   const index = categories.findIndex((c) => c.id === id);
//   if (index === -1) return { success: false, error: 'Category not found' };

//   // Check name uniqueness if changed
//   if (
//     updatedData.name &&
//     categories.some(
//       (c) =>
//         c.name.toLowerCase() === updatedData.name.toLowerCase() && c.id !== id
//     )
//   ) {
//     return { success: false, error: 'Category name must be unique' };
//   }

//   const now = new Date().toISOString();
//   categories[index] = {
//     ...categories[index],
//     ...updatedData,
//     last_modified_on: now,
//   };
//   return { success: true, data: categories[index] };
// };

// export const deleteCategory = async (id) => {
//   await delay(500);
//   const index = categories.findIndex((c) => c.id === id);
//   if (index === -1) return { success: false, error: 'Category not found' };

//   // Soft delete by setting status to 'D'
//   categories[index].status = 'D';
//   categories[index].last_modified_on = new Date().toISOString();
//   return { success: true };
// };
