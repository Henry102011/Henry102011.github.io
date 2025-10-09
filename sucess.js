// sucess.js — basic interactivity for the plan page
document.addEventListener('DOMContentLoaded', ()=>{
  const activities = Array.from(document.querySelectorAll('.activity-card'));
  const times = Array.from(document.querySelectorAll('.times-row input'));
  const prefTime = document.getElementById('pref-time');
  const saveBtn = document.getElementById('save-btn');
  const backBtn = document.getElementById('back-btn');
  const toast = document.getElementById('toast');

  activities.forEach(a=> a.addEventListener('click', ()=>{
    a.classList.toggle('active');
  }));

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

    // optionally send to server here (fetch POST)
  });
});
