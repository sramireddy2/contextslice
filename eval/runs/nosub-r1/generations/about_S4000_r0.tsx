```tsx
import { Box, Button, Card, Flex, Grid, Heading, Image, Link, Text } from "primitives";
import { NavigationPillList, TextContentTitle, TextContentHeading } from "compositions";
import { Footer } from "layout";
import { Icon } from "icons";

export default function Screen() {
  return (
    <Box>
      <Box
        display="flex"
        flexDirection="column"
        gap="var(--sds-size-space-600)"
        padding="var(--sds-size-space-800)"
        alignItems="center"
        background="var(--sds-color-background-default-default)"
        border="1px solid var(--sds-color-border-default-default)"
      >
        <Box display="flex" gap="24px" alignItems="center">
          <Box width="40px" height="35px">
            <Icon name="Figma" width="23.33" height="35" stroke="var(--sds-color-icon-default-default)" strokeWidth="3.5" />
          </Box>
          <NavigationPillList>
            <NavigationPill label="Products" />
            <NavigationPill label="Solutions" />
            <NavigationPill label="Community" />
            <NavigationPill label="Resources" />
            <NavigationPill label="Pricing" />
            <NavigationPill label="Contact" />
          </NavigationPillList>
        </Box>
        <Box display="flex" gap="var(--sds-size-space-300)" alignItems="center" width="178px">
          <Button>Sign in</Button>
          <Button variant="primary">Register</Button>
        </Box>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        padding="var(--sds-size-space-4000) var(--sds-size-space-1600) var(--sds-size-space-4000) var(--sds-size-space-1600)"
        alignItems="center"
        background="var(--sds-color-background-default-secondary)"
      >
        <TextContentTitle title="Title" subtitle="Subtitle" align="center" />
      </Box>
      <Box
        display="flex"
        flexDirection="row"
        gap="var(--sds-size-space-1200)"
        padding="var(--sds-size-space-1600)"
        alignItems="center"
        background="var(--sds-color-background-default-default)"
        opacity="0.8"
      >
        <Box display="flex" alignItems="center" justifyContent="center" width="100%" height="100%" background="var(--sds-color-slate-200)" />
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        gap="var(--sds-size-space-1200)"
        padding="var(--sds-size-space-1600)"
        alignItems="center"
        background="var(--sds-color-background-default-default)"
      >
        <TextContentHeading heading="Heading" subheading="Subheading" align="start" />
        <Grid templateColumns="repeat(3, 1fr)" gap="var(--sds-size-space-600)">
          <Card>
            <Box display="flex" alignItems="center" justifyContent="center" width="160px" height="160px" background="var(--sds-color-slate-200)" />
            <Box display="flex" flexDirection="column" gap="var(--sds-size-space-400)">
              <Heading level={3}>Title</Heading>
              <Text>Body text for whatever you’d …</Text>
              <Box display="flex" gap="var(--sds-size-space-400)">
                <Button>Button</Button>
              </Box>
            </Box>
          </Card>
          <Card>
            <Box display="flex" alignItems="center" justifyContent="center" width="160px" height="160px" background="var(--sds-color-slate-200)" />
            <Box display="flex" flexDirection="column" gap="var(--sds-size-space-400)">
              <Heading level={3}>Title</Heading>
              <Text>Body text for whatever you’d …</Text>
              <Box display="flex" gap="var(--sds-size-space-400)">
                <Button>Button</Button>
              </Box>
            </Box>
          </Card>
          <Card>
            <Box display="flex" alignItems="center" justifyContent="center" width="160px" height="160px" background="var(--sds-color-slate-200)" />
            <Box display="flex" flexDirection="column" gap="var(--sds-size-space-400)">
              <Heading level={3}>Title</Heading>
              <Text>Body text for whatever you’d …</Text>
              <Box display="flex" gap="var(--sds-size-space-400)">
                <Button>Button</Button>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        gap="var(--sds-size-space-1200)"
        padding="var(--sds-size-space-1600)"
        alignItems="center"
        background="var(--sds-color-background-default-default)"
      >
        <TextContentHeading heading="Heading" subheading="Subheading" align="start" />
        <Box display="flex" flexDirection="row" wrap gap="var(--sds-size-space-1200)" alignItems="center" width="100%">
          <Box display="flex" flexDirection="column" gap="16px" width="262px">
            <Box display="flex" gap="var(--sds-size-space-600)" width="100%">
              <Box display="flex" alignItems="center" justifyContent="center" width="23.33px" height="35px">
                <Icon name="Figma" width="23.33" height="35" stroke="var(--sds-color-icon-default-default)" strokeWidth="3.5" />
              </Box>
              <Box display="flex" flexDirection="row" gap="var(--sds-size-space-400)" alignItems="center" width="100%">
                <Link>UI design</Link>
                <Link>UX design</Link>
                <Link>Wireframing</Link>
                <Link>Diagramming</Link>
                <Link>Brainstorming</Link>
                <Link>Online whiteboard</Link>
                <Link>Team collaboration</Link>
              </Box>
            </Box>
            <Box display="flex" flexDirection="column" gap="12px" width="100%">
              <Heading level={4}>Use cases</Heading>
              <Link>UI design</Link>
              <Link>UX design</Link>
              <Link>Wireframing</Link>
              <Link>Diagramming</Link>
              <Link>Brainstorming</Link>
              <Link>Online whiteboard</Link>
              <Link>Team collaboration</Link>
            </Box>
          </Box>
          <Box display="flex" flexDirection="column" gap="16px" width="262px">
            <Box display="flex" gap="var(--sds-size-space-600)" width="100%">
              <Box display="flex" alignItems="center" justifyContent="center" width="23.33px" height="35px">
                <Icon name="Figma" width="23.33" height="35" stroke="var(--sds-color-icon-default-default)" strokeWidth="3.5" />
              </Box>
              <Box display="flex" flexDirection="row" gap="var(--sds-size-space-400)" alignItems="center" width="100%">
                <Link>Design</Link>
                <Link>Prototyping</Link>
                <Link>Development features</Link>
                <Link>Design systems</Link>
                <Link>Collaboration features</Link>
                <Link>Design process</Link>
                <Link>FigJam</Link>
              </Box>
            </Box>
            <Box display="flex" flexDirection="column" gap="12px" width="100%">
              <Heading level={4}>Explore</Heading>
              <Link>Design</Link>
              <Link>Prototyping</Link>
              <Link>Development features</Link>
              <Link>Design systems</Link>
              <Link>Collaboration features</Link>
              <Link>Design process</Link>
              <Link>FigJam</Link>
            </Box>
          </Box>
          <Box display="flex" flexDirection="column" gap="16px" width="262px">
            <Box display="flex" gap="var(--sds-size-space-600)" width="100%">
              <Box display="flex" alignItems="center" justifyContent="center" width="23.33px" height="35px">
                <Icon name="Figma"
