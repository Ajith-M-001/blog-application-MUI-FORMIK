import userModel from "../model/user.schema.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler, transactionHandler } from "../utils/AsyncHandler.js";

export const registerUser = transactionHandler(
  async (req, res, next, session) => {
    const { firstName, lastName, email, password, phoneNumber, countryCode } =
      req.body;

    console.log("asdfsadfasdfasd", session);

    const queryConditions = [];

    if (email) {
      queryConditions.push({ email: email.toLowerCase() });
    }
    if (phoneNumber) {
      queryConditions.push({ phoneNumber });
    }
    // Include the session in the query for consistency
    const existingUser = await userModel
      .findOne({
        $or: queryConditions,
      })
      .session(session);

    if (existingUser) {
      const message = [];

      if (email && existingUser.email === email.toLowerCase()) {
        message.push(`User with email ${email} already exists.`);
      }

      if (phoneNumber && existingUser.phoneNumber === phoneNumber) {
        message.push(`User with phone number ${phoneNumber} already exists.`);
      }

      // Return conflict response with 409 status code
      return res
        .status(409)
        .json(ApiResponse.error(message.join(" and "), 409));
    }

    // Create a new user instance with normalized email
    const newUser = new userModel({
      firstName,
      lastName,
      email: email ? email.toLowerCase() : undefined,
      phoneNumber: phoneNumber || undefined,
      countryCode,
      password,
    });

    // Save the new user to the database
    const savedUser = await newUser.save({ session });

    const responseObj = {
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      email: savedUser.email,
    };

    return res
      .status(201)
      .json(
        ApiResponse.created(
          { user: responseObj },
          "User registerd successfully! please verify"
        )
      );
  }
);
