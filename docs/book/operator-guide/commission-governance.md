# Commission and governance

While most node parameters can be changed using the StorageNodeCap and are automatically updated
based on the values in the node configuration, authorization for contract upgrades and for
withdrawing the storage node commission is handled separately, to ensure that the hot wallet on the
storage node does not need to be authorized for these operations.

We strongly recommend to all node operators to designate secure wallets for these operations that
are not stored on the storage node machines.

This page explains how to update the entities that are authorized for governance (i.e. contract
upgrade) and commission operations and how these operations are performed.

## Update the commission receiver and entity authorized for governance

It is possible to either designate an arbitrary object as a capability for governance/commission
operations or to designate an address to be authorized.

```admonish warning
Once set, only the authorized entity (either based on the address or capability) can
change the authorization again, so only set it to addresses/objects that you control and make sure
they remain accessible.
```

To set the authorization to receive the commission and perform governance operations you can either
use the `walrus` binary in your CLI, or you can use the [node operations web interface](https://stake-wal.wal.app/node-operations).

### Using the CLI

The following assumes that you have the `walrus` binary [correctly set up](../usage/setup.md), using
the wallet that is currently authorized to perform these operations. If this is the first time
updating the authorized entities, this will be the wallet that you used to setup the storage node.
To specify a wallet and/or config that are not in the standard locations, you can specify them using
the `--wallet` and `--config` command line arguments.

Note that the authorized entities for commission and governance are independent, i.e., they do not
need to be set to the same address or object.

```sh
NODE_ID=            # Set this to your node ID.
COMMISSION_AUTHORIZED_ADDRESS= # Set this to a secure wallet address that you control.
GOVERNANCE_AUTHORIZED_ADDRESS= # Set this to a secure wallet address that you control.
walrus node-admin set-commission-authorized --node-id $NODE_ID --address $COMMISSION_AUTHORIZED_ADDRESS
walrus node-admin set-governance-authorized --node-id $NODE_ID --address $GOVERNANCE_AUTHORIZED_ADDRESS
```

Instead of specifying an authorized address using the `--address` flag, an arbitrary object can be
designated as capability, using the `--object` flag:

```sh
NODE_ID=           # Set this to your node ID.
COMMISSION_AUTHORIZED_OBJECT= # Set this to the ID of an object that you own in a secure wallet.
GOVERNANCE_AUTHORIZED_OBJECT= # Set this to the ID of an object that you own in a secure wallet.
walrus node-admin set-commission-authorized --node-id $NODE_ID --object $COMMISSION_AUTHORIZED_OBJECT
walrus node-admin set-governance-authorized --node-id $NODE_ID --object $GOVERNANCE_AUTHORIZED_OBJECT
```

### Using the web interface

Go to the [operator panel on the staking dApp](https://stake-wal.wal.app/node-operations), connect
your wallet and select your node either through the drop-down menu or by pasting your node ID.
Then select `Set Commission Receiver` or `Set Governance Authorized` and follow the steps to send
the transaction.

## Collecting commission

To collect your commission, you can again either use the CLI or the web interface. To use the CLI,
make sure that `walrus` is configured to use the authorized wallet and run the following command:

```sh
NODE_ID=           # Set this to your node ID.
walrus node-admin --node-id $NODE_ID collect-commission
```

To use the web interface, go to the
[operator panel on the staking dApp](https://stake-wal.wal.app/node-operations), connect
your wallet and select your node either through the drop-down menu or by pasting your node ID.
Then select `Collect Commission` and follow the steps to send the transaction.

## Contract upgrades

Contract upgrades in Walrus are managed through a quorum-based voting system. This ensures that
upgrades are only applied after sufficient consensus among node operators. The process requires
computing a digest of the proposed upgrade and voting on it.

### Voting for quorum-based upgrades

When a contract upgrade is proposed, the proposer will generally share the code of the proposed
upgrade with other node operators. For example, if the Walrus Foundation proposes an upgrade, it
will share a specific commit hash in a branch on the [Walrus GitHub Repository](https://github.com/MystenLabs/walrus)
that contains the proposed change in either the `testnet-contracts/walrus` or the
`mainnet-contracts/walrus` directory, depending on whether the Testnet or Mainnet contracts are
being upgraded.

The vote needs to complete within one epoch, otherwise the committee changes and the vote needs to
be repeated. To vote for an upgrade, complete the following steps.

#### Computing the upgrade digest

Operators should compute the package digest of the package to upgrade. It is important here that
the same compiler version is used and the correct Sui network is specified. If you use a standard
[Walrus Configuration](../usage/setup.html#configuration), the Sui network will be selected
automatically when specifying the Walrus network using the `--context` flag and using the up-to-date
`walrus` version will ensure that the compiler version is consistent across all voters.

To compute the digest of a proposed upgrade, you should use the `walrus node-admin` command.
Assuming that your current working directory is the root of the Walrus repository and you have
checked out the correct commit, you would use the following command for Testnet upgrades:

```sh
walrus node-admin package-digest --package-path testnet-contracts/walrus --context testnet
```

And the following for Mainnet upgrades:

```sh
walrus node-admin package-digest --package-path mainnet-contracts/walrus --context mainnet
```

The command will output a digest (as Hex and Base64) that you can use to verify the proposal and
vote on the upgrade.

#### Voting on upgrades using the web interface

Voting on an upgrade using the web interface is the easiest way and also allows you to use any
wallet supported by your browser (e.g. hardware wallets) To vote through the web interface:

1. Go to the [operator panel on the staking dApp](https://stake-wal.wal.app/node-operations).
1. Connect your wallet and select your node.
1. Navigate to the "Vote on Upgrade" section.
1. Paste the Base64 package digest from the previous step.
1. Follow the prompts to submit your vote.

#### Voting on upgrades using the CLI

To vote on an upgrade using the CLI, ensure that your `walrus` binary is configured with the authorized
wallet, and that you are on the correct branch in the root directory of the Walrus repository.
Then run the following for Testnet:

```sh
NODE_ID=   # Set this to your node ID.
PACKAGE_PATH=testnet-contracts/walrus
UPGRADE_MANAGER_OBJECT_ID=0xc768e475fd1527b7739884d7c3a3d1bc09ae422dfdba6b9ae94c1f128297283c
walrus node-admin vote-for-upgrade \
    --node-id $NODE_ID \
    --upgrade-manager-object-id $UPGRADE_MANAGER_OBJECT_ID \
    --package-path $PACKAGE_PATH \
    --context testnet
```

And for Mainnet upgrades:

```sh
NODE_ID=   # Set this to your node ID.
PACKAGE_PATH=mainnet-contracts/walrus
UPGRADE_MANAGER_OBJECT_ID=0xc42868ad4861f22bd1bcd886ae1858d5c007458f647a49e502d44da8bbd17b51
walrus node-admin vote-for-upgrade \
    --node-id $NODE_ID \
    --upgrade-manager-object-id $UPGRADE_MANAGER_OBJECT_ID \
    --package-path $PACKAGE_PATH \
    --context mainnet
```

#### Upgrade completion

Once a quorum of node operators (by number of shards) has voted in favor of a proposal, the contract
upgrade can be finalized. This will usually be done by the proposer using a PTB that calls the
respective functions to authorize, execute, and commit the upgrade. Then, depending on the upgrade,
either at the start of the next epoch or immediately, the system and staking objects are migrated to
the new version, by calling the `migrate` function in the `init` module of the `walrus` package.
The upgrade and migration can both be performed using the `walrus-deploy` binary.
