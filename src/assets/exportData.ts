interface IworkshopDetails{
  id:string,
  workshopName:string,
  ownerName:string,
  email:string,
  mobile:string,
  address:string,
  coordinates:[number, number];
  distance:number
}


export const workshopDetails:IworkshopDetails[] =  [
  {
    id: '6725aea9e67663f8ed939f3c',
    workshopName: 'Ajr Workshop',
    ownerName: 'Arjun R',
    email: 'arjunreji1234@gmail.com',
    mobile: '9544774001',
    address: 'Abl Road, Shastri Nagar, Maradu',
    coordinates: [ 76.3289828, 9.9425176 ],
    distance: 0
  },
  {
    id: '6725aef0e67663f8ed939f42',
    workshopName: 'Arabian Workshop',
    ownerName: 'Hafis',
    email: 'hafis@gmail.com',
    mobile: '8759349233',
    address: '"Vytila Traffic Junction, Vyttila, Ernakulam"',
    coordinates: [ 76.318116, 9.968597 ],
    distance: 3.13
  },
  {
    id: '6725c38fa0c8c2c55afcea2e',
    workshopName: 'Shamil workshop',
    ownerName: 'Shamil',
    email: 'shamil@gmail.com',
    mobile: '8684382910',
    address: 'Vaikom, near Mahadeva Temple',
    coordinates: [ 76.395998, 9.750132 ],
    distance: 22.62
  }
]