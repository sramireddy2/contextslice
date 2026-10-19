import React from "react";
import { IconStar, IconX } from "icons";
import { Box, Button, Card, CardGridIcon, FeaturePanel, Footer, Hero, Header, TextContentHeading, TextContentTitle } from "compositions";
import { Flex, Grid, Text, TextLinkList } from "layout";

export default function Screen() {
  return (
    <Box>
      <Header>
        <Flex gap="var(--sds-size-space-600)" padding="var(--sds-size-space-800)">
          <Box>
            <Box width="40px" height="hug">
              <IconStar size="23.33px" stroke="var(--sds-color-icon-default-default)" strokeWidth="3.5" />
            </Box>
          </Box>
          <NavigationPillList>
            <Slot>
              <Button>Link 1</Button>
              <Button>Link 2</Button>
              <Button>Link 3</Button>
              <Button>Link 4</Button>
              <Button>Link 5</Button>
              <Button>Link 6</Button>
              <Button>Link 7</Button>
            </Slot>
          </NavigationPillList>
          <HeaderAuth state="Logged Out">
            <Button>Button 1</Button>
            <Button>Button 2</Button>
          </HeaderAuth>
        </Flex>
      </Header>
      <Hero>
        <TextContentTitle title="Title" subtitle="Subtitle" />
        <ButtonGroup align="center">
          <Button>Button</Button>
          <Button variant="primary" state="default" size="medium" iconEnd={<IconX />} iconStart={<IconStar />}>
            Button
          </Button>
        </ButtonGroup>
      </Hero>
      <FeaturePanel>
        <Box width="fill" height="478px" padding="var(--sds-size-space-1600)" opacity="0.8">
          <Box width="fill" height="fill" background="var(--sds-color-slate-200)" clip />
        </Box>
      </FeaturePanel>
      <CardGridIcon>
        <TextContentHeading heading="Heading" subheading="Subheading" />
        <Grid gap="var(--sds-size-space-1600)">
          <Card />
          <Card />
          <Card />
          <Card />
        </Grid>
      </CardGridIcon>
      <Footer>
        <Flex gap="var(--sds-size-space-400)" padding="var(--sds-size-space-800) var(--sds-size-space-800) var(--sds-size-space-4000) var(--sds-size-space-800)">
          <Box width="262px">
            <Box width="hug" height="hug">
              <IconStar size="23.33px" stroke="var(--sds-color-icon-default-default)" strokeWidth="3.5" />
            </Box>
            <Box width="hug" height="hug">
              <ButtonList>
                <XLogo />
                <LogoInstagram />
                <LogoYouTube />
                <LinkedIn />
              </ButtonList>
            </Box>
          </Box>
          <TextLinkList density="default" hasTitle>
            <Title>Section 1</Title>
            <Slot>
              <TextLink>Link 1</TextLink>
              <TextLink>Link 2</TextLink>
              <TextLink>Link 3</TextLink>
              <TextLink>Link 4</TextLink>
              <TextLink>Link 5</TextLink>
              <TextLink>Link 6</TextLink>
              <TextLink>Link 7</TextLink>
            </Slot>
          </TextLinkList>
          <TextLinkList density="default" hasTitle>
            <Title>Section 2</Title>
            <Slot>
              <TextLink>Link 1</TextLink>
              <TextLink>Link 2</TextLink>
              <TextLink>Link 3</TextLink>
              <TextLink>Link 4</TextLink>
              <TextLink>Link 5</TextLink>
              <TextLink>Link 6</TextLink>
              <TextLink>Link 7</TextLink>
            </Slot>
          </TextLinkList>
          <TextLinkList density="default" hasTitle>
            <Title>Section 3</Title>
            <Slot>
              <TextLink>Link 1</TextLink>
              <TextLink>Link 2</TextLink>
              <TextLink>Link 3</TextLink>
              <TextLink>Link 4</TextLink>
              <TextLink>Link 5</TextLink>
              <TextLink>Link 6</TextLink>
              <TextLink>Link 7</TextLink>
            </Slot>
          </TextLinkList>
        </Flex>
      </Footer>
    </Box>
  );
}
