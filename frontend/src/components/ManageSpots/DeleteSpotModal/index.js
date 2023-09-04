import React from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import { deleteSpot } from "../../../store/spot";
import { useHistory } from "react-router-dom";

function DeleteModal({ spotId, ownerId, onDeleteSpot }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const history = useHistory();

  const clickedYes = async () => {
    await dispatch(deleteSpot(spotId));
    closeModal();
    onDeleteSpot(spotId); // Call the onDeleteSpot callback
    history.push(`/user-spots/${ownerId}`); // Replace with the desired URL
  };

  const clickedNo = () => {
    closeModal();
  };

  return (
    <>
      <h2>Confirm Delete</h2>
      <h5>Are you sure you want to remove this spot from the listings?</h5>
      <div>
        <button onClick={clickedYes}>Yes (Delete Spot)</button>
        <button onClick={clickedNo}>No (Keep Spot)</button>
      </div>
    </>
  );
}

export default DeleteModal;
