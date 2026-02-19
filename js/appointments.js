// appointments.js - simple localStorage-backed appointment booking
function getAppointments(){
  try{return JSON.parse(localStorage.getItem('appointments')||'[]')}catch(e){return[]}
}
function saveAppointments(list){localStorage.setItem('appointments',JSON.stringify(list))}

function renderAppointments(){
  const tbody=document.querySelector('#appointmentsTable tbody');
  tbody.innerHTML='';
  const appts=getAppointments();
  const patientsIndex = (getPatients()||[]).reduce((m,p)=>{m[p.id]=p;return m},{})
  appts.forEach(a=>{
    const tr=document.createElement('tr');
    const pname = patientsIndex[a.patientId] ? patientsIndex[a.patientId].name : 'Unknown';
    tr.innerHTML=`<td>${escapeHtml(pname)}</td>
      <td>${escapeHtml(a.doctor)}</td>
      <td>${escapeHtml(a.datetime)}</td>
      <td>${escapeHtml(a.status)}</td>
      <td>
        ${a.status==='Scheduled'?`<button data-id="${a.id}" class="cancel">Cancel</button>`:''}
      </td>`;
    tbody.appendChild(tr);
  });
}

document.addEventListener('DOMContentLoaded',()=>{
  const form=document.getElementById('appointmentForm');
  if(!form) return;
  renderAppointments();

  form.addEventListener('submit',e=>{
    e.preventDefault();
    const patientId=document.getElementById('patientSelect').value;
    const doctor=document.getElementById('doctor').value.trim();
    const datetime=document.getElementById('datetime').value;
    if(!patientId||!doctor||!datetime){alert('Please complete all fields');return}
    const appts=getAppointments();
    const id=Date.now().toString();
    appts.push({id,patientId,doctor,datetime,status:'Scheduled',createdAt:new Date().toISOString()});
    saveAppointments(appts);
    form.reset();
    renderAppointments();
  });

  document.querySelector('#appointmentsTable tbody').addEventListener('click',e=>{
    if(e.target && e.target.matches('button.cancel')){
      const id=e.target.getAttribute('data-id');
      let appts=getAppointments();
      appts = appts.map(a=> a.id===id ? {...a,status:'Cancelled'} : a);
      saveAppointments(appts);
      renderAppointments();
    }
  });

  // ensure patient select is populated by patients.js
  // if patients data changes, that module will re-run populatePatientSelect
});
