import { applyProps, useFrame, useThree } from "@react-three/fiber";
import React, {
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useState
} from "react";
import { WebGLPathTracer } from "three-gpu-pathtracer";

type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];
type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;

interface PathtracerProps
  extends Partial<NonFunctionProperties<WebGLPathTracer>> {
  maxSamples?: number;
  renderPriority?: number;
  filteredGlossyFactor?: number;
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
