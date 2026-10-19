import { Box, Button, Form, Input, Text, VStack } from "primitives";
import { IconMail, IconPhone } from "icons";
import { useTheme } from "react";

export default function Screen() {
  const theme = useTheme();

  return (
    <Box
      bg={theme.colors.backgroundDefaultSecondary}
      p={{ x: "sds-size-space-600", y: "sds-size-space-800" }}
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="100%"
    >
      <Box
        bg={theme.colors.backgroundDefaultDefault}
        border={theme.colors.borderDefaultDefault}
        borderRadius="sds-size-radius-200"
        p="sds-size-space-600"
        width="100%"
        maxWidth="1200px"
      >
        <VStack gap="sds-size-space-600">
          <Text
            color={theme.colors.textBrandOnBrandTertiary}
            style="Title Hero"
            textAlign="center"
          >
            Contact Us
          </Text>
          <Text
            color={theme.colors.textBrandOnBrandTertiary}
            style="Subtitle"
            textAlign="center"
          >
            Get in touch with us
          </Text>
          <Form>
            <Input
              label="Name"
              placeholder="Enter your name"
              icon={<IconMail />}
              required
            />
            <Input
              label="Surname"
              placeholder="Enter your surname"
              icon={<IconPhone />}
              required
            />
            <Button
              variant="primary"
              size="medium"
              label="Submit"
              type="submit"
            />
          </Form>
        </VStack>
      </Box>
    </Box>
  );
}
