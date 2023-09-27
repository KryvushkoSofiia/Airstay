import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import "./CreateSpotForm.css";
import { createSpot, uploadImage } from "../../store/spot";

function CreateSpotForm() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Clear the error when the field is valid or empty
    if (value.trim() !== "") {
      setErrors({ ...errors, [name]: "" });
    } else {
      setErrors({ ...errors, [name]: `${name.charAt(0).toUpperCase() + name.slice(1)} is required.` });
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  function isImage(url) {
    return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
  }

  const validateForm = () => {
    const {
      country,
      address,
      city,
      state,
      description,
      title,
      price,
      previewImage,
    } = formData;

    const newErrors = {};

    for (const field in newErrors) {
      if (!newErrors[field] && errors[field]) {
        delete errors[field];
      }
    }

    if (!country.trim()) {
      newErrors.country = "Country is required.";
    }

    if (!address.trim()) {
      newErrors.address = "Address is required.";
    }

    if (!city.trim()) {
      newErrors.city = "City is required.";
    }

    if (!state.trim()) {
      newErrors.state = "State is required.";
    }

    if (!description.trim()) {
      newErrors.description = "Description is required.";
    } else if (description.length < 30) {
      newErrors.description = "Description needs 30 or more characters.";
    }

    if (!title.trim()) {
      newErrors.title = "Title is required.";
    }

    if (!price.trim()) {
      newErrors.price = "Price is required.";
    }

    if (!previewImage.trim()) {
      newErrors.previewImage = "Preview Image is required.";
    } else if (!isImage(previewImage)) {
      newErrors.previewImage = "Image URL must end in .png, .jpg, or .jpeg";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      for (let error in newErrors) {
        if (errors.hasOwnProperty(error)) {
          return;
        } else {
          setErrors(newErrors);
        }
      }

      return;
    }

    // Clear the errors when there are no input errors
    setErrors({});

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
      // lat,
      // lng,
    } = formData;

    const images = [previewImage, image2, image3, image4, image5];

    // Filter out empty image URLs and then check if all remaining image URLs are valid
    const nonEmptyImages = images.filter((img) => img.trim() !== '');

    if (nonEmptyImages.length > 0 && !nonEmptyImages.every(isImage)) {
      setErrors({
        ...errors,
        previewImage: "Invalid image format. Please use jpg, jpeg, or png images.",
      });
      return;
    }

    const newSpot = {
      country,
      address,
      city,
      state,
      // lat,
      // lng,
      name: title,
      description,
      price,
    };
    const returnSpot = await dispatch(createSpot(newSpot));

    nonEmptyImages.forEach(async (img, index) => {
      const imgData = {
        url: img,
        preview: index === 0,
      };
      await dispatch(uploadImage(imgData, returnSpot));
    });

    history.push(`/spots/${returnSpot}`);
  };

  return (
    <div className="container">
      <h1 className="main-title">Create a new Spot</h1>
      <h2 className="subtitle">Where's Your Place Located?</h2>
      <h4 className="title-description">
        Guests will only get your exact address once they've booked a reservation.
      </h4>

      <form onSubmit={handleSubmit} className="spot-form">
        <div className="form-group">
          <label className="label">
            Country
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Country"
              className="input-field"
            />
            {errors.country && <p className="error">{errors.country}</p>}
          </label>
          <label className="label">
            Street Address
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              className="input-field"
            />
            {errors.address && <p className="error">{errors.address}</p>}
          </label>
        </div>

        <div className="form-group">
          <div className="city-state-wrapper">
            <label className="label">
              City
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                className="input-field city"
              />
              {errors.city && <p className="error">{errors.city}</p>}
            </label>
            <div className="comma">,</div>
            <label className="label">
              State
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
                className="input-field state"
              />
              {errors.state && <p className="error">{errors.state}</p>}
            </label>
          </div>
          {/* <label className="label">
            Latitude
            <input
              type="number"
              name="lat"
              value={formData.lat}
              onChange={handleChange}
              placeholder="Latitude"
              className="input-field"
            />
          </label>
          <label className="label">
            Longitude
            <input
              type="number"
              name="lng"
              value={formData.lng}
              onChange={handleChange}
              placeholder="Longitude"
              className="input-field"
            />
          </label> */}
        </div>

        <div className="form-group">
          <h2 className="subtitle">Describe Your Place to Guests</h2>
          <h4 className="description">
            Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood
          </h4>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Please write at least 30 characters"
            rows="5"
            className="textarea"
          ></textarea>
          {errors.description && <p className="error">{errors.description}</p>}
          {(formData.description.length < 30 && formData.description.length > 0 && (
            <p className="error">Description needs more than 30 characters</p>
          ))}
        </div>

        <div className="form-group">
          <h2 className="subtitle">Create a Title for Your Spot</h2>
          <label className="label">
            Catch guests' attention with a spot title that highlights what makes your place special.
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Name of your spot"
              className="input-field"
            />
            {errors.title && <p className="error">{errors.title}</p>}
          </label>
        </div>

        <div className="form-group">
          <h2 className="subtitle">Set a Base Price for Your Spot</h2>
          <h4 className="description">
            Competitive pricing can help your listing stand out and rank higher in search results.
          </h4>
          <div className="price-input">
            <label className="label">
              <div className="price-wrapper">
                <div className="dollar">$</div>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Price per night (USD)"
                  className="input-field"
                />
                {errors.price && <p className="error">{errors.price}</p>}
              </div>
            </label>
          </div>
        </div>

        <div className="form-group">
          <h2 className="subtitle">Liven Up Your Spot with Photos</h2>
          <label className="label">
            Submit a link to at least one photo to publish your spot.
            <input
              type="url"
              name="previewImage"
              value={formData.previewImage}
              onChange={handleChange}
              placeholder="Preview Image URL"
              className="input-field"
            />
            {errors.previewImage && <p className="error">{errors.previewImage}</p>}
            {!isImage(formData.previewImage) &&
              formData.previewImage.trim() !== "" && (
                <p className="error">Image URL must end in .png, .jpg, or .jpeg</p>
              )}
          </label>

          <input
            type="url"
            name="image2"
            value={formData.image2}
            onChange={handleChange}
            placeholder="Image URL"
            className="input-field"
          />
          {/* {errors.image2 && <p className="error">{errors.image2}</p>} */}
          {!isImage(formData.image2) &&
            formData.image2.trim() !== "" && (
              <p className="error">Image URL must end in .png, .jpg, or .jpeg</p>
            )}
          <input
            type="url"
            name="image3"
            value={formData.image3}
            onChange={handleChange}
            placeholder="Image URL"
            className="input-field"
          />
          {/* {errors.image3 && <p className="error">{errors.image3}</p>} */}
          {!isImage(formData.image3) &&
            formData.image3.trim() !== "" && (
              <p className="error">Image URL must end in .png, .jpg, or .jpeg</p>
            )}
          <input
            type="url"
            name="image4"
            value={formData.image4}
            onChange={handleChange}
            placeholder="Image URL"
            className="input-field"
          />
          {/* {errors.image4 && <p className="error">{errors.image4}</p>} */}
          {!isImage(formData.image4) &&
            formData.image4.trim() !== "" && (
              <p className="error">Image URL must end in .png, .jpg, or .jpeg</p>
            )}
          <input
            type="url"
            name="image5"
            value={formData.image5}
            onChange={handleChange}
            placeholder="Image URL"
            className="input-field"
          />
          {/* {errors.image5 && <p className="error">{errors.image5}</p>} */}
          {!isImage(formData.image5) &&
            formData.image5.trim() !== "" && (
              <p className="error">Image URL must end in .png, .jpg, or .jpeg</p>
            )}
        </div>

        {errors.serverError && <p className="error">{errors.serverError}</p>}

        <button
          type="submit"
          className="create-spot-submit-btn"
        >
          Create Spot
        </button>
      </form>
    </div>
  );
}

export default CreateSpotForm;
