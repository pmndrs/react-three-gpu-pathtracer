import {
  FogVolumeMaterial as PathTracerFogVolumeMaterial,
  PhysicalCamera as PathTracerPhysicalCamera,
  PhysicalSpotLight as PathTracerPhysicalSpotLight,
  ShapedAreaLight as PathTracerShapedAreaLight
} from "three-gpu-pathtracer";
import { getPathtracerComponent } from "./getPathtracerComponent";

export * from "./Pathtracer";

export const PhysicalSpotLight = getPathtracerComponent(PathTracerPhysicalSpotLight, true, false); // prettier-ignore
export const ShapedAreaLight = getPathtracerComponent(PathTracerShapedAreaLight, true, false); // prettier-ignore
export const PhysicalCamera = getPathtracerComponent(PathTracerPhysicalCamera, false, true); // prettier-ignore
export const FogVolumeMaterial = getPathtracerComponent(PathTracerFogVolumeMaterial, false, false); // prettier-ignore

export { getPathtracerComponent };
