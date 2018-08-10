import React from 'react';
import { Card, Container, Header, Divider } from 'semantic-ui-react';
import { connect } from 'react-redux';
import StateCard from './StateCard';
import ResponsiveNav from '../Nav/ResponsiveNav';
import setActive from '../../redux/actions/navActions';

class StateListContainer extends React.Component {
  componentDidMount() {
    this.props.setActive('states');
  }

  importAll = r => r.keys().map(r);

  render() {
    const images = this.importAll(require.context('../state-flags', false, /\.(png|jpe?g|svg)$/));

    return (
      <ResponsiveNav>
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
                image={images.find(image =>
                  image.includes(`/static/media/${state.attributes['short-name'].toLowerCase()}`),
                )}
              />
            ))}
          </Card.Group>
        </Container>
      </ResponsiveNav>
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
