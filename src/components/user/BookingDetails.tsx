import { useEffect, useState } from "react"
import { getBookingsService } from "../../services/provider/providerService"
import { useSelector } from "react-redux"
import { toast } from "sonner"

function BookingDetails() {
   
   const [bookings, setBookings] = useState([])
   const {id} = useSelector((state:any) => state.user?.userInfo)

  useEffect(() => {
     const  fetchBookings = async() => {
         try {
             const response = await getBookingsService(id);
             if(response.success){
              setBookings(response.bookingData);
              toast.success("setted")
             }
          
         } catch (error) {
            console.log("Error in fetchBookings: ", error)
            throw error
         }
      }
      fetchBookings()
  },[])
  return (
    <div>
      <h1>This is Booking</h1>
    </div>
  )
}

export default BookingDetails
