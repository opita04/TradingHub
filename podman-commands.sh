#!/bin/bash
# ============================================
# TradingHub - Podman Container Commands
# ============================================

IMAGE_NAME="tradinghub"
CONTAINER_NAME="tradinghub-app"
PORT="5100"

# Build the image
build() {
    echo "🔨 Building TradingHub container image..."
    podman build -t $IMAGE_NAME -f Containerfile .
}

# Run the container
run() {
    echo "🚀 Starting TradingHub container on port $PORT..."
    podman run -d \
        --name $CONTAINER_NAME \
        -p $PORT:80 \
        --restart unless-stopped \
        $IMAGE_NAME
    echo "✅ TradingHub is running at http://localhost:$PORT"
}

# Stop the container
stop() {
    echo "⏹️  Stopping TradingHub container..."
    podman stop $CONTAINER_NAME
    podman rm $CONTAINER_NAME
}

# View logs
logs() {
    podman logs -f $CONTAINER_NAME
}

# Rebuild and restart
restart() {
    stop
    build
    run
}

# Show container status
status() {
    podman ps -a --filter name=$CONTAINER_NAME
}

# Help
help() {
    echo "TradingHub Podman Commands"
    echo "=========================="
    echo "  build   - Build the container image"
    echo "  run     - Run the container (port $PORT)"
    echo "  stop    - Stop and remove the container"
    echo "  restart - Rebuild and restart"
    echo "  logs    - View container logs"
    echo "  status  - Show container status"
}

# Execute command
case "$1" in
    build)   build ;;
    run)     run ;;
    stop)    stop ;;
    restart) restart ;;
    logs)    logs ;;
    status)  status ;;
    *)       help ;;
esac
