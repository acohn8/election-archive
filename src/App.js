import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import AboutContainer from './containers/AboutContainer';
import FrequentlyAskedQuestionsContainer from './containers/FrequentlyAskedQuestionsContainer';
import HomeContainer from './containers/HomeContainer';
import NationalMapContainer from './containers/NationalMapContainer';
import ResponsiveNav from './containers/ResponsiveNav';
import StateContainer from './containers/StateContainer';
import StateListContainer from './containers/StateListContainer';
import { fetchOfficesList } from './redux/actions/officeActions';
import { fetchStatesList } from './redux/actions/stateActions';

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
          {this.props.offices.allOffices.result !== undefined && (
            <Route exact path="/national-map" component={NationalMapContainer} />
          )}
          <Route exact path="/states" component={StateListContainer} />
          {this.props.allStates.length > 0 &&
            this.props.offices.allOffices.result !== undefined && (
              <Route
                path="/states/:activeStateName/:activeOfficeName/:activeDistrict?"
                component={StateContainer}
              />
            )}
          <Route path="/about" component={AboutContainer} />
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

const mapStateToProps = state => ({
  allOffices: state.offices.allOffices,
  allStates: state.states.states,
  offices: state.offices,
  counties: state.counties,
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(App));
