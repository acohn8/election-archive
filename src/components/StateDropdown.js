import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

const StateDropdown = (props) => {
  const importAll = r => r.keys().map(r);
  const images = importAll(require.context('./state-flags', false, /\.(png|jpe?g|svg)$/));
  return (
    <Dropdown
      text="States"
      fluid
      search
      selection
      options={props.states.map(state => ({
        key: state.id,
        value: state.id,
        text: state.attributes.name,
        as: Link,
        to: `/states/${state.id}`,
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
});

export default connect(mapStateToProps)(StateDropdown);
