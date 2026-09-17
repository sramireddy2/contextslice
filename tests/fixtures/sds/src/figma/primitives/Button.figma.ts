// url=<FIGMA_BUTTON>
// source=https://github.com/example/toy/blob/main/src/ui/Button.tsx
// component=Button

import figma from "figma";

const instance = figma.selectedInstance;
const label = instance.getString("Label");

export default {
  id: "Button",
  imports: ['import { Button } from "primitives";'],
  example: figma.code`<Button>${label}</Button>`,
};
