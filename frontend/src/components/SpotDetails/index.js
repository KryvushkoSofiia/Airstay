import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getSingleSpot } from '../../store/spot';
import ReviewsList from '../ReviewsList';
import './SpotDetails.css';

const SpotDetails = () => {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const singleSpot = useSelector((state) => state.spot.singleSpot);
    console.log("single spot ", singleSpot);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        dispatch(getSingleSpot(spotId))
            .then(() => setIsLoading(false))
            .catch((error) => {
                console.error(error);
                setIsLoading(false);
            });
    }, [dispatch, spotId]);

    const reserveSpot = () => {
        alert("Feature coming soon");
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!singleSpot) {
        return <div>Data not found</div>;
    }

    const numReviews = singleSpot.numReviews >= 0 ? singleSpot.numReviews : "New"; // Check for greater than or equal to 0

    return (
        <div className="spot-details-container">
            <div>
                <h1>{singleSpot.name}</h1>
                <p>Location: {singleSpot.city}, {singleSpot.state}, {singleSpot.country}</p>
            </div>

            <div className="images">
                {singleSpot.SpotImages.length > 0 && (
                    <div className='images-wrapper'>
                        <div>
                            <img src={singleSpot.SpotImages[0].url} alt="Large Image" className="large-image" />
                        </div>
                        <div className='small-img-wrapper'>
                            <div className="small-image-row">
                                {singleSpot.SpotImages.slice(1, 3).map((image, index) => (
                                    <img key={index} src={image.url} alt={`Image ${index + 1}`} className="small-image" />
                                ))}
                            </div>
                            <div className="small-image-row">
                                {singleSpot.SpotImages.slice(3).map((image, index) => (
                                    <img key={index} src={image.url} alt={`Image ${index + 1}`} className="small-image" />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div>
                <p>Hosted by {singleSpot.Owner.firstName} {singleSpot.Owner.lastName}</p>
                <p>{singleSpot.description}</p>
            </div>

            <div className="callout-box">
                <div className='callout-box__info'>
                    <p>{singleSpot.price}$ night</p>
                    <div className="star-rating">★ {singleSpot.avgRating > 0 ? singleSpot.avgRating.toFixed(1) : 'New'}</div>
                    <div>
                        {numReviews !== 0 && <p>Reviews: {numReviews}</p>}</div>
                </div>
                <button className="reserve-btn" onClick={reserveSpot}>Reserve</button>
            </div>


        </div>
    );
};

export default SpotDetails;
