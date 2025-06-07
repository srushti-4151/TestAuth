import axios from "axios";
import { api } from "./AuthApi.js";

const DISH_URL = "http://localhost:8000/api/v1/dish";

export const addDish = async (data) => {
  try {
    const response = await api.post(`${DISH_URL}/addDish`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("reponse of add dish: ", response);
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "error in add dish",
    };
  }
};

export const getdishes = async () => {
  try {
    const response = await axios.get(`${DISH_URL}/getAllDish`);
    console.log("respnse of the get all dishes: ", response);
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "error in getdish api",
    };
  }
};

export const updatedish = async (dishId, data) => {
  try {
    const response = await api.put(`${DISH_URL}/${dishId}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("response of update dish: ", response);
    return response.data;;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "error in update dishes",
    };
  }
};

export const deleteDish = async(dishId) => {
    try{
        const response = await api.delete(`${DISH_URL}/${dishId}`);
        console.log("reponse of deleet dish: ",response)
        return response
    }catch(error){
       return{
         success: false,
         message: error.response?.data?.message || "error in deleting dish"
       }
    }
}
