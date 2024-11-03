import axios from 'axios'
import React, { useEffect } from 'react'

function profile() {

       const accessToken = 'pk.eyJ1IjoiYmluaXNoMTkwNSIsImEiOiJjbTFpdzE1OHcwcGdqMnJxbDUxdDN5cnExIn0.TYM92lLjTLoETRIJEiJWPw'; // Use your Mapbox access token here


        const fetchDetails = async() => {
            try {
                const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/kochi.json?access_token=${accessToken}`)
                console.log("This is the reposne: ",response.data)
            } catch (error) {
                console.log("Error in fetch details")
              
            }
        }

        useEffect(() => {
           fetchDetails()
        },[])
  return (
    <div>
      <h1>This is the Profile</h1>
    </div>
  )
}

export default profile
