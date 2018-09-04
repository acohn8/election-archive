import styled from 'styled-components';
import React from 'react';

const StyledNationalHover = styled.div`
  position: absolute;
  z-index: 1;
  left: 30;
  border-radius: 25px;
  top: 80;
  width: 300px;
  background-color: white;
  padding: 20px;
  opacity: 0.8;
  border-color: gray;
  border-style: solid;
  border-width: 0.5px;
  margin: 15px;
`;

const DesktopNationalHoverContainer = ({ children }) => (
  <StyledNationalHover>{children}</StyledNationalHover>
);

export default DesktopNationalHoverContainer;
