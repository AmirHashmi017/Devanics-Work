import React, { useState } from "react";
import BG from "../images/bg.png";
import BG1 from "../images/bbg.png";
import { FaRegEyeSlash } from "react-icons/fa6";
import { IoMdEye } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { backend_url } from "../constants/api";

const Signin = () => {
  const [passwordShow, setPasswordShow] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handlePassword = () => {
    setPasswordShow(!passwordShow);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        backend_url+"/loginAdmin",
        formData
      );

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        Swal.fire({
          icon: "success",
          title: "Login",
          text: response.data.message,
        });
        navigate("/");

        // Login successful, handle the data or redirect to another page
        console.log("Login successful:", response.data);
      } else {
        // Login failed, handle the error
        console.error("Login failed:", response.data.message);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login",
        text: error.response.data.message,
      });
      console.error("Error during login:", error);
    }
  };
  return (
    <div className="container1" style={{ backgroundImage: `url(${BG})` }}>
      <div className="form-wrapper">
        <div className="title">Sign In</div>
        <div className="subtitle">
          Please fill in your unique User Sign In details below
        </div>

        <div className="input-group1">
          <div className="label">Email address</div>
          <input
            style={{ paddingLeft: "20px" }}
            type="text"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="input"
          />
        </div>

        <div className="input-group1">
          <div className="label">Password</div>
          <div className="password-wrapper">
            <input
              type={passwordShow ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="input"
              style={{ paddingLeft: "20px" }}
            />
            <div className="password-toggle" onClick={handlePassword}>
              {passwordShow ? (
                <IoMdEye fill="#999999" fontSize={24} />
              ) : (
                <FaRegEyeSlash fill="#999999" fontSize={24} />
              )}
            </div>
          </div>
        </div>

        <div className="sign-in">
          <Link to="/sign-up">Sign Up?</Link>
        </div>

        <div
          className="submit-wrapper"
          style={{ backgroundImage: `url(${BG1})` }}
        >
          <button className="submit-button" onClick={handleLogin}>
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signin;
