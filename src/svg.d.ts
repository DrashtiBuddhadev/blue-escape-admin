declare module "*.svg?react" {
  import React = require("react");
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement> & { className?: string }>;
  const src: string;
  export default src;
}
