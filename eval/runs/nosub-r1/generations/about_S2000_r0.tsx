```tsx
import { Box, Button, Card, Flex, Grid, Heading, Link, Text } from 'primitives';
import { NavigationPillList, TextContentTitle, TextContentHeading } from 'compositions';
import { Footer } from 'layout';
import { Icon } from 'icons';

export default function Screen() {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" padding="var(--sds-size-space-400)">
        <Box display="flex" alignItems="center">
          <Icon name="Figma" />
        </Box>
        <NavigationPillList>
          <Button>Products</Button>
          <Button>Solutions</Button>
          <Button>Community</Button>
          <Button>Resources</Button>
          <Button>Pricing</Button>
          <Button>Contact</Button>
        </NavigationPillList>
        <Box display="flex" gap="var(--sds-size-space-300)">
          <Button>Sign in</Button>
          <Button>Register</Button>
        </Box>
      </Box>
      <Box display="flex" justifyContent="center" padding="var(--sds-size-space-600)">
        <TextContentTitle title="Title" subtitle="Subtitle" />
      </Box>
      <Box display="flex" justifyContent="center" padding="var(--sds-size-space-1600)" opacity="0.8">
        <Box display="flex" alignItems="center" width="100%" height="478px" backgroundColor="var(--sds-color-slate-200)" />
      </Box>
      <Box display="flex" justifyContent="center" padding="var(--sds-size-space-1600)">
        <TextContentHeading heading="Heading" subheading="Subheading" />
        <Grid columns="repeat(3, 1fr)" gap="var(--sds-size-space-600)">
          <Card>
            <Box display="flex" alignItems="center" justifyContent="center" width="100%" height="100%" backgroundColor="var(--sds-color-slate-200)" />
            <Box display="flex" flexDirection="column" gap="var(--sds-size-space-400)" width="100%">
              <Box display="flex" flexDirection="column" gap="var(--sds-size-space-200)" width="100%">
                <Text>Title</Text>
                <Button>Button</Button>
              </Box>
            </Box>
          </Card>
          <Card>
            <Box display="flex" alignItems="center" justifyContent="center" width="100%" height="100%" backgroundColor="var(--sds-color-slate-200)" />
            <Box display="flex" flexDirection="column" gap="var(--sds-size-space-400)" width="100%">
              <Box display="flex" flexDirection="column" gap="var(--sds-size-space-200)" width="100%">
                <Text>Title</Text>
                <Button>Button</Button>
              </Box>
            </Box>
          </Card>
          <Card>
            <Box display="flex" alignItems="center" justifyContent="center" width="100%" height="100%" backgroundColor="var(--sds-color-slate-200)" />
            <Box display="flex" flexDirection="column" gap="var(--sds-size-space-400)" width="100%">
              <Box display="flex" flexDirection="column" gap="var(--sds-size-space-200)" width="100%">
                <Text>Title</Text>
                <Button>Button</Button>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Box>
      <Box display="flex" justifyContent="center" padding="var(--sds-size-space-1600)">
        <TextContentHeading heading="Heading" subheading="Subheading" />
        <Grid columns="repeat(2, 1fr)" gap="var(--sds-size-space-1200)">
          <Box display="flex" flexDirection="column" gap="var(--sds-size-space-600)" width="100%">
            <Card>
              <Box display="flex" alignItems="center" justifyContent="center" width="100%" height="100%" backgroundColor="var(--sds-color-slate-200)" />
              <Box display="flex" flexDirection="column" gap="var(--sds-size-space-400)" width="100%">
                <Box display="flex" flexDirection="column" gap="var(--sds-size-space-200)" width="100%">
                  <Text>Title</Text>
                  <Button>Button</Button>
                </Box>
              </Box>
            </Card>
            <Card>
              <Box display="flex" alignItems="center" justifyContent="center" width="100%" height="100%" backgroundColor="var(--sds-color-slate-200)" />
              <Box display="flex" flexDirection="column" gap="var(--sds-size-space-400)" width="100%">
                <Box display="flex" flexDirection="column" gap="var(--sds-size-space-200)" width="100%">
                  <Text>Title</Text>
                  <Button>Button</Button>
                </Box>
              </Box>
            </Card>
          </Box>
          <Box display="flex" flexDirection="column" gap="var(--sds-size-space-600)" width="100%">
            <Card>
              <Box display="flex" alignItems="center" justifyContent="center" width="100%" height="100%" backgroundColor="var(--sds-color-slate-200)" />
              <Box display="flex" flexDirection="column" gap="var(--sds-size-space-400)" width="100%">
                <Box display="flex" flexDirection="column" gap="var(--sds-size-space-200)" width="100%">
                  <Text>Title</Text>
                  <Button>Button</Button>
                </Box>
              </Box>
            </Card>
            <Card>
              <Box display="flex" alignItems="center" justifyContent="center" width="100%" height="100%" backgroundColor="var(--sds-color-slate-200)" />
              <Box display="flex" flexDirection="column" gap="var(--sds-size-space-400)" width="100%">
                <Box display="flex" flexDirection="column" gap="var(--sds-size-space-200)" width="100%">
                  <Text>Title</Text>
                  <Button>Button</Button>
                </Box>
              </Box>
            </Card>
          </Box>
        </Grid>
      </Box>
      <Footer>
        <Box display="flex" flexDirection="column" gap="var(--sds-size-space-600)" width="262px">
          <Box display="flex" alignItems="center" justifyContent="center" width="100%" height="100%">
            <Icon name="Figma" />
          </Box>
          <Box display="flex" flexDirection="row" gap="var(--sds-size-space-400)" alignItems="center" justifyContent="center" width="100%" height="100%">
            <Box display="flex" alignItems="center" justifyContent="center" width="23.98px" height="24px">
              <Icon name="X Logo" />
            </Box>
            <Box display="flex" alignItems="center" justifyContent="center" width="24px" height="24px" clip>
              <Icon name="Logo Instagram" />
            </Box>
            <Box display="flex" alignItems="center" justifyContent="center" width="24px" height="24px" clip>
              <Icon name="Logo YouTube" />
            </Box>
            <Box display="flex" alignItems="center" justifyContent="center" width="24px" height="24px" clip>
              <Icon name="LinkedIn" />
            </Box>
          </Box>
        </Box>
        <Box display="flex" flexDirection="row" gap="var(--sds-size-space-300)" alignItems="center" justifyContent="center" width="100%" height="100%">
          <Box display="flex" flexDirection="column" gap="var(--sds-size-space-400)" width="262px">
            <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center" width="100%" height="100%">
              <TextStrong>Use cases</TextStrong>
            </Box>
            <Box display="flex" flexDirection="column" gap="12px" width="100%">
              <TextLinkListItem>UI design</TextLinkListItem>
              <TextLinkListItem>UX design</TextLinkListItem>
              <TextLinkListItem>Diagramming</TextLinkListItem>
              <TextLinkListItem>Brainstorming</TextLinkListItem>
