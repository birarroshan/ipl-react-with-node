const passport = require('passport');
const OIDCStrategy = require('passport-azure-ad').OIDCStrategy;

const config = {
  identityMetadata: 'https://login.microsoftonline.com/f99cad09-e309-4638-804a-6f5261f0d932/v2.0/.well-known/openid-configuration',
  clientID: '04d3b999-3ec3-48b9-967c-abe8b1a21fb8',
  responseType: 'code id_token',
  responseMode: 'form_post',
  //redirectUrl: 'https://dmoipl.azurewebsites.net/auth/openid/return',
  redirectUrl: 'https://localhost:3000/',
  allowHttpForRedirectUrl: false, // Set to true if using http
  clientSecret: 'vjL8Q~dkhWL4410O-hvN43Ifo5GOJpWP_ZQj.cBs',
  validateIssuer: false, // For local dev only
  passReqToCallback: false,
  useCookieInsteadOfSession: true,
  cookieEncryptionKeys: [{ key: '12345678901234567890123456789012', iv: '123456789012' }],
  scope: ['profile', 'offline_access', 'openid'],
};

passport.use(new OIDCStrategy(config, (iss, sub, profile, accessToken, refreshToken, done) => {
  return done(null, profile);
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
