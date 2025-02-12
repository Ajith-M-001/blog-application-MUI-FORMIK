import User from "../model/user.schema.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const signUpUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, phoneNumber, countryCode } =
      req.body;

    // Check if user already exists by email or phone number
    const existingUser = await User.findOne({
      $or: [
        { email: email?.toLowerCase() }, // Check for email conflict
        { phoneNumber }, // Check for phone number conflict
      ],
    });

    // If the user exists, handle conflicts
    if (existingUser) {
      let conflictMessage = "";

      if (existingUser.email === email.toLowerCase()) {
        conflictMessage = `User with email ${email} already exists.`;
      }

      if (existingUser.phoneNumber === phoneNumber) {
        conflictMessage += ` User with phone number ${phoneNumber} already exists.`;
      }

      // Return conflict response with 409 status code
      return res
        .status(409)
        .json(ApiResponse.error(conflictMessage.trim(), 409));
    }

    // Create a new user instance
    const newUser = new User({
      firstName,
      lastName,
      email: email.toLowerCase(), // Normalize the email
      phoneNumber,
      countryCode,
      password,
    });

    // Save the new user to the database
    await newUser.save();

    // Send a success response
    res
      .status(201)
      .json(
        ApiResponse.success("User signed up successfully", { user: newUser })
      );
  } catch (error) {
    // Pass the error to the next middleware
    next(error);
  }
};
