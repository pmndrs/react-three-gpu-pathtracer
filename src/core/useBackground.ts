import { useThree } from '@react-three/fiber'
import * as React from 'react'
import * as THREE from 'three'
import { PathtracerAPI, PathtracerBackground } from '../types'

export default function useBackground(api: PathtracerAPI, background: Partial<PathtracerBackground>) {
  const scene = useThree((s) => s.scene)
  const gl = useThree((s) => s.gl)
  const ptRenderer = api.renderer

  React.useLayoutEffect(() => {
    ptRenderer.material.environmentBlur = background.blur
  }, [background.blur])
  React.useLayoutEffect(() => {
    ptRenderer.material.environmentIntensity = background.intensity
  }, [background.intensity])

  React.useLayoutEffect(() => {
    ptRenderer.reset()
    ptRenderer.material.setDefine('GRADIENT_BG', Number(background.type === 'Gradient'))
  }, [background.type])

  React.useLayoutEffect(() => {
    ptRenderer.reset()
    ptRenderer.material.uniforms.bgGradientTop.value.set(new THREE.Color(background.top))
  }, [background.top])
  React.useLayoutEffect(() => {
    ptRenderer.reset()
    ptRenderer.material.uniforms.bgGradientBottom.value.set(new THREE.Color(background.bottom))
  }, [background.bottom])

  React.useLayoutEffect(() => {
    if (scene.environment) {
      const pmremGenerator = new THREE.PMREMGenerator(gl)
      pmremGenerator.compileCubemapShader()

      const envMap = pmremGenerator.fromEquirectangular(scene.environment)
      api.renderer.material.environmentMap = envMap.texture
    }
  }, [scene.environment])
}
