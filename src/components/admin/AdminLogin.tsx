import loginVideo from '../../images/admin_login_video.mp4'

function AdminLogin() {
  return (
    <div className="bg-white flex flex-col md:flex-row h-screen">
      {/* left-section */}
      <div className="relative h-1/2 md:h-full w-full md:w-1/2 ">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          src={loginVideo}
          autoPlay
          loop
          muted
        />
        <div className="relative z-10 flex items-center justify-center h-full bg-black bg-opacity-50">
          <h2 className="text-white text-3xl font-bold">Welcome to Admin Panel</h2>
        </div>
      </div>

      {/* right-section */}
      <div className="h-1/2 md:h-full w-full md:w-1/2  flex justify-center items-center">
        {/* login page */}
        <div className="bg-gray-300 w-11/12 sm:w-4/5 md:w-3/4 lg:w-2/3 p-8 sm:p-12 rounded-md shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>
          
          {/* Form */}
          <form className="space-y-6">
            {/* Email input */}
            <div>
              <label htmlFor="email" className="block text-sm text-center font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 block text-center w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email"
              />
            </div>

            {/* Password input */}
            <div>
              <label htmlFor="password" className="block text-sm text-center font-medium">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="mt-1 block w-full px-3 py-2 border text-center border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your password"
              />
            </div>

            {/* Login button */}
            <div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
