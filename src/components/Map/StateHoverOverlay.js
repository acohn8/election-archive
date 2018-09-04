import styled from 'styled-components';
import React from 'react';

const StyledStateHover = styled.div`
  position: absolute;
  z-index: 1;
  background-color: white;
  opacity: 0.8;
  padding: 10px;
  margin: auto;
  left: 30;
  top: 20;
  border-color: gray;
  border-style: solid;
  border-width: 0.5px;
`;

const StateHoverOverlay = ({ children }) => <StyledStateHover>{children}</StyledStateHover>;

export default StateHoverOverlay;
