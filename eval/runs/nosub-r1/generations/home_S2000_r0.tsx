import { Box, Button, Card, Flex, Grid, Heading, Icon, Link, Text } from 'primitives';
import { NavigationPillList, TextContentTitle, TextContentHeading, TestimonialCard } from 'compositions';
import { Footer } from 'layout';
import { FigmaIcon, LinkedInIcon, LogoInstagramIcon, LogoYouTubeIcon, XLogoIcon } from 'icons';
import { useNavigate } from 'react-router-dom';

export default function Screen() {
  const navigate = useNavigate();

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" padding="var(--sds-size-space-400)">
        <Box display="flex" alignItems="center">
          <Icon src="figma-icon" width="23.33" height="35" stroke="var(--sds-color-icon-default-default)" strokeWidth="3.5" />
        </Box>
        <NavigationPillList>
          <Text>Products</Text>
          <Text>Solutions</Text>
          <Text>Community</Text>
          <Text>Resources</Text>
          <Text>Pricing</Text>
          <Text>Contact</Text>
        </NavigationPillList>
        <Box display="flex" gap="var(--sds-size-space-300)">
          <Button onClick={() => navigate('/sign-in')}>Sign in</Button>
          <Button onClick={() => navigate('/register')}>Register</Button>
        </Box>
      </Box>
      <Box display="flex" justifyContent="center" alignItems="center" padding="var(--sds-size-space-400)">
        <TextContentTitle title="Title" subtitle="Subtitle" />
        <Box display="flex" justifyContent="space-between" alignItems="center" width="240">
          <Button>Button</Button>
          <Button>Button</Button>
        </Box>
      </Box>
      <Box display="flex" justifyContent="center" alignItems="center" padding="var(--sds-size-space-400)" backgroundColor="var(--sds-color-slate-200)">
        <TextContentHeading heading="Heading" subheading="Subheading" />
        <Grid columns="repeat(3, 1fr)" gap="var(--sds-size-space-1200)" padding="var(--sds-size-space-1600)">
          <TestimonialCard quote="“Quote”" title="Title" description="Description" />
          <TestimonialCard quote="“Quote”" title="Title" description="Description" />
          <TestimonialCard quote="“Quote”" title="Title" description="Description" />
          <TestimonialCard quote="“Quote”" title="Title" description="Description" />
          <TestimonialCard quote="“Quote”" title="Title" description="Description" />
          <TestimonialCard quote="“Quote”" title="Title" description="Description" />
        </Grid>
      </Box>
      <Footer>
        <Box display="flex" flexDirection="column" gap="var(--sds-size-space-600)" width="262">
          <Box display="flex" alignItems="center">
            <Icon src="figma-icon" width="23.98" height="24" />
          </Box>
          <Box display="flex" justifyContent="center" alignItems="center" gap="var(--sds-size-space-400)">
            <Box display="flex" alignItems="center">
              <XLogoIcon width="23.98" height="24" />
            </Box>
            <Box display="flex" alignItems="center">
              <LogoInstagramIcon width="24" height="24" fill="var(--sds-color-icon-default-default)" />
            </Box>
            <Box display="flex" alignItems="center">
              <LogoYouTubeIcon width="24" height="18" fill="var(--sds-color-icon-default-default)" />
            </Box>
            <Box display="flex" alignItems="center">
              <LinkedInIcon width="24" height="24" fill="var(--sds-color-icon-default-default)" />
            </Box>
          </Box>
        </Box>
        <Box display="flex" justifyContent="center" alignItems="center" gap="var(--sds-size-space-300)">
          <Box display="flex" flexDirection="column" gap="var(--sds-size-space-400)" width="262">
            <Box display="flex" alignItems="center" padding="0 0 var(--sds-size-space-400) 0">
              <TextStrong>UI design</TextStrong>
            </Box>
            <Box display="flex" flexDirection="column" gap="12">
              <TextLinkList.Item>UI design</TextLinkList.Item>
              <TextLinkList.Item>UX design</TextLinkList.Item>
              <TextLinkList.Item>Diagramming</TextLinkList.Item>
              <TextLinkList.Item>Team collaboration</TextLinkList.Item>
            </Box>
          </Box>
          <Box display="flex" flexDirection="column" gap="var(--sds-size-space-400)" width="262">
            <Box display="flex" alignItems="center" padding="0 0 var(--sds-size-space-400) 0">
              <TextStrong>Explore</TextStrong>
            </Box>
            <Box display="flex" flexDirection="column" gap="12">
              <TextLinkList.Item>Design</TextLinkList.Item>
              <TextLinkList.Item>Prototyping</TextLinkList.Item>
              <TextLinkList.Item>Development features</TextLinkList.Item>
              <TextLinkList.Item>Design systems</TextLinkList.Item>
              <TextLinkList.Item>Design process</TextLinkList.Item>
              <TextLinkList.Item>FigJam</TextLinkList.Item>
            </Box>
          </Box>
          <Box display="flex" flexDirection="column" gap="var(--sds-size-space-400)" width="262">
            <Box display="flex" alignItems="center" padding="0 0 var(--sds-size-space-400) 0">
              <TextStrong>Resources</TextStrong>
            </Box>
            <Box display="flex" flexDirection="column" gap="12">
              <TextLinkList.Item>Blog</TextLinkList.Item>
              <TextLinkList.Item>Best practices</TextLinkList.Item>
              <TextLinkList.Item>Colors</TextLinkList.Item>
              <TextLinkList.Item>Color wheel</TextLinkList.Item>
              <TextLinkList.Item>Support</TextLinkList.Item>
              <TextLinkList.Item>Developers</TextLinkList.Item>
              <TextLinkList.Item>Resource library</TextLinkList.Item>
            </Box>
          </Box>
        </Box>
      </Footer>
    </Box>
  );
}
