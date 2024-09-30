import { applyProps, useFrame, useThree, Vector2 } from "@react-three/fiber";
import React, {
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useState
} from "react";
import { WebGLPathTracer } from "three-gpu-pathtracer";

interface PathtracerProps {
  maxSamples?: number;
  renderPriority?: number;
  bounces?: number;
  filteredGlossyFactor?: number;
  renderDelay?: number;
  fadeDuration?: number;
  minSamples?: number;
  dynamicLowRes?: boolean;
  lowResScale?: number;
  textureSize?: [number, number];
  rasterizeScene?: boolean;
  tiles?: Vector2;
}

const context = React.createContext<WebGLPathTracer>(null as any);

export const Pathtracer = React.forwardRef<
  WebGLPathTracer,
  React.PropsWithChildren<PathtracerProps>
>(
  (
    {
      children,
      maxSamples = 32,
      renderPriority = 1,
      bounces = 4,
      filteredGlossyFactor = 0,
      renderDelay = 0,
      fadeDuration = 0,
      minSamples = 1,
      dynamicLowRes = true,
      lowResScale = 0.25,
      textureSize = [1024, 1024],
      rasterizeScene = false,
      tiles = [3, 3]
    },
    fref
  ) => {
    const gl = useThree((state) => state.gl);
    const scene = useThree((state) => state.scene);
    const camera = useThree((state) => state.camera);
    const controls = useThree((state) => state.controls);
    const size = useThree((state) => state.size);
    const [pathTracer] = useState(() => new WebGLPathTracer(gl));

    // Set up scene
    useLayoutEffect(() => {
      pathTracer.setScene(scene, camera);
    }, [scene, camera]);

    // Update config
    useLayoutEffect(() => {
      applyProps(pathTracer, {
        bounces,
        filteredGlossyFactor,
        renderDelay,
        fadeDuration,
        minSamples,
        dynamicLowRes,
        lowResScale,
        rasterizeScene,
        textureSize,
        tiles
      });
    });

    // Render samples
    useFrame((state) => {
      if (pathTracer.samples <= maxSamples) {
        pathTracer.renderSample();
      }
    }, renderPriority);

    // Listen for changes
    useEffect(() => {
      if (controls) {
        const fn = () => pathTracer.updateCamera();
        // @ts-ignore
        controls.addEventListener("change", fn);
        // @ts-ignore
        return () => controls.removeEventListener("change", fn);
      }
    }, [controls]);

    // Configure size
    useEffect(() => {
      pathTracer.updateCamera();
    }, [camera, size]);

    useImperativeHandle(fref, () => pathTracer, [pathTracer]);

    return <context.Provider value={pathTracer}>{children}</context.Provider>;
  }
);

export function usePathtracer() {
  const ctx = React.useContext(context);
  if (!ctx) throw new Error("usePathtracer must be used within a Pathtracer");

  return ctx;
}
