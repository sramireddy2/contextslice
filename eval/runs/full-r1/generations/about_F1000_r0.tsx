import { Box, Flex, Heading, Text, Button, Card, Grid, Link } from 'primitives';
import { NavigationPillList, NavigationPill } from 'compositions';
import { Header } from 'layout';
import { Icon } from 'icons';
import { images } from 'images';

export default function Screen() {
  return (
    <Box style={{ background: 'var(--sds-color-background-default-default)' }}>
      <Header />
      <Flex direction="column" align="center" justify="center" style={{ padding: 'var(--sds-size-space-800)' }}>
        <Heading level={1} style={{ color: 'var(--sds-color-text-brand-on-brand-secondary)' }}>
          About Us
        </Heading>
        <Text style={{ color: 'var(--sds-color-text-default-default)' }}>
          We are a team of designers and developers passionate about creating beautiful and functional user experiences.
        </Text>
      </Flex>
      <Box style={{ padding: 'var(--sds-size-space-800)' }}>
        <Grid columns={2} gap="var(--sds-size-space-600)">
          <Card>
            <Box style={{ padding: 'var(--sds-size-space-400)' }}>
              <Heading level={2} style={{ color: 'var(--sds-color-text-brand-on-brand-secondary)' }}>
                Our Mission
              </Heading>
              <Text style={{ color: 'var(--sds-color-text-default-default)' }}>
                Our mission is to help businesses of all sizes create exceptional user experiences that drive growth and success.
              </Text>
            </Box>
          </Card>
          <Card>
            <Box style={{ padding: 'var(--sds-size-space-400)' }}>
              <Heading level={2} style={{ color: 'var(--sds-color-text-brand-on-brand-secondary)' }}>
                Our Team
              </Heading>
              <Text style={{ color: 'var(--sds-color-text-default-default)' }}>
                Our team is made up of talented designers and developers who are passionate about creating beautiful and functional user experiences.
              </Text>
            </Box>
          </Card>
        </Grid>
      </Box>
      <Box style={{ padding: 'var(--sds-size-space-800)' }}>
        <Grid columns={2} gap="var(--sds-size-space-600)">
          <Card>
            <Box style={{ padding: 'var(--sds-size-space-400)' }}>
              <Heading level={2} style={{ color: 'var(--sds-color-text-brand-on-brand-secondary)' }}>
                Our Values
              </Heading>
              <Text style={{ color: 'var(--sds-color-text-default-default)' }}>
                Our values are centered around creating exceptional user experiences that drive growth and success.
              </Text>
            </Box>
          </Card>
          <Card>
            <Box style={{ padding: 'var(--sds-size-space-400)' }}>
              <Heading level={2} style={{ color: 'var(--sds-color-text-brand-on-brand-secondary)' }}>
                Our History
              </Heading>
              <Text style={{ color: 'var(--sds-color-text-default-default)' }}>
                Our history is one of innovation and creativity, and we are dedicated to continuing that tradition.
              </Text>
            </Box>
          </Card>
        </Grid>
      </Box>
      <Box style={{ padding: 'var(--sds-size-space-800)' }}>
        <Flex direction="column" align="center" justify="center">
          <Heading level={1} style={{ color: 'var(--sds-color-text-brand-on-brand-secondary)' }}>
            Get in Touch
          </Heading>
          <Text style={{ color: 'var(--sds-color-text-default-default)' }}>
            We would love to hear from you. Please feel free to contact us using the form below.
          </Text>
          <Form />
        </Flex>
      </Box>
      <Box style={{ padding: 'var(--sds-size-space-800)' }}>
        <Footer />
      </Box>
    </Box>
  );
}

function Form() {
  return (
    <Flex direction="column" align="center" justify="center" style={{ gap: 'var(--sds-size-space-400)' }}>
      <Input label="Name" placeholder="Enter your name" />
      <Input label="Email" placeholder="Enter your email" />
      <Input label="Message" placeholder="Enter your message" multiline />
      <Button>Submit</Button>
    </Flex>
  );
}

function Input({ label, placeholder, multiline = false }) {
  return (
    <Box style={{ position: 'relative' }}>
      <Text style={{ color: 'var(--sds-color-text-default-default)' }}>{label}</Text>
      <Box style={{ position: 'relative' }}>
        <input
          type="text"
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: 'var(--sds-size-space-400)',
            border: '1px solid var(--sds-color-border-default-default)',
            borderRadius: 'var(--sds-size-radius-200)',
            outline: 'none',
          }}
          rows={multiline ? 4 : 1}
        />
      </Box>
    </Box>
  );
}
