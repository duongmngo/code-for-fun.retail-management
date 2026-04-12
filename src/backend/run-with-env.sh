#!/bin/bash

# ==================================================
# Run Spring Boot Application with Environment Variables
# ==================================================
# This script loads .env file and runs the application
#
# Usage:
#   ./run-with-env.sh              # Run with default .env
#   ./run-with-env.sh .env.local   # Run with custom env file
# ==================================================

set -a  # automatically export all variables

# Load environment file
ENV_FILE="${1:-.env}"

if [ -f "$ENV_FILE" ]; then
    echo "📦 Loading environment variables from: $ENV_FILE"
    source "$ENV_FILE"
    echo "✅ Environment variables loaded"
    echo ""
    echo "📋 Configuration:"
    echo "   Profile: ${SPRING_PROFILES_ACTIVE:-local}"
    echo "   Port: ${SERVER_PORT:-8080}"
    echo "   Database: ${DATABASE_URL:-jdbc:postgresql://localhost:5432/retail_management}"
    echo ""
else
    echo "⚠️  Warning: $ENV_FILE not found. Using default values from application.yml"
    echo ""
fi

set +a

# Run the application
echo "🚀 Starting application..."
echo ""
./gradlew bootRun

