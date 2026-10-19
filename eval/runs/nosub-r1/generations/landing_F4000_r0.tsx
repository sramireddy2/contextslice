import { Box, Button, Card, Flex, Grid, Heading, Icon, Link, Text } from 'primitives';
import { NavigationPillList, HeaderAuth, HeroImage, CardGridIcon, Footer } from 'compositions';
import { useTheme } from 'react';

export default function Screen() {
  const theme = useTheme();

  return (
    <Box bg={theme.colors.backgroundDefaultDefault} padding="sds-size-space-800">
      <Box display="flex" flexDirection="column" gap="sds-size-space-600" padding="sds-size-space-800">
        <Box display="flex" alignItems="center" justifyContent="center">
          <Box display="flex" gap="24px">
            <Box display="flex" width="40px" height="hug" />
            <NavigationPillList>
              <NavigationPill label="Products" state="active" />
              <NavigationPill label="Solutions" state="default" />
              <NavigationPill label="Community" state="default" />
              <NavigationPill label="Resources" state="default" />
              <NavigationPill label="Pricing" state="default" />
              <NavigationPill label="Contact" state="default" />
            </NavigationPillList>
          </Box>
          <HeaderAuth state="loggedOut">
            <Button variant="neutral" size="small">
              Sign in
            </Button>
            <Button variant="primary" size="small">
              Register
            </Button>
          </HeaderAuth>
        </Box>
        <HeroImage>
          <TextContentTitle title="Title" subtitle="Subtitle" />
          <ButtonGroup>
            <Button variant="neutral" size="medium">
              Button
            </Button>
            <Button variant="primary" size="medium">
              Button
            </Button>
          </ButtonGroup>
        </HeroImage>
        <Box display="flex" flexDirection="row" gap="sds-size-space-1200" padding="sds-size-space-1600">
          <Box display="flex" alignItems="center" justifyContent="center" width="fill" height="fill" background={theme.colors.slate200} clip />
          <Box display="flex" alignItems="center" justifyContent="center" width="fill" height="fill" background={theme.colors.slate200} clip />
        </Box>
        <CardGridIcon>
          <TextContentHeading heading="Heading" subheading="Subheading" />
          <Grid gap="sds-size-space-1600">
            <Card icon="info" body="Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story." heading="Title" />
            <Card icon="info" body="Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story." heading="Title" />
            <Card icon="info" body="Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story." heading="Title" />
            <Card icon="info" body="Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story." heading="Title" />
            <Card icon="info" body="Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story." heading="Title" />
            <Card icon="info" body="Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story." heading="Title" />
          </Grid>
        </CardGridIcon>
        <Footer platform="desktop" />
      </Box>
    </Box>
  );
}
