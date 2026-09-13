#!/bin/bash
set -e

echo "🧹 Cleaning up leftover Next 16 scaffold..."
rm -rf node_modules package-lock.json app AGENTS.md CLAUDE.md next-env.d.ts eslint.config.mjs
rm -f public/*.svg

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🔍 Running TypeScript type check..."
npm run typecheck

echo ""
echo "🏗️  Building production bundle..."
npm run build

echo ""
echo "✅ Build complete! Start the dev server with:"
echo "   npm run dev"
