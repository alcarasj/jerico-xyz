import React from 'react';
import { Github, Linkedin } from 'mdi-material-ui';
import IconButton from '@material-ui/core/IconButton';
import { GITHUB_URL, LINKEDIN_URL, EMAIL } from "../utils/Settings";
import MailIcon from '@material-ui/icons/Mail';

const SocialBar: React.FC = (): JSX.Element => (
  <React.Fragment>
    <a href={LINKEDIN_URL} target="_blank" rel="noreferrer">
      <IconButton aria-label="linkedin" color="primary">
        <Linkedin />
      </IconButton>
    </a>
    <a href={GITHUB_URL} target="_blank" rel="noreferrer">
      <IconButton aria-label="github" color="primary">
        <Github />
      </IconButton>
    </a>
    <a href={"mailto:" + EMAIL} target="_blank" rel="noreferrer">
      <IconButton aria-label="email" color="primary">
        <MailIcon />
      </IconButton>
    </a>
  </React.Fragment>
);

export default SocialBar;