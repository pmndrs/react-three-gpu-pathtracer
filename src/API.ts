import * as React from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import {
  PathTracingRenderer,
  PhysicalPathTracingMaterial,
  DynamicPathTracingSceneGenerator,
  PathTracingSceneGenerator,
  // @ts-ignore
} from 'three-gpu-pathtracer'
import { FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass'
import { PathtracerAPI } from './types'

export function API(): PathtracerAPI {
  const camera = useThree((s) => s.camera)
  const scene = useThree((s) => s.scene)
  const gl = useThree((s) => s.gl)

  const { ptRenderer, generator, fsQuad } = React.useMemo(() => {
    const ptMaterial = new PhysicalPathTracingMaterial()
    const ptRenderer = new PathTracingRenderer(gl)
    const generator = new PathTracingSceneGenerator(scene)
    ptRenderer.camera = camera
    ptRenderer.material = ptMaterial

    ptRenderer.__r3fState = {
      initialized: false,
      frame: {
        count: 0,
        delta: 0,
      },
    }

    const fsQuad = new FullScreenQuad(
      new THREE.MeshBasicMaterial({
        map: ptRenderer.target.texture,
        transparent: true,
      })
    )

    return { ptMaterial, ptRenderer, generator, fsQuad }
  }, [])

  return {
    render: (samples: number = 3, paused: boolean = false) => {
      camera.updateMatrixWorld()

      if (!paused || ptRenderer.samples < 1) {
        for (let i = 0; i < samples; i++) {
          ptRenderer.update()
        }
      }

      gl.autoClear = false
      fsQuad.render(gl)
      gl.autoClear = true
    },
    clear: () => {
      ptRenderer.reset()
    },
    refit: () => {
      console.warn('TODO')
    },
    update: () => {
      ptRenderer.reset()
      scene.updateMatrixWorld()

      const { bvh, textures, materials } = generator.generate(scene)
      const geometry = bvh.geometry
      const ptMaterial = ptRenderer.material

      // update bvh and geometry attribute textures
      ptMaterial.bvh.updateFrom(bvh)
      ptMaterial.normalAttribute.updateFrom(geometry.attributes.normal)
      ptMaterial.tangentAttribute.updateFrom(geometry.attributes.tangent)
      ptMaterial.uvAttribute.updateFrom(geometry.attributes.uv)

      // update materials and texture arrays
      ptMaterial.materialIndexAttribute.updateFrom(geometry.attributes.materialIndex)
      ptMaterial.textures.setTextures(gl, 2048, 2048, textures)
      ptMaterial.materials.updateFrom(materials, textures)

      ptRenderer.material.setDefine('MATERIAL_LENGTH', materials.length)
      ptRenderer.__r3fState.initialized = true
    },
    renderer: ptRenderer,
  }
}
