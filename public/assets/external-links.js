// Keep external website destinations in a new tab, including links added later.
(() => {
  function updateLink(link) {
    const url = new URL(link.getAttribute('href'), document.baseURI);
    if (!['http:', 'https:'].includes(url.protocol)) return;
    const host = url.hostname.toLowerCase().replace(/^www\./, '');
    if (host === 'tschech.co' || url.origin === location.origin) return;
    link.target = '_blank';
    const rel = new Set(link.rel.split(/\s+/).filter(Boolean));
    rel.add('noopener');
    rel.add('noreferrer');
    link.rel = [...rel].join(' ');
  }
  function scan(root) {
    if (root.nodeType !== 1 && root.nodeType !== 9) return;
    if (root.matches?.('a[href]')) updateLink(root);
    root.querySelectorAll('a[href]').forEach(updateLink);
  }
  scan(document);
  new MutationObserver(records => {
    for (const record of records) {
      if (record.type === 'attributes') updateLink(record.target);
      else record.addedNodes.forEach(scan);
    }
  }).observe(document.documentElement, {subtree: true, childList: true, attributes: true, attributeFilter: ['href']});
})();
