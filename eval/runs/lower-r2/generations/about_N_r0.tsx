import React from 'react';
import { Box, Heading, Text, Card, Grid, Footer } from 'primitives';
import { Container } from 'layout';
import { Logo } from 'icons';
import { SimpleLogo } from 'images';

export default function Screen() {
  return (
    <Box>
      <Container>
        <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
          <Logo />
          <Heading level={1} style={{ marginLeft: '1rem' }}>
            Simple Design System
          </Heading>
        </Box>
      </Container>

      <Container style={{ padding: 'var(--sds-size-space-400)' }}>
        <Text style={{ textAlign: 'center', marginBottom: 'var(--sds-size-space-400)' }}>
          Welcome to the Simple Design System. A collection of reusable components and styles to help you build beautiful and consistent user interfaces.
        </Text>
      </Container>

      <Container style={{ padding: 'var(--sds-size-space-400)' }}>
        <Grid columns={2} gap="var(--sds-size-space-400)">
          <Card title="Components">
            <Text>
              A library of pre-designed components that follow the design system's guidelines. Use them to build your UI without worrying about consistency.
            </Text>
          </Card>
          <Card title="Styles">
            <Text>
              A set of CSS variables and utility classes that ensure your application has a consistent look and feel. No more hardcoding styles!
            </Text>
          </Card>
        </Grid>
      </Container>

      <Footer>
        <SimpleLogo />
        <Text style={{ marginLeft: '1rem' }}>
          &copy; 2023 Simple Design System. All rights reserved.
        </Text>
      </Footer>
    </Box>
  );
}
