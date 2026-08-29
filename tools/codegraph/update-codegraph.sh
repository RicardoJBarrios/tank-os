#!/usr/bin/env bash

set -u

repo_root="$(git rev-parse --show-toplevel)"

if ! command -v cgr >/dev/null 2>&1; then
  echo "Code-Graph-RAG no está instalado; omitiendo sincronización." >&2
  exit 0
fi

exec cgr --quiet start \
  --repo-path "$repo_root" \
  --update-graph \
  --no-embeddings \
  --no-start-stack \
  --no-instructions
