import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { updateSpot, getSpot } from "../../../store/spot";
import { getSingleSpot } from '../../../store/spot';


function UpdateSpotForm() {
    const history = useHistory();
    const dispatch = useDispatch();

    const { id } = useParams();

    // useEffect(() => {
    //     dispatch(getSingleSpot(id));
    // }, [dispatch, id]);

    const singleSpot = useSelector((state) => state.spot.singleSpot);

    console.log("Single spot", singleSpot);


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
    //const [lat, setLat] = useState("");
    //const [lng, setLng] = useState("");
    // const [errors, setErrors] = useState({});
    const [update, setUpdate] = useState(false);

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
          //setLat(singleSpot.lat);
          //setLng(singleSpot.lng);
          setDescription(singleSpot.description);
          setTitle(singleSpot.name);
          setPrice(singleSpot.price);
      
          // Check if SpotImages is defined and not empty
          if (singleSpot.SpotImages && singleSpot.SpotImages.length > 0) {
            // Find the image with preview: true in SpotImages array
            const previewImageObj = singleSpot.SpotImages.find(image => image.preview);
            console.log("Previer img obj", previewImageObj);
            if (previewImageObj) {
              setPreviewImage(previewImageObj.url);
            }
          }
        }
      }, [singleSpot]);
      


    const handleSubmit = async (e) => {

        e.preventDefault();


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
        <>
            <div>
                <h1>Update your Spot</h1>
                <h2>Where's your place located?</h2>
                <h4>
                    Guests will only get your exact address once they booked a
                    reservation.
                </h4>
            </div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Country
                        <input
                            type="text"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            placeholder="Country"
                        />
                    </label>
                    <label>
                        Street Address
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Address"
                        />
                    </label>
                </div>
                <div>
                    <label>
                        City
                        <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="City"
                        />
                    </label>
                    <label>
                        State
                        <input
                            type="text"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            placeholder="STATE"
                        />
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
                    ></textarea>
                </div>
                <div>
                    <h2>Create a title for your spot</h2>
                    <label>
                        Catch guests' attention with a spot title that highlights what
                        makes your place special.
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Name of your spot"
                        />
                    </label>

                </div>
                <div>
                    <h2>Set a base price for your spot</h2>
                    <h4>
                        Competitive pricing can help your listing stand out and rank
                        higher in search results.
                    </h4>
                    <div>
                        <label>
                            $
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="Price per night (USD)"
                            />
                        </label>

                    </div>
                </div>
                <div>
                    <h2>Liven up your spot with photos</h2>
                    <label>
                        Submit a link to at least one photo to publish your spot.
                        <input
                            type="url"
                            value={previewImage}
                            onChange={(e) => setPreviewImage(e.target.value)}
                            placeholder="Preview Image URL"
                        />
                    </label>

                    <input
                        type="url"
                        value={image2}
                        onChange={(e) => setImage2(e.target.value)}
                        placeholder="Image URL"
                    />

                    <input
                        type="url"
                        value={image3}
                        onChange={(e) => setImage3(e.target.value)}
                        placeholder="Image URL"
                    />

                    <input
                        type="url"
                        value={image4}
                        onChange={(e) => setImage4(e.target.value)}
                        placeholder="Image URL"
                    />

                    <input
                        type="url"
                        value={image5}
                        onChange={(e) => setImage5(e.target.value)}
                        placeholder="Image URL"
                    />
                </div>
                <button type="submit">Update spot</button>
            </form>
        </>
    );
}

export default UpdateSpotForm;
