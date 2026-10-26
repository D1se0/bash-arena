/**
 * create-releases — publica en GitHub las releases pendientes (v0.1.0 → v0.3.0)
 * usando la API REST, con sus notas (releases/notes/{v}.md) y tarball adjunto
 * (releases/bash-arena-{v}.tar.gz si existe).
 *
 * Uso:  GH_TOKEN=ghp_xxx node scripts/create-releases.mjs
 *       (el token necesita scope repo:contents)
 */
const TOKEN = process.env.GH_TOKEN;
if (!TOKEN) {
  console.error('falta GH_TOKEN (scope repo). Ej: GH_TOKEN=ghp_xxx node scripts/create-releases.mjs');
  process.exit(2);
}

const OWNER = 'D1se0';
const REPO = 'bash-arena';
const VERSIONS = ['v0.1.0', 'v0.1.1', 'v0.2.0', 'v0.3.0'];
import { readFileSync, existsSync } from 'node:fs';

const api = async (path, opts = {}) => {
  const res = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/${path}`, {
    ...opts,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'bash-arena-release-script',
      ...(opts.headers ?? {}),
    },
  });
  if (!res.ok) throw new Error(`${opts.method ?? 'GET'} ${path} → ${res.status}: ${(await res.text()).slice(0, 300)}`);
  return res.json();
};

const assetUpload = async (uploadUrl, file, name, mime) => {
  const url = uploadUrl.split('{')[0];
  const res = await fetch(url + `?name=${encodeURIComponent(name)}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': mime,
      'Content-Length': file.byteLength,
      'User-Agent': 'bash-arena-release-script',
    },
    body: file,
  });
  if (!res.status || res.status >= 300) throw new Error(`upload ${name} → ${res.status}`);
};

const existentes = new Set((await api('releases')).map((r) => r.tag_name));
for (const v of VERSIONS) {
  if (existentes.has(v)) {
    console.log(`${v}: ya existe release, no se toca`);
    continue;
  }
  const notesFile = `releases/notes/${v}.md`;
  if (!existsSync(notesFile)) {
    console.error(`${v}: no hay notas en ${notesFile} — hace falta para el cuerpo`);
    process.exit(1);
  }
  const rel = await api('releases', {
    method: 'POST',
    body: JSON.stringify({
      // el tag ya está pushado al remoto: crear la release Sobre el tag
      // (target_commitish solo aplica al crear el tag en el vuelo)
      tag_name: v,
      name: `bash-arena ${v}`,
      body: readFileSync(notesFile, 'utf8'),
    }),
  });
  console.log(`${v}: release creada (id ${rel.id})`);
  const tar = `releases/bash-arena-${v}.tar.gz`;
  if (existsSync(tar)) {
    await assetUpload(rel.upload_url, readFileSync(tar), tar.split('/').pop(), 'application/gzip');
    const shaFile = `${tar}.sha256`;
    if (existsSync(shaFile)) await assetUpload(rel.upload_url, readFileSync(shaFile), `${tar.split('/').pop()}.sha256`, 'text/plain');
    console.log(`${v}: tarball + sha256 adjuntados`);
  }
}
console.log('DONE');
