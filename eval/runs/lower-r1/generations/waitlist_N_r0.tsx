import React, { useState } from 'react';
import { Box, Button, Form, Input, Text } from 'primitives';
import { Layout } from 'layout';
import { Icon } from 'icons';

export default function Screen() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  return (
    <Layout>
      <Box
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          gap: 'var(--sds-size-space-400)',
        }}
      >
        <Box
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--sds-size-space-200)',
          }}
        >
          <Icon name="waitlist" size="large" />
          <Text variant="headline">Join our waitlist</Text>
          <Text variant="body">Be the first to know when we launch.</Text>
        </Box>
        <Form onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              maxWidth: '400px',
              padding: 'var(--sds-size-space-200)',
              border: '1px solid var(--sds-color-border)',
              borderRadius: 'var(--sds-size-radius-400)',
            }}
          />
          <Button type="submit" style={{ width: '100%', maxWidth: '400px' }}>
            Join Waitlist
          </Button>
        </Form>
      </Box>
    </Layout>
  );
}
