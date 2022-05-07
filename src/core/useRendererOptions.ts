import { useThree } from '@react-three/fiber'
import * as React from 'react'
import * as THREE from 'three'
import { PathtracerAPI, PathtracerProps } from '../types'

export default function useRendererOptions(
  api: PathtracerAPI,
  bounces: PathtracerProps['bounces'],
  tiles: PathtracerProps['tiles']
) {
  React.useLayoutEffect(() => {
    const t =
      tiles instanceof THREE.Vector2
        ? tiles
        : Array.isArray(tiles)
        ? new THREE.Vector2(tiles[0], tiles[1])
        : new THREE.Vector2(tiles, tiles)

    api.renderer.tiles.copy(t)
  }, [tiles])

  React.useLayoutEffect(() => {
    api.renderer.material.bounces = bounces
  }, [bounces])
}
