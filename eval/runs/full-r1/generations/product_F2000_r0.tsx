import { Box, Button, Flex, Grid, Heading, Image, Text, Tag } from "primitives";
import { NavigationPill, NavigationPillList } from "compositions";
import { IconStar, IconX } from "icons";
import { useTheme } from "react";

export default function Screen() {
  const theme = useTheme();

  return (
    <Box
      bg={theme.colors.backgroundDefaultDefault}
      px={theme.sizes.space1600}
      py={theme.sizes.space800}
    >
      <Flex
        gap={theme.sizes.space600}
        align="center"
        justify="space-between"
        w="full"
      >
        <Flex gap={24} align="center">
          <Box w={40} h="full">
            <IconStar stroke={theme.colors.iconDefaultDefault} strokeW={3.5} />
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
        <Flex gap={theme.sizes.space300} align="center">
          <Button
            variant="neutral"
            state="default"
            size="small"
            label="Sign in"
            iconEnd={IconStar}
          />
          <Button
            variant="primary"
            state="default"
            size="small"
            label="Register"
            iconEnd={IconStar}
          />
        </Flex>
      </Flex>
      <Flex
        gap={theme.sizes.space600}
        align="center"
        justify="space-between"
        w="full"
      >
        <Box w="full" h="full" bg={theme.colors.slate200} />
        <Flex gap={theme.sizes.space600} align="center" justify="center" w="full">
          <Box w="full">
            <Heading level={1}>Text Heading</Heading>
            <Flex gap={theme.sizes.space400} align="center" justify="center" w="full">
              <Flex gap={theme.sizes.space100} align="center" justify="center" w="full">
                <Tag scheme="positive" state="default" variant="secondary">
                  Tag
                </Tag>
                <TextPrice price={50} currency="$" />
              </Flex>
            </Flex>
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
}

function TextPrice({ price, currency }: { price: number; currency: string }) {
  return (
    <Flex align="center" justify="center">
      <Text
        fontFamily={theme.typography.titlePageFontFamily}
        fontSize={theme.typography.subtitleSizeSmall}
        fontWeight={theme.typography.titlePageFontWeight}
      >
        {currency}
      </Text>
      <Text
        fontFamily={theme.typography.titlePageFontFamily}
        fontSize={theme.typography.titlePageSizeBase}
        fontWeight={theme.typography.titlePageFontWeight}
      >
        {price}
      </Text>
    </Flex>
  );
}
