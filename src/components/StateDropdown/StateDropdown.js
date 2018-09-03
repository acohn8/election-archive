import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Dropdown } from 'semantic-ui-react';

const StateDropdown = (props) => {
  const importAll = r => r.keys().map(r);
  const images = importAll(require.context('../state-flags', false, /\.(png|jpe?g|svg)$/));
  return (
    <Dropdown
      text={
        props.states.states.find(state => state.id === props.states.activeStateId).attributes.name
      }
      search
      transparent="true"
      options={props.states.states.map(state => ({
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
  states: state.states,
  offices: state.offices,
});

export default connect(mapStateToProps)(StateDropdown);
