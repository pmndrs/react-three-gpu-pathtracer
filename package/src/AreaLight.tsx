import { extend, Object3DNode, RectAreaLightProps } from "@react-three/fiber";
import { useEffect } from "react";
import { ShapedAreaLight as ShapedAreaLightImpl } from "three-gpu-pathtracer";
import { usePathtracer } from "./Pathtracer";

extend({ ShapedAreaLight: ShapedAreaLightImpl });

type AreaLightProps = {
  isCircular?: boolean;
};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      shapedAreaLight: Object3DNode<
        ShapedAreaLightImpl,
        typeof ShapedAreaLightImpl
      >;
    }
  }
}

export function AreaLight(props: AreaLightProps & RectAreaLightProps) {
  const pathTracer = usePathtracer();
  useEffect(() => void pathTracer.updateLights());
  return <shapedAreaLight {...(props as any)} />;
}
