import React from 'react';
import { Select } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { resetHover } from '../redux/actions/mapActions';

const StateDropdown = (props) => {
  const importAll = r => r.keys().map(r);
  const images = importAll(require.context('./state-flags', false, /\.(png|jpe?g|svg)$/));
  return (
    <Select
      text="Select a state"
      search
      fluid
      onMouseEnter={props.resetHover}
      selection
      options={props.states.map(state => ({
        key: state.id,
        value: state.id,
        text: state.attributes.name,
        as: Link,
        to: `/states/${state.attributes.name
          .split(' ')
          .join('-')
          .toLowerCase()}`,
        image: {
          size: 'tiny',
          src: images.find(image =>
            image.includes(`/static/media/${state.attributes['short-name'].toLowerCase()}`)),
        },
      }))}
    />
  );
};

const mapStateToProps = state => ({
  states: state.states.states,
  overlay: state.maps.overlay,
});

const mapDispatchToProps = dispatch => ({
  resetHover: () => dispatch(resetHover()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StateDropdown);
