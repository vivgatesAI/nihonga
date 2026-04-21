#!/bin/bash
set -e
npx prisma generate 2>/dev/null || true
npx next start