import React from 'react';

import HomepageHeading from './HomepageHeadeading';
import MobileNav from '../Nav/MobileNav';
import DesktopNav from '../Nav/DesktopNav';

const HomeContainer = () => (
  <div>
    <MobileNav>
      <HomepageHeading mobile />
    </MobileNav>
    <DesktopNav>
      <HomepageHeading />
    </DesktopNav>
  </div>
);

export default HomeContainer;
