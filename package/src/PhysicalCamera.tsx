import { extend, ThreeElement, useThree } from "@react-three/fiber";
import { useLayoutEffect, useEffect, useRef } from "react";
import { PhysicalCamera as PhysicalCameraImpl } from "three-gpu-pathtracer";
import { usePathtracer } from "./Pathtracer";

export function PhysicalCamera(
  props: ThreeElement<typeof PhysicalCameraImpl> & { manual?: boolean }
) {
  extend({ PhysicalCamera: PhysicalCameraImpl });
  const { pathtracer } = usePathtracer();

  const set = useThree(({ set }) => set);
  const camera = useThree(({ camera }) => camera);
  const size = useThree(({ size }) => size);
  const cameraRef = useRef<PhysicalCameraImpl>(null!);

  useLayoutEffect(() => {
    if (!props.manual) {
      // Calculate correct aspect ratio
      cameraRef.current.aspect = size.width / size.height;
    }
  }, [size, props]);

  useLayoutEffect(() => {
    // Update the camera's projection matrix
    cameraRef.current.updateProjectionMatrix();
  });

  useLayoutEffect(() => {
    // Set as the default camera
    const oldCam = camera;
    set(() => ({ camera: cameraRef.current }));
    return () => set(() => ({ camera: oldCam }));
  }, [cameraRef, set]);

  // Update the pathtracer
  useEffect(() => void pathtracer.updateCamera());

  // @ts-expect-error
  return <physicalCamera ref={cameraRef} {...props} />;
}

export { PhysicalCameraImpl };
