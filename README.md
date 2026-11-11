# Fox Trot 審查頁

虛構跑步品牌 **Fox Trot**（中間分開、只用英文名稱）的社群內容審查頁。這是靜態網站，沒有建置步驟，也不依賴外部套件，可直接放上 GitHub Pages。

本頁只供內部品質控制，**不會、也不應把內容發布到任何社群平台**。`index.html` 已加上 `<meta name="robots" content="noindex">`。

## 本機預覽

在專案根目錄執行：

```bash
python3 -m http.server 8080
```

然後打開 `http://localhost:8080/`。用檔案協定（`file://`）也能看版面，但複製文字可能被瀏覽器限制；若自動複製失敗，頁面會改開手動複製視窗。

## 目錄

```
foxtrot-review/
  index.html              # 單一固定入口
  css/style.css
  js/app.js               # 讀取資料、依日期排序與切換、渲染六張卡片
  data/days.js            # 所有日期的內容；新增一天只要 append 一筆
  images/YYYY-MM-DD/      # 該日配圖
  scripts/make_images.py  # 孔版風格配圖腳本，未來每日預設沿用
  README.md
```

## 怎麼新增一天

1. 依循環選主題：第一次是 A 日，之後 A → B → C → A……
   - A：傷害預防與恢復
   - B：賽事資訊（台灣近期可報名或即將舉行的路跑、越野賽）
   - C：訓練知識白話版
2. 依下方「圖片風格」用 `scripts/make_images.py` 產出配圖，放到 `images/YYYY-MM-DD/`。建議檔名：
   - `ig-4x5.jpg`：Instagram，**必須是 4:5**
   - `wide-16x9.jpg`：Facebook、LinkedIn、網頁文章
   - `square-1x1.jpg`：X、Threads
   - `avatar.jpg`：角色頭像（全站可沿用同一張，不必每天重做）
3. 打開 `data/days.js`，在 `window.FOX_TROT_DAYS = [ ... ]` 陣列**最前面或最後面**追加一個物件。頁面會依 `date` 由新到舊排序，不一定要手動排順序，但最新的放最上面較好檢查。
4. 用 `node --check data/days.js` 與 `node --check js/app.js` 確認語法無誤，再本機開頁檢查。第一眼應先看到短版社群貼文。

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

資料來源與品質自我檢查仍放在六張卡片後面。這個順序寫在 `js/app.js` 的 `PLATFORM_ORDER`，不要改回長文在前。

## 圖片風格（未來每日預設沿用）

預設不要用模型直接產「光滑、立體、漸層、風景很細」的插畫，AI 味會太重。配圖應是**手感明確的孔版／Risograph／類似刻印紙感**：

- 限定 2–4 色：紙色（米黃）、橙紅、深綠、深墨。不要再加一堆顏色。
- 大膽簡單色塊、背景極簡，不要夢幻光、不要 3D、不要細緻毛髮或寫實河濱。
- 加上紙紋與輕微套印偏移（顏色層稍微錯開一點點）。
- 狐狸角色要跨圖一致，語氣輕鬆、明快、有趣。
- 不要真實品牌 logo、不要他人照片、不要變形的鞋子或手腳；鞋子要看得出是簡單跑鞋，手用圓潤色塊、不要畫怪手指。
- **除頭像外，每張配圖都必須帶一句很短的繁體中文標題**（IG 4:5、1:1、16:9 皆要；`avatar.jpg` 不加字）。有人只看圖，圖本身就要能傳達當天的核心 hook。
- 標題原則：大約 12 個字以內、粗體、高對比、四周留夠空，三種比例都要一眼能讀。不要讓角色或裝飾壓到字。
- **必須用程式和盒上已安裝的 CJK 字型排字**（目前用 `Noto Sans CJK TC Bold`，`/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc` index 3），不要讓圖像模型生成文字。上字後核對用字正確，並把圖縮到寬邊約 360px 再檢查一次是否仍清楚。長說明仍用 HTML／CSS。

製作方式：沿用並改 `scripts/make_images.py`（用 Pillow 畫出色版、套紙紋與上字）。不要為了求快改回模型出圖，除非只是拿極簡草稿再由程式重組，且成品仍要通過目視、看起來像人手印的。產出後用 Read 或預覽檢查每一張，並做 360px 縮圖檢查。

```bash
python3 scripts/make_images.py
```

## 日期切換

審查頁上方「切換日期」可看單一日期，或選「全部日期（最新在上）」。網址可用 `#2026-11-11` 或 `#all` 深連結。
