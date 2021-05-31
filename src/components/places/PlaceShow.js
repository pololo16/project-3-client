import React from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  getSinglePlace,
  deletePlace,
  checkFav,
  addFav,
  removeFav
} from '../../lib/api'
import { isAuthorized, isOwner } from '../../lib/auth'
import Error from '../common/Error'
import { useHistory } from 'react-router'
import ReviewsList from '../reviews/ReviewsList'


function PlaceShow() {
  const history = useHistory()
  const { placeId } = useParams()
  const [place, setPlace] = React.useState(null)
  const [isFav, setIsFav] = React.useState(null)
  const [reviews, setReviews] = React.useState([])
  const [isError, setIsError] = React.useState(false)
  const isLoading = !place && !isError
  const isLoggedIn = isAuthorized

  React.useEffect(() => {
    const getData = async () => {
      try {
        const res = await getSinglePlace(placeId)
        setPlace(res.data)
        setReviews(res.data.reviews)
      } catch (err) {
        setIsError(true)
      }
    }
    getData()
  }, [placeId])

  React.useEffect(() => {
    const getData = async () => {
      try {
        const res = await checkFav(placeId)
        console.log(res.data.isFav)
        setIsFav(res.data.isFav)
      } catch (err) {
        // setIsError(true)
        return <p>error</p>
      }
    }
    getData()
  }, [placeId])

  const handleDelete = async () => {
    await deletePlace(place._id)
    history.push('/map')
  }

  const handleAddFav = async () => {
    await addFav(place._id)
    setIsFav(true)
  }

  const handleRemFav = async () => {
    await removeFav(place._id)
    setIsFav(false)
  }

  return (
    <>
      <section className="section">
        <div className="container">
          {isError && <Error />}
          {isLoading && <p>...loading</p>}
          {place && (
            <div className='show-page'>
              <h2 className="title titles has-text-centered">{place.name}</h2>
              <hr />
              <div className="columns">
                <div className="column is-half">
                  <figure className="image">
                    <img src={place.image} alt={place.name} />
                  </figure>
                </div>
                <div className="column is-half">
                  <h4 className="title titles is-4">
                    
                    Description
                  </h4>
                  <p className='texts'>{place.description}</p>
                  <hr />
                  <h4 className="title titles is-4">
                    
                    Address
                  </h4>
                  
                  <p className='texts'>
                    {place.address}, {place.postcode}, {place.district},{' '}
                    {place.region}
                  </p>
                  <hr />
                  <h6 className="title titles is-4">
                    Rating
                  </h6>
                  
                  <p>{' ★ '.repeat(place.rating)}</p>
                  <hr />
                  <h6 className="title titles is-5">
                    
                    Added by {place.user.username}
                  </h6>

                  <hr />


                  <section>

                    {isOwner(place.user._id) && (
                      <div>
                        <div className="buttons">
                          <Link
                            to={`/places/${place._id}/edit`}
                            className="button button-edit"
                          >
                          Edit this place
                          </Link>
                          <button
                            onClick={handleDelete}
                            className="button button-delete"
                          >
                          Delete this place
                          </button>
                        </div>
                      </div>
                    )}


                  </section>

                  {isLoggedIn && isFav ? (
                    <button onClick={handleRemFav} className="button button-delete-fav">
                      ✖ Delete from My Fav
                    </button>
                    
                  ) : (
                    <button onClick={handleAddFav} className="button button-add-fav">
                      ♥ Add to My Fav
                    </button>
                  )}

                  {isAuthorized && (
                    <div>
                      <Link to={`/places/${place._id}/review`}>
                        <button className="button button-review"> ✒️ Review this place </button>
                      </Link>
                    </div>
                  )}
                  
                </div>
                
              </div>
              
              <section className="section">
                {/* {(reviews !== []) ? ( */}
                <div className="container">
                  <div className="title has-text-centered titles">Reviews:</div>
                </div>
                {/* ) : (
                  ''
                )} */}

                <div className="columns is-multiline">
                  <div className="column is-one-quarter-desktop is-one-third-tablet">
                    {reviews.map(review => <ReviewsList key={review._id} {...review} />)}
                  </div>
                </div>

              </section>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
export default PlaceShow