#!/bin/bash
# InfinityFree Deployment Script

echo "🚀 Building Gem Focus for production..."

# Install dependencies
npm ci

# Build the application
npm run build

# Create a start script for InfinityFree
cat > start.sh << 'EOF'
#!/bin/bash
export NODE_ENV=production
export DB_HOST="${DB_HOST:-localhost}"
export DB_USER="${DB_USER:-root}"
export DB_PASSWORD="${DB_PASSWORD:-}"
export DB_NAME="${DB_NAME:-gem_focus}"
export ADMIN_ACCESS_KEY="${ADMIN_ACCESS_KEY:-1111}"

node .next/standalone/server.js
EOF

chmod +x start.sh

echo "✅ Build complete!"
echo ""
echo "📋 Next steps for InfinityFree deployment:"
echo "1. SSH into your InfinityFree account"
echo "2. Create a public_html/gem_focus directory"
echo "3. Upload the .next/standalone directory and public folder"
echo "4. Create .env file with your MySQL credentials"
echo "5. Configure Node.js entry point to use the start.sh script"
echo ""
echo "MySQL Configuration needed on InfinityFree:"
echo "- DB_HOST: (your InfinityFree MySQL host)"
echo "- DB_USER: (your InfinityFree MySQL user)"
echo "- DB_PASSWORD: (your InfinityFree MySQL password)"
echo "- DB_NAME: (your database name)"
