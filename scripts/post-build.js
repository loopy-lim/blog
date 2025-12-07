import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outDir = path.join(process.cwd(), 'out');
const dataDir = path.join(process.cwd(), 'data');
const outDataDir = path.join(outDir, 'data');

// out 디렉토리에 data 복사
if (fs.existsSync(dataDir) && fs.existsSync(outDir)) {
  fs.mkdirSync(outDataDir, { recursive: true });

  // data 디렉토리 내용 복사
  const files = fs.readdirSync(dataDir);
  files.forEach(file => {
    const src = path.join(dataDir, file);
    const dest = path.join(outDataDir, file);
    fs.copyFileSync(src, dest);
  });

  console.log(`✅ Copied ${files.length} data files to out/data/`);
} else {
  console.log('⚠️ Data directory or out directory not found');
}
