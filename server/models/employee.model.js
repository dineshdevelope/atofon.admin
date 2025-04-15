import mongoose, { Schema } from "mongoose";

const employeeSchema = new Schema(
  {
    name: { type: String, required: true },
    uniqueId: { type: String, required: true },
    age: { type: Number, required: true },
    email: { type: String, required: true },
    qualification: { type: String, required: true },
    role: { type: String, required: true },
    department: { type: String, required: true },
    joiningDate: { type: Date, required: true },
    experience: { type: String },
    isActive: { type: Boolean, default: true },
    skills: { type: String },

    address: {
      street: { type: String },
      landmark: { type: String },
      area: { type: String },
      district: { type: String },
      state: { type: String },
      pincode: { type: String },
    },

    profilePicture: { type: String },
    resumeImage: { type: String },
    certificateImage: { type: String },

    isStayingCompanyRoom: { type: Boolean, default: false },
    isUsingCompanySystem: { type: Boolean, default: false },
    systemNumber: { type: String },

    phoneNumber: { type: String, required: true },
    alternatePhoneNumber: { type: String },

    emergencyContact: {
      name: { type: String },
      relationship: { type: String },
      phoneNumber: { type: String },
      alternatePhoneNumber: { type: String },
    },

    bloodGroup: { type: String },

    bankDetails: {
      bankName: { type: String },
      bankAccountNumber: { type: String },
      IFSC_Code: { type: String },
      gpay: { type: String },
      phonepay: { type: String },
      upiId: { type: String },
    },

    salary: { type: Number },
  },
  {
    timestamps: true,
  }
);

const Employee = mongoose.model("Employee", employeeSchema);
export default Employee;
