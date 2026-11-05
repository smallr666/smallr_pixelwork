# SmallR 小R — Pixel Art Portfolio

純靜態網站（HTML / CSS / JS），不需要任何建置工具，可直接放上 GitHub Pages。

## 資料夾結構

```
index.html            主頁
css/style.css         樣式（顏色、字級都在最上方 :root）
js/data.js            ★ 作品資料（新增 / 修改作品改這裡）
js/i18n.js            ★ 介面中英文字（修改文案改這裡）
js/main.js            互動程式（一般不用動）
assets/works/<id>/    各作品圖片
assets/og-image.png   分享到社群時的預覽圖
fonts/fusion-pixel/   中文像素字型（OFL 授權，可商用）
.nojekyll             讓 GitHub Pages 不經過 Jekyll 處理
```

## 上傳到 GitHub Pages

1. 在 GitHub 建立新的 repository，例如 `smallr-portfolio`（設為 Public）。
2. 把這個資料夾**裡面的所有檔案**上傳到 repository 根目錄  
   （網頁上：Add file → Upload files，整批拖進去即可；記得包含 `.nojekyll`）。
3. 進入 **Settings → Pages**：Source 選 `Deploy from a branch`，Branch 選 `main` / `(root)`，按 Save。
4. 約 1–2 分鐘後，網址會是 `https://<你的帳號>.github.io/smallr-portfolio/`。

> 想要網址是 `https://<帳號>.github.io/`，就把 repository 命名為 `<帳號>.github.io`。

### 上線後建議做一件事
`index.html` 裡的 `og:image` 改成完整網址，分享到 LINE / FB / IG 時才會顯示預覽圖：
```html
<meta property="og:image" content="https://<你的帳號>.github.io/smallr-portfolio/assets/og-image.png">
```

## 新增一件作品

1. 在 `assets/works/` 建立新資料夾（英文小寫，例如 `new-cat`），放入圖片。  
   - 像素圖請盡量放**原始尺寸**（例如 64×64），網頁會自動清晰放大，檔案也最小。
2. 打開 `js/data.js`，在 `window.WORKS` 裡複製一個區塊並修改：

```js
{
  id: "new-cat", year: 2026, cats: ["character"],
  bg: "#FDE6D3",                                  // 卡片底色
  title: { zh: "新貓咪", en: "New Cat" },
  desc:  { zh: "創作背景…", en: "Story…" },
  thumb: W + "new-cat/cat.png",                    // 卡片縮圖
  hover: W + "new-cat/cat.gif",                    // （選填）滑過時播放的 GIF
  canvas: "64 × 64 px",                            // （選填）畫布尺寸
  modules: [
    { type: "image", src: W + "new-cat/cat.png", pixel: true }
  ]
},
```

3. 如果是新的年份，也在 `window.JOURNEY` 加一關（Lv.6…）。

### 可用的展示模組 `modules`
| type | 用途 | 範例作品 |
|---|---|---|
| `image` | 單張圖，`zoom: true` 可點擊放大 | 像素物件系列 |
| `gallery` | 多張小圖並排 | Mimit 卡面版本 |
| `player` | 逐格動畫播放器（需要 sprite sheet） | 皇帝企鵝寶寶 |
| `layers` | 圖層拆解＋立體展開 | 密勒頓 |
| `compare` | 照片 → 像素對照 | 海景 |
| `variants` | 一般 / 色違切換 | Mimit |
| `cursors` | 游標試用 | 聖誕企鵝鼠標 |

> 逐格動畫的 sprite sheet 製作：Aseprite → File → Export Sprite Sheet（Layout: By Rows），
> 再把每格寬高 `w / h`、每列幾格 `cols`、總格數 `n`、每格毫秒 `durations` 填進去。

## 本機預覽
直接雙擊 `index.html` 就能開啟；或在資料夾內執行 `python -m http.server` 後開 `http://localhost:8000`。

## 授權
- 作品圖片 © SmallR 小R。寶可夢與 TemTem 相關作品為個人二次創作，角色版權屬原權利人所有。
- 字型：Fusion Pixel Font（SIL Open Font License 1.1），授權檔見 `fonts/fusion-pixel/`。
