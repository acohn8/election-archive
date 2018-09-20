import React from 'react';
import { Button, Icon } from 'semantic-ui-react';

const ButtonWithIcon = ({
  color, link, icon, text, onClick = null,
}) => (
  <Button
    compact
    basic
    color={color}
    as="a"
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    onClick={onClick}
  >
    <Icon name={icon} /> {text}
  </Button>
);

export default ButtonWithIcon;
