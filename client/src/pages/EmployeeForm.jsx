import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Moved FormSection outside the main component
const FormSection = ({ title, children }) => (
  <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-sm mb-6">
    <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
      {title}
    </h3>
    <div className="space-y-4">{children}</div>
  </div>
);

const EmployeeForm = () => {
  const apiUrl = import.meta.env.VITE_BASE_URL;
  const cloudinaryName = import.meta.env.VITE_API_CLOUDNAME;
  const navigate = useNavigate();

  const [uploading, setUploading] = useState(false);
  const [profileFile, setProfileFile] = useState(null);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    uniqueId: "",
    age: "",
    email: "",
    qualification: "",
    role: "",
    department: "",
    joiningDate: "",
    phoneNumber: "",
    alternatePhoneNumber: "",
    isActive: true,
    isStayingCompanyRoom: false,
    isUsingCompanySystem: false,
    systemNumber: "",
    certificateImage: "",
    profilePicture: "",
    resumeImage: "",
    skills: "",
    salary: "",
    bloodGroup: "",
    address: {
      street: "",
      district: "",
      area: "",
      landmark: "",
      state: "",
      pincode: "",
    },
    emergencyContact: {
      name: "",
      relationship: "",
      phoneNumber: "",
      alternatePhoneNumber: "",
    },
    bankDetails: {
      bankName: "",
      bankAccountNumber: "",
      IFSC_Code: "",
      gpay: "",
      phonepay: "",
      upiId: "",
    },
  });

  // Validation rules
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value.trim()) error = "Name is required";
        else if (value.length < 3) error = "Name must be at least 3 characters";
        break;
      case "uniqueId":
        if (!value.trim()) error = "Employee ID is required";
        break;
      case "age":
        if (!value) error = "Age is required";
        else if (isNaN(value)) error = "Age must be a number";
        else if (value < 18) error = "Minimum age is 18";
        else if (value > 60) error = "Maximum age is 60";
        break;
      case "email":
        if (!value.trim()) error = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          error = "Invalid email format";
        break;
      case "phoneNumber":
        if (!value) error = "Phone number is required";
        else if (!/^\d{10}$/.test(value))
          error = "Phone number must be 10 digits";
        break;
      case "alternatePhoneNumber":
        if (value && !/^\d{10}$/.test(value))
          error = "Alternate phone must be 10 digits";
        break;
      case "qualification":
      case "role":
      case "department":
        if (!value.trim()) error = "This field is required";
        break;
      case "joiningDate":
        if (!value) error = "Joining date is required";
        break;
      case "salary":
        if (!value) error = "Salary is required";
        else if (isNaN(value)) error = "Salary must be a number";
        else if (value < 0) error = "Salary cannot be negative";
        break;
      case "address.pincode":
        if (value && !/^\d{6}$/.test(value)) error = "Pincode must be 6 digits";
        break;
      case "emergencyContact.phoneNumber":
        if (!value) error = "Emergency phone is required";
        else if (!/^\d{10}$/.test(value))
          error = "Emergency phone must be 10 digits";
        break;
      case "bankDetails.bankAccountNumber":
        if (value && !/^\d{9,18}$/.test(value))
          error = "Account number must be 9-18 digits";
        break;
      case "bankDetails.IFSC_Code":
        if (value && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(value))
          error = "Invalid IFSC format (e.g., ABCD0123456)";
        break;
      default:
        break;
    }

    return error;
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Validate all fields
    for (const field in formData) {
      if (typeof formData[field] === "object") {
        for (const subField in formData[field]) {
          const fullName = `${field}.${subField}`;
          const error = validateField(fullName, formData[field][subField]);
          if (error) {
            newErrors[fullName] = error;
            isValid = false;
          }
        }
      } else {
        const error = validateField(field, formData[field]);
        if (error) {
          newErrors[field] = error;
          isValid = false;
        }
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const uploadFileToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "images_preset");

    try {
      setUploading(true);
      const api = `https://api.cloudinary.com/v1_1/${cloudinaryName}/image/upload`;
      const res = await axios.post(api, data);
      return res.data.secure_url;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      toast.error("Image upload failed. Please try again.");
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    if (type === "file") {
      setProfileFile(files[0]);
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else if (name.includes(".")) {
      const [section, key] = name.split(".");
      setFormData({
        ...formData,
        [section]: {
          ...formData[section],
          [key]: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix all validation errors before submitting");
      return;
    }

    try {
      let uploadedProfileUrl = formData.profilePicture;
      if (profileFile) {
        uploadedProfileUrl = await uploadFileToCloudinary(profileFile);
      }

      const updatedData = {
        ...formData,
        profilePicture: uploadedProfileUrl,
      };

      const response = await axios.post(`${apiUrl}/api/employee`, updatedData);
      toast.success("Employee created successfully!");
      navigate("/");
    } catch (error) {
      console.error("Submit error", error.response?.data || error.message);
      toast.error(
        error.response?.data?.message ||
          "Failed to create employee. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Employee Form
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information Section */}
              <FormSection title="Basic Information">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { field: "name", label: "Full Name *", type: "text" },
                    { field: "uniqueId", label: "Employee ID *", type: "text" },
                    { field: "age", label: "Age *", type: "number" },
                    { field: "email", label: "Email *", type: "email" },
                    {
                      field: "phoneNumber",
                      label: "Phone Number *",
                      type: "tel",
                    },
                    {
                      field: "alternatePhoneNumber",
                      label: "Alternate Phone",
                      type: "tel",
                    },
                    { field: "bloodGroup", label: "Blood Group", type: "text" },
                  ].map(({ field, label, type }) => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {label}
                      </label>
                      <input
                        type={type}
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-3 py-2 border ${
                          errors[field] ? "border-red-500" : "border-gray-300"
                        } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                        min={field === "age" ? 18 : undefined}
                        max={field === "age" ? 60 : undefined}
                        maxLength={field.includes("phone") ? 10 : undefined}
                      />
                      {errors[field] && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors[field]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </FormSection>

              {/* Employment Details Section */}
              <FormSection title="Employment Details">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      field: "qualification",
                      label: "Qualification *",
                      type: "text",
                    },
                    { field: "role", label: "Role *", type: "text" },
                    {
                      field: "department",
                      label: "Department *",
                      type: "text",
                    },
                    { field: "salary", label: "Salary *", type: "number" },
                    {
                      field: "joiningDate",
                      label: "Joining Date *",
                      type: "date",
                    },
                    { field: "skills", label: "Skills", type: "text" },
                  ].map(({ field, label, type }) => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {label}
                      </label>
                      <input
                        type={type}
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-3 py-2 border ${
                          errors[field] ? "border-red-500" : "border-gray-300"
                        } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                      />
                      {errors[field] && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors[field]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  {[
                    { label: "Active Employee", name: "isActive" },
                    {
                      label: "Staying in Company Room",
                      name: "isStayingCompanyRoom",
                    },
                    {
                      label: "Using Company System",
                      name: "isUsingCompanySystem",
                    },
                  ].map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center space-x-2 p-2"
                    >
                      <input
                        type="checkbox"
                        name={item.name}
                        checked={formData[item.name]}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="text-sm text-gray-700">
                        {item.label}
                      </label>
                    </div>
                  ))}
                </div>

                {formData.isUsingCompanySystem && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      System Number
                    </label>
                    <input
                      type="text"
                      name="systemNumber"
                      value={formData.systemNumber}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}
              </FormSection>

              {/* Address Section */}
              <FormSection title="Address Information">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { field: "street", label: "Street", type: "text" },
                    { field: "landmark", label: "Landmark", type: "text" },
                    { field: "area", label: "Area", type: "text" },
                    { field: "district", label: "District", type: "text" },
                    { field: "state", label: "State", type: "text" },
                    { field: "pincode", label: "Pincode", type: "text" },
                  ].map(({ field, label, type }) => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {label}
                      </label>
                      <input
                        type={type}
                        name={`address.${field}`}
                        value={formData.address[field]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-3 py-2 border ${
                          errors[`address.${field}`]
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                        maxLength={field === "pincode" ? 6 : undefined}
                      />
                      {errors[`address.${field}`] && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors[`address.${field}`]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </FormSection>

              {/* Emergency Contact Section */}
              <FormSection title="Emergency Contact">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { field: "name", label: "Name *", type: "text" },
                    {
                      field: "relationship",
                      label: "Relationship *",
                      type: "text",
                    },
                    {
                      field: "phoneNumber",
                      label: "Phone Number *",
                      type: "tel",
                    },
                    {
                      field: "alternatePhoneNumber",
                      label: "Alternate Phone",
                      type: "tel",
                    },
                  ].map(({ field, label, type }) => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {label}
                      </label>
                      <input
                        type={type}
                        name={`emergencyContact.${field}`}
                        value={formData.emergencyContact[field]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-3 py-2 border ${
                          errors[`emergencyContact.${field}`]
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                        maxLength={field.includes("phone") ? 10 : undefined}
                      />
                      {errors[`emergencyContact.${field}`] && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors[`emergencyContact.${field}`]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </FormSection>

              {/* Bank Details Section */}
              <FormSection title="Bank Details">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { field: "bankName", label: "Bank Name", type: "text" },
                    {
                      field: "bankAccountNumber",
                      label: "Account Number",
                      type: "text",
                    },
                    {
                      field: "IFSC_Code",
                      label: "IFSC Code",
                      type: "text",
                    },
                    { field: "gpay", label: "GPay Number", type: "tel" },
                    { field: "phonepay", label: "PhonePe Number", type: "tel" },
                    { field: "upiId", label: "UPI ID", type: "text" },
                  ].map(({ field, label, type }) => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {label}
                      </label>
                      <input
                        type={type}
                        name={`bankDetails.${field}`}
                        value={formData.bankDetails[field]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-3 py-2 border ${
                          errors[`bankDetails.${field}`]
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                        maxLength={field === "IFSC_Code" ? 11 : undefined}
                      />
                      {errors[`bankDetails.${field}`] && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors[`bankDetails.${field}`]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </FormSection>

              {/* Profile Picture Section */}
              <FormSection title="Profile Picture">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Upload Profile Photo
                    </label>
                    <div className="mt-1 flex items-center">
                      <input
                        type="file"
                        name="profilePicture"
                        accept="image/*"
                        onChange={handleChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    </div>
                    {profileFile && (
                      <p className="mt-2 text-sm text-gray-600">
                        Selected file: {profileFile.name}
                      </p>
                    )}
                  </div>
                </div>
              </FormSection>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    "Create Employee"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeForm;
