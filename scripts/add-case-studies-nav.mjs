import { readFileSync, writeFileSync } from 'node:fs';

const path = process.argv[2] ?? 'index.html';
const outer = readFileSync(path, 'utf8');
const open = '<script type="__bundler/template">';
const start = outer.indexOf(open);
const end = outer.indexOf('</script>', start);

if (start < 0 || end < 0) {
  throw new Error('Embedded template not found');
}

let template = JSON.parse(outer.slice(start + open.length, end).trim());
const before = 'const NAV = [];';
const after = `const NAV = [
  { label: 'Case Studies', href: 'case-studies.html' }
];`;

if (!template.includes(after)) {
  if (!template.includes(before)) {
    throw new Error('Empty NAV declaration not found');
  }
  template = template.replace(before, after);
}

const mobileBefore = '    .nav-links { display: none; }';
const mobileAfter = '    .nav-links { display: flex; gap: 18px; }';
if (!template.includes(mobileAfter)) {
  if (!template.includes(mobileBefore)) {
    throw new Error('Mobile navigation rule not found');
  }
  template = template.replace(mobileBefore, mobileAfter);
}

const serialized = JSON.stringify(template).replaceAll('</script>', '<\\/script>');
writeFileSync(
  path,
  outer.slice(0, start + open.length) + serialized + outer.slice(end)
);
