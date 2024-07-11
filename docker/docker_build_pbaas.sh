# ./docker_build_pbaas.sh varrr v1.0.0

PBAAS_FOLDER=$1
VER=$2
cd ../
./customize.sh pbaas/$PBAAS_FOLDER

cd docker
./docker_build.sh pbaas.$PBAAS_FOLDER.$VER