import { IconStar, IconX } from "icons";
import { Header, HeroBasic, CardGridContentList, CardGridImage, Footer } from "compositions";
import { Box, Text } from "primitives";

export default function Screen() {
  return (
    <Box>
      <Header />
      <HeroBasic title="Title" subtitle="Subtitle" />
      <CardGridContentList heading="Heading" subheading="Subheading">
        <Card heading="Title" body="Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story." buttonLabel="Button" />
        <Card heading="Title" body="Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story." buttonLabel="Button" />
        <Card heading="Title" body="Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story." buttonLabel="Button" />
      </CardGridContentList>
      <CardGridImage heading="Heading" subheading="Subheading">
        <Card heading="Title" body="Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story." />
        <Card heading="Title" body="Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story." />
        <Card heading="Title" body="Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story." />
      </CardGridImage>
      <Footer />
    </Box>
  );
}
