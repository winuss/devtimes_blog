/**
 * 포스트 MDX 경로·슬러그 해석의 단일 출처 (검색 인덱스·검증 스크립트 공통).
 */
const path = require('path');
const glob = require('glob');

function postsRoot(cwd = process.cwd()) {
  return path.join(cwd, 'src', 'posts');
}

function getPostMdxPaths(cwd = process.cwd()) {
  return glob.sync(path.join(postsRoot(cwd), '**/content.mdx'));
}

/**
 * @param {string} mdxPath content.mdx 절대 경로
 */
function parsePostLocation(mdxPath, cwd = process.cwd()) {
  const srcDir = postsRoot(cwd);
  const dir = path.dirname(mdxPath);
  const relativeDir = path.relative(srcDir, dir).split(path.sep).join('/');
  const segments = relativeDir.split('/');
  return {
    mdxPath,
    relativeDir,
    categoryPath: segments[0],
    slug: segments[segments.length - 1],
  };
}

module.exports = { postsRoot, getPostMdxPaths, parsePostLocation };
