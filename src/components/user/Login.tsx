import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../interface/hooks';  
import { signInThunk } from '../../redux/slice/userAuthSlice';  
import { useNavigate } from 'react-router-dom';
import { FaUserPlus } from 'react-icons/fa';
import {RootState} from '../../redux/store';
import { toast } from 'sonner';
import loginImg from '../../../public/images/loginImg.jpg'

function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

 
  const { message, error, isLoading, success } = useSelector((state: RootState) => state.user);

  // const samp = useSelector((state: RootState) => state.user);
  // console.log("This is samp: ", samp);
  const handleLogin = async () => {
    const logData = { email, password };

    try {
      const resultAction = await dispatch(signInThunk(logData));  
      console.log("This is the message: ",message)
      if (success) {
        //console.log('Login successful:', resultAction);
        console.log('Message from Redux state:', message); // You can access the message here
        toast.success(message)
        navigate('/userHome');
      } else {
        toast.error(message)
        console.error('Login failed');
        console.log('Error message from Redux state:', message); // You can access the error message here
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className='h-screen bg-black md:h-screen flex-col'>
      <div className='h-[10%] w-[100%] flex flex-row justify-between'>
        <div className='h-[50%] w-[15%] space-x-2 flex mt-6 ml-6'>
          <img alt="" />
          <h1 className='font-dm font-bold text-white text-2xl'>PitCrew</h1>
        </div>
        <div
          className="h-[50%] w-[15%] flex mt-6 items-center space-x-1 cursor-pointer group"
          onClick={() => navigate('/register')}
        >
          <h1 className="text-md font-dm text-white group-hover:text-customBlue">
            SignUp
          </h1>
          <FaUserPlus className="w-5 h-5 text-white group-hover:text-customBlue" />
        </div>
      </div>
      <div className='h-[90%] flex flex-col md:flex-row'>
        <div className='h-[50%] w-[100%] md:h-[100%] md:w-[50%] mt-5 flex flex-row md:flex-col space-y-3 place-content-center items-center'>
          <div className='md:h-[50%] w-[50%] md:w-[70%] flex justify-center'>
            <img  src={loginImg}  className='md:h-[100%] w-[85%]'></img>
          </div>
          <div className='md:h-[40%] w-[50%] md:w-[70%]'>
            <h1 className='text-xl md:text-4xl text-center mt-5 font-dm font-light tracking-widest text-white'>
              "Everything will be repaired Here"
            </h1>
          </div>
        </div>
        <div className='h-[100%] bg-black w-[100%] md:h-[100%] md:w-[50%] flex flex-row justify-center md:flex-col'>
          <div className='bg-signcardblue bg-madBlack ml-10 w-[60%] h-[90%] rounded-md flex flex-col space-y-6 items-center'>
            <div className='w-[100%] h-[5%] mb-3'>
              <h1 className='text-center mt-5 text-white font-dm font-bold text-2xl tracking-wider'>
                LOGIN
              </h1>
            </div>
            
            
            <div className='w-[80%] h-[30%] space-y-1 mt-6 flex flex-col justify-between'>
              <input 
                className='mt-10 w-[100%] h-[25%] bg-gray-300 rounded-md text-center'
                placeholder='Email' 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
              <input 
                className='mt-20 w-[100%] h-[25%] bg-gray-300 rounded-md text-center'
                placeholder='Password' 
                type="password"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>
            
            
            <div className='w-[80%] h-[10%] mt-10 justify-center flex flex-row'>
              <button 
                className='bg-customBlue w-[100%] h-[80%] mt-10 rounded-md text-2xl text-white hover:bg-blue-400'
                onClick={handleLogin} 
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </div>
            
            <div>
              <p className='text-white text-center mt-20 hover:text-blue-400 cursor-pointer' onClick={() => navigate('/register')}>
                If you already have an account? SignUp
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;