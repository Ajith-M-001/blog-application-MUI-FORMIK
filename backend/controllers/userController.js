import User from "../model/user.schema.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

export const signUpUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, phoneNumber, countryCode } =
    req.body;

  const queryConditions = [];

  if (email) {
    queryConditions.push({ email: email.toLowerCase() });
  }

  if (phoneNumber) {
    queryConditions.push({ phoneNumber });
  }

  const existingUser = await User.findOne({
    $or: queryConditions,
  });

  // If the user exists, handle conflicts
  // if (existingUser) {
  //   const conflictMessages = [];

  //   if (email && existingUser.email === email.toLowerCase()) {
  //     conflictMessages.push(`User with email ${email} already exists.`);
  //   }

  //   if (phoneNumber && existingUser.phoneNumber === phoneNumber) {
  //     conflictMessages.push(
  //       `User with phone number ${phoneNumber} already exists.`
  //     );
  //   }

  //   // Return conflict response with 409 status code
  //   return res
  //     .status(409)
  //     .json(ApiResponse.error(conflictMessages.join(" and "), 409));
  // }

  // Create a new user instance with normalized email
  const newUser = new User({
    firstName,
    lastName,
    email: email ? email.toLowerCase() : undefined,
    phoneNumber: phoneNumber || undefined,
    countryCode,
    password,
  });

  // Save the new user to the database
  const savedUser = await newUser.save();

  // Convert to a plain object and remove the password field manually
  const responseObj = savedUser.toObject();
  delete responseObj.password;

  // Send a success response
  return res
    .status(201)
    .json(
      ApiResponse.created({ user: responseObj }, "User signed up successfully")
    );
});

export const signInUser = asyncHandler(async (req, res) => {
  res.send({ message: "working sign in route" });
});
