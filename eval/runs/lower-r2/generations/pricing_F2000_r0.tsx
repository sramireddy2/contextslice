import { Box, Button, Card, Flex, Grid, Heading, Icon, Text } from 'primitives';
import { NavigationPill } from 'compositions';
import { useTheme } from 'react';

export default function Screen() {
  const theme = useTheme();

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={theme.sds.size.space[1600]}
      padding={theme.sds.size.space[4000]}
      backgroundColor={theme.sds.color.background.default.secondary}
    >
      <Flex
        justifyContent="center"
        alignItems="center"
        gap={theme.sds.size.space[600]}
      >
        <Box width={40}>
          <Icon name="Figma" width={23.33} height={35} color={theme.sds.color.icon.default.default} />
        </Box>
        <NavigationPillList direction="row" links={['Products', 'Solutions', 'Community', 'Resources', 'Pricing', 'Contact']} activeLink="Pricing" />
      </Flex>
      <Box display="flex" justifyContent="center" alignItems="center">
        <NavigationPillList direction="row" links={['Sign in', 'Register']} variant="neutral" />
      </Box>
      <Box display="flex" justifyContent="center" alignItems="center" padding={theme.sds.size.space[1600]} backgroundColor={theme.sds.color.background.default.secondary}>
        <Box display="flex" flexDirection="column" gap={theme.sds.size.space[200]} alignItems="center">
          <Heading level={1} style="Title Hero" color={theme.sds.color.text.default.default}>Title</Heading>
          <Text style="Subtitle" color={theme.sds.color.text.default.secondary}>Subtitle</Text>
        </Box>
      </Box>
      <Box display="flex" justifyContent="center" alignItems="center" padding={theme.sds.size.space[1600]}>
        <NavigationPillList direction="row" links={['Monthly', 'Yearly']} activeLink="Monthly" />
        <Grid
          display="flex"
          flexDirection="row"
          gap={theme.sds.size.space[1600]}
          width="100%"
        >
          <Card>
            <Box display="flex" flexDirection="column" gap={theme.sds.size.space[200]} padding={theme.sds.size.space[200]}>
              <Heading level={2} style="Body Base" color={theme.sds.color.text.default.default}>Basic Plan</Heading>
              <Text style="Body Base" color={theme.sds.color.text.default.secondary}>$10/month</Text>
              <Button variant="primary" size="small" label="Sign Up" />
            </Box>
          </Card>
          <Card>
            <Box display="flex" flexDirection="column" gap={theme.sds.size.space[200]} padding={theme.sds.size.space[200]}>
              <Heading level={2} style="Body Base" color={theme.sds.color.text.default.default}>Pro Plan</Heading>
              <Text style="Body Base" color={theme.sds.color.text.default.secondary}>$20/month</Text>
              <Button variant="primary" size="small" label="Sign Up" />
            </Box>
          </Card>
        </Grid>
      </Box>
      <Box display="flex" justifyContent="center" alignItems="center" padding={theme.sds.size.space[1600]}>
        <Box display="flex" flexDirection="column" gap={theme.sds.size.space[200]} padding={theme.sds.size.space[200]}>
          <Heading level={2} style="Body Base" color={theme.sds.color.text.default.default}>FAQ</Heading>
          <Box display="flex" flexDirection="column" gap={theme.sds.size.space[1200]}>
            <Box display="flex" flexDirection="row" gap={theme.sds.size.space[200]}>
              <Icon name="QuestionMark" width={24} height={24} color={theme.sds.color.icon.default.default} />
              <Text style="Body Base" color={theme.sds.color.text.default.secondary}>What is the difference between the Basic and Pro plans?</Text>
            </Box>
            <Box display="flex" flexDirection="row" gap={theme.sds.size.space[200]}>
              <Icon name="QuestionMark" width={24} height={24} color={theme.sds.color.icon.default.default} />
              <Text style="Body Base" color={theme.sds.color.text.default.secondary}>How do I cancel my subscription?</Text>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
