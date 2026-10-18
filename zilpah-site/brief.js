// shortcut: no backend, the brief is sent as a pre-filled email; swap for a form endpoint when one exists
const form = document.getElementById('brief'), summary = document.getElementById('summary');
let dirty = false;
const mark = el => { // show or clear a field's error, and point screen readers at the message
  const field = el.closest('.field'), err = field?.querySelector('.error');
  if (!err) return;
  const bad = !el.checkValidity();
  err.id ||= el.name + '-error';
  field.classList.toggle('invalid', bad);
  el.setAttribute('aria-invalid', bad);
  bad ? el.setAttribute('aria-describedby', err.id) : el.removeAttribute('aria-describedby');
};
form.addEventListener('input', e => { dirty = true; if (e.target.checkValidity()) mark(e.target); }); // clear errors as they're fixed; new ones wait for submit
addEventListener('beforeunload', e => { if (dirty) e.preventDefault(); });

form.addEventListener('submit', e => {
  e.preventDefault();
  const fields = [...form.querySelectorAll('[required]')];
  fields.forEach(mark);
  const firstBad = fields.find(el => !el.checkValidity());
  if (firstBad) return firstBad.focus();

  const data = new FormData(form), get = k => data.getAll(k).join(', ') || '–';
  const text = [
    ['Name', 'name'], ['Role', 'role'], ['Email', 'email'], ['Company', 'company'], ['Website', 'website'],
    ['What we sell', 'product'], ['Best customer', 'icp'], ['Paying customers', 'customers'], ['Average yearly contract', 'acv'],
    ['Markets', 'markets'], ['Who does outbound', 'outbound'], ['CRM', 'crm'], ['Biggest problem', 'challenge'],
    ['Good result in 3 months', 'goal'], ['Other notes', 'notes']
  ].map(([label, key]) => `${label}: ${get(key)}`).join('\n');

  summary.value = text;
  dirty = false;
  document.body.classList.add('sent');
  scrollTo(0, 0);
  document.querySelector("#done h2").focus();
  location.href = `mailto:hello@zilpah.io?subject=${encodeURIComponent('Company brief: ' + get('company'))}&body=${encodeURIComponent(text)}`;
});

document.getElementById('copy').addEventListener('click', async e => {
  try { await navigator.clipboard.writeText(summary.value); e.target.textContent = 'Copied'; }
  catch { summary.select(); }
});
document.getElementById('edit').addEventListener('click', () => document.body.classList.remove('sent'));
