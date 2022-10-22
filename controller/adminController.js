import Admin from "../model/adminModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import ApiFeatures from "../utils/apiFeatures.js";

//Create Admin
const createAdmin = catchAsyncErrors(async (req, res) => {
  req.body.user = req.user.id;
  const admin = await Admin.create(req.body);

  res.status(200).json({
    status: true,
    admin,
  });
});

const getAllAdmins = catchAsyncErrors(async (req, res) => {
  const resultsPerPage = 5;
  const adminCount = await Admin.countDocuments();

  const apiFeature = new ApiFeatures(Admin.find(), req.query)
    .search()
    .filter()
    .pagination(resultsPerPage);

  const admins = await apiFeature.query;

  res.status(200).send({
    status: true,
    admins,
    adminCount
  });
});

const getAdmin = catchAsyncErrors(async (req, res, next) => {
  const admin = await Admin.findById(req.params.id);

  if (!admin) {
    return next(new ErrorHandler("Admin not Found.", 404));
  }

  res.status(200).json({
    success: true,
    admin,
  });
});

const updateAdmin = catchAsyncErrors(async (req, res, next) => {
  let admin = Admin.findById(req.params._id);

  if (!admin) {
    return next(new ErrorHandler("Admin not Found.", 404));
  }

  admin = await Admin.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    admin,
  });
});

const deleteAdmin = catchAsyncErrors(async (req, res, next) => {
  const admin = Admin.findById(req.params.id);

  if (!admin) {
    return next(new ErrorHandler("Admin not Found.", 404));
  }

  await admin.remove();

  res.status(200).json({
    success: true,
    message: "Admin Deleted Successfully.",
  });
});

export default {
  createAdmin,
  getAllAdmins,
  getAdmin,
  updateAdmin,
  deleteAdmin,
};
