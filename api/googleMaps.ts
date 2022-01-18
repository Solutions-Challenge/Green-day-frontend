import getEnvVars from '../environment';
const { GOOGLEMAPSPLACESEARCHAPIKEY } = getEnvVars();

const fetchData = async(latitude:number, longitude:number) => {
  const res = await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=Recycling%2CCenter&location=${latitude}%2C${longitude}&radius=16093&key=${GOOGLEMAPSPLACESEARCHAPIKEY}`,{
    method: 'GET',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
  })

  const data = await res.json()
  return data
}

export default fetchData
