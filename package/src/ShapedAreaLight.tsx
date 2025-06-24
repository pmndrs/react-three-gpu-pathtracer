import { extend, ThreeElement } from "@react-three/fiber";
import { useEffect } from "react";
import { ShapedAreaLight as ShapedAreaLightImpl } from "three-gpu-pathtracer";
import { usePathtracer } from "./Pathtracer";

export function ShapedAreaLight(
  props: ThreeElement<typeof ShapedAreaLightImpl>
) {
  extend({ ShapedAreaLight: ShapedAreaLightImpl });
  const { pathtracer } = usePathtracer();
  useEffect(() => void pathtracer.updateLights());
  // @ts-expect-error
  return <shapedAreaLight {...props} />;
}

export { ShapedAreaLightImpl };
