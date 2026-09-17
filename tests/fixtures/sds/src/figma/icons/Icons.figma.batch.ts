import figma from "figma";

const component = figma.batch.component;

export default {
  id: component,
  imports: [`import { ${component} } from "icons";`],
  example: figma.code`<${component} size="24" />`,
  metadata: { nestable: true },
};
