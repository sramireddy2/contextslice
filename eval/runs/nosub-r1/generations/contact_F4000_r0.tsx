import { Box, Button, Form, Input, Textarea, Text } from 'primitives';
import { NavigationPillList, NavigationPill } from 'compositions';
import { Header, Footer } from 'layout';
import { IconX, IconStar } from 'icons';

export default function Screen() {
  return (
    <Box>
      <Header>
        <NavigationPillList>
          <NavigationPill label="Products" />
          <NavigationPill label="Solutions" />
          <NavigationPill label="Community" />
          <NavigationPill label="Resources" />
          <NavigationPill label="Pricing" />
          <NavigationPill label="Contact" />
        </NavigationPillList>
        <Button variant="neutral" label="Sign in" />
        <Button variant="primary" label="Register" />
      </Header>
      <Box>
        <Text variant="title-hero">Title</Text>
        <Text variant="subtitle">Subtitle</Text>
      </Box>
      <Form>
        <Input label="Name" placeholder="Value" />
        <Input label="Surname" placeholder="Value" />
        <Input label="Email" placeholder="Value" />
        <Textarea label="Message" placeholder="Value" />
        <Button variant="primary" label="Submit" />
      </Form>
      <Footer>
        <Box>
          <Box>
            <Text variant="strong">Use cases</Text>
            <Box>
              <Text>UI design</Text>
              <Text>UX design</Text>
              <Text>Wireframing</Text>
              <Text>Diagramming</Text>
              <Text>Brainstorming</Text>
              <Text>Online whiteboard</Text>
              <Text>Team collaboration</Text>
            </Box>
          </Box>
          <Box>
            <Text variant="strong">Explore</Text>
            <Box>
              <Text>Design</Text>
              <Text>Prototyping</Text>
              <Text>Development features</Text>
              <Text>Design systems</Text>
              <Text>Collaboration features</Text>
            </Box>
          </Box>
        </Box>
      </Footer>
    </Box>
  );
}
