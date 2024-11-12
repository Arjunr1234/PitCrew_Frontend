import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12">
      <div className="container mx-auto px-6">
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
          
          {/* Company Logo and Description */}
          <div className="w-full lg:w-1/3">
            <h2 className="text-3xl font-bold text-blue-500 mb-4">PitCrew</h2>
            <p className="text-gray-400 mb-4">
              Your trusted partner for 24/7 vehicle repair and maintenance services. We're here whenever you need assistance, wherever you are.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="https://facebook.com" className="text-gray-400 hover:text-blue-500" target="_blank" rel="noopener noreferrer">
                <FaFacebook size={20} />
              </a>
              <a href="https://twitter.com" className="text-gray-400 hover:text-blue-500" target="_blank" rel="noopener noreferrer">
                <FaTwitter size={20} />
              </a>
              <a href="https://instagram.com" className="text-gray-400 hover:text-blue-500" target="_blank" rel="noopener noreferrer">
                <FaInstagram size={20} />
              </a>
              <a href="https://linkedin.com" className="text-gray-400 hover:text-blue-500" target="_blank" rel="noopener noreferrer">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="w-full lg:w-1/3">
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/" className="hover:text-white">Home</Link></li>
              <li><Link to="/services" className="hover:text-white">Services</Link></li>
              <li><Link to="/about" className="hover:text-white">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="w-full lg:w-1/3">
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-blue-500" />
                <span> Repair Ave, Vaikom, India</span>
              </li>
              <li className="flex items-center gap-2">
                <FaPhone className="text-blue-500" />
                <a href="tel:+1234567890" className="hover:text-white">9444000222(customer-care)</a>
              </li>
              <li className="flex items-center gap-2">
                <FaEnvelope className="text-blue-500" />
                <a href="mailto:info@pitcrew.com" className="hover:text-white">info@pitcrew.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-10 border-t border-gray-700 pt-4 flex flex-col lg:flex-row justify-between items-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} PitCrew. All Rights Reserved.</p>
          <div className="flex gap-4 mt-2 lg:mt-0">
            <Link to="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
