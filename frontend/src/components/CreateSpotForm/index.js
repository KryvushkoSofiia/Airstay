import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import "./CreateSpotForm.css";
import { createSpot, uploadImage } from "../../store/spot";

function CreateSpotForm() {
  const history = useHistory();
  const dispatch = useDispatch();

  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");
  const [image4, setImage4] = useState("");
  const [image5, setImage5] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newSpot = {
      address,
      city,
      state,
      country,
      lat,
      lng,
      name: title,
      description,
      price,
    };
    const returnSpot = await dispatch(createSpot(newSpot));

    if (previewImage.length > 0) {
      const createPreviewImage = {
        url: previewImage,
        preview: true,
      };
      dispatch(uploadImage(createPreviewImage, returnSpot));
    }

    if (image2.length > 0) {
      const img = {
        url: image2,
        preview: false,
      };
      dispatch(uploadImage(img, returnSpot));
    }
    if (image3.length > 0) {
      const img = {
        url: image3,
        preview: false,
      };
      dispatch(uploadImage(img, returnSpot));
    }
    if (image4.length > 0) {
      const img = {
        url: image4,
        preview: false,
      };
      dispatch(uploadImage(img, returnSpot));
    }
    if (image5.length > 0) {
      const img = {
        url: image5,
        preview: false,
      };
      dispatch(uploadImage(img, returnSpot));
    }
    history.push(`/spots/${returnSpot}`);
  };

  return (
    <div className="container">
      <h1 className="main-title">Create a New Spot</h1>
      <h2 className="subtitle">Where's Your Place Located?</h2>
      <h4 className="description">
        Guests will only get your exact address once they've booked a
        reservation.
      </h4>

      <form onSubmit={handleSubmit} className="spot-form">
        <div className="form-group">
          <label>
            Country
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Country"
              className="input-field"
            />
          </label>
          <label>
            Street Address
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Address"
              className="input-field"
            />
          </label>
        </div>

        <div className="form-group">
          <label>
            City
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
              className="input-field"
            />
          </label>
          <label>
            State
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="STATE"
              className="input-field"
            />
          </label>
          <label>
            Latitude
            <input
              type="text"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              placeholder="Latitude"
              className="input-field"
            />
          </label>
          <label>
            Longitude
            <input
              type="text"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              placeholder="Longitude"
              className="input-field"
            />
          </label>
        </div>

        <div className="form-group">
          <h2 className="subtitle">Describe Your Place to Guests</h2>
          <h4 className="description">
            Mention the best features of your space, any special amenities
            like fast wifi or parking, and what you love about the
            neighborhood
          </h4>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please write at least 30 characters"
            rows="5"
            className="textarea"
          ></textarea>
        </div>

        <div className="form-group">
          <h2 className="subtitle">Create a Title for Your Spot</h2>
          <label>
            Catch guests' attention with a spot title that highlights what
            makes your place special.
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Name of your spot"
              className="input-field"
            />
          </label>
        </div>

        <div className="form-group">
          <h2 className="subtitle">Set a Base Price for Your Spot</h2>
          <h4 className="description">
            Competitive pricing can help your listing stand out and rank
            higher in search results.
          </h4>
          <div className="price-input">
            <label>
              $
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Price per night (USD)"
                className="input-field"
              />
            </label>
          </div>
        </div>

        <div className="form-group">
          <h2 className="subtitle">Liven Up Your Spot with Photos</h2>
          <label>
            Submit a link to at least one photo to publish your spot.
            <input
              type="url"
              value={previewImage}
              onChange={(e) => setPreviewImage(e.target.value)}
              placeholder="Preview Image URL"
              className="input-field"
            />
          </label>
          <input
            type="url"
            value={image2}
            onChange={(e) => setImage2(e.target.value)}
            placeholder="Image URL"
            className="input-field"
          />
          <input
            type="url"
            value={image3}
            onChange={(e) => setImage3(e.target.value)}
            placeholder="Image URL"
            className="input-field"
          />
          <input
            type="url"
            value={image4}
            onChange={(e) => setImage4(e.target.value)}
            placeholder="Image URL"
            className="input-field"
          />
          <input
            type="url"
            value={image5}
            onChange={(e) => setImage5(e.target.value)}
            placeholder="Image URL"
            className="input-field"
          />
        </div>

        <button type="submit" className="submit-button">
          Create Spot
        </button>
      </form>
    </div>
  );
}

export default CreateSpotForm;
