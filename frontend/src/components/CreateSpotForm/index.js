import React, { useState, useEffect } from "react";
import { NavLink, useHistory } from 'react-router-dom';
import { createSpot } from "../../store/spots";
import { useDispatch } from "react-redux";
// import { useModal } from "../../context/Modal";
import "./CreateSpot.css";

function CreateSpotForm() {
  const dispatch = useDispatch();
  let history = useHistory();
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [url, setUrl] = useState("");
  const [errors, setErrors] = useState([]);
  // const { closeModal } = useModal();



  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    let newSpot = {
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price
    };

    return dispatch(createSpot(newSpot, url))
      .then(
        async (data) => {
          if (data.id) {
            history.push(`/spots/${data.id}`);
          }
        }
      )
      .catch(
        async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        }
      );
  };

  useEffect(() => {
    let errs = [];
    if (!url.length) errs.push("Image URL field is required");
    setErrors(errs);
  }, [url]);

  return (
    <div
      className="create-spot-form"
    >
      <div className="create-form-header">
        <NavLink exact to={`/`}><i id="back-arrow" className="fa-solid fa-arrow-left"></i></NavLink>
        <h1>Host an Experience</h1>
        <div></div>
      </div>
      <form id="create-spot-form" onSubmit={handleSubmit}>
        <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>

        <input
          id="create-spot-top-input"
          className="create-spot-input"
          type="text"
          value={address}
          placeholder="Address"
          onChange={(e) => setAddress(e.target.value)}
          required
        />


        <input
          className="create-spot-input"
          type="text"
          value={city}
          placeholder="City"
          onChange={(e) => setCity(e.target.value)}
          required
        />


        <input
          className="create-spot-input"
          type="text"
          value={state}
          placeholder="State"
          onChange={(e) => setState(e.target.value)}
          required
        />

        <input
          className="create-spot-input"
          type="text"
          value={country}
          placeholder="Country"
          onChange={(e) => setCountry(e.target.value)}
          required
        />

        <input
          className="create-spot-input"
          type="text"
          value={lat}
          placeholder="Latitude"
          onChange={(e) => setLat(e.target.value)}
          required
        />

        <input
          className="create-spot-input"
          type="text"
          value={lng}
          placeholder="Longitude"
          onChange={(e) => setLng(e.target.value)}
          required
        />

        <input
          className="create-spot-input"
          type="text"
          value={name}
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          className="create-spot-input"
          type="text"
          value={description}
          placeholder="Description"
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <input
          className="create-spot-input"
          type="text"
          value={price}
          placeholder="Price"
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <input
          id="create-spot-bottom-input"
          className="create-spot-input"
          type="text"
          value={url}
          placeholder="Image URL"
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <button className="create-spot-form-button" type="submit">Create Spot</button>
      </form>
    </div>
  );
}

export default CreateSpotForm;
