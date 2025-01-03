import { useState, } from 'react';
import { RiLoginCircleFill } from 'react-icons/ri';
import { useNavigate,  } from 'react-router-dom';
import { toast } from 'sonner';
import signupImg from '../../../public/images/provider_signup.png'



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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email validation regex
    const phoneRegex = /^[1-9][0-9]{9}$/; // Regex to validate phone number

    // Validate Name
    if (!name) {
      newErrors.name = 'Name is required.';
    }

    // Validate Email
    if (!email) {
      newErrors.email = 'Email is required.';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Invalid email format.';
    }

    // Validate Password
    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    // Validate Mobile Number
    if (!mobile) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!phoneRegex.test(mobile)) {
      newErrors.mobile = 'Please enter a 10 digit mobile number';
    }

    setErrors(newErrors);

    // Show errors for 2 seconds
    setTimeout(() => {
      setErrors({
        name: '',
        mobile: '',
        email: '',
        password: '',
      });
    }, 2000);

    // Return true if no errors
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
       
      const response = await fetch('http://localhost:3000/api/provider/auth/otp-send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
       console.log("This is the signupresonse: ", response)
      if (!response.ok) {
         const errorResponse = await response.json();  
         toast.error(errorResponse.message); 
        throw new Error(`Server error: ${response.status}`);
      }
                                                        
      const result = await response.json();
      console.log('This is the response:', result);

      if (response.ok) {
        toast.success("Otp sent successfully");
        console.log("This is the userDAta in signupPage: ",userData)
        navigate('/provider/otp', { state: userData }); 
      } else {
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
        <div className="h-[50%] w-[15%] flex mt-6 space-x-3 hover:cursor-pointer group" onClick={() => navigate("/provider/login")}>
          <h1 className="text-md font-dm text-white mt-2 group-hover:text-providerGreen">LOGIN</h1>
          <RiLoginCircleFill className="w-[20%] h-[100%] group-hover:text-providerGreen" />
        </div>
      </div>
      <div className="h-[90%] flex flex-col md:flex-row">
        <div className="h-[50%] w-[100%] md:h-[100%] md:w-[50%] flex flex-row  md:flex-col space-y-3 place-content-center items-center">
          <div className="md:h-[45%] w-[50%] md:w-[70%] flex justify-center">
            <img src={signupImg} className="md:h-[100%] w-[65%]" alt="" />
          </div>
          <div className="md:h-[40%] w-[50%] md:w-[70%]  flex flex-col gap-10">
            <h1 className="text-xl md:text-4xl text-center font-bold font-dm  tracking-widest text-white">
            "Join our network of trusted workshops."
            </h1>
            <h1 className="text-xl md:text-3xl text-center font-dm font-light tracking-widest text-white">
            "Grow your business with us."
            </h1>
          </div>
        </div>
        <div className="h-[100%] bg-black w-[100%] md:h-[100%] md:w-[50%] place-content-center flex flex-row justify-center md:flex-col">
          <div className="bg-signcardblue bg-madBlack ml-10 w-[60%] h-[90%] rounded-md flex flex-col space-y-6 items-center">
            <div className="w-[100%] h-[5%] mb-3 py-4 hover:cursor-pointer">
              <h1 className="text-center mt-5 text-white font-dm font-bold text-2xl tracking-wider">SIGN UP</h1>
            </div>
            <div className="w-[80%] h-[40%]   space-y-6  flex-col place-content-evenly">
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
                className="bg-providerGreen w-[100%] py-1 justify-center rounded-md text-2xl text-white"
                onClick={handleSubmit}
              >
                SIGN UP
              </button>
              
              <p className="text-white text-center hover:text-blue-400 cursor-pointer" onClick={() => navigate("/provider/login")}>
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
