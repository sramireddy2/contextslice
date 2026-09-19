import React from 'react';
import { Box, Heading, Text, Card, Grid } from 'primitives';
import { Icon } from 'icons';
import { Image } from 'images';

export default function Screen() {
  return (
    <Box padding="var(--sds-size-space-400)">
      <Heading level={1}>Article Title</Heading>
      <Text style={{ marginTop: 'var(--sds-size-space-200)' }}>
        This is the body text of the article. It provides detailed information and insights on the topic.
      </Text>
      <Grid columns="1fr 1fr" gap="var(--sds-size-space-400)" style={{ marginTop: 'var(--sds-size-space-400)' }}>
        <Card>
          <Image src="/path/to/image1.jpg" alt="Related Image 1" />
          <Heading level={3}>Related Card 1</Heading>
          <Text>Short description of related card 1.</Text>
        </Card>
        <Card>
          <Image src="/path/to/image2.jpg" alt="Related Image 2" />
          <Heading level={3}>Related Card 2</Heading>
          <Text>Short description of related card 2.</Text>
        </Card>
      </Grid>
    </Box>
  );
}
