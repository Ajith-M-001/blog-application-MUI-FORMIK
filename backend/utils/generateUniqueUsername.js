import userModel from "../model/user.schema.js";

async function generateUniqueUsername(firstName, session) {
  // Convert firstName to lowercase and remove spaces
  let baseUsername = firstName.toLowerCase().replace(/\s+/g, "");
  let username = baseUsername;
  let isUnique = false;
  let attempts = 0;

  while (!isUnique) {
    // Check if username exists
    const existingUser = await userModel.findOne({ username }).session(session);

    if (!existingUser) {
      isUnique = true;
    } else {
      // If username exists, add 3 random numbers
      if (attempts === 0) {
        // First attempt: add 3 random numbers
        const randomNumbers = Math.floor(100 + Math.random() * 900); // 3-digit number between 100-999
        username = `${baseUsername}${randomNumbers}`;
      } else {
        // Subsequent attempts: change the numbers
        const randomNumbers = Math.floor(100 + Math.random() * 900);
        username = `${baseUsername}${randomNumbers}`;
      }
      attempts++;
    }
  }

  return username;
}

export { generateUniqueUsername };
