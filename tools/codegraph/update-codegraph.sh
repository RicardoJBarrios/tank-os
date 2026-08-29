#!/usr/bin/env bash

set -u

repo_root="$(git rev-parse --show-toplevel)"

if ! command -v cgr >/dev/null 2>&1; then
  echo "Code-Graph-RAG no está instalado; omitiendo sincronización." >&2
  exit 0
fi

# Run from a neutral directory so CGR does not interpret the repository's
# application `.env` as its own configuration file.
cd /tmp || exit 0

exec cgr --quiet start \
  --repo-path "$repo_root" \
  --update-graph \
  --no-embeddings \
  --no-start-stack \
  --no-instructions
