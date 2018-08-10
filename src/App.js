import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { fetchStatesList } from './redux/actions/stateActions';
import fetchOfficesList from './redux/actions/officeActions';
import StateContainer from './components/stateContainer';
import HomeContainer from './components/Home/HomeContainer';
import NationalMapContainer from './components/NationalMap/NationalMapContainer';

import './App.css';
import Footer from './components/Footer';
import StateListContainer from './components/StateList/StateListContainer';

class App extends React.Component {
  componentDidMount() {
    this.props.fetchStatesList();
    this.props.fetchOfficesList();
  }

  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/" component={HomeContainer} />
          <Route exact path="/national-map" component={NationalMapContainer} />
          <Route exact path="/states" component={StateListContainer} />
          <Route path="/states/:activeStateName" component={StateContainer} />
        </Switch>
        <Footer />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  fetchStatesList: () => dispatch(fetchStatesList()),
  fetchOfficesList: () => dispatch(fetchOfficesList()),
});

export default withRouter(connect(
  null,
  mapDispatchToProps,
)(App));
