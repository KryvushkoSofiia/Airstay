import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";

import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import SpotsList from "./components/SpotsList";
import SpotDetails from './components/SpotDetails';
import CreateSpotForm from './components/CreateSpotForm';
import ManageSpots from './components/ManageSpots';
import UpdateSpotFrom from './components/ManageSpots/UpdateSpotForm';
import SpotReviews from "./components/SpotReviews";


function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Switch>
        <Route exact path={["/", "/spots"]}>
          <SpotsList />
        </Route>
        <Route exact path="/spots/:spotId" >
          <SpotDetails />
          <SpotReviews />
        </Route>
        <Route exact path="/create-spot">
          <CreateSpotForm />
        </Route>
        <Route exact path="/user-spots/:userId">
          <ManageSpots />
        </Route>
        <Route exact path="/spots/:id/update">
          <UpdateSpotFrom />
        </Route>
      </Switch>}
    </>
  );
}

export default App;
