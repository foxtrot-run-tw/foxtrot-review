# Fox Trot 審查頁

虛構跑步品牌 **Fox Trot**（中間分開、只用英文名稱）的社群內容審查頁。這是靜態網站，頁面由腳本事先生成 HTML，不依賴外部套件，可直接放上 GitHub Pages。

本站只供內部品質控制，**不會、也不應把內容發布到任何社群平台**。各頁已加上 `<meta name="robots" content="noindex">`。

站點結構：

- `index.html`：首頁。品牌核心策略、主題規劃，以及依日期排列的貼文目錄。
- `posts/*.html`：每一則貼文的獨立頁（文案、圖、資料來源、該則自我檢查）。
- `quality.html`：整體品質把關原則。
- `workflow.html`：工作流程、工具、時間與改版紀錄。

正文都寫在靜態 HTML 裡，關掉 JavaScript 也讀得到。JavaScript 只負責複製按鈕、輪播左右切換，以及首頁目錄的版型篩選。

## 本機預覽

在專案根目錄執行：

```bash
python3 -m http.server 8080
```

然後打開 `http://localhost:8080/`。用檔案協定（`file://`）也能看版面，但複製文字可能被瀏覽器限制；若自動複製失敗，頁面會改開手動複製視窗。檢查時請順便關掉 JavaScript 看一次，確認目錄、貼文、來源與圖片都還在。

## 目錄

```
foxtrot-review/
  index.html                 # 首頁：策略、規劃、目錄
  quality.html               # 品質把關原則
  workflow.html              # 工作流程
  posts/                     # 各則貼文的獨立靜態頁（由腳本生成）
  css/style.css              # 品牌強調色為橘色 #FF7A1A
  js/site.js                 # 複製、輪播操作、目錄篩選與舊版 hash 轉址
  data/days.js               # 所有審查條目的資料來源
  data/content/              # 首頁引言、品質與流程頁的文案片段
  images/YYYY-MM-DD/         # 每日六平台配圖（ig-4x5、wide-16x9、square-1x1、avatar）
  images/carousel-01/        # IG 輪播定稿（slide-01.jpg…、contact-sheet.jpg、打包 zip）
  images/source/             # 已核准的紀實照片原圖，供組圖腳本重用
  scripts/build_review_site.py   # 生成首頁與各靜態頁；每次上線要改 ASSET_VERSION
  scripts/compose_news_cards.py  # 每日新聞卡組圖腳本（照片 + 程式排字）
  scripts/compose_carousel_01.py # IG 輪播組圖腳本
  README.md
```

## 怎麼新增一天

1. 依循環選主題：第一次是 A 日，之後 A → B → C → A……
   - A：傷害預防與恢復
   - B：賽事資訊（台灣近期可報名或即將舉行的路跑、越野賽）
   - C：訓練知識白話版
2. 依下方「圖片風格」用 `scripts/compose_news_cards.py` 產出配圖，放到 `images/YYYY-MM-DD/`。腳本會讀取 `images/source/` 裡已核准的照片，用程式排上標題。建議檔名：
   - `ig-4x5.jpg`：Instagram，**必須是 4:5**（1080×1350）
   - `wide-16x9.jpg`：Facebook、LinkedIn、網頁文章（1920×1080）
   - `square-1x1.jpg`：X、Threads（1080×1080）
   - `avatar.jpg`：站點小圖／favicon（可沿用同一張，或做成與當日照片一致的小裁切；不要出現可辨識的臉）
3. 打開 `data/days.js`，在 `window.FOX_TROT_DAYS = [ ... ]` 陣列追加一個物件。沒有寫 `type` 時，預設為 `daily-6`（每日六平台）。若是 Instagram 輪播，設 `type: "ig-carousel"` 並依下方輪播格式填資料。目錄會依 `date` 由新到舊排序，同一天則輪播排在六平台前面。
4. 用 `node --check data/days.js` 確認語法無誤。打開 `scripts/build_review_site.py`，把檔案開頭的 `ASSET_VERSION` 改成新值（例如日期加序號），再執行：

```bash
python3 scripts/build_review_site.py
```

腳本會重寫 `index.html`、`quality.html`、`workflow.html` 與 `posts/*.html`。生成的 HTML 請視為產出檔，不要手動改。本機開首頁與該則貼文頁檢查（含關掉 JavaScript）。CSS 與 JS 以 `?v=ASSET_VERSION` 做 cache-busting，所以每次要推上 GitHub Pages 都必須改版本號。

路徑一律用相對路徑（例如 `images/2026-11-11/ig-4x5.jpg`），這樣在 GitHub Pages 子路徑也能用。

## 一日資料格式

```js
{
  date: "2026-11-11",            // 必填，YYYY-MM-DD，台灣時區的當天
  cycle: "A",                    // A / B / C
  cycleLabel: "傷害預防與恢復",
  title: "網頁文章標題",
  topic: "當日主題短標，會顯示在日期標題",
  summary: "一兩句摘要，給審查頁日期區使用",
  charCounts: {                  // 可選，審查用字數
    webCjk: 829,
    webNoWhitespace: 1106,
    threads: 188,
    x: 95
  },
  images: {
    avatar: { src: "images/2026-11-11/avatar.jpg", alt: "……", ratio: "1:1" },
    ig:     { src: "images/2026-11-11/ig-4x5.jpg", alt: "……", ratio: "4:5" },
    wide:   { src: "images/2026-11-11/wide-16x9.jpg", alt: "……", ratio: "16:9" },
    square: { src: "images/2026-11-11/square-1x1.jpg", alt: "……", ratio: "1:1" }
  },
  posts: {
    web: {
      platform: "網頁",
      title: "……",
      dek: "導言",
      imageKey: "wide",
      sections: [
        { type: "p", text: "段落" },
        { type: "h", text: "小標" },
        { type: "ol", items: ["步驟一", "步驟二"] }
      ],
      copyText: "複製按鈕會複製的完整純文字"
    },
    threads:   { platform: "Threads", handle: "foxtrot", displayName: "Fox Trot", imageKey: "square", text: "……", copyText: "……" },
    instagram: { platform: "Instagram", handle: "foxtrot", displayName: "Fox Trot", imageKey: "ig", caption: "……", hashtags: ["#FoxTrot", "#跑步"], copyText: "caption + 空行 + hashtags" },
    facebook:  { platform: "Facebook", displayName: "Fox Trot", imageKey: "wide", text: "……", copyText: "……" },
    linkedin:  { platform: "LinkedIn", displayName: "Fox Trot", subtitle: "虛構跑步品牌", imageKey: "wide", text: "……", copyText: "……" },
    x:         { platform: "X", handle: "FoxTrot", displayName: "Fox Trot", imageKey: "square", text: "……", copyText: "……" }
  },
  sources: [
    { title: "來源標題", authors: "可選", outlet: "媒體或期刊", url: "https://……", note: "這筆來源怎麼用、有何限制" }
  ],
  selfCheck: [
    { item: "傷害與醫療相關用詞", result: "pass", note: "……" },  // result: pass | fail | na
    { item: "賽事資訊", result: "na", note: "A / C 日可標 N/A" },
    { item: "研究引用與結論分寸", result: "pass", note: "……" },
    { item: "圖片限制", result: "pass", note: "……" },
    { item: "六個平台版本是否依平台調整", result: "pass", note: "……" }
  ]
}
```

`imageKey` 必須對應到當天 `images` 裡的鍵（`ig`、`wide`、`square`、`avatar`）。


沒寫 `type` 時，該則視為 `daily-6`。同一個 `date` 可以同時有每日六平台與 IG 輪播兩則，不會互相覆蓋。輪播條目請加唯一的 `id`（例如 `2026-11-12-ig-carousel`），以免和當日六平台錨點衝突。

## 版型篩選與舊網址

首頁目錄有分段控制：**全部 / 每日六平台 / IG 輪播**，選項依資料裡實際出現的 `type` 產生。要加新版型時，在 `scripts/build_review_site.py` 的 `TYPE_META` 登錄，補上對應的頁面生成邏輯，並在 `data/days.js` 寫上 `type`。

舊的單頁 hash 仍盡量可用：

- `#all`：停在首頁目錄，顯示全部
- `#type=daily-6`、`#type=ig-carousel`：停在首頁，只顯示該版型
- `#2026-11-11`：若當天只有一則，會轉到該則獨立頁
- `#2026-11-12`：當天有兩則，留在目錄並只顯示當天
- `#type=ig-carousel&date=2026-11-12`：轉到該則獨立頁

也相容查詢字串，例如 `?type=ig-carousel`。新的分享連結請直接用各則頁面路徑，例如 `posts/2026-11-12-ig-carousel.html`。

## 怎麼新增一則 IG 輪播

1. 用 `scripts/compose_carousel_01.py`（或後續輪播腳本）產出 4:5、1080×1350 的幻燈片，目視檢查後複製到 `images/carousel-XX/`，檔名建議 `slide-01.jpg` 起跳，並附 `contact-sheet.jpg`。可再打一份 zip 方便「打包下載」。
2. 在 `data/days.js` 追加一筆，必要欄位如下：

```js
{
  id: "2026-11-12-ig-carousel",  // 必填，全站唯一
  type: "ig-carousel",
  date: "2026-11-12",
  cycle: "A",                    // 可選，用於循環標記
  cycleLabel: "傷害預防與恢復",
  topic: "輪播主題短標",
  summary: "一兩句摘要",
  displayName: "Fox Trot",
  handle: "foxtrot",
  images: {
    avatar: { src: "images/2026-11-11/avatar.jpg", alt: "……", ratio: "1:1" }
  },
  slides: [
    { src: "images/carousel-01/slide-01.jpg", alt: "第 1 張替代文字", filename: "foxtrot-carousel-01-slide-01.jpg" }
  ],
  contactSheet: { src: "images/carousel-01/contact-sheet.jpg", alt: "總覽", filename: "foxtrot-carousel-01-contact-sheet.jpg" },
  zip: { src: "images/carousel-01/foxtrot-carousel-01.zip", filename: "foxtrot-carousel-01.zip" },
  caption: "貼文文案",
  hashtags: ["#FoxTrot", "#跑步"],
  copyText: "caption + 空行 + hashtags",
  sources: [ /* 同每日格式，只列真正打開過的網址 */ ],
  selfCheck: [ /* 同每日五項檢查；本則若只有 IG，六平台那項可標 na */ ]
}
```

生成後，該則會出現在首頁目錄，並有獨立頁 `posts/YYYY-MM-DD-ig-carousel.html`。頁上有可左右滑動的 4:5 預覽、張數計數、上一張／下一張、每張下載、打包下載、總覽圖、可複製的 caption、hashtags、各張替代文字、來源與自我檢查。即使關掉 JavaScript，八張圖、文案與來源仍會出現在 HTML 裡。仍不得把內容發布到任何社群平台。

## 寫作與圖片規則（每天都要遵守）

- 品牌名稱固定寫成 **Fox Trot**，不要寫成 Foxtrot 或 FoxTrot（帳號 handle 除外）。
- 語氣輕鬆、明快、簡潔有力、幽默；受眾是一般大眾到中輕度跑者；使用繁體中文與台灣用語。
- 定位句可使用：跑得久，比跑得快更重要。
- 傷害與醫療：不做診斷、不保證療效；疼痛持續要建議看醫師或物理治療師。
- 賽事資訊（B 日）：日期、地點、報名期限須核對官方頁，並附官方連結。
- 研究引用：附原始來源，結論不可誇大。只列出真正打開過的網址，不要編造數字。
- 圖片規則見下一節。產生後必須目視檢查，有問題就重產或改腳本。
- 六個平台版本要依平台改寫，不是同一篇剪短。
- 網頁正文目標 600–1000 個中文字；Threads 500 字元內；X 140 個中文字內；Instagram 附 5–10 個 hashtag。

## 審查頁卡片順序

每天一區內，**短的社群版本在最上面**，長文在最後，讓第一眼就能判斷內文好不好看、有沒有趣：

1. X
2. Threads
3. Instagram
4. Facebook
5. LinkedIn
6. 網頁文章（預設只顯示標題、導言與第一段，按「展開全文」才看完整文；「複製文字」仍複製全文）

資料來源與品質自我檢查放在六張卡片後面。這個順序寫在 `scripts/build_review_site.py` 的 `PLATFORM_ORDER`，不要改回長文在前。

## 圖片風格（未來每日預設沿用）

配圖採 **AI 生成的寫實紀實風照片**，再由程式排成新聞卡。場景盡量像真實台灣跑者會經過的地方（例如河堤自行車道、社區跑道、公園路徑或階梯、潮濕或帶薄霧的清晨與黃昏）。不要靠破舊公寓或雜亂街屋來「證明這是台灣」。不要 HDR、不要過亮過滑的皮膚、不要夢幻光暈。構圖可以半身、局部特寫或無人風景，不要連張都是全身背影。

新聞卡版面：

- 上方是照片，底部漸層接到深色面板。
- 超大粗體標題：白色主句 + **橘色**（`#FF7A1A`）關鍵詞。品牌強調色就是這個橘色，不要用紅色。
- 副標在 1080 寬至少約 **48px**（約為寬邊的 4%）；16:9（1920 寬）要等比放大，讓縮到 360px 寬時仍清楚。
- 頁腳在 1080 寬至少約 **36px**（16:9 同樣等比放大）：左側一枚很小的狐狸腳印記號，旁邊是純文字「Fox Trot」，不要 wordmark logo。
- 面板要留夠高度，讓副標與頁腳各佔一到兩行、不要互撞，也不要蓋住照片裡的人物主體。
- 「觀察關聯，非因果」這類研究分寸**不要做進圖裡**（字級放大後放不下）；寫在貼文 caption／正文。

人物（可用，但要保守）：

- 只從背後或中遠距離入鏡，臉不可清楚辨識，也不要長得像特定真人。
- 一或兩名一般休閒跑者即可，日常服裝與跑鞋，動作與比例要合理。
- 若多試幾次人物仍不自然，寧可改用更遠、更保守的構圖，或當日不用人物，不要硬用有問題的圖。

Logo 與文字：

- 照片裡不能有可讀文字，也不能有真實或虛構的品牌標誌，包括鞋側的 swoosh 類勾、條紋、衣服與招牌上的 logo、機車廠徽與牌面文字。
- **每張候選圖都要在完整尺寸檢查**：怪臉或怪手腳、多出來的肢體、融化的鞋子、克隆人、假字、品牌痕跡。有疑慮就捨棄，不要修掉 logo 再上稿。
- **標題必須用程式和盒上已安裝的 CJK 字型排字**（目前用 `Noto Sans CJK TC Bold`，`/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc` index 3），不要讓圖像模型生成文字。上字後核對用字正確，並把圖縮到寬邊約 360px（也可再看 540px）檢查是否仍清楚。長說明仍用 HTML／CSS。

製作方式：先用圖像模型產出紀實照片候選，挑過後放到 `images/source/`，再跑組圖腳本。

```bash
python3 scripts/compose_news_cards.py
```

## 品質原則與流程頁

整體把關標準在 `quality.html`，工作步驟、工具與改版紀錄在 `workflow.html`，都可以從首頁頂部導覽進入。各則貼文的資料來源與當則自我檢查只放在該則獨立頁，不堆在首頁。
