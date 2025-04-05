import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { authConfig } from "./auth.config.js";
import userModel from "../model/user.schema.js";
import { v4 as uuidv4 } from "uuid";

const configurePassport = (app) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: authConfig.GOOGLE_CLIENT_ID,
        clientSecret: authConfig.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/api/v1/users/auth/google/callback",
        passReqToCallback: true,
        scope: ["profile", "email"],
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails[0].value.toLowerCase();
          const profilePicture = profile.photos?.[0]?.value;
          // 1. First check if Google account already exists
          const existingGoogleUser = await userModel.findOne({
            "authProviders.providerId": profile.id,
          });

          if (existingGoogleUser) {
            return done(null, existingGoogleUser);
          }

          // 2. Check if email exists in database
          const existingEmailUser = await userModel
            .findOne({ email })
            .select("+authProviders");
          if (existingEmailUser) {
            // 3. Handle existing email user cases
            if (existingEmailUser.isEmailVerified) {
              // If email is already verified with password
              return done(null, false, {
                message: "Account exists. Please sign in with email/password.",
              });
            }

            // If email exists but not verified - link Google account
            existingEmailUser.accountStatus = "active";
            existingEmailUser.authProviders.push({
              providerType: "google",
              providerId: profile.id,
            });
            existingEmailUser.firstName = profile.name.givenName;
            existingEmailUser.lastName = profile.name.familyName;
            if (profilePicture) {
              existingEmailUser.avatar.url = profilePicture; // Update profile picture URL
            }
            await existingEmailUser.save();
            return done(null, existingEmailUser);
          }
          // 4. Create new user if no existing records
          const newUser = new userModel({
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email,
            password: uuidv4(),
            authProviders: [
              {
                providerType: "google",
                providerId: profile.id,
              },
            ],
            avatar: { url: profilePicture || null },
            accountStatus: "active",
            isEmailVerified: true,
          });

          await newUser.save();
          return done(null, newUser);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );

  // Initialize passport
  app.use(passport.initialize());
};

export { configurePassport };
