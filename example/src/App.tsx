import {
  Center,
  Circle,
  Environment,
  OrbitControls,
  PerspectiveCamera,
  Stats,
  useTexture
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  AreaLight,
  Pathtracer,
  usePathtracer
} from "@react-three/gpu-pathtracer";

import Controls from "./Controls";

import { Suspense } from "react";
import { MathUtils } from "three";
import Model from "./Model";

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
  const pathtracer = usePathtracer();
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
  return (
    <>
      <group rotation-y={MathUtils.degToRad(-180)}>
        <Center>
          <group position={[-1, -1.2, 0]}>
            <Model rotation-y={Math.PI} position={[-0.3, 0, 0]} scale={15} />
          </group>
          <Floor />
        </Center>
      </group>
    </>
  );
}

export default function App() {
  return (
    <>
      <Canvas>
        <PerspectiveCamera makeDefault position={[4, 2, -1]} fov={40} />
        <OrbitControls makeDefault />

        <Pathtracer>
          <Environment preset="apartment" />

          <AreaLight
            position={[0, 2, 0]}
            rotation-x={-Math.PI / 2}
            intensity={10}
            width={2}
            height={2}
          />

          <Suspense>
            <Thing />
          </Suspense>
        </Pathtracer>
      </Canvas>
      <Stats />
    </>
  );
}
