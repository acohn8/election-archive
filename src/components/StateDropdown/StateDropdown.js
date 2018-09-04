import React from 'react';
import { Link } from 'react-router-dom';
import { Dropdown } from 'semantic-ui-react';

const StateDropdown = ({ states, activeState }) => (
  <Dropdown
    text={activeState}
    search
    transparent="true"
    options={states.map(state => ({
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
          src: `https://s3.amazonaws.com/stateprecinctresults/flags/${state.attributes[
            'short-name'
          ].toLowerCase()}.svg`,
        },
      }))}
  />
);

export default StateDropdown;
