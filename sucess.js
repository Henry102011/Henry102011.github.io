// sucess.js — interactive plan page with stargaze modal and starry animations
document.addEventListener('DOMContentLoaded', ()=>{
  const activities = Array.from(document.querySelectorAll('.activity-card'));
  const times = Array.from(document.querySelectorAll('.times-row input'));
  const prefTime = document.getElementById('pref-time');
  const saveBtn = document.getElementById('save-btn');
  const backBtn = document.getElementById('back-btn');
  const toast = document.getElementById('toast');
  const starLayer = document.querySelector('.star-layer');

  // small map of activity details
  const activityDetailsMap = {
    Coffee: ['Try a cozy cafe', 'Bring a book to share', 'Swap favorite playlists'],
    Walk: ['Pick a scenic route', 'Bring a picnic snack', 'Walk + photo walk challenge'],
    Movies: ['Indie cinema or stream at home', 'Bring a blanket & snacks', 'Vote on a genre'],
    Picnic: ['Choose a park spot', 'Bring homemade treats', 'Pack a small speaker'],
    Museum: ['Check current exhibits', 'Bring student ID for discounts', 'Sketch favorite piece'],
    Dinner: ['Try a new restaurant', 'Cook together at home', 'Themed dinner night'],
    Stargaze: ['Find a dark spot', 'Bring a blanket and warm drinks', 'Check the weather and moon phase']
  };

  // utilities
  function slugify(s){ return s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''); }
  function showToast(msg){ if(!toast) return; toast.textContent = msg; toast.hidden=false; toast.style.opacity=1; setTimeout(()=>{ toast.style.opacity=0; setTimeout(()=> toast.hidden=true,400); }, 2600); }

  // theme management
  let currentTheme = null;
  function applyTheme(theme){ try{ Array.from(document.body.classList).filter(c=> c.startsWith('theme-')).forEach(c=> document.body.classList.remove(c)); }catch(e){} if(theme){ document.body.classList.add(theme); currentTheme = theme; } else currentTheme = null; }

  // activity interactions: click toggles active; click sets theme; hover previews
  activities.forEach(a=>{
    a.addEventListener('click', ()=>{
      const wasActive = a.classList.contains('active');
      a.classList.toggle('active');
      toggleActivityDetails(a);
      const t = 'theme-' + slugify(a.dataset.activity || a.textContent.trim());
      if(!wasActive){ applyTheme(t); } else {
        // find fallback
        const remaining = activities.filter(x=> x.classList.contains('active'));
        if(remaining.length) applyTheme('theme-' + slugify(remaining[remaining.length-1].dataset.activity)); else applyTheme(null);
      }
    });
    a.addEventListener('pointerenter', ()=>{ const p = 'theme-' + slugify(a.dataset.activity || a.textContent.trim()); try{ Array.from(document.body.classList).filter(c=> c.startsWith('theme-')).forEach(c=> document.body.classList.remove(c)); }catch(e){} document.body.classList.add(p); });
    a.addEventListener('pointerleave', ()=>{ try{ Array.from(document.body.classList).filter(c=> c.startsWith('theme-')).forEach(c=> document.body.classList.remove(c)); }catch(e){} if(currentTheme) document.body.classList.add(currentTheme); });
  });

  // details drawer inside activity card
  function toggleActivityDetails(card){
    const name = card.dataset.activity || card.textContent.trim();
    const items = activityDetailsMap[name] || ['Plan together!'];
    let details = card.querySelector('.activity-details');
    if(details){ details.remove(); return; }
    details = document.createElement('div'); details.className = 'activity-details open'; const ul = document.createElement('ul'); items.forEach(it=>{ const li = document.createElement('li'); li.textContent = it; ul.appendChild(li); }); details.appendChild(ul); card.appendChild(details);
  }

  // shooting stars (background accents)
  function spawnShootingStar(){ if(!starLayer) return; const s = document.createElement('div'); s.className='shooting-star'; const top = Math.random()*60 + 5; s.style.top = top + '%'; s.style.left='-10%'; s.style.animationDuration = (900 + Math.random()*900)+'ms'; starLayer.appendChild(s); s.addEventListener('animationend', ()=> s.remove()); }
  setInterval(()=>{ if(Math.random() < 0.6) spawnShootingStar(); }, 900);

  // falling star CTA and modal wiring
  const modal = document.getElementById('stargaze-modal');
  const sgForm = document.getElementById('stargaze-form');
  const sgDate = document.getElementById('sg-date');
  const sgTime = document.getElementById('sg-time');
  const stargazeCard = activities.find(a=> a.dataset.activity === 'Stargaze');

  function spawnFallingStar(){ const s = document.createElement('div'); s.className='falling-star'; s.style.left = (30 + Math.random()*40)+'vw'; s.style.top = '-6vh'; s.title='Tap to plan a stargazing date'; document.body.appendChild(s); s.addEventListener('click', ()=>{ openModal(); s.remove(); }); requestAnimationFrame(()=> s.classList.add('shoot')); setTimeout(()=> s.remove(), 1800); }
  setInterval(()=>{ if(Math.random() < 0.35) spawnFallingStar(); }, 2400);

  function openModal(){ if(!modal) return; modal.hidden = false; }
  function closeModal(){ if(!modal) return; modal.hidden = true; }
  document.addEventListener('click', (e)=>{ const close = e.target.closest('[data-close]'); if(close) closeModal(); });
  document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeModal(); });

  sgForm && sgForm.addEventListener('submit', (e)=>{ e.preventDefault(); if(!sgDate.value || !sgTime.value) return; if(stargazeCard && !stargazeCard.classList.contains('active')) stargazeCard.classList.add('active'); applyTheme('theme-' + slugify('Stargaze')); showToast(`Stargaze planned: ${sgDate.value} ${sgTime.value}`); closeModal(); prefTime.value = sgTime.value; });

  // staged entrance
  function stagedEntrance(){ activities.forEach((a,i)=>{ a.classList.add('enter'); a.style.animationDelay = (i*80)+'ms'; }); const rows = [document.querySelector('.times-row'), document.querySelector('.time-select'), document.querySelector('.card-foot')]; rows.forEach((el,idx)=>{ if(!el) return; el.classList.add('enter'); el.style.animationDelay = (activities.length*80 + idx*140)+'ms'; }); }
  stagedEntrance();

  // back button
  backBtn && backBtn.addEventListener('click', ()=> location.href='Leilah.html');

  // save button (keeps previous SMS behavior)
  saveBtn && saveBtn.addEventListener('click', ()=>{
    const chosen = activities.filter(a=> a.classList.contains('active')).map(a=> a.dataset.activity);
    const days = times.filter(i=> i.checked).map(i=> i.value);
    if(chosen.length===0){ showToast('Pick at least one activity ❤️'); return; }
    if(days.length===0){ showToast('Select a day you are free'); return; }
    const payload = { activities: chosen, days, time: prefTime.value };
    showToast('Saved — I will message you soon!'); console.log('Plan payload', payload);
    const phoneNumber = '+19369001876'; const messageLines = [ `Plan for Leilah`, `Activities: ${chosen.join(', ')}`, `Days: ${days.join(', ')}`, `Time: ${prefTime.value || 'Any time'}`, `\nSent from your planning page.` ]; const messageText = messageLines.join('\n'); if(navigator.share){ navigator.share({ title:'Plan for Leilah', text: messageText }).catch(()=> window.location.href = `sms:${phoneNumber}?body=${encodeURIComponent(messageText)}`); } else { window.location.href = `sms:${phoneNumber}?body=${encodeURIComponent(messageText)}`; }
  });
});
