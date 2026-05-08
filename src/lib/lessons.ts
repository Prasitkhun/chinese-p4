import { Lesson } from './db';

export enum ActivityType {
  LISTENING = 'listening',
  SPEAKING = 'speaking',
  QUIZ = 'quiz',
  LIBRARY = 'library'
}

export const LESSONS_DATA: Lesson[] = [
  {
    id: 10,
    title: "常用课堂指令",
    translation: "คำสั่งที่ใช้บ่อยในห้องเรียน (Common classroom commands)",
    pinyin: "Chángyòng kètáng zhǐlìng",
    illustration: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&h=400&fit=crop",
    keyConcepts: ["คำสั่งในห้องเรียน"],
    vocabFocus: ["คำสั่งที่ใช้ในห้องเรียน"],
    hideNumber: true,
    isSpecial: true,
    vocabulary: [
      { word: "上课", pinyin: "Shàngkè", translation: "เริ่มเรียน/เข้าเรียน (Class starts)", hint: "ใช้ตอนครูเริ่มคาบเรียน", icon: "🛎️" },
      { word: "起立", pinyin: "Qǐlì", translation: "ยืนขึ้น (Stand up)", hint: "ทำตรงข้ามกับนั่ง", icon: "🧍" },
      { word: "请坐", pinyin: "Qǐng zuò", translation: "เชิญนั่ง (Sit down please)", hint: "ครูพูดหลังจากให้ยืน", icon: "🪑" },
      { word: "请安静", pinyin: "Qǐng ānjìng", translation: "โปรดเงียบ (Please be quiet)", hint: "ใช้เมื่อนักเรียนเสียงดัง", icon: "🤫" },
      { word: "看黑板/老师/书", pinyin: "Kàn hēibǎn/lǎoshī/shū", translation: "ดูกระดาน/ครู/หนังสือ (Look at board/teacher/book)", hint: "มองไปที่สิ่งที่ครูชี้", icon: "🧑‍🏫" },
      { word: "注意听", pinyin: "Zhùyì tīng", translation: "ตั้งใจฟัง (Listen carefully)", hint: "ใช้หูฟังสิ่งที่ครูพูด", icon: "👂" },
      { word: "打开书, 第…页", pinyin: "Dǎkāi shū, dì…yè", translation: "เปิดหนังสือหน้า… (Open the book to page...)", hint: "เลือกเมื่อครูให้หาเนื้อหาในเล่ม", icon: "📖" },
      { word: "请举手", pinyin: "Qǐng jǔ shǒu", translation: "ยกมือ (Please raise your hand)", hint: "ทำเมื่อต้องการถามหรือตอบ", icon: "🙋" },
      { word: "请回答", pinyin: "Qǐng huídá", translation: "เชิญตอบคำถาม (Please answer)", hint: "ครูต้องการฟังคำตอบ", icon: "💬" },
      { word: "再说一遍", pinyin: "Zàishuō yíbiàn", translation: "พูดอีกครั้ง (Say it again)", hint: "ขอให้พูดซ้ำ", icon: "🔄" },
      { word: "慢慢说", pinyin: "Mànmàn shuō", translation: "พูดช้าๆ (Speak slowly)", hint: "ขอให้ลดความเร็วในการพูด", icon: "🐢" }
    ],
    dialogues: [
      { role: "Teacher", text: "上课！同学们好。", pinyin: "Shàngkè! Tóngxuémen hǎo.", translation: "เริ่มเรียน! สวัสดีนักเรียนทุกคน" },
      { role: "Students", text: "老师好！", pinyin: "Lǎoshī hǎo!", translation: "สวัสดีครับ/ค่ะ คุณครู" },
      { role: "Teacher", text: "请坐。请打开书。", pinyin: "Qǐng zuò. Qǐng dǎkāi shū.", translation: "เชิญนั่งค่ะ เปิดหนังสือด้วยนะจ๊ะ" }
    ],
    activities: [
      { id: 1001, title: "Classroom Commands", type: "vocabulary", label: "คำศัพท์", icon: "📖" }
    ]
  },
  {
    id: 11,
    title: "คลังคำศัพท์",
    translation: "บทเรียนพิเศษ: คลังคำศัพท์",
    pinyin: "Cílù",
    illustration: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=400&fit=crop",
    keyConcepts: ["รวบรวมคำศัพท์ทั้งหมดจากบทที่ 1-9"],
    vocabFocus: ["ทบทวนคำศัพท์"],
    hideNumber: true,
    isSpecial: true,
    vocabulary: [
      { word: "拔河", pinyin: "báhé", translation: "ชักเย่อ", page: 109, icon: "🪢" },
      { word: "办法", pinyin: "bànfǎ", translation: "วิธี / วิธีแก้ปัญหา", page: 124, icon: "💡" },
      { word: "棒", pinyin: "bàng", translation: "เก่ง / ยอดเยี่ยม", page: 124, icon: "👍" },
      { word: "报名", pinyin: "bàomíng", translation: "สมัคร / ลงชื่อ", page: 109, icon: "📝" },
      { word: "比较", pinyin: "bǐjiào", translation: "ค่อนข้าง", page: 125, icon: "⚖️" },
      { word: "比赛", pinyin: "bǐsài", translation: "การแข่งขัน", page: 109, icon: "🏆" },
      { word: "比如", pinyin: "bǐrú", translation: "ยกตัวอย่าง", page: 125, icon: "👉" },
      { word: "笔", pinyin: "bǐ", translation: "ปากกา", page: 140, icon: "🖊️" },
      { word: "笔记本", pinyin: "bǐjìběn", translation: "สมุดบันทึก", page: 141, icon: "📔" },
      { word: "毕业", pinyin: "bìyè", translation: "เรียนจบ", page: 156, icon: "🎓" },
      { word: "饼", pinyin: "bǐng", translation: "ขนมเปี๊ยะ / แพนเค้ก", page: 156, icon: "🫓" },
      { word: "丙", pinyin: "bǐng", translation: "ลำดับที่ 3", page: 156, icon: "3️⃣" },
      { word: "擦", pinyin: "cā", translation: "เช็ด", page: 141, icon: "🧽" },
      { word: "猜", pinyin: "cāi", translation: "ทาย", page: 156, icon: "❓" },
      { word: "参加", pinyin: "cānjiā", translation: "เข้าร่วม", page: 109, icon: "🤝" },
      { word: "餐厅", pinyin: "cāntīng", translation: "ห้องอาหาร", page: 141, icon: "🍴" },
      { word: "草", pinyin: "cǎo", translation: "หญ้า", page: 125, icon: "🌱" },
      { word: "层", pinyin: "céng", translation: "ชั้น", page: 141, icon: "📶" },
      { word: "插", pinyin: "chā", translation: "เสียบ", page: 141, icon: "🔌" },
      { word: "查", pinyin: "chá", translation: "ตรวจสอบ", page: 125, icon: "🔍" },
      { word: "差", pinyin: "chà", translation: "ขาด / แย่", page: 125, icon: "👎" },
      { word: "常", pinyin: "cháng", translation: "บ่อย", page: 125, icon: "🔄" },
      { word: "场", pinyin: "chǎng", translation: "สนาม", page: 109, icon: "🏟️" },
      { word: "唱", pinyin: "chàng", translation: "ร้อง", page: 125, icon: "🎤" },
      { word: "朝", pinyin: "cháo", translation: "หันไปทาง", page: 156, icon: "🏹" },
      { word: "吵", pinyin: "chǎo", translation: "เสียงดัง / ทะเลาะ", page: 125, icon: "📢" },
      { word: "车", pinyin: "chē", translation: "รถ", page: 125, icon: "🚗" },
      { word: "衬衫", pinyin: "chènshān", translation: "เสื้อเชิ้ต", page: 141, icon: "👕" },
      { word: "成功", pinyin: "chénggōng", translation: "ประสบความสำเร็จ", page: 156, icon: "🏅" },
      { word: "成语", pinyin: "chéngyǔ", translation: "สำนวน", page: 156, icon: "📚" },
      { word: "诚实", pinyin: "chéngshí", translation: "ซื่อสัตย์", page: 156, icon: "😇" },
      { word: "吃", pinyin: "chī", translation: "กิน", page: 110, icon: "🍽️" },
      { word: "迟到", pinyin: "chídào", translation: "มาสาย", page: 125, icon: "⏰" },
      { word: "穿", pinyin: "chuān", translation: "สวม / ใส่", page: 142, icon: "🧥" },
      { word: "床", pinyin: "chuáng", translation: "เตียง", page: 142, icon: "🛏️" },
      { word: "吹", pinyin: "chuī", translation: "เป่า", page: 157, icon: "🌬️" },
      { word: "磁带", pinyin: "cídài", translation: "เทปคาสเซ็ท", page: 142, icon: "📼" },
      { word: "词典", pinyin: "cídiǎn", translation: "พจนานุกรม", page: 142, icon: "📖" },
      { word: "聪明", pinyin: "cōngming", translation: "ฉลาด", page: 126, icon: "🧠" },
      { word: "从", pinyin: "cóng", translation: "จาก", page: 126, icon: "🛫" },
      { word: "打", pinyin: "dǎ", translation: "ตี", page: 110, icon: "🥊" },
      { word: "大", pinyin: "dà", translation: "ใหญ่", page: 110, icon: "🐘" },
      { word: "大家", pinyin: "dàjiā", translation: "ทุกคน", page: 143, icon: "👥" },
      { word: "大连", pinyin: "Dàlián", translation: "เมืองต้าเหลียน", page: 157, icon: "🏙️" },
      { word: "大米", pinyin: "dàmǐ", translation: "ข้าวสาร", page: 157, icon: "🌾" },
      { word: "袋鼠", pinyin: "dàishǔ", translation: "จิงโจ้", page: 102, icon: "🦘" },
      { word: "代", pinyin: "dài", translation: "แทน", page: 157, icon: "🔄" },
      { word: "带来", pinyin: "dài lái", translation: "นำมา", page: 143, icon: "🎁" },
      { word: "丹", pinyin: "Dān", translation: "ชื่อคน (Dan)", page: 157, icon: "👤" },
      { word: "但", pinyin: "dàn", translation: "แต่", page: 157, icon: "⚖️" },
      { word: "蛋", pinyin: "dàn", translation: "ไข่", page: 157, icon: "🥚" },
      { word: "蛋糕", pinyin: "dàngāo", translation: "เค้ก", page: 143, icon: "🍰" },
      { word: "到", pinyin: "dào", translation: "ถึง", page: 110, icon: "🏁" },
      { word: "得", pinyin: "de", translation: "ได้ (กริยาช่วย)", page: 110, icon: "⚙️" },
      { word: "地", pinyin: "dì", translation: "ที่ / พื้น", page: 126, icon: "🌍" },
      { word: "地图", pinyin: "dìtú", translation: "แผนที่", page: 143, icon: "🗺️" },
      { word: "弟", pinyin: "dì", translation: "น้องชาย", page: 126, icon: "👦" },
      { word: "第一", pinyin: "dìyī", translation: "ลำดับที่ 1", page: 110, icon: "🥇" },
      { word: "点", pinyin: "diǎn", translation: "จุด / โมง", page: 110, icon: "⏰" },
      { word: "电视", pinyin: "diànshì", translation: "โทรทัศน์", page: 126, icon: "📺" },
      { word: "电影", pinyin: "diànyǐng", translation: "ภาพยนตร์", page: 110, icon: "🎬" },
      { word: "丁", pinyin: "Dīng", translation: "ชื่อคน (Ding)", page: 158, icon: "👤" },
      { word: "丢", pinyin: "diū", translation: "หาย / ทิ้ง", page: 158, icon: "🗑️" },
      { word: "冬冬", pinyin: "Dōngdōng", translation: "ชื่อคน (Dongdong)", page: 111, icon: "👤" },
      { word: "懂", pinyin: "dǒng", translation: "เข้าใจ", page: 126, icon: "✅" },
      { word: "洞", pinyin: "dòng", translation: "รู / ถ้ำ", page: 158, icon: "🕳️" },
      { word: "动物", pinyin: "dòngwù", translation: "สัตว์", page: 102, icon: "🦁" },
      { word: "兜", pinyin: "dōu", translation: "กระเป๋า", page: 158, icon: "👛" },
      { word: "读", pinyin: "dú", translation: "อ่าน", page: 111, icon: "📖" },
      { word: "肚子", pinyin: "dùzi", translation: "ท้อง", page: 102, icon: "🎈" },
      { word: "短", pinyin: "duǎn", translation: "สั้น", page: 111, icon: "📏" },
      { word: "对", pinyin: "duì", translation: "ถูกต้อง / ต่อ", page: 111, icon: "✔️" },
      { word: "对话", pinyin: "duìhuà", translation: "บทสนทนา", page: 144, icon: "💬" },
      { word: "多", pinyin: "duō", translation: "มาก", page: 111, icon: "➕" },
      { word: "朵", pinyin: "duǒ", translation: "ดอก (ลักษณนาม)", page: 158, icon: "🌸" },
      { word: "鹅", pinyin: "é", translation: "ห่าน", page: 102, icon: "🦢" },
      { word: "儿", pinyin: "ér", translation: "เด็ก", page: 102, icon: "👶" },
      { word: "二", pinyin: "èr", translation: "สอง", page: 111, icon: "2️⃣" },
      { word: "出", pinyin: "chū", translation: "ออก", page: 110, icon: "🚪" },
      { word: "运动会", pinyin: "yùndònghuì", translation: "งานกีฬาสี", page: 109, icon: "🏟️" },
      { word: "队", pinyin: "duì", translation: "ทีม", page: 109, icon: "🚩" },
      { word: "接力", pinyin: "jiēlì", translation: "วิ่งผลัด", page: 109, icon: "🏃" },
      { word: "啦啦队", pinyin: "lālāduì", translation: "เชียร์ลีดเดอร์", page: 109, icon: "📣" },
      { word: "表演", pinyin: "biǎoyǎn", translation: "แสดง", page: 109, icon: "🎭" },
      { word: "足球", pinyin: "zúqiú", translation: "ฟุตบอล", page: 109, icon: "⚽" },
      { word: "篮球", pinyin: "lánqiú", translation: "บาสเกตบอล", page: 109, icon: "🏀" },
      { word: "乒乓球", pinyin: "pīngpāngqiú", translation: "ปิงปอง", page: 109, icon: "🏓" },
      { word: "排球", pinyin: "páiqiú", translation: "วอลเลย์บอล", page: 109, icon: "🏐" },
      { word: "有趣", pinyin: "yǒuqù", translation: "สนุก", page: 109, icon: "✨" },
      { word: "最", pinyin: "zuì", translation: "ที่สุด", page: 109, icon: "🥇" },
      { word: "喜欢", pinyin: "xǐhuan", translation: "ชอบ", page: 109, icon: "❤️" },
      { word: "赛", pinyin: "sài", translation: "แข่งขัน", page: 109, icon: "🏁" },
      { word: "趣", pinyin: "qù", translation: "สนุก", page: 109, icon: "🤩" },
      { word: "跳远", pinyin: "tiàoyuǎn", translation: "กระโดดไกล", page: 109, icon: "🏃" },
      { word: "跳高", pinyin: "tiàogāo", translation: "กระโดดสูง", page: 109, icon: "🪜" },
      { word: "走", pinyin: "zǒu", translation: "เดิน", page: 102, icon: "🚶" },
      { word: "飞", pinyin: "fēi", translation: "บิน", page: 102, icon: "🐦" },
      { word: "爬", pinyin: "pá", translation: "คลาน", page: 102, icon: "🐢" },
      { word: "站", pinyin: "zhàn", translation: "ยืน", page: 102, icon: "🧍" },
      { word: "骑", pinyin: "qí", translation: "ขี่", page: 102, icon: "🚲" }
    ],
    dialogues: [],
    activities: [
      { id: 1101, title: "คลังคำศัพท์", type: "library", label: "คลังคำศัพท์", icon: "📚" }
    ]
  },
  {
    id: 1,
    title: "那里是电影院",
    translation: "ที่นั่นคือโรงภาพยนตร์ (There is a cinema)",
    pinyin: "Nàlǐ shì diànyǐngyuàn",
    illustration: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=400&fit=crop",
    keyConcepts: ["การบอกสถานที่", "การใช้ “ที่นั่น / ที่นี่”", "สถานที่รอบตัว"],
    vocabFocus: ["สถานที่ (โรงภาพยนตร์, โรงเรียน, ร้านค้า)", "คำบอกตำแหน่ง (这里, 那里)"],
    vocabulary: [
      { word: "书店", pinyin: "shūdiàn", translation: "ร้านหนังสือ (Bookstore)", icon: "📚" },
      { word: "电影院", pinyin: "diànyǐngyuàn", translation: "โรงภาพยนตร์ (Cinema)", icon: "🎬" },
      { word: "花店", pinyin: "huādiàn", translation: "ร้านดอกไม้ (Flower shop)", icon: "🌸" },
      { word: "医院", pinyin: "yīyuàn", translation: "โรงพยาบาล (Hospital)", icon: "🏥" },
      { word: "水果店", pinyin: "shuǐguǒdiàn", translation: "ร้านผลไม้ (Fruit shop)", icon: "🍎" },
      { word: "车站", pinyin: "chēzhàn", translation: "ป้ายรถโดยสาร (Bus station)", icon: "🚌" },
      { word: "饭店", pinyin: "fàndiàn", translation: "ร้านอาหาร (Restaurant)", icon: "🍜" },
      { word: "这里", pinyin: "zhèlǐ", translation: "ที่นี่ (Here)", icon: "📍" },
      { word: "那里", pinyin: "nàlǐ", translation: "ที่นั่น (There)", icon: "🛤️" },
      { word: "远", pinyin: "yuǎn", translation: "ไกล (Far)", icon: "🏔️" },
      { word: "近", pinyin: "jìn", translation: "ใกล้ (Near)", icon: "🏠" }
    ],
    dialogues: [
      { role: "Nana", text: "这里是便利店，便利店很近。", pinyin: "Zhèlǐ shì biànlìdiàn, biànlìdiàn hěn jìn.", translation: "ที่นี่คือร้านสะดวกซื้อ ร้านสะดวกซื้อใกล้มาก" },
      { role: "Mading", text: "水果店也很近，那里是水果店。", pinyin: "Shuǐguǒdiàn yě hěn jìn, nàlǐ shì shuǐguǒdiàn.", translation: "ร้านผลไม้ก็ใกล้มาก ที่นั่นคือโรงภาพยนตร์" }
    ],
    activities: [
      {
        id: 101,
        title: "Speaking Practice",
        type: "speaking",
        sentences: [
          { text: "这里是书店。", pinyin: "Zhèlǐ shì shūdiàn.", translation: "ที่นี่คือร้านหนังสือ" },
          { text: "那里是医院。", pinyin: "Nàlǐ shì yīyuàn.", translation: "ที่นั่นคือโรงพยาบาล" },
          { text: "水果店很近。", pinyin: "Shuǐguǒdiàn hěn jìn.", translation: "ร้านผลไม้ใกล้มาก" },
          { text: "电影院很远。", pinyin: "Diànyǐngyuàn hěn yuǎn.", translation: "โรงภาพยนตร์ไกลมาก" }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "星期天不下雨",
    translation: "วันอาทิตย์ฝนไม่ตก (It doesn't rain on Sunday)",
    pinyin: "Xīngqītiān bú xià yǔ",
    illustration: "https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?w=400&h=400&fit=crop",
    keyConcepts: ["สภาพอากาศ", "วันในสัปดาห์", "การบอกเหตุการณ์ทั่วไป"],
    vocabFocus: ["วันในสัปดาห์", "สภาพอากาศ (ฝนตก / ไม่ตก / แดดออก)"],
    vocabulary: [
      { word: "天气", pinyin: "tiānqì", translation: "อากาศ (Weather)", icon: "☁️" },
      { word: "晴天", pinyin: "qíngtiān", translation: "วันฟ้าใส (Sunny day)", icon: "☀️" },
      { word: "阴天", pinyin: "yīntiān", translation: "วันฟ้าครึ้ม (Cloudy day)", icon: "☁️" },
      { word: "下雪", pinyin: "xià xuě", translation: "หิมะตก (Snowy)", icon: "❄️" },
      { word: "刮风", pinyin: "guā fēng", translation: "ลมพัด (Windy)", icon: "💨" },
      { word: "冷", pinyin: "lěng", translation: "หนาว (Cold)", icon: "🥶" },
      { word: "热", pinyin: "rè", translation: "ร้อน (Hot)", icon: "🥵" },
      { word: "下雨", pinyin: "xià yǔ", translation: "ฝนตก (Rainy)", icon: "🌧️" },
      { word: "动物园", pinyin: "dòngwùyuán", translation: "สวนสัตว์ (Zoo)", icon: "🦁" }
    ],
    dialogues: [
      { role: "Nana", text: "明天天气怎么样？", pinyin: "Míngtiān tiānqì zěnmeyàng?", translation: "พรุ่งนี้อากาศเป็นอย่างไรบ้าง?" },
      { role: "Mading", text: "明天下雨，天气不好。", pinyin: "Míngtiān xià yǔ, tiānqì bù hǎo.", translation: "พรุ่งนี้ฝนตก อากาศไม่ดี" },
      { role: "Nana", text: "星期天不下雨，也不热。", pinyin: "Xīngqītiān bú xià yǔ, yě bú rè.", translation: "วันอาทิตย์ฝนไม่ตก และก็ไม่ร้อน" }
    ],
    activities: [
      {
        id: 201,
        title: "Speaking Practice",
        type: "speaking",
        sentences: [
          { text: "明天天气怎么样？", pinyin: "Míngtiān tiānqì zěnmeyàng?", translation: "พรุ่งนี้อากาศเป็นอย่างไร" },
          { text: "明天下雨，天气不好。", pinyin: "Míngtiān xià yǔ, tiānqì bù hǎo.", translation: "พรุ่งนี้ฝนตก อากาศไม่ดี" },
          { text: "星期天不下雨，也不热。", pinyin: "Xīngqītiān bú xià yǔ, yě bú rè.", translation: "วันอาทิตย์ฝนไม่ตก และก็ไม่ร้อน" }
        ]
      }
    ]
  },
  {
    id: 3,
    title: "你怎么去动物园？",
    translation: "เธอไปสวนสัตว์อย่างไร (How do you go to the zoo?)",
    pinyin: "Nǐ zěnme qù dòngwùyuán?",
    illustration: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=400&fit=crop",
    keyConcepts: ["การถามวิธีเดินทาง (How)", "พาหนะต่างๆ", "คำถาม 你怎么去...?"],
    vocabFocus: ["พาหนะ (เครื่องบิน, รถไฟ, จักรยาน, รถเมล์, รถแท็กซี่, รถไฟฟ้าใต้ดิน)", "คำกริยา (นั่ง, ขี่, เดิน)"],
    vocabulary: [
      { word: "飞机", pinyin: "fēijī", translation: "เครื่องบิน (Airplane)", icon: "✈️" },
      { word: "火车", pinyin: "huǒchē", translation: "รถไฟ (Train)", icon: "🚆" },
      { word: "自行车", pinyin: "zìxíngchē", translation: "รถจักรยาน (Bicycle)", icon: "🚲" },
      { word: "公交车", pinyin: "gōngjiāochē", translation: "รถโดยสารประจำทาง (Bus)", icon: "🚌" },
      { word: "校车", pinyin: "xiàochē", translation: "รถโรงเรียน (School bus)", icon: "🏫" },
      { word: "地铁", pinyin: "dìtiě", translation: "รถไฟฟ้าใต้ดิน (Subway)", icon: "🚇" },
      { word: "出租车", pinyin: "chūzūchē", translation: "รถแท็กซี่ (Taxi)", icon: "🚕" },
      { word: "汽车", pinyin: "qìchē", translation: "รถยนต์ (Car)", icon: "🚗" },
      { word: "坐", pinyin: "zuò", translation: "นั่ง (to sit/ride)", icon: "💺" },
      { word: "骑", pinyin: "qí", translation: "ขี่ (to ride bike)", icon: "🚲" },
      { word: "摩托车", pinyin: "mótuōchē", translation: "รถจักรยานยนต์ (Motorcycle)", icon: "🏍️" },
      { word: "走路", pinyin: "zǒulù", translation: "เดิน (to walk)", icon: "🚶" },
      { word: "怎么", pinyin: "zěnme", translation: "อย่างไร (how)", icon: "❓" },
      { word: "去哪儿", pinyin: "qù nǎr", translation: "ไปไหน (where to go)", icon: "📍" }
    ],
    dialogues: [
      { role: "Teacher", text: "马丁，你去哪儿？", pinyin: "Mǎdīng, nǐ qù nǎr?", translation: "มาร์ติน ลูกจะไปไหนจ๊ะ" },
      { role: "Mading", text: "我去动物园。", pinyin: "Wǒ qù dòngwùyuán.", translation: "ผมจะไปสวนสัตว์ครับ" },
      { role: "Teacher", text: "你怎么去？", pinyin: "Nǐ zěnme qù?", translation: "ลูกจะไปอย่างไรจ๊ะ" },
      { role: "Mading", text: "我坐公交车去。", pinyin: "Wǒ zuò gōngjiāochē qù.", translation: "ผมจะนั่งรถโดยสารประจำทางไปครับ" }
    ],
    activities: []
  },
  {
    id: 4,
    title: "我爸爸是职员",
    translation: "พ่อฉันเป็นพนักงานบริษัท (My dad is an office worker)",
    pinyin: "Wǒ bàba shì zhíyuán",
    illustration: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=400&fit=crop",
    keyConcepts: ["อาชีพ", "สมาชิกในครอบครัว", "การแนะนำบุคคล"],
    vocabFocus: ["อาชีพ", "ครอบครัว (พ่อ แม่)"],
    vocabulary: [
      { word: "爸爸", pinyin: "bàba", translation: "พ่อ (Father)", icon: "👨" },
      { word: "妈妈", pinyin: "māma", translation: "แม่ (Mother)", icon: "👩" },
      { word: "医生", pinyin: "yīshēng", translation: "หมอ (Doctor)", icon: "👨‍⚕️" },
      { word: "职员", pinyin: "zhíyuán", translation: "พนักงานบริษัท (Office worker)", icon: "💼" },
      { word: "忙", pinyin: "máng", translation: "ยุ่ง (Busy)", icon: "😫" },
      { word: "厨师", pinyin: "chúshī", translation: "พ่อครัว/แม่ครัว (Chef)", icon: "👨‍🍳" },
      { word: "医院", pinyin: "yīyuàn", translation: "โรงพยาบาล (Hospital)", icon: "🏥" },
      { word: "哪里", pinyin: "nàli", translation: "ที่ไหน (Where)", icon: "❓" },
      { word: "工作", pinyin: "gōngzuò", translation: "ทำงาน/งาน (Work/Job)", icon: "🛠️" },
      { word: "警察", pinyin: "jǐngchá", translation: "ตำรวจ (Police)", icon: "👮" }
    ],
    dialogues: [
      { role: "Mike", text: "你爸爸做什么工作？", pinyin: "Nǐ bàba zuò shénme gōngzuò?", translation: "พ่อเธอทำงานอะไร?" },
      { role: "Mading", text: "他是职员，工作非常忙。", pinyin: "Tā shì zhíyuán, gōngzuò fēicháng máng.", translation: "เขาเป็นพนักงานบริษัท ทำงานยุ่งมาก" }
    ],
    activities: [
      {
        id: 401,
        title: "Speaking Practice",
        type: "speaking",
        sentences: [
          { text: "我爸爸是职员。", pinyin: "Wǒ bàba shì zhíyuán.", translation: "คุณพ่อของฉันเป็นพนักงานบริษัท" },
          { text: "我妈妈是医生。", pinyin: "Wǒ māma shì yīshēng.", translation: "คุณแม่ของฉันเป็นคุณหมอ" },
          { text: "他做什么工作？", pinyin: "Tā zuò shénme gōngzuò?", translation: "เขาทำงานอะไร?" },
          { text: "他是厨师。", pinyin: "Tā shì chúshī.", translation: "เขาเป็นพ่อครัว" }
        ]
      }
    ]
  },
  {
    id: 5,
    title: "他在跑步",
    translation: "เขากำลังวิ่งจ็อกกิง (He is jogging)",
    pinyin: "Tā zài pǎobù",
    illustration: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400&h=400&fit=crop",
    keyConcepts: ["การใช้ 在 (zài) เพื่อบอกสิ่งที่กำลังทำ", "กิจกรรมยามว่างและงานบ้าน"],
    vocabFocus: ["กิจกรรมต่างๆ", "การใช้ ใน"],
    vocabulary: [
      { word: "跑步", pinyin: "pǎobù", translation: "วิ่งจ็อกกิง (Jogging)", icon: "🏃" },
      { word: "打电话", pinyin: "dǎ diànhuà", translation: "โทรศัพท์ (Making a call)", icon: "📞" },
      { word: "上网", pinyin: "shàngwǎng", translation: "เล่นอินเทอร์เน็ต (Surfing the internet)", icon: "🌐" },
      { word: "玩游戏", pinyin: "wán yóuxì", translation: "เล่นเกม (Playing games)", icon: "🎮" },
      { word: "写作业", pinyin: "xiě zuòyè", translation: "ทำการบ้าน (Doing homework)", icon: "📝" },
      { word: "洗衣服", pinyin: "xǐ yīfu", translation: "ซักผ้า (Washing clothes)", icon: "🧺" },
      { word: "学习", pinyin: "xuéxí", translation: "เรียน (Studying)", icon: "📖" },
      { word: "看电视", pinyin: "kàn diànshì", translation: "ดูโทรทัศน์ (Watching TV)", icon: "📺" },
      { word: "扫地", pinyin: "sǎodì", translation: "กวาดบ้าน (Sweeping the floor)", icon: "🧹" },
      { word: "做饭", pinyin: "zuòfàn", translation: "ทำอาหาร (Cooking)", icon: "🍳" },
      { word: "看书", pinyin: "kàn shū", translation: "อ่านหนังสือ (Reading a book)", icon: "📖" },
      { word: "睡觉", pinyin: "shuìjiào", translation: "นอนหลับ (Sleeping)", icon: "😴" },
      { word: "画画", pinyin: "huà huà", translation: "วาดภาพ (Drawing/Painting)", icon: "🎨" },
      { word: "游泳", pinyin: "yóuyǒng", translation: "ว่ายน้ำ (Swimming)", icon: "🏊" },
      { word: "弹钢琴", pinyin: "tán gāngqín", translation: "เล่นเปียโน (Playing piano)", icon: "🎹" },
      { word: "在", pinyin: "zài", translation: "กำลัง...อยู่ (Progressive particle)", icon: "⏳" }
    ],
    dialogues: [
      { role: "Mama", text: "他在做什么？", pinyin: "Tā zài zuò shénme?", translation: "เขากำลังทำอะไรอยู่?" },
      { role: "Nana", text: "他在跑步。", pinyin: "Tā zài pǎobù.", translation: "เขากำลังวิ่งจ็อกกิงอยู่ค่ะ" }
    ],
    activities: []
  },
  {
    id: 6,
    title: "飞机快，火车慢",
    translation: "เครื่องบินเร็ว รถไฟช้า (Airplane is fast, train is slow)",
    pinyin: "Fēijī kuài, huǒchē màn",
    illustration: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=400&fit=crop",
    keyConcepts: ["การเปรียบเทียบ", "ความเร็ว", "พาหนะ"],
    vocabFocus: ["คำคุณศัพท์ (เร็ว / ช้า)", "พาหนะ"],
    vocabulary: [
      { word: "爷爷", pinyin: "yéye", translation: "คุณปู่ (Grandfather)", icon: "👴" },
      { word: "奶奶", pinyin: "nǎinai", translation: "คุณย่า (Grandmother)", icon: "👵" },
      { word: "北京", pinyin: "Běijīng", translation: "ปักกิ่ง (Beijing)", icon: "🏙️" },
      { word: "上海", pinyin: "Shànghǎi", translation: "เซี่ยงไฮ้ (Shanghai)", icon: "🏙️" },
      { word: "多", pinyin: "duō", translation: "มาก (Many/Much)", icon: "➕" },
      { word: "少", pinyin: "shǎo", translation: "น้อย (Few/Little)", icon: "➖" },
      { word: "快", pinyin: "kuài", translation: "เร็ว (Fast)", icon: "⚡" },
      { word: "慢", pinyin: "màn", translation: "ช้า (Slow)", icon: "🐢" },
      { word: "胖", pinyin: "pàng", translation: "อ้วน (Fat)", icon: "🤰" },
      { word: "瘦", pinyin: "shòu", translation: "ผอม (Thin)", icon: "🧍" },
      { word: "大", pinyin: "dà", translation: "ใหญ่ (Big)", icon: "🐘" },
      { word: "小", pinyin: "xiǎo", translation: "เล็ก (Small)", icon: "🐭" },
      { word: "长", pinyin: "cháng", translation: "ยาว (Long)", icon: "📏" },
      { word: "短", pinyin: "duǎn", translation: "สั้น (Short)", icon: "✂️" },
      { word: "远", pinyin: "yuǎn", translation: "ไกล (Far)", icon: "🏔️" },
      { word: "近", pinyin: "jìn", translation: "ใกล้ (Near)", icon: "🏠" },
      { word: "高", pinyin: "gāo", translation: "สูง (Tall)", icon: "🦒" },
      { word: "矮", pinyin: "ǎi", translation: "เตี้ย (Short in height)", icon: "🍄" },
      { word: "冷", pinyin: "lěng", translation: "หนาว (Cold)", icon: "❄️" },
      { word: "热", pinyin: "rè", translation: "ร้อน (Hot)", icon: "☀️" }
    ],
    dialogues: [
      { role: "Mike", text: "哪个快？哪个慢？", pinyin: "Nǎge kuài? Nǎge màn?", translation: "อันไหนเร็ว? อันไหนช้า?" },
      { role: "Nana", text: "飞机快，火车慢。", pinyin: "Fēijī kuài, huǒchē màn.", translation: "เครื่องบินเร็ว รถไฟช้า" }
    ],
    activities: [
      { id: "l6-1", type: "listening", title: "Practice Listening", icon: "👂" },
      { id: "l6-2", type: "speaking", title: "Practice Speaking", icon: "🗣️" },
      { id: "l6-3", type: "reading", title: "Practice Reading", icon: "📚" },
      { id: "l6-4", type: "writing", title: "Practice Writing", icon: "✍️" },
      { id: "l6-5", type: "pinyin", title: "Practice Pinyin", icon: "🔡" },
      { id: "l6-6", type: "fun", title: "Fun Activity", icon: "🎮" },
      { id: "l6-7", type: "final", title: "Final Challenge", icon: "🏆" }
    ]
  },
  {
    id: 7,
    title: "马丁的肚子疼",
    translation: "มาร์ตินปวดท้อง",
    pinyin: "Mǎdīng de dùzi téng",
    illustration: "https://images.unsplash.com/photo-1576091160550-217359f4ecf8?w=400&h=400&fit=crop",
    keyConcepts: ["สุขภาพ", "อาการเจ็บป่วย", "การบอกความรู้สึก"],
    vocabFocus: ["อวัยวะ", "อาการเจ็บป่วย"],
    vocabulary: [
      { word: "耳朵", pinyin: "ěrduo", translation: "หู (Ear)", icon: "👂" },
      { word: "鼻子", pinyin: "bízi", translation: "จมูก (Nose)", icon: "👃" },
      { word: "手", pinyin: "shǒu", translation: "มือ (Hand)", icon: "✋" },
      { word: "眼睛", pinyin: "yǎnjing", translation: "ตา (Eye)", icon: "👁️" },
      { word: "嘴巴", pinyin: "zuǐba", translation: "ปาก (Mouth)", icon: "👄" },
      { word: "头", pinyin: "tóu", translation: "หัว (Head)", icon: "👤" },
      { word: "牙", pinyin: "yá", translation: "ฟัน (Tooth)", icon: "🦷" },
      { word: "脚", pinyin: "jiǎo", translation: "เท้า (Foot)", icon: "🦶" },
      { word: "脖子", pinyin: "bózi", translation: "คอ (Neck)", icon: "🦒" },
      { word: "肚子", pinyin: "dùzi", translation: "ท้อง (Stomach)", icon: "🎈" },
      { word: "腿", pinyin: "tuǐ", translation: "ขา (Leg)", icon: "🦵" },
      { word: "嗓子", pinyin: "sǎngzi", translation: "คอ/เสียง (Throat)", icon: "🗣️" },
      { word: "胳膊", pinyin: "gēbo", translation: "แขน (Arm)", icon: "💪" },
      { word: "疼", pinyin: "téng", translation: "ปวด/เจ็บ (Pain)", icon: "😫" },
      { word: "痒", pinyin: "yǎng", translation: "คัน (Itchy)", icon: "🦟" }
    ],
    dialogues: [
      { role: "Nana", text: "马丁，你怎么了？", pinyin: "Mǎdīng, nǐ zěnme le?", translation: "มาร์ติน เธอเป็นอะไร" },
      { role: "Mading", text: "我不舒服，我的肚子疼。", pinyin: "Wǒ bù shūfu, wǒ de dùzi téng.", translation: "ผมไม่สบาย ผมปวดท้องครับ" },
      { role: "Nana", text: "你吃了什么？", pinyin: "Nǐ chī le shénme?", translation: "เธอกินอะไรไป" },
      { role: "Mading", text: "我吃了很多冰激凌。", pinyin: "Wǒ chī le hěn duō bīngjīlíng.", translation: "ผมกินไอศกรีมไปเยอะมากครับ" }
    ],
    activities: [
      {
        id: 701,
        title: "Sentences Listening",
        type: "listening_sentences",
        items: [
          { text: "我的肚子疼。", pinyin: "Wǒ de dùzi téng.", translation: "ฉันปวดท้อง" },
          { text: "我牙疼。", pinyin: "Wǒ yá téng.", translation: "ฉันปวดฟัน" },
          { text: "我的头好痒。", pinyin: "Wǒ de tóu hǎo yǎng.", translation: "หัวของฉันคันมาก" },
          { text: "他不舒服。", pinyin: "Tā bù shūfu.", translation: "เขาไม่สบาย" }
        ]
      },
      {
        id: 702,
        title: "Grammar & Speaking",
        type: "speaking_grammar",
        explanation: "คำว่า “了” ใช้วางไว้หลังคำกริยา เพื่อแสดงว่าการกระทำนั้นเสร็จสิ้นแล้ว",
        examples: [
          { text: "我吃了很多冰激凌。", pinyin: "Wǒ chī le hěn duō bīngjīlíng.", translation: "ฉันกินไอศกรีมไปเยอะมาก" },
          { text: "我写了作业。", pinyin: "Wǒ xiě le zuòyè.", translation: "ฉันทำการบ้านแล้ว" },
          { text: "เราไปสวนสัตว์แล้ว。", pinyin: "Wǒmen qù le dòngwùyuán.", translation: "พวกเราไปสวนสัตว์แล้ว" }
        ]
      },
      {
        id: 703,
        title: "Symptoms Practice",
        type: "symptoms_game",
        items: [
          { word: "头疼", pinyin: "tóu téng", translation: "ปวดหัว" },
          { word: "肚子疼", pinyin: "dùzi téng", translation: "ปวดท้อง" },
          { word: "腿疼", pinyin: "tuǐ téng", translation: "ปวดขา" },
          { word: "牙疼", pinyin: "yá téng", translation: "ปวดฟัน" },
          { word: "眼睛疼", pinyin: "yǎnjing téng", translation: "ปวดตา" },
          { word: "脖子疼", pinyin: "bózi téng", translation: "ปวดคอ" },
          { word: "胳膊疼", pinyin: "gēbo téng", translation: "ปวดแขน" },
          { word: "嗓子疼", pinyin: "sǎngzi téng", translation: "เจ็บคอ" }
        ]
      },
      {
        id: 704,
        title: "Reading Story",
        type: "reading_story",
        date: "2023年3月17日，星期五。",
        datePinyin: "Èr líng èr sān nián sān yuè shíqī hào, xīngqīwǔ.",
        dateTranslation: "วันที่ 17 มีนาคม 2023 วันศุกร์",
        story: [
          { text: "今天是星期五，上午有汉语课。", pinyin: "Jīntiān shì xīngqīwǔ, shàngwǔ yǒu Hànyǔ kè.", translation: "วันนี้เป็นวันศุกร์ ตอนเช้ามีวิชาภาษาจีน" },
          { text: "我和麦克不舒服，去了医院。", pinyin: "Wǒ hé Màikè bù shūfu, qù le yīyuàn.", translation: "ฉันกับไมค์ไม่สบาย จึงไปโรงพยาบาล" },
          { text: "我吃了很多冰激凌，肚子疼。", pinyin: "Wǒ chī le hěn duō bīngjīlíng, dùzi téng.", translation: "ฉันกินไอศกรีมไปเยอะ จึงปวดท้อง" },
          { text: "麦克也吃了很多冰激凌，他牙疼。", pinyin: "Màikè yě chī le hěn duō bīngjīlíng, tā yá téng.", translation: "ไมค์ก็กินไอศกรีมไปเยอะ เขาปวดฟัน" }
        ],
        extraVocab: [
          { word: "流鼻涕", pinyin: "liú bítì", translation: "น้ำมูกไหล" },
          { word: "发烧", pinyin: "fāshāo", translation: "มีไข้" },
          { word: "咳嗽", pinyin: "késou", translation: "ไอ" }
        ],
        questions: [
          { text: "马丁肚子疼。", answer: true },
          { text: "麦克头疼。", answer: false },
          { text: "พวกเขาเทกินเค้กไปเยอะมาก。", textZh: "他们吃了很多蛋糕。", answer: false }
        ]
      },
      {
        id: 705,
        title: "Writing Practice",
        type: "writing_tasks",
        chars: [
          { char: "牙", pinyin: "yá", translation: "ฟัน" },
          { char: "疼", pinyin: "téng", translation: "ปวด/เจ็บ" },
          { char: "肚", pinyin: "dù", translation: "ท้อง" },
          { char: "腿", pinyin: "tuǐ", translation: "ขา" }
        ],
        fillBlanks: [
          { text: "爸爸的__很白。", pinyin: "Bàba de __ hěn bái.", full: "爸爸的牙很白。", translation: "ฟันของพ่อขาวมาก", options: ["牙", "乐", "才"], answer: "牙" },
          { text: "我的__子不舒服。", pinyin: "Wǒ de __zi bù shūfu.", full: "我的肚子不舒服。", translation: "ท้องของฉันไม่สบาย", options: ["胜", "胳", "肚"], answer: "肚" },
          { text: "弟弟头__。", pinyin: "Dìdi tóu __.", full: "弟弟头疼。", translation: "น้องชายปวดหัว", options: ["病", "疼", "疚"], answer: "疼" },
          { text: "这是大象的__。", pinyin: "Zhè shì dàxiàng de __.", full: "นี่คือขาของช้าง", options: ["褪", "退", "腿"], answer: "腿" }
        ],
        grouping: ["疼", "肚", "脚", "腿", "嘴", "嗓", "吃"],
        strokeOrder: [
          { word: "手", pinyin: "shǒu", translation: "มือซ้าย", phrase: "左手" },
          { word: "脚", pinyin: "jiǎo", translation: "เท้าขวา", phrase: "右脚" }
        ]
      },
      {
        id: 706,
        title: "Pinyin Rules",
        type: "pinyin_rules",
        rule: "เมื่อเสียง 3 ติดกัน 2 เสียง เสียง 3 ตัวที่ 1 จะเปลี่ยนเป็นเสียง 2",
        explanation: "ในภาษาจีน ถ้าพยางค์เสียงวรรณยุกต์ที่ 3 สองตัวอยู่ติดกัน พยางค์แรกจะออกเสียงคล้ายเสียงที่ 2 เพื่อให้อ่านลื่นขึ้น เช่น nǐ hǎo อ่านเป็น ní hǎo",
        sets: [
          { original: "nǐ + hǎo", result: "ní hǎo", zh: "你好" },
          { original: "kǒu + kě", result: "kóu kě", zh: "口渴" },
          { original: "hěn + hǎo", result: "hén hǎo", zh: "很好" },
          { original: "shǒu + biǎo", result: "shóu biǎo", zh: "手表" },
          { original: "yǔ + sǎn", result: "yú sǎn", zh: "雨伞" },
          { original: "xǐ + zǎo", result: "xí zǎo", zh: "洗澡" }
        ],
        vocab: [
          { zh: "很痒", py: "hěn yǎng", th: "คันมาก" },
          { zh: "你好", py: "nǐ hǎo", th: "สวัสดี" },
          { zh: "很冷", py: "hěn lěng", th: "หนาวมาก" },
          { zh: "老虎", py: "lǎohǔ", th: "เสือ" },
          { zh: "水果", py: "shuǐguǒ", th: "ผลไม้" },
          { zh: "洗手", py: "xǐ shǒu", th: "ล้างมือ" }
        ],
        rhyme: [
          { zh: "我有两只小狗，小豆还有小雨。", py: "Wǒ yǒu liǎng zhī xiǎo gǒu, Xiǎodòu hái yǒu Xiǎoyǔ.", th: "ฉันมีลูกสุนัขสองตัว ชื่อเสี่ยวโต้วและเสี่ยวอวี่" },
          { zh: "小豆很爱跑步，小雨很爱洗澡。", py: "Xiǎodòu hěn ài pǎobù, Xiǎoyǔ hěn ài xǐzǎo.", th: "เสี่ยวโต้วชอบวิ่งมาก เสี่ยวอวี่ชอบอาบน้ำมาก" }
        ]
      },
      {
        id: 707,
        title: "Fun Activities",
        type: "fun_content",
        matchGame: [
          { zh: "牙", py: "yá", th: "ฟัน" },
          { zh: "肚子", py: "dùzi", th: "ท้อง" },
          { zh: "脖子", py: "bózi", th: "คอด้านนอก" },
          { zh: "胳膊", py: "gēbo", th: "แขน" },
          { zh: "怎么了", py: "zěnme le", th: "เป็นอะไร" },
          { zh: "疼", py: "téng", th: "ปวด/เจ็บ" },
          { zh: "冰激凌", py: "bīngjīlíng", th: "ไอศกรีม" },
          { zh: "嗓子", py: "sǎngzi", th: "คอด้านใน" },
          { zh: "舒服", py: "shūfu", th: "สบาย" }
        ],
        symptomsGame: {
          title: "เกมฉันป่วยเป็นอะไร",
          instruction: "ให้นักเรียนแสดงอาการป่วย เพื่อน ๆ ทายแล้วพูดประโยคให้ถูกต้อง",
          questions: [
            { text: "他怎么了？", translation: "เขาเป็นอะไร", answer: "เขาปวดท้อง", answerZh: "他肚子疼。" },
            { text: "เธอเป็นอะไร", translation: "เธอเป็นอะไร", textZh: "她怎么了？", answer: "เธอปวดฟัน", answerZh: "她牙疼。" }
          ],
          randomPool: ["头疼", "肚子疼", "腿疼", "牙疼", "眼睛疼", "脖子疼", "胳膊疼", "嗓子疼", "手痒", "脚痒"]
        },
        mosquitoRhyme: [
          { zh: "蚊子蚊子咬了我的头，", py: "Wénzi wénzi yǎo le wǒ de tóu,", th: "ยุงกัดหัวของฉัน" },
          { zh: "好痒好痒，我的头好痒。", py: "Hǎo yǎng hǎo yǎng, wǒ de tóu hǎo yǎng.", th: "คันจัง คันจัง หัวของฉันคันจัง" },
          { zh: "蚊子蚊子咬了我的手，", py: "Wénzi wénzi yǎo le wǒ de shǒu,", th: "ยุงกัดมือของฉัน" },
          { zh: "好痒好痒，我的手好痒。", py: "Hǎo yǎng hǎo yǎng, wǒ de shǒu hǎo yǎng.", th: "คันจัง คันจัง มือของฉันคันจัง" },
          { zh: "蚊子蚊子咬了我的腿，", py: "Wénzi wénzi yǎo le wǒ de tuǐ,", th: "ยุงกัดขาของฉัน" },
          { zh: "好痒好痒，我的腿好痒。", py: "Hǎo yǎng hǎo yǎng, wǒ de tuǐ hǎo yǎng.", th: "คันจัง คันจัง ขาของฉันคันจัง" },
          { zh: "蚊子蚊子咬了我的脚，", py: "Wénzi wénzi yǎo le wǒ de jiǎo,", th: "ยุงกัดเท้าของฉัน" },
          { zh: "好痒好痒，我的脚好痒。", py: "Hǎo yǎng hǎo yǎng, wǒ de jiǎo hǎo yǎng.", th: "คันจัง คันจัง เท้าของฉันคันจัง" }
        ]
      }
    ]
  },
  {
    id: 8,
    title: "学袋鼠，跳一跳",
    translation: "ทำท่ากระโดดเหมือนจิงโจ้",
    pinyin: "Xué dàishǔ, tiào yi tiào",
    illustration: "https://images.unsplash.com/photo-1528150230181-99bbf7b22162?w=400&h=400&fit=crop",
    keyConcepts: ["การเลียนแบบท่าทางสุนัข", "การบอกความสามารถ (会/不会)", "สัตว์ต่างๆ"],
    vocabFocus: ["คำกริยาแสดงท่าทาง", "สัตว์"],
    vocabulary: [
      { word: "坐", pinyin: "zuò", translation: "นั่ง (Sit)", icon: "🪑" },
      { word: "站", pinyin: "zhàn", translation: "ยืน (Stand)", icon: "🧍" },
      { word: "走", pinyin: "zǒu", translation: "เดิน (Walk)", icon: "🚶" },
      { word: "跳", pinyin: "tiào", translation: "กระโดด (Jump)", icon: "🦘" },
      { word: "跑", pinyin: "pǎo", translation: "วิ่ง (Run)", icon: "🏃" },
      { word: "爬", pinyin: "pá", translation: "ปีน/คลาน (Crawl)", icon: "🐢" },
      { word: "游", pinyin: "yóu", translation: "ว่ายน้ำ (Swim)", icon: "🏊" },
      { word: "飞", pinyin: "fēi", translation: "บิน (Fly)", icon: "🐦" },
      { word: "马", pinyin: "mǎ", translation: "ม้า (Horse)", icon: "🐎" },
      { word: "乌龟", pinyin: "wūguī", translation: "เต่า (Turtle)", icon: "🐢" },
      { word: "袋鼠", pinyin: "dàishǔ", translation: "จิงโจ้ (Kangaroo)", icon: "🦘" },
      { word: "企鹅", pinyin: "qǐ’é", translation: "เพนกวิน (Penguin)", icon: "🐧" }
    ],
    dialogues: [
      { role: "Teacher", text: "学袋鼠，跳一跳。", pinyin: "Xué dàishǔ, tiào yi tiào.", translation: "ทำท่ากระโดดเหมือนจิงโจ้" },
      { role: "Students", text: "学乌龟，爬一爬。", pinyin: "Xué wūguī, pá yi pá.", translation: "ทำท่าคลานเหมือนเต่า" }
    ],
    activities: [
      {
        id: 801,
        title: "Listening Practice",
        type: "listening_sentences",
        items: [
          { text: "学袋鼠，跳一跳。", pinyin: "Xué dàishǔ, tiào yi tiào.", translation: "ทำท่ากระโดดเหมือนจิงโจ้", speakChinese: "学袋鼠，跳一跳。" },
          { text: "学乌龟，爬一爬。", pinyin: "Xué wūguī, pá yi pá.", translation: "ทำท่าคลานเหมือนเต่า", speakChinese: "学乌龟，爬一爬。" },
          { text: "学小鸟，飞一飞。", pinyin: "Xué xiǎo niǎo, fēi yi fēi.", translation: "ทำท่าบินเหมือนนก", speakChinese: "学小鸟，飞一飞。" },
          { text: "学小鱼，游一游。", pinyin: "Xué xiǎo yú, yóu yi yóu.", translation: "ทำท่าว่ายน้ำเหมือนปลา", speakChinese: "学小鱼，游一游。" }
        ],
        extraVocab: [
          { word: "小马", pinyin: "xiǎo mǎ", translation: "ลูกม้า", icon: "🐎" },
          { word: "小狗", pinyin: "xiǎo gǒu", translation: "ลูกสุนัข", icon: "🐶" },
          { word: "小鸟", pinyin: "xiǎo niǎo", translation: "นกน้อย", icon: "🐦" },
          { word: "小鱼", pinyin: "xiǎo yú", translation: "ปลาน้อย", icon: "🐟" },
          { word: "兔子", pinyin: "tùzi", translation: "กระต่าย", icon: "🐰" },
          { word: "熊猫", pinyin: "xióngmāo", translation: "แพนด้า", icon: "🐼" },
          { word: "长颈鹿", pinyin: "chángjǐnglù", translation: "ยีราฟ", icon: "🦒" },
          { word: "仓鼠", pinyin: "cāngshǔ", translation: "หนูแฮมสเตอร์", icon: "🐹" },
          { word: "大象", pinyin: "dàxiàng", translation: "ช้าง", icon: "🐘" },
          { word: "小猫", pinyin: "xiǎo māo", translation: "ลูกแมว", icon: "🐱" }
        ]
      },
      {
        id: 802,
        title: "Speaking Practice",
        type: "speaking_mimic",
        items: [
          { text: "学袋鼠，跳一跳。", pinyin: "Xué dàishǔ, tiào yi tiào.", translation: "ทำท่ากระโดดเหมือนจิงโจ้", action: "🦘 Hop!" },
          { text: "学乌龟，爬一爬。", pinyin: "Xué wūguī, pá yi pá.", translation: "ทำท่าคลานเหมือนเต่า", action: "🐢 Crawl slow!" },
          { text: "学企鹅，走一走。", pinyin: "Xué qǐ’é, zǒu yi zǒu.", translation: "ทำท่าเดินเหมือนเพนกวิน", action: "🐧 Waddle!" },
          { text: "学小马，跑一跑。", pinyin: "Xué xiǎo mǎ, pǎo yi pǎo.", translation: "ทำท่าวิ่งเหมือนม้า", action: "🐎 Gallop!" },
          { text: "学小鸟，飞一飞。", pinyin: "Xué xiǎo niǎo, fēi yi fēi.", translation: "ทำท่าบินเหมือนนก", action: "🕊️ Flap wings!" },
          { text: "学小鱼，游一ย-", pinyin: "Xué xiǎo yú, yóu yi yóu.", translation: "ทำท่าว่ายน้ำเหมือนปลา", action: "🐟 Swim!" }
        ],
        qaPairs: [
          { animal: "袋鼠", action: "跳", pinyin: "dàishǔ / tiào" },
          { animal: "企鹅", action: "走", pinyin: "qǐ'é / zǒu" },
          { animal: "小马", action: "跑", pinyin: "xiǎo mǎ / pǎo" },
          { animal: "乌龟", action: "爬", pinyin: "wūguī / pá" },
          { animal: "小鸟", action: "飞", pinyin: "xiǎo niǎo / fēi" },
          { animal: "小鱼", action: "游", pinyin: "xiǎo yú / yóu" },
          { animal: "小狗", action: "坐", pinyin: "xiǎo gǒu / zuò" },
          { animal: "哥哥", action: "站", pinyin: "gēge / zhàn" }
        ]
      },
      {
        id: 803,
        title: "Reading Practice",
        type: "reading_story",
        titleZh: "这是你！",
        story: [
          { zh: "这是你！", py: "Zhè shì nǐ!", th: "นี่คือตัวเธอ!" },
          { zh: "你会坐，不会站。", py: "Nǐ huì zuò, bú huì zhàn.", th: "เธอนั่งได้ แต่ยังยืนไม่ได้" },
          { zh: "你会爬，不会走。", py: "Nǐ huì pá, bú huì zǒu.", th: "เธอคลานได้ แต่ยังเดินไม่ได้" },
          { zh: "你会走，不会跑。", py: "Nǐ huì zǒu, bú huì pǎo.", th: "เธอเดินได้ แต่ยังวิ่งไม่ได้" },
          { zh: "你会跑。", py: "Nǐ huì pǎo.", th: "เธอวิ่งได้" },
          { zh: "你也会跳。", py: "Nǐ yě huì tiào.", th: "เธอก็กระโดดได้ด้วย" },
          { zh: "谢谢爸爸！", py: "Xièxie bàba!", th: "ขอบคุณพ่อ!" }
        ],
        extraVocab: [
          { word: "听", pinyin: "tīng", translation: "ฟัง" },
          { word: "读", pinyin: "dú", translation: "อ่าน" },
          { word: "会", pinyin: "huì", translation: "สามารถ/ทำได้" }
        ],
        questions: [
          { qZh: "他会坐吗？", qPy: "Tā huì zuò ma?", qTh: "เขานั่งได้ไหม", answer: "会" },
          { qZh: "他会走吗？", qPy: "Tā huì zǒu ma?", qTh: "เขาเดินได้ไหม", answer: "会" },
          { qZh: "他也会跳吗？", qPy: "Tā yě huì tiào ma?", qTh: "เขากระโดดได้ด้วยไหม", answer: "会" }
        ]
      },
      {
        id: 804,
        title: "Writing Practice",
        type: "writing_tasks",
        chars: [
          { char: "站", pinyin: "zhàn", translation: "ยืน" },
          { char: "走", pinyin: "zǒu", translation: "เดิน" },
          { char: "爬", pinyin: "pá", translation: "ปีน/คลาน" },
          { char: "飞", pinyin: "fēi", translation: "บิน" }
        ],
        missingStrokes: ["游", "站", "飞", "走", "爬"],
        colorPairs: [
          { a: "坐", b: "走" },
          { a: "爬", b: "跑" },
          { a: "游", b: "飞" }
        ],
        copyTasks: [
          { char: "走", phrase: "走路", th: "เดิน" },
          { char: "飞", phrase: "会飞", th: "บินได้" }
        ]
      },
      {
        id: 805,
        title: "Pinyin Practice",
        type: "pinyin_short_tone",
        intro: "ฝึกอ่านเสียงเบาและเสียงสั้นในภาษาจีน",
        description: "ในภาษาจีนมีบางพยางค์ที่ออกเสียงเบาและสั้น เรียกว่าเสียงเบา เช่น zi, ba, le, ma, de, ge บางคำเสียงท้ายจะสั้นและเบากว่าพยางค์หลัก",
        vocab: [
          { zh: "脖子", py: "bózi", th: "คอ", speak: "脖子" },
          { zh: "耳朵", py: "ěrduo", th: "หู", speak: "耳朵" },
          { zh: "本子", py: "běnzi", th: "สมุด", speak: "本子" },
          { zh: "肚子", py: "dùzi", th: "ท้อง", speak: "肚子" },
          { zh: "裙子", py: "qúnzi", th: "กระโปรง", speak: "裙子" },
          { zh: "嘴巴", py: "zuǐba", th: "ปาก", speak: "嘴巴" },
          { zh: "裤子", py: "kùzi", th: "กางเกง", speak: "裤子" },
          { zh: "桌子", py: "zhuōzi", th: "โต๊ะ", speak: "桌子" },
          { zh: "嗓子", py: "sǎngzi", th: "คอด้านใน", speak: "嗓子" },
          { zh: "椅子", py: "yǐzi", th: "เก้าอี้", speak: "椅子" },
          { zh: "袜子", py: "wàzi", th: "ถุงเท้า", speak: "袜子" },
          { zh: "尾巴", py: "wěiba", th: "หาง", speak: "尾巴" }
        ],
        sentences: [
          { zh: "学兔子，跳一跳。", py: "Xué tùzi, tiào yi tiào.", th: "ทำท่ากระโดดเหมือนกระต่าย" },
          { zh: "对不起！", py: "Duìbuqǐ!", th: "ขอโทษ" },
          { zh: "你妈妈是护士吗？", py: "Nǐ māma shì hùshi ma?", th: "แม่ของเธอเป็นพยาบาลไหม" },
          { zh: "这是我的弟弟。", py: "Zhè shì wǒ de dìdi.", th: "นี่คือน้องชายของฉัน" },
          { zh: "你爸爸做什么工作？", py: "Nǐ bàba zuò shénme gōngzuò?", th: "พ่อของเธอทำงานอะไร" },
          { zh: "你怎么了？", py: "Nǐ zěnme le?", th: "เธอเป็นอะไร" },
          { zh: "พวกเราไปสวนสัตว์กันเถอะ。", py: "Wǒmen qù dòngwùyuán ba!", zhActual: "我们去动物园吧！", th: "พวกเราไปสวนสัตว์กันเถอะ" },
          { zh: "我吃了很多冰激凌。", py: "Wǒ chī le hěn duō bīngjīlíng.", th: "ฉันกินไอศกรีมไปเยอะมาก" }
        ]
      },
      {
        id: 806,
        title: "Fun Activities",
        type: "fun_content",
        matchPairs: [
          { zh: "坐", py: "zuò" },
          { zh: "跑", py: "pǎo" },
          { zh: "爬", py: "pá" },
          { zh: "走", py: "zǒu" },
          { zh: "跳", py: "tiào" },
          { zh: "站", py: "zhàn" },
          { zh: "游", py: "yóu" },
          { zh: "学", py: "xué" },
          { zh: "飞", py: "fēi" }
        ],
        mimicRhyme: [
          { zh: "小鸟飞，小鸟飞，小鸟飞完小鱼游。", py: "Xiǎo niǎo fēi, xiǎo niǎo fēi, xiǎo niǎo fēi wán xiǎo yú yóu.", th: "นกน้อยบิน บินเสร็จแล้วปลาน้อยว่ายน้ำ" },
          { zh: "小鱼游，小鱼游，小鱼游完小马跑。", py: "Xiǎo yú yóu, xiǎo yú yóu, xiǎo yú yóu wán xiǎo mǎ pǎo.", th: "ปลาน้อยว่ายน้ำ ว่ายเสร็จแล้วลูกม้าวิ่ง" },
          { zh: "小马跑，小马跑，小马跑完袋鼠跳。", py: "Xiǎo mǎ pǎo, xiǎo mǎ pǎo, xiǎo mǎ pǎo wán dàishǔ tiào.", th: "ลูกม้าวิ่ง วิ่งเสร็จแล้วจิงโจ้กระโดด" }
        ],
        grouping: {
          categories: ["会游", "会跳", "会飞", "会跑", "会爬", "会走"],
          animals: [
            { zh: "乌龟", py: "wūguī", cat: "会爬" },
            { zh: "兔子", py: "tùzi", cat: "会跳" },
            { zh: "小狗", py: "xiǎo gǒu", cat: "会跑" },
            { zh: "小马", py: "xiǎo mǎ", cat: "会跑" },
            { zh: "小鸟", py: "xiǎo niǎo", cat: "会飞" },
            { zh: "熊猫", py: "xióngmāo", cat: "会走" },
            { zh: "袋鼠", py: "dàishǔ", cat: "会跳" },
            { zh: "企鹅", py: "qǐ’é", cat: "会走" },
            { zh: "长颈鹿", py: "chángjǐnglù", cat: "会走" },
            { zh: "仓鼠", py: "cāngshǔ", cat: "会跑" },
            { zh: "大象", py: "dàxiàng", cat: "会走" },
            { zh: "小猫", py: "xiǎo māo", cat: "会走" }
          ],
          questions: [
            { zh: "谁会游？", py: "Shéi huì yóu?", th: "ใครว่ายน้ำได้" },
            { zh: "谁会跳？", py: "Shéi huì tiào?", th: "ใครกระโดดได้" },
            { zh: "谁会飞？", py: "Shéi huì fēi?", th: "ใครบินได้" }
          ]
        }
      }
    ]
  },
  {
    id: 9,
    title: "运动会",
    translation: "งานกีฬาสี (Sports Day)",
    pinyin: "Yùndònghuì",
    illustration: "https://images.unsplash.com/photo-1505232987774-83f6250787a7?w=400&h=400&fit=crop",
    keyConcepts: ["งานกีฬาสี", "การบอกความชอบ (ที่สุด)", "กีฬาประเภทต่างๆ"],
    vocabFocus: ["สนามกีฬาสี", "กีฬา", "การแสดง"],
    vocabulary: [
      { word: "拔河", pinyin: "báhé", translation: "ชักเย่อ", icon: "🪢" },
      { word: "跳远", pinyin: "tiàoyuǎn", translation: "กระโดดไกล", icon: "🏃" },
      { word: "跳高", pinyin: "tiàogāo", translation: "กระโดดสูง", icon: "🪜" },
      { word: "接力", pinyin: "jiēlì", translation: "วิ่งผลัด", icon: " baton" },
      { word: "比赛", pinyin: "bǐsài", translation: "การแข่งขัน", icon: "🏆" },
      { word: "啦啦队", pinyin: "lālāduì", translation: "เชียร์ลีดเดอร์", icon: "📣" },
      { word: "排球", pinyin: "páiqiú", translation: "วอลเลย์บอล", icon: "🏐" },
      { word: "足球", pinyin: "zúqiú", translation: "ฟุตบอล", icon: "⚽" },
      { word: "篮球", pinyin: "lánqiú", translation: "บาสเกตบอล", icon: "🏀" },
      { word: "乒乓球", pinyin: "pīngpāngqiú", translation: "ปิงปอง", icon: "🏓" },
      { word: "跑步", pinyin: "pǎobù", translation: "วิ่ง", icon: "🏃‍♂️" }
    ],
    dialogues: [
      { role: "Nana", text: "你最喜欢什么比赛？", pinyin: "Nǐ zuì xǐhuan shénme bǐsài?", translation: "เธอชอบการแข่งขันอะไรที่สุด?" },
      { role: "Mike", text: "我最喜欢足球比赛。", pinyin: "Wǒ zuì xǐhuan zúqiú bǐsài.", translation: "ฉันชอบการแข่งขันฟุตบอลที่สุด" }
    ],
    activities: [
      {
        id: 901,
        title: "Listening Practice",
        type: "listening_sentences",
        items: [
          { text: "我最喜欢拔河比赛。", pinyin: "Wǒ zuì xǐhuan báhé bǐsài.", translation: "ฉันชอบการแข่งขันชักเย่อมากที่สุด" },
          { text: "我最喜欢乒乓球比赛。", pinyin: "Wǒ zuì xǐhuan pīngpāngqiú bǐsài.", translation: "ฉันชอบการแข่งขันปิงปองมากที่สุด" },
          { text: "排球比赛非常有趣。", pinyin: "Páiqiú bǐsài fēicháng yǒuqù.", translation: "การแข่งขันวอลเลย์บอลสนุกมาก" },
          { text: "你最喜欢什么比赛？", pinyin: "Nǐ zuì xǐhuan shénme bǐsài?", translation: "เธอชอบการแข่งขันอะไรมากที่สุด" }
        ],
        extraVocab: [
          { word: "运动会", pinyin: "yùndònghuì", translation: "งานกีฬาสี", icon: "🏟️" },
          { word: "最", pinyin: "zuì", translation: "ที่สุด", icon: "🥇" },
          { word: "喜欢", pinyin: "xǐhuan", translation: "ชอบ", icon: "❤️" },
          { word: "有趣", pinyin: "yǒuqù", translation: "สนุก/น่าสนใจ", icon: "✨" }
        ]
      },
      {
        id: 902,
        title: "Speaking Practice",
        type: "speaking_mimic",
        items: [
          { text: "你们最喜欢什么比赛？", pinyin: "Nǐmen zuì xǐhuan shénme bǐsài?", translation: "พวกเธอชอบการแข่งขันอะไรมากที่สุด", action: "Ask classmates" },
          { text: "拔河比赛非常有趣，我最喜欢拔河比赛。", pinyin: "Báhé bǐsài fēicháng yǒuqù, wǒ zuì xǐhuan báhé bǐsài.", translation: "การแข่งขันชักเย่อสนุกมาก ฉันชอบการแข่งขันชักเย่อมากที่สุด", action: "Pulling rope action" },
          { text: "我最喜欢乒乓球比赛。", pinyin: "Wǒ zuì xǐhuan pīngpāngqiú bǐsài.", translation: "ฉันชอบการแข่งขันปิงปองมากที่สุด", action: "Table tennis paddle action" },
          { text: "我最喜欢接力比赛。", pinyin: "Wǒ zuì xǐhuan jiēlì bǐsài.", translation: "ฉันชอบการแข่งขันวิ่งผลัดมากที่สุด", action: "Passing baton action" }
        ],
        qaPairs: [
          { name: "娜娜", animal: "接力比赛", pinyin: "Nàna / jiēlì bǐsài", zh: "接力" },
          { name: "王冬冬", animal: "排球比赛", pinyin: "Wáng Dōngdōng / páiqiú bǐsài", zh: "排球" },
          { name: "麦克", animal: "乒乓球比赛", pinyin: "Màikè / pīngpāngqiú bǐsài", zh: "乒乓球" },
          { name: "凯特", animal: "足球比赛", pinyin: "Kǎitè / zúqiú bǐsài", zh: "足球" },
          { name: "马丁", animal: "篮球比赛", pinyin: "Mǎdīng / lánqiú bǐsài", zh: "篮球" },
          { name: "孙浩", animal: "拔河比赛", pinyin: "Sūnhào / báhé bǐsài", zh: "拔河" }
        ],
        questions: [
            { zh: "马丁喜欢什么比赛？", py: "Mǎdīng xǐhuan shénme bǐsài?", th: "มาร์ตินชอบการแข่งขันอะไร" },
            { zh: "娜娜喜欢什么比赛？", py: "Nàna xǐhuan shénme bǐsài?", th: "นานะชอบการแข่งขันอะไร" },
            { zh: "王冬冬喜欢什么比赛？", py: "Wáng Dōngdōng xǐhuan shénme bǐsài?", th: "หวังตงตงชอบการแข่งขันอะไร" }
        ]
      },
      {
        id: 903,
        title: "Reading Story",
        type: "reading_story",
        titleZh: "运动会",
        story: [
          { zh: "我们学校的运动会非常有趣，", py: "Wǒmen xuéxiào de yùndònghuì fēicháng yǒuqù,", th: "งานกีฬาสีของโรงเรียนเราสนุกมาก" },
          { zh: "有篮球比赛、拔河比赛、接力比赛和啦啦队表演。", py: "yǒu lánqiú bǐsài, báhé bǐsài, jiēlì bǐsài hé lālāduì biǎoyǎn.", th: "มีการแข่งขันบาสเกตบอล ชักเย่อ วิ่งผลัด และการแสดงเชียร์ลีดเดอร์" },
          { zh: "我最喜欢拔河比赛和啦啦队表演。", py: "Wǒ zuì xǐhuan báhé bǐsài hé lālāduì biǎoyǎn.", th: "ฉันชอบการแข่งขันชักเย่อและการแสดงเชียร์ลีดเดอร์มากที่สุด" }
        ],
        extraVocab: [
          { word: "队", pinyin: "duì", translation: "ทีม" },
          { word: "表演", pinyin: "biǎoyǎn", translation: "การแสดง/แสดง" }
        ],
        questions: [
          { qZh: "运动会有足球比赛和篮球比赛。", qPy: "Yùndònghuì yǒu zúqiú bǐsài hé lánqiú bǐsài.", qTh: "งานกีฬาสีมีการแข่งขันฟุตบอลและบาสเกตบอล", answer: "X" },
          { qZh: "运动会没有啦啦队表演。", qPy: "Yùndònghuì méiyǒu lālāduì biǎoyǎn.", qTh: "งานกีฬาสีไม่มีการแสดงเชียร์ลีดเดอร์", answer: "X" },
          { qZh: "我不喜欢拔河比赛。", qPy: "Wǒ bù xǐhuan báhé bǐsài.", qTh: "ฉันไม่ชอบการแข่งขันชักเย่อ", answer: "X" }
        ],
        imageMatch: [
            { zh: "我喜欢足球比赛。", py: "Wǒ xǐhuan zúqiú bǐsài.", th: "ฉันชอบการแข่งขันฟุตบอล" },
            { zh: "我不喜欢跳远比赛。", py: "Wǒ bù xǐhuan tiàoyuǎn bǐsài.", th: "ฉันไม่ชอบการแข่งขันกระโดดไกล" },
            { zh: "我也喜欢乒乓球比赛。", py: "Wǒ yě xǐhuan pīngpāngqiú bǐsài.", th: "ฉันก็ชอบการแข่งขันปิงปองด้วย" },
            { zh: "我不喜欢篮球比赛。", py: "Wǒ bù xǐhuan lánqiú bǐsài.", th: "ฉันไม่ชอบการแข่งขันบาสเกตบอล" },
            { zh: "排球比赛非常有趣。", py: "Páiqiú bǐsài fēicháng yǒuqù.", th: "การแข่งขันวอลเลย์บอลสนุกมาก" }
        ]
      },
      {
        id: 904,
        title: "Writing Practice",
        type: "writing_tasks",
        chars: [
          { char: "最", pinyin: "zuì", translation: "ที่สุด" },
          { char: "比", pinyin: "bǐ", translation: "เปรียบ/แข่ง" },
          { char: "赛", pinyin: "sài", translation: "แข่งขัน" },
          { char: "趣", pinyin: "qù", translation: "สนุก/น่าสนใจ" }
        ],
        missingBlanks: [
          { text: "接力__赛。", py: "Jiēlì __sài.", full: "接力比赛。", th: "การแข่งขันวิ่งผลัด", opts: ["此", "北", "比"], ans: "比" },
          { text: "啦啦__表演。", py: "Lālā__ biǎoyǎn.", full: "啦啦队表演。", th: "การแสดงเชียร์ลีดเดอร์", opts: ["队", "认", "阶"], ans: "队" },
          { text: "__球。", py: "__qiú.", full: "足球。", th: "ฟุตบอล", opts: ["走", "足", "呈"], ans: "足" },
          { text: "打篮球非常有__。", py: "Dǎ lánqiú fēicháng yǒu __.", full: "打篮球非常有趣。", th: "เล่นบาสเกตบอลสนุกมาก", opts: ["起", "越", "趣"], ans: "趣" }
        ],
        componentsMatch: [
          { char: "赛", comps: ["穴", "贝"] },
          { char: "最", comps: ["日", "取"] },
          { char: "篮", comps: ["竹", "监"] },
          { char: "趣", comps: ["走", "取"] },
          { char: "喜", comps: ["士", "口"] }
        ],
        copyTasks: [
          { char: "远", phrase: "跳远", th: "กระโดดไกล" },
          { char: "高", phrase: "跳高", th: "กระโดดสูง" }
        ]
      },
      {
        id: 905,
        title: "Pinyin Practice",
        type: "pinyin_erhua",
        intro: "ฝึกเสียงม้วนลิ้นท้ายพยางค์ r 儿化音",
        description: "ในภาษาจีน ท้ายพยางค์ของคำบางคำจะมีเสียง “r” ซึ่งต้องออกเสียงม้วนลิ้นรวมกับพยางค์ด้านหน้า เรียกว่าเสียงม้วนลิ้นท้ายพยางค์ หรือ 儿化音",
        sets: [
          { items: [{ zh: "牌儿", py: "páir" }, { zh: "店儿", py: "diànr" }, { zh: "头儿", py: "tóur" }, { zh: "盖儿", py: "gàir" }] },
          { items: [{ zh: "歌儿", py: "gēr" }, { zh: "孩儿", py: "háir" }, { zh: "画儿", py: "huàr" }, { zh: "尖儿", py: "jiānr" }] },
          { items: [{ zh: "信儿", py: "xìnr" }, { zh: "绳儿", py: "shéngr" }, { zh: "眼儿", py: "yǎnr" }, { zh: "玩儿", py: "wánr" }] }
        ],
        vocab: [
          { zh: "这儿", py: "zhèr", th: "ที่นี่" },
          { zh: "那儿", py: "nàr", th: "ที่นั่น" },
          { zh: "哪儿", py: "nǎr", th: "ที่ไหน" },
          { zh: "面条儿", py: "miàntiáor", th: "บะหมี่" },
          { zh: "女孩儿", py: "nǚháir", th: "เด็กผู้หญิง" },
          { zh: "男孩儿", py: "nánháir", th: "เด็กผู้ชาย" }
        ],
        rhyme: [
          { zh: "出东门儿，", py: "Chū dōngménr,", th: "ออกประตูตะวันออก" },
          { zh: "过大桥，", py: "guò dà qiáo,", th: "ข้ามสะพานใหญ่" },
          { zh: "大桥底下一树枣儿。", py: "dà qiáo dǐxia yí shù zǎor.", th: "ใต้สะพานใหญ่มีต้นพุทราหนึ่งต้น" },
          { zh: "拿着竿子去打枣儿，", py: "Názhe gānzi qù dǎ zǎor,", th: "ถือไม้ไผ่ไปตีพุทรา" },
          { zh: "青的多，", py: "qīng de duō,", th: "ลูกสีเขียวมีมาก" },
          { zh: "红 de 少。", py: "hóng de shǎo.", th: "ลูกสีแดงมีน้อย" }
        ]
      },
      {
        id: 906,
        title: "Fun Activities",
        type: "fun_content",
        matchPairs: [
          { zh: "比赛", py: "bǐsài" },
          { zh: "有趣", py: "yǒuqù" },
          { zh: "接力", py: "jiēlì" },
          { zh: "拔河", py: "báhé" },
          { zh: "啦啦队", py: "lālāduì" },
          { zh: "最", py: "zuì" },
          { zh: "足球", py: "zúqiú" },
          { zh: "跳高", py: "tiàogāo" },
          { zh: "跳远", py: "tiàoyuǎn" }
        ],
        charades: ["跳高", "跳远", "拔河", "接力", "足球", "篮球", "排球", "乒乓球", "跑步", "啦啦队"],
        interview: {
          qZh: "你最喜欢什么比赛？",
          qPy: "Nǐ zuì xǐhuan shénme bǐsài?",
          qTh: "เธอชอบการแข่งขันอะไรมากที่สุด",
          options: [
            { zh: "拔河", py: "báhé" },
            { zh: "接力", py: "jiēlì" },
            { zh: "跳高", py: "tiàogāo" },
            { zh: "跳远", py: "tiàoyuǎn" },
            { zh: "其他", py: "qítā" }
          ]
        }
      }
    ]
  }
];
