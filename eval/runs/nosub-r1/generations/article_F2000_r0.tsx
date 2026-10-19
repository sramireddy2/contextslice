import { Box, Button, Card, Flex, Heading, Image, Link, Text } from "primitives";
import { NavigationPill, NavigationPillList } from "compositions";
import { IconX, IconStar } from "icons";
import { useTheme } from "react";

export default function Screen() {
  const theme = useTheme();

  return (
    <Box
      bg={theme.colors.backgroundDefaultDefault}
      px={theme.sizes.space4000}
      py={theme.sizes.space1600}
    >
      <Flex
        direction="column"
        gap={theme.sizes.space600}
        px={theme.sizes.space800}
        align="center"
        bg={theme.colors.backgroundDefaultDefault}
        border={theme.colors.borderDefaultDefault}
        borderWidth={1}
        borderRadius={theme.sizes.radius200}
        clip
      >
        <Flex direction="row" gap={24} align="center">
          <Box w={40} h="auto">
            <IconX stroke={theme.colors.iconDefaultDefault} strokeWidth={3.5} />
          </Box>
          <NavigationPillList direction="row" wrap gap={theme.sizes.space200} align="max" justify="min">
            <NavigationPill label="Products" state="active" />
            <NavigationPill label="Solutions" state="default" />
            <NavigationPill label="Community" state="default" />
            <NavigationPill label="Resources" state="default" />
            <NavigationPill label="Pricing" state="default" />
            <NavigationPill label="Contact" state="default" />
          </NavigationPillList>
        </Flex>
        <Flex direction="row" gap={theme.sizes.space300} align="center" w={178}>
          <Button variant="neutral" state="default" size="small" iconEnd={IconStar} label="Sign in" />
          <Button variant="primary" state="default" size="small" iconEnd={IconStar} label="Register" />
        </Flex>
      </Flex>
      <Box
        bg={theme.colors.backgroundDefaultSecondary}
        px={theme.sizes.space4000}
        py={theme.sizes.space1600}
        align="center"
      >
        <Flex direction="column" gap={theme.sizes.space200} align="center">
          <Heading level={1} style="Title Hero" color={theme.colors.textDefaultDefault}>
            Title
          </Heading>
          <Text style="Subtitle" color={theme.colors.textDefaultSecondary}>
            Subtitle
          </Text>
        </Flex>
      </Box>
      <Box bg={theme.colors.slate200} px={theme.sizes.space10} py={theme.sizes.space10}>
        <Flex direction="column" gap={10} w="full" h="auto" />
      </Box>
      <Flex
        direction="row"
        gap={theme.sizes.space1200}
        px={theme.sizes.space1600}
        w="full"
        h={478}
        bg={theme.colors.backgroundDefaultDefault}
        opacity={0.8}
      >
        <Box w="full" h="full" bg={theme.colors.slate200} clip />
        <Box w="full" h="full" bg={theme.colors.slate200} clip />
      </Flex>
      <Flex
        direction="row"
        gap={theme.sizes.space1200}
        px={theme.sizes.space1600}
        w="full"
        h={478}
        bg={theme.colors.backgroundDefaultDefault}
        opacity={0.8}
      >
        <Box w="full" h="full" bg={theme.colors.slate200} clip />
        <Box w="full" h="full" bg={theme.colors.slate200} clip />
      </Flex>
      <Box
        bg={theme.colors.backgroundDefaultDefault}
        px={theme.sizes.space800}
        py={theme.sizes.space800}
        border={theme.colors.borderDefaultDefault}
        borderWidth={1}
        borderRadius={theme.sizes.radius200}
        clip
      >
        <Flex direction="column" gap={theme.sizes.space600} w={262} h="auto">
          <Text style="Body Base" color={theme.colors.textDefaultDefault}>
            Footer Content
          </Text>
        </Flex>
      </Box>
    </Box>
  );
}
