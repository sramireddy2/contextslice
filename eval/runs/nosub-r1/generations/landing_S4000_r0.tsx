import { Box, Button, Card, Flex, Grid, Heading, Link, Text, VStack } from "primitives";
import { NavigationPillList, TextLinkList } from "compositions";
import { Icon } from "icons";
import { useTheme } from "react";

export default function Screen() {
  const theme = useTheme();

  return (
    <Box
      display="flex"
      flexDirection="column"
      width="100%"
      height="100vh"
      backgroundColor={theme.colors.background.default.default}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        padding={theme.sizes.space[800]}
        borderBottom={`1px solid ${theme.colors.border.default.default}`}
      >
        <Box display="flex" alignItems="center">
          <Icon name="Figma" width={23.33} height={35} stroke={theme.colors.icon.default.default} strokeWidth={3.5} />
        </Box>
        <NavigationPillList>
          <NavigationPillList.Item>Products</NavigationPillList.Item>
          <NavigationPillList.Item>Solutions</NavigationPillList.Item>
          <NavigationPillList.Item>Community</NavigationPillList.Item>
          <NavigationPillList.Item>Resources</NavigationPillList.Item>
          <NavigationPillList.Item>Pricing</NavigationPillList.Item>
          <NavigationPillList.Item>Contact</NavigationPillList.Item>
        </NavigationPillList>
        <Box display="flex" gap={theme.sizes.space[300]}>
          <Button variant="default">Sign in</Button>
          <Button variant="brand">Register</Button>
        </Box>
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        paddingX={theme.sizes.space[4000]}
        paddingY={theme.sizes.space[600]}
        backgroundColor={theme.colors.background.utilities.scrim}
      >
        <Box display="flex" flexDirection="column" alignItems="center" gap={theme.sizes.space[200]}>
          <Heading as="h1" variant="hero">
            Title
          </Heading>
          <Text variant="subtitle">
            Subtitle
          </Text>
        </Box>
        <Box display="flex" gap={theme.sizes.space[400]}>
          <Button variant="default">Button</Button>
          <Button variant="brand">Button</Button>
        </Box>
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        padding={theme.sizes.space[1600]}
        backgroundColor={theme.colors.background.default.default}
        opacity={0.8}
      >
        <Box display="flex" alignItems="center" gap={theme.sizes.space[1200]}>
          <Box display="flex" alignItems="center" justifyContent="center" width="100%" height="100%" backgroundColor={theme.colors.slate[200]} />
        </Box>
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        padding={theme.sizes.space[1600]}
        backgroundColor={theme.colors.background.default.default}
      >
        <Box display="flex" flexDirection="column" alignItems="start" gap={theme.sizes.space[200]}>
          <Heading as="h2" variant="heading">
            Heading
          </Heading>
          <Text variant="subheading">
            Subheading
          </Text>
        </Box>
        <Grid
          display="flex"
          gridTemplateColumns="repeat(auto-fill, minmax(320px, 1fr))"
          gap={theme.sizes.space[1600]}
          width="100%"
        >
          <Card>
            <Box display="flex" alignItems="center" justifyContent="center" width="32px" height="32px" backgroundColor={theme.colors.slate[200]} />
            <Box display="flex" flexDirection="column" gap={theme.sizes.space[400]}>
              <Heading as="h3" variant="heading">
                Title
              </Heading>
            </Box>
          </Card>
          <Card>
            <Box display="flex" alignItems="center" justifyContent="center" width="32px" height="32px" backgroundColor={theme.colors.slate[200]} />
            <Box display="flex" flexDirection="column" gap={theme.sizes.space[400]}>
              <Heading as="h3" variant="heading">
                Title
              </Heading>
            </Box>
          </Card>
          <Card>
            <Box display="flex" alignItems="center" justifyContent="center" width="32px" height="32px" backgroundColor={theme.colors.slate[200]} />
            <Box display="flex" flexDirection="column" gap={theme.sizes.space[400]}>
              <Heading as="h3" variant="heading">
                Title
              </Heading>
            </Box>
          </Card>
        </Grid>
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        paddingX={theme.sizes.space[800]}
        paddingY={theme.sizes.space[4000]}
        borderBottom={`1px solid ${theme.colors.border.default.default}`}
        backgroundColor={theme.colors.background.default.default}
      >
        <Box display="flex" alignItems="center" gap={theme.sizes.space[600]}>
          <Box display="flex" alignItems="center">
            <Icon name="Figma" width={23.33} height={35} stroke={theme.colors.icon.default.default} strokeWidth={3.5} />
          </Box>
          <Box display="flex" flexDirection="row" gap={theme.sizes.space[400]}>
            <Box display="flex" alignItems="center" justifyContent="center" width="23.98px" height="24px" backgroundColor={theme.colors.slate[200]} />
            <Box display="flex" alignItems="center" justifyContent="center" width="24px" height="24px" backgroundColor={theme.colors.slate[200]} />
            <Box display="flex" alignItems="center" justifyContent="center" width="24px" height="18px" backgroundColor={theme.colors.slate[200]} />
            <Box display="flex" alignItems="center" justifyContent="center" width="24px" height="24px" backgroundColor={theme.colors.slate[200]} />
          </Box>
        </Box>
        <Box display="flex" flexDirection="row" gap={theme.sizes.space[16]}>
          <TextLinkList>
            <TextLinkList.Item>Use cases</TextLinkList.Item>
            <TextLinkList.Item>UI design</TextLinkList.Item>
            <TextLinkList.Item>UX design</TextLinkList.Item>
            <TextLinkList.Item>Wireframing</TextLinkList.Item>
            <TextLinkList.Item>Diagramming</TextLinkList.Item>
            <TextLinkList.Item>Brainstorming</TextLinkList.Item>
            <TextLinkList.Item>Online whiteboard</TextLinkList.Item>
            <TextLinkList.Item>Team collaboration</TextLinkList.Item>
          </TextLinkList>
          <TextLinkList>
            <TextLinkList.Item>Explore</TextLinkList.Item>
            <TextLinkList.Item>Design</TextLinkList.Item>
            <TextLinkList.Item>Prototyping</TextLinkList.Item>
            <TextLinkList.Item>Development features</TextLinkList.Item>
            <TextLinkList.Item>Design systems</TextLinkList.Item>
            <TextLinkList.Item>Collaboration features</TextLinkList.Item>
            <TextLinkList.Item>Design process</TextLinkList.Item>
            <TextLinkList.Item>FigJam</TextLinkList.Item>
          </TextLinkList>
          <TextLinkList>
            <TextLinkList.Item>Resources</TextLinkList.Item>
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
  );
}
