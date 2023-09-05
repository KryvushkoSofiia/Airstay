import React from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import { deleteSpot } from "../../../store/spot";
import { useHistory } from "react-router-dom";
import "./DeleteModal.css";

function DeleteModal({ spotId, ownerId, onDeleteSpot }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const history = useHistory();

  const clickedYes = async () => {
    await dispatch(deleteSpot(spotId));
    closeModal();
    onDeleteSpot(spotId);
    history.push(`/user-spots/${ownerId}`);
  };

  const clickedNo = () => {
    closeModal();
  };

  return (
    <div className="delete-modal-container">
      <h2 className="delete-modal-title">Confirm Delete</h2>
      <h5 className="delete-modal-message">
        Are you sure you want to remove this spot from the listings?
      </h5>
      <div className="button-container">
        <button className="delete-button" onClick={clickedYes}>
          Yes (Delete Spot)
        </button>
        <button className="cancel-button" onClick={clickedNo}>
          No (Keep Spot)
        </button>
      </div>
    </div>
  );
}

export default DeleteModal;
