import styled from 'styled-components';
import React from 'react';

const PartyColorCircle = styled.span`
  color: ${props => props.color};
  transition: 'all .3s ease';
  margin: '3px';
`;

const StateHoverOverlay = props => (
  <PartyColorCircle color={props.color}>&#x25cf;</PartyColorCircle>
);

export default StateHoverOverlay;
