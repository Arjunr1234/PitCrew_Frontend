import { useAppDispatch } from "../../interface/hooks"
import { logoutApi } from "../../services/user/userAuthService"


function userHome() {
          const dispatch = useAppDispatch()

          const handleLogOut = () => {
              dispatch(logoutApi)
          }

  return (
    <>
          <h1>Welcome to UserHome</h1>
          <button onClick={handleLogOut}>Logout</button>
          
    </>
  )
}

export default userHome
