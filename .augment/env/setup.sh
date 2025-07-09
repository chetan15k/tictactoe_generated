#!/bin/bash
set -e

# Update system packages
sudo apt-get update

# Install Node.js 20 (LTS) and npm
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify Node.js and npm installation
node --version
npm --version

# Navigate to workspace directory
cd /mnt/persist/workspace

# Install project dependencies
npm install

# Add npm global bin to PATH in user profile
echo 'export PATH="$HOME/.npm-global/bin:$PATH"' >> $HOME/.profile
echo 'export PATH="./node_modules/.bin:$PATH"' >> $HOME/.profile

# Source the profile to make PATH available immediately
source $HOME/.profile

# Verify vitest is available
npx vitest --version