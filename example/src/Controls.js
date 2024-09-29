import { presetsObj } from '@react-three/drei/helpers/environment-assets'
import { folder, useControls } from 'leva'

export default function Controls() {
  return useControls({
    Rendering: folder({
      Rendering_Factor: {
        value: 1,
        max: 1,
        min: 0,
        step: 0.01,
        label: 'Resolution Factor',
      },
      Rendering_Samples: {
        value: 128,
        max: 512,
        min: 1,
        step: 1,
        label: 'Samples',
      },
      Rendering_Bounces: {
        value: 8,
        max: 20,
        min: 1,
        step: 1,
        label: 'Bounces',
      },
      Rendering_Tiles: {
        value: {
          x: 2,
          y: 2,
        },
        max: 20,
        min: 1,
        step: 1,
        label: 'Tiles',
        joystick: false,
      },
      Rendering_Enabled: {
        value: true,
        label: 'Enabled',
      },
    }),
    Environment: folder({
      Environment_Visible: {
        value: true,
        label: 'Enabled',
      },
      Environment_Preset: {
        options: Object.keys(presetsObj),
        value: 'apartment',
        label: 'Preset',
      },
      Environment_Intensity: {
        value: 1.2,
        max: 10,
        min: 0,
        step: 0.01,
        label: 'Intensity',
      },
      Environment_Blur: {
        value: 0.3,
        max: 1,
        min: 0,
        step: 0.01,
        label: 'Blur',
      },
    }),
  })
}
