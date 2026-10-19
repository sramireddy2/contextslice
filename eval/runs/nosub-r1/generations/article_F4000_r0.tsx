```tsx
import { Box, Button, Card, Flex, Heading, Icon, Link, Text } from 'primitives';
import { NavigationPillList, TextLinkList } from 'compositions';
import { IconX, IconStar } from 'icons';
import { useTheme } from 'react';

export default function Screen() {
  const theme = useTheme();

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={theme.size.space[600]}
      padding={theme.size.space[800]}
      backgroundColor={theme.color.background.default.default}
      width="100%"
      height="100vh"
    >
      <Box
        display="flex"
        flexDirection="row"
        wrap="wrap"
        gap={theme.size.space[200]}
        alignItems="center"
        justifyContent="center"
        width="100%"
      >
        <Box display="flex" alignItems="center" justifyContent="center" width="40px" height="auto">
          <Icon name="Figma" width="23.33" height="35" stroke={theme.color.icon.default.default} strokeWidth="3.5" />
        </Box>
        <NavigationPillList>
          <NavigationPill label="Products" state="active" />
          <NavigationPill label="Solutions" state="default" />
          <NavigationPill label="Community" state="default" />
          <NavigationPill label="Resources" state="default" />
          <NavigationPill label="Pricing" state="default" />
          <NavigationPill label="Contact" state="default" />
        </NavigationPillList>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          width="178px"
          height="auto"
        >
          <Button variant="neutral" state="default" size="small" iconEnd={IconX}>
            Sign in
          </Button>
          <Button variant="primary" state="default" size="small" iconEnd={IconX}>
            Register
          </Button>
        </Box>
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        padding={`${theme.size.space[4000]} ${theme.size.space[1600]} ${theme.size.space[4000]} ${theme.size.space[1600]}`}
        backgroundColor={theme.color.background.default.secondary}
        width="100%"
        height="auto"
      >
        <Box
          display="flex"
          flexDirection="column"
          gap={theme.size.space[200]}
          alignItems="center"
          justifyContent="center"
          width="100%"
        >
          <Heading level={1} style="Title Hero">
            Title
          </Heading>
          <Text style="Subtitle">
            Subtitle
          </Text>
        </Box>
      </Box>

      <Box display="flex" flexDirection="column" gap={10} width="100%" height="auto" backgroundColor={theme.color.slate[200]} />

      <Box
        display="flex"
        flexDirection="row"
        gap={theme.size.space[1200]}
        padding={`${theme.size.space[1600]} ${theme.size.space[1600]} ${theme.size.space[1600]} ${theme.size.space[1600]}`}
        width="100%"
        height="478px"
        backgroundColor={theme.color.background.default.default}
        opacity={0.8}
      >
        <Box display="flex" alignItems="center" justifyContent="center" width="100%" height="100%" backgroundColor={theme.color.slate[200]} clip />
        <Box display="flex" alignItems="center" justifyContent="center" width="100%" height="100%" backgroundColor={theme.color.slate[200]} clip />
      </Box>

      <Box
        display="flex"
        flexDirection="row"
        gap={theme.size.space[1200]}
        padding={`${theme.size.space[1600]} ${theme.size.space[1600]} ${theme.size.space[1600]} ${theme.size.space[1600]}`}
        width="100%"
        height="478px"
        backgroundColor={theme.color.background.default.default}
        opacity={0.8}
      >
        <Box display="flex" alignItems="center" justifyContent="center" width="100%" height="100%" backgroundColor={theme.color.slate[200]} clip />
        <Box display="flex" alignItems="center" justifyContent="center" width="100%" height="100%" backgroundColor={theme.color.slate[200]} clip />
      </Box>

      <Box
        display="flex"
        flexDirection="row"
        wrap="wrap"
        gap={theme.size.space[400]}
        padding={`${theme.size.space[800]} ${theme.size.space[800]} ${theme.size.space[4000]} ${theme.size.space[800]}`}
        width="100%"
        height="auto"
        backgroundColor={theme.color.background.default.default}
        border={`1px solid ${theme.color.border.default.default}`}
      >
        <Box display="flex" flexDirection="column" gap={theme.size.space[600]} width="262px" height="auto">
          <Box display="flex" alignItems="center" justifyContent="center" width="auto" height="auto">
            <Icon name="Figma" width="23.33" height="35" stroke={theme.color.icon.default.default} strokeWidth="3.5" />
          </Box>
          <Box display="flex" flexDirection="row" gap={theme.size.space[400]} alignItems="center" justifyContent="center" width="auto" height="auto">
            <Box display="flex" alignItems="center" justifyContent="center" width="23.98px" height="24px">
              <Icon name="XLogo" width="23.98" height="24" fill={theme.color.icon.default.default} />
            </Box>
            <Box display="flex" alignItems="center" justifyContent="center" width="24px" height="24px" clip>
              <Icon name="LogoInstagram" width="24" height="24" fill={theme.color.icon.default.default} />
            </Box>
            <Box display="flex" alignItems="center" justifyContent="center" width="24px" height="24px" clip>
              <Icon name="LogoYouTube" width="24" height="18" fill={theme.color.icon.default.default} />
            </Box>
            <Box display="flex" alignItems="center" justifyContent="center" width="24px" height="24px" clip>
              <Icon name="LinkedIn" width="24" height="24" fill={theme.color.icon.default.default} />
            </Box>
          </Box>
        </Box>
        <Box display="flex" flexDirection="column" gap={16} width="auto" height="auto">
          <Box display="flex" flexDirection="column" gap={theme.size.space[300]} width="262px" height="auto">
            <Box display="flex" padding="0 0 0 0" width="100%" height="auto">
              <TextStrong>Use cases</TextStrong>
            </Box>
            <Box display="flex" flexDirection="column" gap={12} width="100%" height="auto">
              <TextLinkListItem>UI design</TextLinkListItem>
              <TextLinkListItem>UX design</TextLinkListItem>
              <TextLinkListItem>Wireframing</TextLinkListItem>
              <TextLinkListItem>Diagramming</TextLinkListItem>
              <TextLinkListItem>Brainstorming</TextLinkListItem>
              <TextLinkListItem>Online whiteboard</TextLinkListItem>
              <TextLinkListItem>Team collaboration</TextLinkListItem>
            </Box>
          </Box>
          <Box display="flex" flexDirection="column" gap={theme.size.space[300]} width="262px" height="auto">
            <Box display="flex" padding="0 0 0 0" width="100%" height="auto">
              <TextStrong>Explore</TextStrong>
            </Box>
            <Box display="flex" flexDirection="column" gap={12} width="100%" height="auto">
              <TextLinkListItem>Design</TextLinkListItem>
              <TextLinkListItem>Prototyping</TextLinkListItem>
              <TextLinkListItem>Development features</TextLinkListItem>
              <TextLinkListItem>Design systems</TextLinkListItem>
              <TextLinkListItem>Collaboration features</TextLinkListItem>
              <TextLinkListItem>Design process</TextLinkListItem>
              <TextLinkListItem>FigJam</TextLinkListItem>
            </Box>
          </Box>
          <Box display="flex" flexDirection="column" gap={theme.size.space[300]} width="262px"
