import React from 'react';
import { Button, Header, Icon, Image, Modal, Table } from 'semantic-ui-react';

const CountyModal = ({ countyName }) => (
  <Modal
    trigger={
      <Table.Cell selectable>
        <a href="#">{countyName}</a>
      </Table.Cell>
    }
  >
    <Modal.Header>{countyName}</Modal.Header>
    <Modal.Content image>
      <Image wrapped size="medium" src="https://react.semantic-ui.com/images/wireframe/image.png" />
      <Modal.Description>
        <Header>Modal Header</Header>
        <p>This is an example of expanded content that will cause the modal's dimmer to scroll</p>
        <Image src="https://react.semantic-ui.com/images/wireframe/paragraph.png" />
        <Image src="https://react.semantic-ui.com/images/wireframe/paragraph.png" />
        <Image src="https://react.semantic-ui.com/images/wireframe/paragraph.png" />
        <Image src="https://react.semantic-ui.com/images/wireframe/paragraph.png" />
        <Image src="https://react.semantic-ui.com/images/wireframe/paragraph.png" />
        <Image src="https://react.semantic-ui.com/images/wireframe/paragraph.png" />
        <Image src="https://react.semantic-ui.com/images/wireframe/paragraph.png" />
        <Image src="https://react.semantic-ui.com/images/wireframe/paragraph.png" />
      </Modal.Description>
    </Modal.Content>
    <Modal.Actions>
      <Button primary>
        Proceed <Icon name="right chevron" />
      </Button>
    </Modal.Actions>
  </Modal>
);

export default CountyModal;
