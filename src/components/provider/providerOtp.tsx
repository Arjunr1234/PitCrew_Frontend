import { RiLoginCircleFill } from "react-icons/ri";
import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; 
import OtpImage from '../../../public/images/provider_enterOpt.png';
import { toast } from 'sonner'; 

function UserOtp() {

  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate(); 
  const location = useLocation();
  const [seconds, setSeconds] = useState<number>(60);
  const [resend, setResend] = useState<boolean>(false);

  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (/^[0-9]$/.test(value)) { 
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (index < 3 && value !== '') {
        inputRefs.current[index + 1]?.focus(); 
      }
    }
  };

  const userData = location.state || {}
  console.log("Thisis theuserdata in otp page: ", userData)

 
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
      if (index > 0) {
        inputRefs.current[index - 1]?.focus(); 
      }
    }
  };

  const validateOtp = (otp: string) => {
    
    if(otp.length !== 4) {
      toast.error('Please enter a valid otp!!');
      return false;
    }
    return true;
  };

  useEffect(() => {
    const storedSeconds = localStorage.getItem('usertimer');
    if (storedSeconds) {
      setSeconds(Number(storedSeconds));
    }
  }, []);

  useEffect(() => {
    if (seconds > 0) {
      const timerId = setInterval(() => {
        setSeconds((prevSeconds) => {
          const newSeconds = prevSeconds - 1;
          localStorage.setItem('usertimer', newSeconds.toString());
          return newSeconds;
        });
      }, 1000);

      return () => clearInterval(timerId);
    } else {
      localStorage.removeItem('usertimer');
    }
  }, [seconds, resend]);

  const handleSubmitOtp = async () => {
    const otpValue = otp.join(''); 

   
    if (!validateOtp(otpValue)) {
      return; 
    }

    try {
      const response = await fetch('http://localhost:3000/api/provider/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ otp: otpValue, email:userData.email }), 
      });

      const result = await response.json();
      

      if (result.success) {
        console.log("////////////////////result.success")
        toast.success(result.message);
       navigate('/provider/addaddress',{state:userData,replace:true}); 
        localStorage.removeItem("usertimer")
      } else {
        toast.error(result.message || 'OTP verification failed'); 
      }
    } catch (error) {
      toast.error('Error verifying OTP'); 
      console.error('Error verifying OTP:', error);
    }
  };
    const handleResend = async () => {
        if(userData.email){
          const response = await fetch('http://localhost:3000/api/provider/auth/otp-send', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
          });

          if(response.ok){
            toast.success("Resend otp Succesffully");
            setSeconds(60);
            setResend(!resend)
          }
        }
    }

  return (
    <div className='h-screen bg-black md:h-screen flex-col'>
      <div className='h-[10%] w-[100%] flex flex-row justify-between'>
        <div className='h-[50%] w-[15%] space-x-2 flex mt-6 ml-6'>
          <img  alt="" />
          <h1 className='font-dm font-bold text-white text-2xl'>PitCrew</h1>
        </div>
        <div className='h-[50%] w-[15%] flex mt-6 space-x-3' onClick={() => navigate('/provider/login')}>
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
            <h1 className={seconds <= 10 ? 'mt-3 font-semibold text-sm text-red-500 h-[10px]' : 'mt-3 font-semibold text-sm h-[10px] text-white'}>
              {seconds > 0 ? `${seconds} seconds left` : " "}
            </h1>  
            <div className="h-[40px] w-[50%]">
             {
              seconds>0?
              <button
              className='bg-providerGreen mt-10 w-[100%] h-[40px] rounded-3xl text-madBlack font-dm'
              onClick={handleSubmitOtp} 
            >
              Proceed
            </button>:
             <button
             className='bg-blue-400 mt-10 w-[100%] h-[40px] rounded-3xl text-madBlack font-dm'
             onClick={handleResend} 
           >
             Resend
           </button>
             }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserOtp;