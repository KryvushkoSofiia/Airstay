import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams, NavLink } from "react-router-dom";
import { getSpot } from "../../store/spot";
import OpenModalButton from "../OpenModalButton";
import DeleteModal from "./DeleteSpotModal";
import "./ManageSpots.css";

function ManageSpots() {
    const dispatch = useDispatch();
    const history = useHistory();
    const { userId } = useParams();

    const spots = useSelector((state) => state.spot.spot.Spots);

    useEffect(() => {
        dispatch(getSpot());
    }, [dispatch]);

    const [userSpots, setUserSpots] = useState([]);

    useEffect(() => {
        if (spots && Object.keys(spots).length > 0) {
            const spotsArr = Object.values(spots);
            const usersSpotsArr = spotsArr.filter((spot) => spot.ownerId == userId);
            setUserSpots(usersSpotsArr);
        }
    }, [spots, userId]);

    const navToNewSpot = () => {
        history.push("/create-spot");
    };

    const handleDeleteSpot = (deletedSpotId) => {
        setUserSpots((prevSpots) =>
            prevSpots.filter((spot) => spot.id !== deletedSpotId)
        );
    };

    return (
        <div className="all-manage-spots">
            <h2 className="manage-spots-title">Manage Your Spots</h2>
            {/* {userSpots.length === 0 ? ( */}
            <button className="manage-create-spot-button" onClick={navToNewSpot}>Create a New Spot</button>
            {/* ) : null} */}
            <div className="manage-spots-container">
                <div className="manage-spot-wrapper">
                    {userSpots.length > 0 &&
                        userSpots.map((spot) => (
                            <div key={spot.id} className="manage-spot-card">
                                <NavLink to={`/spots/${spot.id}`} className="manage-spot-link">
                                    <img src={spot.previewImage} alt={`Spot ${spot.id}`} className="manage-spot-image" />
                                </NavLink>
                                <div className="manage-spot-details">
                                    <p className="manage-spot-location">{`${spot.city}, ${spot.state}`}</p>
                                    <p className="manage-spot-rating">{spot.avgRating || "New"}</p>
                                </div>
                                <div className="manage-spot-price">
                                    <p>{`$${spot.price} night`}</p>
                                </div>
                                <div className="manage-spot-actions">
                                    <NavLink to={`/spots/${spot.id}/update`} className="manage-update-link">
                                        <button className="manage-update-button">Update</button>
                                    </NavLink>
                                    <div>
                                        <OpenModalButton
                                            buttonText="Delete"
                                            onButtonClick={() => { }}
                                            modalComponent={
                                                <DeleteModal
                                                    spotId={spot.id}
                                                    ownerId={spot.ownerId}
                                                    onDeleteSpot={handleDeleteSpot}
                                                />
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>

    );
}

export default ManageSpots;
