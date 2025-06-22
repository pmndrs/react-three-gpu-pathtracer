<br />

<h1 align="center">react-three-gpu-pathtracer</h1>
<h3 align="center">⚡️ A React abstraction for the popular <a href="https://github.com/gkjohnson/three-gpu-pathtracer">three-gpu-pathtracer</a></h3>

<br />

<p align="center">
  <a href="https://codesandbox.io/embed/github/pmndrs/react-three-gpu-pathtracer/tree/main/example" target="_blank"><img  src="https://github.com/pmndrs/react-three-gpu-pathtracer/blob/main/assets/hero-screenshot.png?raw=true"/></a>
</p>
<p align="middle">
  <i>This demo is real, you can click it! It contains full code, too. 📦</i>
</p>
<p align="middle">
GameBoy model by 
<a href="https://sketchfab.com/kleingeo">(@kleingeo)</a>
<a hef="https://sketchfab.com/3d-models/game-boy-classic-0ae80019e6f046168923286d7e628f6f">
  on Sketchfab
</a>
. GameBoy Cartridge by 
<a href="https://sketchfab.com/kleingeo">(@MeBob)</a>
<a hef="https://sketchfab.com/3d-models/gameboy-cartridge-lowpoly-8b9728eab16c4056ac2636ae7f0f038f">
  on Sketchfab
</a>
.
</p>

<br>

<p align="center">
  <a href="https://www.npmjs.com/package/@react-three/gpu-pathtracer" target="_blank">
    <img src="https://img.shields.io/npm/v/@react-three/gpu-pathtracer.svg?style=flat&colorA=000000&colorB=000000" />
  </a>
  <a href="https://www.npmjs.com/package/@react-three/gpu-pathtracer" target="_blank">
    <img src="https://img.shields.io/npm/dm/@react-three/gpu-pathtracer.svg?style=flat&colorA=000000&colorB=000000" />
  </a>
  <a href="https://twitter.com/pmndrs" target="_blank">
    <img src="https://img.shields.io/twitter/follow/pmndrs?label=%40pmndrs&style=flat&colorA=000000&colorB=000000&logo=twitter&logoColor=000000" alt="Chat on Twitter">
  </a>
  <a href="https://discord.gg/ZZjjNvJ" target="_blank">
    <img src="https://img.shields.io/discord/740090768164651008?style=flat&colorA=000000&colorB=000000&label=discord&logo=discord&logoColor=000000" alt="Chat on Twitter">
  </a>
</p>

<br />

`react-three-gpu-pathtracer` lets you render your `react-three-fiber` scenes using Path Tracing! It is as simple as

```jsx
import { Pathtracer } from "@react-three/gpu-pathtracer";

function GradientSphere() {
  return (
    <Canvas>
      <Pathtracer>{/* Your scene */}</Pathtracer>
    </Canvas>
  );
}
```

The `<Pathtracer />` component wraps your scene. The scene is then rendered using Path Tracing.

#### Props

| Prop         | Type                                                                   | Default    | Description                                                                                                          |
| ------------ | ---------------------------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------- |
| `minSamples` | `number`                                                               | `1`        | Default: 5. Min number of samples before blending the base scene with the pathtraced one.                            |
| `samples`    | `number`                                                               | `1`        | Max number of samples before the pathtracer stops.                                                                   |
| `frames`     | `number`                                                               | `Infinity` | Number of frames to path trace. Will pause rendering once this number is reached.                                    |
| `tiles`      | `[number, number] / THREE.Vector2 / { x: number; y: number } / number` | `2`        | Number of tiles. Can be used to improve the responsiveness of a page while still rendering a high resolution target. |
| `bounces`    | `number`                                                               | `1`        | The number of ray bounces to test. Higher is better quality but slower performance.                                  |
| `enabled`    | `boolean`                                                              | `true`     | Wether to enable pathtracing.                                                                                        |

### Env maps

Env maps can be added using [Drei's `<Environment />`](https://github.com/pmndrs/drei#environment) component just like in a regular scene.

```jsx
<Pathtracer>
  <Environment
    preset="..."
    background // Optional, set as scene background
    backgroundBlurriness={0.5}
    backgroundIntensity={1}
  />
</Pathtracer>
```

### `usePathtracer`

This hook provides access to useful functions in the internal renderer. Can only be used within the `<Pathtracer />` component.

```ts
const { renderer, update, reset } = usePathtracer();
```

| Return value   | Type              | Description                                                                                 |
| -------------- | ----------------- | ------------------------------------------------------------------------------------------- |
| `pathtracer`   | `WebGLPathTracer` | Internal renderer. Can be used to access/edit internal properties                           |
| ~~`renderer`~~ | `WebGLPathTracer` | DEPRECIATED: use `pathtracer` to not get confused with raster renderer                      |
| `reset`        | `() => void`      | Flushes the rendered scene and resets the samples count.                                    |
| `update`       | `() => void`      | Tells the pathtracer that the scene has been updated. Everything is managed internally now. |

### Note on controls

When you set controls be sure to use `makeDefault` and it's best to import the `OrbitControls` [from drei](https://drei.docs.pmnd.rs/controls/introduction)

```jsx
<OrbitControls makeDefault>
        // ...
```

### Development

#### Dev

```bash
cd project-root
yarn
yarn dev
```

#### Build

```bash
yarn build
```

#### Publish

```bash
cd package
npm run release
```
