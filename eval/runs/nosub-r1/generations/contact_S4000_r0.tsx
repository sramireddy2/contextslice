import { Box, Button, Form, Input, Textarea } from "primitives";
import { Header, Footer } from "compositions";
import { Icon } from "icons";
import { useTheme } from "react";

export default function Screen() {
  const theme = useTheme();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      width="100%"
      height="100vh"
      backgroundColor={theme.colors.background.default.default}
    >
      <Header />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        width="100%"
        padding={theme.sizes.space[600]}
        backgroundColor={theme.colors.background.default.secondary}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          width="100%"
          padding={theme.sizes.space[600]}
          borderRadius={theme.sizes.radius[200]}
          border={`1px solid ${theme.colors.border.default.default}`}
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            width="100%"
            gap={theme.sizes.space[200]}
          >
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              width="100%"
              gap={theme.sizes.space[200]}
            >
              <Text
                color={theme.colors.text.brand.onBrand.tertiary}
                fontSize={theme.fontSizes.titleHero}
              >
                Title
              </Text>
              <Text
                color={theme.colors.text.brand.onBrand.tertiary}
                fontSize={theme.fontSizes.subtitle}
              >
                Subtitle
              </Text>
            </Box>
            <Form>
              <Input
                label="Name"
                placeholder="Value"
                color={theme.colors.text.default.default}
                fontSize={theme.fontSizes.bodyBase}
              />
              <Input
                label="Surname"
                placeholder="Value"
                color={theme.colors.text.default.default}
                fontSize={theme.fontSizes.bodyBase}
              />
              <Input
                label="Email"
                placeholder="Value"
                color={theme.colors.text.default.default}
                fontSize={theme.fontSizes.bodyBase}
              />
              <Textarea
                label="Message"
                placeholder="Value"
                color={theme.colors.text.default.default}
                fontSize={theme.fontSizes.bodyBase}
              />
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="center"
                width="100%"
                gap={theme.sizes.space[400]}
              >
                <Button
                  color={theme.colors.text.brand.onBrand}
                  fontSize={theme.fontSizes.bodyBase}
                >
                  Submit
                </Button>
              </Box>
            </Form>
          </Box>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}
