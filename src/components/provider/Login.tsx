import { useEffect, useState } from "react";
import { useAppDispatch } from "../../interface/hooks";
import { loginThunk } from "../../redux/thunk/provider";
import loginImg from '../../images/providerLoginImg.png'
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { resetError, resetSuccess } from "../../redux/slice/providerAuthSlice";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const dispatch = useAppDispatch();
  const { error, errorMessage, success, message } = useSelector((state: any) => state.provider);
  const navigate = useNavigate()


  useEffect(() => {
    if (error) {
      toast.error(errorMessage);
      dispatch(resetError())
    }
    if (success) {
      toast.success(message);
      navigate('/provider/dashboard');
      dispatch(resetSuccess())
    }

  }, [error, errorMessage, success, message])

  const handleLogin = () => {
    let valid = true;


    setEmailError('');
    setPasswordError('');

    if (!email) {
      setEmailError('Email cannot be empty');
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email');
      valid = false;
    }


    if (!password) {
      setPasswordError('Password cannot be empty');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      valid = false;
    }

    if (valid) {
      const logData = {
        email,
        password,
      };

      dispatch(loginThunk(logData))


      console.log("Login successful:", logData);
    }


    setTimeout(() => {
      setEmailError('');
      setPasswordError('');
    }, 2000);
  };

  return (
    <div className="bg-black min-h-screen w-full ">
      <div className="h-[10%] w-[100%] flex flex-row justify-between">
        <div className="h-[50%] w-[15%] space-x-2 flex mt-6 ml-6">
          <img alt="" />
          <h1 className="font-dm p-2 font-bold text-white text-2xl">PitCrew</h1>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-center h-full py-10">
        <div className="w-full lg:w-1/2 px-6 flex flex-col items-center lg:items-start text-center lg:text-left">
          <img src={loginImg} alt="Add Address" className="w-3/4 h-auto mb-6 mx-auto" />
          <h2 className="text-white text-center text-2xl font-bold mb-4 mx-auto">
            Welcome back, log in to manage your workshop.
          </h2>
        </div>

        <div className="w-full lg:w-1/2 px-6">
          <div className="my-box bg-madBlack h-[500px] p-8 rounded-lg shadow-lg w-full max-w-lg mx-auto">
            <form>
              <div className="mb-4 flex flex-col gap-10">
                <label className="block text-gray-100 text-center text-3xl font-bold mb-2">
                  Login
                </label>
                <input
                  type="email"
                  className="mx-5 py-2 text-center border border-gray-300 rounded-md bg-gray-300"
                  placeholder="Enter email"
                  onChange={(e) => setEmail(e.target.value)}
                />
                {emailError && (
                  <p className="text-red-500 text-center text-lg mx-5">{emailError}</p>
                )}

                <input
                  type="password"
                  className="mx-5 py-2 text-center border border-gray-300 rounded-md bg-gray-300"
                  placeholder="Enter password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                {passwordError && (
                  <p className="text-red-500 text-lg text-center ">{passwordError}</p>
                )}

                <button
                  type="button"
                  className="bg-providerGreen mx-5 text-black px-6 py-2 rounded-md hover:bg-blue-600"
                  onClick={handleLogin}
                >
                  Login
                </button>
                <p
                  className="text-white text-center hover:text-blue-400 cursor-pointer"
                  onClick={() => navigate("/provider/register")}
                >
                  Don't have an account? Sign Up
                </p>

              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
