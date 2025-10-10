# Storage costs

Storing blobs on Walrus Mainnet consumes WAL for the storage operation, and SUI for executing
transactions on Sui. This section provides a summary of the costs involved, and also some
advice on how to manage or minimize them for specific scenarios.

This document deals with costs of storage specifically. You can find a wider discussion about
the [WAL tokenonmics](https://www.walrus.xyz/wal-token), and the role it plays in the
[Walrus delegated proof of stake system](../walrus.pdf) elsewhere.

## Understanding the 4 sources of cost

The four sources of cost associated with Walrus Storage are acquiring storage resources, uploads,
Sui transactions, and Sui objects on chain:

- **Storage resources.** A storage resource is needed to store a blob, with an appropriate capacity
  and epoch duration.
  Storage resources can be acquired from the Walrus system contract while there is free space
  available on the system against some WAL. Other options are also available, such as receiving it
  from other parties, or splitting a larger resource bought occasionally into smaller ones (see
  discussion below).

- **Upload costs.** Upon blob registration, some WAL is charged to cover the costs of data upload.
  This ensures that deleting blobs and reusing the same storage resource for storing a new blob is
  sustainable for the system.

- **Sui transactions.** Storing a blob involves up to three on-chain actions on Sui.
  One to acquire a storage resource, another (possibly combined with the first) to
  register the blob and associate it with a blob ID, and a final one to certify the blob
  as available. These incur some Sui gas costs in SUI to cover the costs of
  computation.

- **On chain objects.** Finally, Walrus blobs are represented as Sui objects
  on-chain. Creating these objects sets aside some SUI into the Sui storage fund,
  and most of it is refunded when the objects are deleted after they are not needed
  any more.

The size of the storage resource needed to store a blob, and the size taken into account to pay
for the upload costs, corresponds to the *encoded size* of a
blob. The encoded size of a blob is the size of the erasure coded blob, which is about 5x larger
than the unencoded original blob size, and the size of some metadata that is independent of the
size of the blob. Since the fixed size per-blob metadata is quite large (about 64MB in the worse
case), the cost of storing small blobs (< 10MB) is dominated by this, and the size of storing
larger blobs is dominated by their increasing size. See
[Reducing costs for small blobs](#reducing-costs-for-small-blobs) for more information on cost
optimization strategies.

The Walrus CLI uses some strategies to lower costs but is not guaranteed to be optimal for all
use-cases. For high volume or other cost sensitive users there may be strategies that further
lower costs, which we discuss below.

## Measuring costs

<!-- WAL-723: Update this after changes are made to cost outputs. -->

The most accurate way to measure the costs of a store for a certain size is to perform a store
for a blob of the same size, and observe the costs in SUI and WAL in a Sui explorer (or directly
through Sui RPC calls). Blob contents do not affect costs.

A `walrus store <FILENAME> --epochs 1` command will result in 2 transactions:

- The first transaction will perform a `reserve_space` (if no storage resource of
  appropriate size exists) and `register_blob`; and will affect the balances of both
  SUI and WAL.

- The second will perform a single call to `certify_blob` and will only change the SUI balance.

You can observe the storage rebate on an explorer by burning the resulting blob objects
using the command `walrus burn-blobs --object-ids <BLOB_OBJECT_ID>`. As discussed below,
burning the object on Sui does not delete the blob on Walrus.

As a rule of thumb, the SUI costs of `register_blob` and `certify_blob` are independent of
blob size or epoch lifetime. The WAL costs of `register_blob` are linear in the encoded size of
the blob (both erasure coding and metadata). Calls to `reserve_space` have SUI costs that
grow in the number of epochs, and WAL costs linear with both encoded size and the number of epochs.

A few commands output information that can assist in cost estimations, without submitting
transactions:

- The `walrus info` command displays the current costs for buying storage resources from the
  system contract and also cost of uploads.

- The `walrus store --dry-run ...` command outputs the encoded size that is used in calculations
  of WAL costs. The `--dry-run` parameter ensures no transactions are submitted on chain.

## Managing and minimizing costs

There are multiple ways of acquiring storage resources, which impact their costs.

The primary means is by sending some WAL to the Walrus system contract to "buy" a storage resource
for some size in bytes and a defined lifetime in epochs.

Furthermore, before acquiring a storage resource, the CLI client will use any user-owned storage
resource of an appropriate length (in epochs and size in bytes). However, the current implementation
does not make any attempts yet to properly split or merge storage resources.

<!-- TODO(WAL-363): Update this as soon as better storage management is implemented. -->

There are a few ways to minimize costs associated with the need for storage resources. First,
acquiring resources from the system contract involves at least one Sui
transaction interacting with a relatively complex shared object Sui smart contract. Therefore,
acquiring larger storage resources at once both in length and size minimizes the SUI gas costs.
Storage resources can then be split and merged to store smaller blobs or blobs for shorter time
periods. Packing multiple smart contract calls into a single Sui PTB to manage storage resource
acquisition, splitting and merging can also keep costs down.

Storage resources can be reclaimed and reused for the remainder of their validity period,
by deleting non-expired blobs that were created as *deletable*.
Therefore, dapps that only need to store data for less time
than a multiple of full epochs (two weeks on Mainnet), can potentially reduce costs by actively
deleting blobs, and re-using the storage for other blobs.

Storage resources can be transferred and traded, and we foresee other markets and ways to
acquire them to exist in the future.

Registering blobs and certifying them costs SUI to cover gas costs, and WAL to cover upload costs.
Each blob needs to go through both of these and therefore not much may be done about these costs.
However, multiple blobs may be registered or certified in a single Sui PTB both to reduce latency
and, possibly, costs when storing multiple blobs. The CLI client uses this approach when uploading
multiple blobs simultaneously. Within the same PTB storage resource management actions can also be
performed to acquire storage or split/merge storage resources to further reduce latency and costs.

Each blob stored on Walrus also creates a Sui object representing the blob. While these objects are
not large and only contains metadata, storage on Sui is comparatively expensive and object costs
can add up. Once the blob validity period expires the blob object has no use and can be burned.
This will reclaim most of the storage costs associated with storage on Sui.

The blob objects are used to manage blob lifecycle, such as extending blob lifetimes, deleting
them to reclaim storage resources, or adding attributes. In case none of these actions are needed
anymore, the blob object may be burned through the CLI or a smart contract call, to save on Sui
storage costs. This does not delete the blob on Walrus. Depending on the relative costs of SUI and
WAL it might be cheaper to burn a long lived blob object, and subsequently re-registering and
re-certifying them close to the end of its lifetime to extend it.

### Reducing costs for small blobs

Walrus [Quilt](../usage/quilt.md) is a batch storage tool that reduces storage costs for small
blobs. When multiple blobs are stored together, the metadata costs are amortized across the batch.
Quilt can also significantly reduce Sui computation and storage costs, as detailed in the
[Lower Cost](../usage/quilt.md#lower-cost) section.

## The future

The Walrus team has planned initiatives to reduce costs for all blob sizes by making metadata
smaller, as well as further improving the efficiency of Quilt for small blob storage.
