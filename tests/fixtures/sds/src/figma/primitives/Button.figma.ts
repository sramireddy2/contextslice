// url=<FIGMA_BUTTON>
// source=https://github.com/example/toy/blob/main/src/ui/Button.tsx
// component=Button

import figma from "figma";

const instance = figma.selectedInstance;
const rp = figma.helpers.react.renderProp;
const variant = instance.getEnum("Variant", {
  Primary: "primary",
  Secondary: "secondary",
});
const label = instance.getString("Label");
const icon = instance.getInstanceSwap("Icon");
const isDisabled = instance.getEnum("State", { Disabled: true });

export default {
  id: "Button",
  imports: ['import { Button } from "primitives";'],
  example: figma.code`<Button ${rp("variant", variant)} ${rp("isDisabled", isDisabled)} icon={${icon}}>${label}</Button>`,
};
