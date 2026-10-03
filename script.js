
const K={c:'nt_cust',s:'nt_slips',b:'nt_box'};let editC=null,editS=null;const $=x=>document.getElementById(x);const V=x=>$(x).value;const get=k=>JSON.parse(localStorage.getItem(k)||'[]');const set=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
function page(id,btn){document.querySelectorAll('.page').forEach(x=>x.classList.remove('on'));$(id).classList.add('on');document.querySelectorAll('.nav button').forEach(x=>x.classList.remove('on'));btn.classList.add('on');$('title').textContent={dash:'Dashboard',slip:'New Packing Slip',history:'Slip History',customers:'Customer Master'}[id];if(id==='history')renderHistory();if(id==='customers')renderCustomers();if(id==='dash')stats()}
function nextSlip(){
    let slips = get(K.s);

    let savedSeq = Number(localStorage.getItem('nt_slip_seq') || 1000);

    let nums = slips
        .map(x => Number(x.slipNo))
        .filter(n => Number.isFinite(n) && n >= 1001);

    let maxExisting = nums.length ? Math.max(...nums) : 1000;

    let n = Math.max(savedSeq, maxExisting) + 1;

    while (slips.some(x => String(x.slipNo) === String(n))) {
        n++;
    }

    return String(n);
}function nextBox(){let n=+(localStorage.getItem(K.b)||0)+1;return n}function today(){return new Date().toISOString().slice(0,10)}

function sanitizeInputs(){
 ['eway','tgst','design','cg'].forEach(id=>{
  if($(id)) $(id).value=String($(id).value||'').toUpperCase().replace(/[^A-Z0-9\-\/]/g,'');
 });
 ['bmob','smob','cm'].forEach(id=>{
  if($(id)) $(id).value=String($(id).value||'').replace(/\D/g,'');
 });
}
function newSlip(){editS=null;$('slipNo').value=nextSlip();$('date').value=today();$('design').value='';['eway','transport','tgst','bill','ship','bmob','smob'].forEach(x=>$(x).value='');$('boxes').value=1;$('box').value=nextBox();['s','m','x','l','xl','xxl','3xl','4xl','5xl'].forEach(x=>$(x).value=0);$('total').value=0;update()}
function formatAddressBlock(value){let lines=(value||'').split('\n').map(x=>x.trim()).filter(Boolean);if(!lines.length)return '';let name=lines[0]||'';let gstinLine=lines.find(x=>/^GSTIN:/i.test(x))||'';let addressLines=lines.filter(x=>x!==name && x!==gstinLine);let gstinHtml=gstinLine?`<span class="gstin-highlight">${gstinLine}</span>`:'';let addressHtml=addressLines.length?addressLines.map(x=>`<span class="address-highlight">${x}</span>`).join('<br>'):'';let html=[`<span class="customer-name">${name}</span>`, gstinHtml, addressHtml].filter(Boolean).join('<br>');return html}
function fillCustomer(){let c=get(K.c).find(x=>x.id==V('customer'));if(!c)return;let addr = c.name+'\nGSTIN: '+c.gstin+'\n'+c.address;$('bill').value=addr;$('ship').value=addr;$('bmob').value=c.mobile;$('smob').value=c.mobile;update()}
function update(){sanitizeInputs();let d=V('date');$('pd').textContent=d?d.split('-').reverse().join('-'):'';$('pe').textContent=String(V('eway')).toUpperCase();$('pt').textContent=V('transport');$('pg').textContent=String(V('tgst')).toUpperCase();$('pb').textContent=V('boxes');$('psn').textContent=V('slipNo');$('pbill').innerHTML=formatAddressBlock(V('bill'));$('pship').innerHTML=formatAddressBlock(V('ship'));$('pbm').textContent=V('bmob');$('psm').textContent=V('smob');$('pdesign').textContent=String(V('design')).toUpperCase();
let entries=[
  {key:'s',label:'S',value:+V('s')||0},
  {key:'m',label:'M',value:+V('m')||0},
  {key:'x',label:'X',value:+V('x')||0},
  {key:'l',label:'L',value:+V('l')||0},
  {key:'xl',label:'XL',value:+V('xl')||0},
  {key:'xxl',label:'XXL',value:+V('xxl')||0},
  {key:'3xl',label:'3XL',value:+V('3xl')||0},
  {key:'4xl',label:'4XL',value:+V('4xl')||0},
  {key:'5xl',label:'5XL',value:+V('5xl')||0}
].filter(x=>x.value>0);let t=entries.reduce((a,x)=>a+x.value,0);$('total').value=t;let table=document.querySelector('.qty');if(table){
  let head=entries.length?entries.map(x=>`<th>${x.label}</th>`).join(''):'<th>SIZE</th>';
  let body=entries.length?entries.map(x=>`<td id="p${x.label.replace(/[^A-Za-z0-9]/g,'')}">${x.value}</td>`).join(''):'<td id="pSize">0</td>';
  table.innerHTML=`<thead><tr><th>BOX NO.</th>${head}<th>TOTAL</th></tr></thead><tbody><tr><td id="pBoxNo">${V('box')}</td>${body}<td id="pTotal">${t} PCS</td></tr></tbody>`;
}
['box','s','m','x','l','xl','xxl','3xl','4xl','5xl'].forEach(k=>{const el=$(k);if(el)el.value=el.value||0;});
if($('pTotal'))$('pTotal').textContent=t+' PCS';}
function saveSlip(){if(!V('bill').trim())return alert('Bill To details are required.');let a=get(K.s),c=get(K.c).find(x=>x.id==V('customer')),r={id:editS||Date.now(),slipNo:V('slipNo'),date:V('date'),customer:V('customer'),customerName:c?c.name:V('bill').split('\n')[0],design:String(V('design')).toUpperCase(),eway:String(V('eway')).toUpperCase(),transport:V('transport'),tgst:String(V('tgst')).toUpperCase(),boxes:+V('boxes'),bill:V('bill'),ship:V('ship'),bmob:V('bmob'),smob:V('smob'),box:V('box'),s:+V('s'),m:+V('m'),x:+V('x'),l:+V('l'),xl:+V('xl'),xxl:+V('xxl'),'3xl':+V('3xl'),'4xl':+V('4xl'),'5xl':+V('5xl'),total:+V('total')};let i=a.findIndex(x=>x.id===r.id);i<0?a.push(r):a[i]=r;set(K.s,a);let bn=+V('box');if(bn>+(localStorage.getItem(K.b)||0))localStorage.setItem(K.b,bn);editS=r.id;stats();renderHistory();alert('Slip saved successfully.')}
function loadSlip(id){let r=get(K.s).find(x=>x.id===id);if(!r)return;editS=id;Object.keys(r).forEach(k=>{if($(k))$(k).value=r[k]});$('customer').value=r.customer||'';update();page('slip',document.querySelectorAll('.nav button')[1])}
function delSlip(id){if(confirm('Delete this slip?')){set(K.s,get(K.s).filter(x=>x.id!==id));renderHistory();stats()}}function printSlip(id){loadSlip(id);setTimeout(()=>window.print(),150)}
function renderHistory(){let q=(V('hq')||'').toLowerCase(),a=get(K.s).filter(x=>JSON.stringify(x).toLowerCase().includes(q));$('hb').innerHTML=a.length?a.slice().reverse().map(x=>`<tr><td>${x.slipNo}</td><td>${x.date}</td><td>${x.customerName}</td><td>${String(x.design||'').toUpperCase()}</td><td>${x.box}</td><td>${x.boxes}</td><td>${x.total}</td><td><button class="btn" onclick="loadSlip(${x.id})">Edit</button> <button class="btn" onclick="printSlip(${x.id})">Print</button> <button class="btn danger" onclick="delSlip(${x.id})">Delete</button></td></tr>`).join(''):'<tr><td colspan="8" class="empty">No slips found</td></tr>'}
function saveCustomer(){let n=V('cn').trim();if(!n)return alert('Customer name is required.');let a=get(K.c),r={id:editC||Date.now(),name:n,mobile:V('cm'),gstin:String(V('cg')).toUpperCase(),address:V('ca')},i=a.findIndex(x=>x.id===r.id);i<0?a.push(r):a[i]=r;set(K.c,a);editC=null;clearCustomer();renderCustomers();fillSelect();stats();alert('Customer saved.')}
function clearCustomer(){editC=null;['cn','cm','cg','ca'].forEach(x=>$(x).value='')}function editCustomer(id){let x=get(K.c).find(a=>a.id===id);editC=id;$('cn').value=x.name;$('cm').value=x.mobile;$('cg').value=String(x.gstin||'').toUpperCase();$('ca').value=x.address}function delCustomer(id){if(confirm('Delete customer?')){set(K.c,get(K.c).filter(x=>x.id!==id));renderCustomers();fillSelect();stats()}}
function renderCustomers(){let q=(V('cq')||'').toLowerCase(),a=get(K.c).filter(x=>JSON.stringify(x).toLowerCase().includes(q));$('cb').innerHTML=a.length?a.map(x=>`<tr><td>${x.name}</td><td>${x.mobile}</td><td>${String(x.gstin||'').toUpperCase()}</td><td>${x.address.replace(/\n/g,'<br>')}</td><td><button class="btn" onclick="editCustomer(${x.id})">Edit</button> <button class="btn danger" onclick="delCustomer(${x.id})">Delete</button></td></tr>`).join(''):'<tr><td colspan="5" class="empty">No customers</td></tr>'}
function fillSelect(){let a=get(K.c);$('customer').innerHTML='<option value="">-- Select Customer --</option>'+a.map(x=>`<option value="${x.id}">${x.name}</option>`).join('')}function stats(){let a=get(K.s);$('ns').textContent=a.length;$('nc').textContent=get(K.c).length;$('nb').textContent=a.reduce((n,x)=>n+(+x.boxes||0),0);$('np').textContent=a.reduce((n,x)=>n+(+x.total||0),0)}
function exportCSV(){let a=get(K.s);if(!a.length)return alert('No slips found.');let cols=['slipNo','date','customerName','design','box','boxes','s','m','l','xl','xxl','total','eway','transport','tgst'];let csv=[cols.join(','),...a.map(r=>cols.map(k=>'"'+String(r[k]??'').replaceAll('"','""')+'"').join(','))].join('\n');let u=URL.createObjectURL(new Blob([csv],{type:'text/csv'})),z=document.createElement('a');z.href=u;z.download='Narang_Textile_Slip_History.csv';z.click();URL.revokeObjectURL(u)}
['date','eway','transport','tgst','boxes','bill','ship','bmob','smob','design','box','s','m','x','l','xl','xxl','3xl','4xl','5xl'].forEach(x=>$(x).addEventListener('input',update));
['eway','tgst','design','cg','bmob','smob','cm'].forEach(id=>{
 if($(id)) $(id).addEventListener('input',()=>{sanitizeInputs();update();});
});
fillSelect();newSlip();stats();
