(() => {
  'use strict';
  const thread = 'https://github.com/stabthedrama-jpg/tschech-site/issues/2';
  const comments = document.getElementById('comments');
  function status(message) {
    const p = document.createElement('p');
    p.className = 'comment-status'; p.textContent = message;
    const a = document.createElement('a'); a.href = thread; a.textContent = 'Read the full thread on GitHub';
    p.append(document.createElement('br'), a); comments.replaceChildren(p);
  }
  async function loadComments() {
    try {
      const response = await fetch('https://api.github.com/repos/stabthedrama-jpg/tschech-site/issues/2/comments?per_page=30', {headers:{Accept:'application/vnd.github+json'},signal:AbortSignal.timeout(10000)});
      if (!response.ok) throw new Error('Comments unavailable');
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error('Unexpected response');
      if (!data.length) {status('No comments yet. Got a deep cut? Start the conversation.'); return;}
      const nodes = data.map(c => {
        const article = document.createElement('article'); article.className = 'comment';
        const header = document.createElement('header');
        const author = document.createElement('strong'); author.textContent = c.user?.login || 'Reader';
        const permalink = document.createElement('a');
        const date = new Date(c.created_at);
        const time = document.createElement('time'); time.dateTime = c.created_at; time.textContent = date.toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'});
        if (/^https:\/\/github\.com\//.test(c.html_url)) permalink.href = c.html_url;
        permalink.append(time); header.append(author,permalink);
        const body = document.createElement('p'); body.textContent = c.body || '';
        article.append(header,body); return article;
      });
      comments.replaceChildren(...nodes);
      if (data.length === 30) {const a=document.createElement('a');a.href=thread;a.textContent='Read all comments on GitHub';comments.append(a);}
    } catch {status('The comments couldn’t load here right now. You can still read and post on GitHub.');}
  }
  loadComments();
  document.getElementById('share-blog').addEventListener('click', async () => {
    const url = 'https://tschech.co/protest/';
    const statusNode = document.getElementById('share-status');
    try {
      if (navigator.share) await navigator.share({title:'Protest Bangers',text:'One protest song at a time. Familiar anthems, deep cuts, and a few curveballs.',url});
      else if (navigator.clipboard) {await navigator.clipboard.writeText(url);statusNode.textContent='Link copied. Send someone a good song.';}
      else statusNode.textContent=url;
    } catch (error) {if(error.name !== 'AbortError') statusNode.textContent=url;}
  });
  fetch('/protest/config.json').then(r=>{if(!r.ok)throw new Error('Config');return r.json();}).then(config=>{
    const spotify = typeof config.spotifyPlaylistUrl==='string' && config.spotifyPlaylistUrl.match(/^https:\/\/open\.spotify\.com\/playlist\/([A-Za-z0-9]+)(?:\?.*)?$/);
    const youtube = typeof config.youtubePlaylistUrl==='string' && config.youtubePlaylistUrl.match(/^https:\/\/(?:www\.)?youtube\.com\/playlist\?list=([A-Za-z0-9_-]+)$/);
    const player = document.getElementById('playlist-player');
    if(spotify || youtube){
      const iframe=document.createElement('iframe');iframe.title='Protest Bangers playlist';iframe.loading='lazy';iframe.allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';iframe.allowFullscreen=true;
      iframe.src=spotify ? 'https://open.spotify.com/embed/playlist/'+spotify[1] : 'https://www.youtube.com/embed/videoseries?list='+youtube[1];iframe.height=spotify?'352':'360';player.append(iframe);player.hidden=false;
      const a=document.createElement('a');a.href=spotify?config.spotifyPlaylistUrl:config.youtubePlaylistUrl;a.textContent=spotify?'Open the full playlist on Spotify':'Open the full playlist on YouTube';document.getElementById('playlist-status').replaceChildren(a);
    }
    if (typeof config.supportUrl==='string') {
      try {const url=new URL(config.supportUrl);if(url.protocol!=='https:')return;
        const note=document.querySelector('.note.yellow');note.querySelector('p').textContent='The blog stays free. If you enjoy it, an optional contribution helps keep it going.';
        const a=document.createElement('a');a.href=url.href;a.className='button dark';a.textContent='Contribute what you like';note.insertBefore(a,document.getElementById('share-blog'));
      }catch{}
    }
  }).catch(()=>{});
})();
