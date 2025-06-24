import { extend, ThreeElement } from "@react-three/fiber";
import { useEffect } from "react";
import { FogVolumeMaterial as FogVolumeMaterialImpl } from "three-gpu-pathtracer";
import { usePathtracer } from "./Pathtracer";

export function FogVolumeMaterial(
  props: ThreeElement<typeof FogVolumeMaterialImpl>
) {
  extend({ FogVolumeMaterial: FogVolumeMaterialImpl });
  const { pathtracer } = usePathtracer();
  useEffect(() => void pathtracer.updateMaterials());
  // @ts-expect-error
  return <fogVolumeMaterial {...props} />;
}

export { FogVolumeMaterialImpl };
