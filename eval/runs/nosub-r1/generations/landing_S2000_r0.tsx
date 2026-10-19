import { Box, Button, Card, Flex, Grid, Heading, Image, Link, Text } from "primitives";
import { NavigationPillList, TextContentTitle, TextContentHeading } from "compositions";
import { Footer } from "layout";
import { Icon } from "icons";
import { useNavigate } from "react-router-dom";

export default function Screen() {
  const navigate = useNavigate();

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" padding="var(--sds-size-space-400)">
        <Box display="flex" alignItems="center">
          <Icon name="Figma" />
        </Box>
        <NavigationPillList>
          <NavigationPill>Products</NavigationPill>
          <NavigationPill>Solutions</NavigationPill>
          <NavigationPill>Community</NavigationPill>
          <NavigationPill>Resources</NavigationPill>
          <NavigationPill>Pricing</NavigationPill>
          <NavigationPill>Contact</NavigationPill>
        </NavigationPillList>
        <Box display="flex" gap="var(--sds-size-space-300)">
          <Button onClick={() => navigate("/sign-in")}>Sign in</Button>
          <Button onClick={() => navigate("/register")}>Register</Button>
        </Box>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="center" padding="var(--sds-size-space-400)">
        <TextContentTitle title="Title" subtitle="Subtitle" />
        <Box display="flex" gap="var(--sds-size-space-400)">
          <Button>Button</Button>
          <Button>Button</Button>
        </Box>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="center" padding="var(--sds-size-space-400)">
        <Box display="flex" alignItems="center" justifyContent="center" width="100%" height="478px" backgroundColor="var(--sds-color-slate-200)" opacity="0.8" />
      </Box>
      <Box display="flex" alignItems="center" justifyContent="center" padding="var(--sds-size-space-400)">
        <TextContentHeading heading="Heading" subheading="Subheading" />
        <Grid display="flex" alignItems="center" justifyContent="center" gap="var(--sds-size-space-1600)" width="100%">
          <Card>
            <Box display="flex" alignItems="center" justifyContent="center" width="32px" height="32px" clip>
              <Icon name="Icon" />
            </Box>
            <Box display="flex" flexDirection="column" gap="var(--sds-size-space-400)" width="100%">
              <Box display="flex" flexDirection="column" gap="var(--sds-size-space-200)" width="100%">
                <Text>Title</Text>
              </Box>
            </Box>
          </Card>
          <Card>
            <Box display="flex" alignItems="center" justifyContent="center" width="32px" height="32px" clip>
              <Icon name="Icon" />
            </Box>
            <Box display="flex" flexDirection="column" gap="var(--sds-size-space-400)" width="100%">
              <Box display="flex" flexDirection="column" gap="var(--sds-size-space-200)" width="100%">
                <Text>Title</Text>
              </Box>
            </Box>
          </Card>
          <Card>
            <Box display="flex" alignItems="center" justifyContent="center" width="32px" height="32px" clip>
              <Icon name="Icon" />
            </Box>
            <Box display="flex" flexDirection="column" gap="var(--sds-size-space-400)" width="100%">
              <Box display="flex" flexDirection="column" gap="var(--sds-size-space-200)" width="100%">
                <Text>Title</Text>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Box>
      <Footer>
        <Box display="flex" flexDirection="column" gap="var(--sds-size-space-600)" width="262px">
          <Box display="flex" alignItems="center" justifyContent="center">
            <Icon name="Figma" />
          </Box>
          <Box display="flex" alignItems="center" justifyContent="center" gap="var(--sds-size-space-400)">
            <Box display="flex" alignItems="center" justifyContent="center" width="23.98px" height="24px">
              <Icon name="Icon" />
            </Box>
            <Box display="flex" alignItems="center" justifyContent="center" width="24px" height="24px" clip>
              <Icon name="Icon" />
            </Box>
            <Box display="flex" alignItems="center" justifyContent="center" width="24px" height="24px" clip>
              <Icon name="Icon" />
            </Box>
            <Box display="flex" alignItems="center" justifyContent="center" width="24px" height="24px" clip>
              <Icon name="Icon" />
            </Box>
          </Box>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="center" gap="16px">
          <TextLinkList>
            <Box display="flex" flexDirection="column" padding="0 0 var(--sds-size-space-400) 0" width="100%">
              <TextStrong>Explore</TextStrong>
            </Box>
            <Box display="flex" flexDirection="column" gap="12px" width="100%">
              <TextLinkListItem>Design</TextLinkListItem>
              <TextLinkListItem>Prototyping</TextLinkListItem>
              <TextLinkListItem>Development features</TextLinkListItem>
              <TextLinkListItem>Design systems</TextLinkListItem>
              <TextLinkListItem>Design process</TextLinkListItem>
              <TextLinkListItem>FigJam</TextLinkListItem>
            </Box>
          </TextLinkList>
          <TextLinkList>
            <Box display="flex" flexDirection="column" padding="0 0 var(--sds-size-space-400) 0" width="100%">
              <TextStrong>Resources</TextStrong>
            </Box>
            <Box display="flex" flexDirection="column" gap="12px" width="100%">
              <TextLinkListItem>Blog</TextLinkListItem>
              <TextLinkListItem>Colors</TextLinkListItem>
              <TextLinkListItem>Support</TextLinkListItem>
            </Box>
          </TextLinkList>
        </Box>
      </Footer>
    </Box>
  );
}
