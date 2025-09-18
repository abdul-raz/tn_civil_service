// import React, { useState } from 'react';
// import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

// const LoginPage = ({ setLog }) => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [formData, setFormData] = useState({ username: '', password: '' });
//   const [errors, setErrors] = useState({});

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//     setErrors({ ...errors, [name]: '' });
//   };

//   const handleLogin = () => {
//     let newErrors = {};
//     if (!formData.username.trim()) newErrors.username = 'Username is required';
//     if (!formData.password.trim()) newErrors.password = 'Password is required';

//     setErrors(newErrors);

//     if (Object.keys(newErrors).length === 0) {
//       setLog(true); // Proceed to login
//     }
//   };

//   return (
//     <section className='bg-[#e9e8e8] md:min-h-screen flex justify-center items-center p-5'>
//       <div className='relative w-full max-w-5xl flex flex-col md:flex-row shadow-lg rounded-xl overflow-hidden'>

//         <div className='md:w-1/2 bg-gradient-to-br from-[#a7a5a5d4] to-[#bebcbc80] p-4'>
//           <img src="poster.avif" alt="Login Poster" className='h-full w-full object-cover rounded-tl-xl rounded-bl-xl' />
//         </div>

//         <div className='relative z-10 md:w-1/2 w-full bg-white/90 backdrop-blur-sm md:backdrop-blur-0 md:bg-white p-6 sm:px-10 sm:py-20 md:space-y-10 space-y-4'>
//           <div className='flex justify-center items-center md:gap-4 gap-2'>
//             <img src="TN_logo.png" alt="TN_logo" className='w-10 h-10' />
//             <div className='flex flex-col'>
//               <p className='primary font-bold md:text-sm text-[13px]'>All India Civil Services Coaching Centre</p>
//               <small className='primary text-[10px]'>A Unit of Anna Institute of Management</small>
//             </div>
//           </div>

//           <div className='flex flex-col md:gap-1 items-center'>
//             <p className='primary md:text-[20px] text-md font-bold'>Login to your account</p>
//             <p className='text-gray-500 md:text-[15px] text-[11px]'>Welcome back, please enter your details</p>
//           </div>

//           <form className='flex flex-col gap-4' onSubmit={(e) => e.preventDefault()}>
//             <div>
//               <label className='primary text-sm font-bold md:mb-1 mb-2'>Username</label>
//               <input
//                 type="text"
//                 name="username"
//                 value={formData.username}
//                 onChange={handleChange}
//                 placeholder='Enter your username'
//                 className={`w-full border ${errors.username ? 'border-red-500' : 'border-gray-300'} md:rounded-xl rounded-md placeholder:text-gray-400 placeholder:text-sm md:placeholder:text-[15px] p-1 px-2 md:p-3 outline-none`}
//               />
//               {errors.username && <p className="requiredField">{errors.username}</p>}
//             </div>

//             <div className='relative'>
//               <div className='flex justify-between items-center md:mb-1 mb-2'>
//                 <label className='primary text-sm font-bold'>Password</label>
//                 <p className='primary text-sm cursor-pointer hover:text-blue-400'>Forgot Password?</p>
//               </div>
//               <input
//                 type={showPassword ? "text" : "password"}
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 placeholder='Enter your password'
//                 className={`w-full border ${errors.password ? 'border-red-500' : 'border-gray-300'} md:rounded-xl rounded-md placeholder:text-gray-400 placeholder:text-sm md:placeholder:text-[15px] p-1 px-2 md:p-3 outline-none pr-10`}
//               />
//               <button
//                 type="button"
//                 className='absolute right-3 cursor-pointer top-[38px] text-gray-500'
//                 onClick={() => setShowPassword(!showPassword)}
//               >
//                 {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
//               </button>
//               {errors.password && <p className="requiredField">{errors.password}</p>}
//             </div>

//             <input
//               onClick={handleLogin}
//               type="button"
//               value="Sign In"
//               className='bg-[#eead21] hover:bg-[#fab82b] p-1 px-2 md:p-3 md:rounded-xl rounded-md text-white font-medium mt-2 cursor-pointer'
//             />
//           </form>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default LoginPage;
import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";


const LoginPage = ({ setLog }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for changed field
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleLogin = async () => {
    let newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length !== 0) return;

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        credentials: "include", // important for session cookies
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ general: data.message || "Login failed" });
        return;
      }

      // Success — update login status
      setLog(true);
    } catch (error) {
      setErrors({ general: "Network error, please try again" });
    }
  };

  return (
    <section className="bg-[#e9e8e8] md:min-h-screen flex justify-center items-center p-5">
      <div className="relative w-full max-w-5xl flex flex-col md:flex-row shadow-lg rounded-xl overflow-hidden">
        <div className="md:w-1/2 bg-gradient-to-br from-[#a7a5a5d4] to-[#bebcbc80] p-4">
          <img
            src="poster.avif"
            alt="Login Poster"
            className="h-full w-full object-cover rounded-tl-xl rounded-bl-xl"
          />
        </div>

        <div className="relative z-10 md:w-1/2 w-full bg-white/90 backdrop-blur-sm md:backdrop-blur-0 md:bg-white p-6 sm:px-10 sm:py-20 md:space-y-10 space-y-4">
          <div className="flex justify-center items-center md:gap-4 gap-2">
            <img src="TN_logo.png" alt="TN_logo" className="w-10 h-10" />
            <div className="flex flex-col">
              <p className="primary font-bold md:text-sm text-[13px]">
                All India Civil Services Coaching Centre
              </p>
              <small className="primary text-[10px]">
                A Unit of Anna Institute of Management
              </small>
            </div>
          </div>

          <div className="flex flex-col md:gap-1 items-center">
            <p className="primary md:text-[20px] text-md font-bold">
              Login to your account
            </p>
            <p className="text-gray-500 md:text-[15px] text-[11px]">
              Welcome back, please enter your details
            </p>
          </div>

          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => e.preventDefault()}
            noValidate
          >
            <div>
              <label className="primary text-sm font-bold md:mb-1 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={`w-full border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } md:rounded-xl rounded-md placeholder:text-gray-400 placeholder:text-sm md:placeholder:text-[15px] p-1 px-2 md:p-3 outline-none`}
              />
              {errors.email && (
                <p className="requiredField text-red-500 text-sm">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="relative">
              <div className="flex justify-between items-center md:mb-1 mb-2">
                <label className="primary text-sm font-bold">Password</label>
                <p className="primary text-sm cursor-pointer hover:text-blue-400">
                  Forgot Password?
                </p>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={`w-full border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } md:rounded-xl rounded-md placeholder:text-gray-400 placeholder:text-sm md:placeholder:text-[15px] p-1 px-2 md:p-3 outline-none pr-10`}
              />
              <button
                type="button"
                className="absolute right-3 cursor-pointer top-[38px] text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
              </button>
              {errors.password && (
                <p className="requiredField text-red-500 text-sm">
                  {errors.password}
                </p>
              )}
            </div>

            {errors.general && (
              <p className="requiredField text-red-600 text-center">
                {errors.general}
              </p>
            )}

            <input
              onClick={handleLogin}
              type="button"
              value="Sign In"
              className="bg-[#eead21] hover:bg-[#fab82b] p-1 px-2 md:p-3 md:rounded-xl rounded-md text-white font-medium mt-2 cursor-pointer"
            />
          </form>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
