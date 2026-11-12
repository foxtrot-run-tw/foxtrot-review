/* Fox Trot 審查頁資料。
 * 把新物件 append 進 FOX_TROT_DAYS 後，執行 python3 scripts/build_review_site.py。
 * 每則需有 reviewId（FT-001 起編）、status（pending/approved/returned）、version、
 * plannedPublishDate、reviewHistory。沒有 type 時預設為 "daily-5"。
 * 完整欄位說明見 README.md 與 docs/作業規範.md。
 */
window.FOX_TROT_DAYS = [
  {
    "id": "2026-11-12-ig-carousel",
    "type": "ig-carousel",
    "date": "2026-11-12",
    "cycle": "A",
    "cycleLabel": "傷害預防與恢復",
    "topic": "新手跑者常見的 5 個傷害警訊",
    "summary": "Instagram 八張輪播預覽：封面「這 5 種痛，別硬跑」，加上五個警訊、檢查清單與行動呼籲。僅供審查，尚未發布至任何社群平台。",
    "displayName": "Fox Trot",
    "handle": "foxtrot",
    "images": {
      "avatar": {
        "src": "images/2026-11-11/avatar.jpg",
        "alt": "Fox Trot 頭像：河堤與水塔場景裁切，無人入鏡",
        "ratio": "1:1"
      }
    },
    "slides": [
      {
        "src": "images/carousel-01/slide-01.jpg",
        "alt": "公園紅色跑道上，一名跑者停下，半身特寫、臉不在畫面裡，一手按在膝蓋前側；圖上大標「這 5 種痛，別硬跑」，並提示往左滑。",
        "filename": "foxtrot-carousel-01-slide-01.jpg"
      },
      {
        "src": "images/carousel-01/slide-02.jpg",
        "alt": "紅色跑道側面特寫，膝下正在移動，步伐看起來不對稱、一腳較為小心；圖上寫「1/5 步伐走樣了」，並說明痛到跛或改跑姿時應先停下來。",
        "filename": "foxtrot-carousel-01-slide-02.jpg"
      },
      {
        "src": "images/carousel-01/slide-03.jpg",
        "alt": "坐下的跑者特寫，手指按在小腿脛骨上的一個點，沒有瘀青或傷口；圖上寫「2/5 按一個點就很痛」，提醒先停跑檢查，可能是骨骼壓力的警訊，但不能自行判定。",
        "filename": "foxtrot-carousel-01-slide-03.jpg"
      },
      {
        "src": "images/carousel-01/slide-04.jpg",
        "alt": "黃昏公園步道，一名跑者放慢停下，半身、臉不在畫面裡，一手按著膝蓋；圖上寫「3/5 愈跑愈痛」，說明跑當中愈來愈明顯或隔天還在痛時，應先減量或停跑。",
        "filename": "foxtrot-carousel-01-slide-04.jpg"
      },
      {
        "src": "images/carousel-01/slide-05.jpg",
        "alt": "夜晚家中，小腿與腳踝擱在枕頭上，上面放著未貼標的冰敷袋，燈光照著，腳踝沒有誇張腫脹；圖上寫「4/5 腫了，或晚上還痛」，建議盡快找醫師或物理治療師。",
        "filename": "foxtrot-carousel-01-slide-05.jpg"
      },
      {
        "src": "images/carousel-01/slide-06.jpg",
        "alt": "公園水泥階梯，一名跑者正在下樓，一手按在膝蓋前側，臉不在畫面裡；圖上寫「5/5 上下樓膝蓋前側痛」，提醒上下樓梯或蹲下不舒服時先不要硬跑，若持續請尋求評估。",
        "filename": "foxtrot-carousel-01-slide-06.jpg"
      },
      {
        "src": "images/carousel-01/slide-07.jpg",
        "alt": "公園木椅上，一名跑者坐下，雙手檢查自己的小腿，臉不在畫面裡；下方是五項警訊檢查清單，並寫「疼痛持續，請看醫師或物理治療師」。",
        "filename": "foxtrot-carousel-01-slide-07.jpg"
      },
      {
        "src": "images/carousel-01/slide-08.jpg",
        "alt": "清晨河濱步道，兩名跑者背對鏡頭並肩慢走收操；大標「先停一下，比硬跑完更厲害」，邀請收藏並分享給跑友，無帳號或連結。",
        "filename": "foxtrot-carousel-01-slide-08.jpg"
      }
    ],
    "contactSheet": {
      "src": "images/carousel-01/contact-sheet.jpg",
      "alt": "八張 4:5 輪播縮圖總覽，由左上到右下依序為封面與第 1 到第 8 張。",
      "filename": "foxtrot-carousel-01-contact-sheet.jpg"
    },
    "zip": {
      "src": "images/carousel-01/foxtrot-carousel-01.zip",
      "filename": "foxtrot-carousel-01.zip"
    },
    "caption": "痛一點再跑就會好？不一定。\n\n新手跑者最常踩的坑，不是速度不夠，是明明有警訊還硬跑。\n\n這 5 種情況，建議先停下來對一下：\n\n1. 痛到步伐走樣、開始跛了\n2. 骨頭上一個點按了就很痛\n3. 跑當中愈跑愈痛，或隔天還在痛\n4. 腫了，或休息、夜間還在痛\n5. 上下樓或蹲下時，膝蓋前側不舒服\n\n這不是診斷，也不是保證碰到就一定受傷。只是值得先停跑、值得檢查的警訊。\n\n疼痛持續，請看醫師或物理治療師。",
    "hashtags": [
      "#FoxTrot",
      "#跑步",
      "#傷害預防",
      "#新手跑者",
      "#路跑",
      "#台灣路跑",
      "#跑步訓練",
      "#慢跑生活",
      "#跑者日常",
      "#運動科學"
    ],
    "copyText": "痛一點再跑就會好？不一定。\n\n新手跑者最常踩的坑，不是速度不夠，是明明有警訊還硬跑。\n\n這 5 種情況，建議先停下來對一下：\n\n1. 痛到步伐走樣、開始跛了\n2. 骨頭上一個點按了就很痛\n3. 跑當中愈跑愈痛，或隔天還在痛\n4. 腫了，或休息、夜間還在痛\n5. 上下樓或蹲下時，膝蓋前側不舒服\n\n這不是診斷，也不是保證碰到就一定受傷。只是值得先停跑、值得檢查的警訊。\n\n疼痛持續，請看醫師或物理治療師。\n\n#FoxTrot #跑步 #傷害預防 #新手跑者 #路跑 #台灣路跑 #跑步訓練 #慢跑生活 #跑者日常 #運動科學",
    "sources": [
      {
        "title": "Knee pain and other running injuries",
        "authors": "",
        "outlet": "NHS",
        "url": "https://www.nhs.uk/live-well/exercise/knee-pain-and-other-running-injuries/",
        "note": "頁面載明 Page last reviewed: 25 November 2022。用於跑步相關膝痛與就醫時機的一般說明。"
      },
      {
        "title": "Injury prevention advice for runners",
        "outlet": "Newcastle Hospitals NHS Foundation Trust",
        "url": "https://www.newcastle-hospitals.nhs.uk/services/injury-prevention-advice-for-runners/",
        "note": "頁面載明 Page last updated: 04/02/2026。休息時仍痛、明顯腫脹或無法承重應就醫。"
      },
      {
        "title": "Stress fractures — Symptoms and causes",
        "outlet": "Mayo Clinic",
        "url": "https://www.mayoclinic.org/diseases-conditions/stress-fractures/symptoms-causes/syc-20354057",
        "note": "頁面載明 April 25, 2025。局部骨壓痛、活動後加重、休息或夜間仍痛與腫脹等描述。"
      },
      {
        "title": "Bone stress injuries and stress fractures: Advice and management",
        "authors": "Dr Ralph Smith, OxSport",
        "outlet": "Oxford University Hospitals NHS Foundation Trust",
        "url": "https://www.ouh.nhs.uk/media/wpdnexqu/86719fractures.pdf",
        "note": "單張載明 November 2026。局限骨頭壓痛與夜間痛等需儘快就醫的警訊。"
      },
      {
        "title": "Medial tibial stress syndrome",
        "outlet": "NHS Greater Glasgow and Clyde, Right Decisions",
        "url": "https://www.rightdecisions.scot.nhs.uk/ggc-msk-foot-and-ankle/lower-leg/medial-tibial-stress-syndrome",
        "note": "頁面載明 Last reviewed: 20/01/2026。點狀骨壓痛應先視為壓力性骨折直到被排除；文案只寫「可能是骨骼壓力的警訊，不是自己能判定的」。"
      },
      {
        "title": "When Is It Safe to Run? Applying Four Pain Rules to Running Participation",
        "authors": "Vincent HK, Vincent KR",
        "outlet": "Current Sports Medicine Reports. 2017;16(3):122",
        "url": "https://pmr.med.ufl.edu/wordpress/files/2022/09/Four-pain-rules-to-running-participation.pdf",
        "note": "打開的是此 PDF。跛行或代償步態應減量或停止；跑當中疼痛加重應立即減量或停止；關節痛不應在運動後 24 小時仍持續或加重。"
      },
      {
        "title": "Patellofemoral pain",
        "authors": "Crossley KM, Callaghan MJ, van Linschoten R",
        "outlet": "BMJ 2015;351:h3939",
        "url": "https://www.bmj.com/content/351/bmj.h3939",
        "note": "已打開該頁並讀到 bottom line 與書目資料；全文主體需登入，未打開完整內文。Bottom line：髕股疼痛常見為膝蓋後或周圍、與上下樓、蹲下、跑步等負荷動作相關。不寫成已確診「跑者膝」。"
      },
      {
        "title": "Stress Fractures",
        "outlet": "Cleveland Clinic",
        "url": "https://my.clevelandclinic.org/health/diseases/15841-stress-fractures",
        "note": "頁面載明 Medically Reviewed, last updated 05/23/2023。"
      },
      {
        "title": "Knee cap pain (patellofemoral joint pain) patient leaflet (PL938.1, March 2021)",
        "outlet": "King's College Hospital NHS Foundation Trust",
        "url": "https://www.kch.nhs.uk/wp-content/uploads/2023/01/pl-938.1-knee-cap-pain-patellofemoral-joint-pain.pdf",
        "note": "列出上下樓、蹲下、跑步為常見誘發動作。"
      }
    ],
    "selfCheck": [
      {
        "item": "傷害與醫療相關用詞",
        "result": "pass",
        "note": "五個項目都寫成值得先停跑、值得檢查的警訊，不做診斷、不保證碰到就一定受傷，也不承諾療效。各張與 caption 皆寫明疼痛持續應看醫師或物理治療師。"
      },
      {
        "item": "賽事資訊",
        "result": "na",
        "note": "本則為傷害警訊輪播，未列出任何賽事日期、地點或報名期限。"
      },
      {
        "item": "研究引用與結論分寸",
        "result": "pass",
        "note": "只列出真正打開過的網址。結論維持關聯與衛教警訊，不誇大成因或保證。BMJ 一文僅採用已讀到的 bottom line，並註明全文主體未打開。"
      },
      {
        "item": "圖片限制",
        "result": "pass",
        "note": "八張皆為 4:5（1080×1350），中文標題由程式以 Noto Sans CJK TC Bold 排字，重點字為橘色 #FF7A1A。臉不在畫面裡或僅見後腦；無真實或虛構 logo、無可讀招牌文字、無誇張傷勢或腫脹。已在完整尺寸與 360px 檢查手、腳與鞋面。第 2 張是跑道側面正在移動的步伐，但跛行幅度較含蓄，不是非常明顯的一腳代償。"
      },
      {
        "item": "是否依平台調整",
        "result": "na",
        "note": "本則是 Instagram 輪播實驗，只做 IG 八張＋caption 與 hashtag，沒有 Threads、Facebook、LinkedIn 或 X 版本。"
      },
      {
        "item": "場景季節要對",
        "result": "pass",
        "note": "八張場景為跑道、公園步道、夜間室內、階梯、河濱等，沒有用錯季節的農作或花卉；無宜蘭水田插秧畫面。"
      },
      {
        "item": "不連結個人帳號",
        "result": "pass",
        "note": "來源皆為官方機構、醫院或已發表研究，沒有列出個人社群帳號或一般人貼文連結。"
      }
    ],
    "reviewId": "FT-003",
    "status": "pending",
    "version": 4,
    "plannedPublishDate": "2026-11-12",
    "reviewHistory": [
      {
        "at": "2026-11-12",
        "version": 1,
        "status": "pending",
        "note": "對話預覽第一版：建立八張與文案，第 3、7、8 張偏文字版型，有照片重複使用。尚未上審查站。"
      },
      {
        "at": "2026-11-12",
        "version": 2,
        "status": "pending",
        "note": "對話預覽第二版：全部改回上圖下文，各張改用獨立照片。尚未上審查站。"
      },
      {
        "at": "2026-11-12",
        "version": 3,
        "status": "pending",
        "note": "對話預覽第三版：改掉畫錯的河堤、拿掉無關舊公寓、變化構圖。圖片風格在此版通過。尚未上審查站。"
      },
      {
        "at": "2026-11-12",
        "version": 4,
        "status": "pending",
        "note": "第四版讓每張照片對上各自文案後，首次上審查站，狀態為待審。此次補上審查編號與作業規範欄位，圖文內容與第四版相同。"
      }
    ]
  },
  {
    "date": "2026-11-12",
    "cycle": "B",
    "cycleLabel": "賽事資訊",
    "title": "報名季到了，先挑「跑得完」的那場：四場台灣賽事截止日整理",
    "topic": "報名季到了，先挑跑得完的：四場台灣賽事報名時程",
    "summary": "整理宜蘭四季絕代雙礁馬（11/15 截止）、高樹六堆騰飛馬（11/15 開報）、臺北國道馬（1/7 截止）、杏輝宜蘭馬（12/15 截止）的日期、地點與報名期限，皆於 11/12 核對官方頁。",
    "charCounts": {
      "threads": 252,
      "x": 56
    },
    "images": {
      "avatar": {
        "src": "images/2026-11-12/avatar.jpg",
        "alt": "與當日配圖同一場景的裁切：11 月霧中山脈與檳榔樹，無人入鏡。",
        "ratio": "1:1"
      },
      "ig": {
        "src": "images/2026-11-12/ig-4x5.jpg",
        "alt": "11 月宜蘭休耕期的農路，兩側是收割後的褐色稻株與泥濘田面，沒有剛插的綠秧；一名綁馬尾的休閒跑者背對鏡頭在遠處慢跑，遠方是霧中山脈、檳榔樹與農舍；圖上標題為「報名季到了，先挑跑得完的」。",
        "ratio": "4:5"
      },
      "wide": {
        "src": "images/2026-11-12/wide-16x9.jpg",
        "alt": "11 月宜蘭休耕期的田間土路，兩側是收割後的褐色稻田，一名休閒跑者背對鏡頭在畫面右側慢跑，遠方是霧中山脈與檳榔樹；圖上標題為「報名季到了，先挑跑得完的」。",
        "ratio": "16:9"
      },
      "square": {
        "src": "images/2026-11-12/square-1x1.jpg",
        "alt": "11 月宜蘭休耕期的農路，兩側是收割後的褐色稻田，一名綁馬尾的休閒跑者背對鏡頭慢跑，遠方是霧中山脈、檳榔樹與農舍；圖上標題為「報名季到了，先挑跑得完的」。",
        "ratio": "1:1"
      }
    },
    "posts": {
      "threads": {
        "platform": "Threads",
        "handle": "foxtrot",
        "displayName": "Fox Trot",
        "imageKey": "square",
        "text": "報名季開跑，你的行事曆是不是又開始失控？🦊\n\n先幫你整理四場台灣賽事（11/12 核對官方報名頁）：\n・宜蘭四季絕代雙礁馬（1/10）：11/15 23:59 截止，有 4K 親子組\n・高樹六堆騰飛馬（2/27）：11/15 中午 12:00 才開報\n・臺北國道馬（3/7）：報到 1/7 17:00，全馬有成績門檻，半馬一般跑者可報\n・杏輝宜蘭馬（4/10）：12/15 截止，有 5K、11K\n\nFox Trot 小原則：先挑跑得完的，再挑拍照好看的。\n你明年第一場想跑哪一場？還是先從 5K 暖身？",
        "copyText": "報名季開跑，你的行事曆是不是又開始失控？🦊\n\n先幫你整理四場台灣賽事（11/12 核對官方報名頁）：\n・宜蘭四季絕代雙礁馬（1/10）：11/15 23:59 截止，有 4K 親子組\n・高樹六堆騰飛馬（2/27）：11/15 中午 12:00 才開報\n・臺北國道馬（3/7）：報到 1/7 17:00，全馬有成績門檻，半馬一般跑者可報\n・杏輝宜蘭馬（4/10）：12/15 截止，有 5K、11K\n\nFox Trot 小原則：先挑跑得完的，再挑拍照好看的。\n你明年第一場想跑哪一場？還是先從 5K 暖身？"
      },
      "instagram": {
        "platform": "Instagram",
        "handle": "foxtrot",
        "displayName": "Fox Trot",
        "imageKey": "ig",
        "caption": "報名季到了，先挑跑得完的 🏃‍♀️\n\n四場台灣賽事，截止日幫你排好：\n📍 1/10 宜蘭四季絕代雙礁馬｜11/15 23:59 截止\n📍 2/27 屏東高樹六堆騰飛馬｜11/15 12:00 開報\n📍 3/7 臺北國道馬｜1/7 17:00 截止（全馬有成績門檻）\n📍 4/10 杏輝宜蘭馬｜12/15 截止\n\n資訊於 11/12 核對官方報名頁，報名前請再以官方公告為準。\n跑得久，比跑得快更重要。先存起來，別讓截止日偷跑 🦊",
        "hashtags": [
          "#FoxTrot",
          "#跑步",
          "#路跑",
          "#馬拉松",
          "#台灣賽事",
          "#賽事報名",
          "#宜蘭",
          "#慢跑日常"
        ],
        "copyText": "報名季到了，先挑跑得完的 🏃‍♀️\n\n四場台灣賽事，截止日幫你排好：\n📍 1/10 宜蘭四季絕代雙礁馬｜11/15 23:59 截止\n📍 2/27 屏東高樹六堆騰飛馬｜11/15 12:00 開報\n📍 3/7 臺北國道馬｜1/7 17:00 截止（全馬有成績門檻）\n📍 4/10 杏輝宜蘭馬｜12/15 截止\n\n資訊於 11/12 核對官方報名頁，報名前請再以官方公告為準。\n跑得久，比跑得快更重要。先存起來，別讓截止日偷跑 🦊\n\n#FoxTrot #跑步 #路跑 #馬拉松 #台灣賽事 #賽事報名 #宜蘭 #慢跑日常"
      },
      "facebook": {
        "platform": "Facebook",
        "displayName": "Fox Trot",
        "imageKey": "wide",
        "text": "【年底報名季｜四場台灣賽事截止日整理】\n\n跑友最怕的不是早起，是那句「欸，截止了？」😱\nFox Trot 把近期四場賽事整理好了（2026/11/12 核對官方報名頁）：\n\n1️⃣ 宜蘭四季絕代雙礁馬拉松｜2027/1/10（日）宜蘭窯烤山寨村\n報名至 11/15 23:59 或額滿｜42K、21K、10K、4K 親子組\n\n2️⃣ 耀動高樹六堆騰飛馬拉松｜2027/2/27（六）屏東高樹新豐親水公園\n11/15 12:00 開放報名｜42.195K、22K、10K、5K\n\n3️⃣ 南山人壽臺北國道馬拉松｜2027/3/7（日）中山高五股－汐止高架段\n報名至 2027/1/7 17:00，額滿提前截止｜全馬有成績門檻，半馬和四人接力一般跑者可報\n\n4️⃣ 杏輝宜蘭馬拉松｜2027/4/10（六）宜蘭運動公園\n報名至 12/15｜42K、21K、11K、5K\n\n按下報名前，先問三題：限時跑得完嗎？清晨交通搞得定嗎？退費規定看了嗎？\n\n跑得久，比跑得快更重要。標記那個每年都說「明年一定報」的朋友，這次一起把第一場排進行事曆。資訊以官方公告為準。",
        "copyText": "【年底報名季｜四場台灣賽事截止日整理】\n\n跑友最怕的不是早起，是那句「欸，截止了？」😱\nFox Trot 把近期四場賽事整理好了（2026/11/12 核對官方報名頁）：\n\n1️⃣ 宜蘭四季絕代雙礁馬拉松｜2027/1/10（日）宜蘭窯烤山寨村\n報名至 11/15 23:59 或額滿｜42K、21K、10K、4K 親子組\n\n2️⃣ 耀動高樹六堆騰飛馬拉松｜2027/2/27（六）屏東高樹新豐親水公園\n11/15 12:00 開放報名｜42.195K、22K、10K、5K\n\n3️⃣ 南山人壽臺北國道馬拉松｜2027/3/7（日）中山高五股－汐止高架段\n報名至 2027/1/7 17:00，額滿提前截止｜全馬有成績門檻，半馬和四人接力一般跑者可報\n\n4️⃣ 杏輝宜蘭馬拉松｜2027/4/10（六）宜蘭運動公園\n報名至 12/15｜42K、21K、11K、5K\n\n按下報名前，先問三題：限時跑得完嗎？清晨交通搞得定嗎？退費規定看了嗎？\n\n跑得久，比跑得快更重要。標記那個每年都說「明年一定報」的朋友，這次一起把第一場排進行事曆。資訊以官方公告為準。"
      },
      "linkedin": {
        "platform": "LinkedIn",
        "displayName": "Fox Trot",
        "subtitle": "虛構跑步品牌",
        "imageKey": "wide",
        "text": "上班族的年度目標，常卡在一句「等我有空再報名」。\n但賽事報名其實跟專案一樣：先定截止日，進度才排得出來。\n\n近期幾場台灣賽事的報名時程（2026/11/12 核對官方報名頁）：\n・宜蘭四季絕代雙礁馬拉松（2027/1/10）：報名至 2026/11/15 23:59\n・耀動高樹六堆騰飛馬拉松（2027/2/27）：2026/11/15 12:00 開放報名\n・南山人壽臺北國道馬拉松（2027/3/7）：報名至 2027/1/7 17:00；全馬設成績門檻，另有限同一公司組隊的「健康企業組」四人接力\n・杏輝宜蘭馬拉松（2027/4/10）：報名至 2026/12/15\n\n給忙碌工作者的三個排程建議：\n1. 比賽日期避開工作旺季，賽前那幾週才不會訓練和加班互搶時間。\n2. 選一個用你平日穩定能練的時間就準備得來的距離，而不是最有面子的距離。\n3. 把報名和訓練寫進行事曆，當成跟自己開的會。\n\nFox Trot 相信：跑得久，比跑得快更重要。職涯如此，跑步也是。\n你們公司有跑團嗎？還是你是辦公室唯一的跑者？",
        "copyText": "上班族的年度目標，常卡在一句「等我有空再報名」。\n但賽事報名其實跟專案一樣：先定截止日，進度才排得出來。\n\n近期幾場台灣賽事的報名時程（2026/11/12 核對官方報名頁）：\n・宜蘭四季絕代雙礁馬拉松（2027/1/10）：報名至 2026/11/15 23:59\n・耀動高樹六堆騰飛馬拉松（2027/2/27）：2026/11/15 12:00 開放報名\n・南山人壽臺北國道馬拉松（2027/3/7）：報名至 2027/1/7 17:00；全馬設成績門檻，另有限同一公司組隊的「健康企業組」四人接力\n・杏輝宜蘭馬拉松（2027/4/10）：報名至 2026/12/15\n\n給忙碌工作者的三個排程建議：\n1. 比賽日期避開工作旺季，賽前那幾週才不會訓練和加班互搶時間。\n2. 選一個用你平日穩定能練的時間就準備得來的距離，而不是最有面子的距離。\n3. 把報名和訓練寫進行事曆，當成跟自己開的會。\n\nFox Trot 相信：跑得久，比跑得快更重要。職涯如此，跑步也是。\n你們公司有跑團嗎？還是你是辦公室唯一的跑者？"
      },
      "x": {
        "platform": "X",
        "handle": "FoxTrot",
        "displayName": "Fox Trot",
        "imageKey": "square",
        "text": "報名季到了，先挑跑得完的🦊\n1/10 宜蘭雙礁馬：11/15 23:59 截止\n2/27 高樹六堆馬：11/15 中午開報\n3/7 臺北國道馬：1/7 截止，全馬有門檻\n4/10 杏輝宜蘭馬：12/15 截止\n以官方頁為準，你衝哪場？",
        "copyText": "報名季到了，先挑跑得完的🦊\n1/10 宜蘭雙礁馬：11/15 23:59 截止\n2/27 高樹六堆馬：11/15 中午開報\n3/7 臺北國道馬：1/7 截止，全馬有門檻\n4/10 杏輝宜蘭馬：12/15 截止\n以官方頁為準，你衝哪場？"
      }
    },
    "sources": [
      {
        "title": "2027宜蘭四季絕代雙礁馬拉松 活動簡章與報名頁",
        "outlet": "iRunner 筆記報名（主辦：宜蘭縣四季健跑會）",
        "url": "https://irunner.biji.co/Yilan2027",
        "note": "核對賽事日期 2027-01-10、地點宜蘭窯烤山寨村、報名至 2026-11-15 23:59 或額滿、組別與報名費、晶片押金。"
      },
      {
        "title": "2027耀動高樹六堆騰飛馬拉松 報名頁",
        "outlet": "一起報名! 活動報名系統",
        "url": "https://www.joinnow.com.tw/run-step1.php?cnt_id=154",
        "note": "核對日期 2027-02-27、地點屏東縣高樹鄉新豐親水公園、2026-11-15 12:00 開放報名、組別與報名費。頁面未列報名截止日，文中已註明。"
      },
      {
        "title": "南山人壽臺北國道馬拉松 競賽規程（全馬／半馬）",
        "outlet": "臺北國道馬拉松官網（主辦：中華民國路跑協會）",
        "url": "https://www.taipeifreewaymarathon.com/pages.php?id=2",
        "note": "核對日期 2027-03-07、地點中山高速公路五股－汐止高架段、報名 2026-11-10 14:00 至 2027-01-07 17:00、全馬成績門檻、半馬報名費與限時。"
      },
      {
        "title": "南山人壽臺北國道馬拉松 四人驅動接力組規程",
        "outlet": "臺北國道馬拉松官網",
        "url": "https://www.taipeifreewaymarathon.com/pages.php?id=2&mcid=14",
        "note": "核對接力每棒約 5 公里、每隊 NT$4,200、第一棒須為女性、健康企業組限同公司組隊。"
      },
      {
        "title": "線上報名（報名截止時間一覽）",
        "outlet": "中華民國路跑協會",
        "url": "https://www.sportsnet.org.tw/online_reg.php",
        "note": "交叉核對國道馬三個組別報名截止 2027/01/07 17:00。"
      },
      {
        "title": "2027杏輝宜蘭馬拉松 官方活動頁",
        "outlet": "樂活報名網",
        "url": "https://lohasnet.tw/SinpharMarathon2027/",
        "note": "核對日期 2027-04-10、地點宜蘭運動公園、組別、報名費與限時。抓取時頁面「報名期間」欄位未顯示日期，截止日改以承辦單位公告為據。"
      },
      {
        "title": "2027杏輝宜蘭馬拉松 即日起開放報名",
        "outlet": "宜蘭縣體育總會（承辦單位）",
        "url": "https://sport.ilc.org.tw/archives/1148",
        "note": "報名截止日期 2026-12-15 的依據。"
      },
      {
        "title": "2026 臺北馬拉松 競賽規程",
        "outlet": "臺北馬拉松官網",
        "url": "https://www.taipeicitymarathon.com/REGULATION202612.php",
        "note": "核對 2026-12-20 舉行、一般跑者報名已於 7 月截止；文中只作補充提醒。"
      }
    ],
    "selfCheck": [
      {
        "item": "傷害與醫療相關用詞",
        "result": "pass",
        "note": "今日為賽事資訊，未做任何診斷或療效說法；只提醒依自身能力選距離與限時。"
      },
      {
        "item": "賽事資訊",
        "result": "pass",
        "note": "四場賽事的日期、地點、報名期限都在官方報名頁或承辦單位公告核對，並附官方連結。兩處不確定已明寫：高樹六堆官方頁未列截止日；杏輝宜蘭官網的報名期間欄位空白，截止日 12/15 取自承辦單位宜蘭縣體育總會公告。"
      },
      {
        "item": "研究引用與結論分寸",
        "result": "na",
        "note": "今日未引用研究。當週社群話題掃描沒有採用為來源，亦未列出個人帳號或一般人貼文連結。"
      },
      {
        "item": "圖片限制",
        "result": "pass",
        "note": "配圖已改為 11 月宜蘭休耕／收割後的褐色稻田農路，不再出現剛插的綠秧。單一跑者遠距離背影、臉不可辨識；完整尺寸檢查無 logo、無可讀文字、鞋與手腳正常。標題以 Noto Sans CJK TC Bold 程式排字，重點字為橘色 #FF7A1A，並通過 360px 可讀性檢查。"
      },
      {
        "item": "是否依平台調整",
        "result": "pass",
        "note": "本則為五個社群平台：Threads 口語條列並以提問作結；Instagram 為 4:5 圖＋短 caption＋hashtag；Facebook 為可轉分享的整理清單；LinkedIn 從上班族排程切入；X 只留四場截止日。已無網頁文章版本。"
      },
      {
        "item": "場景季節要對",
        "result": "pass",
        "note": "預定發布日為 11 月。宜蘭水田在 11 月為休耕期，配圖已改為收割後的褐色稻株、泥濘田面與霧中山脈，不再使用綠秧或剛插秧的畫面。"
      },
      {
        "item": "不連結個人帳號",
        "result": "pass",
        "note": "來源皆為官方報名頁或承辦單位公告，沒有個人社群帳號或一般人貼文連結。"
      }
    ],
    "reviewId": "FT-002",
    "type": "daily-5",
    "status": "pending",
    "version": 2,
    "plannedPublishDate": "2026-11-12",
    "reviewHistory": [
      {
        "at": "2026-11-12",
        "version": 1,
        "status": "pending",
        "note": "首次上審查站的版本（含當時的宜蘭水田配圖與六平台，含網頁文章）。"
      },
      {
        "at": "2026-11-12",
        "version": 2,
        "status": "pending",
        "note": "依審查回饋修改後回到待審：拿掉網頁文章，改為五平台；配圖改為 11 月宜蘭休耕／收割後水田（不再出現剛插的秧苗）；Facebook 文案不再指向已移除的網站文章。"
      }
    ]
  },
  {
    "date": "2026-11-11",
    "cycle": "A",
    "cycleLabel": "傷害預防與恢復",
    "title": "先別一次跑太遠：對照「最近 30 天最長那一跑」",
    "topic": "單次跑距不要突然跳太遠：對照最近 30 天最長的那一跑",
    "summary": "一篇大型觀察研究提醒：單次距離如果突然比自己最近 30 天最長的那一跑多出不少，過度使用傷害的風險會明顯比較高。這是研究看到的趨勢，不是保證。原始數據見來源附註。",
    "charCounts": {
      "threads": 148,
      "x": 72
    },
    "images": {
      "avatar": {
        "src": "images/2026-11-11/avatar.jpg",
        "alt": "與當日配圖同一場景的裁切：晨間台北河濱公寓與屋頂水塔，雨樹前景，無人入鏡",
        "ratio": "1:1"
      },
      "ig": {
        "src": "images/2026-11-11/ig-4x5.jpg",
        "alt": "清晨台北河堤步道，一名休閒跑者背對鏡頭慢跑，遠方是公寓、水塔與高架橋；圖上標題為「先別一次跑太遠」",
        "ratio": "4:5"
      },
      "wide": {
        "src": "images/2026-11-11/wide-16x9.jpg",
        "alt": "清晨台北河堤步道，一名休閒跑者背對鏡頭慢跑，遠方是公寓、水塔與高架橋；圖上標題為「先別一次跑太遠」",
        "ratio": "16:9"
      },
      "square": {
        "src": "images/2026-11-11/square-1x1.jpg",
        "alt": "清晨台北河堤步道，一名休閒跑者背對鏡頭慢跑，遠方是公寓、水塔與高架橋；圖上標題為「先別一次跑太遠」",
        "ratio": "1:1"
      }
    },
    "posts": {
      "threads": {
        "platform": "Threads",
        "handle": "foxtrot",
        "displayName": "Fox Trot",
        "imageKey": "square",
        "text": "最近常聽到人說「這一週跑量還好啊」。不過一篇大型觀察研究提醒：更該先看「這一趟」有沒有比最近 30 天最長的那一跑多太多。\n\n一次比自己近期最長距離突然多出一截，過度使用傷害的風險會明顯比較高。\n\n平日河濱跑 8 公里，週末突然去測半馬，最容易踩坑。想跑得久，先別一次跳太遠。\n\n你最近 30 天最長的那一跑，是幾公里？",
        "copyText": "最近常聽到人說「這一週跑量還好啊」。不過一篇大型觀察研究提醒：更該先看「這一趟」有沒有比最近 30 天最長的那一跑多太多。\n\n一次比自己近期最長距離突然多出一截，過度使用傷害的風險會明顯比較高。\n\n平日河濱跑 8 公里，週末突然去測半馬，最容易踩坑。想跑得久，先別一次跳太遠。\n\n你最近 30 天最長的那一跑，是幾公里？"
      },
      "instagram": {
        "platform": "Instagram",
        "handle": "foxtrot",
        "displayName": "Fox Trot",
        "imageKey": "ig",
        "caption": "週末手癢想一次加很長？先對一下你最近 30 天最長的那一跑。\n\n一篇大型觀察研究發現：單次距離如果突然比自己近期最長的那一跑多出不少，過度使用傷害的風險會明顯比較高。這不是魔法公式，只是一個很好用的對照。\n\nFox Trot 的提醒很單純：跑得久，比一次跑很遠更重要。\n\n若疼痛持續，請找醫師或物理治療師看看。",
        "hashtags": [
          "#FoxTrot",
          "#跑步",
          "#傷害預防",
          "#恢復",
          "#路跑",
          "#台灣路跑",
          "#跑步訓練",
          "#慢跑生活",
          "#跑者日常",
          "#運動科學"
        ],
        "copyText": "週末手癢想一次加很長？先對一下你最近 30 天最長的那一跑。\n\n一篇大型觀察研究發現：單次距離如果突然比自己近期最長的那一跑多出不少，過度使用傷害的風險會明顯比較高。這不是魔法公式，只是一個很好用的對照。\n\nFox Trot 的提醒很單純：跑得久，比一次跑很遠更重要。\n\n若疼痛持續，請找醫師或物理治療師看看。\n\n#FoxTrot #跑步 #傷害預防 #恢復 #路跑 #台灣路跑 #跑步訓練 #慢跑生活 #跑者日常 #運動科學"
      },
      "facebook": {
        "platform": "Facebook",
        "displayName": "Fox Trot",
        "imageKey": "wide",
        "text": "很多跑友習慣看「這一週跑了幾公里」。沒問題，但有一份大型觀察研究想補一句：也要看「這一趟」有沒有突然跳太遠。\n\n研究把這一趟的距離，拿去跟過去 30 天最長的那一跑比較。一次加太多，過度使用傷害的風險會明顯比較高。這是研究看到的趨勢，不是保證你這樣跑就一定怎樣。\n\n對在台灣平常日只能抽空跑的人特別有感：平日 5 到 8 公里沒問題，週末或年底賽事前突然去測 21 公里，就是典型的單次驟增。\n\n實用做法：先找出最近 30 天最長的一跑，下一趟先以大約加一成為參考，跑完後一兩天聽聽身體。疼痛如果持續，請看醫師或物理治療師。\n\n跑得久，比一次跑很遠更重要。覺得有用，就轉分享給那個最近很想「一次測很長」的跑友吧。",
        "copyText": "很多跑友習慣看「這一週跑了幾公里」。沒問題，但有一份大型觀察研究想補一句：也要看「這一趟」有沒有突然跳太遠。\n\n研究把這一趟的距離，拿去跟過去 30 天最長的那一跑比較。一次加太多，過度使用傷害的風險會明顯比較高。這是研究看到的趨勢，不是保證你這樣跑就一定怎樣。\n\n對在台灣平常日只能抽空跑的人特別有感：平日 5 到 8 公里沒問題，週末或年底賽事前突然去測 21 公里，就是典型的單次驟增。\n\n實用做法：先找出最近 30 天最長的一跑，下一趟先以大約加一成為參考，跑完後一兩天聽聽身體。疼痛如果持續，請看醫師或物理治療師。\n\n跑得久，比一次跑很遠更重要。覺得有用，就轉分享給那個最近很想「一次測很長」的跑友吧。"
      },
      "linkedin": {
        "platform": "LinkedIn",
        "displayName": "Fox Trot",
        "subtitle": "虛構跑步品牌",
        "imageKey": "wide",
        "text": "很多上班族跑者的訓練，其實長得很像專案進度：平日行程擠，把距離留到週末一次補齊。這在工作上叫趕工，在跑步裡，則可能是單次負荷跳太快。\n\n一篇大型觀察研究指出：跟「過去 30 天最長的那一跑」相比，單次距離突然加太多，跟較高的過度使用傷害風險有關。研究也提醒，不能只看一週總量看起來還好，還得留意單一趟有沒有被塞爆。\n\n這不是要大家丟掉週計畫，也不是保證照某個比例加量就不會受傷。若你是用跑步來維持長期工作與生活節奏的人，與其週末一次證明自己還行，不如讓身體跟得上你的行程。疼痛如果持續，請尋求醫師或物理治療師評估。\n\n跑得久，比一次跑很遠更重要。這件事，訓練和上班其實是同一套道理。",
        "copyText": "很多上班族跑者的訓練，其實長得很像專案進度：平日行程擠，把距離留到週末一次補齊。這在工作上叫趕工，在跑步裡，則可能是單次負荷跳太快。\n\n一篇大型觀察研究指出：跟「過去 30 天最長的那一跑」相比，單次距離突然加太多，跟較高的過度使用傷害風險有關。研究也提醒，不能只看一週總量看起來還好，還得留意單一趟有沒有被塞爆。\n\n這不是要大家丟掉週計畫，也不是保證照某個比例加量就不會受傷。若你是用跑步來維持長期工作與生活節奏的人，與其週末一次證明自己還行，不如讓身體跟得上你的行程。疼痛如果持續，請尋求醫師或物理治療師評估。\n\n跑得久，比一次跑很遠更重要。這件事，訓練和上班其實是同一套道理。"
      },
      "x": {
        "platform": "X",
        "handle": "FoxTrot",
        "displayName": "Fox Trot",
        "imageKey": "square",
        "text": "先別只看這一週跑量有沒有達標。一篇觀察研究提醒：這一趟若突然比近 30 天最長跑多出一截，過度使用傷害的風險會明顯比較高。想跑得久，先別一次跳太遠。",
        "copyText": "先別只看這一週跑量有沒有達標。一篇觀察研究提醒：這一趟若突然比近 30 天最長跑多出一截，過度使用傷害的風險會明顯比較高。想跑得久，先別一次跳太遠。"
      }
    },
    "sources": [
      {
        "title": "How much running is too much? Identifying high-risk running sessions in a 5200-person cohort study",
        "authors": "Frandsen, J. S. B. 等人",
        "outlet": "British Journal of Sports Medicine, 2025; 59:1203–1210",
        "url": "https://bjsm.bmj.com/content/59/17/1203",
        "note": "原始研究頁已打開並核對。觀察 5,205 名跑者、最長 18 個月，共 588,071 次跑步；約 35% 回報跑步相關傷害，其中約 72% 屬過度使用傷害。以「少於或最多增加 10%」為參考組：小幅驟增（超過 10% 到 30%）調整後危害比約 1.64（1.31–2.05）；中幅（超過 30% 到 100%）約 1.52（1.16–2.00）；大幅（增加超過一倍）約 2.28（1.50–3.48）。文案只寫成白話「風險明顯比較高」。這是關聯而非因果；作者亦指出即使只增加 10% 以內也不等於沒風險，預防效果仍待試驗確認。傷害為自我回報，研究為探索性觀察設計。同一研究裡 ACWR 與週跑量比並未呈現「週跑量增加就一定更高風險」。"
      },
      {
        "title": "跑步損傷預防：訓練負荷和單次訓練量激增如何影響損傷風險",
        "outlet": "Physiotutors（中文整理）",
        "url": "https://www.physiotutors.com/zh/research/running-injury-prevention/",
        "note": "同一篇 BJSM 研究的中文整理，並提醒應將結果作為指引而非僵化規則。"
      },
      {
        "title": "Running injuries often strike suddenly, not gradually",
        "outlet": "MedicalXpress／奧胡斯大學研究說明",
        "url": "https://medicalxpress.com/news/2025-07-injuries-suddenly-gradually-overuse.html",
        "note": "2025 年 7 月 7 日研究機構說明稿，協助核對研究背景與作者詮釋；非正式論文本文。"
      },
      {
        "title": "備戰馬拉松跑量勿驟增 恢復不足關節容易受傷",
        "outlet": "《聯合早報》訪談 Alps Orthopaedic Centre 陳永強醫師",
        "url": "https://www.zaobao.com.sg/lifestyle/health/story20261027-9787622",
        "note": "2026 年 10 月 27 日訪談。用來補充「恢復是訓練的一部分」「肌肉酸痛常見、關節疼痛持續則不宜忽視」的臨床提醒，並非同一項研究。原文為新加坡情境。"
      },
      {
        "title": "跑得更遠、更安全：最新研究告訴你如何有效預防跑步傷害",
        "outlet": "吳易澄醫師｜運動醫學（整理 Translational Sports Medicine 2025 範圍性回顧）",
        "url": "https://blog.sportsmedicine.tw/2025/04/runningrelatedinjury%20.html",
        "note": "台灣運動醫學醫師對傷害預防策略回顧的整理，強調沒有單一解方、需個人化。今日主文未引用其中未經原文核對的具體百分比。"
      }
    ],
    "selfCheck": [
      {
        "item": "傷害與醫療相關用詞",
        "result": "pass",
        "note": "全文不做診斷、不保證療效或「照某個比例加量就不會受傷」。傷害相關平台保留「疼痛持續請看醫師或物理治療師」。因果免責只在 Facebook 用口語說一次（「這是研究看到的趨勢，不是保證你這樣跑就一定怎樣」），各平台不再重複同一句「觀察關聯，非因果」。"
      },
      {
        "item": "賽事資訊",
        "result": "na",
        "note": "今日為 A 日（傷害預防與恢復），未列出任何賽事日期、地點或報名期限。"
      },
      {
        "item": "研究引用與結論分寸",
        "result": "pass",
        "note": "主證據已打開並核對 BJSM 原文頁。樣本數、危害比與信賴區間只寫在本則來源附註，不寫進五則貼文。貼文改用白話「風險明顯比較高」。關聯而非保證。當週社群上雖有人討論跑量，僅作話題觀察，不列帳號、不附連結。"
      },
      {
        "item": "圖片限制",
        "result": "pass",
        "note": "配圖為 AI 生成的寫實紀實風格照片（清晨台北河堤步道；人物僅從背後、中遠距離入鏡，臉不可辨識），不是孔版插畫，也未使用他人照片。中文標語以 Noto Sans CJK TC Bold 由程式排在深色新聞卡上，重點字「跑太遠」為橘色 #FF7A1A。目視檢查：無真實或虛構的品牌 logo（含鞋、衣服、招牌、機車），無他人可辨識臉孔。Instagram 4:5，另有 16:9、1:1；頭像為同一場景的公寓與水塔裁切、無人入鏡。並通過寬邊 360px 可讀性檢查。"
      },
      {
        "item": "是否依平台調整",
        "result": "pass",
        "note": "本則為五個社群平台，已無網頁文章。Threads 口語並以提問作結；Instagram 為 4:5 圖＋caption＋hashtag；Facebook 偏轉分享並承擔本則唯一的口語免責；LinkedIn 從上班族趕工切入；X 只留核心提醒。"
      },
      {
        "item": "場景季節要對",
        "result": "pass",
        "note": "配圖為清晨河堤步道與樹木，沒有用錯季節的農作或花卉畫面。"
      },
      {
        "item": "不連結個人帳號",
        "result": "pass",
        "note": "已從來源清單移除兩則 X 一般人貼文。現有來源為期刊、機構說明、媒體訪談與專業整理，沒有個人帳號連結。"
      }
    ],
    "reviewId": "FT-001",
    "type": "daily-5",
    "status": "pending",
    "version": 2,
    "plannedPublishDate": "2026-11-11",
    "reviewHistory": [
      {
        "at": "2026-11-11",
        "version": 1,
        "status": "pending",
        "note": "首次上審查站的版本（六平台含網頁文章；貼文裡寫有樣本數與危害比等原始數據；來源清單含兩則 X 一般人貼文）。此前在對話中還經過圖片風格與橘色調整，那些不算審查站上的版次。"
      },
      {
        "at": "2026-11-12",
        "version": 2,
        "status": "pending",
        "note": "依審查回饋修改後回到待審：拿掉網頁文章，改為五平台；貼文改寫成白話，危害比、信賴區間與樣本數等原始數據移到來源附註；免責改為只在 Facebook 用口語說一次；從來源清單移除兩則 X 一般人貼文。"
      }
    ]
  }
];
