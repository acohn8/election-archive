import React from 'react';
import { Button } from 'semantic-ui-react';

const ContactButtons = () => (
  <div>
    <Button
      circular
      as="a"
      href="https://github.com/acohn8"
      target="_blank"
      rel="noopener noreferrer"
      icon="github"
    />
    <Button
      circular
      color="linkedin"
      as="a"
      href="https://www.linkedin.com/in/adam-cohn-a80ba323/"
      target="_blank"
      rel="noopener noreferrer"
      icon="linkedin"
    />
    <Button
      circular
      icon="mail"
      color="red"
      as="a"
      href="mailto:adamcohn88@gmail.com"
      target="_top"
    />
    <Button
      circular
      color="twitter"
      icon="twitter"
      as="a"
      href="https://twitter.com/acohn8"
      target="_blank"
      rel="noopener noreferrer"
    />
  </div>
);

export default ContactButtons;
