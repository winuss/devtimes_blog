// scripts/add-missing-tags.js
const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const matter = require('gray-matter');

const srcDir = path.join(process.cwd(), 'src', 'posts');

function toPrettyTag(category) {
  const map = {
    ai: 'AI',
    react: 'React',
    python: 'Python',
    angular: 'Angular',
    datalake: 'Data Lake',
    ops: 'Ops',
    javascript: 'JavaScript',
  };
  return map[category] || category[0].toUpperCase() + category.slice(1);
}

async function run() {
  const mdxFiles = glob.sync(path.join(srcDir, '**/content.mdx'));
  let updated = 0;
  for (const mdxPath of mdxFiles) {
    const dir = path.dirname(mdxPath);
    const relativeDir = path.relative(srcDir, dir).split(path.sep).join('/');
    const segments = relativeDir.split('/');
    const category = segments[0];
    try {
      const file = await fs.readFile(mdxPath, 'utf8');
      const { data, content } = matter(file);
      const hasTags = Array.isArray(data.tags) && data.tags.length > 0;
      if (hasTags) continue;

      const tags = [toPrettyTag(category)];
      const next = matter.stringify(content, { ...data, tags });
      await fs.writeFile(mdxPath, next);
      updated += 1;
      console.log(`✓ Added tags to ${relativeDir}/content.mdx -> ${JSON.stringify(tags)}`);
    } catch (err) {
      console.error(`✗ Failed to update ${relativeDir}/content.mdx`, err);
    }
  }
  console.log(`\n✨ Completed. Updated ${updated} files.`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});


