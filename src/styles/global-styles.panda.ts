import { defineGlobalStyles } from "@pandacss/dev";

// Based on kiso.css v1.2.4 (MIT) https://github.com/tak-dcxi/kiso.css
// Keep the previous globals.css reset surface; avoid Panda preflight drift.
// Deviations: color-scheme: light dark with token-level light-dark();
// Body background/color/font from app tokens; text-decoration-inset omitted (initial value is auto);
// Active press feedback added (tap-highlight is transparent), gated on no-preference.
export const globalCss = defineGlobalStyles({
  // MARK: Universal
  "*, ::before, ::after": {
    boxSizing: "border-box",
  },

  // MARK: Document and Body Elements
  ":where(:root)": {
    // Safari では font-family 未指定だとセリフ体になるため sans-serif を既定にする。
    fontFamily: "sans-serif",
    // アクセシビリティのため line-height は最低 1.5 を推奨。
    lineHeight: "1.5",
    // 句読点の詰まりを解消し、行頭の空きを取る。
    textSpacingTrim: "trim-start",
    // 日本語と英数字の間に小さなスペースを入れる。
    textAutospace: "normal",
    // 誤読を防ぐため厳密な改行規則を適用。
    lineBreak: "strict",
    // 英単語の途中で折り返す。flex/grid での内容あふれも防ぐ。
    overflowWrap: "anywhere",
    // モバイルブラウザの自動フォントサイズ調整を無効化。
    WebkitTextSizeAdjust: "100%",
    textSizeAdjust: "100%",
    // スクロールバー出現によるレイアウトシフトを防ぐ。
    scrollbarGutter: "stable",
    // タップハイライト（iOS）を抑える。
    WebkitTapHighlightColor: "transparent",
    colorScheme: "light dark",
    fontSizeAdjust: "from-font",
    scrollbarColor: "{colors.scrollbarThumb} {colors.scrollbarTrack}",
    scrollbarWidth: "thin",
  },
  "@media (prefers-contrast: more)": {
    ":where(:root)": {
      scrollbarColor: "CanvasText Canvas",
    },
  },
  ":where(body)": {
    // スティッキーフッター対策の最低高。動的ビューポートのブロック方向。
    minBlockSize: "100dvb",
    margin: "unset",
    background: "surface",
    color: "fg",
    fontFamily: "body",
  },

  // MARK: Sections
  ":where(:is(h1, h2, h3, h4, h5, h6):lang(en))": {
    // 最終行が1語だけになる孤児を防ぐ。
    textWrap: "pretty",
  },
  ":where(h1)": {
    // セクショニングコンテンツ内の h1 に関する UA スタイルの調整。
    marginBlock: "0.67em",
    fontSize: "2em",
  },
  ":where(h2, h3, h4, h5, h6)": {
    marginBlock: "unset",
  },
  ":where(search)": {
    // <search> は Safari 17 から対応。未対応環境でのインライン表示を防ぐ。
    display: "block flow",
  },

  // MARK: Grouping content
  ":where(p, blockquote, figure, pre, address, ul, ol, dl, menu)": {
    marginBlock: "unset",
  },
  ":where(blockquote, figure)": {
    marginInline: "unset",
  },
  ":where(p:lang(en))": {
    // 英語は最終行が1語になる widow/orphan を避ける。
    textWrap: "pretty",
  },
  ":where(address:lang(ja))": {
    // 日本語では斜体は一般的ではないためリセット。
    fontStyle: "unset",
  },
  ":where(ul, ol, menu)": {
    paddingInlineStart: "unset",
    // Safari で list-style: none にするとスクリーンリーダーがリストを読み上げない。
    // マーカーを空にすることでアクセシビリティを保つ。
    listStyleType: '""',
  },
  ":where(dt)": {
    fontWeight: "bolder",
  },
  ":where(dd)": {
    marginInlineStart: "unset",
  },
  ":where(pre)": {
    // 等幅の整列を崩す text-spacing-trim は space-all で無効化。
    textSpacingTrim: "space-all",
    textAutospace: "no-autospace",
  },
  "@media (forced-colors: active)": {
    ":where(body)": {
      backgroundColor: "Canvas",
      color: "CanvasText",
    },
    ":where(mark)": {
      backgroundColor: "Highlight",
      color: "HighlightText",
    },
  },
  "@media print": {
    ":where(pre)": {
      textWrapMode: "unset",
    },
    ":where(mark)": {
      // グレースケール印刷でも判別できるように点線ボーダーを追加。
      borderWidth: "1px",
      borderStyle: "dotted",
    },
  },

  // MARK: Text-level semantics
  ":where(em:lang(ja))": {
    // 日本語では強調は太字で表すことが一般的。
    fontWeight: "bolder",
  },
  ":where(:is(i, cite, em, dfn):lang(ja))": {
    // 日本語では斜体は一般的ではないためリセット。
    fontStyle: "unset",
  },
  ":where(code, kbd, samp)": {
    // Tailwind を参考にした等幅フォントスタック。
    fontFamily:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    fontFeatureSettings: "initial",
    fontVariationSettings: "initial",
    // UA の font-size をリセットして継承させる。
    fontSize: "unset",
    // Fira Code などのプログラミングフォントのリガチャを無効化（=> が ⇒ になる等）。
    fontVariantLigatures: "none",
  },
  ":where(abbr[title])": {
    // 支援技術のサポートが一貫しない abbr の title 属性は、点線下線で視覚的に代替。
    textDecorationLine: "underline",
    textDecorationStyle: "dotted",
    cursor: "help",
  },
  ":where(time)": {
    // 日付表記にはスペースが入らないため no-autospace。
    textAutospace: "no-autospace",
  },

  // MARK: Links
  ":where(a)": {
    // UA の既定色はそのまま使われないことが多いため、継承にリセット。
    color: "unset",
  },
  ":where(a:any-link)": {
    textDecorationLine: "unset",
    textDecorationThickness: "from-font",
  },

  // MARK: Embedded content
  ":where(img, svg, picture, video, audio, canvas, model, iframe, embed, object)": {
    // あふれを防ぐため最大幅を 100% に。
    maxInlineSize: "100%",
    // 要素下部の余白を防ぐ。
    verticalAlign: "bottom",
  },
  ":where(img, svg, picture, video, canvas, model, iframe, embed, object)": {
    // 内容に合わせてブロックサイズを自動調整（audio は消えるため除外）。
    blockSize: "auto",
  },
  ":where(iframe)": {
    border: "unset",
  },

  // MARK: Tabular data
  ":where(table)": {
    borderCollapse: "collapse",
  },
  ":where(caption, th)": {
    textAlign: "unset",
  },
  ":where(caption:lang(en))": {
    textWrap: "pretty",
  },

  // MARK: Forms
  ":where(button, input, select, textarea), ::file-selector-button": {
    // 未スタイルでも可読性を保つための既定ボーダー。
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "line",
    borderRadius: "unset",
    color: "unset",
    font: "unset",
    letterSpacing: "unset",
    textAlign: "unset",
  },
  ':where(input:is([type="radio" i], [type="checkbox" i]))': {
    margin: "unset",
  },
  ':where(input[type="file" i])': {
    border: "unset",
  },
  ':where(input[type="search" i])': {
    // 検索入力の角丸を消し背景色を正規化（macOS）。
    WebkitAppearance: "textfield",
  },
  "@supports (-webkit-touch-callout: none)": {
    ':where(input[type="search" i])': {
      // 背景色を正規化（iOS）。
      backgroundColor: "Canvas",
    },
  },
  ':where(input:is([type="tel" i], [type="url" i], [type="email" i], [type="number" i]):not(:placeholder-shown))':
    {
      // 値が入力された状態では RTL でも左寄せを維持。
      direction: "ltr",
    },
  ":where(textarea)": {
    marginBlock: "unset",
    resize: "block",
  },
  ':where(input:not([type="button" i], [type="submit" i], [type="reset" i]), textarea, [contenteditable])':
    {
      // 入力中に text-autospace による空白挿入が起きないようにする。
      textAutospace: "no-autospace",
    },
  ':where(button, input:is([type="button" i], [type="submit" i], [type="reset" i])), ::file-selector-button':
    {
      backgroundColor: "unset",
    },
  ':where(button, input:is([type="button" i], [type="submit" i], [type="reset" i]), [role="tab" i], [role="button" i], [role="option" i]), ::file-selector-button':
    {
      // ダブルタップズームを無効化（iOS）。
      touchAction: "manipulation",
    },
  ':where(button:enabled, label[for], select:enabled, input:is([type="button" i], [type="submit" i], [type="reset" i], [type="radio" i], [type="checkbox" i]):enabled, [role="tab" i], [role="button" i], [role="option" i]), :where(:enabled)::file-selector-button':
    {
      // クリック可能な要素のみポインターカーソル。
      cursor: "pointer",
    },
  ":where(fieldset)": {
    // 子要素による fieldset の引き伸ばしを防ぐ。
    minInlineSize: "0",
    marginInline: "unset",
    padding: "unset",
    border: "unset",
  },
  ":where(legend)": {
    paddingInline: "unset",
  },
  ":where(progress)": {
    verticalAlign: "unset",
  },
  "::placeholder": {
    // Firefox で低く設定される可能性のある透明度を正規化。
    opacity: "unset",
  },

  // MARK: Interactive elements
  ":where(summary)": {
    listStyleType: '""',
    cursor: "pointer",
  },
  ":where(summary)::-webkit-details-marker": {
    // Safari 18.4 以前の三角アイコンを非表示に。
    display: "none",
  },
  ":where(dialog, [popover])": {
    // スクロールチェーンとモバイルのバウンスを防ぐ。
    overscrollBehaviorBlock: "contain",
    padding: "unset",
    border: "unset",
  },
  ":where(dialog:not([open], [popover]), [popover]:not(:popover-open))": {
    // 未オープン時の表示を強制非表示に。
    display: "none!",
  },
  ":where(dialog)": {
    maxInlineSize: "unset",
    maxBlockSize: "unset",
  },
  ":where(dialog)::backdrop": {
    backgroundColor: "oklch(0% 0 0deg / 30%)",
  },
  ":where([popover])": {
    margin: "unset",
  },

  // MARK: Focus Styles
  ":where(:focus-visible)": {
    // フォーカスリングと内容の間に余白を追加。
    outlineOffset: "3px",
  },
  '[tabindex="-1"]:focus': {
    // プログラム的なフォーカスにはアウトラインを表示しない。
    outline: "none!",
  },

  // MARK: Misc
  ':where(:disabled, [aria-disabled="true" i])': {
    // 無効要素は非インタラクティブ状態を反映して既定カーソル。
    cursor: "default",
  },
  "@media (prefers-reduced-motion: no-preference)": {
    ':where(button, [role="tab" i], [role="button" i], [role="option" i]):active:not(:disabled, [aria-disabled="true" i])':
      {
        transform: "translateY(1px)",
      },
  },
  '[hidden]:not([hidden="until-found" i])': {
    // 非表示意図の要素が表示されないことを保証。
    display: "none!",
  },
});
