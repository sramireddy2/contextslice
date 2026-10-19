import { IconStar, IconX } from "icons";
import { Box, Button, Card, CardGrid, Footer, Header, Hero, TextContent } from "compositions";
import { Layout } from "layout";

export default function Screen() {
  return (
    <Layout>
      <Header>
        <Box>
          <Box>
            <IconStar size="24" />
          </Box>
        </Box>
        <Box>
          <Button>Sign in</Button>
          <Button variant="primary" size="small">
            Register
          </Button>
        </Box>
      </Header>
      <Hero title="Title" subtitle="Subtitle" />
      <Box>
        <CardGrid>
          <TextContent heading="Heading" subheading="Subheading">
            <Text>Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.</Text>
          </TextContent>
          <Card heading="Title" icon={<IconStar size="24" />} body="Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story." asset={true} />
          <Card heading="Title" icon={<IconStar size="24" />} body="Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story." asset={true} />
          <Card heading="Title" icon={<IconStar size="24" />} body="Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story." asset={true} />
        </CardGrid>
        <CardGrid>
          <TextContent heading="Heading" subheading="Subheading">
            <Text>Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.</Text>
          </TextContent>
          <Card heading="Title" icon={<IconStar size="24" />} body="Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story." />
          <Card heading="Title" icon={<IconStar size="24" />} body="Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story." />
          <Card heading="Title" icon={<IconStar size="24" />} body="Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story." />
        </CardGrid>
      </Box>
      <Footer>
        <Box>
          <Box>
            <IconStar size="24" />
          </Box>
        </Box>
        <Box>
          <Button>Button 1</Button>
          <Button>Button 2</Button>
          <Button>Button 3</Button>
        </Box>
      </Footer>
    </Layout>
  );
}
