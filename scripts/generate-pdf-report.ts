import { chromium } from '@playwright/test';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { aggregateReport } from '../shared/pdf/aggregate';
import { renderReport } from '../shared/pdf/template';

const DEFAULT_INPUT = resolve('test-results/report.json');
const DEFAULT_OUTPUT_DIR = resolve('test-results/pdf');

function parseArgs(argv: string[]): { input: string; project?: string } {
  let input = DEFAULT_INPUT;
  let project: string | undefined;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--input') {
      input = resolve(argv[++i] ?? DEFAULT_INPUT);
    } else if (arg === '--project') {
      project = argv[++i];
    }
  }

  return { input, project };
}

function timestamp(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

async function main(): Promise<void> {
  const { input, project } = parseArgs(process.argv.slice(2));

  let raw: unknown;
  try {
    raw = JSON.parse(readFileSync(input, 'utf8'));
  } catch {
    console.error(`[report:pdf] File tidak ditemukan atau bukan JSON valid: ${input}`);
    console.error('[report:pdf] Jalankan `npm test` terlebih dahulu agar report.json ter-generate.');
    process.exit(1);
  }

  const aggregate = aggregateReport(raw, input, project);
  const html = renderReport(aggregate);

  mkdirSync(DEFAULT_OUTPUT_DIR, { recursive: true });
  const outputFile = resolve(DEFAULT_OUTPUT_DIR, `report-${timestamp()}.pdf`);

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle' });
    await page.pdf({
      path: outputFile,
      format: 'A4',
      printBackground: true,
      margin: { top: '16mm', bottom: '16mm', left: '16mm', right: '16mm' },
    });
  } finally {
    await browser.close();
  }

  console.log(`[report:pdf] Ringkasan: ${aggregate.passed}/${aggregate.total} test lulus (${aggregate.passRate}%)`);
  console.log(`[report:pdf] PDF tersimpan di: ${outputFile}`);
}

main().catch((err) => {
  console.error('[report:pdf] Gagal membuat PDF:', err);
  process.exit(1);
});
