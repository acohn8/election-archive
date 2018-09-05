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
        ? offices.result
            .filter(id => id !== '322')
            .map(officeId => (
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
      {!national && (
        <Dropdown.Item>
          <Dropdown text="US House">
            <Dropdown.Menu>
              <Dropdown.Header>District</Dropdown.Header>
              {offices.entities.offices['322'].districts
                .sort((a, b) => a.name.localeCompare(b.name))
                .map(district => (
                  <StateOfficeDropdownItem
                    key={district.id}
                    office={offices.entities.offices['322']}
                    stateName={stateName}
                    district={district}
                  />
                ))}
            </Dropdown.Menu>
          </Dropdown>
        </Dropdown.Item>
      )}
    </Dropdown.Menu>
  </Dropdown>
);

export default OfficeDropdown;
