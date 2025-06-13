import axios from "axios";

const API_URL = "http://localhost:8000/api/v1/users";

//api instance
export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (originalRequest.url.includes("/refresh-token")) {
      // console.log("Refresh token failed, loggin out...");
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // console.log("Token expired, refreshing token...");
        const newToken = await refreshToken();
        if (newToken) {
          // console.log("Token refreshed, retrying original request...");
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
        // console.log("Token refresh failed, rejecting request...");
        return Promise.reject(error);
      } catch (refreshError) {
        // console.log("Token refresh error: ", refreshError);
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// This one : is correct if you're already using the custom api instance:
// headers: 
//   Authorization: api.defaults.headers.common["Authorization"], // custom instance's token
// },

// This one : is correct if you’re getting the token from localStorage or cookies directly:
// headers: {
//   Authorization: `Bearer ${token}`, // manually providing token
// },

export const getCurrentUser = async () => {
  try {
    // const response = await axios.get(`${API_URL}/current-user`,
    // {
    //     withCredentials: true,
    //     headers: {
    //       Authorization: api.defaults.headers.common["Authorization"],
    //     },
    //   }
    const response = await api.get(`/current-user`);
    console.log("Api getCurrentuser resposne", response);
    return response.data;
  } catch (error) {
     console.log(error)
    return null; 
  }
};

// Refresh Token Function
export const refreshToken = async () => {
  try {
    const res = await api.post("/refresh-token");
    console.log("refreshhhhhhhhhhhhhhhhhhhhhhhh :", res);
    const newAccessToken = res.data?.data?.accessToken;

    if (newAccessToken) {
      // Update axios default headers
      api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
      return newAccessToken;
    }
    return false;
  } catch (error) {
    console.error("Refresh token request failed:", error);
    return false;
  }
};

// Login API
export const login = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData, {
      withCredentials: true, // Ensures cookies (JWT) are handled properly
    });
    console.log("loginnnnnnnn", response.data);
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "An error occurred",
    };
  }
};

export const register = async (data) => {
  try{
    const response = await axios.post(`${API_URL}/register`, data, {
      withCredentials: true,
    });
    console.log("register", response.data);
    return response.data;
  }catch(err){
    return{
      success:false,
      message: err.response?.data?.message || "error in register"
    }
  }
}

export const logout = async () => {
  try {
    await axios.post(
      `${API_URL}/logout`,
      {},
      {
        withCredentials: true,
        headers: {
          Authorization: api.defaults.headers.common["Authorization"],
        },
      }
    );
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "An error occurred",
    };
  }
};
