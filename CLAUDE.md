# devtimes blog

blog.devtimes.com 블로그 (Next.js 15, 정적 export → GitHub Pages).

## 글(포스트)

- 글은 `src/posts/{카테고리}/.../{slug}/content.mdx`에 있다. 공통 제약은 `.cursor/rules/post-mdx-harness.mdc`를 따른다.
- **AI 트렌드 글이나 새 글을 쓸 때는 먼저 [docs/ai-post-guide.md](docs/ai-post-guide.md)를 읽는다.** 번역 금지와 출처 표기, 사실 확인, 휴먼 톤(평어체), 게시 날짜, 작업 순서가 정리돼 있다.
- 글을 추가하거나 고친 뒤에는 `npm run validate-posts`와 `node scripts/generate-search-index.js`를 실행한다.

## 개발

- `npm run dev`: 검증과 검색 인덱스 생성 후 dev 서버를 켠다. 새 글을 추가하면 서버를 재시작해야 상세 페이지가 열린다.
- `main`에 push하면 곧바로 배포된다(`.github/workflows/deploy.yml`). push 전에 확인을 받는다.
