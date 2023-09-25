import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import "./CreateSpotForm.css";
import { createSpot, uploadImage } from "../../store/spot";

function CreateSpotForm() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    country: "",
    address: "",
    city: "",
    state: "",
    description: "",
    title: "",
    price: "",
    previewImage: "",
    image2: "",
    image3: "",
    image4: "",
    image5: "",
    lat: "",
    lng: "",
  });
  const [error, setError] = useState("");

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
      previewImage,
      image2,
      image3,
      image4,
      image5,
      lat,
      lng,
    } = formData;

    if (
      !country ||
      !address ||
      !city ||
      !state ||
      !description ||
      !title ||
      !price ||
      !previewImage
    ) {
      setError("All fields are required.");
      return;
    }

    const newSpot = {
      country,
      address,
      city,
      state,
      lat,
      lng,
      name: title,
      description,
      price,
    };
    const returnSpot = await dispatch(createSpot(newSpot));

    const images = [previewImage, image2, image3, image4, image5];

    images.forEach(async (img, index) => {
      if (img.length > 0) {
        const imgData = {
          url: img,
          preview: index === 0,
        };
        await dispatch(uploadImage(imgData, returnSpot));
      }
    });

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
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Country"
              className="input-field"
            />
            {(!formData.country && error) && <p className="error">Country is required.</p>}
          </label>
          <label>
            Street Address
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              className="input-field"
            />
            {(!formData.address && error) && <p className="error">Address is required.</p>}
          </label>
        </div>

        <div className="form-group">
          <label>
            City
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
              className="input-field"
            />
            {(!formData.city && error) && <p className="error">City is required.</p>}
          </label>
          <label>
            State
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="STATE"
              className="input-field"
            />
            {(!formData.state && error) && <p className="error">State is required.</p>}
          </label>
          <label>
            Latitude
            <input
              type="text"
              name="lat"
              value={formData.lat}
              onChange={handleChange}
              placeholder="Latitude"
              className="input-field"
            />
          </label>
          <label>
            Longitude
            <input
              type="text"
              name="lng"
              value={formData.lng}
              onChange={handleChange}
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
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Please write at least 30 characters"
            rows="5"
            className="textarea"
          ></textarea>
          {(!formData.description && error) && <p className="error">Description is required.</p>}
        </div>

        <div className="form-group">
          <h2 className="subtitle">Create a Title for Your Spot</h2>
          <label>
            Catch guests attention with a spot title that highlights what
            makes your place special.
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Name of your spot"
              className="input-field"
            />
            {(!formData.title && error) && <p className="error">Title is required.</p>}
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
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Price per night (USD)"
                className="input-field"
              />
              {(!formData.price && error) && <p className="error">Price is required.</p>}
            </label>
          </div>
        </div>

        <div className="form-group">
          <h2 className="subtitle">Liven Up Your Spot with Photos</h2>
          <label>
            Submit a link to at least one photo to publish your spot.
            <input
              type="url"
              name="previewImage"
              value={formData.previewImage}
              onChange={handleChange}
              placeholder="Preview Image URL"
              className="input-field"
            />
            {(!formData.previewImage && error) && <p className="error">Preview Image is required.</p>}
          </label>
          <input
            type="url"
            name="image2"
            value={formData.image2}
            onChange={handleChange}
            placeholder="Image URL"
            className="input-field"
          />
          <input
            type="url"
            name="image3"
            value={formData.image3}
            onChange={handleChange}
            placeholder="Image URL"
            className="input-field"
          />
          <input
            type="url"
            name="image4"
            value={formData.image4}
            onChange={handleChange}
            placeholder="Image URL"
            className="input-field"
          />
          <input
            type="url"
            name="image5"
            value={formData.image5}
            onChange={handleChange}
            placeholder="Image URL"
            className="input-field"
          />
        </div>

        {error && <p className="error">{error}</p>}
        
        <button type="submit" className="submit-button">
          Create Spot
        </button>
      </form>
    </div>
  );
}

export default CreateSpotForm;
