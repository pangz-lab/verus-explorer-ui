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

echo "Creating build files ..."
./dist.sh

echo "Building $IMAGE_OWNER/$IMAGE_NAME image with version: $VERSION"
sudo docker build -t $IMAGE_OWNER/$IMAGE_NAME:$VERSION .
#sudo docker run -d --env-file .env -p 2221:80 pangzlab/verus-explorer-ui 