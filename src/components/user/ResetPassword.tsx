import { useState } from "react";
import { toast } from "sonner";
import { resetPasswordService } from "../../services/user/user";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";


function ResetPassword() {
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
  const [showPasswordsConfirm, setShowPasswordsConfirm] = useState<boolean>(false);
  const [showPasswordCurrent, setShowPasswordsCurrent] = useState<boolean>(false)
  const [showPasswordNew, setShowPasswordsNew] = useState<boolean>(false);
  const {userInfo} = useSelector((state:RootState) => state.user);
  

  const toggleConfirmPasswordVisibility = () => {
    setShowPasswordsConfirm(!showPasswordsConfirm);
  }
  const toggleCurrentPasswordVisibility = () => {
     setShowPasswordsCurrent(!showPasswordCurrent)
  }
  const toggleNewPasswordVisibility = () => {
     setShowPasswordsNew(!showPasswordNew)
  }

  const validateInputs = () => {
    const trimmedCurrentPassword = currentPassword.trim();
    const trimmedNewPassword = newPassword.trim();
    const trimmedConfirmNewPassword = confirmNewPassword.trim();
  
    if (!trimmedCurrentPassword) {
      toast.error("Current password is required.");
      return false;
    }
    if (!trimmedNewPassword) {
      toast.error("New password is required.");
      return false;
    } else if (trimmedNewPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return false;
    }
    if (trimmedNewPassword !== trimmedConfirmNewPassword) {
      toast.error("Passwords do not match.");
      return false;
    }
    return true;
  };
  

  const handleResetPassword = async() => {
       if(validateInputs()){
           try {
               const response = await resetPasswordService(userInfo?.id as string, currentPassword, newPassword);
               if(response.success){
                 toast.success(response.message);
                 setCurrentPassword('');
                 setConfirmNewPassword('');
                 setNewPassword('');
                 
               }
           } catch (error:any) {
              
              toast.error(error.response.data.message)
            
           }
       }
  }

  return (
    <div className="flex justify-center items-center h-full bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Reset Password
        </h2>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="current-password"
              className="block text-sm text-center font-medium text-gray-700"
            >
              Enter Current Password
            </label>
            <div className="relative">
              <input
                type={showPasswordCurrent ? "text" : "password"}
                id="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full text-center px-4 py-2 mt-1 border rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                
              />
              <button
                type="button"
                onClick={toggleCurrentPasswordVisibility}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
              >
                {showPasswordCurrent ? "🙈" : "👁️"}
              </button>
            </div>
          </div>
          <div>
            <label
              htmlFor="new-password"
              className="block text-sm text-center font-medium text-gray-700"
            >
              New Password
            </label>
            <div className="relative">
              <input
                type={showPasswordNew ? "text" : "password"}
                id="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full text-center px-4 py-2 mt-1 border rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                
              />
              <button
                type="button"
                onClick={toggleNewPasswordVisibility}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
              >
                {showPasswordNew ? "🙈" : "👁️"}
              </button>
            </div>
          </div>
          <div>
            <label
              htmlFor="confirm-new-password"
              className="block text-sm text-center font-medium text-gray-700"
            >
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showPasswordsConfirm ? "text" : "password"}
                id="confirm-new-password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="w-full text-center px-4 py-2 mt-1 border rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
              >
                {showPasswordsConfirm ? "🙈" : "👁️"}
              </button>
            </div>
          </div>
          <button
            className="w-full py-2 mt-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            onClick={handleResetPassword}
          >
            Reset Password
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
