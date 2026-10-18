import React, { useState } from 'react';
import { Box, Button, Form, Input, Text, VStack } from 'primitives';
import { CompanyLogo } from 'images';
import { EmailIcon, PhoneIcon } from 'icons';

export default function Screen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', { name, email, message });
  };

  return (
    <Box style={{ padding: 'var(--sds-size-space-400)' }}>
      <VStack spacing="var(--sds-size-space-400)">
        <Box>
          <CompanyLogo />
          <Text style={{ fontSize: 'var(--sds-size-font-400)', fontWeight: 'bold', marginTop: 'var(--sds-size-space-200)' }}>
            Contact Us
          </Text>
        </Box>
        <Form onSubmit={handleSubmit}>
          <VStack spacing="var(--sds-size-space-200)">
            <Input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ padding: 'var(--sds-size-space-100)' }}
            />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ padding: 'var(--sds-size-space-100)' }}
            />
            <Input
              as="textarea"
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{ padding: 'var(--sds-size-space-100)' }}
            />
            <Button type="submit" style={{ padding: 'var(--sds-size-space-100)' }}>
              Submit
            </Button>
          </VStack>
        </Form>
        <VStack spacing="var(--sds-size-space-200)">
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <EmailIcon style={{ marginRight: 'var(--sds-size-space-100)' }} />
            <Text style={{ fontSize: 'var(--sds-size-font-300)' }}>support@example.com</Text>
          </Box>
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <PhoneIcon style={{ marginRight: 'var(--sds-size-space-100)' }} />
            <Text style={{ fontSize: 'var(--sds-size-font-300)' }}>+1 123 456 7890</Text>
          </Box>
        </VStack>
      </VStack>
    </Box>
  );
}
