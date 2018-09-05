import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const StateOfficeDropdownItem = ({ office, stateName, district }) => (
  <Dropdown.Item
    key={office.id}
    text={!district ? office.name : district.name}
    as={Link}
    to={
      !district
        ? `/states/${stateName
            .split(' ')
            .join('-')
            .toLowerCase()}/${office.name
            .split(' ')
            .join('-')
            .toLowerCase()}`
        : `/states/${stateName
            .split(' ')
            .join('-')
            .toLowerCase()}/${office.name
            .split(' ')
            .join('-')
            .toLowerCase()}/${district.name.toLowerCase()}`
    }
  />
);

export default StateOfficeDropdownItem;
