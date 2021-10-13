const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      uppercase: true,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
    imageUrl: {
      type: String,
    },
    epaycoCustomerId: {
      type: String,
    },
    epaycoCardId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  try {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
  } catch (err) {
    next(err);
  }
});

UserSchema.statics.authenticate = async (email, password) => {
  const user = await User.findOne({
    email,
  });
  if (user) {
    const result = await bcrypt.compare(password, user.password);
    return result === true ? user : null;
  }

  return null;
};

UserSchema.path("role").validate(
  value => /admin|owner|user/i.test(value),
  "role, assigned role is invalid"
);

/**
 * Virtuals
 */

// Public profile information
UserSchema.virtual("profile").get(function () {
  return { name: `${this.firstName} ${this.lastName}`, role: this.role };
});

// Non-sensitive info we'll be putting in the token
UserSchema.virtual("token").get(
  (() => ({ _id: this._id, role: this.role }), this)
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
