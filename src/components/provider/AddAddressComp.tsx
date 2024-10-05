import React, { useState } from 'react';
import Addaddress from '../../images/addAddressImg.png';
import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useAppDispatch } from '../../interface/hooks';
import { signupThunk } from '../../redux/thunk/provider';
import { SignupData } from '../../interface/provider/iProviderAuth';

interface Viewport {
  longitude: number;
  latitude: number;
  zoom: number;
}

interface UserLocation {
  longitude: number;
  latitude: number;
}

function AddAddressComp() {
  const [latitudeX, setLatitude] = useState<number>(9.7473);
  const [longitudeY, setLongitude] = useState<number>(76.3964);
  const [viewport, setViewport] = useState<Viewport>({
    longitude: longitudeY,
    latitude: latitudeX,
    zoom: 14,
  });
  const location = useLocation();
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [address, setAddress] = useState<string>('');  
  const [textAddress, setTextAddress] = useState<string>('');
  const dispatch = useAppDispatch()

  const userData = location.state || {}
  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { longitude, latitude } = position.coords;

          
          setViewport({
            longitude,
            latitude,
            zoom: 14,
          });

          setUserLocation({ longitude, latitude });

          const fetchedAddress = await fetchAddress(longitude, latitude);
          setAddress(fetchedAddress);  

          
          console.log('Fetched Address: ajr', fetchedAddress);

          console.log('Current Location:', { longitude, latitude });
          setLatitude(latitude);
          setLongitude(longitude)

        },
        (error) => {
          console.error('Error getting current location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  
  const fetchAddress = async (longitude: number, latitude: number): Promise<string> => {
    const accessToken = 'pk.eyJ1IjoiYmluaXNoMTkwNSIsImEiOiJjbTFpdzE1OHcwcGdqMnJxbDUxdDN5cnExIn0.TYM92lLjTLoETRIJEiJWPw';  // Use your Mapbox access token here
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${accessToken}`;

    try {
      const response = await axios.get(url);
      
      console.log("This is the address response: ", response)
      const features = response.data.features;
      if (features && features.length > 0) {
        const address = features[0].place_name;
      
        return address;  
      } else {
        return 'Address not found';
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      return 'Error fetching address';
    }
  };

  
    

  const handleCancell = () => {
      console.log("This s userdata: ",userData)
      setAddress('')
  }

  const handleRegisterProvider = (event: React.FormEvent) => {
    event.preventDefault(); 
    
    const isValidName: boolean = /^[A-Za-z]+$/.test(textAddress.split(" ").join(""));
    console.log(isValidName);
  
    if (!isValidName || textAddress.trim() === '') {
      toast.error("Enter your workshop name");
      return;
    }
  
    const providerData: SignupData = {
      workshopName: textAddress,
      ownerName: userData.name,
      mobile: userData.phone,
      email: userData.email,
      password: userData.password,
      workshopDetails: {
        address: address,
        coordinates: {
          lat: latitudeX,
          long: longitudeY,
        },
      },
    };
    console.log("userData: ",userData)
  
    const response = dispatch(signupThunk(providerData));
  
    console.log("response: ", response);
  };
  

  return (
    <div className="bg-black min-h-screen w-full">
      <div className="h-[10%] w-[100%] flex flex-row justify-between">
        <div className="h-[50%] w-[15%] space-x-2 flex mt-6 ml-6">
          <img alt="" />
          <h1 className="font-dm p-2 font-bold text-white text-2xl">PitCrew</h1>
        </div>
      </div>


      <div className="flex flex-col lg:flex-row justify-between items-center h-full py-10">
        {/* Left Section: Image and Text */}
        <div className="w-full lg:w-1/2 px-6 flex flex-col items-center lg:items-start text-center lg:text-left">
          <img src={Addaddress} alt="Add Address" className="w-3/4 h-auto mb-6 mx-auto" />
          <h2 className="text-white text-4xl font-bold mb-4 mx-auto">Add Your Address</h2>
        </div>

        {/* Right Section: Form with Input Fields */}
        <div className="w-full lg:w-1/2 px-6">
          <div className="bg-madBlack p-8 rounded-lg shadow-lg w-full max-w-lg mx-auto">
            <form>
              <div className="mb-4 flex flex-col gap-5">
                <label className="block text-gray-100 font-bold mb-2">Workshop Address</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-300"
                  placeholder="Enter address"
                  onChange={(e) => setTextAddress(e.target.value)}  
                    
                />

                {/* Map Section */}
                <div className="h-60 bg-gray-200">
                  <Map
                    mapboxAccessToken="pk.eyJ1IjoiYmluaXNoMTkwNSIsImEiOiJjbTFpdzE1OHcwcGdqMnJxbDUxdDN5cnExIn0.TYM92lLjTLoETRIJEiJWPw"
                    {...viewport}
                    style={{ width: '100%', height: '100%' }}
                    mapStyle="mapbox://styles/mapbox/streets-v9"
                    attributionControl={false}
                    onMove={(evt) => setViewport(evt.viewState)}
                  >
                    {/* Add a marker for the user's current location */}
                    {userLocation && (
                      <Marker longitude={userLocation.longitude} latitude={userLocation.latitude} color="red" />
                    )}
                  </Map>
                </div>

                {/* Button to get current location */}
                {(latitudeX && longitudeY && address)?
                <div>
                  <h1 className='text-white mb-5'>{address}</h1>
                  <div className='flex flex-row justify-between'>
                    
                     <button className='bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-700' onClick={handleCancell}>Cancell</button>
                     <button className='bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-700' onClick={handleRegisterProvider}>Submit</button>
                  </div>
                </div>
                :<button
                type="button"
                onClick={handleGetCurrentLocation}
                className="bg-providerGreen text-black px-6 py-2 rounded-md hover:bg-blue-600"
              >
                Add current location
              </button> }
                
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddAddressComp;
