const fs = require('fs');
const path = require('path');

const project_root = path.join(__dirname, '..');
const cache_root = path.join(
  project_root,
  'node_modules',
  '.cache',
  'libcurl-impersonate'
);

const extensions = {
  darwin: '.dylib',
  linux: '.so',
  win32: '.dll',
};

async function main() {
  const extension = extensions[process.platform];
  if (!extension) {
    throw new Error(`impers is not supported on ${process.platform}`);
  }

  process.env.IMPER_CACHE_DIR = cache_root;

  const { resolveLibrary } = await import('impers');
  const library = await resolveLibrary();
  if (!library.isImpersonate) {
    throw new Error(
      `Downloaded library does not support impersonation: ${library.path}`
    );
  }

  const output_directory = path.join(
    project_root,
    'vendor',
    'libcurl-impersonate',
    `${process.platform}-${process.arch}`
  );
  const output_path = path.join(
    output_directory,
    `libcurl-impersonate${extension}`
  );

  fs.mkdirSync(output_directory, { recursive: true });
  fs.copyFileSync(library.path, output_path);
  fs.chmodSync(output_path, 0o755);

  console.log(`Installed libcurl-impersonate at ${output_path}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
