/*
 * サイト設定 — テーマ利用者が最初に編集するファイル。
 * ここを書き換えるだけでメタ情報・OGP・RSS・フッターの表記が切り替わる。
 * テーマ内部（src/components 以下）はこの値を参照するだけで、ハードコードしない。
 */
export const site = {
  /** サイト名。<title> のテンプレートやロゴ、RSS タイトルに使う */
  name: 'Sobotka Visual Creations',
  /** トップページなどタイトル未指定時のフルタイトル */
  title: 'Sobotka Visual Creations — montaż, animacja i motion design',
  /** タイトルテンプレート。%s に各ページの title が入る */
  titleTemplate: '%s — Sobotka Visual Creations',
  /** 既定の meta description。ページ側で上書き可能 */
  description: 'Montaż, animacje i oprawa graficzna dla klubów sportowych, twórców i firm.',
  /** 本番 URL（末尾スラッシュなし）。デプロイ先に合わせて変更する */
  url: 'https://sobotkavisual.pl',
  /** コンテンツ言語 */
  locale: 'pl',
  /** 既定の著者。記事 frontmatter で上書き可能 */
  author: 'Krzysztof Sobotka',
  /**
   * 既定の OGP 画像（サイトルート基準の絶対パス）。
   * 用意できない場合は undefined のままでよい（og:image を出力しない）。
   */
  defaultOgImage: undefined as string | undefined,
  /** SNS ハンドル。空文字なら該当タグを出力しない */
  social: {
    twitter: '',
    github: '',
  },
  /** ブログ一覧の1ページあたり記事数 */
  postsPerPage: 6,
};

export type SiteConfig = typeof site;
