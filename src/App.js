import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/Home';
import Header from './components/nav/Header';

const App = () => {
  return (
      <>
          <Header />
          <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
          </Switch>
      </>
  );
};

export default App;
