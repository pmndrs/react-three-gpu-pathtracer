import { presetsObj } from '@react-three/drei/helpers/environment-assets'
import { folder, useControls } from 'leva'

export default function Controls() {
  return useControls({
    Rendering: folder({
      Rendering_Scale: {
        value: 0.5,
        max: 1,
        min: 0,
        step: 0.01,
        label: 'Resolution Scale',
      },
      Rendering_Samples: {
        value: 3,
        max: 20,
        min: 1,
        step: 1,
        label: 'Samples',
      },
      Rendering_Bounces: {
        value: 4,
        max: 20,
        min: 1,
        step: 1,
        label: 'Bounces',
      },
      Rendering_Tiles: {
        value: {
          x: 1,
          y: 1,
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
      Rendering_Paused: {
        value: false,
        label: 'Paused',
      },
    }),
    Background: folder({
      Background_Type: {
        options: ['Environment', 'Gradient'],
        value: 'Gradient',
        label: 'Type',
      },
    }),
    Gradient: folder({
      Gradient_ColorTop: {
        value: '#8a5004',
        label: 'Color Top',
      },
      Gradient_ColorBottom: {
        value: '#000000',
        label: 'Color Bottom',
      },
    }),
    Environment: folder({
      Environment_Preset: {
        options: Object.keys(presetsObj),
        value: 'apartment',
      },
      Environment_Intensity: {
        value: 3,
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
