import { Box, Button, Card, Flex, Grid, Heading, Icon, Link, Text } from 'primitives';
import { NavigationPill, TextContentTitle, TextLinkList } from 'compositions';
import { Avatar, AvatarBlock, CardGrid, HeroActions, TextHeading } from 'compositions';
import { Footer } from 'layout';
import { useIcons } from 'icons';
import { useImages } from 'images';

export default function Screen() {
  const { figmaIcon } = useIcons();
  const { xLogo, logoInstagram, logoYouTube, linkedInIcon } = useImages();

  return (
    <Box>
      <Box display="flex" flexDirection="column" gap="var(--sds-size-space-600)" padding="var(--sds-size-space-800)">
        <Box display="flex" alignItems="center" justifyContent="center">
          <Box display="flex" alignItems="center" gap="24px">
            <Box width="40px" height="35px" display="flex" alignItems="center" justifyContent="center">
              <Icon icon={figmaIcon} width="23.33px" height="35px" stroke="var(--sds-color-icon-default-default)" strokeWidth="3.5px" />
            </Box>
            <NavigationPillList>
              <NavigationPill label="Products" state="active" />
              <NavigationPill label="Solutions" state="default" />
              <NavigationPill label="Community" state="default" />
              <NavigationPill label="Resources" state="default" />
              <NavigationPill label="Pricing" state="default" />
              <NavigationPill label="Contact" state="default" />
            </NavigationPillList>
          </Box>
          <Box display="flex" alignItems="center" gap="300px">
            <Button>Sign in</Button>
            <Button variant="primary">Register</Button>
          </Box>
        </Box>
        <HeroActions>
          <TextContentTitle title="Title" subtitle="Subtitle" />
          <Box display="flex" alignItems="center" justifyContent="center" gap="400px">
            <Button>Button</Button>
            <Button variant="primary">Button</Button>
          </Box>
        </HeroActions>
        <Box display="flex" alignItems="center" justifyContent="center" padding="var(--sds-size-space-1600)" backgroundColor="var(--sds-color-slate-200)">
          <TextContentHeading heading="Heading" subheading="Subheading" />
        </Box>
        <CardGrid>
          {[1, 2, 3, 4, 5, 6].map((_, index) => (
            <Card key={index} padding="var(--sds-size-space-600)" backgroundColor="var(--sds-color-background-default-default)" borderWidth="1px" borderColor="var(--sds-color-border-default-default)" borderRadius="var(--sds-size-radius-200)">
              <TextHeading text="“Quote”" />
              <AvatarBlock title="Title" description="Description" />
            </Card>
          ))}
        </CardGrid>
        <Footer>
          <Box display="flex" alignItems="center" justifyContent="center" gap="400px">
            <Box display="flex" alignItems="center" gap="400px">
              <Box width="23.98px" height="24px" display="flex" alignItems="center" justifyContent="center">
                <Icon icon={xLogo} width="23.98px" height="24px" fill="var(--sds-color-icon-default-default)" />
              </Box>
              <Box width="24px" height="24px" display="flex" alignItems="center" justifyContent="center">
                <Icon icon={logoInstagram} width="24px" height="24px" fill="var(--sds-color-icon-default-default)" />
              </Box>
              <Box width="24px" height="24px" display="flex" alignItems="center" justifyContent="center">
                <Icon icon={logoYouTube} width="24px" height="18px" fill="var(--sds-color-icon-default-default)" />
              </Box>
              <Box width="24px" height="24px" display="flex" alignItems="center" justifyContent="center">
                <Icon icon={linkedInIcon} width="24px" height="24px" fill="var(--sds-color-icon-default-default)" />
              </Box>
            </Box>
            <TextLinkList density="default" hasTitle>
              <TextLinkList.Item text="Use cases" />
              <TextLinkList.Item text="UI design" />
              <TextLinkList.Item text="UX design" />
              <TextLinkList.Item text="Wireframing" />
              <TextLinkList.Item text="Diagramming" />
              <TextLinkList.Item text="Brainstorming" />
              <TextLinkList.Item text="Online whiteboard" />
              <TextLinkList.Item text="Team collaboration" />
            </TextLinkList>
            <TextLinkList density="default" hasTitle>
              <TextLinkList.Item text="Design" />
              <TextLinkList.Item text="Prototyping" />
              <TextLinkList.Item text="Development features" />
              <TextLinkList.Item text="Design systems" />
              <TextLinkList.Item text="Collaboration features" />
              <TextLinkList.Item text="Design process" />
              <TextLinkList.Item text="FigJam" />
            </TextLinkList>
            <TextLinkList density="default" hasTitle>
              <TextLinkList.Item text="Blog" />
              <TextLinkList.Item text="Best practices" />
              <TextLinkList.Item text="Colors" />
              <TextLinkList.Item text="Color wheel" />
              <TextLinkList.Item text="Support" />
              <TextLinkList.Item text="Developers" />
              <TextLinkList.Item text="Resource library" />
            </TextLinkList>
          </Box>
        </Footer>
      </Box>
    </Box>
  );
}
