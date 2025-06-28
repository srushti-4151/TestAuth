import { api } from "./AuthApi.js";

const CAT_URL = "http://localhost:8000/api/v1/category";

export const addCat = async (data) => {
  try {
    const response = await api.post(`${CAT_URL}/addCate`, data);
    console.log("addCate cateApi error: ", response);
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "error in AddCate catapi",
    };
  }
};

export const getCate = async () => {
  try {
    const response = await api.get(`${CAT_URL}/getAllCate`);
    console.log("getCate response: ,", response);
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "error in getcategory",
    };
  }
};

export const updateCate = async (cateId, data) => {
  try {
    const response = await api.put(
      `${CAT_URL}/${cateId}`,
      data
      // {
      //     headers: {
      //         'Content-Type': 'multipart/form-data'
      //     }
      // }
    );
    return response;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "error in update api",
    };
  }
};

export const deleteCate = async (cateId) => {
  try {
    const res = await api.delete(`${CAT_URL}/${cateId}`);
    console.log("delete response", res);
    return res.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "error in deetee cate",
    };
  }
};
