import {
  Bounds,
  Center,
  Circle,
  Environment,
  OrbitControls,
  PerspectiveCamera,
  Stats,
  useTexture
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Pathtracer, usePathtracer } from "@react-three/gpu-pathtracer";
import { Leva } from "leva";
import { useEffect, useRef } from "react";

import Controls from "./Controls";

import { ACESFilmicToneMapping, MathUtils } from "three";
import Model from "./Model";
import Tag from "./Tag";

const baseURL = import.meta.env.BASE_URL;

function Floor() {
  const [aoMap, diffMap, norMap, roughMap] = useTexture([
    baseURL + "/textures/wood_cabinet_worn_long_ao_2k.jpg",
    baseURL + "/textures/wood_cabinet_worn_long_diff_2k.jpg",
    baseURL + "/textures/wood_cabinet_worn_long_nor_gl_2k.jpg",
    baseURL + "/textures/wood_cabinet_worn_long_rough_2k.jpg"
  ]);

  return (
    <>
      <Circle args={[4, 128]} position={[0, -1, 0]} rotation-x={-Math.PI / 2}>
        <meshPhysicalMaterial map={diffMap} aoMap={aoMap} roughness={0.2} />
      </Circle>
    </>
  );
}

function UI({ infoRef }) {
  const { pathtracer } = usePathtracer();
  const opts = Controls();

  useFrame(() => {
    if (pathtracer && infoRef.current) {
      infoRef.current.children[0].textContent = `Samples: ${Math.ceil(
        // @ts-ignore
        pathtracer.samples
      )}/${opts.Rendering_Samples}`;

      // @ts-ignore
      infoRef.current.children[1].textContent = pathtracer.isCompiling
        ? `Initializing...`
        : "";
    }
  });

  return null;
}

function Thing() {
  const { reset, update } = usePathtracer();
  const opts = Controls();

  // Trigger updates when envmap stuff changes
  useEffect(() => {
    update();
  }, [
    opts.Environment_Visible,
    opts.Environment_Preset,
    opts.Environment_Intensity,
    opts.Environment_Blur
  ]);

  return (
    <>
      <group rotation-y={MathUtils.degToRad(-180)}>
        <Bounds fit clip observe margin={1.3}>
          <Center>
            <group position={[-1, -1.2, 0]}>
              <Model rotation-y={Math.PI} position={[-0.3, 0, 0]} scale={15} />
            </group>
          </Center>
        </Bounds>
        <Floor />
      </group>
    </>
  );
}

export default function App() {
  const infoRef = useRef();
  const opts = Controls();

  return (
    <>
      <Leva
        collapsed
        titleBar={{
          title: "Options"
        }}
      />
      <Canvas
        gl={{
          toneMapping: ACESFilmicToneMapping
        }}
      >
        <PerspectiveCamera makeDefault position={[4, 2, -1]} fov={40} />
        <OrbitControls makeDefault />

        <Pathtracer
          samples={opts.Rendering_Samples}
          bounces={opts.Rendering_Bounces}
          resolutionFactor={opts.Rendering_Factor}
          tiles={opts.Rendering_Tiles}
          enabled={opts.Rendering_Enabled}
        >
          {opts.Environment_Visible ? (
            <Environment
              preset={opts.Environment_Preset as any}
              // background
              environmentIntensity={opts.Environment_Intensity}
              backgroundBlurriness={opts.Environment_Blur}
            />
          ) : (
            <directionalLight intensity={5} position={[5, 5, 5]} />
          )}

          <Thing />
          <UI infoRef={infoRef} />
        </Pathtracer>
      </Canvas>
      <Stats />
      <div className="info" ref={infoRef}>
        <p>Samples: 0</p>
        <p>Initializing...</p>
      </div>
      <Tag />
    </>
  );
}
