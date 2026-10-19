import { IconStar, IconX } from "icons";
import { Box, Button, Form, Input, Text } from "compositions";
import { Flex, Grid } from "layout";

export default function Screen() {
  return (
    <Box
      backgroundColor="color-background-default-secondary"
      padding="size-space-4000 size-space-600 size-space-4000 size-space-600"
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="100%"
      height="100vh"
    >
      <Box
        backgroundColor="color-background-default-default"
        padding="size-space-800"
        borderRadius="size-radius-200"
        width="338px"
        display="flex"
        flexDirection="column"
        gap="size-space-300"
      >
        <Text
          color="color-text-default-default"
          style="Title Hero"
          textAlign="center"
        >
          Title
        </Text>
        <Text
          color="color-text-default-secondary"
          style="Subtitle"
          textAlign="center"
        >
          Subtitle
        </Text>
        <Form>
          <Input
            type="email"
            placeholder="you@example.com"
            label="Email address"
            backgroundColor="color-background-default-default"
            borderColor="color-border-default-default"
            borderRadius="size-radius-200"
            padding="size-space-300 size-space-400 size-space-300 size-space-400"
            width="100%"
          />
          <Button
            variant="primary"
            size="medium"
            label="Submit"
            iconEnd={<IconX />}
            backgroundColor="color-background-brand-default"
            borderColor="color-border-brand-default"
            borderRadius="size-radius-200"
            padding="size-space-300"
            width="100%"
          />
        </Form>
      </Box>
    </Box>
  );
}
