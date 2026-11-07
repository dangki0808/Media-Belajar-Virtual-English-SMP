/* Navigasi bersama Virtual English Lab SMP */
(function(){ try{
  var s=document.currentScript, src=(s&&s.getAttribute('src'))||'../shared/nav.js', base=src.replace(/shared\/nav\.js.*$/,'');
  if(!document.getElementById('vnav-css')){ var st=document.createElement('style'); st.id='vnav-css';
    st.textContent='.vnav{background:#1e2a5a;color:#fff;font-family:"Nunito","Segoe UI",system-ui,sans-serif;font-size:15px}.vnav .vin{max-width:1040px;margin:0 auto;padding:6px 16px;display:flex;gap:6px;align-items:center;overflow-x:auto;scrollbar-width:none}.vnav .vin::-webkit-scrollbar{display:none}.vnav a{color:#fff;text-decoration:none;font-weight:800;padding:6px 12px;border-radius:999px;white-space:nowrap}.vnav a.on,.vnav a:hover{background:rgba(255,255,255,.16)}.vnav .vmark{background:linear-gradient(90deg,#f2a541,#ffd27a);color:#1e2a5a}.vnav select{margin-left:auto;font:inherit;font-weight:800;border-radius:999px;border:0;padding:6px 10px;background:#fff;color:#1e2a5a}';
    document.head.appendChild(st); }
  var path=location.pathname.replace(/\\/g,'/'), m=path.match(/\/(kelas-\d|kamus|arena|tryout|grammar)\//), cur=m?m[1]:'home';
  var n=document.createElement('nav'); n.className='vnav'; n.setAttribute('aria-label','Navigasi English Lab SMP');
  var h='<div class="vin"><a class="vmark" href="'+base+'index.html">📘 English Lab SMP</a><a class="'+(cur==='grammar'?'on':'')+'" href="'+base+'grammar/index.html">🧩 Grammar</a><a class="'+(cur==='kamus'?'on':'')+'" href="'+base+'kamus/index.html">📚 Kamus</a><a class="'+(cur==='arena'?'on':'')+'" href="'+base+'arena/index.html">🎮 Arena</a><a class="'+(cur==='tryout'?'on':'')+'" href="'+base+'tryout/index.html">📝 Tryout</a><select aria-label="Pindah kelas"><option value="">'+(cur.indexOf('kelas')===0?'Kelas lain…':'Pilih kelas…')+'</option>';
  ['VII','VIII','IX'].forEach(function(r,i){ var f='kelas-'+(i+7); h+='<option value="'+f+'"'+(f===cur?' selected':'')+'>Kelas '+r+'</option>'; });
  n.innerHTML=h+'</select></div>'; document.body.insertBefore(n,document.body.firstChild);
  n.querySelector('select').addEventListener('change',function(){ if(this.value) location.href=base+this.value+'/index.html'; });
}catch(e){} })();
