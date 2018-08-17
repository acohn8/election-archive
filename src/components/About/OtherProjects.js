import React from 'react';
import { List, Segment, Header } from 'semantic-ui-react';

const OtherProjects = () => (
  <Segment>
    <Header size="medium">Other Projects</Header>
    <List divided relaxed>
      <List.Item>
        <List.Icon name="sun outline" size="large" verticalAlign="middle" />
        <List.Content>
          <List.Header
            as="a"
            href="https://react-weather-20180701.herokuapp.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Find Your Weather
          </List.Header>
          <List.Description
            as="a"
            href="https://react-weather-20180701.herokuapp.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            A fast and minimalistic weather application written in React
          </List.Description>
        </List.Content>
      </List.Item>
      <List.Item>
        <List.Icon name="location arrow" size="large" verticalAlign="middle" />
        <List.Content>
          <List.Header
            as="a"
            href="https://acohn8.github.io/Where-To/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Where To?
          </List.Header>
          <List.Description
            as="a"
            href="https://acohn8.github.io/Where-To/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Leave anonymous location-based messages written in vanilla JavaScript
          </List.Description>
        </List.Content>
      </List.Item>
    </List>
  </Segment>
);

export default OtherProjects;
