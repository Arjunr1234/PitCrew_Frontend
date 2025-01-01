import React, { useEffect, useRef, useState } from 'react';
//import { brandData, vehicleBrands } from '../../assets/exportData';
import { FaSearch } from 'react-icons/fa';
import mapboxgl, { Map } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios';
import { toast } from 'sonner';

import { useLocation, useNavigate } from 'react-router-dom';
import { fetchBrandService } from '../../services/user/user';

function AddVehicleDetailsComp() {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleBrand, setVehicleBrand] = useState<{ brandName: string; id: string } | null>(null);
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [kilometers, setKilometers] = useState<number | null>(null);
  const [fuelType, setFuelType] = useState('');
  const [brandInput, setBrandInput] = useState('');
  const [intialBrand, setInitialBrand] = useState<{ brandName: string; id: string }[] | []>([])
  const [filteredBrands, setFilteredBrands] = useState<{ brandName: string; id: string }[] | []>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const locationUse = useLocation()
  const [places, setPlaces] = useState<{ place_name: string, coordinates: [number, number] }[] | []>([]);
  const [location, setLocation] = useState<{ place_name: string, coordinates: [number, number] } | undefined>(undefined)
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate()
  

  const INITIAL_CENTER: [number, number] = [76.3257,9.9384 ];
  const INITIAL_ZOOM = 14.12;

  const mapRef = useRef<Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null); 
  const {serviceId, serviceName} = locationUse.state
  

  

  //const [center, setCenter] = useState<[number, number]>(INITIAL_CENTER);
  const [zoom, setZoom] = useState<number>(INITIAL_ZOOM);
 // const accessToken = 'pk.eyJ1IjoiYmluaXNoMTkwNSIsImEiOiJjbTFpdzE1OHcwcGdqMnJxbDUxdDN5cnExIn0.TYM92lLjTLoETRIJEiJWPw';
 
 const accessToken = import.meta.env.VITE_MAP_TOKEN;


  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken = accessToken;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: location?.coordinates || INITIAL_CENTER,
      zoom: zoom,
    });

    mapRef.current.on('move', () => {
      const mapCenter = mapRef.current?.getCenter();
      const mapZoom = mapRef.current?.getZoom();

      if (mapCenter && mapZoom !== undefined) {
      //  setCenter([mapCenter.lng, mapCenter.lat]);
        setZoom(mapZoom);
      }
    });

    return () => {
      mapRef.current?.remove();
    };
  }, [accessToken, location]);

  
  
  useEffect(() => {

    const fetchVehicleBrand = async () => {
      try {
        const response = await fetchBrandService();
    
        
        if (response.success && response.brandData) {
          setInitialBrand(response.brandData)
          setFilteredBrands(response.brandData);
          
        } else {
          console.log("Brand data is missing from the response:", response);
        }
        
      } catch (error) {
        console.log("Error in fetchingVehicleBrand: ", error);
        throw error;
      }
    };
    
    fetchVehicleBrand();
  }, []);
  

  const handleVehicleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => setVehicleType(event.target.value);
  const handleFuelTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => setFuelType(event.target.value);
  const handleKilometersChange = (event: React.ChangeEvent<HTMLInputElement>) => setKilometers(Number(event.target.value));



  const perfomGeocoding = async () => {
    const apiUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchInput)}.json?access_token=${accessToken}&limit=5`;

    try {

      const response = await axios.get(apiUrl);
      const data = response.data
      console.log("This is the response: ", data)


      const filteredPlace = data.features.map((feature: any) => ({
        place_name: feature.place_name,
        coordinates: feature.center
      }));
      setPlaces(filteredPlace);
      console.log("This is the place: ", places)

    } catch (error) {
      console.log("Error in perfomingGeocoding : ", error)
      throw error
    }
  }

  const fetchCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { longitude, latitude } = position.coords;
          console.log("This is the latitude and longitude: ", latitude, longitude);


          const fetchedAddress = await fetchAddress(longitude, latitude);
          console.log("This is the current address:", fetchedAddress);


          const data: { place_name: string; coordinates: [number, number] } = {
            place_name: fetchedAddress,
            coordinates: [longitude, latitude]
          };

          console.log("This is the current location:", data);
          setLocation(data);
        },
        (error) => {
          console.error("Error getting current location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };


  const resetLocation = () => {
    setLocation(undefined); 
    setSearchInput('')
  }

 

 


  const fetchAddress = async (longitude: number, latitude: number): Promise<string> => {

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
  }



  const handleBrandInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setBrandInput(input);
    setVehicleBrand(null);

    if (input) {
      const matches = intialBrand.filter((brand) =>
        brand.brandName.toLowerCase().startsWith(input.toLowerCase())
      );
      setFilteredBrands(matches);
      setShowDropdown(true);
    } else {
      setFilteredBrands([]);
      setShowDropdown(false);
    }
  }

  const handleBrandSelect = (brandName: string, id: string) => {
    
    setVehicleBrand({ brandName, id });
    setBrandInput(brandName);
    setTimeout(() => {
      setShowDropdown(false);
    }, 100);
  };

  const handleProceed = async () => {

    try {
      if (!vehicleNumber) {
        toast.error("Please add vehicle number")
        return
      }
      if(!vehicleBrand){
        toast.error("Please add vehicle Brand")
        return
        }
        if (!vehicleModel) {
          toast.error("Please Vehicle Model")
          return
        }
       if(!location){
        toast.error("Please add you location")
        return
       }
       if(!kilometers){
        toast.error("Please add Kilometers")
        return
       }
       if (!vehicleType) {
        toast.error('Please add vehicle type');
        return
      }
      if(!fuelType){
        toast.error("Please add Fuel Type!!")
        return
      }



    //  validationInputData(vehicleNumber, vehicleModel, kilometers, vehicleType, fuelType, vehicleBrand,location)
      const data = {serviceId,serviceName, vehicleNumber, vehicleBrand, vehicleModel, kilometers, vehicleType,fuelType,location,  };
      navigate('/providers-shops', { state:{data}})
      
      

    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  // const validationInputData = (vehicleNumber: string, vehicleModel: string, kilometers: number, vehicleType: string,
  //   fuelType: string, vehicleBrand: { id: string, brandName: string } , location:{place_name:string,coordinates:[number, number]} ) => {
  //   if (!vehicleNumber) {
  //     toast.error("Please add vehicle number")
  //     return
  //   }
  //   if (!vehicleModel) {
  //     toast.error("Please Vehicle Model")
  //     return
  //   }
  //   if (!vehicleType) {
  //     toast.error('Please add vehicle type');
  //     return
  //   }
  //   if (!kilometers) {
  //     toast.error("Please add Kilometers travelled")
  //     return
  //   }
  //   if (!vehicleBrand) {
  //     toast.error("Please Select Vehicle Brand!!")
  //     return
  //   }
  //   if(!fuelType){
  //     toast.error("Please add Fuel Type!!")
  //     return
  //   }
    
  //   if(!location){
  //     toast.error("Please add Location!!")
  //     return
  //   }

  // }


  const handlePlaceClick = (place: { place_name: string, coordinates: [number, number] }) => {
    setLocation(place);
  }

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setPlaces([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  return (
    <>
      <h1 className="text-xl font-semibold my-4  text-center">Vehicle Details</h1>
      <div className="p-5 space-y-4">
        <div className="flex flex-col md:flex-row mx-5 gap-4">
          {/* Left Section - Location Details */}
          <div className="h-[30rem] w-auto bg-madBlack rounded-xl  md:w-[50%]    p-4">
            <h1 className="text-xl font-semibold text-white my-2 text-center">Location Details</h1>
            <div className="p-5 bg-slate-300 h-96 rounded-lg relative">
              {/* Map Search Input */}

              <div className="relative w-96" ref={dropdownRef}>
                {/* Input and button container */}
                <div className="relative z-20 w-full">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={location?.place_name  ?? searchInput ?? ""}
                    className="p-2 pl-4 w-full rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                  <FaSearch
                    className="hover:cursor-pointer   absolute top-1/2 transform -translate-y-1/2 right-3 text-gray-500 hover:text-blue-500 transition duration-200"
                    onClick={perfomGeocoding}
                  />

                </div>


                {/* Dropdown for search results */}
                {places.length > 0 && (
                  <ul className="absolute top-12  left-0 right-0 mt-2 z-50 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {places.map((place, index) => (
                      <li
                        key={index}
                        onClick={() => handlePlaceClick(place)}
                        className="px-4 py-2 cursor-pointer hover:bg-blue-50 hover:text-blue-600 transition duration-200"
                      >
                        <strong>{place.place_name}</strong>
                      </li>
                    ))}
                  </ul>
                )}
              </div>


              {location ? (
                <button
                  className="z-20 absolute top-5 right-3 p-2 mt-1 mr-2 bg-gray-400 rounded-lg text-white text-sm shadow-md"
                  onClick={resetLocation}
                >
                  Reset
                </button>
              ) : (
                <button
                  className="z-20 absolute top-5 right-3 p-2 mt-1 mr-2 bg-gray-400 rounded-lg text-white text-sm shadow-md"
                  onClick={fetchCurrentLocation}
                >
                  Add current location
                </button>
              )}


              {/* Mapbox Map Container */}
              <div ref={mapContainerRef} className="absolute top-0 left-0 right-0 bottom-0 rounded-lg z-10" />
            </div>
          </div>

          {/* Right Section - Vehicle Details */}
          <div className="h-[30rem] rounded-xl w-auto bg-madBlack border-2 flex flex-col p-4 gap-4 space-y-4">


            <h1 className="text-xl font-semibold text-white text-center mx-2">Vehicle Details</h1>

            <div className="flex flex-col md:flex-row gap-x-4 gap-y-4">
              <label className="text-center text-white font-semibold">
                Vehicle Number
                <input
                  type="text"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                  className="border rounded p-2 w-full text-black  bg-gray-200 font-normal mt-1 text-center"
                  placeholder="Enter vehicle number"
                />
              </label>

              {/* Vehicle Brand with dropdown */}
              <label className="font-semibold text-white text-center relative">
                Vehicle Brand
                <input
                  type="text"
                  value={brandInput}
                  onChange={handleBrandInputChange}
                  className="border rounded p-2 w-full text-black bg-gray-200 font-normal text-sm mt-1 text-center"
                  placeholder="Enter vehicle brand"
                  onFocus={() => setShowDropdown(true)}
                
                />
                {showDropdown && (

                  <ul className="z-50 border rounded shadow-lg absolute w-full text-black bg-white mt-1 max-h-40 overflow-y-auto ">
                    {filteredBrands.length > 0 ? (
                      filteredBrands.map((brand) => (
                        <li
                          key={brand.id}
                          onClick={() => {
                            handleBrandSelect(brand.brandName, brand.id);
                          }

                          }
                          className="p-2 hover:bg-gray-200 cursor-pointer"
                        >
                          {brand.brandName}
                        </li>
                      ))
                    ) : (
                      <li className="p-2 text-gray-500">No matching brands</li>
                    )}
                  </ul>
                )}
              </label>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <label className="font-semibold text-white text-center">
                Vehicle Model
                <input
                  type="text"
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                  className="border rounded p-2 text-black  bg-gray-200 font-normal w-full mt-1 text-center"
                  placeholder="Enter vehicle model"
                />
              </label>

              <label className="font-semibold text-white text-center">
                Kilometers Run
                <input
                  type="number"
                  value={kilometers ?? ''}
                  onChange={handleKilometersChange}
                  className="border rounded font-normal text-black  bg-gray-200 p-2 w-full mt-1 text-center"
                  placeholder="Enter kilometers run"
                />
              </label>
            </div>

            <div className="flex flex-col md:flex-row justify-around mt-3">
              <div className="">
                <p className="font-semibold text-center text-white my-2">Vehicle Type</p>
                <label className="mr-4 text-white">
                  <input
                    type="radio"
                    name="vehicleType"
                    value="twoWheeler"
                    checked={vehicleType === 'twoWheeler'}
                    onChange={handleVehicleTypeChange}
                    className="mr-1 text-center text-black  bg-gray-200"
                  />
                  Two Wheeler
                </label>
                <label className='text-white'>
                  <input
                    type="radio"
                    name="vehicleType"
                    value="fourWheeler"
                    checked={vehicleType === 'fourWheeler'}
                    onChange={handleVehicleTypeChange}
                    className="mr-1 text-center  bg-gray-200"
                  />
                  Four Wheeler
                </label>
              </div>

              <div>
                <p className="text-center text-white font-semibold my-2">Fuel Type</p>
                <label className="mr-4 text-white">
                  <input
                    type="radio"
                    name="fuelType"
                    value="Petrol"
                    checked={fuelType === 'Petrol'}
                    onChange={handleFuelTypeChange}
                    className="mr-1 text-center  bg-gray-200"
                  />
                  Petrol
                </label>
                <label className='text-white'>
                  <input
                    type="radio"
                    name="fuelType"
                    value="Diesel"
                    checked={fuelType === 'Diesel'}
                    onChange={handleFuelTypeChange}
                    className="mr-1 text-center   bg-gray-200"
                  />
                  Diesel
                </label>
              </div>
            </div>
            <div className="flex flex-row justify-center">
              <button className="bg-customBlue rounded-3xl text-center text-xl px-3 py-2 hover:bg-blue-400"
                onClick={handleProceed}>
                Proceed
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddVehicleDetailsComp;
