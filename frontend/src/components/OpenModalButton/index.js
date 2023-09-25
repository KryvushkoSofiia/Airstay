import React from "react";
import { useModal } from "../../context/Modal";
import "./OpenModalButton.css";

function OpenModalButton({
  modalComponent,
  buttonText,
  onButtonClick,
  onModalClose,
}) {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = () => {
    if (typeof onButtonClick === "function") onButtonClick();
    if (typeof onModalClose === "function") setOnModalClose(onModalClose);
    setModalContent(modalComponent);
  };

  return <button onClick={onClick} className="manage-delete-btn">{buttonText}</button>;
}

export default OpenModalButton;
