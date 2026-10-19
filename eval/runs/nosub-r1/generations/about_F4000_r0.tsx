import { Box, Button, Card, Flex, Grid, Heading, Icon, Link, Text } from 'primitives';
import { NavigationPillList, Header, HeroBasic, PanelImageDouble } from 'compositions';
import { useTheme } from 'react';

export default function Screen() {
  const theme = useTheme();

  return (
    <Box background={theme.color.background.default.default} padding={theme.size.space[1600]}>
      <Header>
        <Flex direction="row" gap={theme.size.space[200]} align="center">
          <Box width="40px" height="35px">
            <Icon name="Figma" color={theme.color.icon.default.default} width="23.33" height="35" stroke={theme.color.icon.default.default} strokeWidth="3.5" />
          </Box>
          <NavigationPillList>
            <NavigationPill label="Products" state="active" />
            <NavigationPill label="Solutions" state="default" />
            <NavigationPill label="Community" state="default" />
            <NavigationPill label="Resources" state="default" />
            <NavigationPill label="Pricing" state="default" />
            <NavigationPill label="Contact" state="default" />
          </NavigationPillList>
        </Flex>
        <HeaderAuth state="loggedOut">
          <Button variant="neutral" size="small" label="Sign in" />
          <Button variant="primary" size="small" label="Register" />
        </HeaderAuth>
      </Header>
      <HeroBasic title="Title" subtitle="Subtitle" />
      <PanelImageDouble />
      <Grid columns={2} gap={theme.size.space[1200]} padding={theme.size.space[1600]}>
        <Card
          icon="info"
          body="Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story. "
          asset={true}
          heading="Title"
          button={true}
        >
          <Box width="160px" height="160px" background={theme.color.slate[200]} />
          <Flex direction="column" gap={theme.size.space[400]}>
            <Text style="heading">Title</Text>
            <Text style="bodyBase">Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story. </Text>
          </Flex>
          <ButtonGroup align="start">
            <Button variant="neutral" size="medium" label="Button" />
          </ButtonGroup>
        </Card>
        <Card
          icon="info"
          body="Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story. "
          asset={true}
          heading="Title"
          button={true}
        >
          <Box width="160px" height="160px" background={theme.color.slate[200]} />
          <Flex direction="column" gap={theme.size.space[400]}>
            <Text style="heading">Title</Text>
            <Text style="bodyBase">Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story. </Text>
          </Flex>
          <ButtonGroup align="start">
            <Button variant="neutral" size="medium" label="Button" />
          </ButtonGroup>
        </Card>
        <Card
          icon="info"
          body="Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story. "
          asset={true}
          heading="Title"
          button={true}
        >
          <Box width="160px" height="160px" background={theme.color.slate[200]} />
          <Flex direction="column" gap={theme.size.space[400]}>
            <Text style="heading">Title</Text>
            <Text style="bodyBase">Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story. </Text>
          </Flex>
          <ButtonGroup align="start">
            <Button variant="neutral" size="medium" label="Button" />
          </ButtonGroup>
        </Card>
      </Grid>
      <Grid columns={2} gap={theme.size.space[1200]} padding={theme.size.space[1600]}>
        <Card
          icon="info"
          body="Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story. "
          asset={true}
          heading="Title"
          button={false}
        >
          <Box width="160px" height="160px" background={theme.color.slate[200]} />
          <Flex direction="column" gap={theme.size.space[400]}>
            <Text style="heading">Title</Text>
            <Text style="bodyBase">Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story. </Text>
          </Flex>
        </Card>
        <Card
          icon="info"
          body="Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story. "
          asset={true}
          heading="Title"
          button={false}
        >
          <Box width="160px" height="160px" background={theme.color.slate[200]} />
          <Flex direction="column" gap={theme.size.space[400]}>
            <Text style="heading">Title</Text>
            <Text style="bodyBase">Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story. </Text>
          </Flex>
        </Card>
      </Grid>
    </Box>
  );
}
