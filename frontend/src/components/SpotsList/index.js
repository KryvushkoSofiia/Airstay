import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { getSpot } from '../../store/spot';
import './SpotsList.css';

const SpotsList = () => {
    const dispatch = useDispatch();
    const spots = useSelector((state) => state.spot.spot.Spots);

    useEffect(() => {
        dispatch(getSpot());
    }, [dispatch]);

    if (!spots) {
        return null;
    }

    return (
        <main className='spots-main'>
            <div className="spots-list">
                {spots.map((spot) => (
                    <div key={spot.id} className="spot-container">
                        <NavLink to={`/spots/${spot.id}`} className="spot-tile">
                            <div className="thumbnail" style={{ backgroundImage: `url(${spot.previewImage})` }}>
                                {/* <span className="tooltip">{spot.name}</span> */}
                            </div>
                            <div className="spot-details">
                            <div>
                                <div className="city-state">{spot.city}, {spot.state}</div>
                                <div className="price">{spot.price}$ night</div>
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
