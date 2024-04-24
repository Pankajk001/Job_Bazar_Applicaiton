import React, { useContext, useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill } from "react-icons/ri";
import { FaPencilAlt } from "react-icons/fa";
import { FaPhoneFlip } from "react-icons/fa6";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";

const Register = () => {
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [age, setAge] = useState("")
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [otp, setOtp] = useState("");
  const [active, isActive] = useState(false);

  const { isAuthorized, setIsAuthorized, user, setUser } = useContext(Context);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    
      await axios({
        url: "http://localhost:4000/api/v1/user/sendotp",
        method: "POST",
        headers: {
            authorization: "asdf",
        },
        data: {email},
    })
        .then((res) => {
            toast.success(res.message);
            isActive(true);
        })
        .catch((err) => {
            toast.error(err.message);
        });
  }

  // const handleRegister = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const { data } = await axios.post(
  //       "http://localhost:4000/api/v1/user/register",
  //       { firstname,lastname, age, otp, phone, email, role, password },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         withCredentials: true,
  //       }
  //     );
  //     toast.success(data.message);
  //     setfirstName("");
  //     setlastName("");
  //     setAge("");
  //     setEmail("");
  //     setPassword("");
  //     setPhone("");
  //     setRole("");
  //     setOtp("");
  //     setIsAuthorized(true);
      
  //   } catch (error) {
  //     toast.error(error.response.data.message);
  //   }
  // };

  const handleRegister = async (e) => {
    e.preventDefault();
    await axios({
      url: "http://localhost:4000/api/v1/user/register",
      method: "POST",
      headers: {
        authorization: "asdf",
      },
      data: { firstName, lastName, age, otp, phone, email, role, password },
    })
      .then((res) => {
        toast.success(res.message);
        setfirstName("");
        setlastName("");
        setAge("");
        setEmail("");
        setPassword("");
        setPhone("");
        setRole("");
        setOtp("");
        setIsAuthorized(true);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  if(isAuthorized){
    return <Navigate to={'/'}/>
  }


  return (
    <>
      { !active ?

        <section className="authPage">
        <div className="container">
          <div className="header">
            <img src="/JobZeelogo.png" alt="logo" />
            <h3>Create a new account</h3>
          </div>
          <form>
            <div className="inputTag">
              <label>Register As</label>
              <div>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="">Select Role</option>
                  <option value="Employer">Employer</option>
                  <option value="Job Seeker">Job Seeker</option>
                </select>
                <FaRegUser />
              </div>
            </div>
            <div className="inputTag">
              <label>First Name</label>
              <div>
                <input
                  type="text"
                  placeholder="Pankaj"
                  value={firstName}
                  onChange={(e) => setfirstName(e.target.value)}
                />
                <FaPencilAlt />
              </div>
            </div>
            <div className="inputTag">
              <label>Last Name</label>
              <div>
                <input
                  type="text"
                  placeholder="Kumar"
                  value={lastName}
                  onChange={(e) => setlastName(e.target.value)}
                />
                <FaPencilAlt />
              </div>
            </div>
            <div className="inputTag">
              <label> Age</label>
              <div>
                <input
                  type="number"
                  placeholder="18"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
                <FaPencilAlt />
              </div>
            </div>
            <div className="inputTag">
              <label>Email Address</label>
              <div>
                <input
                  type="email"
                  placeholder="pk@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <MdOutlineMailOutline />
              </div>
            </div>
            <div className="inputTag">
              <label>Phone Number</label>
              <div>
                <input
                  type="number"
                  placeholder="12345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <FaPhoneFlip />
              </div>
            </div>
            <div className="inputTag">
              <label>Password</label>
              <div>
                <input
                  type="password"
                  placeholder="Your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <RiLock2Fill />
              </div>
            </div>
            <button type="submit" onClick={handleSendOTP}>
              Send OTP
            </button>
            <Link to={"/login"}>Login Now</Link>
          </form>
        </div>
        <div className="banner">
          <img src="/register.png" alt="login" />
        </div>
        </section>

        :    // conditional rendering

        <section className="authPage">
          <div className="container">
            <div className="header">
              <img src="/JobZeelogo.png" alt="logo" />
              <h3>Create a new account</h3>
            </div>
            <form>
             
              <div className="inputTag">
                <label>Enter OTP</label>
                <div>
                  <input
                    type="number"
                    placeholder=""
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <FaPencilAlt />
                </div>
              </div>

              <button type="submit" onClick={handleRegister}>
              Register
            </button>
            </form>
          </div>
          <div className="banner">
            <img src="/register.png" alt="login" />
          </div>
          </section>
      } 

          
      
    </>
  );
};

export default Register;