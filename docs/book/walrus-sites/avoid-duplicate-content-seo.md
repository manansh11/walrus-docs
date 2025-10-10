# Avoiding Duplicate-Content SEO in Custom Portals

> **Note:** This guidance does not require any changes to the Walrus Sites portal itself.
> It is focused on **site-level fixes** (HTML tags or HTTP headers) that developers can
> add when hosting their own portals.

When you deploy your own Walrus Sites portal, you may expose the same site under multiple hostnames:

- **[SuiNS](https://suins.io/)** – human-readable names registered on-chain, e.g. `snowreads.wal.app`.
- **Base36** – subdomains derived directly from the site object ID, e.g. `1myb…xd.portal.com`.
- **[Custom domains](https://docs.wal.app/walrus-sites/bring-your-own-domain.html)** – BYOD,
  e.g. `example.com`.

Search engines treat the same content served at multiple hosts as duplicates,
which can dilute ranking signals.

The official [`wal.app`](https://wal.app) portal avoids this issue by **only serving SuiNS domains**,
with base36 and BYOD disabled.
If you run your own portal and enable base36 or BYOD, you must take steps to signal a canonical host.

---

## Example Scenario

**Problem:**
You run a site that is reachable at both:

- `https://example.wal.app/math` (SuiNS)
- `https://example.com/math` (Custom domain)

A web crawler will see identical content at two different URLs and may treat them as duplicates.

**Solution:**
Add a canonical hint so crawlers know which host to index:

In the HTML `<head>`:

```html
<link rel="canonical" href="https://example.com/math" />
```

---

## Recommended Practices

- **Canonical host policy**
  Choose one hostname type per site (custom domain > SuiNS > base36 is a good priority).
  All other hosts should include canonical hints pointing to that choice.

- **Base36 subdomains**

  - Disable if not needed: `B36_DOMAIN_RESOLUTION_SUPPORT=false`.
  - If enabled, add canonical hints (`<link rel="canonical">` or `Link: rel="canonical"`).
  - Optionally, block them from indexing with:

    ```http
    X-Robots-Tag: noindex
    ```

- **Custom domains**

  - Setting `BRING_YOUR_OWN_DOMAIN=true` makes the portal serve only your configured
    custom domain (single-site mode).
    Other domains, including SuiNS and base36, are not resolved by that portal.
  - It’s always a good practice to add canonical hints in your HTML or headers pointing
    to your chosen custom domain,
    to avoid duplicate indexing across different hosts.

- **Multiple SuiNS names → one site**
  This can happen permissionlessly. If you own the extra names, add canonical hints
  in your site HTML to point to your preferred domain.
