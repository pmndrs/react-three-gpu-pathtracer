import { Logo } from '@pmndrs/branding'
import { FaGithub } from 'react-icons/fa'

export default function Tag() {
  return (
    <div className="copy">
      <div>
        <span>
          <a target="_blank" rel="noopener" href="https://github.com/pmndrs">
            <Logo />
          </a>
        </span>

        <span>
          <span>
            Demo Made with 🧡 by{' '}
            <a target="_blank" rel="noopener" href="https://twitter.com/CantBeFaraz">
              Faraz Shaikh
            </a>
          </span>
        </span>

        <span>
          <a target="_blank" rel="noopener" href="https://github.com/pmndrs/react-three-gpu-pathtracer">
            <FaGithub size={40} />
          </a>
        </span>
      </div>
      <span
        style={{
          fontSize: '14px',
        }}
      >
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
    </div>
  )
}
