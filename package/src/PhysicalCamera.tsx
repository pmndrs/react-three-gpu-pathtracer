import { extend, ThreeElement } from "@react-three/fiber";
import { useEffect } from "react";
import { PhysicalCamera as PhysicalCameraImpl } from "three-gpu-pathtracer";
import { usePathtracer } from "./Pathtracer";

export function PhysicalCamera(props: ThreeElement<typeof PhysicalCameraImpl>) {
  extend({ PhysicalCamera: PhysicalCameraImpl });
  const { pathtracer } = usePathtracer();
  useEffect(() => void pathtracer.updateCamera());
  // @ts-expect-error
  return <physicalCamera {...props} />;
}

export { PhysicalCameraImpl };
