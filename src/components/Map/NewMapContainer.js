import React from 'react';
import { connect } from 'react-redux';

import NewMap from './NewMapComponent';
import MapInfo from './mapInfo';

class NewMapContainer extends React.Component {
  render() {
    return (
      <div>
        <NewMap />
        <div
          style={{
            position: 'absolute',
            zIndex: 1,
            left: 30,
            borderRadius: '25px',
            top: 80,
            width: 300,
            backgroundColor: 'white',
            padding: '20px',
            opacity: '0.8',
            borderColor: 'gray',
            borderStyle: 'solid',
            borderWidth: '0.5px',
          }}
        >
          <MapInfo />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  allOffices: state.offices.allOffices,
  selectedOffice: state.offices.selectedOfficeId,
});

export default connect(mapStateToProps)(NewMapContainer);
