// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded affix "><a href="index.html">Walrus</a></li><li class="chapter-item expanded affix "><li class="spacer"></li><li class="chapter-item expanded affix "><li class="part-title">Dev Blog</li><li class="chapter-item expanded "><a href="blog/00_intro.html"><strong aria-hidden="true">1.</strong> Blog Preface</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="blog/01_announcing_walrus.html"><strong aria-hidden="true">1.1.</strong> Announcing Walrus</a></li><li class="chapter-item expanded "><a href="blog/02_devnet_update.html"><strong aria-hidden="true">1.2.</strong> Devnet Update</a></li><li class="chapter-item expanded "><a href="blog/03_whitepaper.html"><strong aria-hidden="true">1.3.</strong> Announcing the Walrus Whitepaper</a></li><li class="chapter-item expanded "><a href="blog/04_testnet_update.html"><strong aria-hidden="true">1.4.</strong> Announcing Testnet</a></li><li class="chapter-item expanded "><a href="blog/05_testnet_redeployment.html"><strong aria-hidden="true">1.5.</strong> Announcing Testnet v2</a></li><li class="chapter-item expanded "><a href="blog/06_mainnet.html"><strong aria-hidden="true">1.6.</strong> Announcing Mainnet</a></li></ol></li><li class="chapter-item expanded "><li class="spacer"></li><li class="chapter-item expanded affix "><li class="part-title">Usage</li><li class="chapter-item expanded "><a href="usage/started.html"><strong aria-hidden="true">2.</strong> Getting started</a></li><li class="chapter-item expanded "><a href="usage/setup.html"><strong aria-hidden="true">3.</strong> Setup</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="usage/networks.html"><strong aria-hidden="true">3.1.</strong> Available networks</a></li></ol></li><li class="chapter-item expanded "><a href="usage/interacting.html"><strong aria-hidden="true">4.</strong> Interacting with Walrus</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="usage/client-cli.html"><strong aria-hidden="true">4.1.</strong> Using the client CLI</a></li><li class="chapter-item expanded "><a href="usage/json-api.html"><strong aria-hidden="true">4.2.</strong> Using the client JSON API</a></li><li class="chapter-item expanded "><a href="usage/web-api.html"><strong aria-hidden="true">4.3.</strong> Using the client HTTP API</a></li><li class="chapter-item expanded "><a href="usage/sdks.html"><strong aria-hidden="true">4.4.</strong> SDKs and other tools</a></li></ol></li><li class="chapter-item expanded "><a href="dev-guide/dev-guide.html"><strong aria-hidden="true">5.</strong> Developer guide</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="dev-guide/components.html"><strong aria-hidden="true">5.1.</strong> Components</a></li><li class="chapter-item expanded "><a href="dev-guide/dev-operations.html"><strong aria-hidden="true">5.2.</strong> Operations</a></li><li class="chapter-item expanded "><a href="dev-guide/costs.html"><strong aria-hidden="true">5.3.</strong> Storage costs</a></li><li class="chapter-item expanded "><a href="dev-guide/sui-struct.html"><strong aria-hidden="true">5.4.</strong> Sui structures</a></li><li class="chapter-item expanded "><a href="dev-guide/data-security.html"><strong aria-hidden="true">5.5.</strong> Data security</a></li><li class="chapter-item expanded "><a href="usage/quilt.html"><strong aria-hidden="true">5.6.</strong> Quilt</a></li></ol></li><li class="chapter-item expanded "><a href="operator-guide/operator-guide.html"><strong aria-hidden="true">6.</strong> Operator guide</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="operator-guide/aggregator.html"><strong aria-hidden="true">6.1.</strong> Operating an aggregator or publisher</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="operator-guide/auth-publisher.html"><strong aria-hidden="true">6.1.1.</strong> The authenticated publisher</a></li></ol></li><li class="chapter-item expanded "><a href="operator-guide/storage-node.html"><strong aria-hidden="true">6.2.</strong> Operating a storage node</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="operator-guide/commission-governance.html"><strong aria-hidden="true">6.2.1.</strong> Commission and governance</a></li><li class="chapter-item expanded "><a href="operator-guide/backup-restore-guide.html"><strong aria-hidden="true">6.2.2.</strong> Backup and restore</a></li></ol></li><li class="chapter-item expanded "><a href="operator-guide/upload-relay.html"><strong aria-hidden="true">6.3.</strong> Upload relay: functioning and operation</a></li></ol></li><li class="chapter-item expanded "><a href="usage/stake.html"><strong aria-hidden="true">7.</strong> Staking and unstaking</a></li><li class="chapter-item expanded "><a href="usage/examples.html"><strong aria-hidden="true">8.</strong> Examples</a></li><li class="chapter-item expanded "><a href="usage/troubleshooting.html"><strong aria-hidden="true">9.</strong> Troubleshooting</a></li><li class="chapter-item expanded affix "><li class="part-title">Sites</li><li class="chapter-item expanded "><a href="walrus-sites/intro.html"><strong aria-hidden="true">10.</strong> Introduction to Walrus Sites</a></li><li class="chapter-item expanded "><a href="walrus-sites/tutorial.html"><strong aria-hidden="true">11.</strong> Your first Walrus Site</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="walrus-sites/tutorial-install.html"><strong aria-hidden="true">11.1.</strong> Installing the site builder</a></li><li class="chapter-item expanded "><a href="walrus-sites/tutorial-publish.html"><strong aria-hidden="true">11.2.</strong> Publishing a Walrus Site</a></li><li class="chapter-item expanded "><a href="walrus-sites/tutorial-suins.html"><strong aria-hidden="true">11.3.</strong> Set a SuiNS name</a></li></ol></li><li class="chapter-item expanded "><a href="walrus-sites/advanced.html"><strong aria-hidden="true">12.</strong> Advanced functionality</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="walrus-sites/commands.html"><strong aria-hidden="true">12.1.</strong> Site builder commands</a></li><li class="chapter-item expanded "><a href="walrus-sites/builder-config.html"><strong aria-hidden="true">12.2.</strong> Advanced site-builder configuration</a></li><li class="chapter-item expanded "><a href="walrus-sites/routing.html"><strong aria-hidden="true">12.3.</strong> Specifying headers, routing, and metadata</a></li><li class="chapter-item expanded "><a href="walrus-sites/linking.html"><strong aria-hidden="true">12.4.</strong> Linking from and to Walrus Sites</a></li><li class="chapter-item expanded "><a href="walrus-sites/redirects.html"><strong aria-hidden="true">12.5.</strong> Redirecting objects to Walrus Sites</a></li><li class="chapter-item expanded "><a href="walrus-sites/ci-cd.html"><strong aria-hidden="true">12.6.</strong> CI/CD</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="walrus-sites/ci-cd-gh-secrets-vars.html"><strong aria-hidden="true">12.6.1.</strong> Setting up GitHub secrets and vars</a></li><li class="chapter-item expanded "><a href="walrus-sites/ci-cd-gh-workflow.html"><strong aria-hidden="true">12.6.2.</strong> Creating GitHub workflow</a></li></ol></li></ol></li><li class="chapter-item expanded "><a href="walrus-sites/overview.html"><strong aria-hidden="true">13.</strong> Technical overview</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="walrus-sites/portal.html"><strong aria-hidden="true">13.1.</strong> The Walrus Sites portal</a></li><li class="chapter-item expanded "><a href="walrus-sites/bring-your-own-domain.html"><strong aria-hidden="true">13.2.</strong> Bring your own domain</a></li><li class="chapter-item expanded "><a href="walrus-sites/authentication.html"><strong aria-hidden="true">13.3.</strong> Site data authentication</a></li><li class="chapter-item expanded "><a href="walrus-sites/avoid-duplicate-content-seo.html"><strong aria-hidden="true">13.4.</strong> Avoiding Duplicate-Content SEO in Custom Portals</a></li><li class="chapter-item expanded "><a href="walrus-sites/restrictions.html"><strong aria-hidden="true">13.5.</strong> Known restrictions</a></li></ol></li><li class="chapter-item expanded "><li class="spacer"></li><li class="chapter-item expanded affix "><li class="part-title">Design</li><li class="chapter-item expanded "><a href="design/objectives_use_cases.html"><strong aria-hidden="true">14.</strong> Objectives and use cases</a></li><li class="chapter-item expanded "><a href="design/overview.html"><strong aria-hidden="true">15.</strong> Overview</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="design/architecture.html"><strong aria-hidden="true">15.1.</strong> Architecture</a></li><li class="chapter-item expanded "><a href="design/encoding.html"><strong aria-hidden="true">15.2.</strong> Encoding</a></li></ol></li><li class="chapter-item expanded "><a href="design/operations.html"><strong aria-hidden="true">16.</strong> Operations</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="design/operations-sui.html"><strong aria-hidden="true">16.1.</strong> Sui operations</a></li><li class="chapter-item expanded "><a href="design/operations-off-chain.html"><strong aria-hidden="true">16.2.</strong> Off-chain operations</a></li></ol></li><li class="chapter-item expanded "><a href="design/properties.html"><strong aria-hidden="true">17.</strong> Properties</a></li><li class="chapter-item expanded "><a href="design/future.html"><strong aria-hidden="true">18.</strong> Future discussion</a></li><li class="chapter-item expanded affix "><li class="spacer"></li><li class="chapter-item expanded affix "><a href="glossary.html">Glossary</a></li><li class="chapter-item expanded affix "><a href="legal/testnet_tos.html">Testnet terms of service</a></li><li class="chapter-item expanded affix "><a href="legal/privacy.html">Privacy policy</a></li><li class="chapter-item expanded affix "><a href="legal/walrus_general_tos.html">Walrus general terms of service</a></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0].split("?")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
