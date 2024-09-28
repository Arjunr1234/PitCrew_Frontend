import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { RiLoginCircleFill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom'; // Use this to navigate to OTP page

function Signup() {
  // State variables for capturing user input
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

   localStorage.setItem('email', email);
  
  const navigate = useNavigate();

  // Function to handle form submission
  const handleSubmit = async () => {
    try {
      // Log the data being sent for debugging purposes
      console.log('Sending data:', { name, mobile, email, password });

      // Create the data object to send to backend
      const data = {
        
        mobile,
        email,
        
      };
      const userData = {
        name,
        email,
        phone:mobile,
        password,
      }
       console.log(name, email, mobile, password)
      // Send POST request to backend
      const response = await fetch('http://localhost:3000/api/user/auth/sendotp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), 
      });

      // Check for server response
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();
      console.log("This is the response: ", result);

      // If signup is successful, redirect to the OTP page
      if (response.ok) {
        console.log('Signup successful, navigating to OTP page');
        
        navigate('/otp', { state:  userData  });
      } else {
        console.error('Signup failed:', result.message);
      }
    } catch (error) {
      console.error('Error during signup:', error);
    }
  };

  return (
    <div className='h-screen bg-black md:h-screen flex-col'>
      <div className='h-[10%] w-[100%] flex flex-row justify-between'>
        <div className='h-[50%] w-[15%] space-x-2 flex mt-6 ml-6'>
          <img alt="" />
          <h1 className='font-dm font-bold text-white text-2xl'>PitCrew</h1>
        </div>
        <div className='h-[50%] w-[15%] flex mt-6 space-x-3 hover:cursor-pointer  group' onClick={() => navigate("/login")}>
          <h1 className='text-md font-dm text-white mt-2 group-hover:text-customBlue ' >LOGIN </h1>
          <RiLoginCircleFill className='w-[20%] h-[100%]  group-hover:text-customBlue ' />
        </div>
      </div>
      <div className='h-[90%] flex flex-col md:flex-row'>
        <div className='h-[50%] w-[100%] md:h-[100%] md:w-[50%] flex flex-row md:flex-col space-y-3 place-content-center items-center'>
          <div className='md:h-[45%] w-[50%] md:w-[70%] flex justify-center'>
            <img className='md:h-[100%] w-[65%]'></img>
          </div>
          <div className='md:h-[40%] w-[50%] md:w-[70%]'>
            <h1 className='text-xl md:text-2xl font-dm font-light tracking-widest text-white'>
              "Everything will be repaired Here"
            </h1>
          </div>
        </div>
        <div className='h-[100%] bg-black w-[100%] md:h-[100%] md:w-[50%] place-content-center flex flex-row justify-center md:flex-col'>
          <div className='bg-signcardblue bg-madBlack ml-10 w-[60%] h-[90%] rounded-md flex flex-col space-y-6 items-center'>
            <div className='w-[100%] h-[5%] mb-3 hover:curson-pointer'>
              <h1 className='text-center mt-5 text-black font-dm font-bold text-2xl tracking-wider'>SIGN UP</h1>
            </div>
            <div className='w-[80%] h-[40%] space-y-6 mt-6 flex-col place-content-evenly'>
              <input
                className='w-[100%] h-[15%] bg-gray-300 rounded-md text-center'
                placeholder='Name'
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)} // Update name state
              />
              <input 
                className='w-[100%] h-[15%] bg-gray-300 rounded-md text-center'
                placeholder='Mobile'
                type='text'
                value={mobile}
                onChange={(e) => setMobile(e.target.value)} 
              />
              <input
                className='w-[100%] h-[15%] bg-gray-300 rounded-md text-center'
                placeholder='Email'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Update email state
              />
              <input
                className='w-[100%] h-[15%] bg-gray-300 rounded-md text-center'
                placeholder='Password'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Update password state
              />
            </div>
            <div className='w-[80%] h-[10%] mt-0 space-y-3'>
              <button
                className='bg-customBlue w-[100%] h-[80%] justify-center rounded-md text-2xl text-white'
                onClick={handleSubmit} // Call handleSubmit when button is clicked
              >
                SIGN UP
              </button>
              <div className='bg-black w-[100%] h-[80%] flex flex-row items-center rounded-md'>
                <div className='w-[30%] h-[50%]'>
                  <FcGoogle className='mt-2 w-[100%]' />
                </div>
                <div className='w-[70%] h-[50%]'>
                  <p className='mt-1 text-white text-md tracking-widest'>SIGNUP WITH GOOGLE</p>
                </div>
              </div>
              <p className='text-white text-center hover:text-blue-400 cursor-pointer' onClick={() => navigate("/login")} >
                If you already have an account? Sign In
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
