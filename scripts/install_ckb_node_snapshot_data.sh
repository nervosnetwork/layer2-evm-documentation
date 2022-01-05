#!/usr/bin/env bash

ckbBinary="./ckb"
indexerDataPath="./data/db"
snapshot="20220102-nervos-ckb-node-0.101.3-testnet-snapshot.7z"

if [ ! -f ./$ckbBinary ]; then
	echo "The ckb binary was not found in the current directory. This script should only be executed from the ckb directory."
	exit 1
fi

if [ ! -f ./$snapshot ]; then
	curl -O https://cdn-ckb-tools.sfo3.digitaloceanspaces.com/snapshots/$snapshot -L
fi

if [ -d $indexerDataPath ]; then
	rm -r $indexerDataPath
fi

7z x $snapshot -o$indexerDataPath -aoa
