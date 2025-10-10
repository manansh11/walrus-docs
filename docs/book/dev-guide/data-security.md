# Data security

Walrus provides decentralized storage for application and user data. This page summarizes the
security guarantees provided by Walrus natively or through additional mechanisms like
[Seal](https://seal-docs.wal.app/).

## Availability

The encoding mechanisms applied by Walrus guarantee that blobs can be written and remains available
as long as 2/3 of the data is handled by honest and functional nodes. Once data is written, reads
are even possible if as few as 1/3 of the nodes are available. This is described in further detail
in the [whitepaper](../walrus.pdf) and in the [properties chapter](../design/properties.md).

## Integrity

Walrus guarantees that any data read corresponds to what was intended by the writer. As the encoding
is done by the client, it is possible that this encoding is incorrect (by mistake or on purpose).
This causes some subtleties, which are described in the [encoding chapter](../design/encoding.md#metadata-and-data-authentication).

## Confidentiality and access control using Seal

As described above, Walrus ensures availability and integrity but does not provide native encryption
for data. By default, *all blobs stored in Walrus are public and discoverable by everyone*. If your
app needs encryption or access control, you need to secure data before uploading to Walrus.

In principle, you can use any encryption and access-control mechanism you prefer. However, if you
want onchain access control, [Seal](https://seal-docs.wal.app/) is the most powerful and
straight-forward option.

Seal allows you to:

- Encrypt data using threshold encryption, where no single party holds the full decryption key.
- Define onchain access policies that determine who can decrypt the data and under what conditions.
- Store encrypted content on Walrus while keeping decryption logic verifiable and flexible.

Seal integrates naturally with Walrus and is recommended for any use case involving:

- Sensitive offchain content (e.g., user documents, game assets, private messages)
- Time-locked or token-gated data
- Data shared between trusted parties or roles

To get started, refer to the [Seal SDK](https://www.npmjs.com/package/@mysten/seal).
