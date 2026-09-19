import { Box, Button, Flex, Heading, Text, VStack } from "primitives";
import { NavigationPill, NavigationPillList } from "compositions";
import { Header, HeaderAuth } from "layout";
import { IconX, IconStar } from "icons";
import { useTheme } from "react";

export default function Screen() {
  const theme = useTheme();

  return (
    <Box bg={theme.colors.background.default.default} px={theme.sizes.space[600]}>
      <Header>
        <Flex gap={theme.sizes.space[600]}>
          <Box w={40} h={35}>
            <IconX fill={theme.colors.icon.default.default} stroke={theme.colors.icon.default.default} strokeWidth={3.5} />
          </Box>
          <NavigationPillList>
            <NavigationPill label="Products" state="active" />
            <NavigationPill label="Solutions" state="default" />
            <NavigationPill label="Community" state="default" />
            <NavigationPill label="Resources" state="default" />
            <NavigationPill label="Pricing" state="default" />
            <NavigationPill label="Contact" state="default" />
          </NavigationPillList>
        </Flex>
        <HeaderAuth state="loggedOut">
          <Button variant="neutral" size="small">
            Sign in
          </Button>
          <Button variant="primary" size="small">
            Register
          </Button>
        </HeaderAuth>
      </Header>
      <Box bg={theme.colors.background.utilities.scrim} px={theme.sizes.space[600]} py={theme.sizes.space[4000]}>
        <VStack gap={theme.sizes.space[800]} align="center">
          <Box>
            <Heading as="h1" size="hero" color={theme.colors.text.utilities.text.onOverlay}>
              Title
            </Heading>
            <Text as="p" size="subtitle" color={theme.colors.text.utilities.text.onOverlay}>
              Subtitle
            </Text>
          </Box>
          <Flex gap={theme.sizes.space[400]} align="center">
            <Button variant="neutral" size="medium">
              Button
            </Button>
            <Button variant="primary" size="medium">
              Button
            </Button>
          </Flex>
        </VStack>
      </Box>
    </Box>
  );
}
