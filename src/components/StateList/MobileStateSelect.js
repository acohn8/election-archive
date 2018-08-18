import React from 'react';
import { Modal, Dropdown, List, Image } from 'semantic-ui-react';
import { connect } from 'react-redux';

const MobileStateSelector = (props) => {
  const importAll = r => r.keys().map(r);
  const images = importAll(require.context('../state-flags', false, /\.(png|jpe?g|svg)$/));
  return (
    <Modal dimmer="blurring" trigger={<Dropdown text={props.state} />} closeIcon>
      <Modal.Header>States</Modal.Header>
      <Modal.Content scrolling>
        <List selection verticalAlign="middle">
          {props.states.states.map(state => (
            <List.Item
              key={state.id}
              href={`/states/${state.attributes.name
                .split(' ')
                .join('-')
                .toLowerCase()}`}
            >
              <Image
                avatar
                src={images.find(image =>
                  image.includes(`/static/media/${state.attributes['short-name'].toLowerCase()}`))}
              />
              <List.Content>
                <List.Header>{state.attributes.name}</List.Header>
              </List.Content>
            </List.Item>
          ))}
        </List>
      </Modal.Content>
    </Modal>
  );
};

const mapStateToProps = state => ({
  states: state.states,
});

export default connect(mapStateToProps)(MobileStateSelector);
