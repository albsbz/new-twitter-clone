#!/usr/bin/env bash
set -euo pipefail

if ! command -v ufw >/dev/null 2>&1; then
  echo "ufw is not installed. Install it first: sudo apt-get update && sudo apt-get install -y ufw"
  exit 1
fi

sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable
sudo ufw status verbose
