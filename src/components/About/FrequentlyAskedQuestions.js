import React from 'react';
import { Container, Header, List } from 'semantic-ui-react';

const FrequentlyAskedQuestions = () => (
  <Container text>
    <Header size="large">FAQ</Header>
    <List>
      <List.Item>
        <List.Header>Where does the data come from?</List.Header>{' '}
        <p>
          Precinct election data is from the{' '}
          <a href="https://electionlab.mit.edu/" target="_blank" rel="noopener noreferrer">
            MIT Election Data and Science Lab (MEDSL)
          </a>
          . Precinct returns, posted as CSV files on MEDSL's{' '}
          <a href="https://electionlab.mit.edu/" target="_blank" rel="noopener noreferrer">
            github
          </a>
          , have been normalized and serialized for use on this site.
        </p>
        <p>
          County and state maps have been created by aggregating MEDSL precinct returns and joining
          the results U.S. Census Bureau Shapefiles.
        </p>
        <p>
          Precinct maps for Georgia, Minnesota, Texas, and Wisconsin were compiled by the{' '}
          <a
            href="https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/NH5S2I"
            target="_blank"
            rel="noopener noreferrer"
          >
            {' '}
            Florida Election Science Team{' '}
          </a>
          . Note that this data is not from MEDSL and given the difficulty in acquiring and mapping
          precinct data, may not line up perfectly with the MEDSL results used elsewhere on the
          site.
        </p>
      </List.Item>
      <List.Item>
        <List.Header>Will you be adding results from more offices?</List.Header>
        <p>
          Yes! I am currently working on importing U.S. House and down-ballot statewide
          constitutional office election results. State legislative, judicial, and local elections
          will be posted in the coming weeks.
        </p>
      </List.Item>
      <List.Item>
        <List.Header>What about other election cycles?</List.Header>
        <p>
          Adding results other years is on my radar, but I am focused on compiling a catalogue of
          the 2016 elections.
        </p>
      </List.Item>
      <List.Item>
        <List.Header>Hey, I found a data error. How can I report it?</List.Header>
        <p>
          Shoot me an{' '}
          <a href="mailto:adamcohn88@gmail.com" target="_top">
            email
          </a>{' '}
          or let me know on{' '}
          <a
            href="https://github.com/acohn8/election-archive"
            target="_blank"
            rel="noopener noreferrer"
          >
            github
          </a>
          .
        </p>
      </List.Item>
    </List>
  </Container>
);

export default FrequentlyAskedQuestions;
