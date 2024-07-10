# Function to display usage information
usage() {
    echo "Usage: $0 v<version>"
    exit 1
}

# Check if a parameter is provided
if [ -z "$1" ]; then
    echo "Error: Version parameter is required."
    usage
fi

VERSION=$1
IMAGE_OWNER=pangzlab
IMAGE_NAME=verus-explorer-ui
BASE_FOLDER=docker

echo "Removing old build files ..."
rm -rf ./dist

echo "Creating build files ..."
cd ../
./dist.sh

echo "Moving build files to $BASE_FOLDER ..."
mv dist $BASE_FOLDER/

cd $BASE_FOLDER

echo "Building $IMAGE_OWNER/$IMAGE_NAME image with version: $VERSION"
sudo docker build --no-cache -t $IMAGE_OWNER/$IMAGE_NAME:latest -t $IMAGE_OWNER/$IMAGE_NAME:$VERSION .
