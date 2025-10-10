# Using the Walrus client

The `walrus` binary can be used to interact with Walrus as a client. See the [setup
chapter](./setup.md) for prerequisites, installation, and configuration.

Detailed usage information including a full list of available commands can be viewed with

```sh
walrus --help
```

Each sub-command of `walrus` can also be called with `--help` to print its specific arguments and
their meaning.

If you have multiple *contexts* in your configuration file (as in the default one included on the
[setup page](./setup.md#configuration)), you can specify the context for each command through the
`--context` option.

You can generate a bash/zsh/fish completion script with `walrus completion` and place it in the appropriate
directory like `~/.local/share/bash-completion/completions`.

## Walrus system information

Information about the Walrus system is available through the `walrus info` command. It provides an
overview of current system parameters such as the current epoch, the number of storage nodes and
shards in the system, the maximum blob size, and the current cost in WAL for storing
blobs:

```console
$ walrus info

Walrus system information

Epochs and storage duration
Current epoch: 1
Start time: 2025-03-25 15:00:24.408 UTC
End time: 2025-04-08 15:00:24.408 UTC
Epoch duration: 14days
Blobs can be stored for at most 53 epochs in the future.

Storage nodes
Number of storage nodes: 103
Number of shards: 1000

Blob size
Maximum blob size: 13.6 GiB (14,599,533,452 B)
Storage unit: 1.00 MiB

Storage prices per epoch
(Conversion rate: 1 WAL = 1,000,000,000 FROST)
Price per encoded storage unit: 0.0001 WAL
Additional price for each write: 20,000 FROST

...
```

```admonish tip title="Epoch duration"
The epoch duration on Mainnet is 2 weeks. See [here](./networks.md#network-parameters) for other
parameters on Mainnet and Testnet.
```

```admonish tip title="FROST and WAL"
FROST is the smaller unit of WAL, similar to MIST for SUI. The conversion is also the same as for
SUI: `1 WAL = 1 000 000 000 FROST`.
```

Additional information such as encoding parameters and sizes, BFT system information, and
information on the storage nodes in the current and (if already selected) the next committee,
including their node IDs and stake and shard distribution can be viewed with various subcommands,
see `walrus info --help` for details. Note that the previous `--dev` option has been replaced by the
`all` subcommand.

The health of storage nodes can be checked with the `walrus health` command. This command takes
different options to select the nodes to check (see `walrus health --help` for details). For
example, `walrus health --committee` checks the status of all current committee members.

## Storing blobs

```admonish danger title="Public access"
**All blobs stored in Walrus are public and discoverable by all.** Therefore you must not use Walrus
to store anything that contains secrets or private data without additional measures to protect
confidentiality.
```

```admonish warning
It must be ensured that only a single process uses the Sui wallet for write actions (storing or
deleting). When using multiple instances of the client simultaneously, each of them must be pointed
to a different wallet. Note, it is possible to store multiple blobs with a single `walrus store`
command.
```

Storing one or multiple blobs on Walrus can be achieved through the following command:

```sh
walrus store <FILES> --epochs <EPOCHS>
```

A mandatory CLI argument must be set to specify the lifetime for the blob. There are currently three
ways for this:

1. The `--epochs <EPOCHS>` option indicates the number of epochs the blob should be stored for.
   There is an upper limit on the number of epochs a blob can be stored for, which is 53, corresponding
   to two years. In addition to a positive integer, you can also use `--epochs max` to store the blob
   for the maximum number of epochs. Note that the end epoch is defined as the current epoch plus the
   specified number of epochs.
1. The `--earliest-expiry-time <EARLIEST_EXPIRY_TIME>` option takes a date in RFC3339 format
   (e.g., "2024-03-20T15:00:00Z") or a more relaxed format (e.g., "2024-03-20 15:00:00") and ensures
   the blob expires after that date if possible.
1. The `--end-epoch <END_EPOCH>` option takes a specific end epoch for the blob.

```admonish warning title="End epoch"
A blob expires *at the beginning of its end epoch*. For example, a blob with end epoch `314` will
become unavailable at the beginning of epoch `314`. One consequence of this is that when storing a
blob with `--epochs 1` immediately before an epoch change, it will expire and become unavailable
almost immediately. Note that blobs can be [extended](#extending-the-lifetime-of-a-blob) only if
they have not expired.
```

You can store a single file or multiple files, separated by spaces. Notably, this is compatible
with glob patterns; for example, `walrus store *.png --epochs <EPOCHS>` will store all PNG files
in the current directory.

You can specify whether a newly stored blob is *deletable* or *permanent* through the `--deletable`
and `--permanent` option, respectively:

- A permanent blob remains available until its expiry epoch. Not even the uploader may delete it
  beforehand.
- In contrast, a deletable blob can be deleted at any point during its lifetime by the owner of the
  corresponding Sui object. See the [section on deletable blobs](#reclaiming-space-via-deletable-blobs)
  for more details.

```admonish warning title="Change of default blob persistence"
Up to (including) version 1.32, the CLI and [publisher](./web-api.md) store blobs as *permanent* by
default, requiring the user to explicitly specify a blob to be deletable. Starting with version
1.33, newly stored blobs are *deletable* by default. If you care about the blob persistence, make
sure to use the appropriate flag.
```

By default an owned `Blob` object is created. It is possible to wrap this into a shared object,
which can be funded and extended by anyone, see the [shared blobs section](#shared-blobs).

When storing a blob, the client performs a number of automatic optimizations, including the
following:

- If the blob is already stored as a *permanent blob* on Walrus for a sufficient number of epochs
  the command does not store it again. This behavior can be overwritten with the `--force`
  CLI option, which stores the blob again and creates a fresh blob object on Sui belonging to the
  wallet address.
- If the user's wallet has a storage resource of suitable size and duration, it is (re-)used instead
  of buying a new one.
- If the blob is already certified on Walrus but as a *deletable* blob or not for a sufficient
  number of epochs, the command skips sending encoded blob data to the storage nodes and just
  collects the availability certificate.

```admonish tip title="Costs"
We have a [separate page](../dev-guide/costs.md) with some considerations regarding cost.
```

### Using a Walrus upload relay

```admonish note title="Minimum CLI version"
The Walrus upload relay functionality is only available in the Walrus CLI version *v1.29* or higher.
```

A Walrus upload relay is a third party service that can help clients with limited bandwidth and
networking capabilities (a browser, for example) in storing blobs on Walrus.

The asset management on chain (buying storage, registering and certifying blobs) still happens on
the client; the upload relay just takes the unencoded blob, encodes it, and sends the slivers to the
storage nodes, finally returning the certificate. See in-depth details in the [Walrus upload relay
section](../operator-guide/upload-relay.md) of these docs.

When storing blobs with the `walrus store` command (and also when [storing
quilts](#storing-blobs-as-a-quilt)) you can use the `--upload-relay` flag with a URL to specify an
upload relay server be used by the CLI.

```admonish tip title="Tipping"
The upload relay is a third party service that may require a fee, or "tip". This tip may be a
constant SUI amount per blob stored, or dependent on the size of the blob being stored. The Walrus CLI will show you
how much tip the upload relay requires, and will ask for confirmation before continuing.

The technical details on how the tip is computed and paid are
[here](../operator-guide/upload-relay.md).
```

## Querying blob status

The status of a blob can be queried through one of the following commands:

```sh
walrus blob-status --blob-id <BLOB_ID>
walrus blob-status --file <FILE>
```

This returns whether the blob is stored and its availability period. If you specify a file with the
`--file` option,the CLI re-encodes the content of the file and derives the blob ID before checking
the status.

When the blob is available, the `blob-status` command also returns the `BlobCertified` Sui event ID,
which consists of a transaction ID and a sequence number in the events emitted by the transaction.
The existence of this event certifies the availability of the blob.

## Reading blobs

Reading blobs from Walrus can be achieved through the following command:

```sh
walrus read <some blob ID>
```

By default the blob data is written to the standard output. The `--out <OUT>` CLI option can be used
to specify an output file name. The `--rpc-url <URL>` may be used to specify a Sui RPC node to use
instead of the one set in the wallet configuration or the configuration file.

### Consistency checks

Walrus performs consistency checks to ensure that any data read from Walrus is what the writer
intended, see the [section about data
consistency](../design/encoding.md#data-integrity-and-consistency) for further details. Before `v1.37`
the Walrus CLI and aggregator always perform the [strict consistency check](../design/encoding.md#strict-integrity-check).
Starting with `v1.37`, the default is a [more performant consistency check](../design/encoding.md#data-integrity-check),
which is sufficient for the majority of cases. The strict consistency check can be enabled through
the flag `--strict-consistency-check` (added in `v1.35`).

## Extending the lifetime of a blob

Recall that when you stored your blob, it was necessary to specify its [end epoch](#storing-blobs).
By specifying the end epoch you ensured that the blob would be available via `walrus read` (or other
SDK access to Walrus) until that end epoch is reached.

Walrus blob lifetimes can be extended *as long as the blobs are not expired* using the
`walrus extend --blob-obj-id <blob object id> ...` command. Both regular single-address owned blobs
and [shared blobs](#shared-blobs) may be extended. Shared blobs may be extended by anyone, but owned
blobs may only be extended by their owner. When extending a shared blob, you will need to supply the
`--shared` flag to inform the command that the blob is shared.

Note that the blob's *object ID* will be needed in order to extend it, the blob ID is not needed.
See `walrus extend --help` for more information on blob extension.

## Reclaiming space via deletable blobs

A blob that was created as *deletable* may be deleted before its expiry by the owner of the Sui blob
object representing the blob. Deletable blobs are indicated as such in the Sui events that certify
them, and should not be relied upon for availability by others.

A deletable blob may be deleted with the command:

```sh
walrus delete --blob-id <BLOB_ID>
```

Optionally the delete command can be invoked by specifying a `--file <PATH>` option, to derive the
blob ID from a file, or `--object-id <SUI_ID>` to delete the blob in the Sui blob object specified.

Before deleting a blob, the `walrus delete` command will ask for confirmation unless the `--yes`
option is specified.

The `delete` command reclaims the storage object associated with the deleted blob, which is re-used
to store new blobs. The delete operation provides flexibility around managing storage costs and
re-using storage.

The delete operation has limited utility for privacy: It only deletes slivers from the current epoch
storage nodes, and subsequent epoch storage nodes, if no other user has uploaded a copy of the same
blob. If another copy of the same blob exists in Walrus, the delete operation will not make the blob
unavailable for download, and `walrus read` invocations will download it. After the deletion is
finished, the CLI checks the updated status of the blob to see if it is still accessible in Walrus
(unless the `--no-status-check` option is specified). However, even if it isn't, copies of the
public blob may be cached or downloaded by users, and these copies are not deleted.

```admonish danger title="Delete reclaims space only"
**All blobs stored in Walrus are public and discoverable by all.** The `delete` command will
not delete slivers if other copies of the blob are stored on Walrus, possibly by other users.
It does not delete blobs from caches, slivers from past storage nodes, or copies
that could have been made by users before the blob was deleted.
```

## Shared blobs

*Shared blobs* are shared Sui objects wrapping "standard" `Blob` objects that can be funded and
whose lifetime can be extended by anyone. See the [shared blobs
contracts](https://github.com/MystenLabs/walrus/tree/main/contracts/walrus/sources/system/shared_blob.move)
for further details.

You can create a shared blob from an existing `Blob` object you own with the `walrus share` command:

```sh
walrus share --blob-obj-id <BLOB_OBJ_ID>
```

The resulting shared blob can be directly funded by adding an `--amount`, or you can fund an
existing shared blob with the `walrus fund-shared-blob` command. Additionally, you can immediately
share a newly created blob by adding the `--share` option to the `walrus store` command.

Shared blobs can only contain permanent blobs and as such cannot be deleted before their expiry.

See [this section](#extending-the-lifetime-of-a-blob) for more on blob extension.

## Batch-storing blobs with quilts

 **Note:** The *quilt* feature is only available in Walrus version *v1.29* or higher.

```admonish warning
- Blobs within a quilt are retrieved by a `QuiltPatchId`, not their standard `BlobId`. This ID
  is generated based on all blobs in the quilt, so a blob's `QuiltPatchId` will change if it's
  moved to a different quilt.
- Standard blob operations like `delete`, `extend`, or `share` cannot target individual blobs
  inside a quilt; they must be applied to the entire quilt.
```

For efficiently storing large numbers of small blobs, Walrus provides the Quilt. It batches
multiple blobs into a single storage unit, significantly reducing overhead and cost. You can find
a more detailed overview of the feature [Quilt](./quilt.md).

You can interact with quilts using a dedicated set of `walrus` subcommands.

### Storing Blobs as a Quilt

To batch-store multiple files as a single quilt, use the `store-quilt` command. You can specify
the files to include in two ways:

```admonish warning
You must ensure that all the identifiers are unique within a quilt, the operation will fail otherwise.
Identifiers are the unique names used to retrieve individual blobs from within a quilt.
```

#### Using `--paths`

To store all files from one or more directories recursively. The filename of each file will be
used as its unique identifier within the quilt. Regular expressions are supported for uploading from
multiple paths, same as the `walrus store` command.

Like the regular `store` command, you can specify the storage duration using `--epochs`,
`--earliest-expiry-time`, or `--end-epoch`.

```sh
walrus store-quilt --epochs <EPOCHS> --paths <path-to-directory-1> <path-to-directory-2> <path-to-blob>
```

#### Using `--blobs`

To specify a list of blobs as JSON objects. This gives you more control, allowing you to set a
custom `identifier` and `tags` for each file. If `identifier` is `null` or omitted, the file's
name is used instead.

```sh
walrus store-quilt \
  --blobs '{"path":"<path-to-blob-1>","identifier":"walrus","tags":{"color":"grey","size":"medium"}}' \
          '{"path":"<path-to_blob-2>","identifier":"seal","tags":{"color":"grey","size":"small"}}' \
  --epochs <EPOCHS>
```

### Reading Blobs from a Quilt

You can retrieve individual blobs (formally "patches") from a quilt without downloading the
entire quilt. The `read-quilt` command allows you to query for specific blobs by their identifier,
tags, or unique patch ID.

To read blobs by their identifiers, use the `--identifiers` flag:

```sh
walrus read-quilt --out <download dir> \
  --quilt-id 057MX9PAaUIQLliItM_khR_cp5jPHzJWf-CuJr1z1ik --identifiers walrus.jpg another-walrus.jpg
```

Blobs within a quilt can be accessed and filtered based on their tags. For instance, if you have a
collection of animal images stored in a quilt, each labeled with a species tag such as "species=cat,"
you can download **all** images labeled as cats with the following command:

```sh
# Read all blobs with tag "size: medium"
walrus read-quilt --out <download dir> \
  --quilt-id 057MX9PAaUIQLliItM_khR_cp5jPHzJWf-CuJr1z1ik --tag species cat
```

You can also read a blob using its QuiltPatchId, which can be retrieved using
[`list-patches-in-quilt`](#list-patches-in-a-quilt).

```sh
walrus read-quilt --out <download dir> \
  --quilt-patch-ids GRSuRSQ_hLYR9nyo7mlBlS7MLQVSSXRrfPVOxF6n6XcBuQG8AQ \
  GRSuRSQ_hLYR9nyo7mlBlS7MLQVSSXRrfPVOxF6n6XcBwgHHAQ
```

### List patches in a Quilt

To see all the patches contained within a quilt, along with their identifiers and QuiltPatchIds, use
the `list-patches-in-quilt` command.

```sh
walrus list-patches-in-quilt 057MX9PAaUIQLliItM_khR_cp5jPHzJWf-CuJr1z1ik
```

## Blob object and blob ID utilities

The command `walrus blob-id <FILE>` may be used to derive the blob ID of any file. The blob ID is a
commitment to the file, and any blob with the same ID will decode to the same content. The blob
ID is a 256 bit number and represented on some Sui explorer as a decimal large number. The
command `walrus convert-blob-id <BLOB_ID_DECIMAL>` may be used to convert it to a base64 URL safe
encoding used by the command line tools and other APIs.

The `walrus list-blobs` command lists all the non expired Sui blob object that the current account
owns, including their blob ID, object ID, and metadata about expiry and deletable status.
The option `--include-expired` also lists expired blob objects.

The Sui storage cost associated with blob objects may be reclaimed by burning the Sui blob object.
This does not lead to the Walrus blob being deleted, but means that operations such as extending
its lifetime, deleting it, or modifying attributes are no more available.
The `walrus burn-blobs --object-ids <BLOB_OBJ_IDS>` command may be used to burn a specific list of
blobs object IDs. The `--all` flag burns all blobs under the user account,
and `--all-expired` burns all expired blobs under the user account.

## Blob attributes

Walrus allows a set of key-value attribute pairs to be associated with a blob object. While the key
and values may be arbitrary strings to accommodate any needs of dapps, specific keys are converted
to HTTP headers when serving blobs through aggregators. Each aggregator can decide which headers it
allows through the `--allowed-headers` CLI option; the defaults can be viewed through `walrus
aggregator --help`.

The command

```sh
walrus set-blob-attribute <BLOB_OBJ_ID> --attr "key1" "value1" --attr "key2" "value2"
```

sets attributes `key1` and `key2` to values `value1` and `value2`, respectively. The command
`walrus get-blob-attribute <BLOB_OBJ_ID>` returns all attributes associated with a blob ID. Finally,

```sh
walrus remove-blob-attribute-fields <BLOB_OBJ_ID> --keys "key1,key2"
```

deletes the attributes with
keys listed (separated by commas or spaces). All attributes of a blob object may be deleted by
the command `walrus remove-blob-attribute <BLOB_OBJ_ID>`.

Note that attributes are associated with blob object IDs on Sui, rather than the blob themselves on
Walrus. This means that the gas for storage is reclaimed by deleting attributes. And also that the
same blob contents may have different attributes for different blob objects for the same blob ID.

## Changing the default configuration

Use the `--config` option to specify a custom path to the
[configuration location](../usage/setup.md#configuration).

The `--wallet <WALLET>` argument may be used to specify a non-standard Sui wallet configuration
file. And a `--gas-budget <GAS_BUDGET>` argument may be used to change the maximum amount of Sui (in
MIST) that the command is allowed to use.

## Logging and metrics

The `walrus` CLI allows for multiple levels of logging, which can be turned on via an env variable:

```sh
RUST_LOG=walrus=trace walrus info
```

By default `info` level logs are enabled, but `debug` and `trace` can give a more intimate
understanding of what a command does, or how it fails.
