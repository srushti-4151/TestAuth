import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false }); 

    return { accessToken, refreshToken };
  } catch (error) {
    throw new Error(
      `Error generating tokens: ${error.message || "Unknown error"}`
    );
  }
};

//To giive new accesstoken
export const refreshAccessToken = async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized request: Refresh token missing",
    });
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token: User not found",
      });
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token is expired or has been reused",
      });
    }

    // Invalidate old refresh token
    user.refreshToken = null;
    await user.save({ validateBeforeSave: false });

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    };

    // Generate new tokens
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
      user._id
    );

    return res.status(200).cookie("refreshToken", refreshToken, options).json({
      success: true,
      message: "Access token refreshed successfully",
      data: {
        accessToken,
      },
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error?.message || "Invalid or expired refresh token",
    });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { email, username, password, role } = req.body;
    if (!email?.trim() || !username?.trim() || !password?.trim()) {
      return res.status(400).json({
        error: "All fields (email, username, password) are required.",
      });
    }

    const existedUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existedUser) {
      return res
        .status(400)
        .json({ error: "User with email or username already exists" });
    }

    const user = await User.create({
      email,
      username,
      role,
      password,
    });

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (!createdUser) {
      return res
        .status(400)
        .json({ error: "Something went wrong while registering the user" });
    }

    return res.status(200).json({
      message: "User registered successfully",
      data: createdUser,
    });
  } catch (error) {
    console.error("Rgister error:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if username or email is provided
    if (!(username || email)) {
      return res.status(400).json({
        success: false,
        message: "Username or email is required",
      });
    }

    // Check if password is provided
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    // Find user by username or email
    const user = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check password
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (user.refreshToken) {
      user.refreshToken = null;
      await user.save({ validateBeforeSave: false });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
      user._id
    );

    //sending and setting tokens
    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    //cookies //FOR PRODUCTION
    // const options = {
    //   httpOnly: true, // // Prevents JavaScript access only server(backend) can modify
    //   secure: true, // Sends only over HTTPS
    //   sameSite: "None", // is required if your frontend and backend are on different domains or ports (e.g., localhost:3000 + localhost:5000 or prod deployments).
    //   maxAge: 10 * 24 * 60 * 60 * 1000,
    //   expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // explicitly set expiry
    // };

    //FOR LOCALHOST
    const options = {
      httpOnly: true,
      sameSite: "Lax", // use "Lax" for localhost dev, or "Strict" if CSRF is not a concern
      maxAge: 10 * 24 * 60 * 60 * 1000,
      expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    };

    return res
      .status(200)
      .cookie("refreshToken", refreshToken, options)
      .json({
        success: true,
        message: "Login successful",
        data: {
          user: loggedInUser,
          accessToken,
        },
      });
  } catch (error) {
    console.error("login error:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const logout = async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({
      success: true,
      message: "Logged out successful",
    });
};

//Get own profile
export const getCurrentUser = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: req.user,
    message: "User fetched Successfully",
  });
};

export const getAllUsers = async (req, res) => {
  try {
    const totalUser = await User.countDocuments();

    const users = await User.find().select("-password");

    res.status(200).json({
      success: true,
      totalUser,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Sever Error",
      error: error.message,
    });
  }
};
