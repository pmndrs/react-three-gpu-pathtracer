import {
  ConstructorRepresentation,
  ElementProps,
  useThree
} from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import { usePathtracer } from "./Pathtracer";

export function getPathtracerComponent<T extends ConstructorRepresentation>(
  constructor: T,
  isLight: boolean = false,
  isCamera: boolean = false
) {
  return (props: ElementProps<T>) => {
    const { pathtracer } = usePathtracer();
    const object = useMemo(() => new constructor(), []);

    const set = useThree((state) => state.set);

    useEffect(() => {
      if (isLight) {
        pathtracer.updateLights();
      } else if (isCamera) {
        set({ camera: object });
      }

      return () => object.dispose?.();
    }, [object]);

    return <primitive object={object} {...props} />;
  };
}
