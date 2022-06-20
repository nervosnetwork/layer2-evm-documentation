# Blockchain Indexer (graph-node)

A blockchain indexer is often a must when it comes to developing decentralized applications and fetching data from the chain.

The most popular blockchain indexer - graph-node - fully works on Godwoken.

How to run graph-node:

1. Clone [https://github.com/graphprotocol/graph-node/](https://github.com/graphprotocol/graph-node/) repository.
2. Modify "docker/docker-compose.yml" file to add support for Godwoken:

```
ethereum: 'godwoken-testnet:no_eip1898,archive,traces:https://godwoken-testnet-v1.ckbapp.dev'
GRAPH_GETH_ETH_CALL_ERRORS: 'revert'
```

3\. Start graph-node using Docker Compose.



These are all the steps required have fully working blockchain indexer on Godwoken.
