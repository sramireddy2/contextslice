import { Box, Button, Card, Flex, Grid, Heading, Text, Avatar, NavigationPill, NavigationPillList, Header, HeroActions, CardGridTestimonials, Footer } from 'primitives';
import { IconX, IconStar } from 'icons';
import { useTheme } from 'react';

export default function Screen() {
  const theme = useTheme();

  return (
    <Box background={theme.colors.backgroundDefaultDefault} padding="sds-size-space-800">
      <Header>
        <Box display="flex" alignItems="center" gap="sds-size-space-600">
          <Box display="flex" alignItems="center" width="40px" height="hug">
            <IconX width="23.33px" height="35px" stroke={theme.colors.iconDefaultDefault} strokeWidth="3.5" />
          </Box>
          <NavigationPillList direction="row">
            <NavigationPill label="Products" state="active" />
            <NavigationPill label="Solutions" state="default" />
            <NavigationPill label="Community" state="default" />
            <NavigationPill label="Resources" state="default" />
            <NavigationPill label="Pricing" state="default" />
            <NavigationPill label="Contact" state="default" />
          </NavigationPillList>
        </Box>
        <Box display="flex" alignItems="center" gap="sds-size-space-300" width="178px" height="hug">
          <Button variant="neutral" state="default" size="small" label="Sign in" />
          <Button variant="primary" state="default" size="small" label="Register" />
        </Box>
      </Header>
      <HeroActions>
        <Box display="flex" flexDirection="column" alignItems="center" gap="sds-size-space-200">
          <Heading level={1} style="Title Hero">Title</Heading>
          <Text style="Subtitle">Subtitle</Text>
        </Box>
        <Box display="flex" justifyContent="center" gap="sds-size-space-400">
          <Button variant="neutral" state="default" size="medium" label="Button" />
          <Button variant="primary" state="default" size="medium" label="Button" />
        </Box>
      </HeroActions>
      <Box background={theme.colors.slate200} padding="sds-size-space-10">
        <CardGridTestimonials>
          <Heading level={2} style="Heading">Heading</Heading>
          <Text style="Subheading">Subheading</Text>
          <Grid gap="sds-size-space-1200">
            <Card>
              <Text style="Heading">“Quote”</Text>
              <AvatarBlock title="Title" description="Description" />
            </Card>
            <Card>
              <Text style="Heading">“Quote”</Text>
              <AvatarBlock title="Title" description="Description" />
            </Card>
            <Card>
              <Text style="Heading">“Quote”</Text>
              <AvatarBlock title="Title" description="Description" />
            </Card>
            <Card>
              <Text style="Heading">“Quote”</Text>
              <AvatarBlock title="Title" description="Description" />
            </Card>
            <Card>
              <Text style="Heading">“Quote”</Text>
              <AvatarBlock title="Title" description="Description" />
            </Card>
            <Card>
              <Text style="Heading">“Quote”</Text>
              <AvatarBlock title="Title" description="Description" />
            </Card>
          </Grid>
        </CardGridTestimonials>
      </Box>
      <Footer>
        <Box display="flex" flexDirection="column" alignItems="center" gap="sds-size-space-600" width="262px" height="hug">
          {/* Footer content goes here */}
        </Box>
      </Footer>
    </Box>
  );
}
