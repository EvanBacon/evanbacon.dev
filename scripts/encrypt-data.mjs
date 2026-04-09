#!/usr/bin/env node
// Encrypt secret data files into committable .enc blobs.
// Reads DATA_ENCRYPTION_KEY (base64-encoded 32 bytes) from env or .env.local.
// Format: [12-byte IV][16-byte auth tag][ciphertext]

import { createCipheriv, randomBytes } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const FILES = ['src/expo-oss-showcase-data.json'];

function loadKey() {
  let key = process.env.DATA_ENCRYPTION_KEY;
  if (!key) {
    const envFile = join(root, '.env.local');
    if (existsSync(envFile)) {
      const match = readFileSync(envFile, 'utf8').match(
        /^DATA_ENCRYPTION_KEY=(.+)$/m
      );
      if (match) key = match[1].trim().replace(/^["']|["']$/g, '');
    }
  }
  if (!key) {
    console.error(
      'DATA_ENCRYPTION_KEY is not set. Add it to .env.local or export it.'
    );
    process.exit(1);
  }
  const buf = Buffer.from(key, 'base64');
  if (buf.length !== 32) {
    console.error('DATA_ENCRYPTION_KEY must decode to 32 bytes (base64).');
    process.exit(1);
  }
  return buf;
}

function encryptFile(relPath, key) {
  const inPath = join(root, relPath);
  const outPath = `${inPath}.enc`;
  if (!existsSync(inPath)) {
    console.warn(`skip ${relPath} (missing)`);
    return;
  }
  const plaintext = readFileSync(inPath);
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();
  writeFileSync(outPath, Buffer.concat([iv, tag, ciphertext]));
  console.log(`encrypted ${relPath} -> ${relPath}.enc`);
}

const key = loadKey();
for (const f of FILES) encryptFile(f, key);
