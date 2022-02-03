import React from 'react';
import {Route, Switch} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/Home';
import Header from './components/nav/Header';
import RegisterComplete from './pages/auth/RegisterComplete';

const App = () => {
  return (
      <>
          <Header />
          <ToastContainer />
          <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/register/complete" component={RegisterComplete} />
              <Route exact path="/login" component={Login} />
          </Switch>
      </>
  );
};

export default App;
