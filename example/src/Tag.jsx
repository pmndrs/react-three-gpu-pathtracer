import { Logo } from '@pmndrs/branding'
import { FaGithub } from 'react-icons/fa'

export default function Tag() {
  return (
    <div className="copy">
      <a
        style={{
          fontSize: '1.5rem',
          color: 'white',
          textDecoration: 'underline',
        }}
        target="_blank"
        rel="noopener"
        href="https://github.com/pmndrs/react-three-gpu-pathtracer"
      >
        @react-three/gpu-pathtracer
      </a>{' '}
      <div>
        <span>
          <a target="_blank" rel="noopener" href="https://github.com/pmndrs">
            <Logo />
          </a>
        </span>

        <span
          style={{
            fontSize: '0.75rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <span>
              <a target="_blank" rel="noopener" href="https://github.com/pmndrs/react-three-gpu-pathtracer">
                @react-three/gpu-pathtracer
              </a>{' '}
              is a React port of{' '}
              <a target="_blank" rel="noopener" href="https://github.com/gkjohnson/three-gpu-pathtracer">
                three-gpu-pathtracer
              </a>{' '}
              by{' '}
              <a target="_blank" rel="noopener" href="https://twitter.com/garrettkjohnson">
                Garrett Johnson
              </a>
            </span>
            <span>
              GameBoy model by <a href="https://sketchfab.com/kleingeo">(@kleingeo)</a>{' '}
              <a hef="https://sketchfab.com/3d-models/game-boy-classic-0ae80019e6f046168923286d7e628f6f">
                on Sketchfab
              </a>
              . GameBoy Cartridge by <a href="https://sketchfab.com/kleingeo">(@MeBob)</a>{' '}
              <a hef="https://sketchfab.com/3d-models/gameboy-cartridge-lowpoly-8b9728eab16c4056ac2636ae7f0f038f">
                on Sketchfab
              </a>
              .
            </span>
          </div>
        </span>
        <span>
          <a target="_blank" rel="noopener" href="https://github.com/pmndrs/react-three-gpu-pathtracer">
            <FaGithub size={40} />
          </a>
        </span>
      </div>
    </div>
  )
}
