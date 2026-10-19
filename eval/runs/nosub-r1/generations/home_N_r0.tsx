import React from 'react';
import { Box, Button, Flex, Heading, Image, Text, VStack } from 'primitives';
import { Layout, Hero, Section, Footer } from 'compositions';

export default function Screen() {
  return (
    <Layout>
      <Hero>
        <Box>
          <Heading as="h1">Welcome to Simple Design System</Heading>
          <Text>Explore our components and build beautiful interfaces.</Text>
          <Button>Get Started</Button>
        </Box>
      </Hero>
      <Section title="Features">
        <VStack spacing="var(--sds-size-space-400)">
          <Box>
            <Image src="/icons/icon1.svg" alt="Icon 1" />
            <Heading as="h2">Iconography</Heading>
            <Text>Consistent and scalable icons for your design.</Text>
          </Box>
          <Box>
            <Image src="/icons/icon2.svg" alt="Icon 2" />
            <Heading as="h2">Typography</Heading>
            <Text>Beautiful and readable typography for all text elements.</Text>
          </Box>
          <Box>
            <Image src="/icons/icon3.svg" alt="Icon 3" />
            <Heading as="h2">Layout</Heading>
            <Text>Responsive and flexible layout components.</Text>
          </Box>
        </VStack>
      </Section>
      <Footer>
        <Text>© 2023 Simple Design System. All rights reserved.</Text>
      </Footer>
    </Layout>
  );
}
