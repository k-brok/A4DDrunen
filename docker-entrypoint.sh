#!/bin/sh
set -e

pnpm payload migrate
exec node server.js