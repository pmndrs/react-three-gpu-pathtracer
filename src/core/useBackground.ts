import { useThree } from '@react-three/fiber'
import * as React from 'react'
import * as THREE from 'three'
import { PathtracerAPI, PathtracerBackground } from '../types'

export default function useBackground(api: PathtracerAPI, background: Partial<PathtracerBackground>) {
  const scene = useThree((s) => s.scene)
  const gl = useThree((s) => s.gl)
  const ptRenderer = api.renderer
  const backgroundEnv = background.type === 'Environment' ? background : undefined
  const backgroundGrad = background.type === 'Gradient' ? background : undefined

  React.useEffect(() => {
    ptRenderer.material.environmentBlur = backgroundEnv?.blur
  }, [backgroundEnv?.blur])
  React.useEffect(() => {
    ptRenderer.material.environmentIntensity = backgroundEnv?.intensity
  }, [backgroundEnv?.intensity])

  React.useEffect(() => {
    ptRenderer.reset()
    ptRenderer.material.setDefine('GRADIENT_BG', Number(background.type === 'Gradient'))
    if (background.type !== 'Environment') {
      ptRenderer.material.environmentMap = null
    }
  }, [background.type])

  React.useEffect(() => {
    ptRenderer.reset()
    ptRenderer.material.uniforms.bgGradientTop.value.set(new THREE.Color(backgroundGrad?.top))
  }, [backgroundGrad?.top])
  React.useEffect(() => {
    ptRenderer.reset()
    ptRenderer.material.uniforms.bgGradientBottom.value.set(new THREE.Color(backgroundGrad?.bottom))
  }, [backgroundGrad?.bottom])

  React.useEffect(() => {
    if (scene.environment) {
      const pmremGenerator = new THREE.PMREMGenerator(gl)
      pmremGenerator.compileCubemapShader()

      const envMap = pmremGenerator.fromEquirectangular(scene.environment)
      api.renderer.material.environmentMap = envMap.texture
    }
  }, [scene.environment, background])
}
