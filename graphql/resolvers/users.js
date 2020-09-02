const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { SECRET_KEY } = require("../../config");
const { UserInputError } = require("apollo-server");
const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../util/validator");

const generateToken = (user) => {
  jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    SECRET_KEY,
    { expiresIn: "1h" }
  );
};

module.exports = {
  Mutation: {
    async login(_, { username, password }) {
      const { valid, errors } = validateLoginInput(username, password);
      const user = await User.findOne({ username });

      if (!user) {
        errors.general = "User not Found";
        throw new UserInputError("User Doesnt exist", {
          errors,
        });
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        errors.general = "Wrong credentials";
        throw new UserInputError("Wrong user Credentials", { errors });
      }

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }
      const token = generateToken(user);
      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },
    async register(
      _,
      { registerInput: { username, email, password, confirmPassword } }
    ) {
      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const user = await User.findOne({ username });

      if (user) {
        throw new UserInputError("Username is taken", {
          errors: {
            username: "This username is taken",
          },
        });
      }

      //Hashing the password
      password = await bcrypt.hash(password, 12);

      //Creating new User
      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString(),
      });

      //Saving user in Database
      const res = await newUser.save();

      //Creating Token
      const token = generateToken(res);
      //Returning the user
      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
  },
};
