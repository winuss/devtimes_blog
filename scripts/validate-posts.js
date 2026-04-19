/**
 * Harness Engineering: 포스트를 모델/수동 편집에 맡기지 않고
 * 구조적 제약(필수 필드·슬러그 유일성)으로 실패를 빌드 전에 차단합니다.
 */
const fs = require('fs-extra');
const matter = require('gray-matter');
const { getPostMdxPaths, parsePostLocation } = require('./lib/post-paths');

const TITLE_MAX = 200;
const DESC_MAX = 500;

function isNonEmptyString(v) {
  return typeof v === 'string' && v.trim().length > 0;
}

function parseDateValue(raw) {
  if (raw == null || raw === '') return { ok: false, reason: '비어 있음' };
  if (raw instanceof Date && !Number.isNaN(raw.getTime())) return { ok: true, value: raw };
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return { ok: false, reason: `파싱 불가: ${JSON.stringify(raw)}` };
  return { ok: true, value: d };
}

function validateTags(tags, fileLabel) {
  const errors = [];
  if (tags === undefined || tags === null) return errors;
  if (!Array.isArray(tags)) {
    errors.push(`${fileLabel}: tags는 문자열 배열이어야 합니다.`);
    return errors;
  }
  tags.forEach((t, i) => {
    if (typeof t !== 'string' || t.trim() === '') {
      errors.push(`${fileLabel}: tags[${i}]는 비어 있지 않은 문자열이어야 합니다.`);
    }
  });
  return errors;
}

function validateSeries(data, fileLabel) {
  const errors = [];
  if (data.series == null) return errors;
  if (!isNonEmptyString(data.series)) {
    errors.push(`${fileLabel}: series가 있으면 비어 있지 않은 문자열이어야 합니다.`);
  }
  if (data.series != null && (typeof data.seriesOrder !== 'number' || !Number.isFinite(data.seriesOrder))) {
    errors.push(`${fileLabel}: series가 있으면 seriesOrder(유한 숫자)가 필요합니다.`);
  }
  return errors;
}

async function main() {
  const mdxFiles = getPostMdxPaths();
  const errors = [];
  const slugToFiles = new Map();

  for (const mdxPath of mdxFiles) {
    const { slug, relativeDir } = parsePostLocation(mdxPath);
    if (!slugToFiles.has(slug)) slugToFiles.set(slug, []);
    slugToFiles.get(slug).push(relativeDir);
  }

  for (const [slug, dirs] of slugToFiles) {
    if (dirs.length > 1) {
      errors.push(
        `슬러그 "${slug}" 가 중복됩니다 (URL /${slug} 충돌). 해당 디렉터리:\n  - ${dirs.join('\n  - ')}`,
      );
    }
  }

  for (const mdxPath of mdxFiles) {
    const { relativeDir } = parsePostLocation(mdxPath);
    const fileLabel = relativeDir + '/content.mdx';
    let raw;
    try {
      raw = await fs.readFile(mdxPath, 'utf8');
    } catch (e) {
      errors.push(`${fileLabel}: 읽기 실패 — ${e.message}`);
      continue;
    }

    let data;
    let content;
    try {
      const parsed = matter(raw);
      data = parsed.data;
      content = parsed.content;
    } catch (e) {
      errors.push(`${fileLabel}: frontmatter 파싱 실패 — ${e.message}`);
      continue;
    }

    if (data.draft === true) {
      continue;
    }

    if (!isNonEmptyString(data.title)) {
      errors.push(`${fileLabel}: 필수 필드 title(비어 있지 않은 문자열)이 없습니다.`);
    } else if (data.title.length > TITLE_MAX) {
      errors.push(`${fileLabel}: title 길이는 ${TITLE_MAX}자 이하여야 합니다.`);
    }

    const dateCheck = parseDateValue(data.date);
    if (!dateCheck.ok) {
      errors.push(`${fileLabel}: 필수 필드 date가 올바르지 않습니다 (${dateCheck.reason}).`);
    }

    if (!isNonEmptyString(data.desc)) {
      errors.push(`${fileLabel}: 필수 필드 desc(비어 있지 않은 문자열)이 없습니다.`);
    } else if (data.desc.length > DESC_MAX) {
      errors.push(`${fileLabel}: desc 길이는 ${DESC_MAX}자 이하여야 합니다.`);
    }

    if (!isNonEmptyString(content) || content.trim().length < 10) {
      errors.push(`${fileLabel}: 본문이 너무 짧거나 비어 있습니다.`);
    }

    errors.push(...validateTags(data.tags, fileLabel));
    errors.push(...validateSeries(data, fileLabel));
  }

  if (errors.length) {
    console.error('포스트 검증 실패 (validate-posts):\n');
    for (const msg of errors) console.error('- ' + msg);
    console.error(`\n총 ${errors.length}건`);
    process.exit(1);
  }

  console.log(`✓ validate-posts: ${mdxFiles.length}개 포스트 제약 조건 통과`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
