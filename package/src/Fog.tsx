import { extend, MeshProps, Object3DNode } from "@react-three/fiber";
import { useEffect } from "react";
import { FogVolumeMaterial } from "three-gpu-pathtracer";
import { usePathtracer } from "./Pathtracer";

extend({ FogVolumeMaterial });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      fogVolumeMaterial: Object3DNode<
        FogVolumeMaterial,
        typeof FogVolumeMaterial
      >;
    }
  }
}

export function Fog({
  density,
  color,
  emissive,
  emissiveIntensity,
  children,
  ...props
}: MeshProps & {
  density?: number;
  color?: string;
  emissive?: string;
  emissiveIntensity?: number;
}) {
  const pathtracer = usePathtracer();
  useEffect(() => void pathtracer.updateMaterials());

  return (
    <mesh {...props}>
      <planeGeometry />
      {children}
      <fogVolumeMaterial
        density={density}
        color={color}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
      />
    </mesh>
  );
}
