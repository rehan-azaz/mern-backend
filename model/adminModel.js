import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: [true, "Please Enter admin first name."],
  },
  last_name: {
    type: String,
    required: [true, "Please Enter admin last name."],
  },
  email: {
    type: String,
    required: [true, "Please Enter admin email."],
  },
  username: {
    type: String,
    required: [true, "Please Enter admin username."],
  },
  password: {
    type: String,
    required: [true, "Please Enter admin role."],
  },
  phone: {
    type: String,
    required: [true, "Please Enter admin phone."],
    maxLength: [13, "Max length ."],
  },
  role: {
    type: String,
    required: [true, "Please Enter admin role."],
  },
  status: {
    type: Boolean,
    required: [true, "Please Enter admin status."],
    default: 0,
  },
  image: {
    id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


// Encrypt Password
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});


const Admin = mongoose.model("admin", adminSchema);

export default Admin;
