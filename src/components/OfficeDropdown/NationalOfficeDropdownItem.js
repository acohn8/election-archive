import React from 'react';
import { Dropdown } from 'semantic-ui-react';

const NationalOfficeDropdownItem = ({ office, setOffice }) => (
  <Dropdown.Item
    key={office.id}
    text={office.attributes.name}
    onClick={() => setOffice(office.id)}
  />
);

export default NationalOfficeDropdownItem;
