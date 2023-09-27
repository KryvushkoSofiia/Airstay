import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { updateSpot, getSingleSpot } from "../../../store/spot";
import "./UpdateSpotForm.css";

function UpdateSpotForm() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { id } = useParams();
  const singleSpot = useSelector((state) => state.spot.singleSpot);

  const initialFormData = {
    country: "",
    address: "",
    city: "",
    state: "",
    description: "",
    title: "",
    price: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [update, setUpdate] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    dispatch(getSingleSpot(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (!singleSpot) {
      console.log("no spot found");
    } else {
      setUpdate(true);
      setFormData({
        country: singleSpot.country || "",
        address: singleSpot.address || "",
        city: singleSpot.city || "",
        state: singleSpot.state || "",
        description: singleSpot.description || "", 
        title: singleSpot.name || "",
        price: singleSpot.price || "",
      });
    }
  }, [singleSpot]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      country,
      address,
      city,
      state,
      description,
      title,
      price,
    } = formData;

    if (
      !country ||
      !address ||
      !city ||
      !state ||
      !title ||
      !price ||
      !description ||
      description.length < 30
    ) {
      setError("All fields are required, and description must be at least 30 characters.");
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
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Country"
              className="location-input"
            />
            {(!formData.country && error) && <p className="error">Country is required.</p>}
          </label>
          <label className="location-label">
            Street Address
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              className="location-input"
            />
            {(!formData.address && error) && <p className="error">Address is required.</p>}
          </label>
        </div>
        <div className="location-inputs city-state">
          <label className="location-label">
            City
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
              className="location-input"
            />
            {(!formData.city && error) && <p className="error">City is required.</p>}
          </label>
          <div className="comma">,</div>
          <label className="location-label">
            State
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="State"
              className="location-input"
            />
            {(!formData.state && error) && <p className="error">State is required.</p>}
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
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Please write at least 30 characters"
            rows="5"
            className="description-input"
          ></textarea>
          {(!formData.description && error) && <p className="error">Description is required.</p>}
          {formData.description.length < 30 && (
            <p className="error">Description needs to be at least 30 characters.</p>
          )}
        </div>
        <div>
          <h2>Create a title for your spot</h2>
          <label className="location-label">
            Catch guests' attention with a spot title that highlights what
            makes your place special.
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Name of your spot"
              className="location-input"
            />
            {(!formData.title && error) && <p className="error">Title is required.</p>}
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
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Price per night (USD)"
                className="location-input"
              />
              {(!formData.price && error) && <p className="error">Price is required.</p>}
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
