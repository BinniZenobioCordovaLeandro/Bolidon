#!/usr/bin/env bash

# Script to generate app icons, adaptive icons, and splash screen from a single source image using ImageMagick

# Source image (must be a square, high-resolution PNG, e.g., 1024x1024 or higher)
SRC="./assets/logo.png"

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null
then
  echo "ImageMagick not found. Please install it via 'brew install imagemagick'."
  exit 1
fi

# Android icon sizes (ldpi, mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi)
declare -A icon_sizes=(
  ["icon-ldpi.png"]=36
  ["icon-mdpi.png"]=48
  ["icon-hdpi.png"]=72
  ["icon-xhdpi.png"]=96
  ["icon-xxhdpi.png"]=144
  ["icon-xxxhdpi.png"]=192
)

echo "Generating Android icons..."
for filename in "${!icon_sizes[@]}"; do
  size=${icon_sizes[$filename]}
  convert "$SRC" -resize ${size}x${size} "./assets/$filename"
done

# Favicon for web
echo "Generating favicon..."
convert "$SRC" -resize 48x48 "./assets/favicon.png"

# App icon for iOS and general use (1024x1024)
echo "Generating app icon..."
convert "$SRC" -resize 1024x1024 "./assets/icon.png"

# Adaptive foreground icon for Android (432x432)
echo "Generating adaptive foreground icon..."
convert "$SRC" -resize 432x432 "./assets/adaptive-icon.png"

# Splash screen image (1242x2436 for tall screens)
echo "Generating splash screen image..."
convert "$SRC" -resize 1242x2436 "./assets/splash-icon.png"

echo "All assets generated successfully."
