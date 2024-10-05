import { RiLoginCircleFill } from "react-icons/ri";
import { useState, useRef } from 'react';
import { useLocation, useNavigate, } from 'react-router-dom'; 
import OtpImage from '../../../public/images/otp.png'
import { useAppDispatch } from "../../interface/hooks";
import { otpVerifyAndSignupThunk } from "../../redux/slice/userAuthSlice";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";



function UserOtp() {
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate(); // Initialize navigate function
  const location = useLocation();
  const dispatch = useAppDispatch() // Use AppDispatch as the type
  
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (/^[0-9]$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (index < 3 && value !== '') {
        inputRefs.current[index + 1]?.focus(); // Move focus to next input
      }
    }
  };

  const userData = location.state || {}
  const {message, success} = useSelector((state:RootState) => state.user)

  // Handle key down (Backspace handling)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
      if (index > 0) {
        inputRefs.current[index - 1]?.focus(); // Move focus to previous input
      }
    }
  };

  const handleSubmitOtp = async () => {
    try {
      const otpValue = otp.join(''); 

      const result = await dispatch(otpVerifyAndSignupThunk({ userData, otp: otpValue }));
      console.log("This is the result in the otp Page: ", result)
      //otpVerifyAndSignupThunk.fulfilled.match(result)
      if (success) {
       
        toast.success("Signup Successsfull!!")
        navigate('/'); 
      } else if (otpVerifyAndSignupThunk.rejected.match(result)) {
        
        console.error('OTP verification failed:', result.payload || 'Error');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
    }
  };

  return (
    <div className='h-screen bg-black md:h-screen flex-col'>
      <div className='h-[10%] w-[100%] flex flex-row justify-between'>
        <div className='h-[50%] w-[15%] space-x-2 flex mt-6 ml-6'>
          <img  alt="" />
          <h1 className='font-dm font-bold text-white text-2xl'>PitCrew</h1>
        </div>
        <div className='h-[50%] w-[15%] flex mt-6 space-x-3'>
          <h1 className='text-md font-dm text-white mt-2'>LOGIN</h1>
          <RiLoginCircleFill className='w-[20%] h-[100%] text-white' />
        </div>
      </div>
      <div className='h-[90%] flex flex-col md:flex-row'>
        <div className='h-[50%] w-[100%] md:h-[100%] md:w-[50%] flex flex-row md:flex-col space-y-3 place-content-center items-center'>
          <div className='md:h-[45%] w-[50%] md:w-[70%] flex justify-center'>
            <img src={OtpImage} className='md:h-[100%] w-[65%]'></img>
          </div>
          <div className='md:h-[40%] w-[50%] md:w-[70%]'>
            <h1 className='text-xl md:text-3xl font-dm font-light text-center tracking-widest text-white mb-2'>
              "Your journey to seamless repairs starts here"
            </h1>
            <p className='text-md md:text-xl font-dm font-light text-center tracking-wide text-white'>
              Enter the OTP to confirm your identity and proceed with confidence!
            </p>
          </div>
        </div>
        <div className='h-[50%] w-[100%] md:h-[100%] md:w-[50%] place-content-center flex flex-row justify-center md:flex-col'>
          <div className='bg-madBlack w-[60%] h-[300px] rounded-md flex flex-col items-center'>
            <h1 className='text-white mt-6'>ENTER OTP</h1>
            <p className='text-gray-200 text-sm font-thin'>OTP SENT TO YOUR EMAIL</p>
            <div className='flex flex-row w-[100%] mt-4 justify-evenly'>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={el => (inputRefs.current[index] = el)} // Create ref for each input
                  className='w-[17%] h-[90px] rounded-md bg-gray-400 text-center text-black text-3xl'
                  maxLength={1} 
                  value={digit}
                  onChange={e => handleChange(e, index)}
                  onKeyDown={e => handleKeyDown(e, index)}
                  type='text'
                  inputMode='numeric' 
                />
              ))}
            </div>
            <div className="h-[40px] w-[50%]">
              <button
                className='bg-customBlue mt-10 w-[100%] h-[40px] rounded-3xl text-madBlack font-dm'
                onClick={handleSubmitOtp} 
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserOtp;
