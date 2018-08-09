import React from 'react';
import MobileNav from './MobileNav';
import DesktopNav from './DesktopNav';

const ResponsiveNav = ({ children }) => (
  <div>
    <DesktopNav>{children}</DesktopNav>
    <MobileNav>{children}</MobileNav>
  </div>
);

export default ResponsiveNav;
