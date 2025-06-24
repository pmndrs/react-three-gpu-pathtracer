import { extend, ThreeElement } from "@react-three/fiber";
import { useEffect } from "react";
import { PhysicalSpotLight as PhysicalSpotLightImpl } from "three-gpu-pathtracer";
import { usePathtracer } from "./Pathtracer";

export function PhysicalSpotLight(
  props: ThreeElement<typeof PhysicalSpotLightImpl>
) {
  extend({ PhysicalSpotLight: PhysicalSpotLightImpl });
  const { pathtracer } = usePathtracer();
  useEffect(() => void pathtracer.updateLights());
  // @ts-expect-error
  return <physicalSpotLight {...props} />;
}

export { PhysicalSpotLightImpl };
