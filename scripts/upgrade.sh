for d in ./examples/* ; do
    cd $d
    yarn add @react-three/gpu-pathtracer@latest
    cd ../../
done