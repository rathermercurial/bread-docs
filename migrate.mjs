import {
  readFileSync, writeFileSync, mkdirSync, copyFileSync,
  readdirSync, existsSync, rmSync,
} from 'fs';
import { join, dirname, basename, relative } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// === PATHS ===
const WIKI_DIR        = '/home/rm/work/repos/bread/shared-obsidian/wiki';
const ATTACHMENTS_DIR = '/home/rm/work/repos/bread/shared-quartz/content/attachments';
const DOCS_DIR        = join(__dirname, 'src/content/docs');
const IMAGES_DIR      = join(__dirname, 'public/images');

// === AVAILABLE IMAGES ===
const availableImages = new Set(readdirSync(ATTACHMENTS_DIR));

// === WIKILINK LOOKUP TABLE ===
const WIKILINKS = {
  'wiki/index':                                                          { url: '/',                                                                  display: 'Bread Cooperative Wiki'        },
  'wiki/about/bread-token/index':                                        { url: '/token/',                                                            display: '$BREAD Token'                  },
  'wiki/solidarity-primitives/index':                                    { url: '/solidarity-primitives/',                                            display: 'Solidarity Primitives'         },
  'wiki/solidarity-primitives/crowdstaking/index':                       { url: '/solidarity-fund/',                                                  display: 'Solidarity Fund'               },
  'wiki/solidarity-primitives/crowdstaking/yield-governance/index':      { url: '/solidarity-primitives/crowdstaking/yield-governance/',              display: 'Yield Governance'              },
  'wiki/about/bread-token/marketplace/index':                            { url: '/marketplace/',                                                      display: '$BREAD Marketplace'            },
  'wiki/bread-cooperative/index':                                        { url: '/bread-cooperative/',                                                display: 'Bread Cooperative'             },
  'wiki/solidarity-primitives/crowdstaking/angel-minters/index':         { url: '/angel-minters/',                                                   display: 'Angel Minters'                 },
  'wiki/solidarity-primitives/crowdstaking/member-projects/index':       { url: '/member-projects/',                                                  display: 'Member Projects'               },
  'wiki/bread-cooperative/sourdough-systems/index':                      { url: '/bread-cooperative/sourdough-systems/',                              display: 'Sourdough Systems'             },
  'contact':                        { url: '/contact/',                                                              display: 'Contact'                        },
  'roadmap':                        { url: '/roadmap/',                                                              display: 'Roadmap'                        },
  'stacks':                         { url: '/solidarity-primitives/stacks/',                                         display: 'Bread Stacks'                  },
  'contributor-onboarding':         { url: '/bread-cooperative/contributors/contributor-onboarding/',                display: 'Contributor Onboarding'         },
  'how-to-become-a-member-project': { url: '/how-to-become-a-member-project/',                                       display: 'How to Become a Member Project'  },
  'gas-killer':                     { url: '/bread-cooperative/sourdough-systems/gas-killer/',                       display: 'Gas Killer'                     },
  'gardens-setup':                  { url: '/gardens-setup/',                                                        display: '$BREAD Gardens Pool Setup'      },
  'voting-power':                   { url: '/voting-power/',                                                         display: 'voting power'                   },
  'citizen-wallet':                 { url: '/solidarity-primitives/crowdstaking/member-projects/citizen-wallet/',    display: 'Citizen Wallet'                 },
  'lp-vaults':                      { url: '/solidarity-primitives/crowdstaking/yield-governance/lp-vaults/',        display: 'LP Voting Vaults'               },
  'operational-annex':              { url: '/bread-cooperative/governance/operational-annex/',                       display: 'Operational Annex'              },
  'bread-co-op':                    { url: '/solidarity-primitives/crowdstaking/member-projects/bread-co-op/',       display: 'Bread Core Team'                },
  'crypto-commons-association':     { url: '/solidarity-primitives/crowdstaking/member-projects/crypto-commons-association/', display: 'Crypto Commons Association' },
};

// Targets that have no destination page — output display text only, no link
const NO_LINK = new Set(['Patron Hall of Fame']);

// === CALLOUT TYPE MAP ===
const CALLOUT_TYPES = {
  info:      'note',
  note:      'note',
  important: 'caution',
  warning:   'caution',
  tip:       'tip',
  danger:    'danger',
  abstract:  'note',
  todo:      'note',
  question:  'note',
};

// =============================================================================
// FRONTMATTER TRANSFORMATION
// =============================================================================
function transformFrontmatter(fm) {
  const lines = fm.split('\n');
  const out = [];
  let sidebarOrder = null;
  let skipIndented = false;

  for (const line of lines) {
    // Skip indented continuation lines of a removed multi-line field
    if (skipIndented && /^\s+/.test(line)) continue;
    skipIndented = false;

    // Remove Obsidian-specific fields
    if (/^(share|fileClass|alias)[\s:]/.test(line)) {
      skipIndented = true;
      continue;
    }

    // Convert permalink → slug
    if (/^permalink:/.test(line)) {
      out.push(line.replace(/^permalink:/, 'slug:'));
      continue;
    }

    // Convert folderOrder / noteOrder → sidebar.order
    const orderM = line.match(/^(folderOrder|noteOrder):\s*(\S+)/);
    if (orderM) {
      sidebarOrder = orderM[2];
      continue;
    }

    out.push(line);
  }

  if (sidebarOrder !== null) {
    out.push('sidebar:');
    out.push(`  order: ${sidebarOrder}`);
  }

  return out.join('\n');
}

// =============================================================================
// IMAGE EMBED CONVERSION   ![[filename.ext]]  or  ![[filename.ext|alt text]]
// =============================================================================
function convertImageEmbeds(content) {
  return content.replace(/!\[\[([^\]]+)\]\]/g, (_, inner) => {
    const pipeIdx = inner.indexOf('|');
    let filename, alt;
    if (pipeIdx !== -1) {
      filename = inner.slice(0, pipeIdx).trim();
      alt      = inner.slice(pipeIdx + 1).trim();
      // If alt is identical to filename (with extension), strip extension
      if (alt === filename) alt = filename.replace(/\.[^.]+$/, '');
    } else {
      filename = inner.trim();
      alt      = filename.replace(/\.[^.]+$/, '');
    }

    if (!availableImages.has(filename)) {
      return `<!-- image not found: ${filename} -->`;
    }

    const encodedFilename = filename.replace(/ /g, '%20');
    return `![${alt}](/images/${encodedFilename})`;
  });
}

// =============================================================================
// WIKILINK CONVERSION   [[target]]  or  [[target|display text]]
// =============================================================================
function convertWikilinks(content) {
  return content.replace(/\[\[([^\]]+)\]\]/g, (match, inner) => {
    const pipeIdx = inner.indexOf('|');
    let target, display;
    if (pipeIdx !== -1) {
      target  = inner.slice(0, pipeIdx).trim();
      display = inner.slice(pipeIdx + 1).trim();
    } else {
      target  = inner.trim();
      display = null;
    }

    // No-link targets: output display text only
    if (NO_LINK.has(target)) return display ?? target;

    const entry = WIKILINKS[target];
    if (entry) return `[${display ?? entry.display}](${entry.url})`;

    // Unrecognized — keep raw and add HTML comment
    console.warn(`  WARN unresolved wikilink: [[${target}]]`);
    return `${match}<!-- unresolved wikilink: ${target} -->`;
  });
}

// =============================================================================
// CALLOUT CONVERSION
// =============================================================================
function convertCallouts(content) {
  const lines = content.split('\n');
  const out = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Match outer callout opener: > [!type] or > [!type]- optional title
    const outerM = line.match(/^> \[!(\w+)\]-?\s*(.*)$/);
    if (outerM) {
      const type  = CALLOUT_TYPES[outerM[1].toLowerCase()] ?? 'note';
      const title = outerM[2].trim();

      const bodyLines   = [];
      let   innerCallout = null;
      let   j           = i + 1;

      // Collect all consecutive lines starting with >
      while (j < lines.length && /^>/.test(lines[j])) {
        const bl      = lines[j];
        // Check for nested callout: > > [!type]
        const innerM  = bl.match(/^> > \[!(\w+)\]-?\s*(.*)$/);
        if (innerM) {
          const iType  = CALLOUT_TYPES[innerM[1].toLowerCase()] ?? 'note';
          const iTitle = innerM[2].trim();
          const iBody  = [];
          j++;
          // Collect inner body: lines starting with '> > '
          while (j < lines.length && lines[j].startsWith('> > ')) {
            iBody.push(lines[j].slice(4)); // strip '> > '
            j++;
          }
          innerCallout = { type: iType, title: iTitle, body: iBody };
        } else {
          // Regular outer body line — strip leading '> '
          bodyLines.push(bl.replace(/^> /, ''));
          j++;
        }
      }

      // Emit outer callout
      out.push(title ? `:::${type}[${title}]` : `:::${type}`);
      for (const bl of bodyLines) out.push(bl);
      out.push(':::');

      // Emit inner callout as a second block (refi-dao edge case)
      if (innerCallout) {
        out.push('');
        out.push(innerCallout.title
          ? `:::${innerCallout.type}[${innerCallout.title}]`
          : `:::${innerCallout.type}`);
        for (const bl of innerCallout.body) out.push(bl);
        out.push(':::');
      }

      i = j;
      continue;
    }

    out.push(line);
    i++;
  }

  return out.join('\n');
}

// =============================================================================
// FULL FILE TRANSFORMATION
// =============================================================================
function transformContent(content) {
  // Split frontmatter (handles optional \r and optional trailing newline)
  const fmM = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  let fm = '', body = content;
  if (fmM) {
    fm   = transformFrontmatter(fmM[1]);
    body = fmM[2];
  }

  body = body.replace(/%%[\s\S]*?%%/g, ''); // strip Obsidian comments
  body = convertCallouts(body);
  body = convertImageEmbeds(body);
  body = convertWikilinks(body);

  return fm ? `---\n${fm}\n---\n${body}` : body;
}

// =============================================================================
// FILE WALKER
// =============================================================================
function walkFiles(dir, cb) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walkFiles(full, cb);
    else if (entry.isFile()) cb(full);
  }
}

// =============================================================================
// MAIN
// =============================================================================

// Step A: Delete boilerplate files
console.log('\n=== Step A: Delete boilerplate ===');
for (const p of [
  join(DOCS_DIR, 'index.mdx'),
  join(DOCS_DIR, 'guides/example.md'),
  join(DOCS_DIR, 'reference/example.md'),
]) {
  if (existsSync(p)) { rmSync(p); console.log('Deleted:', p); }
}
for (const dir of ['guides', 'reference']) {
  const d = join(DOCS_DIR, dir);
  if (existsSync(d)) { rmSync(d, { recursive: true }); console.log('Deleted dir:', d); }
}

// Step B: Copy images
console.log('\n=== Step B: Copy images ===');
mkdirSync(IMAGES_DIR, { recursive: true });
let imgCount = 0;
for (const f of readdirSync(ATTACHMENTS_DIR)) {
  copyFileSync(join(ATTACHMENTS_DIR, f), join(IMAGES_DIR, f));
  imgCount++;
}
console.log(`Copied ${imgCount} images → ${IMAGES_DIR}`);

// Step C: Transform and write wiki files
console.log('\n=== Step C: Transform wiki files ===');
let fileCount = 0;
walkFiles(WIKI_DIR, (src) => {
  if (!src.endsWith('.md')) return;
  if (basename(src).toLowerCase() === 'readme.md') {
    console.log('Skipped (readme):', relative(WIKI_DIR, src));
    return;
  }

  const rel = relative(WIKI_DIR, src);
  const dst = join(DOCS_DIR, rel);
  mkdirSync(dirname(dst), { recursive: true });

  const content     = readFileSync(src, 'utf8');
  const transformed = transformContent(content);
  writeFileSync(dst, transformed, 'utf8');
  fileCount++;
  console.log(`OK: ${rel}`);
});

console.log(`\nDone. Processed ${fileCount} wiki files, ${imgCount} images.`);
