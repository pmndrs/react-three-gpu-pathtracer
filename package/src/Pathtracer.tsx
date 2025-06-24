import {
  applyProps,
  ElementProps,
  useFrame,
  useThree,
  Vector2
} from "@react-three/fiber";
import React, { useMemo } from "react";
import * as THREE from "three";
import { WebGLPathTracer } from "three-gpu-pathtracer";

type PathtracerProps = ElementProps<typeof WebGLPathTracer> & {
  minSamples?: number;
  samples?: number;
  tiles?: Vector2;
  bounces?: number;
  enabled?: boolean;
  resolutionFactor?: number;
  renderPriority?: number;
  filteredGlossyFactor?: number;
};

interface PathtracerAPI {
  update: () => void;
  reset: () => void;
  renderer: WebGLPathTracer;
  pathtracer: WebGLPathTracer;
}

const context = React.createContext<PathtracerAPI>(null as any);

//* Helper Function to convert TilesType to [number, number]
function fiberVec2ToArr(vec: Vector2): [number, number] {
  if (Array.isArray(vec)) return vec;
  if (vec instanceof THREE.Vector2) return [vec.x, vec.y];
  if (typeof vec === "number") return [vec, vec];
  return [1, 1]; // Default to 1x1 tiles if not specified
}

export const Pathtracer = React.forwardRef<
  InstanceType<typeof WebGLPathTracer>,
  React.PropsWithChildren<PathtracerProps>
>(
  (
    {
      children,
      enabled = true,
      minSamples = 1,
      samples = 32,
      bounces = 4,
      resolutionFactor = 1,
      renderPriority = 1,
      filteredGlossyFactor = 0,
      renderDelay = 0,
      fadeDuration = 0,
      dynamicLowRes = true,
      lowResScale = 0.25,
      textureSize = [1024, 1024],
      rasterizeScene = false,
      tiles = [3, 3],
      ...props
    },
    ref
  ) => {
    // state objects
    const { gl, camera, scene, controls } = useThree();

    const pathtracer = useMemo(() => {
      const pt = new WebGLPathTracer(gl);
      pt.synchronizeRenderSize = true;
      // This might not be needed as we arent using setSceneAsync
      //pt.setBVHWorker(new ParallelMeshBVHWorker())
      return pt;
    }, [gl]);

    // Expose the pathtracer instance via ref
    React.useImperativeHandle(ref, () => pathtracer, [pathtracer]);

    //* Single handler for all props
    React.useLayoutEffect(() => {
      applyProps(pathtracer, {
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
      pathtracer.renderScale = resolutionFactor;
      pathtracer.reset();
    }, [props, resolutionFactor, bounces, minSamples, pathtracer]);

    React.useEffect(() => {
      if (enabled) pathtracer.reset();
    }, [enabled]);

    const api = React.useMemo<PathtracerAPI>(
      () => ({
        /**
         * Update the pathtracer scene. Call this after adding or removing objects from the scene
         */
        update: () => {
          pathtracer.setScene(scene, camera);
        },
        /**
         * Reset the pathtracer. Call this after changing any pathtracing properties
         */
        reset: () => {
          pathtracer.reset();
        },
        /**
         * @deprecated Use `pathtracer` instead
         */
        renderer: pathtracer,
        pathtracer: pathtracer // Use this instead. Keeps base three renderer seperate mentally
      }),
      [pathtracer, scene, camera]
    );

    //* Initialize the pathtracer
    React.useLayoutEffect(() => {
      // scene.updateMatrixWorld()
      pathtracer.setScene(scene, camera);
    }, [scene, camera]);

    // Bind control listeners
    React.useLayoutEffect(() => {
      // setup control listeners

      const controlListener = () => {
        pathtracer.updateCamera();
      };

      // @ts-ignore
      if (controls) controls.addEventListener("change", controlListener);

      return () => {
        // @ts-ignore
        if (controls) controls.removeEventListener("change", controlListener);
      };
    }, [controls, pathtracer]);

    useFrame(({ camera, gl, scene }) => {
      if (enabled && pathtracer.samples < (samples ?? Infinity))
        pathtracer.renderSample();
      if (!enabled) gl.render(scene, camera);
    }, 1);

    return <context.Provider value={api}>{children}</context.Provider>;
  }
);

export function usePathtracer() {
  const ctx = React.useContext(context);
  if (!ctx) throw new Error("usePathtracer must be used within a Pathtracer");

  return ctx;
}
