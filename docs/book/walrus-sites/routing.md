# Specifying headers, routing, and metadata

In its base configuration, Walrus Sites serves static assets through a portal. However, many modern
web applications require more advanced features, such as custom headers and client-side routing.

Therefore, the site-builder can read a `ws-resources.json` configuration file, in which you can
directly specify resource headers and routing rules.

## The `ws-resources.json` file

This file is optionally placed in the root of the site directory, and it is *not* uploaded with the
site's resources (in other words, the file is not part of the resulting Walrus Site and is not
served by the portal).

If you don't want to use this default location, you can specify the path to the configuration file
with the `--ws-resources` flag when running the `deploy`, `publish` or `update` commands.

The file is JSON-formatted, and looks like the following:

``` JSON
{
  "headers": {
    "/index.html": {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "max-age=3500"
    }
  },
  "routes": {
    "/*": "/index.html",
    "/accounts/*": "/accounts.html",
    "/path/assets/*": "/assets/asset_router.html"
  },
  "metadata": {
      "link": "https://subdomain.wal.app",
      "image_url": "https://www.walrus.xyz/walrus-site",
      "description": "This is a walrus site.",
      "project_url": "https://github.com/MystenLabs/walrus-sites/",
      "creator": "MystenLabs"
  },
  "site_name": "My Walrus Site",
  "object_id": "0xe674c144119a37a0ed9cef26a962c3fdfbdbfd86a3b3db562ee81d5542a4eccf",
  "ignore": ["/private/*", "/secret.txt", "/images/tmp/*"]
}
```

```admonish note
The `ws-resources.json` file, expects the field names to be in `snake_case`
```

We now describe in detail six sections of the configuration file: `headers`, `routes`,
`metadata`, `site_name`, `object_id` and the `ignore` section.

## Specifying HTTP response headers

The `headers` section allows you to specify custom HTTP response headers for specific resources.
The keys in the `headers` object are the paths of the resources, and the values are lists of
key-value pairs corresponding to the headers that the portal will attach to the response.

For example, in the configuration above, the file `index.html` will be served with the
`Content-Type` header set to `text/html; charset=utf-8` and the `Cache-Control` header set to
`max-age=3500`.

This mechanism allows you to control various aspects of the resource delivery, such as caching,
encoding, and content types.

```admonish
The resource path is always represented as starting from the root `/`.
```

### Default headers

By default, no headers need to be specified, and the `ws-resources.json` file can be omitted. The
site-builder will automatically try to infer the `Content-Type` header based on the file extension,
and set the `Content-Encoding` to `identity` (no transformation).

In case the content type cannot be inferred, the `Content-Type` will be set to
`application/octet-stream`.

These defaults will be overridden by any headers specified in the `ws-resources.json` file.

## Specifying client-side routing

The `routes` section allows you to specify client-side routing rules for your site. This is useful
when you want to use a single-page application (SPA) framework, such as React or Angular.

The configuration in the `routes` object is a mapping from route keys to resource paths.

The **`routes` keys** are path patterns in the form `/path/to/some/*`, where the `*` character
represents a wildcard.

```admonish
Currently, the wildcard *can only be specified at the end of the path*.
Therefore, `/path/*` is a valid path, while `/path/*/to` and `*/path/to/*` are not.
```

The **`routes` values** are the resource paths that should be served when the route key is matched.

```admonish danger title="Important"
The paths in the values **must** be valid resource paths, meaning that they must be present among
the site's resources. The Walrus sites contract will **abort** if the user tries to create a route
that points to a non-existing resource.
```

The simple routing algorithm is as follows:

- Whenever a resource path *is not found among the sites resources*, the portal tries to match the
  path to the `routes`.
- All matching routes are then *lexicographically ordered*, and the *longest* match is chosen.
- The resource corresponding to this longest match is then served.

```admonish
In other words, the portal will *always* serve a resource if present, and if not present will serve
the resource with the *longest matching prefix* among the routes.
```

Recall the example above:

``` JSON
"routes": {
  "/*": "/index.html",
  "/path/*": "/accounts.html",
  "/path/assets/*": "/assets/asset_router.html"
}
```

The following matchings will occur:

- browsing `/any/other/test.html` will serve `/index.html`;
- browsing `/path/test.html` will serve `/accounts.html`, as it is a more specific match than the
  previous one;
- similarly, browsing `/path/assets/test.html` will serve `/assets/asset_router.html`.

`/index.html`, `/accounts.html`, and `/assets/asset_router.html` are all existing resources on the
Walrus Sites object on Sui.

## Displaying the Site Object on Wallets and Explorers

It's possible to make your Site object prettier by displaying information about it on Sui explorers
and wallets by using the `metadata` field. This is useful for adding human-readable information
about the site. For example, you can add a link to your site's homepage, an image of your site's
logo, etc.

As you can see from the example above, the fields correspond to the basic set of properties
suggested by the
[Sui Display object standard](https://docs.sui.io/standards/display#display-properties).

```JSON
"metadata": {
      "link": "https://subdomain.wal.app",
      "image_url": "https://www.walrus.xyz/walrus-site",
      "description": "This is a walrus site.",
      "project_url": "https://github.com/MystenLabs/walrus-sites/",
      "creator": "MystenLabs"
  }
```

All metadata fields are optional, and can be omitted if not needed. There are some default values
specified in the site-builder CLI, which can be overridden by the user.

It is recommended to use the above fields like this:

- `link`: Add a link to your site's homepage.
- `image_url`: Include a URL to your site's logo which will be displayed on your wallet. For
example you can place a link to your sites favicon.
- `description`: Add a brief description of your site.
- `project_url`: If your site is open-source, add a link to your site's GitHub repository.
- `creator`: Add the name of your company, group, or individual creator of your site.

## Site Name (`site_name`)

You can set a Name for your Walrus Site, via the optional `site_name` field in your
`ws-resources.json` file.

```admonish note
In case you have also provided a Site Name via the `--site-name` cli flag, the cli flag
will take priority over the `site_name` field in the `ws-resources.json`, which will be
overwritten.
```

```admonish note
If a Site Name is not provided at all (neither through the `--site-name` cli flag, nor
through the `site_name` field in `ws-resources.json`), then a default name will be used.
```

## Site Object ID (`object_id`)

The optional `object_id` field in your `ws-resources.json` file stores the Sui Object ID of your
deployed Walrus Site.

**Role in Deployment:**

The `site-builder deploy` command primarily uses this field to identify an existing site for updates.
If a valid `object_id` is present, `deploy` will target that site for modifications.
If this field is missing (and no `--object-id` CLI flag is used), `deploy` will publish a new site.
If successful, then the command automatically populates this `object_id` field in your `ws-resources.json`.

## Ignoring files from being uploaded

You can use the optional `ignore` field to exclude certain files or folders from being published.
This is useful when you want to keep development files, secrets, or temporary assets out of
the final build.

The `ignore` field is a list of resource paths to skip. Each pattern must start with a `/`,
and may end with a `*` to indicate a wildcard match.

For example:

```json
"ignore": [
  "/private/*",
  "/secret.txt",
  "/images/tmp/*"
]
```

This configuration will skip all files inside the `/private/` and `/images/tmp/` directories,
as well as a specific file `/secret.txt`.

> Wildcards are only supported in the **last position** of the path (e.g., `/foo/*` is valid,
but `/foo/*/bar` is not).
