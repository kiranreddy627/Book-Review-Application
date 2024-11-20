import axios from "axios";
class ApiService {
  constructor() {
    const REACT_APP_BACKEND_URL = "http://3.19.1.68:5000"
    this.api = axios.create({
      baseURL:"http://localhost:5000", // Replace with your actual API base URL
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Attach token if available
    const token = localStorage.getItem("token") || (sessionStorage.getItem("token"));
    if (token) {
      this.api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    // Interceptor to handle errors globally
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        // Customize error handling based on response status
        const customError = this.handleError(error);
        return Promise.reject(customError);
      }
    );
  }

  // Method to set authorization token dynamically
  setAuthToken(token) {
    if (token) {
      this.api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("token", JSON.stringify(token));
    } else {
      delete this.api.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
  }

  // Generic GET request
  async get(url, params = {}) {
    try {
      const response = await this.api.get(url, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Generic POST request// ApiService.js
async post(url, data) {
  try {
    const response = await this.api.post(url, data);
    return response; // Return the entire response data
  } catch (error) {
    // Optionally log error or handle specific error scenarios
    console.error("API call failed:", error);
    throw error; // Rethrow the error for further handling
  }
}

  // Generic PUT request
  async put(url, data) {
    try {
      const response = await this.api.put(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Generic DELETE request
  async delete(url) {
    try {
      const response = await this.api.delete(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Centralized error handling
  handleError(error) {
    if (error.response) {
      // Server error responses
      if (error.response.status === 401) {
        return new Error("Unauthorized. Please log in again.");
      } else if (error.response.status === 403) {
        return new Error("Forbidden. You don't have permission to perform this action.");
      } else if (error.response.status === 404) {
        return new Error("Resource not found.");
      } else {
        return new Error(error.response.data.message || "An error occurred.");
      }
    } else if (error.request) {
      // No response from the server
      return new Error("No response from the server. Please try again later.");
    } else {
      // Other errors
      return new Error("An unexpected error occurred.");
    }
  }
}

export default ApiService;
