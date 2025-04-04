import { useState, } from 'react';

import { RiLoginCircleFill } from 'react-icons/ri';
import { useNavigate,  } from 'react-router-dom';
import signInImg from '../../../public/images/signIn.png'
import { toast } from 'sonner';


function Signup() {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({
    name: '',
    mobile: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();
 

  const validateInputs = () => {
    const newErrors = { name: '', mobile: '', email: '', password: '' };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    const phoneRegex = /^[1-9][0-9]{9}$/; 

    
    if (!name) {
      newErrors.name = 'Name is required.';
    }

    
    if (!email) {
      newErrors.email = 'Email is required.';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Invalid email format.';
    }

    
    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long.';
    }

    
    if (!mobile) {
      newErrors.mobile = 'Mobile number is required.';
    } else if (!phoneRegex.test(mobile)) {
      newErrors.mobile = 'Invalid phone number. Must be 10 digits, start with a non-zero digit, and have no spaces.';
    }

    setErrors(newErrors);

    
    setTimeout(() => {
      setErrors({
        name: '',
        mobile: '',
        email: '',
        password: '',
      });
    }, 2000);

    
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = async () => {
    if (!validateInputs()) return;

    try {
      const data = { mobile, email };
      const userData = {
        name,
        email,
        phone: mobile,
        password,
      };

      const response = await fetch('http://localhost:3000/api/user/auth/sendotp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),

        
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();
      console.log('This is the response:', result);

      if (result.success) {
        toast.success("Otp send Successfully")
        navigate('/otp', { state: userData,replace:true });
      } else {
        toast.error(result.message)
        console.error('Signup failed:', result.message);
      }
    } catch (error) {
      console.error('Error during signup:', error);
    }
  };

  return (
    <div className="h-screen bg-black md:h-screen flex-col">
      <div className="h-[10%] w-[100%] flex flex-row justify-between">
        <div className="h-[50%] w-[15%] space-x-2 flex mt-6 ml-6">
          <img alt="" />
          <h1 className="font-dm font-bold text-white text-2xl">PitCrew</h1>
        </div>
        <div className="h-[50%] w-[15%] flex mt-6 space-x-3 hover:cursor-pointer group" onClick={() => navigate("/login")}>
          <h1 className="text-md font-dm text-white mt-2 group-hover:text-customBlue">LOGIN</h1>
          <RiLoginCircleFill className="w-[20%] h-[100%] group-hover:text-customBlue" />
        </div>
      </div>
      <div className="h-[90%] flex flex-col md:flex-row">
        <div className="h-[50%] w-[100%] md:h-[100%] md:w-[50%] flex flex-row md:flex-col space-y-3 place-content-center items-center">
          <div className="md:h-[45%] w-[50%] md:w-[70%] flex justify-center">
            <img src={signInImg} className="md:h-[100%] w-[65%]" alt="" />
          </div>
          <div className="md:h-[40%] w-[50%] md:w-[70%]">
            <h1 className="text-xl md:text-2xl font-dm font-light tracking-widest text-white">
              "Everything will be repaired Here"
            </h1>
          </div>
        </div>
        <div className="h-[100%] bg-black w-[100%] md:h-[100%] md:w-[50%] place-content-center flex flex-row justify-center md:flex-col">
          <div className="bg-signcardblue bg-madBlack ml-10 w-[60%] h-[90%] rounded-md flex flex-col space-y-6 items-center">
            <div className="w-[100%] h-[5%] mb-3 hover:cursor-pointer">
              <h1 className="text-center mt-5 text-black font-dm font-bold text-2xl tracking-wider">SIGN UP</h1>
            </div>
            <div className="w-[80%] h-[40%]  space-y-6  flex-col place-content-evenly">
              <div>
                <input
                  className="w-[100%] py-2 bg-gray-300 rounded-md text-center"
                  placeholder="Name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {errors.name && <p className="text-red-500 text-center">{errors.name}</p>}
              </div>

              <div>
                <input
                  className="w-[100%] py-2 bg-gray-300 rounded-md text-center"
                  placeholder="Mobile"
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
                {errors.mobile && <p className="text-red-500 text-center">{errors.mobile}</p>}
              </div>

              <div>
                <input
                  className="w-[100%] py-2 bg-gray-300 rounded-md text-center"
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <p className="text-red-500 text-center">{errors.email}</p>}
              </div>

              <div>
                <input
                  className="w-[100%] py-2 bg-gray-300 rounded-md text-center"
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && <p className="text-red-500 text-center">{errors.password}</p>}
              </div>

            <div className="w-[100%]  space-y-3">
              <button
                className="bg-customBlue w-[100%] py-1 justify-center rounded-md text-2xl text-white"
                onClick={handleSubmit}
              > 
                SIGN UP
              </button>
              {/* <div className="bg-black w-[100%] py-2 flex flex-row items-center rounded-md">
                <div className="w-[30%] ">
                  <FcGoogle className="mt-2 w-[100%]" />
                </div>
                <div className="w-[70%] ">
                  <p className="mt-1 text-white text-md tracking-widest">SIGNUP WITH GOOGLE</p>
                </div>
              </div> */}
              <p className="text-white text-center hover:text-blue-400 cursor-pointer" onClick={() => navigate("/login")}>
                If you already have an account? Sign In
              </p>
            </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
