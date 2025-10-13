# Getting Started with Walrus

Walrus is a platform for building efficient and resilient data markets, where data is stored as *blobs*. All blobs are stored on Walrus as an array of bytes with a fixed size, and can be any type of file, such as text, video, or source code.

Sui is a blockchain that supports programmability at a [fundamental level](https://docs.sui.io/concepts/transactions/prog-txn-blocks). All blobs stored on Walrus are bound to *objects* on the Sui blockchain.

## Walrus and Sui

Walrus depends on Sui, as it leverages Sui to track blobs, their respective owners, and their lifetimes. 

Sui and Walrus are both decentralized, distributed systems made up of many independent servers communicating and collectively establishing shared state. A group of servers together is called a *network*.

### Available networks

Sui and Walrus each have the following available networks:

- **Testnet** is a sandbox-like network where you can receive test tokens for free to use for the network's fees. Software packages can be built, tested, and debugged on Testnet. Testnet data persistence is not guaranteed and may be wiped at any time without warning.
- **Mainnet** is a production environment where real tokens are used and users or other applications rely on consistent functionality.

When you are getting started, it's recommended that you use **Testnet.**

## Install tooling

To install Walrus and Sui, use the Mysten Labs `suiup` tool. First, [Install suiup](https://github.com/MystenLabs/suiup?tab=readme-ov-file#installation):

```bash
curl -sSfL https://raw.githubusercontent.com/Mystenlabs/suiup/main/install.sh | sh
```

Then, install `sui` and `walrus` :

```bash
suiup install sui
suiup install walrus
```

### Configure tooling for Walrus Testnet

After Walrus has been installed, you need to configure the Walrus client, which tells it the RPC URLs to use to access Testnet or Mainnet. The easiest way to configure Walrus is to download the following prefilled configuration file. 

```bash
mkdir ~/.config/walrus/
curl https://docs.wal.app/setup/client_config.yaml -o ~/.config/walrus/client_config.yaml
```

Next, you will need to run the Sui client. If this is your first time running a `sui client` command, you will be prompted to configure the local Sui client, which is separate to the Walrus client configuration. [Learn more about the Sui client configuration.](https://docs.sui.io/guides/developer/getting-started/connect#configure-sui-client)

To quickly configure the Sui client, run:

```bash
sui client --yes
```

Enter `https://fullnode.testnet.sui.io:443` when prompted for the full node server URL, and enter `0` for the encryption scheme.

To confirm the Walrus configuration is now using Testnet, run the command:

```bash
walrus info
```

Make sure that this command's output includes `Epoch duration: 1day` to indicate connection to Testnet. 

For detailed information about the `walrus` command-line tool, use the `walrus --help` command. Or, append  `--help` to any `walrus` subcommand to get details about that specific command.

## Create a Sui account

Sui uses addresses and accounts. These are important for Walrus because when you store blobs on Walrus, they will be bound to an object on Sui that is owned by an address. 

An *address* is a unique location on the blockchain, identified by a 32-byte identifier (displayed as 64 hex characters with `0x` prefix) that can own objects and is derived from a public key using a hash function.

Addresses are visible to anyone, and are valid on all networks (Testnet, Mainnet, etc.), but data and assets are not shared between networks.

An *account* is an address plus the key to access it. If you have an address's private key, you can actually use what's owned by the address, such as tokens and objects.

To create an account, first verify that `sui` was installed successfully:

```bash
sui --version
```

Then, set Testnet as the active Sui environment with the command:

```bash
sui client switch --env testnet
```

Then, create a new address with the command:

```bash
sui client new-address ed25519
```

The argument `ed25519`specifies the key pair scheme to be of type `ed25519`.

```admonish warning title="Store your keys securely"
You must store your private key and recovery phrase securely, otherwise you may lose access to your address.

[Learn more about addresses, available key pair options, and key storage.](https://docs.sui.io/guides/developer/getting-started/get-address)
```

## Fund Sui account with tokens

Before you can upload a file to Walrus and store it as a blob, you will need SUI tokens to pay transaction fees and WAL tokens to pay for storage on the network. The Walrus Testnet uses Testnet WAL tokens that have no value and can be exchanged at a 1:1 rate for Testnet SUI tokens. 

To get SUI tokens, navigate to the SUI Testnet faucet:

[https://faucet.sui.io/](https://faucet.sui.io/) 

Ensure "Testnet" is selected. Then, insert your Sui address. To print your Sui address, use the command:

```bash
sui client active-address
```

After you have inserted your address on the faucet and receive a message saying you have received SUI tokens, check your balance with the command:

```bash
sui client balance
```

```admonish tip title="Faucet alternatives"
The Sui faucet is rate limited. If you encounter errors or have questions, you can request tokens from the Discord faucet or a third party faucet. [Learn more about the Sui faucet.](https://docs.sui.io/guides/developer/getting-started/get-coins#request-test-tokens-through-discord)
```

Now, convert part of those SUI tokens into WAL with the command:

```bash
walrus get-wal --context testnet
```

Then, check your balance again with `sui client balance` to confirm you now have WAL:

```bash
╭─────────────────────────────────────────╮
│ Balance of coins owned by this address  │
├─────────────────────────────────────────┤
│ ╭─────────────────────────────────────╮ │
│ │ coin  balance (raw)     balance     │ │
│ ├─────────────────────────────────────┤ │
│ │ Sui   8869252670        0.05 SUI    │ │
│ │ WAL   500000000         0.50 WAL    │ │
│ ╰─────────────────────────────────────╯ │
╰─────────────────────────────────────────╯
```

## Store a blob

Changes to objects on Sui happen through the use of transactions. These transactions are *signed* by accounts on behalf of addresses and result in objects being created, updated, transferred, and sometimes destroyed. Learn more about [transactions](https://docs.sui.io/concepts/transactions).

To upload a file to Walrus and store it as a blob, run the following command:

```bash
walrus store file.txt --epochs 2 --context testnet
```

Replace `file.txt` with the file you'd like to store on Walrus. You can store any file type on Walrus.

The `--epochs` flag is required, as blobs are stored for a certain number of epochs. An *epoch* is certain period of time on the network. On Testnet, epochs are 1 day, and on Mainnet epochs are 2 weeks. You can extend the number of epochs a blob is stored indefinitely. 

A blob is uploaded in *slivers*, which are small pieces of the file stored on different servers through *erasure coding*. [Learn more](https://docs.wal.app/design/encoding.html) about the Walrus architecture and how erasure coding is implemented.

After a blob is uploaded to Walrus, it will have two identifiers:

```bash
Blob ID: oehkoh0352bRGNPjuwcy0nye3OLKT649K62imNdAlXg
Sui object ID: 0x1c086e216c4d35bf4c1ea493aea701260ffa5b0070622b17271e4495a030fe83
```

- Blob ID: A way to reference the blob on Walrus. The blob ID is generated based on the blob's contents, meaning any file uploaded to the network twice will result in the same blob ID.
- Sui Object ID: The blob's corresponding newly created Sui object identifier, as all blobs are bound to one or more Sui objects.

Blob IDs are used to read blob data, while Sui object IDs are used to make modification's to the blob's metadata, such as its storage duration (and may also be used to read blob data.)

You can use the [Walrus Explorer](https://walruscan.com/) to view more information about a Blob ID.

## Retrieve a blob

To retrieve a blob and save it on your local machine, run the following command:

```bash
walrus read <blob-id> --out file.txt --context testnet
```

Replace `<blob-id>` with the blob's identifier returned in the output of the `walrus store` command, and replace `file.txt` with the name and file extension for storing the file locally.

## Extend a blob's storage duration

To extend a blob's storage duration, you must reference the Sui object ID and indicate how many epochs you want to extend the blob's storage for. 

Run the following command to extend a blob's storage duration by 3 epochs. Note that you must use the Sui Object ID, not the Blob ID:

```bash
walrus extend --blob-obj-id <blob-object-id> --epochs-extended 3 --context testnet
```

Replace `<blob-object-id>` with the blob's Sui object ID returned in the output of the `walrus store` command.

## Delete a blob

To delete a blob, run the following command:

```bash
walrus delete --blob-id <blob-id> --context testnet
```

Replace `<blob-id>` with the blob's identifier returned in the output of the `walrus store` command.

## Next steps

1. [Build your first Walrus application](https://docs.wal.app/dev-guide/dev-guide.html). Explore working examples:
    - [Python examples](https://github.com/MystenLabs/walrus/tree/main/docs/examples/python)
    - [JavaScript web form](https://github.com/MystenLabs/walrus/tree/main/docs/examples/javascript)
    - [Move smart contracts](https://github.com/MystenLabs/walrus/tree/main/docs/examples/move)

## Need help?

- [Troubleshooting guide](https://docs.wal.app/usage/troubleshooting.html)
- [Discord community](https://discord.gg/walrus)
