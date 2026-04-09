#!/usr/bin/env node
// Decrypt committed .enc blobs back into their plaintext form.
// Used both locally (after cloning) and in CI via the postinstall hook.
// No-op if DATA_ENCRYPTION_KEY is not set or the .enc file is missing,
// so contributors without the key can still install dependencies.

import { createDecipheriv } from 'node:crypto';
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
  if (!key) return null;
  const buf = Buffer.from(key, 'base64');
  if (buf.length !== 32) {
    console.error('DATA_ENCRYPTION_KEY must decode to 32 bytes (base64).');
    process.exit(1);
  }
  return buf;
}

function decryptFile(relPath, key) {
  const outPath = join(root, relPath);
  const inPath = `${outPath}.enc`;
  if (!existsSync(inPath)) return;
  const blob = readFileSync(inPath);
  const iv = blob.subarray(0, 12);
  const tag = blob.subarray(12, 28);
  const ciphertext = blob.subarray(28);
  const decipher = createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  const plaintext = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);
  writeFileSync(outPath, plaintext);
  console.log(`decrypted ${relPath}.enc -> ${relPath}`);
}

const key = loadKey();
if (!key) {
  // Silent no-op so installs work without the key.
  process.exit(0);
}
for (const f of FILES) decryptFile(f, key);
