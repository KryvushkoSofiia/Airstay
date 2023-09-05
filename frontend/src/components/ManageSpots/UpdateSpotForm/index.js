import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { updateSpot, getSpot } from "../../../store/spot";
import "./UpdateSpotForm.css";

function UpdateSpotForm() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { id } = useParams();
  const singleSpot = useSelector((state) => state.spot.singleSpot);

  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [update, setUpdate] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    dispatch(getSpot());
  }, [dispatch]);

  useEffect(() => {
    if (!singleSpot) {
      console.log("no spot found");
    } else {
      setUpdate(true);
      setCountry(singleSpot.country);
      setAddress(singleSpot.address);
      setCity(singleSpot.city);
      setState(singleSpot.state);
      setDescription(singleSpot.description);
      setTitle(singleSpot.name);
      setPrice(singleSpot.price);
    }
  }, [singleSpot]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !country ||
      !address ||
      !city ||
      !state ||
      !description ||
      !title ||
      !price
    ) {
      setError("All fields are required.");
      return;
    }

    if (update) {
      const editedSpot = {
        id,
        address,
        city,
        state,
        country,
        name: title,
        description,
        price,
      };
      const res = await dispatch(updateSpot(editedSpot));

      history.push(`/spots/${id}`);
    }
  };

  return (
    <div className="update-spot-container">
      <div>
        <h1 className="update-spot-title">Update your Spot</h1>
        <h2 className="spot-location-title">
          Where's your place located?
        </h2>
        <h4 className="address-note">
          Guests will only get your exact address once they've booked a
          reservation.
        </h4>
      </div>
      <form onSubmit={handleSubmit} className="spot-form">
        <div className="location-inputs">
          <label className="location-label">
            Country
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Country"
              className="location-input"
            />
            {(!country && error) && <p className="error">Country is required.</p>}
          </label>
          <label className="location-label">
            Street Address
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Address"
              className="location-input"
            />
            {(!address && error) && <p className="error">Address is required.</p>}
          </label>
        </div>
        <div className="location-inputs">
          <label className="location-label">
            City
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
              className="location-input"
            />
            {(!city && error) && <p className="error">City is required.</p>}
          </label>
          <label className="location-label">
            State
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="STATE"
              className="location-input"
            />
            {(!state && error) && <p className="error">State is required.</p>}
          </label>
        </div>
        <div>
          <h2>Describe your place to guests</h2>
          <h4>
            Mention the best features of your space, any special amenities
            like fast wifi or parking, and what you love about the
            neighborhood
          </h4>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please write at least 30 characters"
            rows="5"
            className="description-input"
          ></textarea>
          {(!description && error) && <p className="error">Description is required.</p>}
        </div>
        <div>
          <h2>Create a title for your spot</h2>
          <label className="location-label">
            Catch guests attention with a spot title that highlights what
            makes your place special.
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Name of your spot"
              className="location-input"
            />
            {(!title && error) && <p className="error">Title is required.</p>}
          </label>
        </div>
        <div>
          <h2>Set a base price for your spot</h2>
          <h4>
            Competitive pricing can help your listing stand out and rank
            higher in search results.
          </h4>
          <div>
            <label className="location-label">
              $
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Price per night (USD)"
                className="location-input"
              />
              {(!price && error) && <p className="error">Price is required.</p>}
            </label>
          </div>
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="update-button">Update spot</button>
      </form>
    </div>
  );
}

export default UpdateSpotForm;
