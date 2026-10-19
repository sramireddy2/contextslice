import { Box, Button, Form, Input, Textarea, Text } from "primitives";
import { Flex, Grid, Stack } from "layout";
import { Icon } from "icons";
import { useTheme } from "react";

export default function Screen() {
  const theme = useTheme();

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={theme.sds.size.space[400]}
      padding={theme.sds.size.space[600]}
      backgroundColor={theme.sds.color.background.default.secondary}
      width="100%"
      height="100vh"
    >
      <Flex
        display="flex"
        flexDirection="row"
        gap={theme.sds.size.space[600]}
        alignItems="center"
        justifyContent="center"
        width="100%"
        padding={theme.sds.size.space[800]}
        backgroundColor={theme.sds.color.background.default.primary}
        border={`1px solid ${theme.sds.color.border.default.primary}`}
      >
        <Flex
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
        >
          <Icon name="figma" width={23.33} height={35} color={theme.sds.color.icon.default.primary} />
        </Flex>
        <Flex
          display="flex"
          flexDirection="row"
          gap={8}
          alignItems="center"
          justifyContent="center"
        >
          <Text>Products</Text>
          <Text>Solutions</Text>
          <Text>Community</Text>
          <Text>Resources</Text>
          <Text>Pricing</Text>
          <Text>Contact</Text>
        </Flex>
        <Flex
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
        >
          <Button variant="primary" size="small">
            Sign in
          </Button>
          <Button variant="secondary" size="small">
            Register
          </Button>
        </Flex>
      </Flex>
      <Flex
        display="flex"
        flexDirection="column"
        gap={theme.sds.size.space[800]}
        alignItems="center"
        justifyContent="center"
        width="100%"
        padding={theme.sds.size.space[4000]}
        backgroundColor={theme.sds.color.background.default.secondary}
      >
        <Stack
          display="flex"
          flexDirection="column"
          gap={theme.sds.size.space[200]}
          alignItems="center"
          justifyContent="center"
          width="100%"
        >
          <Text variant="titleHero">Title</Text>
          <Text variant="subtitle">Subtitle</Text>
        </Stack>
        <Form>
          <Input
            label="Name"
            placeholder="Value"
            variant="default"
            size="medium"
          />
          <Input
            label="Surname"
            placeholder="Value"
            variant="default"
            size="medium"
          />
          <Input
            label="Email"
            placeholder="Value"
            variant="default"
            size="medium"
          />
          <Textarea
            label="Message"
            placeholder="Value"
            variant="default"
            size="medium"
          />
          <Button variant="primary" size="large">
            Submit
          </Button>
        </Form>
      </Flex>
      <Flex
        display="flex"
        flexDirection="row"
        gap={theme.sds.size.space[400]}
        alignItems="center"
        justifyContent="center"
        width="100%"
        padding={theme.sds.size.space[800]}
        backgroundColor={theme.sds.color.background.default.primary}
        border={`1px solid ${theme.sds.color.border.default.primary}`}
      >
        <Flex
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
        >
          <Icon name="figma" width={23.33} height={35} color={theme.sds.color.icon.default.primary} />
        </Flex>
        <Flex
          display="flex"
          flexDirection="row"
          gap={theme.sds.size.space[400]}
          alignItems="center"
          justifyContent="center"
        >
          <Flex
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
          >
            <Icon name="xLogo" width={23.98} height={24} color={theme.sds.color.icon.default.primary} />
          </Flex>
          <Flex
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
          >
            <Icon name="logoInstagram" width={24} height={24} color={theme.sds.color.icon.default.primary} />
          </Flex>
          <Flex
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
          >
            <Icon name="logoYouTube" width={24} height={18} color={theme.sds.color.icon.default.primary} />
          </Flex>
          <Flex
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
          >
            <Icon name="linkedin" width={24} height={24} color={theme.sds.color.icon.default.primary} />
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}
