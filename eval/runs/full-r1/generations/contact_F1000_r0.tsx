import { Box, Button, Form, Input, Text, VStack } from "primitives";
import { ContactForm } from "compositions";
import { Header } from "layout";
import { ContactUsLogo } from "images";

export default function Screen() {
  return (
    <Box style={{ backgroundColor: "var(--sds-color-background-default-default)" }}>
      <Header />
      <VStack style={{ padding: "var(--sds-size-space-800)" }}>
        <ContactUsLogo />
        <Text style={{ fontSize: "var(--sds-size-font-base)" }}>Get in touch with us</Text>
        <ContactForm />
      </VStack>
    </Box>
  );
}
