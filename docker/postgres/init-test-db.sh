#!/bin/sh

set -e

# Perform all actions as $POSTGRES_USER
export PGUSER="$POSTGRES_USER"

echo "$TEST_DB_NAME"

# Create the 'test' db
"${psql[@]}" <<- EOSQL
CREATE DATABASE $TEST_DB_NAME;
EOSQL
