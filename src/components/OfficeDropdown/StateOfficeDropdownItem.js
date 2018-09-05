import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const StateOfficeDropdownItem = ({ office, stateName }) => (
  <Dropdown.Item
    key={office.id}
    text={office.name}
    as={Link}
    to={`/states/${stateName
      .split(' ')
      .join('-')
      .toLowerCase()}/${office.name
      .split(' ')
      .join('-')
      .toLowerCase()}`}
  />
);

export default StateOfficeDropdownItem;
