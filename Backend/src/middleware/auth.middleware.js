import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = async (req, res, next) => {
  try {
    let token;

    // 1. Check Authorization header || Cookies
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized request.",
      });
    }

    //2. decode the token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    //3. take id from token to find user
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid Access Token",
      });
    }
    req.user = user;
    next();

  } catch (error) {
    res.status(401).json({
      message: "Invalid Access Token",
      error: error.message,
    });
  }
};
