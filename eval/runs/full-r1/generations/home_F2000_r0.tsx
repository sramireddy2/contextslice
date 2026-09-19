import { Box, Button, Flex, Heading, Text } from "primitives";
import { NavigationPillList, NavigationPill } from "compositions";
import { Header, HeaderAuth } from "layout";
import { IconX, IconStar } from "icons";
import { useTheme } from "react";

export default function Screen() {
  const theme = useTheme();

  return (
    <Box style={{ background: theme.colors.backgroundDefaultDefault }}>
      <Header>
        <Flex gap={theme.sizes.space600} align="center">
          <Box>Logo</Box>
          <NavigationPillList>
            <NavigationPill label="Products" state="active" />
            <NavigationPill label="Solutions" />
            <NavigationPill label="Community" />
            <NavigationPill label="Resources" />
            <NavigationPill label="Pricing" />
            <NavigationPill label="Contact" />
          </NavigationPillList>
        </Flex>
        <HeaderAuth>
          <Button variant="neutral" size="small">
            Sign in
          </Button>
          <Button variant="primary" size="small">
            Register
          </Button>
        </HeaderAuth>
      </Header>
      <Box style={{ background: theme.colors.backgroundDefaultSecondary, padding: `${theme.sizes.space4000}/${theme.sizes.space600}/${theme.sizes.space4000}/${theme.sizes.space600}` }}>
        <Flex direction="column" gap={theme.sizes.space200} align="center">
          <Box>
            <Heading level={1} style={{ color: theme.colors.textDefaultDefault, fontSize: theme.sizes.fontSizeTitleHero }}>Title</Heading>
            <Text style={{ color: theme.colors.textDefaultSecondary, fontSize: theme.sizes.fontSizeSubtitle }}>Subtitle</Text>
          </Box>
          <Flex gap={theme.sizes.space400} align="center">
            <Button variant="neutral" size="medium">
              Button
            </Button>
            <Button variant="primary" size="medium">
              Button
            </Button>
          </Flex>
        </Flex>
      </Box>
      <Box style={{ background: theme.colors.slate200, padding: theme.sizes.space200 }}>
        <Text>Section Content</Text>
      </Box>
    </Box>
  );
}
