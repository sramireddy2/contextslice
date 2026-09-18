// url=<FIGMA_CARD>
// source=https://github.com/example/toy/blob/main/src/ui/Card.tsx
// component=Card

import figma from "figma";

const instance = figma.selectedInstance;
const heading = instance.getString("Heading");

export default {
  id: "Card",
  imports: ['import { Card } from "compositions";'],
  example: figma.code`<Card heading="${heading}">${children}</Card>`,
};
