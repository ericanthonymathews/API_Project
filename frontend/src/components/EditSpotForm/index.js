
import React, { useState, useEffect } from "react";
import { NavLink, useHistory } from 'react-router-dom';
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
          if (data && data.errors) setErrors(Object.values(data.errors));
        }
      );
  };

  return (
    <div
      className="edit-spot-form"
    >
      <div className="form-header">
        <NavLink exact to={`/spots/${spotDetails.id}`}><i id="back-arrow" className="fa-solid fa-arrow-left"></i></NavLink>
        <h1>Edit Spot</h1>
        <div></div>
      </div>
      <form id="edit-spot-form" onSubmit={handleSubmit}>
        <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <label>
          Address
        </label>
        <input
          className="edit-spot-input"
          type="text"
          value={address}
          placeholder="Address"
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <label>
          City
        </label>
        <input
          className="edit-spot-input"
          type="text"
          value={city}
          placeholder="City"
          onChange={(e) => setCity(e.target.value)}
          required
        />
        <label>
          State
        </label>
        <input
          className="edit-spot-input"
          type="text"
          value={state}
          placeholder="State"
          onChange={(e) => setState(e.target.value)}
          required
        />
        <label>
          Country
        </label>
        <input
          className="edit-spot-input"
          type="text"
          value={country}
          placeholder="Country"
          onChange={(e) => setCountry(e.target.value)}
          required
        />
        <label>
          Latitude
        </label>
        <input
          className="edit-spot-input"
          type="text"
          value={lat}
          placeholder="Latitude"
          onChange={(e) => setLat(e.target.value)}
          required
        />
        <label>
          Longitude
        </label>
        <input
          className="edit-spot-input"
          type="text"
          value={lng}
          placeholder="Longitude"
          onChange={(e) => setLng(e.target.value)}
          required
        />
        <label>
          Name
        </label>
        <input
          className="edit-spot-input"
          type="text"
          value={name}
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
          required
        />
        <label>
          Description
        </label>
        <input
          className="edit-spot-input"
          type="text"
          value={description}
          placeholder="Description"
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <label>
          Price
        </label>
        <input
          className="edit-spot-input"
          type="text"
          value={price}
          placeholder="Price"
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <button className="spot-form-button" type="submit">Save Edits</button>
      </form>
    </div>
  );
}

export default EditSpotForm;
