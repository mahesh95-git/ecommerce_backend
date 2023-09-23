const passport = require("passport");
const { asyncErrorHandler } = require("../middleware/asyncErrorHandler");
const { user } = require("../model/user");
const bcrypt = require("bcrypt");
const Errorhandler = require("../util/errorhandler");
exports.userAuthitcation = asyncErrorHandler(
  async (username, password, done) => {
    const User = await user.findOne({ name: username });
    if (!User) {
      return done(new Errorhandler("user not found", 401));
    }

    const check = await bcrypt.compareSync(password, User.password);
    if (!check) {
      return done(new Errorhandler("Email id and Passport Wrong", 401));
    }

    done(null, User);
  }
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const User = await user.findOne({ _id: id });
    done(null, User);
  } catch (error) {
    done(new Errorhandler("user not found", 401));
  }
});
