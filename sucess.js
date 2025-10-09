// sucess.js — basic interactivity for the plan page
document.addEventListener('DOMContentLoaded', ()=>{
  const activities = Array.from(document.querySelectorAll('.activity-card'));
  const times = Array.from(document.querySelectorAll('.times-row input'));
  const prefTime = document.getElementById('pref-time');
  const saveBtn = document.getElementById('save-btn');
  const backBtn = document.getElementById('back-btn');
  const toast = document.getElementById('toast');

  // toggle activity selection and update the page theme to match the last-selected activity
  activities.forEach(a=> a.addEventListener('click', (e)=>{
    a.classList.toggle('active');
    updateThemeFromSelection();
  }));

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
