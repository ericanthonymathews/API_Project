
import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import { changeSpot } from "../../store/spots";
import { useDispatch, useSelector } from "react-redux";
import './EditSpot.css';



function EditSpotForm() {
  const spotDetails = useSelector((state) => {
    return state.spots.singleSpot;
  });
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

  const [errors, setErrors] = useState([]);

  useEffect(() => {
    setAddress(spotDetails.address);
    setCity(spotDetails.city);
    setState(spotDetails.state);
    setCountry(spotDetails.country);
    setLat(spotDetails.lat);
    setLng(spotDetails.lng);
    setName(spotDetails.name);
    setDescription(spotDetails.description);
    setPrice(spotDetails.price);

  }, [spotDetails])



  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    let editedSpot = {
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price
    }
    return dispatch(changeSpot(editedSpot, spotDetails.id))
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

  return (
    <div
      className="create-spot-form"
    >
      <h1>Create Spot</h1>
      <form onSubmit={handleSubmit}>
        <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <label>
          Address
          <input
            type="text"
            value={address}
            placeholder="Address"
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </label>
        <label>
          City
          <input
            type="text"
            value={city}
            placeholder="City"
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </label>
        <label>
          State
          <input
            type="text"
            value={state}
            placeholder="State"
            onChange={(e) => setState(e.target.value)}
            required
          />
        </label>
        <label>
          Country
          <input
            type="text"
            value={country}
            placeholder="Country"
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </label>
        <label>
          Latitude
          <input
            type="text"
            value={lat}
            placeholder="Latitude"
            onChange={(e) => setLat(e.target.value)}
            required
          />
        </label>
        <label>
          Longitude
          <input
            type="text"
            value={lng}
            placeholder="Longitude"
            onChange={(e) => setLng(e.target.value)}
            required
          />
        </label>
        <label>
          Name
          <input
            type="text"
            value={name}
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
          Description
          <input
            type="text"
            value={description}
            placeholder="Description"
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>
        <label>
          Price
          <input
            type="text"
            value={price}
            placeholder="Price"
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </label>
        <button type="submit">Save Edits</button>
      </form>
    </div>
  );
}

export default EditSpotForm;
