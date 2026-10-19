import { Box, Button, Flex, Input, Text } from "primitives";
import { NavigationPill, TextLinkList } from "compositions";
import { Icon } from "icons";

export default function Screen() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      gap="var(--sds-size-space-800)"
      padding="var(--sds-size-space-4000) var(--sds-size-space-600) var(--sds-size-space-4000) var(--sds-size-space-600)"
      backgroundColor="var(--sds-color-background-default-secondary)"
    >
      <Flex
        display="flex"
        flexDirection="row"
        gap="var(--sds-size-space-600)"
        alignItems="center"
        justifyContent="center"
        width="100%"
      >
        <Box display="flex" flexDirection="row" alignItems="center" gap="24px">
          <Box display="flex" flexDirection="row" alignItems="center" width="40px">
            <Icon name="Figma" width="23.33" height="35" stroke="var(--sds-color-icon-default-default)" strokeWidth="3.5" />
          </Box>
        </Box>
        <NavigationPillList>
          <NavigationPill>Products</NavigationPill>
          <NavigationPill>Solutions</NavigationPill>
          <NavigationPill>Community</NavigationPill>
          <NavigationPill>Resources</NavigationPill>
          <NavigationPill>Pricing</NavigationPill>
          <NavigationPill>Contact</NavigationPill>
        </NavigationPillList>
        <Box display="flex" flexDirection="row" alignItems="center" gap="var(--sds-size-space-300)" width="178px">
          <Button variant="primary" size="small">
            Sign in
          </Button>
          <Button variant="secondary" size="small">
            Register
          </Button>
        </Box>
      </Flex>
      <Box
        display="flex"
        flexDirection="column"
        gap="var(--sds-size-space-800)"
        alignItems="center"
        justifyContent="center"
        width="100%"
      >
        <Box
          display="flex"
          flexDirection="column"
          gap="var(--sds-size-space-200)"
          alignItems="center"
          justifyContent="center"
          width="100%"
        >
          <Text variant="titleHero">Title</Text>
          <Text variant="subtitle">Subtitle</Text>
        </Box>
        <Box
          display="flex"
          flexDirection="row"
          gap="var(--sds-size-space-300)"
          alignItems="center"
          justifyContent="center"
          width="338px"
        >
          <Input
            type="email"
            placeholder="you@example.com"
            variant="default"
            size="medium"
            style={{ width: "100%" }}
          />
          <Button variant="primary" size="medium">
            Submit
          </Button>
        </Box>
      </Box>
      <Box
        display="flex"
        flexDirection="row"
        gap="var(--sds-size-space-400)"
        alignItems="center"
        justifyContent="center"
        width="100%"
        padding="var(--sds-size-space-800) var(--sds-size-space-800) var(--sds-size-space-4000) var(--sds-size-space-800)"
        backgroundColor="var(--sds-color-background-default-default)"
        border="1px solid var(--sds-color-border-default-default)"
      >
        <Box display="flex" flexDirection="column" gap="var(--sds-size-space-600)" width="262px">
          <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center" width="100%">
            <Box display="flex" flexDirection="row" alignItems="center" width="23.33px">
              <Icon name="Figma" width="23.33" height="35" stroke="var(--sds-color-icon-default-default)" strokeWidth="3.5" />
            </Box>
          </Box>
          <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center" width="100%">
            <TextLinkList density="default" hasTitle>
              <TextLinkList.Item>UI design</TextLinkList.Item>
              <TextLinkList.Item>UX design</TextLinkList.Item>
              <TextLinkList.Item>Wireframing</TextLinkList.Item>
              <TextLinkList.Item>Diagramming</TextLinkList.Item>
              <TextLinkList.Item>Brainstorming</TextLinkList.Item>
              <TextLinkList.Item>Online whiteboard</TextLinkList.Item>
              <TextLinkList.Item>Team collaboration</TextLinkList.Item>
            </TextLinkList>
          </Box>
        </Box>
        <Box display="flex" flexDirection="column" gap="var(--sds-size-space-300)" width="262px">
          <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center" width="100%">
            <TextLinkList density="default" hasTitle>
              <TextLinkList.Item>Design</TextLinkList.Item>
              <TextLinkList.Item>Prototyping</TextLinkList.Item>
              <TextLinkList.Item>Development features</TextLinkList.Item>
              <TextLinkList.Item>Design systems</TextLinkList.Item>
              <TextLinkList.Item>Design process</TextLinkList.Item>
              <TextLinkList.Item>FigJam</TextLinkList.Item>
            </TextLinkList>
          </Box>
        </Box>
        <Box display="flex" flexDirection="column" gap="var(--sds-size-space-300)" width="262px">
          <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center" width="100%">
            <TextLinkList density="default" hasTitle>
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
      </Box>
    </Box>
  );
}
