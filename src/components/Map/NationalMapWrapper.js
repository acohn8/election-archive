import styled from 'styled-components';
import React from 'react';

const Wrapper = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
`;

const NationalMapWrapper = ({ children }) => <Wrapper>{children}</Wrapper>;

export default NationalMapWrapper;
