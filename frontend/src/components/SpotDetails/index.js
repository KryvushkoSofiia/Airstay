import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { getSingleSpot } from '../../store/spot';

import './SpotDetails.css';

const SpotDetails = () => {
    const { spotId } = useParams();
    const dispatch = useDispatch();

    const singleSpot = useSelector((state) => state.spot.singleSpot);
    const reviews = useSelector((state) => state.review.spot);

    const reviewsArray = Object.values(reviews);

    console.log("single spot ", singleSpot);
    console.log("typeof single spot:", typeof singleSpot);
    console.log("reviews ", reviews);
    console.log("typeof reviews:", typeof reviews);
    console.log('single spot reviews array: ', reviewsArray)

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        dispatch(getSingleSpot(spotId))
            .then(() => setIsLoading(false))
            .catch((error) => {
                console.error(error);
                setIsLoading(false);
            });
    }, [dispatch, spotId, reviewsArray.length]);


    const reserveSpot = () => {
        alert("Feature coming soon");
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!singleSpot) {
        return <div>Data not found</div>;
    }

    const numReviews = singleSpot.numReviews >= 0 ? singleSpot.numReviews : "New";

    return (

        <div className='spot-details_wrapper'>
            <div className="spot-details-container">
                <div>
                    <h1>{singleSpot.name}</h1>
                    <p>Location: {singleSpot.city}, {singleSpot.state}, {singleSpot.country}</p>
                </div>
                <div className="images">
                    {singleSpot.SpotImages.length > 0 && (
                        <div className="images-wrapper">
                            {singleSpot.SpotImages.length === 1 ? (
                                <div className='large-single-image-wrapper'>
                                    <img
                                        src={singleSpot.SpotImages[0].url}
                                        alt="Large"
                                        className="large-single-image"
                                    />
                                </div>
                            ) : (
                                <>
                                    <div>
                                        <img
                                            src={singleSpot.SpotImages[0].url}
                                            alt="Large"
                                            className="large-image"
                                        />
                                    </div>
                                    <div className="small-img-wrapper">
                                        <div className="small-image-row">
                                            {singleSpot.SpotImages.slice(1, 3).map((image, index) => (
                                                <img
                                                    key={index}
                                                    src={image.url}
                                                    alt={`${index + 1}`}
                                                    className="small-image"
                                                />
                                            ))}
                                        </div>
                                        <div className="small-image-row">
                                            {singleSpot.SpotImages.slice(3).map((image, index) => (
                                                <img
                                                    key={index}
                                                    src={image.url}
                                                    alt={`${index + 1}`}
                                                    className="small-image"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
                <div className='user-info-box-wrapper'>
                    <div className='details-wrapper'>
                        <p className='hosted-by-name'>Hosted by {singleSpot.Owner.firstName} {singleSpot.Owner.lastName}</p>
                        <p className='description'>{singleSpot.description}</p>
                    </div>

                    <div className="callout-box">
                        <div className='callout-box__info'>

                            <p>${singleSpot.price} night</p>
                            <div className='star-rate-review-wrapper'>
                                <div className="star-rating">★ {singleSpot.avgRating > 0 ? singleSpot.avgRating.toFixed(1) : 'New'}</div>
                                {numReviews !== 0 && (
                                    <div className="dot">•</div>
                                )}
                                <div>{numReviews !== 0 && (numReviews > 1 ? <p>{numReviews} Reviews: </p> : <p>{numReviews} review </p>)}</div>
                            </div>
                        </div>
                        <button className="reserve-btn" onClick={reserveSpot}>Reserve</button>
                    </div>
                </div>
                <div className='rating-reviews__block'>
                    <div className="star-rating">★ {singleSpot.avgRating > 0 ? singleSpot.avgRating.toFixed(1) : 'New'}</div>
                    {numReviews !== 0 && (
                        <div className="dot">•</div>
                    )}
                    <div>{numReviews !== 0 && (numReviews > 1 ? <p>{numReviews} reviews </p> : <p>{numReviews} review </p>)}</div>

                </div>
            </div>

        </div>
    );
};

export default SpotDetails;
