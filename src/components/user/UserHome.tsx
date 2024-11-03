import { useEffect, useRef } from 'react';
import showImage from '../../images/userHome_img1.png';
import tyreRollingImg from '../../images/tyre_rolling_img.png';
import { FaCar, FaTools, FaHome, FaCogs, FaShieldAlt, FaSatelliteDish } from 'react-icons/fa'; 
import { useNavigate } from 'react-router-dom';

function UserHome() {
  const leftSectionRef = useRef<HTMLDivElement | null>(null);
  const rightSectionRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === leftSectionRef.current) {
              entry.target.classList.add('animate-fadeInLeft');
            } else if (entry.target === rightSectionRef.current) {
              entry.target.classList.add('animate-fadeInRight');
            }
          } else {
            // Optionally, reset the animation classes
            if (entry.target === leftSectionRef.current) {
              entry.target.classList.remove('animate-fadeInLeft');
            } else if (entry.target === rightSectionRef.current) {
              entry.target.classList.remove('animate-fadeInRight');
            }
          }
        });
      },
      { threshold: 0.1 } // Trigger when 10% of the section is visible
    );

    if (leftSectionRef.current) observer.observe(leftSectionRef.current);
    if (rightSectionRef.current) observer.observe(rightSectionRef.current);

    return () => {
      if (leftSectionRef.current) observer.unobserve(leftSectionRef.current);
      if (rightSectionRef.current) observer.unobserve(rightSectionRef.current);
    };
  }, []);

  return (
    <div>
      {/* First Section */}
      <div className="bg-gradient-to-b from-customBlue mt-3 to-gray-100 py-10 rounded-t-3xl mx-3">
        <div className="container mx-auto flex flex-col lg:flex-row justify-between items-center">
          {/* Left Section: Text and Button */}
          <div className="animate-fade-right w-full lg:w-1/2 px-6 flex flex-col gap-5 text-center lg:text-left">
            <h1 className="text-2xl font-bold text-gray-800 mb-2 lg:mb-4">24 x 7 on-spot</h1>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold animate-fade-right">Bike and Car Repair Services</h1>
            <p className="text-gray-600 mb-6">We offer reliable bike and car services anytime, anywhere.</p>
            <button className="bg-gray-500 text-white px-6 py-2 self-center lg:self-start rounded-3xl hover:bg-blue-600"
            onClick={() => {navigate('/services')}}>
              Book Now
            </button>
          </div>

          {/* Right Section: Image */}
          <div className="animate-fade-left animate-ease-out w-full lg:w-1/2 px-6 mt-8 lg:mt-0">
            <img src={showImage} alt="Bike and Car Service" className="w-full h-auto rounded" />
          </div>
        </div>
      </div>

      {/* Second Section with Custom Animation */}
      <div className="bg-gray-100 py-10 mx-3">
        <div className="container mx-auto flex flex-col lg:flex-row justify-between items-center">
          {/* Left Section with Custom Animation */}
          <div ref={leftSectionRef} className="w-full lg:w-1/2 px-6 flex flex-col gap-10 text-center lg:text-left">
            <h1 className="text-2xl font-bold text-gray-800 mb-2 lg:mb-4">Reliable Repair Services</h1>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold">24 x 7 Assistance</h1>
            <p className="text-gray-600 mb-6">We offer reliable repair services with 24/7 assistance. Whether you're at home, on the road, or at work, our platform connects you with professional vehicle workshops for quick and efficient maintenance. Book with confidence, knowing our expert technicians are ready to provide top-notch service whenever you need it. Your convenience is our priority.</p>
            <button className="bg-gray-500 text-white px-6 py-2 self-center lg:self-start rounded-3xl hover:bg-blue-600">
              Contact Us
            </button>
          </div>

          {/* Right Section with Custom Animation */}
          <div ref={rightSectionRef} className="w-full lg:w-1/2 px-6 mt-8 lg:mt-0">
            <img src={tyreRollingImg} alt="Bike and Car Service" className="w-full h-auto rounded" />
          </div>
        </div>
      </div>
      
      {/* Third section */}
      <div className="mx-3 py-10 bg-gray-100 justify-start flex flex-col gap-8">
        <h1 className="text-center text-6xl mb-6 font-semibold">PitCrew Service Ecosystem</h1>
        <p className="mx-8 font-montserrat font-semibold text-gray-600 mb-10">
        Our comprehensive service ecosystem ensures your vehicle is always taken care of, whether it's providing immediate help during unexpected breakdowns, offering scheduled maintenance plans for long-term care, or delivering expert assistance right to your doorstep. We also cater to enhancing your vehicle’s functionality and appearance, safeguard it with extended coverage beyond the usual terms, and ensure modern connectivity through advanced monitoring systems.  </p>
        {/* Third Row */}
        <div className="grid grid-cols-2 md:grid-cols-3  gap-6 text-center">
          {/* RSA */}
          <div className="flex flex-col items-center">
            <FaCar className="text-4xl text-blue-600 mb-4" />
            <h2 className="text-lg font-bold">RSA</h2>
          </div>

          {/* AMC Services */}
          <div className="flex flex-col items-center">
            <FaTools className="text-4xl text-green-600 mb-4" />
            <h2 className="text-lg font-bold">AMC Services</h2>
          </div>

          {/* Doorstep Services */}
          <div className="flex flex-col items-center">
            <FaHome className="text-4xl text-purple-600 mb-4" />
            <h2 className="text-lg font-bold">Doorstep Services</h2>
          </div>

          {/* Accessories Fitment */}
          <div className="flex flex-col items-center">
            <FaCogs className="text-4xl text-orange-600 mb-4" />
            <h2 className="text-lg font-bold">Accessories Fitment</h2>
          </div>

          {/* Extended Warranty */}
          <div className="flex flex-col items-center">
            <FaShieldAlt className="text-4xl text-red-600 mb-4" />
            <h2 className="text-lg font-bold">Extended Warranty</h2>
          </div>

          {/* Telematic Installation */}
          <div className="flex flex-col items-center">
            <FaSatelliteDish className="text-4xl text-yellow-600 mb-4" />
            <h2 className="text-lg font-bold">Telematic Installation</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserHome;
