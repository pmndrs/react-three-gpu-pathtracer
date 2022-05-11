<br />

<h1>react-three-gpu-pathtracer</h1>
<h3>⚡️ A React abstraction for the popular <a href="https://github.com/gkjohnson/three-gpu-pathtracer">three-gpu-pathtracer</a></h3>

<br>

<p>
  <a href="https://www.npmjs.com/package/lamina" target="_blank">
    <img src="https://img.shields.io/npm/v/lamina.svg?style=flat&colorA=000000&colorB=000000" />
  </a>
  <a href="https://www.npmjs.com/package/lamina" target="_blank">
    <img src="https://img.shields.io/npm/dm/lamina.svg?style=flat&colorA=000000&colorB=000000" />
  </a>
  <a href="https://twitter.com/pmndrs" target="_blank">
    <img src="https://img.shields.io/twitter/follow/pmndrs?label=%40pmndrs&style=flat&colorA=000000&colorB=000000&logo=twitter&logoColor=000000" alt="Chat on Twitter">
  </a>
  <a href="https://discord.gg/ZZjjNvJ" target="_blank">
    <img src="https://img.shields.io/discord/740090768164651008?style=flat&colorA=000000&colorB=000000&label=discord&logo=discord&logoColor=000000" alt="Chat on Twitter">
  </a>
</p>

<br />

<p align="center">
  <a href="" target="_blank"><img  src="https://raw.githubusercontent.com/pmndrs/react-three-gpu-pathtracer/main/examples/basic/thumbnail.png?token=GHSAT0AAAAAABMXHW7LKAF66AXOEZ5NWTM4YT3Y33Q"  /></a>
</p>
<p align="middle">
  <i>These demos are real, you can click them! They contain the full code, too. 📦</i> More examples <a href="./examples">here</a>
</p>
<br />

`react-three-gpu-pathtracer` lets you render your `react-three-fiber` scenes using Path Tracing! It is as simple as

```jsx
import { Pathtracer } from '@react-three/gpu-pathtracer'

function GradientSphere() {
  return (
    <Canvas>
      <Pathtracer>{/* Your scene */}</Pathtracer>
    </Canvas>
  )
}
```

## Docs

### `<Pathtracer />`

The `<Pathtracer />` component wraps your scene. The scene is then rendered using Path Tracing.

#### Props

| Prop              | Type                                          | Default   | Description                                                          |
| ----------------- | --------------------------------------------- | --------- | -------------------------------------------------------------------- |
| `samples`         | `number`                                      | `1`       | Number of samples                                                    |
| `tiles`           | `THREE.Vector2 \| number \| [number, number]` | `[1, 1]`  | Number of tiles                                                      |
| `bounces`         | `number`                                      | `3`       | Number of ray bounces                                                |
| `paused`          | `boolean`                                     | `false`   | Pauses rendering if set to `true`                                    |
| `enabled`         | `boolean`                                     | `true`    | Disables Path Tracing is set to `false`                              |
| `renderPriority`  | `number`                                      | `1`       | Render priority for internal render loop                             |
| `resolutionScale` | `number`                                      | `0.5`     | Scaling factor for resolution. `0.5` means half of screen resolution |
| `background`      | `Partial<PathtracerBackground>`               | See below | Options for the background.                                          |

#### `PathtracerBackground`

| Prop        | Type                          | Default         | Description                                            |
| ----------- | ----------------------------- | --------------- | ------------------------------------------------------ |
| `type`      | `'Environment' \| 'Gradient'` | `'Environment'` | Type of background                                     |
| `blur`      | `number`                      | `0.5`           | Strength of blur on env map when type is `Environment` |
| `intensity` | `number`                      | `1`             | Strength of env map when type is `Environment`         |
| `top`       | `THREE.ColorRepresentation`   | `#444444`       | Top color of gradient when type is `Gradient`          |
| `bottom`    | `THREE.ColorRepresentation`   | `#000000`       | Bottom color of gradient when type is `Gradient`       |

### `usePathtracer`

This hook provides access to useful functions in the internal renderer. Can only be used within the `<Pathtracer />` component.

```ts
const { renderer, clear, update, refit, render } = usePathtracer()
```

| Return value | Type                                           | Description                                                                                                                          |
| ------------ | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `renderer`   | `PathTracingRenderer`                          | Internal renderer.                                                                                                                   |
| `clear`      | `() => void`                                   | Clear's the textures. Equiv to `renderer.reset()`                                                                                    |
| `update`     | `() => void`                                   | Re-calculates and re-uploads BVH. Needed when new objects/materials are added to/removed from the scene.                             |
| `refit`      | `() => void`                                   | Re-fits (NOT re-calculate) the BVH. Cheaper then `update()`. Can be called instead of `update()` when any object's transforms change |
| `render`     | `(samples?: number, paused?: boolean) => void` | Runs one instance of the internal render loop. can be used to control the internal loop in combination with `enabled={false}`        |

### `usePathtracedFrames`

Use this hook to execute a callback after each frame is done rendering. Can be used to render out frame rate independent videos or images straight from the canvas.

We recommend you the library [canvas-capture](https://github.com/amandaghassaei/canvas-capture) to capture each frame and render it out as a video or image sequence like in [this example](https://github.com/pmndrs/react-three-gpu-pathtracer/blob/main/examples/basic/src/App.js#L64).

```js
const { start, stop } = usePathtracedFrames({
  frames: 60,
  samples: 300,
  onStart: ({ gl }) => {
    CanvasCapture.init(gl.domElement)
    CanvasCapture.beginVideoRecord({ format: CanvasCapture.WEBM, name: 'vid', fps: 60 })
  },
  onFrame: (_, renderer, dt) => {
    CanvasCapture.recordFrame()
  },
  onEnd: () => {
    CanvasCapture.stopRecord()
  },
})
```

| Props     | Type                                                                       | Default     | Description                                      |
| --------- | -------------------------------------------------------------------------- | ----------- | ------------------------------------------------ |
| `frames`  | `number`                                                                   | `1`         | Maximum number of frames to capture.             |
| `samples` | `number`                                                                   | `3`         | Samples per frame.                               |
| `onStart` | `(state: RootState) => void`                                               | `undefined` | This callback runs before the first frame.       |
| `onFrame` | `(state: RootState, renderer: PathTracingRenderer, delta: number) => void` | `undefined` | This callback runs after each frame is rendered. |
| `onEnd`   | `(state: RootState) => void`                                               | `undefined` | This callback runs after the last frame.         |

| Return value | Type         | Description         |
| ------------ | ------------ | ------------------- |
| `start`      | `() => void` | Starts the capture. |
| `stop`       | `() => void` | Stops the capture.  |

> Note: The capture is stopped once the prescribed `frames` are rendered.

### Internal state

`react-three-gpu-pathtracer` also attaches a few custom properties to the renderer. They can be accessed through `renderer.__r3fState`. Here are the properties:

| Props         | Type      | Description                                                                              |
| ------------- | --------- | ---------------------------------------------------------------------------------------- |
| `initialized` | `boolean` | This flag is set to `true` as soon as the renderer is initialized.                       |
| `frames`      | `number`  | Frame count since last reset. Resets when `clear()`, `refit()` or `update(0)` is called. |
| `samples`     | `number`  | Sample count for each frame. Resets each frame.                                          |
