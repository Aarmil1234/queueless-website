// api.js
import axios from 'axios';

const liveUrl = 'https://medicarenew-0of0.onrender.com/medicare/';
// const localUrl = 'http://localhost:3000/medicare/';
// export const apiRequest = async (method, url, data = null, isFormData = false) => {
//   try {
//     const headers = isFormData
//       ? { 'Content-Type': 'multipart/form-data', 'apitoken': `3667dfe4a#660$89c516%20ee63ed$2db0c3` }
//       : { 'Content-Type': 'application/json', 'apitoken': `3667dfe4a#660$89c516%20ee63ed$2db0c3` };

//     // console.log("data=====", data);

//     const payload = isFormData ? convertToFormData(data) : data;
//     const response = await axios({
//       method,
//       url: localUrl + url,
//       data: payload,
//       headers
//     });

//     return response.data;

//   } catch (error) {
//     console.error('API Request Error:', error.response?.data?.message || error.message);
//     throw error.response?.data || { message: error.message };
//   }
// };

// Helper function to convert object to FormData

export const apiRequest = async (method, url, data = null, isFormData = false) => {
  try {
    const headers = {
      apitoken: '3667dfe4a#660$89c516%20ee63ed$2db0c3'
    };

    // Remove Content-Type so browser/axios can auto-set boundary
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await axios({
      method,
      url: liveUrl + url,
      data, // send FormData or JSON directly
      headers
    });

    return response.data;

  } catch (error) {
    console.error('API Request Error:', error.response?.data?.message || error.message);
    throw error.response?.data || { message: error.message };
  }
};


const convertToFormData = (data) => {
  const formData = new FormData();
  for (const key in data) {
    formData.append(key, data[key]);
  }
  return formData;
};
