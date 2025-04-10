//use passport config here
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import userModel from "../model/user.schema.js";
import { generateUniqueUsername } from "../utils/generateUniqueUsername.js";

const configurePassport = (app) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/api/v1/users/auth/google/callback",
        scope: ["profile", "email"],
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          console.log("profile working", profile);
          // Check if the user already exists in the database
          const email =
            profile.emails && profile.emails[0]
              ? profile.emails[0].value.toLowerCase()
              : null;
          if (!email) {
            return done(null, false, {
              message: "Email not available from Google profile",
            });
          }

          // First check if user exists with Google provider
          let user = await userModel
            .findOne({
              "authProviders.providerId": profile.id,
              "authProviders.providerType": "google",
            })
            .select("+refreshTokens +authProviders");

          console.log("check user", user);

          if (!user) {
            user = await userModel
              .findOne({ email })
              .select("+refreshTokens +authProviders");

            if (user) {
              // If user exists with verified email but no Google auth, reject login
              if (
                user.isEmailVerified &&
                !hasGoogleProvider(user, profile.id)
              ) {
                return done(null, false, {
                  message:
                    "Email already verified. Please sign in with your email and password.",
                });
              }

              // If email exists but not verified, link Google account
              if (!user.isEmailVerified) {
                user.authProviders.push({
                  providerId: profile.id,
                  providerType: profile.provider,
                });
                if (!user.username) {
                  user.username = await generateUniqueUsername(
                    profile.name.givenName || "",
                    null
                  );
                }
                user.avatar = {
                  url: profile.photos[0].value,
                  publicId: null,
                };
                user.isEmailVerified = true;
                user.accountStatus = "active";
                await user.save();
                return done(null, user);
              }
            } else {
              console.log("this should be working");
              const username = await generateUniqueUsername(
                profile.name.givenName || "",
                null
              );
              console.log("usernameis working", username);

              const newUser = new userModel({
                firstName: profile.name.givenName || "",
                lastName: profile.name.familyName || "",
                username,
                email,
                avatar: {
                  url: profile.photos?.[0]?.value || null,
                  public_id: null,
                },
                authProviders: [
                  {
                    providerId: profile.id,
                    providerType: profile.provider,
                  },
                ],
                isEmailVerified: true,
                accountStatus: "active",
              });

              console.log("new user check", newUser);
              await newUser.save();
              user = await userModel
                .findById(newUser._id)
                .select("+refreshTokens +authProviders");
              if (!user) {
                return done(null, false, {
                  message: "User not found after creation",
                });
              }

              console.log("user from data", user);
            }
          }
          return done(null, user, { req });
        } catch (error) {
          console.error("Error during Google authentication:", error);
          return done(error, null);
        }
      }
    )
  );

  app.use(passport.initialize());
};

const hasGoogleProvider = (user, googleId) => {
  if (!user.authProviders || !Array.isArray(user.authProviders)) {
    return false;
  }
  return user.authProviders.some(
    (provider) =>
      provider.providerType === "google" && provider.providerId === googleId
  );
};

export { configurePassport };
