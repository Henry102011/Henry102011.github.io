// sucess.js — basic interactivity for the plan page
document.addEventListener('DOMContentLoaded', ()=>{
  const activities = Array.from(document.querySelectorAll('.activity-card'));
  const times = Array.from(document.querySelectorAll('.times-row input'));
  const prefTime = document.getElementById('pref-time');
  const saveBtn = document.getElementById('save-btn');
  const backBtn = document.getElementById('back-btn');
  const toast = document.getElementById('toast');
  const starLayer = document.querySelector('.star-layer');

  // per-activity detail lists and theme updates
  const activityDetailsMap = {
    Coffee: ['Try a cozy cafe', 'Bring a book to share', 'Swap favorite playlists'],
    Walk: ['Pick a scenic route', 'Bring a picnic snack', 'Walk + photo walk challenge'],
    Movies: ['Indie cinema or stream at home', 'Bring a blanket & snacks', 'Vote on a genre'],
    Picnic: ['Choose a park spot', 'Bring homemade treats', 'Pack a small speaker'],
    Museum: ['Check current exhibits', 'Bring student ID for discounts', 'Sketch favorite piece'],
    Dinner: ['Try a new restaurant', 'Cook together at home', 'Themed dinner night']
  };

  // clicking an activity toggles its active state but always sets its theme immediately
  // (last-click wins). Hovering previews the theme without changing the clicked state.
  let currentTheme = null; // stores the class name of the active theme
  activities.forEach(a=>{
    a.addEventListener('click', (e)=>{
      const wasActive = a.classList.contains('active');
      // toggle active visual
      a.classList.toggle('active');
      toggleActivityDetails(a);

      // apply theme of the clicked card
      const theme = 'theme-' + slugify(a.dataset.activity || a.textContent.trim());
      // always remove other theme classes then add this one
      try{ Array.from(document.body.classList).filter(c=> c.startsWith('theme-')).forEach(c=> document.body.classList.remove(c)); }catch(e){}
      // if card was activated by this click, set as current theme; if it was deactivated, try to fall back to last active
      if(!wasActive){
        document.body.classList.add(theme);
        currentTheme = theme;
      } else {
        // card was turned off — find another active card to set as theme, or clear
        const remaining = activities.filter(x=> x.classList.contains('active'));
        if(remaining.length){
          const last = remaining[remaining.length-1];
          const t = 'theme-' + slugify(last.dataset.activity || last.textContent.trim());
          document.body.classList.add(t);
          currentTheme = t;
        } else {
          currentTheme = null;
        }
      }
    });

    // hover preview: temporarily show the hovered activity's theme
    a.addEventListener('pointerenter', ()=>{
      const preview = 'theme-' + slugify(a.dataset.activity || a.textContent.trim());
      try{ Array.from(document.body.classList).filter(c=> c.startsWith('theme-')).forEach(c=> document.body.classList.remove(c)); }catch(e){}
      document.body.classList.add(preview);
    });
    a.addEventListener('pointerleave', ()=>{
      // restore persisted theme (if any) otherwise clear
      try{ Array.from(document.body.classList).filter(c=> c.startsWith('theme-')).forEach(c=> document.body.classList.remove(c)); }catch(e){}
      if(currentTheme) document.body.classList.add(currentTheme);
    });
  });

  function toggleActivityDetails(card){
    const name = card.dataset.activity || card.textContent.trim();
    const key = name;
    let details = card.querySelector('.activity-details');
    if(details){
      // collapse
      details.classList.toggle('open');
      if(!details.classList.contains('open')){
        // remove after animation
        details.addEventListener('animationend', ()=> details.remove(), { once: true });
        details.classList.add('closing');
      }
      return;
    }
    // build details
    const items = activityDetailsMap[key] || ['Plan together!'];
    details = document.createElement('div');
    details.className = 'activity-details open';
    const ul = document.createElement('ul');
    items.forEach(it=>{ const li = document.createElement('li'); li.textContent = it; ul.appendChild(li); });
    details.appendChild(ul);
    card.appendChild(details);
  }

  // star-glaze: spawn gentle shooting stars periodically on the star layer
  let starInterval = null;
  function spawnShootingStar(){
    if(!starLayer) return;
    const s = document.createElement('div');
    s.className = 'shooting-star';
    // randomize start position and length
    const top = Math.random() * 60 + 5; // 5%..65%
    s.style.top = top + '%';
    s.style.left = '-10%';
    // randomize timing slightly via inline style
    s.style.animationDuration = (800 + Math.random()*700) + 'ms';
    starLayer.appendChild(s);
    s.addEventListener('animationend', ()=> s.remove());
  }

  function startStars(){
    // lower frequency on small screens
    const interval = window.matchMedia('(max-width:480px)').matches ? 1800 : 1100;
    starInterval = setInterval(spawnShootingStar, interval);
    // spawn an initial scatter
    for(let i=0;i<3;i++) setTimeout(spawnShootingStar, i*300);
  }
  startStars();

  function slugify(s){ return s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''); }

  function updateThemeFromSelection(){
    const active = activities.filter(a=> a.classList.contains('active'));
    // remove existing theme classes (those starting with 'theme-') - do this safely
    try{
      Array.from(document.body.classList).filter(c=> c.startsWith('theme-')).forEach(c => document.body.classList.remove(c));
    }catch(e){
      // defensive fallback: if anything goes wrong, make sure we don't leave the UI broken
      console.error('Failed to clear theme classes', e);
    }
    if(active.length===0) return; // leave default appearance
    const last = active[active.length-1].dataset.activity || active[active.length-1].textContent;
    const theme = 'theme-' + slugify(last);
    document.body.classList.add(theme);
  }

  // staged entrance: add 'enter' class with staggered delays so options pop in like the short
  function stagedEntrance(){
    activities.forEach((a,i)=>{
      a.classList.add('enter');
      a.style.animationDelay = (i * 80) + 'ms';
    });
    const rows = [document.querySelector('.times-row'), document.querySelector('.time-select'), document.querySelector('.card-foot')];
    rows.forEach((el, idx)=>{ if(!el) return; el.classList.add('enter'); el.style.animationDelay = (activities.length*80 + idx*140) + 'ms'; });
  }
  stagedEntrance();

  backBtn.addEventListener('click', ()=> location.href='Leilah.html');

  function showToast(msg){
    toast.textContent = msg; toast.hidden=false; toast.style.opacity=1;
    setTimeout(()=>{ toast.style.opacity=0; setTimeout(()=> toast.hidden=true,400); }, 2600);
  }

  saveBtn.addEventListener('click', ()=>{
    const chosen = activities.filter(a=> a.classList.contains('active')).map(a=> a.dataset.activity);
    const days = times.filter(i=> i.checked).map(i=> i.value);
    if(chosen.length===0){ showToast('Pick at least one activity ❤️'); return; }
    if(days.length===0){ showToast('Select a day you are free'); return; }
    const payload = { activities: chosen, days, time: prefTime.value };
    // For now we'll just show the selection as confirmation
    showToast('Saved — I will message you soon!');
    console.log('Plan payload', payload);

    // --- Attempt to open SMS composer on the device (or use Web Share) ---
    const phoneNumber = '+19369001876'; // destination phone number provided
    const messageLines = [
      `Plan for Leilah`,
      `Activities: ${chosen.join(', ')}`,
      `Days: ${days.join(', ')}`,
      `Time: ${prefTime.value || 'Any time'}`,
      `\nSent from your planning page.`
    ];
    const messageText = messageLines.join('\n');

    // If the browser supports the Web Share API, open the share sheet first
    if (navigator.share) {
      navigator.share({ title: 'Plan for Leilah', text: messageText }).catch(err=>{
        // fallback to sms: URI if share is cancelled or unsupported for SMS
        const smsUri = `sms:${phoneNumber}?body=${encodeURIComponent(messageText)}`;
        window.location.href = smsUri;
      });
    } else {
      // Try to open the SMS composer (works on most phones). Note: desktop browsers may ignore this.
      const smsUri = `sms:${phoneNumber}?body=${encodeURIComponent(messageText)}`;
      window.location.href = smsUri;
    }

    
  });
});
