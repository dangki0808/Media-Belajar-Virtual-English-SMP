/* Grammar Lab SMP — engine halaman topik & indeks (memakai ENG dari shared/eng.js) */
(function(){
const E=window.ENG, {$,$$,esc,shuf}=E, T=window.GRAM||[];
const G={g:'gr',name:'Grammar Lab',theme:'Teal Saffron'};
const LV={VII:'Kelas VII',VIII:'Kelas VIII',IX:'Kelas IX'};
const UN={7:'VII',8:'VIII',9:'IX'};
const parseErr=s=>{ const toks=s.match(/\[[^\]]+\]|\S+/g)||[]; let wrong='', right=''; const view=[], bad=new Set(), fix=[];
  toks.forEach(t=>{ if(t[0]==='['){ [wrong,right]=t.slice(1,-1).split('>'); wrong.split(' ').forEach(w=>{ bad.add(view.length); view.push(w); }); fix.push(right); } else { view.push(t); fix.push(t); } });
  return {view,bad,wrong:view.join(' '),right:fix.join(' '),w:wrong,r:right}; };
const fmt=s=>esc(s).replace('___','<span class="tile" style="cursor:default">____</span>');
const shell=(title,inner,back)=>{ document.body.dataset.g='gr'; document.title=title+' · Virtual English Lab SMP';
  document.body.innerHTML=`<header class="top"><div class="wrap"><a class="back" href="${back||'index.html'}">← ${back?'Beranda':'Grammar Lab'}</a><div class="brand">🧩 Grammar Lab <small>· English Lab SMP</small></div></div></header><div class="wrap">${inner}</div><footer><div class="wrap">Virtual English Lab SMP · Grammar Lab · Tekan 🔊 untuk mendengar contoh</div></footer>`;
  const s=document.createElement('script'); s.src='../shared/nav.js'; document.body.appendChild(s); };
const tabs=()=>{ const bs=$$('.tabs button'); const go=(id,u)=>{ bs.forEach(b=>b.classList.toggle('on',b.dataset.t===id)); $$('.panel').forEach(p=>p.classList.toggle('on',p.id===id)); if(u) try{ history.replaceState(null,'','#'+id); }catch(e){} };
  bs.forEach(b=>b.onclick=()=>{ go(b.dataset.t,1); window.scrollTo({top:Math.min(window.scrollY,$('.tabs').offsetTop-60)}); }); const h=location.hash.slice(1); go(bs.some(b=>b.dataset.t===h)?h:bs[0].dataset.t); if(h) setTimeout(()=>window.scrollTo(0,0),0); };

/* ---- Cari kesalahan ---- */
function errLab(el,items){ let Q=shuf(items), k=0, s=0;
  const go=()=>{ if(k>=Q.length){ el.innerHTML=`<div class="stage" style="text-align:center"><div class="huge">🔍</div><div class="big">${s} dari ${Q.length} kesalahan ditemukan pada percobaan pertama!</div><button class="btn" id="ag">Main lagi</button></div>`; $('#ag',el).onclick=()=>{ Q=shuf(items); k=0; s=0; go(); }; return; }
    const P=parseErr(Q[k]); let tries=0;
    el.innerHTML=`<div class="stage"><div class="row"><span class="muted">Kalimat ${k+1}/${Q.length}</span><span class="score">⭐ ${s}</span></div><div class="prog"><i style="width:${k/Q.length*100}%"></i></div>
      <p class="q">Ketuk bagian kalimat yang <b>salah</b>:</p><div class="tiles" id="et">${P.view.map((w,i)=>`<button class="tile" data-i="${i}">${esc(w)}</button>`).join('')}</div><div class="fbx"></div></div>`;
    const fin=ok=>{ $$('#et .tile',el).forEach(b=>{ b.disabled=true; if(P.bad.has(+b.dataset.i)) b.classList.add(ok?'good':'no'); });
      $('.fbx',el).innerHTML=`<div class="fb ${ok?'ok':'no'}">${ok?'✅ Tepat!':'Yang salah: <b>'+esc(P.w)+'</b>'} Seharusnya <b>${esc(P.r)}</b>.<br>✔️ ${esc(P.right)} ${E.sp(P.right)}</div><button class="btn" id="en">${k+1<Q.length?'Berikutnya →':'Lihat skor'}</button>`;
      $('#en',el).onclick=()=>{ k++; go(); }; };
    $$('#et .tile',el).forEach(b=>b.onclick=()=>{ if(P.bad.has(+b.dataset.i)){ if(!tries) s++; fin(!tries); } else { tries++; b.classList.add('no'); b.disabled=true; if(tries>=2) fin(false); else $('.fbx',el).innerHTML='<div class="fb no">Bagian itu sudah benar. Coba cari lagi!</div>'; } }); };
  go(); }

/* ---- Pola +/−/? ---- */
function polaLab(el,t){ const rows=t.tr.map(r=>`<tr><td><b>(+)</b> ${esc(r[0])} ${E.sp(r[0])}</td></tr><tr><td><b>(−)</b> ${esc(r[1])} ${E.sp(r[1])}</td></tr><tr><td><b>(?)</b> ${esc(r[2])} ${E.sp(r[2])}<br><span class="muted">↳ ${esc(r[3])}</span></td></tr><tr><td style="border-bottom:3px solid var(--line);padding:0"></td></tr>`).join('');
  el.innerHTML=`<div class="card"><h2><span class="ic">🔁</span>Positif · Negatif · Tanya</h2><table class="t">${rows}</table></div>
   <div class="card"><h2><span class="ic">🧩</span>Ubah bentuk kalimat</h2><p>Susun potongan kata menjadi bentuk yang diminta.</p><div id="bw"></div></div>`;
  const S=[]; t.tr.forEach(r=>{ S.push([r[1],'Ubah ke NEGATIF → '+r[0]]); S.push([r[2],'Ubah ke PERTANYAAN → '+r[0]]); });
  E.W.build($('#bw',el),{s:S}); }

/* ---- Kuis ---- */
function quiz(el,t){ const key='gr:'+t.id;
  let Q=shuf(t.gap).slice(0,6).map(g=>({p:`Lengkapi: <b>${fmt(g.s)}</b>`,o:g.o.slice(),ex:g.ex}));
  const P=t.err.map(parseErr); shuf(P).slice(0,4).forEach(a=>{ const others=shuf(P.filter(b=>b!==a)).slice(0,2).map(b=>b.wrong); Q.push({p:'Pilih kalimat yang <b>benar</b>:',o:[a.right,a.wrong,...others],ex:`“${a.w}” seharusnya “${a.r}”.`}); });
  Q=shuf(Q).map(q=>{ const ord=shuf(q.o.map((_,i)=>i)); return {...q,ord}; });
  let i=0, sc=0; const best=E.store.get(key);
  const show=()=>{ if(i>=Q.length){ const s=Math.round(sc/Q.length*100); const b=E.store.get(key); if(b==null||s>b) E.store.set(key,s);
      el.innerHTML=`<div class="stage" style="text-align:center"><div class="huge">${s>=80?'🏆':s>=60?'🌟':'💪'}</div><div class="big">Nilai kamu: ${s}</div><p>${sc} dari ${Q.length} benar. ${s>=80?'Excellent!':s>=60?'Good job! Sedikit lagi.':'Baca lagi tab Konsep, lalu coba lagi.'}</p><p class="muted">Nilai terbaik: ${Math.max(s,b||0)}</p><button class="btn" id="qa">Ulangi kuis</button></div>`;
      $('#qa',el).onclick=()=>quiz(el,t); return; }
    const q=Q[i];
    el.innerHTML=`<div class="row"><b>Soal ${i+1} / ${Q.length}</b><span class="score">Benar: ${sc}</span>${best!=null?`<span class="muted">Terbaik: ${best}</span>`:''}</div><div class="prog"><i style="width:${i/Q.length*100}%"></i></div>
      <p class="q">${q.p}</p><div class="opts">${q.ord.map(j=>`<button class="opt" data-j="${j}">${esc(q.o[j])}</button>`).join('')}</div><div class="fbx"></div>`;
    $$('.opt',el).forEach(b=>b.onclick=()=>{ const ok=+b.dataset.j===0; if(ok) sc++; $$('.opt',el).forEach(x=>{ x.disabled=true; if(+x.dataset.j===0) x.classList.add('good'); }); if(!ok) b.classList.add('no');
      $('.fbx',el).innerHTML=`<div class="fb ${ok?'ok':'no'}">${ok?'✅ Benar!':'❌ Jawaban: <b>'+esc(q.o[0])+'</b>'}${q.ex?'<br><span class="muted">'+esc(q.ex)+'</span>':''}</div><button class="btn" id="qn">${i+1<Q.length?'Lanjut →':'Lihat nilai'}</button>`;
      $('#qn',el).onclick=()=>{ i++; show(); }; }); };
  show(); }

/* ---- Halaman topik ---- */
window.GR={};
GR.topic=function(id){ const k=T.findIndex(x=>x.id===id), t=T[k]; if(!t) return;
  const prev=T[k-1], next=T[k+1];
  const units=(t.units||[]).map(([g,n])=>{ let f=''; try{ f=(window.UNITS&&window.UNITS[g]&&window.UNITS[g][n-1])||''; }catch(e){} return f?`<a class="chip" style="background:var(--card);color:var(--acc);text-decoration:none;border:1px solid var(--line)" href="../kelas-${g}/${f}">Kelas ${UN[g]} · Unit ${n}</a>`:''; }).join(' ');
  let h=`<section class="hero"><span class="chip">${LV[t.lvl]} · ${t.ic} Grammar</span><h1>${esc(t.t)}</h1><p class="sub">${t.sub}</p>${units?`<div class="row" style="gap:6px"><span class="muted" style="font-weight:800">Dipakai di:</span> ${units}</div>`:''}</section>
   <nav class="tabs"><button data-t="konsep">📘 Konsep</button><button data-t="pola">🔁 Pola +/−/?</button><button data-t="isian">✍️ Isian</button><button data-t="salah">🔍 Cari Kesalahan</button><button data-t="kuis">🏆 Kuis</button></nav><main>
   <section class="panel" id="konsep"><div class="card"><h2><span class="ic">🧮</span>Rumus</h2><div class="rumus">${t.rumus.map(r=>`<div><span>${r[0]}</span><p>${r[1]}</p></div>`).join('')}</div></div>
    <div class="card"><h2><span class="ic">🎯</span>Kapan dipakai?</h2><table class="t">${t.use.map(u=>`<tr><td style="width:38%"><b>${esc(u[0])}</b></td><td>${esc(u[1])} ${E.sp(u[1])}</td></tr>`).join('')}</table>
     <p style="margin-top:12px"><b>Kata kunci:</b></p><div class="row" style="gap:6px">${t.sig.map(x=>`<span class="sigw">${esc(x)}</span>`).join('')}</div></div>
    ${t.tbl?`<div class="card"><h2><span class="ic">📊</span>Tabel</h2><div style="overflow-x:auto"><table class="t"><tr>${t.tbl.h.map(x=>`<th>${esc(x)}</th>`).join('')}</tr>${t.tbl.r.map(r=>`<tr>${r.map((c,j)=>`<td>${j===0?'<b>'+esc(c)+'</b>':esc(c)}</td>`).join('')}</tr>`).join('')}</table></div></div>`:''}
    <div class="card"><h2><span class="ic">⚠️</span>Awas, kesalahan umum!</h2><div class="tip">${t.note}</div></div></section>
   <section class="panel" id="pola"><div id="pw"></div></section>
   <section class="panel" id="isian"><div class="card"><h2><span class="ic">✍️</span>Isian tata bahasa</h2><p class="muted">Pilih jawaban, baca penjelasannya, lalu lanjut.</p><div id="gw"></div></div></section>
   <section class="panel" id="salah"><div class="card"><h2><span class="ic">🔍</span>Detektif kesalahan</h2><p class="muted">Setiap kalimat punya satu bagian yang salah. Temukan!</p><div id="ew"></div></div></section>
   <section class="panel" id="kuis"><div class="card"><h2><span class="ic">🏆</span>Kuis: ${esc(t.t)}</h2><p class="muted">Nilai terbaik tersimpan di perangkat ini.</p><div id="qw"></div></div></section></main>
   <div class="row" style="justify-content:space-between;margin:18px 0">${prev?`<a class="btn ghost" href="${prev.id}.html">← ${esc(prev.t)}</a>`:'<span></span>'}${next?`<a class="btn" href="${next.id}.html">${esc(next.t)} →</a>`:`<a class="btn" href="index.html">Kembali ke Grammar Lab</a>`}</div>`;
  shell(t.t,h); tabs();
  polaLab($('#pw'),t); E.W.gap($('#gw'),{items:t.gap}); errLab($('#ew'),t.err); quiz($('#qw'),t); };

/* ---- Peta tense ---- */
const TM=[
 ['past','simple','Simple Past','S + V2','We visited Moyo Island last year.','dot',[150],'IX'],
 ['past','cont','Past Continuous','S + was/were + V-ing','I was cooking when the lights went off.','bar',[90,200,150],'IX'],
 ['past','perf','Past Perfect','S + had + V3','The bus had left when I arrived.','perf',[70,170],'SMA'],
 ['present','simple','Simple Present','S + V1(s/es)','She goes to school every day.','many',[60,130,200,270,340,410,480,550],'VII'],
 ['present','cont','Present Continuous','S + am/is/are + V-ing','Look! The bus is coming.','bar',[255,345],'VIII'],
 ['present','perf','Present Perfect','S + have/has + V3','I have visited Komodo Island.','perf',[140,300],'IX'],
 ['future','simple','Simple Future','S + will / be going to + V1','We will visit Bali next month.','dot',[460],'VIII'],
 ['future','cont','Future Continuous','S + will be + V-ing','At 9 tomorrow I will be flying.','bar',[410,520],'SMA'],
 ['future','perf','Future Perfect','S + will have + V3','By 2030 I will have graduated.','perf',[300,490],'SMA']];
const TID={'Simple Past':'simple-past','Past Continuous':'past-continuous','Simple Present':'simple-present','Present Continuous':'present-continuous','Present Perfect':'present-perfect','Simple Future':'future'};
function line(m){ const [,,,,,ty,x]=m; let g='';
  if(ty==='dot') g=`<circle cx="${x[0]}" cy="60" r="11" fill="var(--acc2)"/>`;
  if(ty==='many') g=x.map(v=>`<circle cx="${v}" cy="60" r="7" fill="var(--acc2)"/>`).join('');
  if(ty==='bar') g=`<path d="M${x[0]} 60 Q ${(x[0]+x[1])/2-25} 36 ${(x[0]+x[1])/2} 60 T ${x[1]} 60" fill="none" stroke="var(--acc2)" stroke-width="9" stroke-linecap="round"/>`+(x[2]?`<path d="M${x[2]} 22 L${x[2]-8} 44 L${x[2]+3} 44 L${x[2]-5} 70" fill="none" stroke="var(--sun)" stroke-width="5" stroke-linejoin="round"/>`:'');
  if(ty==='perf') g=`<circle cx="${x[0]}" cy="60" r="9" fill="var(--acc2)"/><line x1="${x[0]}" y1="60" x2="${x[1]-14}" y2="60" stroke="var(--acc2)" stroke-width="6"/><path d="M${x[1]-16} 48 L${x[1]} 60 L${x[1]-16} 72z" fill="var(--acc2)"/>`;
  return `<svg viewBox="0 0 600 110" style="width:100%;max-width:600px;display:block;margin:auto" role="img" aria-label="Garis waktu ${m[2]}"><line x1="20" y1="60" x2="580" y2="60" stroke="var(--muted)" stroke-width="3"/><path d="M580 60 l-12 -7 v14z" fill="var(--muted)"/><line x1="300" y1="40" x2="300" y2="80" stroke="var(--acc)" stroke-width="4"/>${g}<text x="100" y="100" text-anchor="middle" font-size="16" font-weight="800" fill="var(--muted)">PAST</text><text x="300" y="100" text-anchor="middle" font-size="16" font-weight="800" fill="var(--acc)">NOW</text><text x="500" y="100" text-anchor="middle" font-size="16" font-weight="800" fill="var(--muted)">FUTURE</text></svg>`; }
function tenseMap(el){ const cell=m=>`<button class="tm ${m[7]==='SMA'?'sma':''}" data-k="${TM.indexOf(m)}"><b>${m[2]}</b><small>${m[3]}</small><i>${m[7]==='SMA'?'pengayaan':'Kelas '+m[7]}</i></button>`;
  el.innerHTML=`<div class="tmap"><span></span><b class="th">Simple</b><b class="th">Continuous</b><b class="th">Perfect</b>${['past','present','future'].map(r=>`<b class="th rh">${r==='past'?'⏪ Past':r==='present'?'⏺️ Present':'⏩ Future'}</b>${['simple','cont','perf'].map(c=>cell(TM.find(m=>m[0]===r&&m[1]===c))).join('')}`).join('')}</div><div id="tmv" class="stage" style="margin-top:12px"></div>`;
  const pickM=k=>{ const m=TM[k]; $$('.tm',el).forEach(b=>b.classList.toggle('on',+b.dataset.k===k));
    $('#tmv',el).innerHTML=`<div class="row" style="justify-content:space-between"><b class="big" style="font-size:1.3rem">${m[2]}</b><code class="frm">${esc(m[3])}</code></div>${line(m)}<p class="q" style="text-align:center">${esc(m[4])} ${E.sp(m[4])}</p>${TID[m[2]]?`<div class="row" style="justify-content:center"><a class="btn" href="${TID[m[2]]}.html">Pelajari ${m[2]} →</a></div>`:'<p class="muted" style="text-align:center">Pengayaan untuk jenjang SMA. Cukup kenali polanya.</p>'}`; };
  $$('.tm',el).forEach(b=>b.onclick=()=>{ pickM(+b.dataset.k); E.say(TM[+b.dataset.k][4]); }); pickM(3); }

/* ---- Indeks ---- */
GR.index=function(){ let done=0,sum=0;
  const grp=['VII','VIII','IX'].map(l=>`<h2 style="margin-top:22px">${LV[l]}</h2><div class="mods">${T.filter(t=>t.lvl===l).map(t=>{ const b=E.store.get('gr:'+t.id); if(b!=null){ done++; sum+=b; }
    return `<a class="mod" href="${t.id}.html"><div class="ic">${t.ic}</div><span class="muted" style="font-size:.78rem;font-weight:900">${T.indexOf(t)+1}. ${LV[l].toUpperCase()}</span><h3>${esc(t.t)}</h3><p>${t.sub}</p><div class="best">${b!=null?'⭐ Nilai kuis terbaik: '+b:'Belum mengerjakan kuis'}</div><div class="prog"><i style="width:${b||0}%"></i></div></a>`; }).join('')}</div>`).join('');
  shell('Grammar Lab',`<section class="hero"><span class="chip">🧩 Grammar Lab · ${T.length} topik</span><h1>Tata bahasa Inggris SMP, <span class="em">langkah demi langkah</span></h1>
   <p class="sub">Setiap topik berisi <b>📘 Konsep</b> (rumus, kapan dipakai, kata kunci, tabel), <b>🔁 Pola</b> positif-negatif-tanya dengan suara, <b>✍️ Isian</b>, <b>🔍 Cari Kesalahan</b>, dan <b>🏆 Kuis</b>.</p>
   <div class="row"><span class="chip" style="background:var(--acc2)">${done}/${T.length} kuis selesai</span><span class="chip" style="background:var(--sun);color:#3a2a00">Rata-rata: ${done?Math.round(sum/done):'–'}</span><a class="btn soft" href="../tryout/index.html">📝 Tryout Grammar</a></div></section>
   <div class="card"><h2><span class="ic">🗺️</span>Peta Tense</h2><p class="muted">Ketuk satu kotak untuk melihat rumus, garis waktu, dan contoh bersuara.</p><div id="tmap"></div></div>
   ${grp}
   <div class="card" style="margin-top:18px"><h2>👩‍🏫 Saran pemakaian</h2><ol><li>Buka topik grammar setelah unit yang memakainya (lihat label <i>Dipakai di</i>), atau sebagai remedial sebelum ujian.</li><li>Tab <b>Pola</b> bagus untuk drill lisan: guru membaca (+), siswa menjawab (−) dan (?).</li><li><b>Cari Kesalahan</b> melatih ketelitian, seperti soal "error recognition" pada olimpiade.</li></ol>
   <button class="btn ghost" id="rs">Hapus nilai Grammar Lab di perangkat ini</button></div>`,'../index.html');
  tenseMap($('#tmap'));
  $('#rs').onclick=()=>{ if(confirm('Hapus nilai kuis Grammar Lab?')){ T.forEach(t=>{ try{ localStorage.removeItem('engsmp:gr:'+t.id); }catch(e){} }); location.reload(); } }; };
})();
