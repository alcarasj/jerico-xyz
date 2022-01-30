import React, { FC, Fragment } from 'react';
import { Github, Linkedin } from 'mdi-material-ui';
import IconButton from '@mui/material/IconButton';
import { GITHUB_URL, LINKEDIN_URL, EMAIL } from "../utils/Settings";
import MailIcon from '@mui/icons-material/Mail';

const SocialBar: FC = (): JSX.Element => (
  <Fragment>
    <a href={LINKEDIN_URL} target="_blank" rel="noreferrer">
      <IconButton aria-label="linkedin" color="primary" size="large">
        <Linkedin />
      </IconButton>
    </a>
    <a href={GITHUB_URL} target="_blank" rel="noreferrer">
      <IconButton aria-label="github" color="primary" size="large">
        <Github />
      </IconButton>
    </a>
    <a href={"mailto:" + EMAIL} target="_blank" rel="noreferrer">
      <IconButton aria-label="email" color="primary" size="large">
        <MailIcon />
      </IconButton>
    </a>
  </Fragment>
);

export default SocialBar;