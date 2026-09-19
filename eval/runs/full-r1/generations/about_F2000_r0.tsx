import { Box, Button, Card, Flex, Grid, Heading, Image, Link, Text } from "primitives";
import { NavigationPillList, NavigationPill } from "compositions";
import { Header, HeroBasic, PanelImageDouble, CardGridContentList } from "layout";
import { IconX, IconStar } from "icons";
import { useNavigate } from "react-router-dom";

export default function Screen() {
  const navigate = useNavigate();

  return (
    <Box>
      <Header>
        <NavigationPillList>
          <NavigationPill label="Products" state="active" />
          <NavigationPill label="Solutions" state="default" />
          <NavigationPill label="Community" state="default" />
          <NavigationPill label="Resources" state="default" />
          <NavigationPill label="Pricing" state="default" />
          <NavigationPill label="Contact" state="default" />
        </NavigationPillList>
        <Button variant="neutral" state="default" size="small" onClick={() => navigate("/login")}>
          Sign in
        </Button>
        <Button variant="primary" state="default" size="small" onClick={() => navigate("/register")}>
          Register
        </Button>
      </Header>
      <HeroBasic title="Title" subtitle="Subtitle" />
      <PanelImageDouble>
        <Image src="/path/to/image1.jpg" alt="Image 1" />
        <Image src="/path/to/image2.jpg" alt="Image 2" />
      </PanelImageDouble>
      <CardGridContentList>
        <TextContentHeading heading="Heading" subheading="Subheading" />
        <Grid gap="var(--sds-size-space-600)" columns="repeat(2, 1fr)">
          <Card title="Card Title" description="Card Description" />
          <Card title="Card Title" description="Card Description" />
          <Card title="Card Title" description="Card Description" />
          <Card title="Card Title" description="Card Description" />
        </Grid>
      </CardGridContentList>
    </Box>
  );
}
