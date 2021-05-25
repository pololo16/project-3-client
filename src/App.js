import axios from 'axios'
import React from 'react'


function App() {

  const [places, setPlaces] = React.useState([])

  React.useEffect(() => {
    const getData = async () => {
      const res = await axios.get('/api/places')
      setPlaces(res.data)
      console.log(places)
    }
    getData()
  }, [])

  return (
    <>
      <h1>Places</h1>
      {places.map(place => (
        <div key={place._id}>
          <h1>{place.name}</h1>
        </div>
      ))}
    </>
  )
}

export default App