import { Category } from "../models/category.model.js";
import { Dish } from "../models/dish.model.js";
import { uploadOnCloudinary } from "../util/Cloudinary.js";
import fs from "fs";

export const addDish = async (req, res) => {
  try {
    const { name, description, price, imageUrl, isAvailable, category } =
      req.body;

    // Ensure user is a chef
    if (req.user.role !== "chef") {
      return res.status(400).json({
        success: false,
        message: "Only chefs are allowed to add dishes",
      });
    }

    // Validate required fields
    if (!name || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "Name, price, and category are required",
      });
    }

    // Check if category exists
    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      return res
        .status(400)
        .json({ success: false, message: "Category not found" });
    }

    // const imageUrlLocalPath = req.file?.imageUrl[0]?.path;
    const imageUrlLocalPath = req.file?.path;
    console.log("imageUrlLocalPath is here: ", imageUrlLocalPath);

    if (!imageUrlLocalPath) {
      return res
        .status(400)
        .json({ success: false, message: "image file is required" });
    }

    const image = await uploadOnCloudinary(imageUrlLocalPath);
    if (!image?.url) {
      return res
        .status(400)
        .json({ success: false, message: "image file is required" });
    }

    const newDish = await Dish.create({
      name,
      description,
      price,
      imageUrl: image.secure_url,
      isAvailable,
      category,
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, data: newDish });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getDishes = async (req, res) => {
  try {
    // const dishes = await Dish.find()
    //   .populate("category", "name")
    //   .populate("createdBy", "username email");

    const dishes = await Dish.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: "$category",
      },
      {
        $lookup: {
          from: "users", // collection name
          localField: "createdBy",
          foreignField: "_id",
          as: "createdBy",
        },
      },
      {
        $unwind: "$category",
      },
      {
        $project: {
          name: 1,
          description: 1,
          price: 1,
          imageUrl: 1,
          isAvailable: 1,
          createdAt: 1,
          updatedAt: 1,
          category: "$category.name",
          createdBy: "$createdBy.username",
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      data: dishes,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateDish = async (req, res) => {
  try {
    const { dishId } = req.params;
    const userId = req.user._id;
    const updateData = { ...req.body };

    const existingDish = await Dish.findById(dishId);

    if (!existingDish) {
      return res
        .status(404)
        .json({ success: false, message: "Dish not found" });
    }

    // Ensure the chef owns the dish
    if (existingDish.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    if (req.file) {
      try {
        const uploadResult = await uploadOnCloudinary(req.file.path);
        if (!uploadResult?.url) {
          return res
            .status(500)
            .json({ success: false, message: "Cloudinary upload failed" });
        }

        updateData.imageUrl = uploadResult.url;
      } catch (error) {
        // Clean up failed upload
        if (req.file.path) fs.unlinkSync(req.file.path);
        throw error;
      }
    }

    const updatedDish = await Dish.findByIdAndUpdate(
      dishId,
       { $set: updateData },
      {
        new: true,
        projection: { __v: 0 },
        runValidators: true,
      }
    );

    return res.status(200).json({
      success: true,
      data: updatedDish,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteDish = async (req, res) => {
  try {
    const { dishId } = req.params;
    const userId = req.user._id;

    const existingDish = await Dish.findById(dishId);

    if (!existingDish) {
      return res
        .status(404)
        .json({ success: false, message: "Dish not found" });
    }

    // Ensure the chef owns the dish
    if (existingDish.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const response = await Dish.findByIdAndDelete(dishId);

    if (!response) {
      res.status(500).json({ success: false, message: "Failed  To delete" });
    }

    return res.status(200).json({
      success: true,
      message: "Dish Deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getDishByCate = async (req, res) => {
  try {
    const { catId } = req.body;
    const dishes = await Dish.aggregate([
      {
        $match: { category: new mongoose.Types.objectId(catId) },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "category" },
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "createdBy",
        },
      },
      { $unwind: "$createdBy" },
      {
        $project: {
          name: 1,
          description: 1,
          price: 1,
          imageUrl: 1,
          isAvailable: 1,
          createdAt: 1,
          updatedAt: 1,
          category: "$category.name",
          chef: "$createdBy.name",
        },
      },
    ]);
    return res.status(200).json({
      sccess: true,
      data: dishes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
