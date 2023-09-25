import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { getSpot } from '../../store/spot';
import './SpotsList.css';

const SpotsList = () => {
    const dispatch = useDispatch();
    const {Spots} = useSelector((state) => state.spot.spot);

    useEffect(() => {
        dispatch(getSpot());
    }, [dispatch]);

    if (!Spots) {
        return null;
    }

    console.log("Spots", Spots);

    return (
        <main className='spots-main'>
            <div className="spots-list">
                {Spots.map((spot) => (
                    <div key={spot.id} className="spot-container">
                        <NavLink to={`/spots/${spot.id}`} className="spot-tile">
                            <div className="thumbnail" style={{ backgroundImage: `url(${spot.previewImage})` }}>
                                <span className="tooltip">{spot.name}</span>
                            </div>
                            <div className="spot-details">
                            <div>
                                <div className="city-state">{spot.city}, {spot.state}</div>
                                <div className="price">${spot.price} night</div>
                            </div>
                                <div className="star-rating">★ {spot.avgRating > 0 ? spot.avgRating.toFixed(1) : 'New'}</div>
                            </div>
                        </NavLink>
                    </div>
                ))}
            </div>
        </main>
    );
};

export default SpotsList;
