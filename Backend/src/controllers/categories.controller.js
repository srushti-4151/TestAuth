import { Category } from "../models/category.model.js";

export const addCate = async (req, res) => {
  try {
    const { name, description } = req.body;

    const existing = await Category.findOne({ name });

    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "Category already exists" });
    }

    const category = await Category.create({
      name,
      description,
    });

    res.status(201).json({ success: true, data: category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllcate = async (req, res) => {
  try {
    const totalCategory = await Category.countDocuments();
    const categories = await Category.find();

    return res.status(200).json({
      success: true,
      totalCategory,
      data: categories,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const editCate = async (req, res) => {
  try {
    const { cateId } = req.params;
    // const { name, description } = req.body;

    const existingCate = await Category.findById(cateId);
    if (!existingCate) {
      res
        .status(500)
        .json({ success: false, message: "Category doesn't exists" });
    }

    const updatecate = await Category.findByIdAndUpdate(
      cateId,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatecate) {
      return res
        .status(404)
        .json({ success: false, message: "category not found" });
    }
    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: updatecate,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCate = async (req, res) => {
  try {
    const { cateId } = req.params;

    const deletedcate = await Category.findByIdAndDelete(cateId);

    if (!deletedcate) {
      return res
        .status(404)
        .json({ success: false, message: "category not found" });
    }
    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      data: deletedcate,
    });
    
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
