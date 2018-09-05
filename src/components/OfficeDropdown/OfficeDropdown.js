import React from 'react';
import { Dropdown } from 'semantic-ui-react';

import StateOfficeDropdownItem from './StateOfficeDropdownItem';
import NationalOfficeDropdownItem from './NationalOfficeDropdownItem';

const OfficeDropdown = ({
  offices, selectedOfficeId, stateName, national, setOffice,
}) => (
  <Dropdown
    text={
      national
        ? offices.entities.offices[selectedOfficeId].attributes.name
        : offices.entities.offices[selectedOfficeId].name
    }
    pointing
  >
    <Dropdown.Menu>
      <Dropdown.Header>Offices</Dropdown.Header>
      {!national
        ? offices.result.map(officeId => (
          <StateOfficeDropdownItem
            key={officeId}
            office={offices.entities.offices[officeId]}
            stateName={stateName}
          />
          ))
        : offices.result.map(officeId => (
          <NationalOfficeDropdownItem
            key={officeId}
            office={offices.entities.offices[officeId]}
            stateName={stateName}
            setOffice={setOffice}
          />
          ))}
    </Dropdown.Menu>
  </Dropdown>
);

export default OfficeDropdown;
