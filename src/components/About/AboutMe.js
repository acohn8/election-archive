import React from 'react';
import { Segment, Header, List, Divider } from 'semantic-ui-react';
import ContactButtons from './ContactButtons';

const AboutMe = () => (
  <div>
    <Header size="large">About Me</Header>
    <ContactButtons />
    <Divider hidden />
    <p>
      I'm Adam Cohn, full-stack web developer with a background in electoral politics and research.
      During my six years at the Atlas Project, a national political consulting firm, I took on
      increasingly technical responsibilities such as data analysis and mapmaking. This eventually
      led me to discover the world of coding. I first learned JavaScript in order to create
      interactive maps and visualizations and became hooked right away (see this site as proof).
    </p>
  </div>
);

export default AboutMe;
