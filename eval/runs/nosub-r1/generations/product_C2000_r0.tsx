import { IconHeart } from "icons";
import { Box, Button, Card, Flex, Heading, Image, Text, Tag } from "compositions";
import { Grid, GridItem } from "layout";
import { useTheme } from "react";

export default function Screen() {
  const theme = useTheme();

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={theme.size.space[600]}
      padding={theme.size.space[1600]}
      backgroundColor={theme.color.background.default.default}
    >
      <Box
        display="flex"
        flexDirection="row"
        gap={theme.size.space[600]}
        alignItems="center"
        justifyContent="center"
        width="100%"
        height="auto"
        backgroundColor={theme.color.background.default.default}
        border={`1px solid ${theme.color.border.default.default}`}
        borderRadius={theme.size.radius[200]}
      >
        <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center" width="40px" height="auto" />
        {/* Navigation Pill List and Header Auth components would be here */}
      </Box>

      <Box
        display="flex"
        flexDirection="row"
        gap={theme.size.space[600]}
        alignItems="center"
        justifyContent="center"
        width="100%"
        height="auto"
        backgroundColor={theme.color.background.default.default}
      >
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" width="fill" height="auto">
          <Box
            display="flex"
            flexDirection="row"
            gap={theme.size.space[200]}
            alignItems="center"
            justifyContent="center"
            width="fill"
            height="auto"
          >
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              width="fill"
              height="auto"
              backgroundColor={theme.color.slate[200]}
              borderRadius={theme.size.radius[200]}
            >
              {/* Image component would be here */}
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              width="fill"
              height="auto"
            >
              <Box
                display="flex"
                flexDirection="column"
                gap={theme.size.space[400]}
                alignItems="center"
                justifyContent="center"
                width="fill"
                height="auto"
              >
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="center"
                  width="fill"
                  height="auto"
                >
                  <Tag
                    label="Tag"
                    removable={false}
                    scheme="positive"
                    state="default"
                    variant="secondary"
                    backgroundColor={theme.color.background.positive.secondary}
                    borderRadius={theme.size.radius[200]}
                  >
                    <Text
                      label="Tag"
                      weight={theme.typography.titlePage.fontWeight}
                      fontSize={theme.typography.subtitle.size.small}
                      fontFamily={theme.typography.titlePage.fontFamily}
                      color={theme.color.text.positive.onPositiveSecondary}
                    />
                  </Tag>
                  <Box
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="center"
                    width="auto"
                    height="auto"
                  >
                    <Text
                      label="$50"
                      weight={theme.typography.titlePage.fontWeight}
                      fontSize={theme.typography.titlePage.size.base}
                      fontFamily={theme.typography.titlePage.fontFamily}
                      color={theme.color.text.default.default}
                    />
                  </Box>
                </Box>
                {/* Fields and Button components would be here */}
                <Accordion
                  display="flex"
                  flexDirection="column"
                  gap={theme.size.space[400]}
                  width="fill"
                  height="auto"
                >
                  {/* Accordion items would be here */}
                </Accordion>
              </Box>
            </Box>
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            width="auto"
            height="auto"
            backgroundColor={theme.color.background.brand.default}
            border={`1px solid ${theme.color.border.brand.default}`}
            borderRadius={theme.size.scale[6]}
            padding={theme.size.space[300]}
          >
            <IconHeart size={theme.size.scale[6]} />
          </Box>
        </Box>
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        width="100%"
        height="auto"
        backgroundColor={theme.color.background.default.default}
      >
        <Heading
          label="Latest reviews"
          style="Heading"
          color={theme.color.text.default.default}
        />
        <Grid
          display="flex"
          flexDirection="row"
          flexWrap="wrap"
          gap={theme.size.space[1200]}
          width="fill"
          height="auto"
        >
          {/* Review Card components would be here */}
        </Grid>
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        width="100%"
        height="auto"
        backgroundColor={theme.color.background.default.default}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          width="fill"
          height="auto"
        >
          <Heading
            label="Follow the latest trends"
            style="Heading"
            color={theme.color.text.default.default}
          />
          <Text
            label="With our daily newsletter"
            style="Subheading"
            color={theme.color.text.default.secondary}
          />
        </Box>
        <Box
          display="flex"
          flexDirection="row"
          gap={theme.size.space[300]}
          width="338px"
          height="auto"
        >
          {/* Input Field and Button components would be here */}
        </Box>
      </Box>

      <Box
        display="flex"
        flexDirection="row"
        gap={theme.size.space[400]}
        padding={`${theme.size.space[800]}/${theme.size.space[800]}/${theme.size.space[4000]}/${theme.size.space[800]}`}
        width="1200px"
        height="auto"
        backgroundColor={theme.color.background.default.default}
        border={`1px solid ${theme.color.border.default.default}`}
        borderRadius={theme.size.radius[200]}
      >
        {/* Footer components would be here */}
      </Box>
    </Box>
  );
}
