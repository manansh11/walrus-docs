# Announcing Mainnet

Published on: 2025-03-27

## A decentralized network: Mainnet

The production Walrus Mainnet is now live, and operated by
a decentralized network of over 100 storage nodes. Epoch 1 begun on March 25, 2025. The
network can now be used to
[publish and retrieve blobs](../usage/interacting.md),
[upload and browse Walrus Sites](../walrus-sites/tutorial-publish.md), as
well as [stake and unstake](https://stake-wal.wal.app/) to determine future committees using the
live
[Mainnet WAL token](https://www.walrus.xyz/wal-token).
On Mainnet, the Walrus security properties hold. And Walrus is now ready to satisfy
the needs of real applications.

Walrus is [open source](https://github.com/MystenLabs/walrus).
The Walrus protocol health is overseen by an
[independent foundation](https://www.walrus.xyz/) that is now
[well resourced](https://www.walrus.xyz/blog/walrus-foundation-fundraising) to support future
development and growth.
And, the community is collecting tools, resources and dapps for Walrus under
[Awesome Walrus!](https://github.com/MystenLabs/awesome-walrus)

This is a significant milestone a little over 12 months after an initial small team started
designing the Walrus protocol. And a special thanks is due to the community of storage operators
that supported the development of Walrus through consecutive Testnet(s), as well as all
community members that integrated the protocol early and provided feedback to improve it.

## New features

Besides the promise of stability and security, the Mainnet release of Walrus comes with a few
notable new features and changes:

- **Blob attributes.** Each Sui blob objects can have multiple attributes and values attached to it,
  to encode application meta-data. The aggregator uses this facility for returning common HTTP
  headers.

- **Burn blob objects on Sui**. The command line `walrus` tool is extended with commands to
  "burn" Sui blob objects to reclaim the associated storage fee, making it cheaper to store blobs.

- **CLI expiry time improvements.** Now blob expiry can be expressed more flexibly when storing
  blobs, through `--epochs max`, an RFC3339 date with `--earliest-expiry-time`, or the concrete end
  epoch with `--end-epoch`.

- **RedStuff with Reed-Solomon codes.** The erasure code underlying
  RedStuff was changed from RaptorQ to Reed-Solomon (RS) codes. Intense benchmarking suggests their
  performance, for our parameter set, is similar, and the use of RS codes provides perfect
  robustness, in that blobs can always be reconstructed given a threshold of slivers. We
  thank [Joachim Neu](https://www.jneu.net/) for extensive feedback on this topic.

- **TLS handing for storage node.** Storage nodes can now be configured to serve TLS certificates
  that are publicly trusted, such as those issues by cloud providers and public authorities such as
  Let's Encrypt. This allows JavaScript clients to directly store and retrieve blobs from Walrus.

- **JWT authentication for publisher.** Now the publisher can be configured to only provide
  services to authenticated users via consuming JWT tokens that can be distributed through any
  authentication mechanism.

- **Extensive logging and metrics.** All services, from the storage node to aggregator and publisher
  export metrics that can be used to build dashboards, and logs at multiple levels to troubleshoot
  their operation.

- **Health endpoint.** Storage nodes and the CLI include a `health` command to check the status and
  basic information of storage nodes. This is useful when allocating stake as well as monitoring
  the network.

- **Walrus Sites updates.** The Mainnet Walrus Sites public portal will be hosted on the
  `wal.app` domain name. Now Walrus Sites support deletable blobs to make their updates more
  capital efficient. Those operating their own portals may also use their own domain names to serve
  a Walrus Site. The
  [Staking](https://stake-wal.wal.app/),
  [Docs](https://docs.wal.app),
  [Snowreads](https://snowreads.wal.app), and
  [Flatland](https://flatland.wal.app)
  Walrus Sites are now on Mainnet.

- **A subsidies contract.** The Mainnet release of Walrus requires WAL for storing blobs, however
  to enable early adopters to try the system, transition to it, the Walrus foundation operates a
  smart contract to
  [acquire subsidized storage](https://github.com/MystenLabs/walrus/tree/main/contracts/subsidies).
  The CLI client uses it automatically when storing blobs.

## Testnet future plans

The current Walrus Testnet will soon be wiped and restarted to align the codebase to the Mainnet
release. Going forward we will regularly wipe the Testnet, every few months. Developers should use
the Walrus Mainnet to get any level of stability. The Walrus Testnet is only there to test new
features before they are deployed in production.

We will not be operating a public portal to serve Walrus Sites on Testnet, to reduce costs and
incident response associated with free web hosting. Developers can still run a local portal
pointed to Testnet to test Walrus Sites.

## Open source Walrus codebase

The Walrus codebase, including all smart contracts in Move, services in Rust, and documentation, is
now open sourced under an Apache 2.0 license, and hosted on
[GitHub](https://github.com/MystenLabs/walrus). Since the main Walrus repository is now open to all,
and contains both documentation and smart contracts, we are retiring the `walrus-docs` repository.

Developers may find the Rust CLI client, and associated aggregator and publisher services of most
interest. These can be extended to specialize services to specific operational needs. They are
also a good illustration of how to interface with Walrus using Rust clients. A cleaner and more
stable Rust SDK is in the works as well.

## Publisher improvements and plans

Publishing blobs on Mainnet consumes real WAL and SUI. To avoid uncontrolled costs to operations the
publisher service was augmented with facilities to authenticate requests and account for costs per
user.
