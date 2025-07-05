import React from 'react';
import { Box, Typography, IconButton, Stack } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LanguageIcon from '@mui/icons-material/Language';
import PhoneIcon from '@mui/icons-material/Phone';

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#f5f5f5',
        padding: '16px',
        mt: 4,
        textAlign: 'center',
        borderTop: '1px solid #ddd',
      }}
    >
      <Typography variant="body1" gutterBottom fontWeight="bold">
        SHAIK YASIN BABA
      </Typography>

      <Stack direction="row" spacing={2} justifyContent="center" mb={1}>
        <IconButton
          href="mailto:shaikyasinbaba6@gmail.com"
          target="_blank"
          rel="noopener"
          color="primary"
        >
          <EmailIcon />
        </IconButton>

        <IconButton
          href="https://www.linkedin.com/in/yasinbaba-shaik"
          target="_blank"
          rel="noopener"
          color="primary"
        >
          <LinkedInIcon />
        </IconButton>

        <IconButton
          href="https://github.com/shaikYasinBaba"
          target="_blank"
          rel="noopener"
          color="primary"
        >
          <GitHubIcon />
        </IconButton>

        <IconButton
          href="https://my-portfolio-eigi.onrender.com"
          target="_blank"
          rel="noopener"
          color="primary"
        >
          <LanguageIcon />
        </IconButton>

        <IconButton
          href="tel:+919381125634"
          color="primary"
        >
          <PhoneIcon />
        </IconButton>
      </Stack>

      <Typography variant="caption" color="text.secondary">
        © {new Date().getFullYear()} Shaik Yasin Baba. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
