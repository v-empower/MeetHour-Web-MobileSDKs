#!/usr/bin/env bash
# Wrapper so `flutter run -d chrome` launches Chrome with software WebGL enabled.
# Needed because recent Chrome removed the automatic SwiftShader WebGL fallback,
# and Flutter's `--wasm` (skwasm) renderer requires a WebGL context to paint.
# Usage: CHROME_EXECUTABLE="$(pwd)/tools/chrome-wasm.sh" flutter run -d chrome --wasm
exec google-chrome --enable-unsafe-swiftshader "$@"
