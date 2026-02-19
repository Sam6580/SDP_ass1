// patients.js - simple localStorage-backed patient management
function getPatients(){
  try{return JSON.parse(localStorage.getItem('patients')||'[]')}catch(e){return[]}
}
function savePatients(list){localStorage.setItem('patients',JSON.stringify(list))}

function renderPatients(){
  const tbody=document.querySelector('#patientsTable tbody');
  tbody.innerHTML='';
  const patients=getPatients();
  patients.forEach(p=>{
    const tr=document.createElement('tr');
    tr.innerHTML=`<td>${escapeHtml(p.name)}</td>
      <td>${escapeHtml(p.email)}</td>
      <td>${escapeHtml(p.phone||'')}</td>
      <td>
        <button data-id="${p.id}" class="del">Delete</button>
      </td>`;
    tbody.appendChild(tr);
  });
}

function escapeHtml(s){return (s+'').replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c]})}

document.addEventListener('DOMContentLoaded',()=>{
  const form=document.getElementById('patientForm');
  if(!form) return;
  renderPatients();

  form.addEventListener('submit',e=>{
    e.preventDefault();
    const name=document.getElementById('pname').value.trim();
    const email=document.getElementById('pemail').value.trim();
    const phone=document.getElementById('pphone').value.trim();
    if(!name||!email){alert('Name and email required');return}
    const patients=getPatients();
    const id=Date.now().toString();
    patients.push({id,name,email,phone,createdAt:new Date().toISOString()});
    savePatients(patients);
    form.reset();
    renderPatients();
    populatePatientSelect();
  });

  document.querySelector('#patientsTable tbody').addEventListener('click',e=>{
    if(e.target && e.target.matches('button.del')){
      const id=e.target.getAttribute('data-id');
      let patients=getPatients();
      patients=patients.filter(p=>p.id!==id);
      savePatients(patients);
      renderPatients();
      populatePatientSelect();
    }
  });

  // populate patient select on load
  populatePatientSelect();
});

function populatePatientSelect(){
  const sel=document.getElementById('patientSelect');
  if(!sel) return;
  sel.innerHTML='<option value="">-- Select patient --</option>';
  getPatients().forEach(p=>{
    const opt=document.createElement('option');opt.value=p.id;opt.textContent=`${p.name} (${p.email})`;sel.appendChild(opt);
  });
}
