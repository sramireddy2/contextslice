```tsx
import { IconStar, IconX } from "icons";
import { Box, Button, Card, Flex, Grid, Heading, Link, Text, TextLinkList, TextLinkListItem, TextStrong, TextLinkListDensity, TextLinkListTitle } from "compositions";
import { useTheme } from "react";

export default function Screen() {
  const theme = useTheme();

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={theme.size.space[600]}
      padding={theme.size.space[800]}
      backgroundColor={theme.color.background.default.default}
      border={`1px solid ${theme.color.border.default.default}`}
      width="100%"
      height="100vh"
    >
      <Box
        display="flex"
        flexDirection="row"
        wrap="wrap"
        gap={theme.size.space[200]}
        alignItems="center"
        justifyContent="center"
        width="100%"
        height="auto"
      >
        <Box display="flex" alignItems="center" justifyContent="center" width="40px" height="auto" />
        <Box display="flex" flexDirection="row" wrap="wrap" gap={theme.size.space[200]} alignItems="center" justifyContent="center" width="100%">
          <Box display="flex" alignItems="center" justifyContent="center" width="auto" height="auto" />
          <Box display="flex" alignItems="center" justifyContent="center" width="auto" height="auto" />
          <Box display="flex" alignItems="center" justifyContent="center" width="auto" height="auto" />
          <Box display="flex" alignItems="center" justifyContent="center" width="auto" height="auto" />
          <Box display="flex" alignItems="center" justifyContent="center" width="auto" height="auto" />
          <Box display="flex" alignItems="center" justifyContent="center" width="auto" height="auto" />
        </Box>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        gap={theme.size.space[800]}
        padding={theme.size.space[4000]}
        alignItems="center"
        justifyContent="center"
        width="100%"
        height="auto"
        backgroundColor={theme.color.background.utilities.scrim}
      >
        <Box
          display="flex"
          flexDirection="column"
          gap={theme.size.space[200]}
          alignItems="center"
          justifyContent="center"
          width="100%"
          height="auto"
        >
          <Text
            as="h1"
            style="Title Hero"
            color={theme.color.text.utilities.text.on.overlay}
            width="100%"
            height="auto"
          >
            Title
          </Text>
          <Text
            as="h2"
            style="Subtitle"
            color={theme.color.text.utilities.text.on.overlay}
            width="100%"
            height="auto"
          >
            Subtitle
          </Text>
        </Box>
        <Box
          display="flex"
          flexDirection="row"
          gap={theme.size.space[400]}
          alignItems="center"
          justifyContent="center"
          width="100%"
          height="auto"
        >
          <Button
            variant="neutral"
            state="default"
            size="medium"
            iconEnd={<IconX size={theme.size.space[200]} />}
            iconStart={<IconStar size={theme.size.space[200]} />}
            label="Button"
            padding={theme.size.space[300]}
            radius={theme.size.radius[200]}
            width="auto"
            height="auto"
            backgroundColor={theme.color.background.neutral.tertiary}
            border={`1px solid ${theme.color.border.neutral.secondary}`}
          />
          <Button
            variant="primary"
            state="default"
            size="medium"
            iconEnd={<IconX size={theme.size.space[200]} />}
            iconStart={<IconStar size={theme.size.space[200]} />}
            label="Button"
            padding={theme.size.space[300]}
            radius={theme.size.radius[200]}
            width="auto"
            height="auto"
            backgroundColor={theme.color.background.brand.default}
            border={`1px solid ${theme.color.border.brand.default}`}
          />
        </Box>
      </Box>
      <Box
        display="flex"
        flexDirection="row"
        gap={theme.size.space[1200]}
        padding={theme.size.space[1600]}
        alignItems="center"
        justifyContent="center"
        width="100%"
        height="478px"
        backgroundColor={theme.color.background.default.default}
        opacity={0.8}
      >
        <Box display="flex" alignItems="center" justifyContent="center" width="100%" height="100%" backgroundColor={theme.color.slate[200]} clip />
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        gap={theme.size.space[1200]}
        padding={theme.size.space[1600]}
        alignItems="center"
        justifyContent="center"
        width="100%"
        height="auto"
        backgroundColor={theme.color.background.default.default}
      >
        <Box
          display="flex"
          flexDirection="column"
          gap={theme.size.space[200]}
          alignItems="start"
          justifyContent="center"
          width="100%"
          height="auto"
        >
          <Text
            as="h1"
            style="Heading"
            color={theme.color.text.default.default}
            width="100%"
            height="auto"
          >
            Heading
          </Text>
          <Text
            as="h2"
            style="Subheading"
            color={theme.color.text.default.secondary}
            width="100%"
            height="auto"
          >
            Subheading
          </Text>
        </Box>
        <Grid
          display="flex"
          flexDirection="row"
          wrap="wrap"
          gap={theme.size.space[1600]}
          alignItems="center"
          justifyContent="center"
          width="100%"
          height="auto"
        >
          <Card
            assetType="icon"
            variant="default"
            direction="horizontal"
            icon={<IconStar size={theme.size.space[200]} />}
            body="Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story."
            heading="Title"
            button={false}
            width={301.33}
            height="auto"
          />
          <Card
            assetType="icon"
            variant="default"
            direction="horizontal"
            icon={<IconStar size={theme.size.space[200]} />}
            body="Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story."
            heading="Title"
            button={false}
            width="auto"
            height="auto"
            x2
          />
          <Card
            assetType="icon"
            variant="default"
            direction="horizontal"
            icon={<IconStar size={theme.size.space[200]} />}
            body="Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story."
            heading="Title"
            button={false}
            width="auto"
            height="auto"
            x3
          />
        </Grid>
      </Box>
      <Box
        display="flex"
        flexDirection="row"
        wrap="wrap"
        gap={theme.size.space[400]}
        padding={`${theme.size.space[800]} ${theme.size.space[800]} ${theme.size.space[4000]} ${theme.size.space[800]}`}
        alignItems="center"
        justifyContent="center"
        width="1200px"
        height="auto"
        backgroundColor={theme.color.background.default.default}
        border={`1px solid ${theme.color.border.default.default}`}
      >
        <Box
          display="flex"
          flexDirection="column"
          gap={theme.size.space[600]}
          alignItems="center"
          justifyContent="center"
          width="262px"
          height="auto"
        >
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            width="auto"
            height="auto"
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              width="23.33px"
              height="35px"
              stroke={theme.color.icon.default.default}
              strokeW={3.5}
            />
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            wrap="wrap"
            gap={theme.size.space[400]}
            alignItems="center"
            justifyContent="center"
            width="auto"
            height="auto"
          >
            <TextLinkListItem
              text="UI design"
              width="auto"
              height="auto"
            />
            <TextLinkListItem
              text="UX design"
              width="auto"
              height="auto"
            />
            <TextLinkListItem
              text="Wireframing"
              width
