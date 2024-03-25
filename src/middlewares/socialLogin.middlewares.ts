import { Strategy } from 'passport-google-oauth20';
import { Strategy as FbStrategy } from 'passport-facebook';

export const googleStrategy = new Strategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: `${process.env.APP_URI}/user/login/google/callback`,
  },
  function (accessToken, refreshToken, profile, done) {
    const data = {
      firstName: profile.name?.givenName,
      lastName: profile.name?.familyName,
      email: profile._json.email,
      emailIsVerified: profile._json.email_verified,
      imgUrl: profile._json.picture,
      isSocial: true,
    };
    done(null, data);
  }
);

export const facebookStrategy = new FbStrategy(
  {
    clientID: process.env.FACEBOOK_APP_ID!,
    clientSecret: process.env.FACEBOOK_APP_SECRET!,
    callbackURL: `${process.env.APP_URI}/user/login/facebook/callback`,
    enableProof: true,
  },
  function (accessToken, refreshToken, profile, done) {
    console.log(profile);
    const data = {
      firstName: profile.name?.givenName,
      lastName: profile.name?.familyName,
      dateOfBirth: profile.birthday,
      email: profile._json.email,
      emailIsVerified: profile._json.email_verified,
      imgUrl: profile._json.picture,
      isSocial: true,
    };
    done(null, data);
  }
);
