import showImage from '../../../public/images/userHome_img1.png'

function UserHome() {
  return (
    <>
      <div>
        <div className="bg-gradient-to-b from-customBlue mt-3 to-white py-10 rounded-3xl mx-3">
          <div className="container mx-auto flex flex-col lg:flex-row justify-between items-center">

            {/* Left Section: Text and Button */}
            <div className="w-full lg:w-1/2 px-6 flex flex-col gap-5 text-center lg:text-left">
              <h1 className="text-2xl font-bold text-gray-800 mb-2 lg:mb-4">
                24 x 7 on-spot
              </h1>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold">
                Bike and Car Repair Services
              </h1>
              <p className="text-gray-600 mb-6">
                We offer reliable bike and car services anytime, anywhere. Trust us for quick and professional vehicle maintenance, wherever you are.
              </p>
              <button className="bg-gray-500 text-white px-6 py-2 self-center lg:self-start rounded-3xl hover:bg-blue-600">
                Book Now
              </button>
            </div>

            {/* Right Section: Image */}
            <div className="w-full lg:w-1/2 px-6 mt-8 lg:mt-0">
              <img src={showImage} alt="Bike and Car Service" className="w-full h-auto rounded" />
            </div>

          </div>
        </div>
        <div className="h-screen">
          <h1>sdkjfkdsjfs</h1>
        </div>
      </div>
    </>
  );
}

export default UserHome;
