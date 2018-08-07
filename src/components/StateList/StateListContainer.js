import React from 'react';
import { Card, Container } from 'semantic-ui-react';
import { connect } from 'react-redux';
import StateCard from './StateCard';
import Nav from '../nav';

class StateListContainer extends React.Component {
  importAll = r => r.keys().map(r);

  render() {
    const images = this.importAll(require.context('../state-flags', false, /\.(png|jpe?g|svg)$/));

    return (
      <div>
        <Nav />
        <Container>
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
      </div>
    );
  }
}

const mapStateToProps = state => ({
  states: state.states.states,
});

export default connect(mapStateToProps)(StateListContainer);
