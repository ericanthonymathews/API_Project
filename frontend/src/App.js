import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import SpotsIndex from "./components/SpotsIndex";
import SpotShow from "./components/SpotShow";
import CreateSpotForm from "./components/CreateSpotForm";
import EditSpotForm from "./components/EditSpotForm";
import DeleteSpotForm from "./components/DeleteSpotForm";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      <div className="splitter"></div>
      {isLoaded && (
        <Switch>
          <Route exact path="/" component={SpotsIndex} />
          <Route exact path="/spots/new" component={CreateSpotForm} />
          <Route exact path="/spots/:spotId/delete" component={DeleteSpotForm} />
          <Route exact path="/spots/:spotId/edit" component={EditSpotForm} />
          <Route exact path="/spots/:spotId" component={SpotShow} />
        </Switch>
      )}
    </>
  );
}

export default App;
