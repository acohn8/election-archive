import React from 'react';
import { connect } from 'react-redux';
import { Card, Container, Divider, Header } from 'semantic-ui-react';
import StateCard from '../components/StateList/StateCard';
import { setActive } from '../redux/actions/navActions';

class StateListContainer extends React.Component {
  componentDidMount() {
    this.props.setActive('states');
  }

  render() {
    return (
      <Container>
        <Divider hidden />
        <Header size="huge">Select a State</Header>
        <Divider hidden />
        <Card.Group stackable itemsPerRow={3}>
          {this.props.states.map(state => (
            <StateCard
              key={state.id}
              id={state.id}
              name={state.attributes.name}
              image={`https://s3.amazonaws.com/stateprecinctresults/flags/${state.attributes[
                'short-name'
              ].toLowerCase()}.svg`}
            />
          ))}
        </Card.Group>
      </Container>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  setActive: name => dispatch(setActive(name)),
});

const mapStateToProps = state => ({
  states: state.states.states,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StateListContainer);
