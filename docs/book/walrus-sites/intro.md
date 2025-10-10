# Introduction to Walrus Sites

*Walrus Sites* are "web"-sites that use Sui and Walrus as their underlying technology. They are a
prime example of how Walrus can be used to build new and exciting decentralized applications. Anyone
can build and deploy a Walrus Site and make it accessible to the world! Interestingly, this documentation
is itself available as a Walrus Site at <https://docs.wal.app/walrus-sites/intro.html> (if you
aren't there already).

At a high level, here are some of the most exciting features:

- Publishing a site does not require managing servers or complex configurations; just provide the
  source files (produced by your favorite web framework), publish them to Walrus Sites using the
  [site-builder tool](./overview.md#the-site-builder), and you are done!
- Sites can be linked to from ordinary Sui objects. This feature enables, for example, creating an
  NFT collection in which *every single NFT* has a *personalized website dedicated to it*.
- Walrus Sites are owned by addresses on Sui and can be exchanged, shared, and updated thanks to
  Sui's flexible programming model. This means, among other things, that Walrus Sites can leverage
  the [SuiNS](https://suins.io/) naming system to have human-readable names. No more messing around
  with DNS!
- Thanks to Walrus's decentralization and extremely high data availability, there is no risk of
  having your site wiped for any reason.
- Since they live on Walrus, these sites cannot have a backend in the traditional sense, and can
  therefore be considered "static" sites. However, the developer can integrate with Sui-compatible
  wallets and harness Sui's programmability to add backend functionality to Walrus Sites!

## Show me

To give you a very high-level view of how Walrus Sites work, let's look at an example: A simple
NFT collection on Sui that has a frontend dApp to mint the NFTs hosted on Walrus Sites, and in
which *each NFT* has a *specific, personalized Walrus Site*.

You can check out the mint page at <https://flatland.wal.app/>. This site is served to your
browser through the Walrus Site *portal* <https://wal.app>. While the portal's operation is
explained in a [later section](./portal.md), consider for now that there can be many portals (hosted
by whoever wants to have their own, and even on `localhost`). Further, the only function of the
portal is to retrieve the metadata (from Sui) and the resource files (from Walrus) that constitute
the site.

If you have a Sui wallet with some SUI, you can try and "mint a new Flatlander" from the site. This
creates an NFT from the collection and shows you two links: one to the explorer, and one to the
"Flatlander site". This latter site is a special Walrus Sites page that exists only for that NFT,
and has special characteristics (the background color, the image, ...) that are based on the
contents of the NFT.

The URL to this per-NFT site looks something like this:
`https://flatland.wal.app/0x811285f7bbbaad302e23a3467ed8b8e56324ab31294c27d7392dac649b215716`.
You'll notice that the domain remains `wal.app`, but the path is a long and random-looking
string. This string is actually the [hexadecimal](https://simple.wikipedia.org/wiki/Hexadecimal)
encoding of the object ID of the NFT, which is [0x811285f7b...][flatlander]. This path is unique to
each NFT and is used to fetch the metadata and resource files for its corresponding page. The page
is then rendered based on the characteristics of the NFT.

In summary:

- Walrus Sites are served through a portal; in this case, `https://wal.app`. There can be many
  portals, and anyone can host one.
- The subdomain on the URL points to a specific object on Sui that allows the browser to fetch and
  render the site resources. This pointer should be a SuiNS name, such as `flatland` in
  `https://flatland.wal.app`.
- It is possible for each path to be mapped to a specific object on Sui that allows the browser to
  fetch and render a page based on the characteristics of the NFT.

Curious to know how this magic is possible? Read the [technical overview](./overview.md)! If you
just want to get started trying Walrus Sites out, check the [tutorial](./tutorial.md).

[flatlander]: https://suiscan.xyz/mainnet/object/0x811285f7bbbaad302e23a3467ed8b8e56324ab31294c27d7392dac649b215716
