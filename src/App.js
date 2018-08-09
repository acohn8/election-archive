import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { fetchStatesList } from './redux/actions/stateActions';
import StateContainer from './components/stateContainer';
import HomeContainer from './components/Home/HomeContainer';
import NationalMapContainer from './components/NationalMap/NationalMapContainer';

import './App.css';
import Footer from './components/Footer';
import StateListContainer from './components/StateList/StateListContainer';

class App extends React.Component {
  componentDidMount() {
    this.props.fetchStatesList();
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
});

export default withRouter(connect(
  null,
  mapDispatchToProps,
)(App));
