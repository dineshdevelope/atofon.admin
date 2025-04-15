import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { IoEyeOffSharp } from "react-icons/io5";
import { FaRegEye } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";

const LoginPage = () => {
  const [showPassword, setshowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toastId = useRef(null);
  const navigate = useNavigate();

  const handleShowPassword = () => {
    setshowPassword(!showPassword);
  };

  const apiUrl = import.meta.env.VITE_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.error("All fields are required !", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } else {
      try {
        await axios.post(
          `${apiUrl}/api/login`,
          {
            email,
            password,
          },
          {
            withCredentials: true,
          }
        );
        navigate("/readtask");
        toast.success("Login Sucessfull", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } catch (error) {
        console.log(error);
        if (!toast.isActive(toastId.current)) {
          toastId.current = toast.error("Something went wroung..!", {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      }
    }
  };
  return (
    <div>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Company Logo"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuJVYMhNMFOX5Vl2kK91rG1B9J2WsCpuCdhQ&s"
            className="mx-auto h-10 sm:h-30 w-auto"
          />
          <h2 className="mt-5 sm:mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            action="#"
            method="POST"
            className="space-y-6"
            onSubmit={handleSubmit}
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  autoComplete="email"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Password
                </label>
                <div className="text-sm">
                  <Link
                    to={"/forgot-password"}
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
              <div className="mt-2 relative">
                {showPassword ? (
                  <FaRegEye
                    onClick={handleShowPassword}
                    className="absolute left-3 top-2.5"
                  />
                ) : (
                  <IoEyeOffSharp
                    onClick={handleShowPassword}
                    className="absolute left-3 top-2.5"
                  />
                )}

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 pl-10"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            Not a member?{" "}
            <Link
              to={"/register"}
              className="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Sign up here..!
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
