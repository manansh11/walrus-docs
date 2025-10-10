# Sui Structures

This section is optional and enables advanced use cases, leveraging Sui smart contract interactions
with the Walrus smart contract.

You can interact with Walrus purely through the client CLI, and JSON or HTTP APIs provided, without
querying or executing transactions on Sui directly. However, Walrus uses Sui to manage its metadata
and smart contract developers can read information about the Walrus system, as well as stored blobs,
on Sui.

The
[Move code of the Walrus system contracts](https://github.com/MystenLabs/walrus/tree/main/contracts)
is available and you can find an
[example smart contract](https://github.com/MystenLabs/walrus/tree/main/docs/examples) that
implements a wrapped blob. The following sections provide further insights into the contract and an
overview of how you may use Walrus objects in your own Sui smart contracts.

## Blob and storage objects

Walrus blobs are represented as Sui objects of type `Blob`. A blob is first registered, indicating
that the storage nodes should expect slivers from a Blob ID to be stored. Then a blob is certified,
indicating that a sufficient number of slivers have been stored to guarantee the blob's
availability. When a blob is certified, its `certified_epoch` field contains the epoch in which it
was certified.

A `Blob` object is always associated with a `Storage` object, reserving enough space for
a long enough period for the blob's storage. A certified blob is available for the period the
underlying storage resource guarantees storage.

Concretely, `Blob` and `Storage` objects have the following fields, which can be read through the
Sui SDKs:

```move
/// Reservation for storage for a given period, which is inclusive start, exclusive end.
public struct Storage has key, store {
    id: UID,
    start_epoch: u32,
    end_epoch: u32,
    storage_size: u64,
}

/// The blob structure represents a blob that has been registered to with some storage,
/// and then may eventually be certified as being available in the system.
public struct Blob has key, store {
    id: UID,
    registered_epoch: u32,
    blob_id: u256,
    size: u64,
    encoding_type: u8,
    // Stores the epoch first certified if any.
    certified_epoch: option::Option<u32>,
    storage: Storage,
    // Marks if this blob can be deleted.
    deletable: bool,
}
```

Public functions associated with these objects can be found in the respective [`storage_resource`
move module](https://github.com/MystenLabs/walrus/tree/main/contracts/walrus/sources/system/storage_resource.move)
and [`blob` move module](https://github.com/MystenLabs/walrus/tree/main/contracts/walrus/sources/system/blob.move).
Storage resources can be split and merged in time and data capacity, and can be transferred between
users allowing complex contracts to be created.

## Events

Walrus uses [custom Sui events](https://github.com/MystenLabs/walrus/blob/main/contracts/walrus/sources/system/events.move)
extensively to notify storage nodes of updates concerning stored Blobs and the state of the network.
Applications may also use Sui RPC facilities to observe Walrus related events.

When a blob is first registered, a `BlobRegistered` event is emitted that informs storage nodes
that they should expect slivers associated with its Blob ID. Eventually when the blob is
certified, a `BlobCertified` is emitted containing information about the blob ID and the epoch
after which the blob will be deleted. Before that epoch the blob is guaranteed to be available.

The `BlobCertified` event with `deletable` set to false and an `end_epoch` in the future indicates
that the blob will be available until this epoch. A light client proof that this event was emitted
for a blob ID constitutes a proof of availability for the data with this blob ID. When a deletable
blob is deleted, a `BlobDeleted` event is emitted.

The `InvalidBlobID` event is emitted when storage nodes detect an incorrectly encoded blob.
Anyone attempting a read on such a blob is guaranteed to also detect it as invalid.

System level events such as `EpochChangeStart` and `EpochChangeDone` indicate transitions
between epochs. And associated events such as `ShardsReceived`, `EpochParametersSelected`,
and `ShardRecoveryStart` indicate storage node level events related to epoch transitions,
shard migrations and epoch parameters.

## System and staking information

The [Walrus system object](https://github.com/MystenLabs/walrus/blob/main/contracts/walrus/sources/system/system_state_inner.move)
contains metadata about the available and used storage, as well as the price of storage per KiB of
storage in FROST. The committee structure within the system object can be used to read the current
epoch number, as well as information about the committee. Committee changes between epochs are
managed by a set of [staking contracts](https://github.com/MystenLabs/walrus/tree/main/contracts/walrus/sources/staking)
that implement a full delegated proof of stake system based on the WAL token.
