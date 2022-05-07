import * as React from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import {
  PathTracingRenderer,
  PhysicalPathTracingMaterial,
  PathTracingSceneGenerator,
  // @ts-ignore
} from 'three-gpu-pathtracer'
import { FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass'
import { PathtracerAPI } from './types'

const identity = {
  position: new THREE.Vector3(0, 0, 0),
  scale: new THREE.Vector3(0, 0, 0),
  rotation: new THREE.Euler(0, 0, 0),
}
export function API(): {
  api: PathtracerAPI
  quad: FullScreenQuad
} {
  const camera = useThree((s) => s.camera)
  const scene = useThree((s) => s.scene)
  const gl = useThree((s) => s.gl)

  const { ptRenderer, generator, fsQuad } = React.useMemo(() => {
    const ptMaterial = new PhysicalPathTracingMaterial()
    const ptRenderer = new PathTracingRenderer(gl)
    const generator = new PathTracingSceneGenerator()
    ptRenderer.camera = camera
    ptRenderer.material = ptMaterial

    const fsQuad = new FullScreenQuad(
      new THREE.MeshBasicMaterial({
        map: ptRenderer.target.texture,
        transparent: true,
      })
    )

    return { ptMaterial, ptRenderer, generator, fsQuad }
  }, [])

  return {
    api: {
      reset: () => {
        ptRenderer.reset()
      },
      update: () => {
        ptRenderer.reset()
        scene.traverse((obj) => {
          if (
            !obj.position.equals(identity.position) ||
            !obj.rotation.equals(identity.rotation) ||
            !obj.scale.equals(identity.scale)
          ) {
            obj.updateMatrixWorld()
          }
        })

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
        ptRenderer.__initialized = true
      },
      renderer: ptRenderer,
    },
    quad: fsQuad,
  }
}
