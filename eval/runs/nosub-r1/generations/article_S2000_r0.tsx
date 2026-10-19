import { Box, Button, Card, Flex, Grid, Heading, Image, Link, Text } from "primitives";
import { NavigationPillList, TextContentTitle } from "compositions";
import { Footer } from "layout";
import { Icon } from "icons";
import { useTheme } from "react";

export default function Screen() {
  const theme = useTheme();

  return (
    <Box bg="background-default-default" px="sds-size-space-800" py="sds-size-space-4000">
      <Box display="flex" justifyContent="center" alignItems="center" gap="sds-size-space-600">
        <Box display="flex" alignItems="center">
          <Icon name="figma" width="23.33" height="35" stroke="icon-default-default" strokeWidth="3.5" />
        </Box>
        <NavigationPillList>
          <Button variant="plain" color="text-default-default" size="body-base">Products</Button>
          <Button variant="plain" color="text-default-default" size="body-base">Solutions</Button>
          <Button variant="plain" color="text-default-default" size="body-base">Community</Button>
          <Button variant="plain" color="text-default-default" size="body-base">Resources</Button>
          <Button variant="plain" color="text-default-default" size="body-base">Pricing</Button>
          <Button variant="plain" color="text-default-default" size="body-base">Contact</Button>
        </NavigationPillList>
        <Box display="flex" alignItems="center">
          <Button variant="primary" size="body-base">Sign in</Button>
          <Button variant="primary" size="body-base">Register</Button>
        </Box>
      </Box>
      <Box display="flex" justifyContent="center" alignItems="center" py="sds-size-space-4000">
        <Box display="flex" flexDirection="column" gap="sds-size-space-200" alignItems="center">
          <TextContentTitle title="Title" subtitle="Subtitle" align="center" />
          <Text color="text-default-secondary" style="Subtitle">Subtitle</Text>
        </Box>
      </Box>
      <Box display="flex" justifyContent="center" alignItems="center" py="sds-size-space-10">
        <Box display="flex" flexDirection="column" gap="sds-size-space-12" bg="slate-200" width="100%">
          <Box display="flex" justifyContent="center" alignItems="center" gap="sds-size-space-1200" py="sds-size-space-1600">
            <Box display="flex" justifyContent="center" alignItems="center" width="100%" height="478" bg="background-default-default" opacity="0.8" />
            <Box display="flex" justifyContent="center" alignItems="center" width="100%" height="478" bg="background-default-default" opacity="0.8" />
          </Box>
        </Box>
      </Box>
      <Footer>
        <Box display="flex" flexDirection="column" gap="sds-size-space-600" width="262">
          <Box display="flex" justifyContent="center" alignItems="center">
            <Icon name="figma" width="23.33" height="35" stroke="icon-default-default" strokeWidth="3.5" />
          </Box>
          <Box display="flex" justifyContent="center" alignItems="center" gap="sds-size-space-400">
            <Box display="flex" justifyContent="center" alignItems="center" width="23.98" height="24">
              <Icon name="x-logo" width="23.98" height="24" fill="icon-default-default" />
            </Box>
            <Box display="flex" justifyContent="center" alignItems="center" width="24" height="24" clip>
              <Icon name="instagram" width="24" height="24" fill="icon-default-default" />
            </Box>
            <Box display="flex" justifyContent="center" alignItems="center" width="24" height="24" clip>
              <Icon name="youtube" width="24" height="18" fill="icon-default-default" />
            </Box>
            <Box display="flex" justifyContent="center" alignItems="center" width="24" height="24" clip>
              <Icon name="linkedin" width="24" height="24" fill="icon-default-default" />
            </Box>
          </Box>
        </Box>
        <Box display="flex" justifyContent="center" alignItems="center" gap="sds-size-space-16">
          <Box display="flex" flexDirection="column" gap="sds-size-space-300" width="262">
            <Box display="flex" justifyContent="center" alignItems="center">
              <TextStrong>Use cases</TextStrong>
            </Box>
            <Grid gap="sds-size-space-12" columns="1fr">
              <Link href="#">UI design</Link>
              <Link href="#">UX design</Link>
              <Link href="#">Diagramming</Link>
              <Link href="#">Brainstorming</Link>
              <Link href="#">Online whiteboard</Link>
              <Link href="#">Team collaboration</Link>
            </Grid>
          </Box>
          <Box display="flex" flexDirection="column" gap="sds-size-space-300" width="262">
            <Box display="flex" justifyContent="center" alignItems="center">
              <TextStrong>Explore</TextStrong>
            </Box>
            <Grid gap="sds-size-space-12" columns="1fr">
              <Link href="#">Design</Link>
              <Link href="#">Prototyping</Link>
              <Link href="#">Development features</Link>
              <Link href="#">Design systems</Link>
              <Link href="#">Collaboration features</Link>
              <Link href="#">Design process</Link>
              <Link href="#">FigJam</Link>
            </Grid>
          </Box>
          <Box display="flex" flexDirection="column" gap="sds-size-space-300" width="262">
            <Box display="flex" justifyContent="center" alignItems="center">
              <TextStrong>Resources</TextStrong>
            </Box>
            <Grid gap="sds-size-space-12" columns="1fr">
              <Link href="#">Blog</Link>
              <Link href="#">Best practices</Link>
              <Link href="#">Colors</Link>
              <Link href="#">Color wheel</Link>
              <Link href="#">Support</Link>
              <Link href="#">Developers</Link>
              <Link href="#">Resource library</Link>
            </Grid>
          </Box>
        </Box>
      </Footer>
    </Box>
  );
}
