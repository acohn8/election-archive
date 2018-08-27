import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { fetchStatesList } from './redux/actions/stateActions';
import { fetchOfficesList } from './redux/actions/officeActions';
import StateContainer from './components/stateContainer';
import HomeContainer from './components/Home/HomeContainer';
import NationalMapContainer from './components/NationalMap/NationalMapContainer';
import NewMapContainer from './components/Map/NewMapContainer';

import './App.css';
import StateListContainer from './components/StateList/StateListContainer';
import AboutContainer from './components/About/AboutContainer';
import ResponsiveNav from './components/Nav/ResponsiveNav';
import FrequentlyAskedQuestionsContainer from './components/Faq/FrequentlyAskedQuestionsContainer';

class App extends React.Component {
  componentDidMount() {
    this.props.fetchStatesList();
    this.props.fetchOfficesList();
  }

  render() {
    return (
      <ResponsiveNav>
        <Switch>
          <Route exact path="/" component={HomeContainer} />
          <Route exact path="/national-map" component={NationalMapContainer} />
          <Route exact path="/states" component={StateListContainer} />
          <Route path="/states/:activeStateName" component={StateContainer} />
          <Route path="/about" component={AboutContainer} />
          <Route path="/newmap" component={NewMapContainer} />
          <Route path="/faq" component={FrequentlyAskedQuestionsContainer} />
        </Switch>
      </ResponsiveNav>
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
