/* Virtual English Lab SMP — mesin bersama: audio, halaman unit, latihan, kuis, dan 17 jenis lab interaktif.
   Setiap unit hanya berisi data (window.GRADE di kelas-N/data.js). */
(function(){
const E = window.ENG = {};
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const rand=(a,b)=>Math.floor(Math.random()*(b-a+1))+a, pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const clean=t=>String(t).toLowerCase().replace(/[’‘`]/g,"'").replace(/[.,!?;:"]/g,' ').replace(/\s+/g,' ').trim();
Object.assign(E,{$,$$,rand,pick,shuf,esc,clean});
/* ---------- penyimpanan ---------- */
E.store={ get(k){ try{ const v=localStorage.getItem('engsmp:'+k); return v==null?null:JSON.parse(v); }catch(e){ return null; } },
  set(k,v){ try{ localStorage.setItem('engsmp:'+k,JSON.stringify(v)); }catch(e){} } };
/* ---------- suara ---------- */
E.rate=0.85;
E.say=(t,rate,onend)=>{ try{ if(!('speechSynthesis' in window)){ onend&&setTimeout(onend,600); return; } const u=new SpeechSynthesisUtterance(String(t).replace(/<[^>]+>/g,'')); u.lang='en-US'; u.rate=rate||E.rate;
  const vs=speechSynthesis.getVoices().filter(v=>/^en/i.test(v.lang)); if(vs.length) u.voice=vs.find(v=>/en-US/i.test(v.lang))||vs[0];
  if(onend){ u.onend=onend; u.onerror=onend; } speechSynthesis.cancel(); speechSynthesis.speak(u); }catch(e){ onend&&onend(); } };
E.sp=(t,label)=>`<button class="say" type="button" data-say="${esc(t)}" aria-label="Dengarkan: ${esc(t)}">🔊${label?' '+label:''}</button>`;
document.addEventListener('click',e=>{ const b=e.target.closest('[data-say]'); if(b){ e.preventDefault(); E.say(b.dataset.say); } });
/* ---------- angka ke kata ---------- */
const ONES=['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'], TENS=['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
E.num=n=>{ if(n<20) return ONES[n]; if(n<100) return TENS[Math.floor(n/10)]+(n%10?'-'+ONES[n%10]:''); if(n<1000) return ONES[Math.floor(n/100)]+' hundred'+(n%100?' and '+E.num(n%100):''); if(n<1e6) return E.num(Math.floor(n/1000))+' thousand'+(n%1000?(n%1000<100?' and ':' ')+E.num(n%1000):''); return String(n); };
E.rp=n=>'Rp'+n.toLocaleString('id-ID');
/* ---------- kerangka halaman ---------- */
function shell(G,title,inner,back){ document.body.dataset.g=G.g; document.title=title+' · Virtual English Lab SMP';
  document.body.innerHTML=`<header class="top"><div class="wrap"><a class="back" href="${back||'index.html'}">← ${back?'Beranda':G.name}</a><div class="brand">📘 English Lab SMP <small>· ${G.name} · ${G.theme}</small></div></div></header><div class="wrap">${inner}</div><footer><div class="wrap">Virtual English Lab SMP · ${G.name} · Tekan 🔊 untuk mendengar pelafalan</div></footer>`;
  const s=document.createElement('script'); s.src='../shared/nav.js'; document.body.appendChild(s); }
function tabs(){ const bs=$$('.tabs button'); const go=(id,u)=>{ bs.forEach(b=>b.classList.toggle('on',b.dataset.t===id)); $$('.panel').forEach(p=>p.classList.toggle('on',p.id===id)); if(u) try{ history.replaceState(null,'','#'+id); }catch(e){} };
  bs.forEach(b=>b.onclick=()=>{ go(b.dataset.t,1); window.scrollTo({top:Math.min(window.scrollY,$('.tabs').offsetTop-60)}); }); const h=location.hash.slice(1); go(bs.some(b=>b.dataset.t===h)?h:bs[0].dataset.t); if(h) setTimeout(()=>window.scrollTo(0,0),0); }
/* ---------- halaman unit ---------- */
E.page=function(i){
  const G=window.GRADE, M=G.mods[i];
  const labs=M.labs||[];
  let h=`<section class="hero"><span class="chip">Unit ${i+1} · ${M.ic} ${esc(M.tag||'')}</span><h1>${M.t}</h1><p class="sub">${M.sub}</p>
    <div class="goals"><b>Setelah unit ini kamu bisa:</b><ul>${M.goals.map(g=>`<li>${g}</li>`).join('')}</ul></div></section>
    <nav class="tabs"><button data-t="cerita">📖 Cerita & Kata</button>${labs.map((L,k)=>`<button data-t="lab${k}">${L.ic||'🧪'} ${esc(L.t)}</button>`).join('')}<button data-t="latihan">✏️ Latihan</button><button data-t="kuis">🏆 Kuis</button></nav>
    <main><section class="panel" id="cerita">`;
  if(M.story){ h+=`<div class="card"><h2><span class="ic">💬</span>${esc(M.story.t)}</h2><div class="row"><button class="btn" id="playall">▶ Putar semua</button><button class="btn ghost" id="tgid">Tampilkan arti</button></div><div class="dlg" id="dlg">${M.story.lines.map((l,k)=>`<div class="ln ${l[4]?'r':''}"><div class="av">${l[0]}</div><div class="bub" data-k="${k}"><div class="who">${esc(l[1])}</div><div class="en">${esc(l[2])} ${E.sp(l[2])}</div><div class="id">${esc(l[3])}</div></div></div>`).join('')}</div></div>`; }
  h+=`<div class="card"><h2><span class="ic">🃏</span>Kata baru <small class="muted" style="font-size:.9rem">(ketuk kartu untuk mendengar)</small></h2><div class="vgrid">${M.vocab.map(v=>`<button class="vc" data-w="${esc(v[1])}"><span class="em">${v[0]}</span><b>${esc(v[1])}</b><small>${esc(v[2])}</small></button>`).join('')}</div></div>`;
  if(M.phr&&M.phr.length) h+=`<div class="card"><h2><span class="ic">🗣️</span>Ungkapan penting</h2><table class="t">${M.phr.map(p=>`<tr><td><b>${esc(p[0])}</b> ${E.sp(p[0])}</td><td class="muted">${esc(p[1])}</td></tr>`).join('')}</table></div>`;
  const GL=(window.GRAM||[]).filter(t=>(t.units||[]).some(u=>u[0]===G.g&&u[1]===i+1));
  if(M.tip||GL.length) h+=`<div class="card"><h2><span class="ic">💡</span>Tips bahasa</h2>${M.tip?`<div class="tip">${M.tip}</div>`:''}${GL.length?`<div class="grl"><span class="muted" style="font-weight:800;align-self:center">🧩 Grammar Lab:</span>${GL.map(t=>`<a href="../grammar/${t.id}.html">${t.ic} ${esc(t.t)}</a>`).join('')}</div>`:''}</div>`;
  if(M.chant) h+=`<div class="card"><h2><span class="ic">🎵</span>${esc(M.chant.t)}</h2><div class="row"><button class="btn soft" id="chant">▶ Dengarkan chant</button></div><div class="chant">${M.chant.l.map(x=>esc(x)).join('<br>')}</div></div>`;
  h+=`</section>`;
  labs.forEach((L,k)=>{ h+=`<section class="panel" id="lab${k}"><div class="card"><h2><span class="ic">${L.ic||'🧪'}</span>${esc(L.t)}</h2><p>${L.d||''}</p><div id="w${k}"></div></div></section>`; });
  h+=`<section class="panel" id="latihan"><div class="card"><h2><span class="ic">✏️</span>Latihan tanpa batas</h2><p class="muted">Soal selalu baru. Kumpulkan bintang sebanyak-banyaknya!</p><div id="prac"></div></div></section>
    <section class="panel" id="kuis"><div class="card"><h2><span class="ic">🏆</span>Kuis Unit ${i+1}</h2><p class="muted">12 soal. Nilai terbaik tersimpan di perangkat ini.</p><div id="quiz"></div></div></section></main>`;
  shell(G,M.t.replace(/<[^>]+>/g,''),h);
  tabs();
  $$('.vc').forEach(b=>b.onclick=()=>{ E.say(b.dataset.w); b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop'); });
  if(M.story){ $('#tgid').onclick=()=>{ $('#dlg').classList.toggle('show-id'); $('#tgid').textContent=$('#dlg').classList.contains('show-id')?'Sembunyikan arti':'Tampilkan arti'; };
    $('#playall').onclick=()=>{ const L=M.story.lines; let k=0; const nx=()=>{ $$('.bub').forEach(b=>b.classList.remove('now')); if(k>=L.length) return; const b=$(`.bub[data-k="${k}"]`); b.classList.add('now'); E.say(L[k][2],E.rate,()=>{ k++; setTimeout(nx,250); }); }; nx(); }; }
  if(M.chant) $('#chant').onclick=()=>E.say(M.chant.l.join('. '),0.8);
  labs.forEach((L,k)=>{ try{ W[L.w]($('#w'+k),L,M,G); }catch(err){ $('#w'+k).innerHTML='<p class="muted">Lab gagal dimuat.</p>'; console.error(err); } });
  practice($('#prac'),M,G); quiz($('#quiz'),M,G,'e'+G.g+'m'+(i+1));
};
/* ---------- indeks kelas ---------- */
E.index=function(){
  const G=window.GRADE;
  let s=0,c=0; const cards=G.mods.map((M,i)=>{ const b=E.store.get('e'+G.g+'m'+(i+1)); if(b!=null){ s+=b; c++; }
    return `<a class="mod" href="${M.f}"><div class="ic">${M.ic}</div><span class="muted" style="font-size:.78rem;font-weight:900">UNIT ${i+1}</span><h3>${M.t}</h3><p>${M.sub}</p><div class="best">${b!=null?'⭐ Nilai kuis terbaik: '+b:'Belum mengerjakan kuis'}</div><div class="prog"><i style="width:${b||0}%"></i></div></a>`; }).join('');
  const nv=G.mods.reduce((a,M)=>a+M.vocab.length,0);
  shell(G,G.name,`<section class="hero"><span class="chip">${G.phase} · ${G.mods.length} unit</span><h1>English ${G.name}: <span class="em">${G.tag}</span></h1><p class="sub">${G.lead}</p>
   <div class="row"><span class="chip" style="background:var(--acc2)">${nv} kata bergambar</span><span class="chip" style="background:var(--sun);color:#3a2a00">${G.mods.length*2} lab interaktif</span><span class="chip" style="background:var(--card);color:var(--ink)">Rata-rata kuis: ${c?Math.round(s/c):'–'}</span></div></section>
   <div class="mods">${cards}</div>
   <div class="card"><h2>👩‍🏫 Untuk guru & orang tua</h2><p>Setiap unit: <b>📖 Cerita & Kata</b> (dialog bersuara, kartu kata, ungkapan, tips, chant), dua <b>lab interaktif</b>, <b>✏️ Latihan</b> tanpa batas, dan <b>🏆 Kuis</b> 12 soal. Suara memakai pembaca teks bawaan perangkat (bahasa Inggris), jadi tetap berjalan tanpa internet.</p>
   <p class="muted">Materi mengikuti alur buku ${G.src}. Dialog, cerita, dan soal ditulis ulang.</p><button class="btn ghost" id="rs">Hapus nilai ${G.name} di perangkat ini</button></div>`,'../index.html');
  $('#rs').onclick=()=>{ if(confirm('Hapus nilai kuis '+G.name+'?')){ G.mods.forEach((M,i)=>{ try{ localStorage.removeItem('engsmp:e'+G.g+'m'+(i+1)); }catch(e){} }); location.reload(); } };
};
/* ---------- bank soal otomatis ---------- */
const words=M=>M.vocab.filter(v=>v[1]);
function mcFrom(list,ans,key,n=4){ const o=shuf([ans].concat(shuf(list.filter(x=>x[key]!==ans[key])).slice(0,n-1))); return {o,a:o.indexOf(ans)}; }
const showWord=G=>G.g>=3;
E.gen={
  listen(M,G){ const V=words(M), t=pick(V), m=mcFrom(V,t,1); return {p:'Dengarkan, lalu pilih gambar yang tepat.',say:t[1],o:m.o.map(v=>`<span class="em">${v[0]}</span>${showWord(G)?'':''}`),a:m.a,ex:`${t[0]} ${t[1]} = ${t[2]}`}; },
  pic(M,G){ const V=words(M), t=pick(V), m=mcFrom(V,t,1); return {p:`<span class="huge">${t[0]}</span><br>What is this? / Apa ini?`,o:m.o.map(v=>esc(v[1])),a:m.a,sayAns:t[1],ex:`${t[1]} = ${t[2]}`}; },
  mean(M,G){ const V=words(M), t=pick(V), m=mcFrom(V,t,2); return {p:`Arti kata <b>${esc(t[1])}</b> ${E.sp(t[1])} adalah …`,o:m.o.map(v=>esc(v[2])),a:m.a,ex:`${t[1]} = ${t[2]}`}; },
  rev(M,G){ const V=words(M), t=pick(V), m=mcFrom(V,t,1); return {p:`Bahasa Inggris dari <b>${esc(t[2])}</b> adalah …`,o:m.o.map(v=>esc(v[1])),a:m.a,sayAns:t[1],ex:`${t[2]} = ${t[1]}`}; },
  phr(M,G){ const P=M.phr||[]; if(P.length<3) return E.gen.pic(M,G); const t=pick(P), m=mcFrom(P,t,0,Math.min(4,P.length)); return {p:`Ungkapan bahasa Inggris untuk: <b>“${esc(t[1])}”</b>`,o:m.o.map(v=>esc(v[0])),a:m.a,sayAns:t[0],ex:`${t[0]} = ${t[1]}`}; },
  spell(M,G){ const V=words(M).filter(v=>/^[a-z ]+$/i.test(v[1])&&v[1].length<=14); const t=pick(V.length?V:words(M)); return {p:`<span class="huge">${t[0]}</span><br>Tulis kata bahasa Inggrisnya. ${E.sp(t[1],'Dengar')}`,type:true,ans:[t[1]],ex:`${t[1]} = ${t[2]}`}; },
  custom(M,G){ const Q=M.quiz||[]; if(!Q.length) return E.gen.pic(M,G); const q=pick(Q), o=shuf(q.o.map((x,i)=>i)); return {p:q.q,say:q.say,o:o.map(i=>esc(q.o[i])),a:o.indexOf(0),ex:q.ex||''}; }
};
function pool(G){ const p=['listen','pic','mean','rev','phr','custom']; if(G.g>=3) p.push('spell'); if(G.g<=2) p.push('listen','pic'); return p; }
/* ---------- penampil soal ---------- */
function ask(el,q,done){
  let tries=0;
  el.innerHTML=`<div class="q">${q.p}</div>${q.say?`<div class="row"><button class="btn soft" data-say="${esc(q.say)}">🔊 Dengarkan</button></div>`:''}`+
    (q.type?`<div class="row"><input class="txt" id="ti" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="ketik di sini"><button class="btn" id="tc">Periksa</button></div>`:`<div class="opts">${q.o.map((o,i)=>`<button class="opt" data-i="${i}">${o}</button>`).join('')}</div>`)+`<div class="fbx"></div>`;
  if(q.say) setTimeout(()=>E.say(q.say),250);
  const fin=(ok)=>{ $('.fbx',el).innerHTML=`<div class="fb ${ok?'ok':'no'}">${ok?'✅ Great job!':'❌ Belum tepat.'} ${q.ex||''}</div>`; if(q.sayAns) E.say(q.sayAns); done(ok,tries); };
  if(q.type){ const go=()=>{ const v=$('#ti',el).value; if(!v.trim()) return; const ok=q.ans.some(a=>clean(a)===clean(v)); tries++; if(ok||tries>=2){ $('#tc',el).disabled=true; $('#ti',el).disabled=true; fin(ok); } else { $('.fbx',el).innerHTML='<div class="fb no">Hampir! Coba sekali lagi. Dengarkan lagi pelafalannya.</div>'; } };
    $('#tc',el).onclick=go; $('#ti',el).onkeydown=e=>{ if(e.key==='Enter') go(); }; setTimeout(()=>{ try{ $('#ti',el).focus({preventScroll:true}); }catch(e){} },50); return; }
  $$('.opt',el).forEach(b=>b.onclick=()=>{ const i=+b.dataset.i; $$('.opt',el).forEach(x=>x.disabled=true); b.classList.add(i===q.a?'good':'no'); $$('.opt',el)[q.a].classList.add('good'); fin(i===q.a); });
}
function practice(el,M,G){
  let st=0, n=0; const P=pool(G);
  const next=()=>{ el.innerHTML=`<div class="row"><span class="stars">⭐ ${st}</span><span class="muted">dari ${n} soal</span></div><div id="pq"></div><div class="row"><button class="btn" id="pn" style="display:none">Soal berikutnya →</button></div>`;
    let q; try{ q=E.gen[pick(P)](M,G); }catch(e){ q=E.gen.pic(M,G); }
    ask($('#pq',el),q,(ok)=>{ n++; if(ok) st++; $('.stars',el).textContent='⭐ '+st; $('.stars',el).nextElementSibling.textContent='dari '+n+' soal'; $('#pn',el).style.display=''; });
    $('#pn',el).onclick=next; };
  next();
}
function quiz(el,M,G,key){
  const plan=['listen','listen','pic','pic','mean','rev','phr','phr','custom','custom','custom',G.g>=3?'spell':'listen'];
  let Q=[], seen=new Set();
  plan.forEach(t=>{ for(let k=0;k<12;k++){ let q; try{ q=E.gen[t](M,G); }catch(e){ q=E.gen.pic(M,G); } const sig=t+'|'+q.p+'|'+(q.say||''); if(!seen.has(sig)||k===11){ seen.add(sig); Q.push(q); break; } } });
  Q=shuf(Q);
  let i=0, sc=0;
  const best=E.store.get(key);
  const show=()=>{ if(i>=Q.length){ const s=Math.round(sc/Q.length*100); const b=E.store.get(key); if(b==null||s>b) E.store.set(key,s);
      el.innerHTML=`<div class="stage" style="text-align:center"><div class="huge">${s>=80?'🏆':s>=60?'🌟':'💪'}</div><div class="big">Nilai kamu: ${s}</div><p>${sc} dari ${Q.length} benar. ${s>=80?'Excellent! Kamu hebat!':s>=60?'Good job! Sedikit lagi sempurna.':'Keep trying! Ulangi Cerita & Kata, lalu coba lagi.'}</p><p class="muted">Nilai terbaik: ${Math.max(s,b||0)}</p><button class="btn" id="qa">Ulangi kuis</button></div>`;
      $('#qa',el).onclick=()=>quiz(el,M,G,key); return; }
    el.innerHTML=`<div class="row"><b>Soal ${i+1} / ${Q.length}</b><span class="score">Benar: ${sc}</span>${best!=null?`<span class="muted">Terbaik: ${best}</span>`:''}</div><div class="prog"><i style="width:${i/Q.length*100}%"></i></div><div id="qq"></div><div class="row"><button class="btn" id="qn" style="display:none">${i+1<Q.length?'Lanjut →':'Lihat nilai'}</button></div>`;
    ask($('#qq',el),Q[i],(ok)=>{ if(ok) sc++; $('#qn',el).style.display=''; });
    $('#qn',el).onclick=()=>{ i++; show(); }; };
  show();
}
/* ================= LAB / WIDGET ================= */
const W=E.W={};
const endBox=(el,msg,again)=>{ el.innerHTML=`<div class="stage" style="text-align:center"><div class="huge">🎉</div><div class="big">${msg}</div><button class="btn" id="ag">Main lagi</button></div>`; $('#ag',el).onclick=again; };
/* 1. Dengar & ketuk */
W.listen=function(el,c,M,G){ const V=c.items||words(M); let r=0,s=0; const R=c.rounds||8;
  const go=()=>{ if(r>=R) return endBox(el,`Skor ${s} dari ${R}! ${s>=R-1?'Super!':'Ayo coba lagi!'}`,()=>{ r=0; s=0; go(); });
    const t=pick(V), set=shuf([t].concat(shuf(V.filter(v=>v!==t)).slice(0,Math.min(5,V.length-1))));
    el.innerHTML=`<div class="stage"><div class="row"><button class="btn soft" id="pl">🔊 Putar</button><span class="muted">Ronde ${r+1}/${R}</span><span class="score">⭐ ${s}</span></div><p class="q">${c.ask?c.ask:'Dengarkan, lalu ketuk gambarnya!'}</p><div class="opts">${set.map((v,i)=>`<button class="opt" data-i="${i}"><span class="em">${v[0]}</span>${c.label?esc(v[1]):''}</button>`).join('')}</div><div class="fbx"></div></div>`;
    const phrase=c.frame?c.frame.replace('{w}',t[1]):t[1]; $('#pl',el).onclick=()=>E.say(phrase); setTimeout(()=>E.say(phrase),300);
    $$('.opt',el).forEach(b=>b.onclick=()=>{ const v=set[+b.dataset.i]; $$('.opt',el).forEach(x=>x.disabled=true); const ok=v===t; b.classList.add(ok?'good':'no'); $$('.opt',el)[set.indexOf(t)].classList.add('good'); if(ok) s++;
      $('.fbx',el).innerHTML=`<div class="fb ${ok?'ok':'no'}">${ok?'✅':'❌'} ${t[0]} <b>${esc(t[1])}</b> = ${esc(t[2])}</div>`; E.say(ok?'Yes! '+t[1]:t[1]); setTimeout(()=>{ r++; go(); },1300); }); };
  go(); };
/* 2. Pasangkan kata-gambar */
W.match=function(el,c,M,G){ const V=c.items||words(M);
  const go=()=>{ const set=shuf(V).slice(0,Math.min(6,V.length)); const L=shuf(set), Rr=shuf(set); let sel=null, done=0;
    el.innerHTML=`<div class="stage"><p class="q">Ketuk sebuah kata, lalu ketuk gambarnya.</p><div class="bins" style="grid-template-columns:1fr 1fr"><div id="ml" class="opts" style="grid-template-columns:1fr"></div><div id="mr" class="opts" style="grid-template-columns:repeat(auto-fill,minmax(90px,1fr))"></div></div><div class="fbx"></div></div>`;
    $('#ml',el).innerHTML=L.map((v,i)=>`<button class="opt" data-i="${i}">${esc(v[1])}</button>`).join('');
    $('#mr',el).innerHTML=Rr.map((v,i)=>`<button class="opt" data-j="${i}"><span class="em">${v[0]}</span></button>`).join('');
    $$('#ml .opt',el).forEach(b=>b.onclick=()=>{ $$('#ml .opt',el).forEach(x=>x.classList.remove('sel')); b.classList.add('sel'); sel=+b.dataset.i; E.say(L[sel][1]); });
    $$('#mr .opt',el).forEach(b=>b.onclick=()=>{ if(sel==null){ $('.fbx',el).innerHTML='<div class="fb no">Pilih kata dulu di kolom kiri.</div>'; return; } const v=Rr[+b.dataset.j];
      if(v===L[sel]){ b.classList.add('good','done'); const lb=$(`#ml .opt[data-i="${sel}"]`,el); lb.classList.remove('sel'); lb.classList.add('good','done'); sel=null; done++; $('.fbx',el).innerHTML=`<div class="fb ok">✅ ${v[0]} ${esc(v[1])} = ${esc(v[2])}</div>`;
        if(done===set.length) setTimeout(()=>endBox(el,'Semua pasangan benar!',go),700); }
      else { b.classList.add('no'); setTimeout(()=>b.classList.remove('no'),400); } }); };
  go(); };
/* 3. Susun kalimat */
W.build=function(el,c){ const S=shuf(c.s); let k=0,s=0;
  const go=()=>{ if(k>=S.length) return endBox(el,`${s} dari ${S.length} kalimat langsung benar!`,()=>{ k=0; s=0; go(); });
    const [en,id]=S[k]; const toks=en.split(' '); const sh=shuf(toks.map((t,i)=>i)); let ans=[], tries=0;
    el.innerHTML=`<div class="stage"><div class="row"><span class="muted">Kalimat ${k+1}/${S.length}</span><span class="score">⭐ ${s}</span></div><p class="q">Susun kalimat: <i>“${esc(id)}”</i> ${E.sp(en,'Dengar')}</p><div class="tiles ans" id="ba"></div><div class="tiles" id="bp">${sh.map(i=>`<button class="tile" data-i="${i}">${esc(toks[i])}</button>`).join('')}</div><div class="row"><button class="btn" id="bc">Periksa</button><button class="btn ghost" id="bu">↺ Ulang</button></div><div class="fbx"></div></div>`;
    const draw=()=>{ $('#ba',el).innerHTML=ans.map((i,j)=>`<button class="tile" data-j="${j}">${esc(toks[i])}</button>`).join(''); $$('#bp .tile',el).forEach(b=>b.classList.toggle('used',ans.includes(+b.dataset.i))); $$('#ba .tile',el).forEach(b=>b.onclick=()=>{ ans.splice(+b.dataset.j,1); draw(); }); };
    $$('#bp .tile',el).forEach(b=>b.onclick=()=>{ const i=+b.dataset.i; if(!ans.includes(i)){ ans.push(i); draw(); } });
    $('#bu',el).onclick=()=>{ ans=[]; draw(); };
    $('#bc',el).onclick=()=>{ const got=ans.map(i=>toks[i]).join(' '); if(clean(got)===clean(en)){ if(!tries) s++; $('.fbx',el).innerHTML=`<div class="fb ok">✅ ${esc(en)}</div><button class="btn" id="bn">Berikutnya →</button>`; E.say(en); $('#bn',el).onclick=()=>{ k++; go(); }; }
      else { tries++; $('.fbx',el).innerHTML=`<div class="fb no">❌ Belum tepat. ${tries>=2?'Jawaban: <b>'+esc(en)+'</b>':'Coba lagi, perhatikan urutannya.'}</div>${tries>=2?'<button class="btn" id="bn">Berikutnya →</button>':''}`; if(tries>=2) $('#bn',el).onclick=()=>{ k++; go(); }; } }; };
  go(); };
/* 4. Percakapan pilih jawaban */
W.dialog=function(el,c){ let k=0, s=0;
  const go=()=>{ el.innerHTML=`<div class="stage"><div class="chat" id="ch"></div><div id="co"></div></div>`; k=0; s=0; turn(); };
  const add=(av,who,txt,me)=>{ const d=document.createElement('div'); d.className='ln'+(me?' r':''); d.innerHTML=`<div class="av">${av}</div><div class="bub"><div class="who">${esc(who)}</div><div class="en">${esc(txt)} ${E.sp(txt)}</div></div>`; $('#ch',el).appendChild(d); $('#ch',el).scrollTop=1e5; };
  const turn=()=>{ if(k>=c.turns.length){ $('#co',el).innerHTML=`<div class="fb ok">🎉 Percakapan selesai! ${s} dari ${c.turns.length} jawaban langsung tepat.</div><button class="btn" id="dr">Ulangi percakapan</button>`; $('#dr',el).onclick=go; return; }
    const T=c.turns[k]; add(T.av||c.av||'🧑',T.who||c.who||'Friend',T.q); E.say(T.q); let tries=0;
    const o=shuf(T.a.map((x,i)=>i));
    $('#co',el).innerHTML=`<p class="q">Pilih jawabanmu:</p><div class="opts" style="grid-template-columns:1fr">${o.map(i=>`<button class="opt" data-i="${i}" style="text-align:left">${esc(T.a[i])}</button>`).join('')}</div><div class="fbx"></div>`;
    $$('#co .opt',el).forEach(b=>b.onclick=()=>{ const i=+b.dataset.i; if(i===0){ if(!tries) s++; add(c.me||'🧒','Me',T.a[0],true); E.say(T.a[0]); k++; setTimeout(turn,900); $('#co',el).innerHTML=''; }
      else { tries++; b.classList.add('no'); $('.fbx',el).innerHTML=`<div class="fb no">Hmm, kurang cocok. ${T.hint?esc(T.hint):''}</div>`; } }); };
  go(); };
/* 5. Hitung benda */
W.count=function(el,c){ const max=c.max||10; let r=0,s=0; const R=8;
  const go=()=>{ if(r>=R) return endBox(el,`Skor ${s} dari ${R}!`,()=>{ r=0; s=0; go(); });
    const it=pick(c.items), n=rand(1,max); const pl=n===1?it[1]:it[2]; const opts=shuf([n].concat(shuf([...Array(max).keys()].map(x=>x+1).filter(x=>x!==n)).slice(0,3)));
    el.innerHTML=`<div class="stage"><div class="row"><span class="muted">Ronde ${r+1}/${R}</span><span class="score">⭐ ${s}</span><button class="btn soft" id="cp">🔊 Pertanyaan</button></div><div style="font-size:2.2rem;line-height:1.3;letter-spacing:4px;text-align:center;padding:8px">${Array(n).fill(it[0]).join('')}</div><p class="q">How many ${esc(it[2])}?</p><div class="opts">${opts.map(x=>`<button class="opt" data-n="${x}">${E.num(x)}</button>`).join('')}</div><div class="fbx"></div></div>`;
    const qs=`How many ${it[2]}?`; $('#cp',el).onclick=()=>E.say(qs); setTimeout(()=>E.say(qs),300);
    $$('.opt',el).forEach(b=>b.onclick=()=>{ const x=+b.dataset.n, ok=x===n; $$('.opt',el).forEach(y=>y.disabled=true); b.classList.add(ok?'good':'no'); $$('.opt',el).find(y=>+y.dataset.n===n).classList.add('good'); if(ok) s++;
      const sent=n===1?`There is one ${it[1]}.`:`There are ${E.num(n)} ${it[2]}.`; $('.fbx',el).innerHTML=`<div class="fb ${ok?'ok':'no'}">${ok?'✅':'❌'} ${esc(sent)} (${n})</div>`; E.say(sent); setTimeout(()=>{ r++; go(); },1700); }); };
  go(); };
/* 6. Mewarnai bentuk */
W.color=function(el,c){ const C=c.colors, S=c.shapes; let cur=null, task=null, s=0, n=0;
  const shp=(t,x,y)=>{ const r=42; if(t==='circle') return `<circle cx="${x}" cy="${y}" r="${r}"/>`; if(t==='square') return `<rect x="${x-r}" y="${y-r}" width="${2*r}" height="${2*r}" rx="6"/>`; if(t==='rectangle') return `<rect x="${x-r*1.25}" y="${y-r*.7}" width="${2.5*r}" height="${1.4*r}" rx="6"/>`;
    if(t==='triangle') return `<polygon points="${x},${y-r} ${x+r},${y+r*.8} ${x-r},${y+r*.8}"/>`; if(t==='star'){ let p=''; for(let i=0;i<10;i++){ const a=-Math.PI/2+i*Math.PI/5, rr=i%2?r*.45:r; p+=`${x+rr*Math.cos(a)},${y+rr*Math.sin(a)} `; } return `<polygon points="${p}"/>`; }
    if(t==='heart') return `<path d="M${x},${y+r*.85} C${x-r*1.4},${y-r*.1} ${x-r*.7},${y-r*1.2} ${x},${y-r*.45} C${x+r*.7},${y-r*1.2} ${x+r*1.4},${y-r*.1} ${x},${y+r*.85}Z"/>`;
    if(t==='oval') return `<ellipse cx="${x}" cy="${y}" rx="${r*1.2}" ry="${r*.75}"/>`; return `<circle cx="${x}" cy="${y}" r="${r}"/>`; };
  const fills={};
  const newTask=()=>{ task=[pick(S),pick(C)]; $('#ct',el).innerHTML=`Color the <b>${task[0][0]}</b> <b style="color:${task[1][1]}">${task[1][0]}</b>. ${E.sp('Color the '+task[0][0]+' '+task[1][0])}`; E.say('Color the '+task[0][0]+' '+task[1][0]); };
  el.innerHTML=`<div class="stage"><p class="q" id="ct"></p><div class="row" id="pal">${C.map((x,i)=>`<button class="note" data-i="${i}" style="background:${x[1]};color:${/white|yellow/.test(x[0])?'#333':'#fff'};text-shadow:${/white|yellow/.test(x[0])?'none':'0 1px 2px #0006'}">${x[0]}</button>`).join('')}</div>
    <svg class="viz" viewBox="0 0 600 240" id="cs"></svg><div class="row"><span class="score" id="csc">⭐ 0</span><button class="btn ghost" id="cn">Tugas lain</button></div><div class="fbx"></div></div>`;
  const svg=$('#cs',el); svg.innerHTML=S.map((t,i)=>{ const x=70+(i%5)*115, y=i<5?70:180; return `<g data-i="${i}" style="cursor:pointer" fill="#ffffff" stroke="#333" stroke-width="3">${shp(t[1],x,y)}</g><text x="${x}" y="${(i<5?70:180)+62}" text-anchor="middle" font-size="13" font-weight="800">${t[0]}</text>`; }).join('');
  if(S.length<=5) svg.setAttribute('viewBox','0 0 600 140');
  $$('#pal .note',el).forEach(b=>b.onclick=()=>{ $$('#pal .note',el).forEach(x=>x.style.outline=''); b.style.outline='4px solid var(--ink)'; cur=C[+b.dataset.i]; E.say(cur[0]); });
  $$('g[data-i]',svg).forEach(g=>g.onclick=()=>{ if(!cur){ $('.fbx',el).innerHTML='<div class="fb no">Pilih warna dulu.</div>'; return; } const sh=S[+g.dataset.i]; g.setAttribute('fill',cur[1]); n++;
    const ok=sh===task[0]&&cur===task[1]; if(ok){ s++; $('#csc',el).textContent='⭐ '+s; $('.fbx',el).innerHTML=`<div class="fb ok">✅ The ${sh[0]} is ${cur[0]}!</div>`; E.say('Great! The '+sh[0]+' is '+cur[0]); setTimeout(newTask,1300); }
    else $('.fbx',el).innerHTML=`<div class="fb no">Kamu mewarnai <b>${sh[0]}</b> dengan <b>${cur[0]}</b>. Tugasnya: ${task[0][0]} ${task[1][0]}.</div>`; });
  $('#cn',el).onclick=newTask; newTask(); };
/* 7. Besar-kecil / tinggi-pendek */
W.size=function(el,c){ let r=0,s=0; const R=8;
  const go=()=>{ if(r>=R) return endBox(el,`Skor ${s} dari ${R}!`,()=>{ r=0; s=0; go(); });
    const useFact=c.facts&&(r%2===1||!c.items);
    if(useFact){ const f=pick(c.facts); const opts=shuf([f[2]].concat(shuf(c.adj.filter(a=>a!==f[2])).slice(0,3)));
      el.innerHTML=`<div class="stage"><div class="row"><span class="muted">Ronde ${r+1}/${R}</span><span class="score">⭐ ${s}</span></div><div class="huge" style="text-align:center">${f[0]}</div><p class="q">The ${esc(f[1])} is ____.</p><div class="opts">${opts.map(o=>`<button class="opt" data-o="${o}">${o}</button>`).join('')}</div><div class="fbx"></div></div>`;
      $$('.opt',el).forEach(b=>b.onclick=()=>{ const ok=b.dataset.o===f[2]; $$('.opt',el).forEach(x=>x.disabled=true); b.classList.add(ok?'good':'no'); if(ok) s++; const sent=`The ${f[1]} is ${f[2]}.`; $('.fbx',el).innerHTML=`<div class="fb ${ok?'ok':'no'}">${ok?'✅':'❌'} ${esc(sent)}</div>`; E.say(sent); setTimeout(()=>{ r++; go(); },1500); }); return; }
    const it=pick(c.items), pair=pick(c.pairs||[['big','small']]), q=pick(pair), tall=pair[0]==='tall'||pair[0]==='long';
    const big=rand(0,1); const st=(isBig)=> tall? `display:inline-block;font-size:3rem;transform:scale(1,${isBig?1.9:0.85});transform-origin:bottom` : `font-size:${isBig?5.2:2.2}rem`;
    el.innerHTML=`<div class="stage"><div class="row"><span class="muted">Ronde ${r+1}/${R}</span><span class="score">⭐ ${s}</span></div><p class="q">Which ${esc(it[1])} is <b>${q}</b>? ${E.sp('Which '+it[1]+' is '+q+'?')}</p><div class="opts" style="grid-template-columns:1fr 1fr;align-items:end">${[0,1].map(i=>`<button class="opt" data-i="${i}" style="min-height:150px;display:flex;align-items:flex-end;justify-content:center"><span style="${st(i===big)}">${it[0]}</span></button>`).join('')}</div><div class="fbx"></div></div>`;
    E.say('Which '+it[1]+' is '+q+'?');
    $$('.opt',el).forEach(b=>b.onclick=()=>{ const i=+b.dataset.i; const isBig=i===big; const ok=(q===pair[0])===isBig; $$('.opt',el).forEach(x=>x.disabled=true); b.classList.add(ok?'good':'no'); if(ok) s++; const sent=`This ${it[1]} is ${isBig?pair[0]:pair[1]}.`; $('.fbx',el).innerHTML=`<div class="fb ${ok?'ok':'no'}">${ok?'✅':'❌'} ${esc(sent)}</div>`; E.say(sent); setTimeout(()=>{ r++; go(); },1400); }); };
  go(); };
/* 8. Preposisi tempat */
W.prep=function(el,c){ const O=c.objs; let r=0,s=0; const R=8;
  const P={on:[300,92,'on the table'],under:[300,205,'under the table'],'next to':[490,190,'next to the table'],in:[120,196,'in the box']};
  const scene=(obj,pos)=>`<svg class="viz" viewBox="0 0 600 260"><rect x="0" y="230" width="600" height="30" fill="#c8a27a" opacity=".5"/><rect x="190" y="110" width="220" height="16" rx="4" fill="#9b6b43"/><rect x="205" y="126" width="12" height="104" fill="#9b6b43"/><rect x="383" y="126" width="12" height="104" fill="#9b6b43"/>
    <rect x="60" y="170" width="120" height="60" fill="#e0b25c" stroke="#8a6420" stroke-width="3"/><polygon points="60,170 80,150 200,150 180,170" fill="#f0c978" stroke="#8a6420" stroke-width="3"/>
    ${pos?`<text x="${P[pos][0]}" y="${P[pos][1]}" font-size="52" text-anchor="middle">${obj[0]}</text>`:''}${pos==='in'?`<rect x="60" y="200" width="120" height="30" fill="#e0b25c"/>`:''}
    ${Object.keys(P).map(k=>`<rect class="hs" data-k="${k}" x="${P[k][0]-55}" y="${P[k][1]-55}" width="110" height="70" fill="transparent" style="cursor:pointer"/>`).join('')}</svg>`;
  const go=()=>{ if(r>=R) return endBox(el,`Skor ${s} dari ${R}!`,()=>{ r=0; s=0; go(); });
    const obj=pick(O), pos=pick(Object.keys(P)); const put=r%2===1;
    if(!put){ const opts=shuf(Object.keys(P)); el.innerHTML=`<div class="stage"><div class="row"><span class="muted">Ronde ${r+1}/${R}</span><span class="score">⭐ ${s}</span></div><p class="q">Where is the ${esc(obj[1])}? ${E.sp('Where is the '+obj[1]+'?')}</p>${scene(obj,pos)}<div class="opts">${opts.map(k=>`<button class="opt" data-k="${k}">It is ${P[k][2]}.</button>`).join('')}</div><div class="fbx"></div></div>`;
      E.say('Where is the '+obj[1]+'?');
      $$('.opt',el).forEach(b=>b.onclick=()=>{ const ok=b.dataset.k===pos; $$('.opt',el).forEach(x=>x.disabled=true); b.classList.add(ok?'good':'no'); if(ok) s++; const sent=`The ${obj[1]} is ${P[pos][2]}.`; $('.fbx',el).innerHTML=`<div class="fb ${ok?'ok':'no'}">${ok?'✅':'❌'} ${esc(sent)}</div>`; E.say(sent); setTimeout(()=>{ r++; go(); },1600); }); }
    else { const ins=`Put the ${obj[1]} ${P[pos][2]}.`; el.innerHTML=`<div class="stage"><div class="row"><span class="muted">Ronde ${r+1}/${R}</span><span class="score">⭐ ${s}</span></div><p class="q">${esc(ins)} ${E.sp(ins)}</p><p class="muted">Ketuk tempat yang tepat pada gambar.</p><div id="sc">${scene(obj,null)}</div><div class="fbx"></div></div>`; E.say(ins);
      $$('.hs',el).forEach(h=>h.onclick=()=>{ const k=h.dataset.k; $('#sc',el).innerHTML=scene(obj,k); const ok=k===pos; if(ok) s++; $('.fbx',el).innerHTML=`<div class="fb ${ok?'ok':'no'}">${ok?'✅ Good! The '+esc(obj[1])+' is '+P[pos][2]+'.':'❌ Itu '+P[k][2]+'. Seharusnya '+P[pos][2]+'.'}</div>`; E.say(ok?'Good!':'Oops!'); setTimeout(()=>{ r++; go(); },1600); }); } };
  go(); };
/* 9. Jam */
E.timeWords=(h,m)=>{ const H=x=>E.num(((x-1+12)%12)+1); if(m===0) return `It's ${H(h)} o'clock.`; if(m===30) return `It's half past ${H(h)}.`; if(m===15) return `It's quarter past ${H(h)}.`; if(m===45) return `It's quarter to ${H(h+1)}.`; if(m<30) return `It's ${E.num(m)} past ${H(h)}.`; return `It's ${E.num(60-m)} to ${H(h+1)}.`; };
W.clock=function(el,c){ const step=c.step||15; let r=0,s=0; const R=8;
  const face=(h,m)=>{ const ha=((h%12)+m/60)*30*Math.PI/180, ma=m*6*Math.PI/180; let t=''; for(let i=1;i<=12;i++){ const a=i*30*Math.PI/180; t+=`<text x="${150+100*Math.sin(a)}" y="${157-100*Math.cos(a)}" text-anchor="middle" font-size="20" font-weight="800">${i}</text>`; }
    return `<svg class="viz" viewBox="0 0 300 300" style="max-width:280px;margin:auto"><circle cx="150" cy="150" r="130" fill="#fff" stroke="var(--acc)" stroke-width="8"/>${t}<line x1="150" y1="150" x2="${150+60*Math.sin(ha)}" y2="${150-60*Math.cos(ha)}" stroke="#333" stroke-width="9" stroke-linecap="round"/><line x1="150" y1="150" x2="${150+95*Math.sin(ma)}" y2="${150-95*Math.cos(ma)}" stroke="var(--acc)" stroke-width="5" stroke-linecap="round"/><circle cx="150" cy="150" r="8" fill="#333"/></svg>`; };
  const rt=()=>[rand(1,12),rand(0,60/step-1)*step];
  const go=()=>{ if(r>=R) return endBox(el,`Skor ${s} dari ${R}!`,()=>{ r=0; s=0; go(); });
    const [h,m]=rt(); const ans=E.timeWords(h,m);
    if(r%2===0){ const set=new Set([ans]); while(set.size<4){ const [a,b]=rt(); set.add(E.timeWords(a,b)); } const opts=shuf([...set]);
      el.innerHTML=`<div class="stage"><div class="row"><span class="muted">Ronde ${r+1}/${R}</span><span class="score">⭐ ${s}</span></div><p class="q">What time is it? ${E.sp('What time is it?')}</p>${face(h,m)}<div class="opts" style="grid-template-columns:1fr 1fr">${opts.map(o=>`<button class="opt" data-o="${esc(o)}">${esc(o)}</button>`).join('')}</div><div class="fbx"></div></div>`;
      $$('.opt',el).forEach(b=>b.onclick=()=>{ const ok=b.dataset.o===ans; $$('.opt',el).forEach(x=>x.disabled=true); b.classList.add(ok?'good':'no'); if(ok) s++; $('.fbx',el).innerHTML=`<div class="fb ${ok?'ok':'no'}">${ok?'✅':'❌'} ${esc(ans)} (${h}:${String(m).padStart(2,'0')})</div>`; E.say(ans); setTimeout(()=>{ r++; go(); },1700); }); }
    else { let H=12,Mi=0; const draw=()=>{ $('#cf',el).innerHTML=face(H,Mi); };
      el.innerHTML=`<div class="stage"><div class="row"><span class="muted">Ronde ${r+1}/${R}</span><span class="score">⭐ ${s}</span></div><p class="q">Set the clock: <b>${esc(ans)}</b> ${E.sp(ans)}</p><div id="cf"></div><div class="row" style="justify-content:center"><button class="btn ghost" id="hm">− jam</button><button class="btn ghost" id="hp">+ jam</button><button class="btn ghost" id="mm">− ${step} menit</button><button class="btn ghost" id="mp">+ ${step} menit</button><button class="btn" id="ck">Periksa</button></div><div class="fbx"></div></div>`; draw(); E.say(ans);
      $('#hm',el).onclick=()=>{ H=H===1?12:H-1; draw(); }; $('#hp',el).onclick=()=>{ H=H===12?1:H+1; draw(); };
      $('#mm',el).onclick=()=>{ Mi=(Mi-step+60)%60; draw(); }; $('#mp',el).onclick=()=>{ Mi=(Mi+step)%60; draw(); };
      $('#ck',el).onclick=()=>{ const ok=E.timeWords(H,Mi)===ans; if(ok) s++; $('.fbx',el).innerHTML=`<div class="fb ${ok?'ok':'no'}">${ok?'✅ Perfect!':'❌ Jammu menunjukkan: '+esc(E.timeWords(H,Mi))+' Seharusnya '+h+':'+String(m).padStart(2,'0')+'.'}</div>`; $('#ck',el).disabled=true; setTimeout(()=>{ r++; go(); },1800); }; } };
  go(); };
/* 10. Belanja dengan uang */
W.shop=function(el,c){ const NOTES=[[1000,'#c9c9c9'],[2000,'#b9c4d6'],[5000,'#d9b38c'],[10000,'#c7a5d9'],[20000,'#9fd3a8'],[50000,'#9cc6e8']]; let r=0,s=0; const R=6;
  const go=()=>{ if(r>=R) return endBox(el,`Kamu membayar dengan tepat ${s} dari ${R} kali!`,()=>{ r=0; s=0; go(); });
    const it=pick(c.items); let paid=[];
    const q=`How much is the ${it[1]}?`, a=`It is ${E.num(it[2])} rupiahs.`;
    el.innerHTML=`<div class="stage"><div class="row"><span class="muted">Pembeli ${r+1}/${R}</span><span class="score">⭐ ${s}</span></div><div class="dlg"><div class="ln"><div class="av">🧒</div><div class="bub"><div class="en">${esc(q)} ${E.sp(q)}</div></div></div><div class="ln r"><div class="av">🧑‍🌾</div><div class="bub"><div class="en">${esc(a)} ${E.sp(a)}</div></div></div></div>
      <div class="huge" style="text-align:center">${it[0]}</div><p class="q">Bayar dengan uang yang <b>pas</b>:</p><div class="money">${NOTES.map(n=>`<button class="note" data-v="${n[0]}" style="background:${n[1]}">${E.rp(n[0])}</button>`).join('')}</div>
      <p>Uangmu: <b id="pd">Rp0</b> <button class="btn ghost" id="pr">↺ Ulang</button> <button class="btn" id="pp">Bayar</button></p><div class="fbx"></div></div>`;
    E.say(q,E.rate,()=>setTimeout(()=>E.say(a),200));
    const tot=()=>paid.reduce((x,y)=>x+y,0);
    $$('.note',el).forEach(b=>b.onclick=()=>{ paid.push(+b.dataset.v); $('#pd',el).textContent=E.rp(tot()); });
    $('#pr',el).onclick=()=>{ paid=[]; $('#pd',el).textContent='Rp0'; };
    $('#pp',el).onclick=()=>{ const t=tot(), ok=t===it[2]; if(ok) s++; $('.fbx',el).innerHTML=`<div class="fb ${ok?'ok':'no'}">${ok?'✅ Thank you! Harga '+esc(it[1])+' '+E.rp(it[2])+'.':t>it[2]?'❌ Uangmu terlalu banyak ('+E.rp(t)+'). Harganya '+E.rp(it[2])+'.':'❌ Uangmu kurang ('+E.rp(t)+'). Harganya '+E.rp(it[2])+'.'}</div>`; E.say(ok?'Thank you!':'Sorry, that is not right.'); $('#pp',el).disabled=true; setTimeout(()=>{ r++; go(); },2000); }; };
  go(); };
/* 11. Peta arah */
W.map=function(el,c){ const N=5; const PL=c.places; // [em,name,x,y]
  const D=[[0,-1],[1,0],[0,1],[-1,0]], DN=['⬆️','➡️','⬇️','⬅️'];
  let mode='do';
  const route=(sx,sy,sd,tx,ty)=>{ const cmds=[]; let x=sx,y=sy,d=sd; const turnTo=nd=>{ while(d!==nd){ const right=(d+1)%4; if(right===nd||((d+2)%4===nd&&Math.random()<.5)){ cmds.push('Turn right.'); d=right; } else { cmds.push('Turn left.'); d=(d+3)%4; } } };
    if(ty!==y){ turnTo(ty<y?0:2); const k=Math.abs(ty-y); cmds.push(k===1?'Go straight one block.':`Go straight ${E.num(k)} blocks.`); y=ty; }
    if(tx!==x){ turnTo(tx>x?1:3); const k=Math.abs(tx-x); cmds.push(k===1?'Go straight one block.':`Go straight ${E.num(k)} blocks.`); x=tx; }
    return cmds; };
  const grid=(me)=>{ let h=`<div class="grid5" style="grid-template-columns:repeat(${N},1fr)">`; for(let y=0;y<N;y++) for(let x=0;x<N;x++){ const p=PL.find(q=>q[2]===x&&q[3]===y); h+=`<div class="${p?'':'road'}" title="${p?esc(p[1]):''}">${p?p[0]:''}${me&&me.x===x&&me.y===y?`<span class="me">🧒<small style="font-size:.7rem">${DN[me.d]}</small></span>`:''}</div>`; } return h+'</div>'; };
  const go=()=>{ el.innerHTML=`<div class="seg row"><button class="btn ${mode==='do'?'':'ghost'}" id="m1">🕹️ Antar aku ke…</button><button class="btn ${mode==='read'?'':'ghost'}" id="m2">📜 Baca petunjuk</button></div><div id="mb"></div>`;
    $('#m1',el).onclick=()=>{ mode='do'; go(); }; $('#m2',el).onclick=()=>{ mode='read'; go(); };
    const box=$('#mb',el); const me={x:2,y:4,d:0};
    const legend=`<p class="muted" style="font-size:.9rem">${PL.map(p=>p[0]+' '+esc(p[1])).join(' · ')}</p>`;
    if(mode==='do'){ const tg=pick(PL); const log=[];
      const draw=()=>{ box.innerHTML=`<div class="stage"><p class="q">Take me to the <b>${esc(tg[1])}</b> ${tg[0]}! ${E.sp('Take me to the '+tg[1])}</p>${grid(me)}${legend}<div class="row" style="justify-content:center"><button class="btn ghost" data-c="L">↰ Turn left</button><button class="btn" data-c="S">⬆ Go straight</button><button class="btn ghost" data-c="R">↱ Turn right</button><button class="btn ghost" data-c="X">↺ Mulai lagi</button></div><p class="muted">${log.map(esc).join(' → ')||'Kamu menghadap ke atas (⬆️).'}</p><div class="fbx"></div></div>`;
        $$('[data-c]',box).forEach(b=>b.onclick=()=>{ const k=b.dataset.c; if(k==='X'){ me.x=2; me.y=4; me.d=0; log.length=0; draw(); return; }
          if(k==='L'){ me.d=(me.d+3)%4; log.push('Turn left'); E.say('Turn left'); } else if(k==='R'){ me.d=(me.d+1)%4; log.push('Turn right'); E.say('Turn right'); } else { const nx=me.x+D[me.d][0], ny=me.y+D[me.d][1]; if(nx<0||ny<0||nx>=N||ny>=N){ E.say('Oops! Stop.'); return; } me.x=nx; me.y=ny; log.push('Go straight'); E.say('Go straight'); }
          draw(); if(me.x===tg[2]&&me.y===tg[3]){ $('.fbx',box).innerHTML=`<div class="fb ok">🎉 You are at the ${esc(tg[1])}! <button class="btn" id="mn">Tujuan lain</button></div>`; E.say('Here you are. This is the '+tg[1]+'.'); $('#mn',box).onclick=go; } }); };
      draw(); E.say('Take me to the '+tg[1]); }
    else { const tg=pick(PL); const cmds=route(2,4,0,tg[2],tg[3]); const opts=shuf([tg].concat(shuf(PL.filter(p=>p!==tg)).slice(0,3)));
      box.innerHTML=`<div class="stage"><p class="q">Mulai dari 🧒 (menghadap ke atas). Ikuti petunjuk ini:</p><ol>${cmds.map(x=>`<li><b>${esc(x)}</b></li>`).join('')}</ol><div class="row">${E.sp(cmds.join(' '),'Dengarkan petunjuk')}</div>${grid(me)}<p class="q">Where are you?</p><div class="opts">${opts.map((p,i)=>`<button class="opt" data-i="${i}"><span class="em">${p[0]}</span>${esc(p[1])}</button>`).join('')}</div><div class="fbx"></div></div>`;
      $$('.opt',box).forEach(b=>b.onclick=()=>{ const p=opts[+b.dataset.i], ok=p===tg; $$('.opt',box).forEach(x=>x.disabled=true); b.classList.add(ok?'good':'no'); $('.fbx',box).innerHTML=`<div class="fb ${ok?'ok':'no'}">${ok?'✅':'❌'} You are at the ${esc(tg[1])}. <button class="btn" id="mn">Petunjuk lain</button></div>`; E.say('You are at the '+tg[1]); $('#mn',box).onclick=go; }); } };
  go(); };
/* 12. Kelompokkan */
W.sort=function(el,c){ const go=()=>{ const all=shuf(c.groups.flatMap((g,gi)=>g[1].map(w=>({w,gi})))); let sel=null, left=all.length;
    el.innerHTML=`<div class="stage"><p class="q">Ketuk sebuah kata, lalu ketuk kotak kelompoknya.</p><div class="tiles" id="sp">${all.map((o,i)=>`<button class="tile" data-i="${i}">${o.w[0]} ${esc(o.w[1])}</button>`).join('')}</div><div class="bins">${c.groups.map((g,gi)=>`<div class="bin" data-g="${gi}"><h3>${g[0]}</h3><div class="tiles" style="border:0;min-height:30px"></div></div>`).join('')}</div><div class="fbx"></div></div>`;
    $$('#sp .tile',el).forEach(b=>b.onclick=()=>{ $$('#sp .tile',el).forEach(x=>x.classList.remove('sel')); sel=+b.dataset.i; b.style.outline='3px solid var(--acc)'; $$('#sp .tile',el).forEach(x=>{ if(x!==b) x.style.outline=''; }); E.say(all[sel].w[1]); });
    $$('.bin',el).forEach(bn=>bn.onclick=()=>{ if(sel==null) return; const o=all[sel]; if(o.gi===+bn.dataset.g){ const t=$(`#sp .tile[data-i="${sel}"]`,el); t.style.outline=''; t.onclick=null; $('.tiles',bn).appendChild(t); sel=null; left--; $('.fbx',el).innerHTML=`<div class="fb ok">✅ ${esc(o.w[1])}: ${c.groups[o.gi][0]}</div>`; if(!left) setTimeout(()=>endBox(el,'Semua kata sudah di kelompok yang benar!',go),700); }
      else { bn.style.borderColor='var(--bad)'; setTimeout(()=>bn.style.borderColor='',400); $('.fbx',el).innerHTML=`<div class="fb no">❌ Bukan di situ. Coba kotak lain.</div>`; } }); };
  go(); };
/* 13. Urutkan */
W.order=function(el,c){ let k=0; const L=c.lists;
  const go=()=>{ const [t,items]=L[k%L.length]; const sh=shuf(items.map((x,i)=>i)); let ans=[];
    el.innerHTML=`<div class="stage"><p class="q">${esc(t)}</p><div class="tiles ans" id="oa"></div><div class="tiles" id="op">${sh.map(i=>`<button class="tile" data-i="${i}">${esc(items[i])}</button>`).join('')}</div><div class="row"><button class="btn" id="oc">Periksa</button><button class="btn ghost" id="ou">↺ Ulang</button><button class="btn ghost" id="on">Soal lain →</button></div><div class="fbx"></div></div>`;
    const draw=()=>{ $('#oa',el).innerHTML=ans.map((i,j)=>`<button class="tile" data-j="${j}">${j+1}. ${esc(items[i])}</button>`).join(''); $$('#op .tile',el).forEach(b=>b.classList.toggle('used',ans.includes(+b.dataset.i))); $$('#oa .tile',el).forEach(b=>b.onclick=()=>{ ans.splice(+b.dataset.j,1); draw(); }); };
    $$('#op .tile',el).forEach(b=>b.onclick=()=>{ const i=+b.dataset.i; if(!ans.includes(i)){ ans.push(i); E.say(items[i].replace(/^\S+\s/,'')); draw(); } });
    $('#ou',el).onclick=()=>{ ans=[]; draw(); }; $('#on',el).onclick=()=>{ k++; go(); };
    $('#oc',el).onclick=()=>{ const ok=ans.length===items.length&&ans.every((v,j)=>v===j); $('.fbx',el).innerHTML=`<div class="fb ${ok?'ok':'no'}">${ok?'✅ Urutan benar!':'❌ Belum tepat. Urutan yang benar: '+items.map(esc).join(' → ')}</div>`; if(ok) E.say(items.map(x=>x.replace(/^\S+\s/,'')).join(', ')); }; };
  go(); };
/* 14. Mengeja */
W.spell=function(el,c,M,G){ const V=(c.items||words(M)).filter(v=>/^[a-z]+$/i.test(v[1])); let r=0,s=0; const R=6;
  const go=()=>{ if(r>=R) return endBox(el,`Kamu mengeja ${s} dari ${R} kata dengan benar!`,()=>{ r=0; s=0; go(); });
    const t=pick(V), w=t[1].toLowerCase(); let letters=w.split(''); if(G.g>=4) letters=letters.concat(shuf('aeioustrnl'.split('').filter(x=>!w.includes(x))).slice(0,2)); const sh=shuf(letters.map((l,i)=>i)); let ans=[];
    el.innerHTML=`<div class="stage"><div class="row"><span class="muted">Kata ${r+1}/${R}</span><span class="score">⭐ ${s}</span></div><div class="huge" style="text-align:center">${t[0]}</div><p class="q" style="text-align:center">${esc(t[2])} ${E.sp(t[1],'Dengar')}</p><div class="tiles ans" id="sa" style="justify-content:center;font-size:1.3rem"></div><div class="tiles" id="sl" style="justify-content:center;font-size:1.3rem">${sh.map(i=>`<button class="tile" data-i="${i}">${letters[i]}</button>`).join('')}</div><div class="row" style="justify-content:center"><button class="btn" id="sc">Periksa</button><button class="btn ghost" id="sb">⌫ Hapus</button></div><div class="fbx"></div></div>`;
    setTimeout(()=>E.say(t[1]),300);
    const draw=()=>{ $('#sa',el).innerHTML=ans.map(i=>`<span class="tile">${letters[i]}</span>`).join(''); $$('#sl .tile',el).forEach(b=>b.classList.toggle('used',ans.includes(+b.dataset.i))); };
    $$('#sl .tile',el).forEach(b=>b.onclick=()=>{ const i=+b.dataset.i; if(!ans.includes(i)){ ans.push(i); draw(); } });
    $('#sb',el).onclick=()=>{ ans.pop(); draw(); };
    $('#sc',el).onclick=()=>{ const got=ans.map(i=>letters[i]).join(''); const ok=got===w; if(ok) s++; $('.fbx',el).innerHTML=`<div class="fb ${ok?'ok':'no'}">${ok?'✅':'❌'} ${w.toUpperCase().split('').join(' - ')}</div>`; E.say(ok?'Correct! '+w:w); $('#sc',el).disabled=true; setTimeout(()=>{ r++; go(); },1700); }; };
  go(); };
/* 15. Buku cerita */
W.story=function(el,c){ let p=0;
  const go=()=>{ const P=c.pages; if(p<P.length){ const pg=P[p];
      el.innerHTML=`<div class="stage"><div class="row"><b>${esc(c.title)}</b><span class="muted">Halaman ${p+1}/${P.length}</span></div><div class="page"><div class="huge">${pg[0]}</div><div><p class="big" style="font-weight:800">${esc(pg[1])}</p><p class="muted" id="sid" style="display:none">${esc(pg[2])}</p><div class="row">${E.sp(pg[1],'Bacakan')}<button class="btn ghost" id="st">Arti</button></div></div></div><div class="prog"><i style="width:${(p+1)/P.length*100}%"></i></div><div class="row"><button class="btn ghost" id="pv" ${p?'':'disabled'}>← Kembali</button><button class="btn" id="nx">${p+1<P.length?'Lanjut →':'Jawab pertanyaan →'}</button></div></div>`;
      $('#st',el).onclick=()=>{ const x=$('#sid',el); x.style.display=x.style.display==='none'?'block':'none'; };
      $('#pv',el).onclick=()=>{ p--; go(); }; $('#nx',el).onclick=()=>{ p++; go(); }; return; }
    let s=0, done=0; el.innerHTML=`<div class="stage"><p class="q">Pertanyaan tentang cerita “${esc(c.title)}”</p>${c.qs.map((q,i)=>{ const o=shuf(q.o.map((x,j)=>j)); return `<div class="card" style="margin:8px 0"><b>${i+1}. ${esc(q.q)}</b> ${E.sp(q.q)}<div class="opts">${o.map(j=>`<button class="opt" data-q="${i}" data-j="${j}">${esc(q.o[j])}</button>`).join('')}</div></div>`; }).join('')}<div class="fbx"></div><button class="btn ghost" id="rd">📖 Baca lagi dari awal</button></div>`;
    $$('.opt',el).forEach(b=>b.onclick=()=>{ const i=+b.dataset.q, j=+b.dataset.j; const grp=$$(`.opt[data-q="${i}"]`,el); grp.forEach(x=>x.disabled=true); b.classList.add(j===0?'good':'no'); grp.find(x=>+x.dataset.j===0).classList.add('good'); if(j===0) s++; done++; if(done===c.qs.length){ $('.fbx',el).innerHTML=`<div class="fb ok">🎉 Kamu menjawab ${s} dari ${c.qs.length} dengan benar.${c.moral?' Pesan cerita: <i>'+esc(c.moral)+'</i>':''}</div>`; } });
    $('#rd',el).onclick=()=>{ p=0; go(); }; };
  go(); };
/* 16. Tebak siapa aku */
W.riddle=function(el,c){ let r=0,s=0; const R=Math.min(6,c.r.length); let order=shuf(c.r);
  const go=()=>{ if(r>=R) return endBox(el,`Total poin: ${s}`,()=>{ r=0; s=0; order=shuf(c.r); go(); });
    const [clues,em,name]=order[r]; let shown=1; const opts=shuf([[em,name]].concat(shuf(c.r.filter(x=>x[2]!==name)).slice(0,3).map(x=>[x[1],x[2]])));
    const draw=()=>{ el.innerHTML=`<div class="stage"><div class="row"><span class="muted">Teka-teki ${r+1}/${R}</span><span class="score">Poin: ${s}</span></div><p class="q">${c.ask||'Who am I? / What am I?'}</p><ol>${clues.slice(0,shown).map(x=>`<li><b>${esc(x)}</b> ${E.sp(x)}</li>`).join('')}</ol><div class="row"><button class="btn ghost" id="mc" ${shown>=clues.length?'disabled':''}>Petunjuk berikutnya (${shown}/${clues.length})</button></div><div class="opts">${opts.map((o,i)=>`<button class="opt" data-i="${i}"><span class="em">${o[0]}</span>${esc(o[1])}</button>`).join('')}</div><div class="fbx"></div></div>`;
      E.say(clues[shown-1]);
      $('#mc',el).onclick=()=>{ shown++; draw(); };
      $$('.opt',el).forEach(b=>b.onclick=()=>{ const o=opts[+b.dataset.i], ok=o[1]===name; $$('.opt',el).forEach(x=>x.disabled=true); b.classList.add(ok?'good':'no'); const pts=ok?(clues.length-shown+1):0; s+=pts; $('.fbx',el).innerHTML=`<div class="fb ${ok?'ok':'no'}">${ok?'✅ +'+pts+' poin!':'❌'} ${c.ans?c.ans.replace('{x}',name):'It is a '+esc(name)+'.'}</div>`; E.say(ok?'Yes!':'No.'); setTimeout(()=>{ r++; go(); },1700); }); };
    draw(); };
  go(); };
/* 17. Pohon keluarga */
W.family=function(el,c){ const me=c.me||'Aisyah';
  const F=[['👴','grandfather','kakek',0],['👵','grandmother','nenek',0],['👨','father','ayah',1],['👩','mother','ibu',1],['👦','brother','saudara laki-laki',2],['🧒',me,'aku',2],['👧','sister','saudara perempuan',2],['👶','baby brother','adik bayi',2]];
  let r=0,s=0; const R=8;
  const tree=(hl,click)=>[0,1,2].map(g=>`<div class="row" style="justify-content:center;gap:8px;flex-wrap:nowrap">${F.map((f,i)=>f[3]!==g?'':`<button class="opt ${hl===i?'sel':''}" data-i="${i}" style="min-width:0;flex:0 1 84px;padding:8px 4px;${click?'':'pointer-events:none'}"><span class="em">${f[0]}</span>${i===5?'<b>'+esc(me)+'</b>':''}</button>`).join('')}</div>`).join('');
  const go=()=>{ if(r>=R) return endBox(el,`Skor ${s} dari ${R}!`,()=>{ r=0; s=0; go(); });
    const tgi=pick([0,1,2,3,4,6,7]), tg=F[tgi];
    if(r%2===0){ const opts=shuf([tg].concat(shuf(F.filter((f,i)=>i!==tgi&&i!==5)).slice(0,3)));
      el.innerHTML=`<div class="stage"><div class="row"><span class="muted">Ronde ${r+1}/${R}</span><span class="score">⭐ ${s}</span></div><p class="q">${esc(me)} says: “Who is this?” ${E.sp('Who is this?')}</p>${tree(tgi,false)}<div class="opts">${opts.map((o,i)=>`<button class="opt" data-k="${i}">This is my ${esc(o[1])}.</button>`).join('')}</div><div class="fbx"></div></div>`;
      $$('.opt[data-k]',el).forEach(b=>b.onclick=()=>{ const o=opts[+b.dataset.k], ok=o===tg; $$('.opt[data-k]',el).forEach(x=>x.disabled=true); b.classList.add(ok?'good':'no'); if(ok) s++; const sent=`This is my ${tg[1]}.`; $('.fbx',el).innerHTML=`<div class="fb ${ok?'ok':'no'}">${ok?'✅':'❌'} ${esc(sent)} (${tg[2]})</div>`; E.say(sent); setTimeout(()=>{ r++; go(); },1600); }); }
    else { const ins=`Where is my ${tg[1]}?`; el.innerHTML=`<div class="stage"><div class="row"><span class="muted">Ronde ${r+1}/${R}</span><span class="score">⭐ ${s}</span></div><p class="q">${esc(me)}: “${esc(ins)}” ${E.sp(ins)} <span class="muted">Ketuk orangnya.</span></p>${tree(-1,true)}<div class="fbx"></div></div>`; E.say(ins);
      $$('.opt[data-i]',el).forEach(b=>b.onclick=()=>{ const i=+b.dataset.i, ok=i===tgi; b.classList.add(ok?'good':'no'); $$('.opt[data-i]',el).forEach(x=>x.disabled=true); if(ok) s++; $('.fbx',el).innerHTML=`<div class="fb ${ok?'ok':'no'}">${ok?'✅ Yes! This is my '+esc(tg[1])+'.':'❌ Itu '+(i===5?'aku':esc(F[i][1]))+'. My '+esc(tg[1])+' is '+tg[0]+'.'}</div>`; E.say('This is my '+tg[1]); setTimeout(()=>{ r++; go(); },1600); }); } };
  go(); };
/* 18. Latihan tata bahasa (isian rumpang) */
W.gap=function(el,c){ let Q=shuf(c.items), k=0, s=0;
  const go=()=>{ if(k>=Q.length) return endBox(el,`Skor ${s} dari ${Q.length}!`,()=>{ Q=shuf(c.items); k=0; s=0; go(); });
    const it=Q[k]; const sent=it.s.replace('___','<span class="tile" style="cursor:default">____</span>');
    el.innerHTML=`<div class="stage"><div class="row"><span class="muted">Soal ${k+1}/${Q.length}</span><span class="score">⭐ ${s}</span></div><div class="prog"><i style="width:${k/Q.length*100}%"></i></div><p class="q">${sent}</p>${it.id?`<p class="muted">${esc(it.id)}</p>`:''}`+
      (it.type?`<div class="row"><input class="txt" id="gi" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="ketik jawaban"><button class="btn" id="gc">Periksa</button></div>`:`<div class="opts">${shuf(it.o.map((x,i)=>i)).map(i=>`<button class="opt" data-i="${i}">${esc(it.o[i])}</button>`).join('')}</div>`)+`<div class="fbx"></div></div>`;
    const full=(a)=>it.s.replace('___',a);
    const fin=(ok,ans)=>{ if(ok) s++; $('.fbx',el).innerHTML=`<div class="fb ${ok?'ok':'no'}">${ok?'✅':'❌'} <b>${esc(full(ans))}</b>${it.ex?'<br><span class="muted">'+esc(it.ex)+'</span>':''}</div><button class="btn" id="gn">${k+1<Q.length?'Berikutnya →':'Lihat skor'}</button>`; E.say(full(ans)); $('#gn',el).onclick=()=>{ k++; go(); }; };
    if(it.type){ let t=0; const chk=()=>{ const v=$('#gi',el).value; if(!v.trim()) return; const ok=it.a.some(a=>clean(a)===clean(v)); t++; if(ok||t>=2){ $('#gi',el).disabled=true; $('#gc',el).disabled=true; fin(ok,it.a[0]); } else $('.fbx',el).innerHTML='<div class="fb no">Belum tepat, coba sekali lagi.</div>'; };
      $('#gc',el).onclick=chk; $('#gi',el).onkeydown=e=>{ if(e.key==='Enter') chk(); }; }
    else $$('.opt',el).forEach(b=>b.onclick=()=>{ const i=+b.dataset.i; $$('.opt',el).forEach(x=>x.disabled=true); b.classList.add(i===0?'good':'no'); $$('.opt',el).find(x=>+x.dataset.i===0).classList.add('good'); fin(i===0,it.o[0]); }); };
  go(); };
/* 19. Pembuat kartu / pesan */
W.card=function(el,c){ const sel=c.fields.map(()=>0);
  const text=()=>c.tpl.replace(/\{(\d)\}/g,(m,i)=>c.fields[+i][1][sel[+i]]);
  const draw=()=>{ el.innerHTML=`<div class="stage"><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:10px">${c.fields.map((f,i)=>`<label style="font-weight:800;min-width:0">${esc(f[0])}<br><select class="txt" data-i="${i}" style="margin-top:4px;width:100%;max-width:100%;min-width:0;padding:8px 10px;border-radius:12px">${f[1].map((o,j)=>`<option value="${j}" ${j===sel[i]?'selected':''}>${esc(o)}</option>`).join('')}</select></label>`).join('')}</div>
     <div style="margin:14px auto;max-width:520px;background:${c.bg||'linear-gradient(135deg,#fff7e0,#ffe1ec)'};color:#2b2140;border-radius:20px;padding:20px 22px;border:3px dashed var(--acc);box-shadow:var(--shadow)"><div style="font-size:2.4rem;text-align:center">${c.ic2||c.ic||'💌'}</div><div style="font-size:1.08rem;line-height:1.7;white-space:pre-line" id="ct">${esc(text())}</div></div>
     <div class="row" style="justify-content:center"><button class="btn soft" id="cr">🔊 Bacakan</button><button class="btn ghost" id="cx">🎲 Acak</button></div>${c.note?`<p class="muted">${c.note}</p>`:''}</div>`;
    $$('select',el).forEach(x=>x.onchange=()=>{ sel[+x.dataset.i]=+x.value; $('#ct',el).textContent=text(); });
    $('#cr',el).onclick=()=>E.say(text().replace(/\n/g,'. '),0.9); $('#cx',el).onclick=()=>{ c.fields.forEach((f,i)=>sel[i]=rand(0,f[1].length-1)); draw(); }; };
  draw(); };

})();
