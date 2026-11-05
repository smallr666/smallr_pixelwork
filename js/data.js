/* =========================================================
   作品資料 Works data
   新增作品：複製一個區塊、改內容、把圖片放進 assets/works/<id>/
   To add a work: copy one block, edit it, put images in assets/works/<id>/
   ========================================================= */

// 類型篩選 Category filters
window.CATEGORIES = [
  { id: "all",       zh: "全部",     en: "All" },
  { id: "character", zh: "角色",     en: "Characters" },
  { id: "scene",     zh: "場景",     en: "Scenes" },
  { id: "asset",     zh: "遊戲素材", en: "Game Assets" },
  { id: "animation", zh: "動畫",     en: "Animation" },
  { id: "fanart",    zh: "二創",     en: "Fan Art" },
  { id: "ui",        zh: "UI / 游標", en: "UI / Cursors" }
];

// 升級路線 Level-up journey (one entry per year)
window.JOURNEY = [
  { year: 2021, lv: 1, zh: { title: "新手村", text: "第一次畫像素，從史萊姆和日常小圖標開始" },
                       en: { title: "Starter Village", text: "First pixels: a slime and a set of everyday icons." } },
  { year: 2022, lv: 2, zh: { title: "探索地圖", text: "嘗試場景、等角視角與二創，作品類型最多的一年" },
                       en: { title: "Exploring", text: "Scenes, isometric views and fan art — my most varied year." } },
  { year: 2023, lv: 3, zh: { title: "收集圖鑑", text: "把 TemTem 生物轉成像素，練習色違與卡面設計" },
                       en: { title: "Collecting", text: "Turning a Temtem creature into pixels, with a Luma variant and card layout." } },
  { year: 2024, lv: 4, zh: { title: "動起來", text: "85 格標題動畫，嘗試前後景層次與動態效果" },
                       en: { title: "In Motion", text: "An 85-frame title animation exploring depth and movement." } },
  { year: 2025, lv: 5, zh: { title: "實用道具", text: "15 款客製化游標，讓作品走進每天的使用裡" },
                       en: { title: "Everyday Tools", text: "15 custom cursors — pixel art you actually use every day." } }
];

const W = "assets/works/";

window.WORKS = [
  {
    id: "slime", year: 2021, cats: ["character", "animation"],
    tools: ["Aseprite"],
    bg: "#FBD5C4",
    title: { zh: "史萊姆", en: "Slime" },
    desc: { zh: "初次嘗試像素作品，之後試著讓他跳躍", en: "My very first pixel piece — later I tried making it jump." },
    thumb: W + "slime/still.webp", hover: W + "slime/jump.gif",
    canvas: "50 × 50 px",
    badges: ["GIF"],
    modules: [
      { type: "player", sheet: W + "slime/jump-sheet.png", w: 50, h: 50, cols: 5, n: 5, durations: [100, 100, 150, 150, 120], bg: "#FBD5C4",
        caption: { zh: "跳躍動畫・5 格", en: "Jump cycle · 5 frames" } },
      { type: "image", src: W + "slime/still.webp", caption: { zh: "靜態版本", en: "Still" } }
    ]
  },
  {
    id: "items", year: 2021, cats: ["asset"],
    tools: ["Photoshop"],
    bg: "#F8B6A0",
    title: { zh: "像素物件系列", en: "Pixel Item Set" },
    desc: { zh: "日常物件與遊戲道具的圖示練習，分成食物點心、植物、武器工具三組", en: "Icon practice for everyday objects and game items, grouped into food, plants and tools." },
    thumb: W + "items/overview.webp", thumbFit: "cover", smooth: true,
    badges: { zh: ["圖示組"], en: ["Icon set"] },
    modules: [
      { type: "image", src: W + "items/overview.webp", zoom: true, caption: { zh: "總覽", en: "Overview" } },
      { type: "image", src: W + "items/food.webp", zoom: true, caption: { zh: "食物與點心", en: "Food & snacks" } },
      { type: "image", src: W + "items/plants.webp", zoom: true, caption: { zh: "植物", en: "Plants" } },
      { type: "image", src: W + "items/tools.webp", zoom: true, caption: { zh: "武器與工具", en: "Weapons & tools" } }
    ]
  },
  {
    id: "little-penguin", year: 2022, cats: ["character"],
    tools: ["Aseprite"],
    bg: "#FDE6D3",
    title: { zh: "小企鵝 The Light", en: "Little Penguin · The Light" },
    desc: { zh: "女友的生日插畫", en: "A birthday illustration for my girlfriend." },
    thumb: W + "little-penguin/light.png",
    canvas: "90 × 90 px",
    modules: [
      { type: "image", src: W + "little-penguin/light.png", pixel: true }
    ]
  },
  {
    id: "seascape", year: 2022, cats: ["scene"],
    tools: ["Photoshop"],
    bg: "#1D2A35",
    title: { zh: "海景 Pixel Art Sunset", en: "Pixel Art Sunset" },
    desc: { zh: "依照一張我用手機拍的照片繪製的像素插畫，過程困難但也很有樂趣", en: "Based on a photo I took on my phone. Tricky to paint, but a lot of fun." },
    thumb: W + "seascape/pixel.webp", thumbFit: "cover", smooth: true,
    badges: { zh: ["照片對照"], en: ["Photo → Pixel"] },
    modules: [
      { type: "compare", before: W + "seascape/photo.webp", after: W + "seascape/pixel.webp",
        beforeLabel: { zh: "原始照片", en: "Original photo" }, afterLabel: { zh: "像素作品", en: "Pixel art" } },
      { type: "image", src: W + "seascape/mockup.webp", caption: { zh: "唱片封面延伸應用", en: "Album-cover mockup" } }
    ]
  },
  {
    id: "cat-island", year: 2022, cats: ["scene"],
    tools: ["Aseprite"],
    bg: "#FFD49C",
    title: { zh: "貓咪島", en: "Cat Island" },
    desc: { zh: "等角視角的漂浮小島，練習方塊地形、水面與光影", en: "A floating isometric island — practice in block terrain, water and light." },
    thumb: W + "cat-island/island.png",
    canvas: "125 × 120 px",
    modules: [
      { type: "image", src: W + "cat-island/island.png", pixel: true }
    ]
  },
  {
    id: "miraidon", year: 2022, cats: ["fanart", "character"], fanart: true,
    tools: ["Aseprite"],
    bg: "#A98AE2",
    title: { zh: "寶可夢紫版・密勒頓", en: "Pokémon Violet · Miraidon" },
    desc: { zh: "當時玩寶可夢朱紫很瘋，特地畫了一張來慶祝通關", en: "I was hooked on Pokémon Scarlet & Violet, so I drew this to celebrate beating the game." },
    thumb: W + "miraidon/final.webp", smooth: true,
    canvas: "200 × 250 px",
    badges: { zh: ["圖層拆解"], en: ["Layers"] },
    modules: [
      { type: "layers",
        layers: [
          { src: W + "miraidon/layer-bg.png", label: { zh: "背景", en: "Background" } },
          { src: W + "miraidon/layer-frame.png", label: { zh: "外框", en: "Frame" } },
          { src: W + "miraidon/layer-char.png", label: { zh: "角色", en: "Character" } }
        ],
        final: W + "miraidon/final.webp", finalLabel: { zh: "完稿", en: "Final" } },
      { type: "gallery", items: [
          { src: W + "miraidon/flat.png", label: { zh: "純色背景版本", en: "Solid-background version" } },
          { src: W + "miraidon/final.webp", label: { zh: "完稿", en: "Final" } }
        ] }
    ]
  },
  {
    id: "mimit", year: 2023, cats: ["fanart", "character", "animation"], fanart: true,
    tools: ["Aseprite"],
    bg: "#E2C6B6",
    title: { zh: "TemTem #001 Mimit", en: "Temtem #001 Mimit" },
    desc: { zh: "覺得遊戲概念很有趣，嘗試把裡面的生物轉成像素風格", en: "I loved the game's concept, so I tried turning one of its creatures into pixel art." },
    thumb: W + "mimit/card-a.png", hover: W + "mimit/idle.gif",
    canvas: "100 × 100 px",
    badges: { zh: ["色違", "GIF"], en: ["Variant", "GIF"] },
    modules: [
      { type: "variants", items: [
          { src: W + "mimit/card-a.png", label: { zh: "一般", en: "Normal" } },
          { src: W + "mimit/card-luma.png", label: { zh: "Luma 色違", en: "Luma" } }
        ] },
      { type: "player", sheet: W + "mimit/idle-sheet.png", w: 100, h: 100, cols: 9, n: 9, durations: [170,170,170,170,170,170,170,170,170],
        caption: { zh: "待機動畫・9 格", en: "Idle animation · 9 frames" } },
      { type: "player", sheet: W + "mimit/badge-sheet.png", w: 100, h: 100, cols: 2, n: 2, durations: [270, 270],
        caption: { zh: "徽章切換・2 格", en: "Badge swap · 2 frames" } },
      { type: "gallery", items: [
          { src: W + "mimit/card-b.png", label: { zh: "卡面版本 2", en: "Card v2" } },
          { src: W + "mimit/card-c.png", label: { zh: "卡面版本 3", en: "Card v3" } }
        ] }
    ]
  },
  {
    id: "emperor-penguin", year: 2024, cats: ["character", "animation"],
    tools: ["Aseprite"],
    bg: "#3AAEE6",
    title: { zh: "皇帝企鵝寶寶", en: "Emperor Penguin Chick" },
    desc: { zh: "女友的生日插畫 2，這次做了很多畫面前後層次與動畫的嘗試，整體來說很滿意", en: "Birthday illustration no. 2. I experimented a lot with foreground/background depth and animation — really happy with how it turned out." },
    thumb: W + "emperor-penguin/sticker.png", hover: W + "emperor-penguin/title.gif",
    canvas: "100 × 100 px",
    badges: { zh: ["85 格動畫"], en: ["85 frames"] },
    modules: [
      { type: "player", sheet: W + "emperor-penguin/title-sheet.png", w: 100, h: 100, cols: 10, n: 85, durations: Array(85).fill(100),
        caption: { zh: "標題動畫・85 格", en: "Title animation · 85 frames" } },
      { type: "player", sheet: W + "emperor-penguin/bounce-sheet.png", w: 100, h: 100, cols: 15, n: 15, durations: Array(15).fill(100), bg: "#3AAEE6",
        caption: { zh: "角色彈跳・15 格", en: "Bounce · 15 frames" } },
      { type: "image", src: W + "emperor-penguin/sticker.png", pixel: true, caption: { zh: "貼圖版本", en: "Sticker" } }
    ]
  },
  {
    id: "xmas-cursor", year: 2025, cats: ["ui", "asset", "character"],
    tools: ["AniFX"],
    bg: "#E6F3FB",
    title: { zh: "聖誕企鵝鼠標", en: "Christmas Penguin Cursors" },
    desc: { zh: "受女友委託的客製化鼠標，我到現在自己也還在用，覺得不錯", en: "Custom cursors commissioned by my girlfriend. I still use them myself — they hold up well." },
    thumbGrid: ["01-normal", "14-link", "04-busy", "05-precision"].map(n => W + "xmas-cursor/" + n + "@1x.png"),
    canvas: "64 × 64 px × 15",
    badges: { zh: ["可試用"], en: ["Try it"] },
    modules: [ { type: "cursors" } ]
  }
];

// 游標設定（熱點座標以 64px 圖為準）Cursor set — hotspots in 64px coordinates
window.CURSORS = [
  { file: "01-normal",      zh: "標準選取", en: "Normal",        hot: [2, 2],   css: "default" },
  { file: "02-help",        zh: "說明選取", en: "Help",          hot: [2, 2],   css: "help" },
  { file: "03-progress",    zh: "背景作業", en: "Working",       hot: [2, 2],   css: "progress" },
  { file: "04-busy",        zh: "忙碌中",   en: "Busy",          hot: [10, 12], css: "wait" },
  { file: "05-precision",   zh: "精確選取", en: "Precision",     hot: [11, 13], css: "crosshair" },
  { file: "06-text",        zh: "選取文字", en: "Text",          hot: [6, 14],  css: "text" },
  { file: "07-unavailable", zh: "無法使用", en: "Unavailable",   hot: [12, 12], css: "not-allowed" },
  { file: "08-ns-resize",   zh: "垂直調整", en: "Vertical",      hot: [32, 32], css: "ns-resize" },
  { file: "09-ew-resize",   zh: "水平調整", en: "Horizontal",    hot: [32, 32], css: "ew-resize" },
  { file: "10-nwse-resize", zh: "對角調整 1", en: "Diagonal 1",  hot: [32, 32], css: "nwse-resize" },
  { file: "11-nesw-resize", zh: "對角調整 2", en: "Diagonal 2",  hot: [32, 32], css: "nesw-resize" },
  { file: "12-move",        zh: "移動",     en: "Move",          hot: [32, 32], css: "move" },
  { file: "13-alternate",   zh: "其他選取", en: "Alternate",     hot: [9, 1],   css: "default" },
  { file: "14-link",        zh: "連結選取", en: "Link",          hot: [9, 1],   css: "pointer" },
  { file: "15-handwriting", zh: "手寫",     en: "Handwriting",   hot: [1, 1],   css: "default" }
];
