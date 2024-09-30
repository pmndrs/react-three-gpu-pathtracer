import { extend, Object3DNode, RectAreaLightProps } from "@react-three/fiber";
import { useEffect } from "react";
import { PhysicalSpotLight } from "three-gpu-pathtracer";
import { usePathtracer } from "./Pathtracer";

extend({ PhysicalSpotLight: PhysicalSpotLight });

type SpotLightProps = {
  radius?: number;
  iesMap?: string;
};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      physicalSpotLight: Object3DNode<
        PhysicalSpotLight,
        typeof PhysicalSpotLight
      >;
    }
  }
}

export function SpotLight(props: SpotLightProps & RectAreaLightProps) {
  const pathTracer = usePathtracer();
  useEffect(() => void pathTracer.updateLights());
  return <physicalSpotLight {...(props as any)} />;
}
