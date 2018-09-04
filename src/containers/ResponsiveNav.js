import React from 'react';
import DesktopNav from '../components/Nav/DesktopNav';
import MobileNav from '../components/Nav/MobileNav';

const ResponsiveNav = ({ children }) => (
  <div>
    <DesktopNav>{children}</DesktopNav>
    <MobileNav>{children}</MobileNav>
  </div>
);

export default ResponsiveNav;
