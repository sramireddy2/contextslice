import { Box, Text, Link, Card } from 'primitives';
import { NavigationPillList, TextLinkList } from 'compositions';
import { Flex, Grid } from 'layout';

export default function Screen() {
  return (
    <Box>
      <NavigationPillList>
        <NavigationPillList.Item>Products</NavigationPillList.Item>
        <NavigationPillList.Item>Solutions</NavigationPillList.Item>
        <NavigationPillList.Item>Community</NavigationPillList.Item>
        <NavigationPillList.Item>Resources</NavigationPillList.Item>
        <NavigationPillList.Item>Pricing</NavigationPillList.Item>
        <NavigationPillList.Item>Contact</NavigationPillList.Item>
      </NavigationPillList>

      <Box padding="var(--sds-size-space-600)">
        <Text.ContentTitle title="Title" subtitle="Subtitle" align="center" />
      </Box>

      <Box padding="var(--sds-size-space-600)">
        <Text.Body>Body text goes here...</Text.Body>
      </Box>

      <Grid columns="repeat(3, 1fr)" gap="var(--sds-size-space-400)">
        <Card>
          <Text.Body>Card 1</Text.Body>
        </Card>
        <Card>
          <Text.Body>Card 2</Text.Body>
        </Card>
        <Card>
          <Text.Body>Card 3</Text.Body>
        </Card>
      </Grid>

      <Box padding="var(--sds-size-space-600)">
        <TextLinkList title="Use cases">
          <TextLinkList.Item>UI design</TextLinkList.Item>
          <TextLinkList.Item>UX design</TextLinkList.Item>
          <TextLinkList.Item>Wireframing</TextLinkList.Item>
          <TextLinkList.Item>Diagramming</TextLinkList.Item>
          <TextLinkList.Item>Brainstorming</TextLinkList.Item>
          <TextLinkList.Item>Online whiteboard</TextLinkList.Item>
          <TextLinkList.Item>Team collaboration</TextLinkList.Item>
        </TextLinkList>
      </Box>

      <Box padding="var(--sds-size-space-600)">
        <TextLinkList title="Explore">
          <TextLinkList.Item>Design</TextLinkList.Item>
          <TextLinkList.Item>Prototyping</TextLinkList.Item>
          <TextLinkList.Item>Development features</TextLinkList.Item>
          <TextLinkList.Item>Design systems</TextLinkList.Item>
          <TextLinkList.Item>Collaboration features</TextLinkList.Item>
          <TextLinkList.Item>Design process</TextLinkList.Item>
          <TextLinkList.Item>FigJam</TextLinkList.Item>
        </TextLinkList>
      </Box>

      <Box padding="var(--sds-size-space-600)">
        <TextLinkList title="Resources">
          <TextLinkList.Item>Blog</TextLinkList.Item>
          <TextLinkList.Item>Best practices</TextLinkList.Item>
          <TextLinkList.Item>Colors</TextLinkList.Item>
          <TextLinkList.Item>Color wheel</TextLinkList.Item>
          <TextLinkList.Item>Support</TextLinkList.Item>
          <TextLinkList.Item>Developers</TextLinkList.Item>
          <TextLinkList.Item>Resource library</TextLinkList.Item>
        </TextLinkList>
      </Box>
    </Box>
  );
}
