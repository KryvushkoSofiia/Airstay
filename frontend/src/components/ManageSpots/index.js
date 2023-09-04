import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams, NavLink } from "react-router-dom";
import { getSpot } from "../../store/spot";
import OpenModalButton from "../OpenModalButton";
import DeleteModal from "./DeleteSpotModal";

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
        if (Object.keys(spots).length > 0) {
            const spotsArr = Object.values(spots);
            const usersSpotsArr = spotsArr.filter((spot) => spot.ownerId == userId);
            setUserSpots(usersSpotsArr);
        }
    }, [spots, userId]);

    const navToNewSpot = () => {
        history.push("/create-spot");
    };

    const handleDeleteSpot = (deletedSpotId) => {
        // Update the state by removing the deleted spot
        setUserSpots((prevSpots) =>
            prevSpots.filter((spot) => spot.id !== deletedSpotId)
        );
    };

    return (
        <>
            <h2>Manage Your Spots</h2>
            {userSpots.length === 0 ? (
                <button onClick={navToNewSpot}>Create a New Spot</button>
            ) : null}
            {userSpots.length > 0 &&
                userSpots.map((spot) => (
                    <div key={spot.id}>
                        <NavLink to={`/spots/${spot.id}`}>
                            <img src={spot.previewImage} alt={`Spot ${spot.id}`} />
                        </NavLink>
                        <div>
                            <p>{`${spot.city}, ${spot.state}`}</p>
                            <p>{spot.avgRating || "New"}</p>
                        </div>
                        <div>
                            <p>{`$${spot.price} night`}</p>
                        </div>
                        <div>
                            <NavLink to={`/spots/${spot.id}/update`}>
                                <button>Update</button>
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
        </>
    );
}

export default ManageSpots;
