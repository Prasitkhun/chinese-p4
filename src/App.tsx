import React, { useState, useEffect, useMemo, useCallback, Fragment } from 'react';
import { Routes, Route, Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Gamepad2, 
  Trophy, 
  Play, 
  ChevronRight,
  ChevronLeft,
  TrendingUp,
  Award,
  Bell,
  Menu,
  X,
  Sparkles,
  Zap,
  Star,
  CheckCircle2,
  Heart,
  Volume2,
  RefreshCw,
  MessageCircle,
  RotateCcw,
  Book,
  Tv,
  Flower2,
  HeartPulse,
  Apple,
  TramFront,
  UtensilsCrossed,
  Map as MapIcon,
  Layers,
  Music,
  Plane,
  Train,
  Bike,
  Bus,
  Car,
  CarFront,
  Square,
  Footprints,
  School,
  MapPin,
  Users,
  Calendar,
  ListChecks,
  Repeat,
  Mic,
  Shuffle,
  HelpCircle,
  Filter,
  ArrowRight,
  Music2,
  Check,
  Search,
  LayoutGrid,
  Table
} from 'lucide-react';
import { LESSONS_DATA } from './lib/lessons';
import { ChineseButton, ChineseCard, Mascot, SidebarItem, UnitInfo, ThreeDContainer } from './components/ui/ChineseElements';
import { cn } from './lib/utils';
import ReactMarkdown from 'react-markdown';
import { GlobalLockProvider, useGlobalLock } from './contexts/GlobalLockContext';

// --- Helper Functions ---

const pinyinMap: Record<string, string> = {
  // Lesson 1: j, q, x
  "jī": "鸡", "qī": "七", "xī": "西", "jú": "局", "qú": "渠", "xú": "徐",
  "jì": "计", "qì": "气", "xì": "系", "jù": "具", "qù": "去", "xù": "续",
  "jīn": "金", "qīn": "亲", "xīn": "新", "jué": "觉", "qué": "瘸", "xué": "学",
  "jǔ": "举", "qǔ": "取", "xǔ": "许", "juè": "撅", "què": "却", "xuè": "血",
  "jiā": "加", "qiā": "掐", "xiā": "虾", "jié": "节", "qié": "茄", "xié": "鞋",
  "jiǔ": "九", "qiǔ": "糗", "xiǔ": "朽", "jiàn": "见", "qiàn": "欠", "xiàn": "现",
  "juǎn": "卷", "quǎn": "犬", "xuǎn": "选", "jiáo": "嚼", "qiáo": "桥", "xiáo": "淆",
  "jiǎng": "讲", "qiǎng": "抢", "xiǎng": "想", "juàn": "卷", "quàn": "劝", "xuàn": "炫",
  // Lesson 2: zh, ch, sh
  "zhū": "猪", "chū": "出", "shū": "书", "zhá": "闸", "chá": "茶", "shá": "啥",
  "zhǎ": "眨", "chǎ": "炒", "shǎ": "傻", "zhí": "职", "chí": "池", "shí": "十",
  "zhāo": "招", "chāo": "抄", "shāo": "烧", "zháo": "着", "cháo": "潮", "sháo": "勺",
  "zhuāng": "装", "chuāng": "窗", "shuāng": "双", "zhóu": "轴", "chóu": "筹", "shóu": "熟",
  "zhě": "者", "chě": "扯", "shě": "舍", "zhì": "制", "chì": "赤", "shì": "是",
  "zhǔ": "煮", "chǔ": "楚", "shǔ": "暑", "zhà": "炸", "chà": "差", "shà": "霎",
  "zhǎo": "找", "chǎo": "吵", "shǎo": "少", "zhòu": "昼", "chòu": "臭", "shòu": "受",
  "zhǔn": "准", "chǔn": "蠢", "shǔn": "吮", "zhàng": "仗", "chàng": "唱", "shàng": "上",
  // Lesson 3: l, r
  "lā": "拉", "rā": "然", "lú": "炉", "rú": "如",
  "lǔ": "鲁", "rǔ": "乳", "lù": "路", "rù": "入",
  "lāo": "捞", "ráo": "饶", "lǎo": "老", "rǎo": "扰",
  "lòu": "漏", "ròu": "肉", "láng": "廊", "ráng": "瓤",
  "lán": "蓝", "rán": "然", "lǎng": "朗", "rǎng": "嚷",
  "luò": "落", "ruò": "若", "lēng": "冷", "rēng": "扔",
  "léng": "楞", "réng": "仍", "lóng": "龙", "róng": "荣",
  "lùn": "论", "rùn": "润",
  // Lesson 4: g, k, h (and z, c, s for request)
  "gā": "嘎", "gá": "嘎", "gǎ": "嘎", "gà": "尬",
  "kā": "咖", "ká": "卡", "kǎ": "卡", "kà": "卡",
  "hā": "哈", "há": "哈", "hǎ": "哈", "hà": "哈",
  "gē": "哥", "gé": "阁", "gě": "个", "gè": "个",
  "kē": "科", "ké": "科", "kě": "可", "kè": "课",
  "hē": "喝", "hé": "和", "hě": "和", "hè": "贺", "huó": "活",
  "zā": "匝", "cā": "擦", "sā": "撒",
  "zè": "仄", "cè": "侧", "sè": "色",
  "zī": "资", "cī": "呲", "sī": "私",
  "zú": "足", "cū": "粗", "sū": "苏",
  "záo": "凿", "cáo": "曹", "sú": "俗",
  // Common
  "rè": "热", "lè": "乐", "nǎr": "哪儿", "ér": "儿", "miǎn": "免", "fèn": "份",
  "bù": "不", "bú": "不", "yī": "一", "yí": "一", "yì": "一",
  "mā": "妈", "má": "麻", "mǎ": "马", "mà": "骂",
  // Lesson 5: Activities
  "pǎobù": "跑步", "jiějie": "姐姐", "zuòyè": "作业", "fàngxué": "放学", "tóngxué": "同学",
  "xuě": "雪", "fēng": "风", "huādiàn": "花店", "huà": "วาด", "shuǐguǒdiàn": "水果店", "huǒchē": "火车", "zhuōzi": "桌子",
  "huā": "花", "tīng": "听", "yīnyuè": "音乐", "shuō": "说", "zài": "在"
};

const speakPinyin = (pinyin: string, options?: { rate?: number; onStart?: () => void; onEnd?: () => void }) => {
  const syllables = pinyin.toLowerCase().split(/[\s,.\?!\-]+/).filter(Boolean);
  let speakText = "";
  
  if (syllables.every(s => pinyinMap[s])) {
    speakText = syllables.map(s => pinyinMap[s]).join('');
  } else {
    // If not in map, try to reconstruct or fallback
    speakText = syllables.map(s => pinyinMap[s] || s).join(' ');
  }
  
  speakChinese(speakText, options);
};

const speakPinyinSequence = async (pinyinList: string[], rate: number = 0.75, onStart?: (py: string) => void, onEnd?: () => void) => {
  for (const py of pinyinList) {
    onStart?.(py);
    await new Promise<void>((resolve) => {
      speakPinyin(py, {
        rate,
        onEnd: () => resolve()
      });
    });
    // Brief pause between syllables
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  onEnd?.();
};

const speakChinese = (text: string, options?: { rate?: number; onStart?: () => void; onEnd?: () => void }) => {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return;
  }

  window.speechSynthesis.cancel();

  let speakText = text;
  
  // If text is pinyin, use mapping for better pronunciation
  const isPinyin = /^[a-zA-Zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ\s,.\?!\-]+$/.test(text);
  if (isPinyin) {
    const syllables = text.toLowerCase().split(/[\s,.\?!\-]+/).filter(Boolean);
    if (syllables.every(s => pinyinMap[s])) {
      speakText = syllables.map(s => pinyinMap[s] || s).join('');
    } else {
      // Fallback: stay as is, but maybe slow it down more for safety
    }
  }
  
  const utterance = new SpeechSynthesisUtterance(speakText);
  utterance.lang = 'zh-CN';
  utterance.rate = options?.rate || 0.8;
  utterance.pitch = 1;

  const voices = window.speechSynthesis.getVoices();
  // Preferred voices in order
  const getPreferredVoice = () => {
    const zhCNVoices = voices.filter(v => v.lang.toLowerCase().includes('zh-cn'));
    if (zhCNVoices.length > 0) {
      // Prefer Google or Microsoft or some specific high quality ones
      return zhCNVoices.find(v => v.name.includes('Google') || v.name.includes('Premium') || v.name.includes('Mandarin')) || zhCNVoices[0];
    }
    return voices.find(v => v.lang.toLowerCase().startsWith('zh')) || null;
  };

  const chineseVoice = getPreferredVoice();
  if (chineseVoice) {
    utterance.voice = chineseVoice;
  }

  utterance.onstart = () => options?.onStart?.();
  utterance.onend = () => options?.onEnd?.();
  utterance.onerror = () => options?.onEnd?.();

  window.speechSynthesis.speak(utterance);
};

// --- Shared Components ---

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="h-full"
    >
      {children}
    </motion.div>
  );
}

const AVATARS: Record<string, string> = {
  "Nana": "👧",
  "Mading": "👦",
  "Teacher": "🧑‍🏫",
  "Mike": "👱",
  "Mama": "👩",
  "Papa": "👨",
  "Students": "🧑‍🎓",
  "Students ": "🧑‍🎓",
  "Nana & Mading": "👫",
  "Grandpa": "👴",
  "Grandma": "👵",
  "Role": "👤"
};

const RoleAvatar = ({ role, className = "" }: { role: string, className?: string }) => {
  const emoji = AVATARS[role] || AVATARS[role.trim()] || "👤";
  const isTeacher = role.toLowerCase().includes('teacher') || role.includes('คุณครู') || role.includes('ครู');
  
  return (
    <div className={cn("relative group shrink-0", className)}>
      <ThreeDContainer color={isTeacher ? "gold" : "blue"} size="sm">
        {emoji}
      </ThreeDContainer>
    </div>
  );
};

// Header Component
const Header = ({ xp, level, toggleSidebar }: { xp: number, level: number, toggleSidebar: () => void }) => (
  <header className="h-16 md:h-20 bg-chinese-red shadow-lg sticky top-0 z-[100] px-4 md:px-8 flex items-center justify-between overflow-hidden">
    {/* Background Pattern */}
    <div className="absolute inset-0 opacity-10 pointer-events-none flex flex-wrap gap-4 p-2">
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={`header-bg-${i}`} className="w-8 h-8 rounded-full border-2 border-white/50 bg-transparent rotate-45" />
      ))}
    </div>

    <div className="flex items-center gap-4 relative z-10">
      <button 
        onClick={toggleSidebar}
        className="lg:hidden p-2 text-white hover:bg-white/10 rounded-xl transition-colors"
      >
        <Menu className="w-6 h-6" />
      </button>
      <Link to="/" className="flex items-center gap-3 group">
        <div className="hidden sm:block">
          <h1 className="text-white text-xl font-black font-chinese leading-none tracking-tight">你好 ป.4</h1>
          <p className="text-chinese-gold text-[10px] uppercase font-bold tracking-widest opacity-80">Ni Hao Primary 4</p>
        </div>
      </Link>
    </div>

    <div className="flex items-center gap-3 md:gap-6 relative z-10">
      <div className="flex items-center gap-2 md:gap-4 bg-black/20 rounded-full px-3 md:px-5 py-1.5 border border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-chinese-gold rounded-full flex items-center justify-center">
            <Zap className="w-4 h-4 text-chinese-red fill-chinese-red" />
          </div>
          <span className="text-white font-bold text-sm md:text-base">{xp} XP</span>
        </div>
        <div className="w-px h-4 bg-white/20" />
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
            <span className="text-chinese-red font-black text-xs">L{level}</span>
          </div>
          <span className="text-white font-bold text-xs uppercase hidden md:inline opacity-70">Lv. {level}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
      </div>
    </div>
  </header>
);

// Sidebar Component
const Sidebar = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const params = useParams();
  const currentId = params.id ? parseInt(params.id) : null;
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', String(isCollapsed));
  }, [isCollapsed]);
  
  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>
      
      <motion.aside
        initial={false}
        animate={{ 
          x: isOpen ? 0 : (window.innerWidth < 1024 ? "-100%" : 0),
          width: isCollapsed ? "84px" : (window.innerWidth < 1280 ? "250px" : "300px")
        }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
        className={cn(
          "fixed inset-y-0 left-0 bg-white border-r-4 border-chinese-red/5 z-[70] overflow-y-auto no-scrollbar lg:relative lg:translate-x-0 shadow-2xl lg:shadow-none h-full",
          (isOpen || window.innerWidth >= 1024) ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className={cn("p-4 md:p-6 transition-all duration-300 relative h-full flex flex-col", isCollapsed && "px-2")}>
          <div className="flex items-center justify-between mb-6">
            <div className={cn("flex items-center gap-2", isCollapsed && "justify-center w-full")}>
              <div className="w-10 h-10 bg-chinese-red rounded-xl flex items-center justify-center text-white shadow-lg">
                <BookOpen className="w-6 h-6" />
              </div>
              {!isCollapsed && (
                <div className="min-w-0">
                  <h2 className="text-lg font-black text-gray-900 leading-tight">บทเรียน</h2>
                  <p className="text-[10px] text-chinese-red font-bold uppercase tracking-tighter">Unit Lessons</p>
                </div>
              )}
            </div>
            {!isCollapsed && (
              <button onClick={onClose} className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="space-y-2 flex-1">
            {LESSONS_DATA.map((lesson) => (
              <Link 
                key={`sidebar-lesson-${lesson.id}`} 
                to={`/lesson/${lesson.id}`}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
              >
                <SidebarItem 
                  unitNum={lesson.id}
                  title={isCollapsed ? "" : lesson.translation.split(' (')[0]}
                  chineseTitle={isCollapsed ? "" : lesson.title}
                  isActive={currentId === lesson.id && location.pathname.includes('/lesson')}
                  isCompleted={lesson.id < 4}
                  onClick={() => {}}
                  hideNumber={lesson.hideNumber}
                  icon={Sparkles}
                />
              </Link>
            ))}
          </div>
          
          {!isCollapsed && (
            <div className="mt-12 p-4 bg-chinese-gold/10 rounded-3xl border-2 border-chinese-gold/20 relative overflow-hidden group">
              <Sparkles className="w-8 h-8 text-chinese-gold-dark absolute -right-2 -top-2 opacity-50 group-hover:rotate-12 transition-transform" />
              <p className="text-chinese-gold-dark font-black text-sm mb-1 uppercase tracking-wider">Mission</p>
              <p className="text-gray-700 font-bold text-xs">เรียนให้ครบทุกบท รับตราหยกมังกร!</p>
              <div className="mt-3 h-2 bg-white rounded-full overflow-hidden">
                <div className="h-full bg-chinese-gold" style={{ width: '33%' }} />
              </div>
            </div>
          )}

          {/* Collapse Toggle for Desktop */}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex absolute bottom-8 left-1/2 -translate-x-1/2 w-10 h-10 bg-white border-2 border-gray-100 rounded-full items-center justify-center shadow-md hover:bg-chinese-red hover:text-white transition-all text-gray-400 group"
          >
            <ChevronRight className={cn("w-5 h-5 transition-transform", isCollapsed ? "" : "rotate-180")} />
          </button>
        </div>
      </motion.aside>
    </>
  );
};

// Main Dashboard Content
const DashboardContent = () => (
  <PageTransition>
    <div className="h-full p-3 md:p-6 flex flex-col gap-4 max-w-7xl mx-auto">
      {/* Mini Welcome / Status Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white/40 backdrop-blur-md rounded-3xl p-4 border-2 border-white shadow-sm">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-lg md:text-2xl font-black text-gray-900 font-chinese leading-tight">สวัสดี! วันนี้เรียนอะไรดี?</h2>
            <p className="text-xs md:text-sm font-bold text-chinese-red uppercase tracking-widest">Ni hao! Ready to adventure?</p>
          </div>
        </div>
        
        <div className="hidden lg:flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Current Progress</p>
            <p className="text-sm font-bold text-gray-700">3 of 12 Units Completed</p>
          </div>
          <div className="w-32 h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
            <div className="h-full bg-emerald-500 w-[30%]" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ChineseButton size="sm" variant="gold" className="text-xs px-4">
            <Trophy className="w-4 h-4" />
            Rankings
          </ChineseButton>
          <ChineseButton size="sm" variant="ghost" className="text-xs px-4">
            <Gamepad2 className="w-4 h-4" />
            Play
          </ChineseButton>
        </div>
      </div>

      {/* 9 Units One-Screen Grid */}
      <motion.section 
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.05
            }
          }
        }}
        className="flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 md:gap-4 overflow-hidden py-2"
      >
        {LESSONS_DATA.map((lesson, idx) => (
          <motion.div
            key={`dashboard-lesson-wrapper-${lesson.id}`}
            variants={{
              hidden: { opacity: 0, y: 15 },
              show: { opacity: 1, y: 0 }
            }}
          >
            <Link 
              to={`/lesson/${lesson.id}`}
              className="block h-full min-h-[170px]"
            >
              <ChineseCard 
                className={cn(
                  "group h-full p-3 md:p-4 relative overflow-hidden flex flex-col justify-between",
                  idx === 2 || idx === 5 || idx === 8 ? "border-l-chinese-gold-dark/20" : ""
                )}
                variant={idx % 2 === 0 ? "default" : "gold"}
              >
              <div className="flex justify-between items-start">
                <div className="flex gap-2 md:gap-3 items-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-chinese-red/10 rounded-2xl flex items-center justify-center font-black text-xl md:text-2xl text-chinese-red group-hover:bg-chinese-red group-hover:text-white transition-all font-chinese shadow-inner">
                    {lesson.hideNumber ? (
                      <Sparkles className="w-6 h-6" />
                    ) : (
                      lesson.id
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3].map(s => (
                    <Star 
                      key={`unit-${lesson.id}-star-${s}`} 
                      className={cn(
                        "w-3 h-3 md:w-4 md:h-4 transition-colors",
                        s <= (idx % 3 + 1) ? "text-chinese-gold fill-chinese-gold" : "text-gray-200 fill-gray-200"
                      )} 
                    />
                  ))}
                </div>
              </div>

              <div className="mt-2 space-y-2 flex-1">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[7px] md:text-[8px] font-black uppercase text-gray-400 tracking-tighter block leading-none mb-1">ชื่อบท (ไทย):</span>
                    <h3 className="text-[10px] md:text-xs font-black text-gray-800 line-clamp-1 leading-tight">{lesson.translation.split(' (')[0]}</h3>
                  </div>
                  <div>
                    <span className="text-[7px] md:text-[8px] font-black uppercase text-gray-400 tracking-tighter block leading-none mb-1">ชื่อบท (จีน):</span>
                    <p className="text-chinese-red font-chinese font-bold text-xs md:text-sm line-clamp-1 leading-tight">{lesson.title}</p>
                  </div>
                </div>
                
                <div>
                  <span className="text-[7px] md:text-[8px] font-black uppercase text-gray-400 tracking-tighter block leading-none mb-1">พินอิน:</span>
                  <p className="text-[10px] md:text-xs font-bold text-chinese-gold-dark line-clamp-1">{lesson.pinyin}</p>
                </div>

                <div className="pt-2 border-t border-chinese-red/5 grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[7px] md:text-[8px] font-black uppercase text-gray-400 tracking-tighter block leading-none mb-1">Key Concept:</span>
                    <p className="text-[9px] text-gray-500 font-bold line-clamp-1 leading-none">{lesson.keyConcepts?.[0]}</p>
                  </div>
                  <div>
                    <span className="text-[7px] md:text-[8px] font-black uppercase text-gray-400 tracking-tighter block leading-none mb-1">Vocabulary Focus:</span>
                    <p className="text-[9px] text-gray-500 font-bold line-clamp-1 leading-none">{lesson.vocabFocus?.[0]}</p>
                  </div>
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    idx < 3 ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-gray-200"
                  )} />
                  <span className="text-[9px] font-bold text-gray-400">{idx < 3 ? "เรียนแล้ว" : "ยังไม่เรียน"}</span>
                </div>
                {idx < 3 && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
              </div>
            </ChineseCard>
          </Link>
        </motion.div>
      ))}
    </motion.section>

      {/* Mini Footer / Quick Stats */}
      <div className="flex items-center justify-center gap-6 md:gap-12 py-3 border-t border-chinese-red/5">
        <div className="flex items-center gap-2 text-[11px] font-black text-chinese-red uppercase tracking-widest border-r border-gray-100 pr-6">
          <Heart className="w-3 h-3 fill-chinese-red" />
          <span>by ครูต้น</span>
        </div>
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-chinese-red" />
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">11 Units Total</span>
        </div>
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-chinese-gold" />
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">3 Certificates</span>
        </div>
        <div className="flex items-center gap-2 text-chinese-red animate-pulse">
          <Sparkles className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-widest">Daily Quest Active</span>
        </div>
      </div>
    </div>
  </PageTransition>
);


enum ActivityType {
  VOCABULARY = 'vocabulary',
  LISTENING = 'listening',
  SPEAKING = 'speaking',
  READING = 'reading',
  WRITING = 'writing',
  PINYIN = 'pinyin',
  FUN = 'fun',
  FINAL = 'final',
  LIBRARY = 'library',
  FINAL_REVIEW = 'final_review'
}

// Speaking Lesson 1 component
const SpeakingLesson1 = ({ activity, speak, setActiveActivity }: { activity: any, speak: (t: string, r?: number) => void, setActiveActivity: (a: ActivityType) => void }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [hasPracticed, setHasPracticed] = useState(false);
  
  const currentSentence = activity.sentences[currentIdx];

  const handlePractice = () => {
    setHasPracticed(true);
  };

  useEffect(() => {
    setHasPracticed(false);
  }, [currentIdx]);

  return (
    <div className="space-y-12 pb-20">
      <div className="bg-emerald-500 p-8 rounded-4xl text-white shadow-lg">
        <h3 className="text-3xl font-black mb-2">กิจกรรมการฝึกพูด (SPEAKING)</h3>
        <p className="font-bold opacity-90">ฝึกออกเสียงตามประโยคที่กำหนด</p>
      </div>

      <div className="max-w-3xl mx-auto bg-white rounded-5xl border-4 border-emerald-100 shadow-2xl p-8 md:p-12 relative overflow-hidden">
        {/* Progress Dots */}
        <div className="flex gap-2 justify-center mb-10">
          {activity.sentences.map((_: any, i: number) => (
            <div 
              key={`dot-${i}`} 
              className={cn(
                "h-2 rounded-full transition-all duration-500",
                i === currentIdx ? "w-8 bg-emerald-500" : "w-2 bg-emerald-100"
              )}
            />
          ))}
        </div>

        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h4 className="text-5xl md:text-7xl font-chinese font-black text-gray-900">{currentSentence.text}</h4>
            <p className="text-xl md:text-2xl font-bold text-emerald-600 tracking-widest">{currentSentence.pinyin}</p>
            <p className="text-lg text-gray-400 font-bold italic">{currentSentence.translation}</p>
          </div>

          <div className="flex flex-col items-center gap-8 py-8">
            <button 
              onClick={() => speak(currentSentence.text)}
              className="group flex items-center gap-3 px-10 py-6 bg-emerald-50 text-emerald-600 rounded-3xl border-2 border-emerald-100 font-black hover:bg-emerald-500 hover:text-white transition-all shadow-md active:scale-95 text-xl"
            >
              <Volume2 className="w-8 h-8 group-hover:animate-pulse" />
              ฟังเสียงครู (Listen)
            </button>

            <div className="relative">
              <button 
                onClick={handlePractice}
                className={cn(
                  "w-32 h-32 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all relative z-10 border-8 border-white",
                  hasPracticed ? "bg-emerald-600 scale-110" : "bg-emerald-500 hover:bg-emerald-400"
                )}
              >
                {hasPracticed ? (
                  <CheckCircle2 className="w-12 h-12 text-white animate-in zoom-in duration-300" />
                ) : (
                  <MessageCircle className="w-12 h-12 text-white" />
                )}
              </button>
              <p className="mt-4 font-black text-gray-500 uppercase tracking-widest text-sm">
                {hasPracticed ? "ฝึกพูดแล้ว! (Practiced)" : "ฝึกพูดออกเสียงแล้วกดปุ่ม"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-12">
          <button 
            disabled={currentIdx === 0}
            onClick={() => { setCurrentIdx(idx => idx - 1); }}
            className="p-4 rounded-2xl bg-gray-50 text-gray-400 hover:bg-gray-100 disabled:opacity-30 transition-all font-black flex items-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" />
            ก่อนหน้า
          </button>
          
          {currentIdx === activity.sentences.length - 1 ? (
             <button 
                disabled={!hasPracticed}
                className={cn(
                  "px-8 py-4 text-white rounded-2xl font-black shadow-lg transition-all flex items-center gap-2",
                  hasPracticed ? "bg-chinese-red hover:scale-105 active:scale-95" : "bg-gray-300 cursor-not-allowed"
                )}
                onClick={() => window.history.back()}
             >
                จบกิจกรรม
                <Trophy className="w-5 h-5" />
             </button>
          ) : (
            <button 
              disabled={!hasPracticed}
              onClick={() => { setCurrentIdx(idx => idx + 1); }}
              className={cn(
                "px-8 py-4 text-white rounded-2xl font-black shadow-lg transition-all flex items-center gap-2",
                hasPracticed ? "bg-emerald-500 hover:scale-105 active:scale-95" : "bg-gray-300 cursor-not-allowed"
              )}
            >
              ถัดไป
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const ReadingLesson1 = ({ lesson, setActiveActivity }: { lesson: any, setActiveActivity: (a: ActivityType) => void }) => {
  const [completed, setCompleted] = useState<Record<number, boolean>>({});
  
  const READING_DATA = [
    { zh: "看！那里是花店。", py: "Kàn! Nàli shì huādiàn.", th: "ดูสิ! ที่นั่นคือร้านดอกไม้" },
    { zh: "花真漂亮！", py: "Huā zhēn piàoliang!", th: "ดอกไม้สวยจริง ๆ" },
    { zh: "看！那里是学校。", py: "Kàn! Nàli shì xuéxiào.", th: "ดูสิ! ที่นั่นคือโรงเรียน" },
    { zh: "学校真漂亮！", py: "Xuéxiào zhēn piàoliang!", th: "โรงเรียนสวยจริง ๆ" },
    { zh: "看！那里是电影院。", py: "Kàn! Nàli shì diànyǐngyuàn.", th: "ดูสิ! ที่นั่นคือโรงภาพยนตร์" },
    { zh: "电影院真远！", py: "Diànyǐngyuàn zhēn yuǎn!", th: "โรงภาพยนตร์ไกลจริง ๆ" },
    { zh: "电影院在哪儿？", py: "Diànyǐngyuàn zài nǎr?", th: "โรงภาพยนตร์อยู่ที่ไหน" },
    { zh: "在那里。", py: "Zài nàli.", th: "อยู่ที่นั่น" }
  ];

  const VOCAB_BONUS = [
    { word: "花", pinyin: "huā", trans: "ดอกไม้" },
    { word: "漂亮", pinyin: "piàoliang", trans: "สวย" },
    { word: "学校", pinyin: "xuéxiào", trans: "โรงเรียน" },
    { word: "真", pinyin: "zhēn", trans: "จริง ๆ / มาก" },
    { word: "在哪儿", pinyin: "zài nǎr", trans: "อยู่ที่ไหน" },
    { word: "在那里", pinyin: "zài nàli", trans: "อยู่ที่นั่น" }
  ];

  const SENTENCE_BONUS = [
    { zh: "花店很近。", py: "Huādiàn hěn jìn.", th: "ร้านดอกไม้อยู่ใกล้มาก" },
    { zh: "学校不远。", py: "Xuéxiào bù yuǎn.", th: "โรงเรียนไม่ไกล" }
  ];

  const completedCount = Object.values(completed).filter(Boolean).length;
  const isFinished = completedCount === READING_DATA.length;

  const handleSpeak = (text: string) => {
    speakChinese(text, { rate: 0.8 });
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Header Section */}
      <div className="bg-blue-500 p-8 rounded-4xl text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-3xl font-black mb-2 uppercase tracking-tight">กิจกรรมฝึกอ่าน (READING)</h3>
          <p className="font-bold opacity-90">บทที่ 1: {lesson.title} {lesson.translation.split(' (')[0]}</p>
          <div className="mt-4 bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/30 inline-block font-bold">
            คำสั่ง: ฟังเสียงประโยคแล้วอ่านตาม
          </div>
        </div>
        <BookOpen className="w-48 h-48 absolute -right-12 -bottom-12 text-white/10 rotate-12" />
      </div>

      {/* Progress Tracker */}
      <div className="flex flex-col items-center gap-4">
        <div className="w-full max-w-md bg-white border-4 border-blue-100 rounded-3xl p-6 shadow-sm">
          <div className="flex justify-between items-end mb-2 h-8">
            <span className="font-black text-blue-600 text-lg">อ่านแล้ว {completedCount}/{READING_DATA.length}</span>
            {isFinished && (
              <motion.span 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                className="text-emerald-500 font-black text-sm"
              >
                เยี่ยมมาก! อ่านครบแล้ว ✨
              </motion.span>
            )}
          </div>
          <div className="h-4 bg-blue-50 rounded-full overflow-hidden border-2 border-blue-100">
            <motion.div 
              className="h-full bg-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / READING_DATA.length) * 100}%` }}
              transition={{ type: "spring", bounce: 0, duration: 0.8 }}
            />
          </div>
        </div>
      </div>

      {/* Reading Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {READING_DATA.map((item, idx) => (
          <motion.div 
            key={`reading-card-${idx}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={cn(
              "bg-white p-8 rounded-[2.5rem] border-4 transition-all relative overflow-hidden",
              completed[idx] ? "border-emerald-400 shadow-lg shadow-emerald-50" : "border-blue-50 hover:border-blue-200"
            )}
          >
            {completed[idx] && (
              <div className="absolute top-4 right-4 bg-emerald-500 text-white p-1 rounded-full">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            )}
            
            <div className="mb-6">
              <span className="bg-blue-50 text-blue-400 w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm mb-4">
                {idx + 1}
              </span>
              <div className="min-h-[160px] flex flex-col justify-center">
                <h4 className="text-4xl font-chinese font-black text-gray-900 mb-2 leading-tight">{item.zh}</h4>
                <p className="text-xl font-bold text-blue-600 tracking-wider mb-2">{item.py}</p>
                <p className="text-gray-400 font-bold">{item.th}</p>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button 
                onClick={() => handleSpeak(item.zh)}
                className="flex-1 py-4 bg-blue-50 text-blue-600 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-blue-500 hover:text-white transition-all shadow-sm active:scale-95"
              >
                <Volume2 className="w-5 h-5" />
                ฟังเสียง
              </button>
              <button 
                onClick={() => setCompleted(prev => ({ ...prev, [idx]: true }))}
                className={cn(
                  "flex-1 py-4 rounded-2xl font-black transition-all shadow-sm active:scale-95",
                  completed[idx] 
                    ? "bg-emerald-500 text-white" 
                    : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                )}
              >
                {completed[idx] ? "อ่านแล้ว" : "อ่านแล้ว"}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ศัพท์เสริมน่ารู้ */}
      <div className="space-y-6 pt-10">
        <div className="flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-blue-500" />
          <h4 className="text-2xl font-black text-gray-900">ศัพท์เสริมน่ารู้</h4>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {VOCAB_BONUS.map((v, i) => (
            <div key={`vocab-bonus-${i}`} className="bg-white p-4 rounded-3xl border-2 border-blue-50 text-center hover:border-blue-400 transition-colors shadow-sm">
              <p className="text-2xl font-chinese font-black text-gray-900 mb-1">{v.word}</p>
              <p className="text-xs font-bold text-blue-500 mb-1">{v.pinyin}</p>
              <p className="text-xs text-gray-400 font-bold">{v.trans}</p>
            </div>
          ))}
        </div>
      </div>

      {/* อ่านประโยคเสริม */}
      <div className="space-y-6 pt-10">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-chinese-gold" />
          <h4 className="text-2xl font-black text-gray-900">อ่านประโยคเสริม</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SENTENCE_BONUS.map((s, i) => (
            <div key={`sent-bonus-${i}`} className="bg-white p-6 rounded-3xl border-2 border-blue-50 flex items-center justify-between gap-4 shadow-sm hover:border-blue-300 transition-all group">
              <div className="space-y-1">
                <p className="text-2xl font-chinese font-black text-gray-900">{s.zh}</p>
                <p className="text-sm font-bold text-blue-500">{s.py}</p>
                <p className="text-xs text-gray-400 font-bold">{s.th}</p>
              </div>
              <button 
                onClick={() => handleSpeak(s.zh)}
                className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all group-hover:scale-110 active:scale-95"
              >
                <Volume2 className="w-6 h-6" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const WritingLesson1 = ({ lesson }: { lesson: any }) => {
  const [progress, setProgress] = useState<Record<number, boolean>>({});
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string | null>>({});
  const [showExamples, setShowExamples] = useState(false);

  const completedCount = Object.values(progress).filter(Boolean).length;
  const totalSections = 4;
  const isFinished = completedCount === totalSections;

  const handleSpeak = (text: string) => {
    speakChinese(text, { rate: 0.8 });
  };

  const CHARS_DATA = [
    { char: "院", py: "yuàn", th: "อาคาร / สถานที่" },
    { char: "车", py: "chē", th: "รถ" },
    { char: "站", py: "zhàn", th: "สถานี" },
    { char: "花", py: "huā", th: "ดอกไม้" },
    { char: "远", py: "yuǎn", th: "ไกล" }
  ];

  const QUIZ_DATA = [
    { q: "这里是__店。", options: ["花", "书", "草"], correct: "书", full: "这里是书店。", fullPy: "Zhèli shì shūdiàn.", fullTh: "ที่นี่คือร้านหนังสือ" },
    { q: "这里是车__。", options: ["占", "位", "站"], correct: "站", full: "这里是车站。", fullPy: "Zhèli shì chēzhàn.", fullTh: "ที่นี่คือสถานีรถ" },
    { q: "那里是医__。", options: ["院", "完", "园"], correct: "院", full: "那里เป็น医院。", fullPy: "Nàli shì yīyuàn.", fullTh: "ที่นั่นคือโรงพยาบาล" },
    { q: "书店不__。", options: ["起", "远", "边"], correct: "远", full: "书店ไม่ไกล。", fullPy: "Shูdiàn bù yuǎn.", fullTh: "ร้านหนังสือไม่ไกล" }
  ];

  const STROKE_DATA = [
    { char: "车", word: "车站", py: "chēzhàn", th: "สถานีรถ" },
    { char: "店", word: "花店", py: "huādiàn", th: "ร้านดอกไม้" }
  ];

  const WritingGrid = ({ char, isTrace = false, isHeavy = false }: { char: string, isTrace?: boolean, isHeavy?: boolean }) => (
    <div className="relative w-24 h-24 bg-white border-2 border-gray-200 rounded-md flex items-center justify-center font-chinese text-5xl overflow-hidden group">
      {/* Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-400 border-t border-dashed" />
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-400 border-l border-dashed" />
        <div className="absolute inset-0 border-t border-l border-dashed border-gray-400 transform rotate-45 scale-150 origin-center" />
        <div className="absolute inset-0 border-t border-l border-dashed border-gray-400 transform -rotate-45 scale-150 origin-center" />
      </div>
      <span className={cn(
        isHeavy ? "text-chinese-red font-black" : isTrace ? "text-gray-100" : "text-gray-900",
        "relative z-10"
      )}>
        {char}
      </span>
    </div>
  );

  return (
    <div className="space-y-12 pb-20">
      {/* Header Section */}
      <div className="bg-purple-500 p-8 rounded-4xl text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-3xl font-black mb-2 uppercase tracking-tight">กิจกรรมฝึกเขียน (WRITING)</h3>
          <p className="font-bold opacity-90">บทที่ 1: {lesson.title} {lesson.translation.split(' (')[0]}</p>
        </div>
        <Zap className="w-48 h-48 absolute -right-12 -bottom-12 text-white/10 rotate-12" />
      </div>

      {/* Progress Tracker */}
      <div className="flex flex-col items-center">
        <div className="w-full max-w-md bg-white border-4 border-purple-100 rounded-3xl p-6 shadow-sm">
          <div className="flex justify-between items-end mb-2 h-8">
            <span className="font-black text-purple-600 text-lg">ทำแล้ว {completedCount}/{totalSections}</span>
            {isFinished && (
              <motion.span 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                className="text-emerald-500 font-black text-sm"
              >
                เยี่ยมมาก! ฝึกเขียนบทที่ 1 ครบแล้ว ✨
              </motion.span>
            )}
          </div>
          <div className="h-4 bg-purple-50 rounded-full overflow-hidden border-2 border-purple-100">
            <motion.div 
              className="h-full bg-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / totalSections) * 100}%` }}
              transition={{ type: "spring", bounce: 0, duration: 0.8 }}
            />
          </div>
        </div>
      </div>

      {/* 1. อ่านแล้วเขียนตัวอักษรจีน */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-purple-500 rounded-full" />
          <h4 className="text-2xl font-black text-gray-900">อ่านแล้วเขียนตัวอักษรจีน</h4>
        </div>
        <p className="text-gray-500 font-bold ml-5">อ่านตัวอักษรจีน แล้วฝึกเขียนตาม</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CHARS_DATA.map((item, idx) => (
            <div key={`char-w-${idx}`} className="bg-white p-8 rounded-[2.5rem] border-2 border-gray-100 shadow-sm hover:border-purple-300 transition-all space-y-4">
              <div className="flex justify-between items-start">
                 <div className="flex gap-4 items-center">
                    <div className="w-20 h-20 bg-purple-50 rounded-2xl flex items-center justify-center font-chinese text-5xl text-gray-900 border-2 border-purple-100">
                      {item.char}
                    </div>
                    <div>
                      <p className="text-2xl font-black text-purple-600">{item.py}</p>
                      <p className="text-sm font-bold text-gray-400">{item.th}</p>
                    </div>
                 </div>
                 <button 
                  onClick={() => handleSpeak(item.char)}
                  className="w-10 h-10 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center hover:bg-purple-600 hover:text-white transition-all shadow-sm"
                 >
                    <Volume2 className="w-5 h-5" />
                 </button>
              </div>
              <div className="flex justify-center p-4 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                <WritingGrid char={item.char} isTrace />
              </div>
              <button 
                onClick={() => setProgress(prev => ({ ...prev, 1: true }))}
                className="w-full py-4 bg-gray-100 text-gray-400 rounded-2xl font-black hover:bg-purple-600 hover:text-white transition-all shadow-sm"
              >
                เขียนแล้ว
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 2. วงกลมตัวอักษรจีนที่หายไป */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-chinese-gold rounded-full" />
          <h4 className="text-2xl font-black text-gray-900">วงกลมตัวอักษรจีนที่หายไป</h4>
        </div>
        <p className="text-gray-500 font-bold ml-5">เลือกตัวอักษรจีนที่หายไป แล้วอ่านประโยคให้ถูกต้อง</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {QUIZ_DATA.map((item, idx) => (
            <div key={`quiz-box-${idx}`} className="bg-white p-8 rounded-4xl border-2 border-gray-100 shadow-sm space-y-6">
              <div className="text-center py-4 bg-purple-50 rounded-3xl border-2 border-dashed border-purple-100">
                <p className="text-3xl font-chinese font-black text-gray-900">{item.q}</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {item.options.map(opt => (
                  <button 
                    key={opt}
                    onClick={() => {
                      setQuizAnswers(prev => ({ ...prev, [idx]: opt }));
                      if (opt === item.correct) setProgress(prev => ({ ...prev, 2: true }));
                    }}
                    className={cn(
                      "py-4 rounded-2xl font-chinese text-2xl font-black transition-all border-2",
                      quizAnswers[idx] === opt
                        ? opt === item.correct 
                          ? "bg-emerald-50 border-emerald-500 text-emerald-600 scale-105"
                          : "bg-red-50 border-red-100 text-red-500"
                        : "bg-white border-gray-100 hover:border-purple-300"
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {quizAnswers[idx] === item.correct && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-2 p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <p className="text-xl font-chinese font-black text-emerald-700">{item.full}</p>
                      <p className="text-sm font-bold text-blue-500">{item.fullPy}</p>
                      <p className="text-xs text-gray-400 font-bold">{item.fullTh}</p>
                    </div>
                    <button onClick={() => handleSpeak(item.full)} className="p-3 bg-emerald-500 text-white rounded-xl shadow-md">
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 3. เขียนคำศัพท์จากตัวอักษรที่กำหนด */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-purple-500 rounded-full" />
          <h4 className="text-2xl font-black text-gray-900">เขียนคำศัพท์จากตัวอักษรที่กำหนด</h4>
        </div>
        <p className="text-gray-500 font-bold ml-5">เขียนคำศัพท์ที่มีตัวอักษรจีน "店" อยู่ในคำ</p>
        <div className="bg-white p-10 rounded-[3rem] border-2 border-gray-100 shadow-sm text-center space-y-8">
           <div className="flex justify-center mb-4">
              <div className="w-24 h-24 bg-purple-600 text-white rounded-3xl flex items-center justify-center font-chinese text-6xl font-black shadow-xl ring-8 ring-purple-100 animate-bounce">
                店
              </div>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
             {[1, 2, 3].map(i => (
               <div key={`blank-input-${i}`} className="h-16 border-b-4 border-dashed border-gray-200 flex items-center justify-center text-gray-300 font-black">
                 ...........................
               </div>
             ))}
           </div>
           <div className="flex justify-center gap-4">
              <button 
                onClick={() => setShowExamples(!showExamples)}
                className="px-8 py-3 bg-white border-2 border-purple-100 text-purple-600 rounded-2xl font-black hover:bg-purple-600 hover:text-white transition-all shadow-sm"
              >
                {showExamples ? "ย่อตัวอย่าง" : "ดูตัวอย่างคำตอบ"}
              </button>
              <button onClick={() => setProgress(prev => ({ ...prev, 3: true }))} className="px-8 py-3 bg-emerald-500 text-white rounded-2xl font-black shadow-lg">
                ทำแล้ว
              </button>
           </div>
           {showExamples && (
             <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-50">
                {[
                  { zh: "书店", py: "shūdiàn", th: "ร้านหนังสือ" },
                  { zh: "花店", py: "huādiàn", th: "ร้านดอกไม้" },
                  { zh: "水果店", py: "shuǐguǒdiàn", th: "ร้านผลไม้" }
                ].map((ex, i) => (
                  <div key={`ex-ans-w-${i}`} className="bg-purple-50 p-4 rounded-3xl border border-purple-100">
                    <p className="text-2xl font-chinese font-black text-purple-700 mb-1">{ex.zh}</p>
                    <p className="text-xs font-bold text-gray-400">{ex.py} {ex.th}</p>
                  </div>
                ))}
             </motion.div>
           )}
        </div>
      </section>

      {/* 4. เขียนลำดับขีดตามลายเส้น */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-emerald-500 rounded-full" />
          <h4 className="text-2xl font-black text-gray-900">เขียนลำดับขีดตามลายเส้น</h4>
        </div>
        <p className="text-gray-500 font-bold ml-5">ฝึกเขียนตัวอักษรจีนตามลำดับขีด</p>
        <div className="space-y-6">
          {STROKE_DATA.map((item, idx) => (
            <div key={`stroke-row-${idx}`} className="bg-white p-8 rounded-4xl border-2 border-gray-100 shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                 <div className="flex items-center gap-4">
                    <div className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-black text-xl font-chinese">{item.word}</div>
                    <div className="text-sm font-bold text-gray-400">{item.py} | {item.th}</div>
                 </div>
                 <button onClick={() => handleSpeak(item.word)} className="p-3 bg-emerald-50 text-emerald-600 rounded-full hover:bg-emerald-600 hover:text-white transition-all">
                    <Volume2 className="w-5 h-5" />
                 </button>
              </div>
              <div className="flex flex-wrap gap-2 md:gap-4 justify-center md:justify-start">
                 <WritingGrid char={item.char} isHeavy />
                 {Array.from({ length: 8 }).map((_, i) => (
                   <WritingGrid key={`trace-${idx}-${i}`} char={item.char} isTrace />
                 ))}
              </div>
              <div className="flex justify-end">
                <button onClick={() => setProgress(prev => ({ ...prev, 4: true }))} className="px-6 py-2 bg-emerald-50 text-emerald-600 rounded-xl font-black hover:bg-emerald-600 hover:text-white transition-all border border-emerald-100">
                  ฝึกเขียนแล้ว
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const PinyinLesson1 = ({ 
  lesson, 
  speak, 
  pinyinSpeak, 
  pinyinSequenceSpeak, 
  playingText 
}: { 
  lesson: any, 
  speak: (t: string) => void,
  pinyinSpeak: (py: string, rate?: number) => void,
  pinyinSequenceSpeak: (list: string[], rate?: number) => void,
  playingText: string | null
}) => {
  const [progress, setProgress] = useState<Record<number, boolean>>({});
  const [completedVocab, setCompletedVocab] = useState<Record<number, boolean>>({});
  const [currentRhymeLine, setCurrentRhymeLine] = useState<number | null>(null);

  const completedCount = Object.values(progress).filter(Boolean).length;
  const totalSections = 3;
  const isFinished = completedCount === totalSections;

  const handleSpeak = (text: string, rate: number = 0.8) => {
    pinyinSpeak(text, rate);
  };

  const handleSpeakRow = async (set: string[]) => {
    await pinyinSequenceSpeak(set, 0.75);
  };

  const PINYIN_SETS = [
    ["jī", "qī", "xī", "jú", "qú", "xú"],
    ["jì", "qì", "xì", "jù", "qù", "xù"],
    ["jīn", "qīn", "xīn", "jué", "qué", "xué"],
    ["jǔ", "qǔ", "xǔ", "juè", "què", "xuè"],
    ["jiā", "qiā", "xiā", "jié", "qié", "xié"],
    ["jiǔ", "qiǔ", "xiǔ", "jiàn", "qiàn", "xiàn"],
    ["juǎn", "quǎn", "xuǎn", "jiáo", "qiáo", "xiáo"],
    ["jiǎng", "qiǎng", "xiǎng", "juàn", "quàn", "xuàn"]
  ];

  const VOCAB_DATA = [
    { py: "xǐshǒujiān", zh: "洗手间", th: "ห้องน้ำ" },
    { py: "dàjiā", zh: "大家", th: "ทุกคน" },
    { py: "jiàoshì", zh: "教室", th: "ห้องเรียน" },
    { py: "qǐchuáng", zh: "起床", th: "ตื่นนอน" },
    { py: "dǎ lánqiú", zh: "打篮球", th: "เล่นบาสเกตบอล" },
    { py: "qiánbian", zh: "前边", th: "ด้านหน้า" },
    { py: "xīn tóngxué", zh: "新同学", th: "เพื่อนนักเรียนใหม่" },
    { py: "Xīngqīsì", zh: "星期四", th: "วันพฤหัสบดี" },
    { py: "fàngxué", zh: "放学", th: "เลิกเรียน" }
  ];

  const RHYME_DATA = [
    { py: "Zuǒbian xī lǐ qī zhī xiā,", zh: "左边溪里七只虾，", th: "ด้านซ้ายในลำธารมีกุ้งเจ็ดตัว" },
    { py: "Yòubian xī lǐ yì zhī xiā.", zh: "右边溪里一只虾。", th: "ด้านขวาในลำธารมีกุ้งหนึ่งตัว" },
    { py: "Qī jiā yī, děngyú jǐ?", zh: "七加一，等于几？", th: "เจ็ดบวกหนึ่ง เท่ากับเท่าไร" },
    { py: "Qī jiǎn yī, děngyú jǐ?", zh: "七减一，等于几？", th: "เจ็ดลบหนึ่ง เท่ากับเท่าไร" },
    { py: "Qī jiā yī, zài jiǎn yī,", zh: "七加一，再减一，", th: "เจ็ดบวกหนึ่ง แล้วลบหนึ่ง" },
    { py: "Xiān jiā hòu jiǎn děngyú jǐ?", zh: "先加后减等于几？", th: "บวกก่อนแล้วลบทีหลัง เท่ากับเท่าไร" }
  ];

  const getColorClass = (py: string) => {
    if (py.startsWith('j')) return 'text-blue-500';
    if (py.startsWith('q')) return 'text-emerald-500';
    if (py.startsWith('x')) return 'text-purple-500';
    return 'text-gray-900';
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Header Section */}
      <div className="bg-chinese-gold p-8 rounded-4xl text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-3xl font-black mb-2 uppercase tracking-tight">กิจกรรมฝึกพินอิน (PINYIN)</h3>
          <p className="font-bold opacity-90">บทที่ 1: {lesson.title} {lesson.translation.split(' (')[0]}</p>
          <div className="mt-4 bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/30 inline-block font-bold">
            คำสั่งหลัก: ฟังเสียงพินอิน แล้วอ่านตาม
          </div>
        </div>
        <Star className="w-48 h-48 absolute -right-12 -bottom-12 text-white/10 rotate-12" />
      </div>

      {/* Progress Tracker */}
      <div className="flex flex-col items-center">
        <div className="w-full max-w-md bg-white border-4 border-chinese-gold/20 rounded-3xl p-6 shadow-sm">
          <div className="flex justify-between items-end mb-2 h-8">
            <span className="font-black text-chinese-gold-dark text-lg">ฝึกแล้ว {completedCount}/{totalSections}</span>
            {isFinished && (
              <motion.span 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                className="text-emerald-500 font-black text-sm"
              >
                เยี่ยมมาก! ฝึกพินอินบทที่ 1 ครบแล้ว ✨
              </motion.span>
            )}
          </div>
          <div className="h-4 bg-chinese-gold/10 rounded-full overflow-hidden border-2 border-chinese-gold/20">
            <motion.div 
              className="h-full bg-chinese-gold"
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / totalSections) * 100}%` }}
              transition={{ type: "spring", bounce: 0, duration: 0.8 }}
            />
          </div>
        </div>
      </div>

      {/* Section 1: ฝึกอ่านเสียง j q x */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-blue-500 rounded-full" />
          <h4 className="text-2xl font-black text-gray-900">ฝึกอ่านเสียง j q x</h4>
        </div>
        <div className="bg-white p-8 rounded-[3rem] border-2 border-gray-100 shadow-sm space-y-8">
          <div className="bg-blue-50 p-6 rounded-3xl border-2 border-dashed border-blue-100 text-center">
            <p className="text-blue-600 font-bold">สังเกตเสียงขึ้นต้น j, q, x และวรรณยุกต์ให้ถูกต้อง</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {PINYIN_SETS.map((set, idx) => (
              <div key={`pinyin-set-${idx}`} className="space-y-4">
                <div className="flex justify-between items-center bg-gray-50/50 p-2 rounded-2xl">
                  <span className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">ชุดที่ {idx + 1}</span>
                  <button 
                    onClick={() => handleSpeakRow(set)}
                    className="px-4 py-1.5 bg-blue-500 text-white rounded-xl text-xs font-black hover:bg-blue-600 transition-all flex items-center gap-2"
                  >
                    <Volume2 className="w-3 h-3" />
                    ฟังทั้งแถว
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {set.map((py, pIdx) => (
                    <div key={`py-${idx}-${pIdx}`} className={cn(
                      "bg-white p-4 rounded-2xl border-2 border-gray-50 flex flex-col items-center gap-2 group hover:border-blue-200 transition-all transition-all duration-300",
                      playingText === py && "border-blue-500 ring-4 ring-blue-500/10 scale-105"
                    )}>
                      <span className={cn("text-2xl font-black", getColorClass(py))}>{py}</span>
                      <button 
                        onClick={() => handleSpeak(py, 0.75)}
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm",
                          playingText === py ? "bg-blue-500 text-white animate-pulse" : "bg-gray-50 text-gray-400 hover:bg-blue-500 hover:text-white"
                        )}
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center pt-4">
            <button 
              onClick={() => setProgress(prev => ({ ...prev, 1: true }))}
              className={cn(
                "px-10 py-4 rounded-3xl font-black transition-all shadow-lg",
                progress[1] ? "bg-emerald-500 text-white" : "bg-blue-500 text-white hover:scale-105"
              )}
            >
              {progress[1] ? "เสร็จแล้ว ✨" : "ทำเครื่องหมายว่าเสร็จแล้ว"}
            </button>
          </div>
        </div>
      </section>

      {/* Section 2: ฝึกอ่านคำศัพท์พินอิน */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-emerald-500 rounded-full" />
          <h4 className="text-2xl font-black text-gray-900">ฝึกอ่านคำศัพท์พินอิน</h4>
        </div>
        <p className="text-gray-500 font-bold ml-5">ฟังเสียงคำศัพท์ แล้วอ่านตาม</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {VOCAB_DATA.map((item, idx) => (
            <div key={`vocab-p-${idx}`} className={cn(
              "bg-white p-8 rounded-[2.5rem] border-2 transition-all space-y-6 relative overflow-hidden",
              completedVocab[idx] ? "border-emerald-500 shadow-emerald-50 shadow-lg" : "border-gray-100 shadow-sm"
            )}>
              {completedVocab[idx] && (
                <div className="absolute top-4 right-4 bg-emerald-500 text-white p-1 rounded-full">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              )}
              <div className="text-center space-y-2">
                <p className="text-3xl font-black text-emerald-600">{item.py}</p>
                <p className="text-4xl font-chinese font-black text-gray-900">{item.zh}</p>
                <p className="text-gray-400 font-bold">{item.th}</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => handleSpeak(item.zh, 0.8)}
                  className="flex-1 py-3 bg-emerald-50 text-emerald-600 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                >
                  <Volume2 className="w-4 h-4" />
                  ฟังเสียง
                </button>
                <button 
                  onClick={() => setCompletedVocab(prev => ({ ...prev, [idx]: true }))}
                  className={cn(
                    "flex-1 py-3 rounded-2xl font-black transition-all shadow-sm",
                    completedVocab[idx] ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-400 hover:bg-emerald-100"
                  )}
                >
                  อ่านแล้ว
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center pt-8">
          <button 
            onClick={() => setProgress(prev => ({ ...prev, 2: true }))}
            className={cn(
              "px-10 py-4 rounded-3xl font-black transition-all shadow-lg",
              progress[2] ? "bg-emerald-500 text-white" : "bg-emerald-500 text-white hover:scale-105"
            )}
          >
            {progress[2] ? "เสร็จแล้ว ✨" : "เสร็จสิ้นกิจกรรมอ่านคำศัพท์"}
          </button>
        </div>
      </section>

      {/* Section 3: พูดคำสัมผัสอักษร */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-purple-500 rounded-full" />
          <h4 className="text-2xl font-black text-gray-900">พูดคำสัมผัสอักษร</h4>
        </div>
        <p className="text-gray-500 font-bold ml-5">ฟังเสียง แล้วพูดตามทีละบรรทัด</p>
        <div className="bg-white p-10 rounded-[3rem] border-2 border-gray-100 shadow-sm space-y-10">
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => handleSpeak(RHYME_DATA.map(d => d.zh).join(', '), 0.75)}
              className="px-8 py-4 bg-purple-600 text-white rounded-2xl font-black shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
            >
              <Play className="w-6 h-6 fill-white" />
              ฟังทั้งหมด (Play All)
            </button>
          </div>

          <div className="space-y-4 max-w-3xl mx-auto">
            {RHYME_DATA.map((line, idx) => (
              <motion.div 
                key={`rhyme-line-${idx}`}
                className={cn(
                  "p-6 rounded-3xl border-2 transition-all flex flex-col md:flex-row items-center justify-between gap-6",
                  currentRhymeLine === idx ? "border-purple-500 bg-purple-50 shadow-md scale-[1.02]" : "border-gray-50 bg-gray-50/30"
                )}
              >
                <div className="flex-1 text-center md:text-left space-y-1">
                  <p className="text-xl font-bold text-purple-600">{line.py}</p>
                  <p className="text-3xl font-chinese font-black text-gray-900 leading-tight">{line.zh}</p>
                  <p className="text-sm font-bold text-gray-400 italic">"{line.th}"</p>
                </div>
                <button 
                  onClick={() => {
                    setCurrentRhymeLine(idx);
                    handleSpeak(line.zh, 0.8);
                  }}
                  className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-md group",
                    currentRhymeLine === idx ? "bg-purple-600 text-white" : "bg-white text-purple-600 hover:bg-purple-600 hover:text-white"
                  )}
                >
                  <Volume2 className="w-7 h-7 group-hover:scale-110 transition-transform" />
                </button>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center pt-4">
             <button 
              onClick={() => setProgress(prev => ({ ...prev, 3: true }))}
              className={cn(
                "px-10 py-4 rounded-3xl font-black transition-all shadow-lg",
                progress[3] ? "bg-emerald-500 text-white" : "bg-purple-600 text-white hover:scale-105"
              )}
            >
              {progress[3] ? "เสร็จแล้ว ✨" : "เสร็จสิ้นกิจกรรมพูดคำสัมผัส"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

const FunLesson1 = ({ lesson, setActiveActivity }: { lesson: any, setActiveActivity: (a: ActivityType) => void }) => {
  const [progress, setProgress] = useState<Record<number, boolean>>({});
  const [matchingPairs, setMatchingPairs] = useState<{ type: 'word' | 'img', id: number }[]>([]);
  const [matchedIds, setMatchedIds] = useState<number[]>([]);
  const [wrongSelection, setWrongSelection] = useState<boolean>(false);
  
  const [randomPlace, setRandomPlace] = useState<any>(null);
  const [hasSpoken, setHasSpoken] = useState(false);

  const [orderGameIdx, setOrderGameIdx] = useState(0);
  const [currentOrder, setCurrentOrder] = useState<string[]>([]);
  const [orderFinished, setOrderFinished] = useState(false);
  const [orderWrong, setOrderWrong] = useState(false);

  const totalSections = 3;
  const completedCount = Object.values(progress).filter(Boolean).length;

  const PLACES = [
    { id: 1, zh: "书店", py: "shūdiàn", th: "ร้านหนังสือ", icon: <Book className="w-10 h-10" /> },
    { id: 2, zh: "电影院", py: "diànyǐngyuàn", th: "โรงภาพยนตร์", icon: <Tv className="w-10 h-10" /> },
    { id: 3, zh: "花店", py: "huādiàn", th: "ร้านดอกไม้", icon: <Flower2 className="w-10 h-10" /> },
    { id: 4, zh: "医院", py: "yīyuàn", th: "โรงพยาบาล", icon: <HeartPulse className="w-10 h-10" /> },
    { id: 5, zh: "水果店", py: "shuǐguǒdiàn", th: "ร้านผลไม้", icon: <Apple className="w-10 h-10" /> },
    { id: 6, zh: "车站", py: "chēzhàn", th: "สถานีรถ", icon: <TramFront className="w-10 h-10" /> },
    { id: 7, zh: "饭店", py: "fàndiàn", th: "ร้านอาหาร", icon: <UtensilsCrossed className="w-10 h-10" /> },
  ];

  const ORDER_GAMES = [
    { words: ["那里", "是", "电影院"], correct: "那里是电影院。", py: "Nàli shì diànyǐngyuàn.", th: "ที่นั่นคือโรงภาพยนตร์" },
    { words: ["这里", "是", "书店"], correct: "这里是书店。", py: "Zhèli shì shūdiàn.", th: "ที่นี่คือร้านหนังสือ" },
    { words: ["书店", "ไม่", "远"], correct: "书店不远。", py: "Shūdiàn bù yuǎn.", th: "ร้านหนังสือไม่ไกล" }, // Fix: '不' instead of 'ไม่'
    { words: ["花店", "很", "近"], correct: "花店很近。", py: "Huādiàn hěn jìn.", th: "ร้านดอกไม้อยู่ใกล้มาก" }
  ];

  const handleSpeak = (text: string) => {
    speakChinese(text, { rate: 0.8 });
  };

  // Game 1: Matching Logic
  const handleMatchSelect = (type: 'word' | 'img', id: number) => {
    if (matchedIds.includes(id)) return;
    if (matchingPairs.length === 1 && matchingPairs[0].type === type) {
      setMatchingPairs([{ type, id }]);
      return;
    }

    const newPairs = [...matchingPairs, { type, id }];
    setMatchingPairs(newPairs);

    if (newPairs.length === 2) {
      if (newPairs[0].id === newPairs[1].id) {
        setMatchedIds(prev => [...prev, id]);
        setMatchingPairs([]);
        if (matchedIds.length + 1 === PLACES.length) {
          setProgress(prev => ({ ...prev, 1: true }));
        }
      } else {
        setWrongSelection(true);
        setTimeout(() => {
          setMatchingPairs([]);
          setWrongSelection(false);
        }, 500);
      }
    }
  };

  // Game 2: Random Speak
  const handleRandomize = () => {
    const random = PLACES[Math.floor(Math.random() * PLACES.length)];
    setRandomPlace(random);
    setHasSpoken(false);
  };

  // Game 3: Order Logic
  const handleWordSelect = (word: string) => {
    if (orderFinished) return;
    setCurrentOrder(prev => [...prev, word]);
  };

  const checkOrder = () => {
    const combined = currentOrder.join('');
    const target = ORDER_GAMES[orderGameIdx].words.join('');
    // Note: The correct answer strings in request have periods, but the components might not. 
    // We'll compare based on word sequence.
    if (currentOrder.join(' ') === ORDER_GAMES[orderGameIdx].words.join(' ')) {
      setOrderFinished(true);
      setOrderWrong(false);
      if (orderGameIdx === ORDER_GAMES.length - 1) {
        setProgress(prev => ({ ...prev, 3: true }));
      }
    } else {
      setOrderWrong(true);
      setTimeout(() => setOrderWrong(false), 500);
      setCurrentOrder([]);
    }
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Header Section */}
      <div className="bg-pink-500 p-8 rounded-4xl text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-3xl font-black mb-2 uppercase tracking-tight">กิจกรรมหรรษา (FUN)</h3>
          <p className="font-bold opacity-90">บทที่ 1: {lesson.title} {lesson.translation.split(' (')[0]}</p>
        </div>
        <Gamepad2 className="w-48 h-48 absolute -right-12 -bottom-12 text-white/10 rotate-12" />
      </div>

      {/* Progress Tracker */}
      <div className="flex flex-col items-center">
        <div className="w-full max-w-md bg-white border-4 border-pink-100 rounded-3xl p-6 shadow-sm text-center">
           <p className="font-black text-pink-600 mb-2">ทำกิจกรรมคืบหน้า {completedCount}/{totalSections}</p>
           <div className="h-4 bg-pink-50 rounded-full overflow-hidden border-2 border-pink-100">
            <motion.div 
              className="h-full bg-pink-500"
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / totalSections) * 100}%` }}
              transition={{ type: "spring", bounce: 0, duration: 0.8 }}
            />
          </div>
          {completedCount === totalSections && (
            <p className="mt-4 text-emerald-500 font-black">เก่งมาก! ทำกิจกรรมบทที่ 1 ครบแล้ว ✨</p>
          )}
        </div>
      </div>

      {/* 1. เกมจับคู่สถานที่ */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-pink-500 rounded-full" />
            <h4 className="text-2xl font-black text-gray-900">1. เกมจับคู่สถานที่</h4>
          </div>
          <button 
            onClick={() => { setMatchedIds([]); setMatchingPairs([]); setProgress(prev => ({ ...prev, 1: false })); }}
            className="text-pink-500 font-black text-sm flex items-center gap-1 hover:underline"
          >
            <RotateCcw className="w-4 h-4" /> เริ่มใหม่
          </button>
        </div>
        <p className="text-gray-500 font-bold ml-5">จับคู่คำศัพท์กับภาพสถานที่ (เลือกภาพและคำจีนที่ตรงกัน)</p>
        
        <div className="bg-white p-8 rounded-4xl border-2 border-pink-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Images Grid */}
          <div className="space-y-4">
             <p className="text-sm font-black text-gray-400 uppercase text-center mb-4">ภาพสถานที่</p>
             <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <button 
                    onClick={() => {
                      setHasSpoken(true);
                      setProgress(prev => ({ ...prev, [randomPlace.zh]: true }));
                    }}
                    className={cn(
                      "flex-1 py-4 rounded-2xl font-black transition-all shadow-lg",
                      hasSpoken ? "bg-emerald-500 text-white" : "bg-blue-500 text-white"
                    )}
                  >
                    {hasSpoken ? "เก่งมาก! (Success)" : "พูดแล้ว ✅"}
                  </button>
               </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const SummaryDetails = ({ 
  data 
}: { 
  data: { 
    learned: string[], 
    listening: string[], 
    speaking: string[], 
    fun: string[], 
    reading: string[], 
    writing: string[], 
    pinyin: string[] 
  } 
}) => {
  const sections = [
    { title: "1. เรียนอะไรบ้างในบทนี้", items: data.learned, icon: "📖", color: "from-blue-500 to-indigo-600", bg: "bg-blue-50" },
    { title: "2. ฝึกฟัง", items: data.listening, icon: "👂", color: "from-orange-500 to-amber-500", bg: "bg-orange-50" },
    { title: "3. ฝึกพูด", items: data.speaking, icon: "🗣️", color: "from-emerald-500 to-teal-600", bg: "bg-emerald-50" },
    { title: "4. กิจกรรมหรรษา", items: data.fun, icon: "🎮", color: "from-purple-500 to-fuchsia-600", bg: "bg-purple-50" },
    { title: "5. ฝึกอ่าน", items: data.reading, icon: "📚", color: "from-cyan-500 to-blue-600", bg: "bg-cyan-50" },
    { title: "6. ฝึกเขียน", items: data.writing, icon: "✍️", color: "from-rose-500 to-pink-600", bg: "bg-rose-50" },
    { title: "7. ฝึกพินอิน", items: data.pinyin, icon: "🔡", color: "from-chinese-gold to-yellow-600", bg: "bg-chinese-gold/10" },
  ];

  return (
    <section className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-3 h-10 bg-chinese-red rounded-full shadow-sm" />
        <h4 className="text-3xl font-black text-gray-900 uppercase tracking-tight">เรียนอะไรมาบ้าง</h4>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05 }}
            className={cn(
              "p-1 rounded-[2.5rem] bg-gradient-to-br shadow-sm hover:shadow-xl transition-all group overflow-hidden relative",
              section.color.replace('from-', 'shadow-').split(' ')[0] + '/10'
            )}
          >
            <div className="bg-white p-8 rounded-[2.3rem] h-full flex flex-col gap-4 relative z-10">
              <div className="flex items-center gap-4 pb-4 border-b-2 border-gray-50">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg bg-gradient-to-br text-white", section.color)}>
                  {section.icon}
                </div>
                <h5 className="font-black text-gray-800 text-lg uppercase tracking-wide">{section.title}</h5>
              </div>
              <ul className="space-y-3 flex-grow">
                {section.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-600 font-bold text-sm leading-relaxed group-hover:text-gray-900 transition-colors">
                    <div className={cn("mt-1.5 w-2 h-2 rounded-full flex-shrink-0 animate-pulse", section.color.split(' ')[0].replace('from-', 'bg-'))} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            {/* Background Decoration Icon */}
            <div className="absolute -right-4 -bottom-4 opacity-[0.03] text-9xl rotate-12 group-hover:rotate-0 group-hover:scale-125 transition-all duration-500 pointer-events-none">
               {section.icon}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const SummaryLesson1 = ({ lesson, setActiveActivity, speak }: { lesson: any, setActiveActivity: (type: ActivityType) => void, speak: (t: string, r?: number) => void }) => {
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  const VOCAB_DATA = [
    { zh: "书店", py: "shūdiàn", th: "ร้านหนังสือ", icon: "📚" },
    { zh: "电影院", py: "diànyǐngyuàn", th: "โรงภาพยนตร์", icon: "🎬" },
    { zh: "花店", py: "huādiàn", th: "ร้านดอกไม้", icon: "🌸" },
    { zh: "医院", py: "yīyuàn", th: "โรงพยาบาล", icon: "🏥" },
    { zh: "水果店", py: "shuǐguǒdiàn", th: "ร้านผลไม้", icon: "🍎" },
    { zh: "车站", py: "chēzhàn", th: "สถานีรถ", icon: "🚉" },
    { zh: "饭店", py: "fàndiàn", th: "ร้านอาหาร", icon: "🍜" },
    { zh: "这里", py: "zhèli", th: "ที่นี่", icon: "📍" },
    { zh: "那里", py: "nàli", th: "ที่นั่น", icon: "👉" },
    { zh: "远", py: "yuǎn", th: "ไกล", icon: "🛣️" },
    { zh: "近", py: "jìn", th: "ใกล้", icon: "🏠" },
  ];

  const SENTENCES = [
    { zh: "这里是书店。", py: "Zhèli shì shūdiàn.", th: "ที่นี่คือร้านหนังสือ" },
    { zh: "那里是电影院。", py: "Nàli shì diànyǐngyuàn.", th: "ที่นั่นคือโรงภาพยนตร์" },
  ];

  const CHECKLIST = [
    "ฉันฟังคำศัพท์สถานที่ได้",
    "ฉันพูดประโยค “这里是...” ได้",
    "ฉันพูดประโยค “那里เป็น...” ได้",
    "ฉันอ่านประโยคบทที่ 1 ได้",
    "ฉันเขียนตัวอักษร 车 และ 店 ได้",
    "ฉันอ่านพินอินเสียง j q x ได้"
  ];

  const handleSpeak = (text: string) => {
    speakChinese(text, { rate: 0.8 });
  };

  const isAllChecked = Object.values(checkedItems).filter(Boolean).length === CHECKLIST.length;

  return (
    <div className="space-y-12 pb-20">
      <div className="bg-chinese-red p-8 rounded-4xl text-white shadow-lg relative overflow-hidden">
        <h3 className="text-3xl font-black mb-2 uppercase tracking-tight">สรุปบทเรียน (SUMMARY)</h3>
        <p className="font-bold opacity-90 italic">บทที่ 1: {lesson.title}</p>
        <Trophy className="w-48 h-48 absolute -right-12 -bottom-12 text-white/10 rotate-12 animate-pulse" />
      </div>

      {/* เรียนอะไรมาบ้าง section */}
      <SummaryDetails data={{
        learned: [
          "เรียนคำศัพท์สถานที่ เช่น 书店, 电影院, 花店, 医院, 车站",
          "เรียนการบอกตำแหน่งด้วย 这里 และ 那里",
          "เรียนการบอกว่าสถานที่อยู่ใกล้หรือไกลด้วย 近 และ 远"
        ],
        listening: [
          "ฟังเสียงคำศัพท์สถานที่และพูดตาม",
          "ฟังประโยค 这里เป็น... และ 那里เป็น...",
          "ฟังคำถามเกี่ยวกับสถานที่ เช่น 那里เป็น哪儿？"
        ],
        speaking: [
          "ฝึกถาม-ตอบว่าสถานที่คืออะไร",
          "ฝึกพูดประโยค 这里เป็น书店。那里เป็น电影院。",
          "ฝึกพูดเรื่องใกล้และไกล เช่น 书店很近。"
        ],
        fun: [
          "จับคู่คำศัพท์สถานที่กับภาพ",
          "สุ่มสถานที่แล้วพูดประโยค",
          "เรียงคำให้เป็นประโยคที่ถูกต้อง"
        ],
        reading: [
          "อ่านประโยคเกี่ยวกับสถานที่ เช่น 看！那里เป็น花店。",
          "อ่านประโยค 花真漂亮！学校真漂亮！",
          "อ่านถาม-ตอบเกี่ยวกับ 电影院在哪儿？"
        ],
        writing: [
          "ฝึกเขียนตัวอักษรจีน 院, 车, 站, 花, 远",
          "เติมตัวอักษรจีนที่หายไปในประโยค",
          "ฝึกคัดตัวอักษร 车 และ 店"
        ],
        pinyin: [
          "ฝึกอ่านเสียง j q x",
          "ฝึกอ่านพินอินพร้อมวรรณยุกต์ เช่น jī, qí, xǔ",
          "ฝึกพูดคำสัมผัสอักษร"
        ]
      }} />

      <section className="space-y-6">
        <div className="flex items-center gap-3"><div className="w-2 h-8 bg-chinese-red rounded-full" /><h4 className="text-2xl font-black text-gray-900">1. คำศัพท์สำคัญ</h4></div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {VOCAB_DATA.map((v, i) => (
            <div key={i} className="bg-white p-4 rounded-3xl border-2 border-gray-50 flex flex-col items-center group hover:border-chinese-red transition-all shadow-sm">
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{v.icon}</div>
              <p className="text-2xl font-chinese font-black text-gray-900 leading-none">{v.zh}</p>
              <p className="text-[10px] font-bold text-chinese-red mb-1">{v.py}</p>
              <button 
                onClick={() => handleSpeak(v.zh)} 
                className="w-8 h-8 bg-chinese-red/10 text-chinese-red rounded-xl flex items-center justify-center hover:bg-chinese-red hover:text-white transition-all shadow-sm"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 2. ประโยคสำคัญ */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-blue-500 rounded-full" />
          <h4 className="text-2xl font-black text-gray-900">2. ประโยคสำคัญ</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SENTENCES.map((s, i) => (
            <div key={`sum-s-${i}`} className="bg-white p-6 rounded-3xl border-2 border-blue-50 flex items-center justify-between gap-4 shadow-sm hover:border-blue-300 transition-all">
              <div className="space-y-1">
                <p className="text-2xl font-chinese font-black text-gray-900">{s.zh}</p>
                <p className="text-sm font-bold text-blue-500">{s.py}</p>
                <p className="text-xs text-gray-400 font-bold">{s.th}</p>
              </div>
              <button 
                onClick={() => handleSpeak(s.zh)}
                className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all shadow-md group"
              >
                <Volume2 className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 3. รูปแบบประโยค */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-chinese-gold rounded-full" />
          <h4 className="text-2xl font-black text-gray-900">3. รูปแบบประโยค (Pattern)</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {[
             { title: "Pattern 1", rule: "这里是 + สถานที่", ex: "这里是书店。", exTh: "ที่นี่คือร้านหนังสือ" },
             { title: "Pattern 2", rule: "那里是 + สถานที่", ex: "那里是电影院。", exTh: "ที่นั่นคือโรงภาพยนตร์" },
             { title: "Pattern 3", rule: "สถานที่ + 在哪儿？", ex: "电影院在哪儿？", exTh: "โรงภาพยนตร์อยู่ที่ไหน" },
             { title: "Pattern 4", rule: "สถานที่ + 很近 / 不远", ex: "花店很近。", exTh: "ร้านดอกไม้อยู่ใกล้มาก" },
           ].map((p, i) => (
             <div key={`pattern-${i}`} className="bg-white p-6 rounded-4xl border-2 border-chinese-gold/20 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="bg-chinese-gold text-white px-3 py-1 rounded-full text-xs font-black">{p.title}</span>
                </div>
                <div className="bg-chinese-gold/5 p-4 rounded-2xl border border-chinese-gold/10">
                   <p className="text-lg font-black text-chinese-gold-dark">{p.rule}</p>
                </div>
                <div className="pl-4 border-l-4 border-chinese-gold/20">
                   <p className="text-xl font-chinese font-black text-gray-900">{p.ex}</p>
                   <p className="text-sm text-gray-400 font-bold">{p.exTh}</p>
                </div>
             </div>
           ))}
        </div>
      </section>

      {/* 4. เช็กความพร้อม */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-emerald-500 rounded-full" />
          <h4 className="text-2xl font-black text-gray-900">4. เช็กความพร้อม</h4>
        </div>
        <div className="bg-white p-10 rounded-[3rem] border-2 border-emerald-100 shadow-sm space-y-6">
          {CHECKLIST.map((item, idx) => (
            <label key={`check-${idx}`} className="flex items-center gap-4 p-4 hover:bg-emerald-50 rounded-3xl transition-colors cursor-pointer group">
              <input 
                type="checkbox" 
                checked={checkedItems[idx] || false}
                onChange={() => setCheckedItems(prev => ({ ...prev, [idx]: !prev[idx] }))}
                className="w-8 h-8 rounded-xl border-4 border-emerald-100 text-emerald-500 focus:ring-emerald-500 transition-all cursor-pointer"
              />
              <span className={cn("text-lg font-bold transition-all", checkedItems[idx] ? "text-emerald-600 line-through opacity-50" : "text-gray-700")}>
                {item}
              </span>
            </label>
          ))}
          {isAllChecked && (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mt-8 bg-emerald-500 p-8 rounded-4xl text-center text-white space-y-2 shadow-xl ring-8 ring-emerald-50">
               <Trophy className="w-16 h-16 mx-auto mb-4 animate-bounce" />
               <h5 className="text-3xl font-black">พร้อมแล้ว!</h5>
               <p className="text-xl font-bold opacity-90">คุณเรียนบทที่ 1 สำเร็จ</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* 5. ปุ่มทบทวน */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-chinese-red rounded-full" />
          <h4 className="text-2xl font-black text-gray-900">5. ทบทวนเนื้อหา</h4>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
           {[
             { label: "กลับไปฟัง", target: ActivityType.LISTENING, icon: <Bell className="w-5 h-5" />, color: "bg-orange-500" },
             { label: "กลับไปพูด", target: ActivityType.SPEAKING, icon: <Sparkles className="w-5 h-5" />, color: "bg-emerald-500" },
             { label: "กลับไปอ่าน", target: ActivityType.READING, icon: <BookOpen className="w-5 h-5" />, color: "bg-blue-500" },
             { label: "กลับไปเขียน", target: ActivityType.WRITING, icon: <Zap className="w-5 h-5" />, color: "bg-purple-500" },
             { label: "กลับไปพินอิน", target: ActivityType.PINYIN, icon: <Star className="w-5 h-5" />, color: "bg-chinese-gold" },
             { label: "เล่นกิจกรรมหรรษา", target: ActivityType.FUN, icon: <Gamepad2 className="w-5 h-5" />, color: "bg-pink-500" },
           ].map((btn, i) => (
             <button 
              key={`nav-btn-${i}`}
              onClick={() => {
                setActiveActivity(btn.target);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={cn(
                "p-6 rounded-3xl text-white font-black flex items-center justify-center gap-3 shadow-lg hover:scale-105 active:scale-95 transition-all text-sm md:text-base",
                btn.color
              )}
             >
                {btn.icon}
                {btn.label}
             </button>
           ))}
        </div>
      </section>
    </div>
  );
};

// --- Lesson 7 Specific Components ---

const ListeningLesson7 = ({ lesson, speak, setActiveActivity }: { lesson: any, speak: (t: string) => void, setActiveActivity: (a: ActivityType) => void }) => {
  const activityData = lesson.activities.find((a: any) => a.type === 'listening_sentences');
  
  return (
    <div className="space-y-12 pb-20">
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 p-8 rounded-4xl text-white shadow-lg relative overflow-hidden">
         <div className="relative z-10 flex items-center gap-6">
            <ThreeDContainer color="orange" size="lg" className="hidden md:flex">
               <Volume2 size={48} />
            </ThreeDContainer>
            <div>
               <h3 className="text-3xl font-black leading-tight mb-2 uppercase tracking-tight">กิจกรรมการฟัง (LISTENING)</h3>
               <p className="text-orange-100 font-bold italic text-lg uppercase tracking-wider">บทที่ {lesson.id}: {lesson.title}</p>
            </div>
         </div>
         <Volume2 className="w-48 h-48 absolute -right-12 -bottom-12 text-white/10 rotate-12" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {lesson.vocabulary.map((v: any, i: number) => (
          <motion.div 
            key={`listen-7-vocab-${i}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-[2.5rem] border-2 border-gray-50 shadow-xl hover:shadow-2xl hover:border-orange-500 transition-all text-center space-y-4 group relative overflow-hidden"
          >
            <div className="flex justify-center">
              <ThreeDContainer color="orange" size="md">
                {v.icon || "🔊"}
              </ThreeDContainer>
            </div>
            <div>
              <p className="text-2xl font-chinese font-black text-gray-900 leading-none">{v.word}</p>
              <p className="text-lg font-bold text-orange-600">{v.pinyin}</p>
              <p className="text-gray-400 font-bold italic text-sm">{v.translation}</p>
            </div>
            <button 
              onClick={() => speak(v.word)}
              className="w-full py-3 bg-orange-500 text-white rounded-[1.2rem] font-black shadow-[0_4px_0_0_#ea580c] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-2"
            >
              <Volume2 size={18} /> 
              <span>ฟังเสียง</span>
            </button>
          </motion.div>
        ))}
      </div>

      {activityData && (
        <section className="space-y-8 mt-12">
          <div className="flex items-center gap-4">
             <div className="w-3 h-10 bg-orange-500 rounded-full shadow-lg shadow-orange-200" />
             <h4 className="text-2xl font-black text-gray-900 uppercase tracking-tight">ฟังประโยคเพิ่มเติม</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activityData.items.map((item: any, i: number) => (
               <div key={`listen-7-extra-${i}`} className="bg-white p-8 rounded-[3rem] border-4 border-orange-50 flex items-center justify-between gap-6 shadow-xl hover:border-orange-300 transition-all group">
                  <div className="space-y-2">
                     <p className="text-3xl font-chinese font-black text-gray-900 group-hover:text-orange-600 transition-colors uppercase">{item.text}</p>
                     <p className="text-xl font-bold text-orange-500 italic">{item.pinyin}</p>
                     <p className="text-gray-500 font-bold italic">{item.translation}</p>
                  </div>
                  <button 
                    onClick={() => speak(item.text)}
                    className="w-16 h-16 bg-orange-50 text-orange-600 rounded-[1.8rem] flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all shadow-inner active:scale-95"
                  >
                    <Volume2 className="w-8 h-8" />
                  </button>
               </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

const SpeakingLesson7 = ({ lesson, speak, setActiveActivity }: { lesson: any, speak: (t: string) => void, setActiveActivity: (a: ActivityType) => void }) => {
  const grammarData = lesson.activities.find((a: any) => a.type === 'speaking_grammar');
  const symptomsData = lesson.activities.find((a: any) => a.type === 'symptoms_game');
  const [randomIdx, setRandomIdx] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const shuffleSymptom = () => {
    setRandomIdx(Math.floor(Math.random() * symptomsData.items.length));
    setShowResult(false);
  };

  return (
    <div className="space-y-12 pb-20">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-400 p-8 rounded-4xl text-white shadow-lg relative overflow-hidden">
         <div className="relative z-10 flex items-center gap-6">
            <ThreeDContainer color="emerald" size="lg" className="hidden md:flex">
               <Sparkles size={48} />
            </ThreeDContainer>
            <div>
               <h3 className="text-3xl font-black leading-tight mb-2 uppercase tracking-tight">กิจกรรมการฝึกพูด (SPEAKING)</h3>
               <p className="text-emerald-100 font-bold italic text-lg uppercase tracking-wider">บทที่ {lesson.id}: {lesson.title}</p>
            </div>
         </div>
         <Sparkles className="w-48 h-48 absolute -right-12 -bottom-12 text-white/10 rotate-12" />
      </div>

      <section className="space-y-8">
        <div className="flex items-center gap-4">
           <div className="w-3 h-10 bg-emerald-500 rounded-full shadow-lg shadow-emerald-200" />
           <h4 className="text-2xl font-black text-gray-900 uppercase tracking-tight">กิจกรรมที่ 1: ฟังเสียงประโยคแล้วพูดตาม</h4>
        </div>
        <div className="grid grid-cols-1 gap-8">
           {lesson.dialogues.map((d: any, i: number) => (
              <motion.div 
                key={`speak-7-dialogue-${i}`}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className={cn(
                   "flex gap-6 max-w-3xl",
                   i % 2 === 0 ? "mr-auto" : "ml-auto flex-row-reverse text-right"
                )}
              >
                 <RoleAvatar role={d.role} />
                 <div className={cn(
                    "p-8 rounded-[3rem] shadow-xl border-4 space-y-3 relative group",
                    d.role.toLowerCase().includes('teacher') ? "bg-white border-gold-100" : "bg-emerald-50 border-white text-emerald-900"
                 )}>
                    <p className="text-blue-400 font-black text-[10px] uppercase tracking-[0.2em] mb-1">{d.role}</p>
                    <p className="text-3xl font-chinese font-black leading-tight uppercase">{d.text}</p>
                    <p className="text-lg font-bold text-emerald-600 italic tracking-wider">{d.pinyin}</p>
                    <p className="text-gray-500 font-bold italic leading-relaxed">{d.translation}</p>
                    <button 
                      onClick={() => speak(d.text)}
                      className="absolute top-4 right-4 w-10 h-10 bg-white/50 hover:bg-white rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all active:scale-95"
                    >
                      <Volume2 className="w-5 h-5 text-emerald-500" />
                    </button>
                 </div>
              </motion.div>
           ))}
        </div>
      </section>

      {grammarData && (
        <section className="bg-emerald-50 p-10 rounded-[4rem] border-4 border-white shadow-xl space-y-8">
           <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md">
                <Book className="w-6 h-6 text-emerald-500" />
             </div>
             <h4 className="text-2xl font-black text-emerald-800 uppercase tracking-tight">คำอธิบายไวยากรณ์</h4>
           </div>
           <div className="space-y-6">
              <p className="text-xl font-bold text-emerald-700 leading-relaxed italic bg-white/50 p-6 rounded-3xl border-2 border-emerald-100">{grammarData.explanation}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {grammarData.examples.map((ex: any, i: number) => (
                    <div key={`grammar-ex-7-${i}`} className="bg-white p-6 rounded-3xl border-2 border-emerald-200 shadow-sm space-y-3">
                       <p className="text-2xl font-chinese font-black text-gray-900 uppercase">{ex.text}</p>
                       <p className="text-sm font-bold text-emerald-500 italic">{ex.pinyin}</p>
                       <div className="h-px w-8 bg-emerald-100" />
                       <p className="text-gray-500 font-bold text-sm italic">{ex.translation}</p>
                       <button onClick={() => speak(ex.text)} className="w-full py-2 bg-emerald-50 text-emerald-600 rounded-xl font-black text-xs hover:bg-emerald-500 hover:text-white transition-all">ฟังตัวอย่าง</button>
                    </div>
                 ))}
              </div>
           </div>
        </section>
      )}

      {symptomsData && (
        <section className="space-y-8">
           <div className="flex items-center gap-4">
              <div className="w-3 h-10 bg-emerald-500 rounded-full shadow-lg" />
              <h4 className="text-2xl font-black text-gray-900 uppercase tracking-tight">กิจกรรมที่ 2: จับคู่ ดูภาพแล้วพูดถามตอบ</h4>
           </div>
           <div className="bg-white p-12 rounded-[4rem] border-4 border-gray-50 shadow-2xl text-center space-y-10 relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-50 rounded-full -z-0 opacity-50 group-hover:scale-110 transition-transform" />
              <div className="relative z-10 space-y-8">
                 <div className="flex flex-col items-center gap-4">
                    <p className="text-2xl font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-8 py-2 rounded-full italic">你怎么了？</p>
                    <p className="text-4xl font-chinese font-black text-gray-900 drop-shadow-sm">เธอเป็นอะไร</p>
                 </div>
                 
                 <AnimatePresence mode="wait">
                    <motion.div 
                      key={randomIdx}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="inline-block p-10 bg-emerald-50 rounded-[3rem] border-4 border-white shadow-inner"
                    >
                       <ThreeDContainer color="emerald" size="lg" className="mx-auto scale-150 mb-8">
                          {symptomsData.items[randomIdx].icon || "🤒"}
                       </ThreeDContainer>
                       <div className="space-y-2 mt-10">
                          <p className="text-5xl font-chinese font-black text-emerald-600 tracking-widest uppercase">我{symptomsData.items[randomIdx].word}。</p>
                          <p className="text-2xl font-bold text-emerald-400 italic font-mono tracking-widest">Wǒ {symptomsData.items[randomIdx].pinyin}.</p>
                          <p className="text-xl font-bold text-gray-400 italic">ฉัน{symptomsData.items[randomIdx].translation}</p>
                       </div>
                    </motion.div>
                 </AnimatePresence>

                 <div className="flex flex-wrap justify-center gap-6 mt-10">
                    <button onClick={() => speak(`我${symptomsData.items[randomIdx].word}`)} className="flex items-center gap-3 px-10 py-5 bg-emerald-50 text-emerald-600 rounded-[2rem] font-black border-2 border-emerald-100 hover:bg-emerald-100 transition-all shadow-md active:scale-95 text-lg">
                       <Volume2 className="w-8 h-8" /> ฟังเสียง
                    </button>
                    <button onClick={shuffleSymptom} className="flex items-center gap-3 px-10 py-5 bg-emerald-500 text-white rounded-[2rem] font-black shadow-[0_8px_0_0_#059669] hover:shadow-[0_4px_0_0_#059669] active:shadow-none active:translate-y-1 transition-all text-lg">
                       <RefreshCw className="w-8 h-8" /> สุ่มอาการ
                    </button>
                    <button onClick={() => setShowResult(true)} className={cn("flex items-center gap-3 px-10 py-5 rounded-[2rem] font-black shadow-xl transition-all text-lg", showResult ? "bg-emerald-100 text-emerald-600" : "bg-white border-2 border-gray-100 text-gray-500")}>
                       <CheckCircle2 className="w-8 h-8" /> {showResult ? "ยอดเยี่ยม!" : "พูดแล้ว"}
                    </button>
                 </div>
              </div>
           </div>
        </section>
      )}
    </div>
  );
};

const ReadingLesson7 = ({ lesson, speak }: { lesson: any, speak: (t: string) => void }) => {
  const storyData = lesson.activities.find((a: any) => a.type === 'reading_story');
  const [answers, setAnswers] = useState<Record<number, boolean | null>>({});

  if (!storyData) return null;

  return (
    <div className="space-y-12 pb-20">
      <div className="bg-gradient-to-r from-blue-500 to-cyan-400 p-8 rounded-4xl text-white shadow-lg relative overflow-hidden">
         <div className="relative z-10 flex items-center gap-6">
            <ThreeDContainer color="blue" size="lg" className="hidden md:flex">
               <BookOpen size={48} />
            </ThreeDContainer>
            <div>
               <h3 className="text-3xl font-black leading-tight mb-2 uppercase tracking-tight">กิจกรรมการฝึกอ่าน (READING)</h3>
               <p className="text-blue-100 font-bold italic text-lg uppercase tracking-wider">บทที่ {lesson.id}: {lesson.title}</p>
            </div>
         </div>
         <BookOpen className="w-48 h-48 absolute -right-12 -bottom-12 text-white/10 rotate-12" />
      </div>

      <div className="bg-white p-12 rounded-[4rem] border-4 border-blue-50 shadow-2xl space-y-10 relative group">
         <div className="text-center space-y-2 border-b-2 border-blue-50 pb-8">
            <h4 className="text-4xl font-chinese font-black text-gray-900 leading-tight uppercase">{storyData.date}</h4>
            <p className="text-xl font-bold text-blue-500 italic uppercase tracking-wider">{storyData.datePinyin}</p>
            <p className="text-gray-400 font-bold italic uppercase">{storyData.dateTranslation}</p>
         </div>

         <div className="space-y-8 max-w-4xl mx-auto">
            {storyData.story.map((item: any, i: number) => (
               <motion.div 
                 key={`reading-7-story-${i}`}
                 initial={{ opacity: 0, y: 10 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 transition={{ delay: i * 0.1 }}
                 className="space-y-3 p-6 rounded-3xl hover:bg-blue-50 transition-colors group/item"
               >
                  <div className="flex items-start gap-4">
                     <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0 mt-1">{i + 1}</span>
                     <div className="space-y-2 flex-grow">
                        <p className="text-3xl font-chinese font-black text-gray-900 leading-relaxed uppercase">{item.text}</p>
                        <p className="text-lg font-bold text-blue-500 italic tracking-wider">{item.pinyin}</p>
                        <p className="text-gray-500 font-bold italic leading-relaxed">{item.translation}</p>
                     </div>
                     <button onClick={() => speak(item.text)} className="p-4 bg-white text-blue-500 rounded-2xl shadow-sm border-2 border-blue-50 opacity-0 group-hover/item:opacity-100 transition-all active:scale-95">
                        <Volume2 size={24} />
                     </button>
                  </div>
               </motion.div>
            ))}
         </div>
      </div>

      <section className="space-y-8">
        <div className="flex items-center gap-4">
           <div className="w-3 h-10 bg-blue-500 rounded-full shadow-lg" />
           <h4 className="text-2xl font-black text-gray-900 uppercase tracking-tight">กิจกรรมที่ 1: ตอบคำถามจากเนื้อเรื่อง</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {storyData.questions.map((q: any, i: number) => (
              <div key={`reading-7-q-${i}`} className="bg-white p-8 rounded-[3rem] border-4 border-blue-50 shadow-xl space-y-6">
                 <div className="flex items-center gap-2 mb-2">
                    <HelpCircle className="w-5 h-5 text-blue-300" />
                    <span className="text-xs font-black text-blue-400 uppercase tracking-widest">Question {i+1}</span>
                 </div>
                 <div className="min-h-[100px] flex flex-col justify-center">
                    <p className="text-2xl font-chinese font-black text-gray-900 leading-tight uppercase mb-2">{q.textZh || q.text}</p>
                    <p className="text-gray-400 font-bold italic text-sm">{q.text}</p>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setAnswers(prev => ({ ...prev, [i]: true }))}
                      className={cn(
                        "py-4 rounded-2xl font-black transition-all border-b-4",
                        answers[i] === true ? (q.answer === true ? "bg-emerald-500 text-white border-emerald-700" : "bg-red-500 text-white border-red-700") : "bg-gray-50 text-gray-400 border-gray-200 hover:bg-blue-50 hover:text-blue-500"
                      )}
                    >
                      正确 (ถูกต้อง)
                    </button>
                    <button 
                      onClick={() => setAnswers(prev => ({ ...prev, [i]: false }))}
                      className={cn(
                        "py-4 rounded-2xl font-black transition-all border-b-4",
                        answers[i] === false ? (q.answer === false ? "bg-emerald-500 text-white border-emerald-700" : "bg-red-500 text-white border-red-700") : "bg-gray-50 text-gray-400 border-gray-200 hover:bg-blue-50 hover:text-blue-500"
                      )}
                    >
                      错误 (ไม่ถูกต้อง)
                    </button>
                 </div>
              </div>
           ))}
        </div>
      </section>

      <section className="bg-blue-50 p-10 rounded-[4rem] border-4 border-white shadow-xl space-y-8">
         <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md">
              <Sparkles className="w-6 h-6 text-blue-500" />
           </div>
           <h4 className="text-2xl font-black text-blue-800 uppercase tracking-tight">คำศัพท์ประจำวันนี้นักเรียนรู้หรือไม่ (VOCAB PLUS)</h4>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {storyData.extraVocab.map((v: any, i: number) => (
               <div key={`extra-vocab-7-${i}`} className="bg-white p-6 rounded-3xl border-2 border-blue-200 shadow-sm flex items-center gap-4 group">
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                     {i === 0 ? "💧" : i === 1 ? "🔥" : "🗣️"}
                  </div>
                  <div>
                     <p className="text-2xl font-chinese font-black text-gray-900 leading-none">{v.word}</p>
                     <p className="text-sm font-bold text-blue-500 italic">{v.pinyin}</p>
                     <p className="text-gray-400 font-bold text-xs">{v.translation}</p>
                  </div>
               </div>
            ))}
         </div>
      </section>
    </div>
  );
};

const WritingLesson7 = ({ lesson, speak }: { lesson: any, speak: (t: string) => void }) => {
  const writingData = lesson.activities.find((a: any) => a.type === 'writing_tasks');
  const [fillAnswers, setFillAnswers] = useState<Record<number, string>>({});

  if (!writingData) return null;

  return (
    <div className="space-y-12 pb-20">
      <div className="bg-gradient-to-r from-purple-500 to-fuchsia-400 p-8 rounded-4xl text-white shadow-lg relative overflow-hidden">
         <div className="relative z-10 flex items-center gap-6">
            <ThreeDContainer color="purple" size="lg" className="hidden md:flex">
               <Zap size={48} />
            </ThreeDContainer>
            <div>
               <h3 className="text-3xl font-black leading-tight mb-2 uppercase tracking-tight">กิจกรรมการฝึกเขียน (WRITING)</h3>
               <p className="text-purple-100 font-bold italic text-lg uppercase tracking-wider">บทที่ {lesson.id}: {lesson.title}</p>
            </div>
         </div>
         <Zap className="w-48 h-48 absolute -right-12 -bottom-12 text-white/10 rotate-12" />
      </div>

      <section className="space-y-8">
        <div className="flex items-center gap-4">
           <div className="w-3 h-10 bg-purple-500 rounded-full shadow-lg" />
           <h4 className="text-2xl font-black text-gray-900 uppercase tracking-tight">กิจกรรมที่ 1: ฝึกลากเส้นและจดจำตัวอักษร</h4>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
           {writingData.chars.map((c: any, i: number) => (
              <div key={`writing-7-char-${i}`} className="bg-white p-8 rounded-[3rem] border-4 border-purple-50 shadow-xl space-y-6 text-center hover:border-purple-300 transition-all group">
                 <div className="aspect-square bg-gray-50 rounded-3xl border-4 border-dashed border-gray-100 flex items-center justify-center relative overflow-hidden">
                    <span className="text-[8rem] font-chinese opacity-[0.03] absolute">{c.char}</span>
                    <span className="text-7xl font-chinese font-black text-chinese-red relative z-10">{c.char}</span>
                 </div>
                 <div>
                    <p className="text-2xl font-bold text-purple-600 italic tracking-widest">{c.pinyin}</p>
                    <p className="text-gray-400 font-bold italic">{c.translation}</p>
                 </div>
              </div>
           ))}
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex items-center gap-4">
           <div className="w-3 h-10 bg-purple-500 rounded-full shadow-lg" />
           <h4 className="text-2xl font-black text-gray-900 uppercase tracking-tight">กิจกรรมที่ 2: เติมคำลงในช่องว่าง</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {writingData.fillBlanks.map((q: any, i: number) => (
              <div key={`writing-7-fill-${i}`} className="bg-white p-10 rounded-[3.5rem] border-4 border-purple-50 shadow-2xl space-y-8">
                 <div className="space-y-2">
                    <p className="text-3xl font-chinese font-black text-gray-900 leading-tight uppercase">
                       {q.text.split('__').map((part: string, idx: number) => (
                          <React.Fragment key={idx}>
                             {part}
                             {idx === 0 && <span className={cn("inline-block w-16 h-16 border-b-4 mx-2 text-center text-purple-600 transition-all", fillAnswers[i] ? "border-emerald-500" : "border-purple-200 animate-pulse")}>{fillAnswers[i] || "?"}</span>}
                          </React.Fragment>
                       ))}
                    </p>
                    <p className="text-lg font-bold text-purple-400 italic">{q.pinyin}</p>
                    <p className="text-gray-400 font-bold italic">{q.translation}</p>
                 </div>
                 <div className="grid grid-cols-3 gap-4">
                    {q.options.map((opt: string, idx: number) => (
                       <button 
                         key={idx}
                         onClick={() => setFillAnswers(prev => ({ ...prev, [i]: opt }))}
                         className={cn(
                           "py-4 bg-white rounded-2xl border-2 font-chinese font-black text-3xl shadow-sm hover:scale-105 transition-all",
                           fillAnswers[i] === opt ? (opt === q.answer ? "border-emerald-500 text-emerald-600 bg-emerald-50" : "border-red-500 text-red-600 bg-red-50") : "border-gray-100 text-gray-500 hover:border-purple-300"
                         )}
                       >
                         {opt}
                       </button>
                    ))}
                 </div>
              </div>
           ))}
        </div>
      </section>

      <section className="bg-purple-50 p-10 rounded-[4rem] border-4 border-white shadow-xl space-y-8">
         <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md">
              <Filter className="w-6 h-6 text-purple-500" />
           </div>
           <h4 className="text-2xl font-black text-purple-800 uppercase tracking-tight">กิจกรรมที่ 3: จัดกลุ่มตัวอักษรจีน</h4>
         </div>
         <p className="text-lg font-bold text-purple-600 mb-6 italic">มีตัวอักษรจีนตัวไหนที่ใชัอัวยะเป็นส่วนประกอบบ้างนะ?</p>
         <div className="bg-white p-10 rounded-[3rem] border-2 border-purple-100 flex flex-wrap justify-center gap-6">
            {writingData.grouping.map((char: string, i: number) => (
               <motion.div 
                 key={`group-char-${i}`}
                 whileHover={{ scale: 1.1, rotate: 5 }}
                 className="w-24 h-24 bg-purple-50 border-4 border-white rounded-[1.8rem] flex items-center justify-center text-5xl font-chinese font-black text-purple-600 shadow-xl cursor-default"
               >
                  {char}
               </motion.div>
            ))}
         </div>
      </section>
    </div>
  );
};

const PinyinLesson7 = ({ lesson, speak, pinyinSpeak }: { lesson: any, speak: (t: string) => void, pinyinSpeak: (t: string) => void }) => {
  const pinyinData = lesson.activities.find((a: any) => a.type === 'pinyin_rules');
  if (!pinyinData) return null;

  return (
    <div className="space-y-12 pb-20">
      <div className="bg-gradient-to-r from-chinese-gold to-yellow-400 p-8 rounded-4xl text-white shadow-lg relative overflow-hidden">
         <div className="relative z-10 flex items-center gap-6">
            <ThreeDContainer color="gold" size="lg" className="hidden md:flex">
               <Star size={48} />
            </ThreeDContainer>
            <div>
               <h3 className="text-3xl font-black leading-tight mb-2 uppercase tracking-tight">กิจกรรมฝึกพินอิน (PINYIN)</h3>
               <p className="text-yellow-100 font-bold italic text-lg uppercase tracking-wider">บทที่ {lesson.id}: {lesson.title}</p>
            </div>
         </div>
         <Star className="w-48 h-48 absolute -right-12 -bottom-12 text-white/10 rotate-12" />
      </div>

      <section className="bg-white p-10 rounded-[4rem] border-4 border-chinese-gold/5 shadow-2xl space-y-8 relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
            <Zap size={100} className="text-chinese-gold" />
         </div>
         <div className="flex items-center gap-4 relative z-10">
           <div className="w-3 h-10 bg-chinese-gold rounded-full shadow-lg shadow-yellow-200" />
           <h4 className="text-2xl font-black text-gray-900 uppercase tracking-tight">กฎการเปลี่ยนเสียงวรรณยุกต์ (Tone Sandhi)</h4>
         </div>
         <div className="bg-yellow-50 p-8 rounded-3xl border-2 border-dashed border-yellow-200 relative z-10">
            <p className="text-2xl font-black text-yellow-800 mb-4 italic">{pinyinData.rule}</p>
            <p className="text-lg font-bold text-yellow-700 leading-relaxed">{pinyinData.explanation}</p>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            {pinyinData.sets.map((set: any, i: number) => (
               <div key={`pinyin-7-set-${i}`} className="bg-white p-6 rounded-[2.5rem] border-2 border-gray-50 shadow-xl space-y-4 hover:border-chinese-gold transition-all text-center">
                  <div className="flex justify-center items-center gap-4 text-3xl font-bold text-gray-400">
                     <span className="font-mono">{set.original}</span>
                     <ArrowRight size={24} className="text-chinese-gold" />
                  </div>
                  <div className="space-y-1">
                     <p className="text-4xl font-mono font-black text-chinese-gold-dark">{set.result}</p>
                     <p className="text-2xl font-chinese font-black text-gray-900 uppercase">{set.zh}</p>
                  </div>
                  <button onClick={() => pinyinSpeak(set.result)} className="w-full py-2 bg-yellow-50 text-yellow-700 rounded-xl font-black text-sm hover:bg-chinese-gold hover:text-white transition-all shadow-sm">ฟังเสียงอ่าน</button>
               </div>
            ))}
         </div>
      </section>

      <section className="space-y-8">
        <div className="flex items-center gap-4">
           <div className="w-3 h-10 bg-chinese-gold rounded-full shadow-lg" />
           <h4 className="text-2xl font-black text-gray-900 uppercase tracking-tight">ฝึกอ่านคำศัพท์ผันเสียง</h4>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
           {pinyinData.vocab.map((v: any, i: number) => (
              <div key={`pinyin-7-vocab-${i}`} className="bg-white p-6 rounded-3xl border-2 border-gray-100 shadow-sm text-center space-y-2 hover:bg-yellow-50 transition-colors group">
                 <p className="text-3xl font-chinese font-black text-gray-900 uppercase group-hover:text-chinese-gold-dark">{v.zh}</p>
                 <p className="text-sm font-bold text-chinese-gold italic">{v.py}</p>
                 <p className="text-xs text-gray-400 font-bold italic">{v.th}</p>
                 <button onClick={() => pinyinSpeak(v.py)} className="w-8 h-8 bg-white text-chinese-gold rounded-full flex items-center justify-center mx-auto shadow-sm opacity-0 group-hover:opacity-100 transition-all">
                    <Volume2 size={14} />
                 </button>
              </div>
           ))}
        </div>
      </section>

      <section className="bg-yellow-50 p-10 rounded-[4.5rem] border-4 border-white shadow-xl space-y-10 text-center relative overflow-hidden">
         <div className="flex flex-col items-center gap-3">
            <div className="bg-white p-5 rounded-full shadow-lg animate-bounce">
               <Music2 className="w-8 h-8 text-chinese-gold" />
            </div>
            <h4 className="text-3xl font-black text-chinese-gold-dark uppercase tracking-tight">บทกลอนเสียงวรรณยุกต์</h4>
         </div>
         <div className="space-y-8 max-w-2xl mx-auto">
            {pinyinData.rhyme.map((line: any, i: number) => (
               <div key={`pinyin-7-rhyme-${i}`} className="space-y-3 bg-white/60 p-8 rounded-[3rem] backdrop-blur-sm border-2 border-white shadow-sm hover:scale-105 transition-all">
                  <p className="text-4xl font-chinese font-black text-gray-900 leading-tight uppercase tracking-widest">{line.zh}</p>
                  <p className="text-xl font-bold text-chinese-gold-dark italic uppercase tracking-wider">{line.py}</p>
                  <p className="text-gray-400 font-bold italic">{line.th}</p>
                  <button onClick={() => speak(line.zh)} className="mt-4 px-8 py-3 bg-white text-chinese-gold rounded-2xl font-black shadow-md border-2 border-yellow-100 active:scale-95 transition-all flex items-center gap-2 mx-auto uppercase tracking-widest">
                     <Volume2 size={24} /> อ่านออกเสียง
                  </button>
               </div>
            ))}
         </div>
      </section>
    </div>
  );
};

const FunLesson7 = ({ lesson, speak }: { lesson: any, speak: (t: string) => void }) => {
  const funData = lesson.activities.find((a: any) => a.type === 'fun_content');
  if (!funData) return null;

  return (
    <div className="space-y-12 pb-20">
      <div className="bg-gradient-to-r from-pink-500 to-rose-400 p-8 rounded-4xl text-white shadow-lg relative overflow-hidden">
         <div className="relative z-10 flex items-center gap-6">
            <ThreeDContainer color="purple" size="lg" className="hidden md:flex">
               <Gamepad2 size={48} />
            </ThreeDContainer>
            <div>
               <h3 className="text-3xl font-black leading-tight mb-2 uppercase tracking-tight">กิจกรรมหรรษา (FUN)</h3>
               <p className="text-pink-100 font-bold italic text-lg uppercase tracking-wider">บทที่ {lesson.id}: {lesson.title}</p>
            </div>
         </div>
         <Gamepad2 className="w-48 h-48 absolute -right-12 -bottom-12 text-white/10 rotate-12" />
      </div>

      <section className="bg-white p-12 rounded-[4rem] border-4 border-pink-50 shadow-2xl text-center space-y-10">
         <div className="space-y-4">
            <div className="inline-block p-6 bg-pink-50 rounded-full shadow-lg shadow-pink-100 animate-pulse">
               <Trophy size={60} className="text-pink-500" />
            </div>
            <h4 className="text-4xl font-black text-gray-900 uppercase tracking-tight">{funData.symptomsGame.title}</h4>
            <p className="text-xl font-bold text-pink-600 italic bg-pink-50 px-8 py-2 rounded-full inline-block">{funData.symptomsGame.instruction}</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {funData.symptomsGame.questions.map((q: any, i: number) => (
               <div key={`fun-7-game-q-${i}`} className="bg-white p-10 rounded-[3.5rem] border-4 border-pink-50 shadow-xl space-y-6 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-2 h-full bg-pink-500" />
                  <div className="space-y-2">
                     <p className="text-4xl font-chinese font-black text-gray-800 uppercase tracking-widest">{q.textZh || q.text}</p>
                     <p className="text-xl font-bold text-pink-400 italic">{q.translation}</p>
                  </div>
                  <div className="bg-pink-50 p-6 rounded-3xl border-2 border-pink-100 shadow-inner group-hover:bg-pink-500 group-hover:text-white transition-all transform group-hover:scale-105 duration-500">
                     <p className="text-3xl font-chinese font-black uppercase tracking-widest mb-1">{q.answerZh}</p>
                     <p className="text-lg font-bold opacity-80 italic">{q.answer}</p>
                  </div>
               </div>
            ))}
         </div>
      </section>

      <section className="bg-gradient-to-br from-pink-50 to-rose-50 p-10 rounded-[4.5rem] border-4 border-white shadow-xl space-y-10 text-center relative overflow-hidden">
         <div className="flex flex-col items-center gap-3">
            <div className="bg-white p-5 rounded-full shadow-lg animate-bounce">
               <Music size={40} className="text-pink-500" />
            </div>
            <h4 className="text-3xl font-black text-pink-600 uppercase tracking-tight italic">บทกลอน ยุงกัดหัว 🦟</h4>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {funData.mosquitoRhyme.map((line: any, i: number) => (
               <div key={`fun-7-rhyme-${i}`} className="bg-white p-8 rounded-[2.5rem] border-2 border-pink-100 shadow-sm hover:scale-105 transition-all text-left group">
                  <div className="flex items-center gap-4 mb-3">
                     <span className={cn("w-10 h-10 rounded-2xl flex items-center justify-center font-black text-white shadow-lg", i % 2 === 0 ? "bg-pink-500" : "bg-rose-400")}>{i + 1}</span>
                     <button onClick={() => speak(line.zh)} className="w-10 h-10 bg-pink-50 text-pink-500 rounded-full flex items-center justify-center hover:bg-pink-500 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                        <Volume2 size={16} />
                     </button>
                  </div>
                  <p className="text-2xl font-chinese font-black text-gray-900 leading-tight uppercase tracking-widest">{line.zh}</p>
                  <p className="text-sm font-bold text-pink-400 italic tracking-wider mb-2">{line.py}</p>
                  <p className="text-gray-400 font-bold italic text-xs">{line.th}</p>
               </div>
            ))}
         </div>
      </section>
    </div>
  );
};

const SummaryLesson7 = ({ lesson, setActiveActivity, speak }: { lesson: any, setActiveActivity: (type: ActivityType) => void, speak: (t: string, r?: number) => void }) => {
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const navigate = useNavigate();
  const items = [
    "ฉันบอกชื่ออวัยวะต่างๆ เป็นภาษาจีนได้",
    "ฉันบอกอาการเจ็บป่วยเบื้องต้นได้",
    "ฉันใช้คำว่า 了 เพื่อบอกสิ่งที่ทำเสร็จแล้วได้",
    "ฉันเข้าใจกฎการเปลี่ยนเสียงพินอิน nǐ hǎo",
    "ฉันเขียนตัวอักษรจีนสำคัญของบทนี้ได้"
  ];

  const isAllChecked = Object.values(checkedItems).filter(Boolean).length === items.length;

  return (
    <div className="space-y-12 pb-20">
      <div className="bg-chinese-red p-8 rounded-4xl text-white shadow-lg relative overflow-hidden">
        <h3 className="text-3xl font-black mb-2 uppercase tracking-tight">สรุปบทเรียน (SUMMARY)</h3>
        <p className="font-bold opacity-90 italic">บทที่ {lesson.id}: {lesson.title}</p>
        <Trophy className="w-48 h-48 absolute -right-12 -bottom-12 text-white/10 rotate-12" />
      </div>

      <SummaryDetails data={{
        learned: [
          "เรียนคำศัพท์อวัยวะ เช่น 眼睛, 鼻子, 肚子, 牙",
          "เรียนอาการเจ็บป่วย เช่น 疼 (téng), 痒 (yǎng), 不舒服",
          "เรียนรูปประโยค 我 + อวัยวะ + 疼。"
        ],
        listening: [
          "ฟังและแยกแยะชื่ออวัยวะต่างๆ",
          "ฟังประโยคอาการป่วย เช่น 我的肚子疼。",
          "ฟังบทสนทนาถามไถ่อาการป่วย"
        ],
        speaking: [
          "ฝึกถาม-ตอบอาการป่วย你怎么了？",
          "ฝึกใช้ประโยค 我吃ล了很多... 了 เพื่อบอกเหตุที่ทำให้ป่วย",
          "ฝึกพูดชื่ออวัยวะให้ถูกต้องตามภาพ"
        ],
        fun: [
          "เกมทายอาการป่วยจากท่าทาง",
          "บทกลอนสนุกๆ เรื่องยุงกัด",
          "จับคู่พินอินกับอวัยวะ"
        ],
        reading: [
          "อ่านบันทึกประจำวันของมาร์ติน",
          "อ่านชื่ออาการป่วยเพิ่มเติม เช่น 流鼻涕, 发烧",
          "ตอบคำถามจากเรื่องที่อ่านได้ถูกต้อง"
        ],
        writing: [
          "ฝึกเขียน 牙, 疼, 肚, 腿",
          "จัดกลุ่มตัวอักษรที่มีส่วนประกอบของอวัยวะ",
          "เติมคำศัพท์ลงในช่องว่างของประโยค"
        ],
        pinyin: [
          "เรียนกฎการเปลี่ยนเสียง 3 เป็นเสียง 2 (Tone Sandhi)",
          "ฝึกอ่านคำที่มีการเปลี่ยนเสียง เช่น 你好, 很好, 洗澡",
          "ฝึกกลอนสัมผัสที่มีพยางค์เสียง 3 ต่อเนื่อง"
        ]
      }} />

      <section className="space-y-8">
        <div className="flex items-center gap-4">
           <div className="w-3 h-10 bg-emerald-500 rounded-full shadow-lg" />
           <h4 className="text-2xl font-black text-gray-900 uppercase tracking-tight">เช็กความสำเร็จ 🎯</h4>
        </div>
        <div className="bg-white p-10 rounded-[4rem] border-4 border-emerald-50 shadow-2xl space-y-4">
          {items.map((item, idx) => (
            <label key={idx} className="flex items-center gap-6 p-6 hover:bg-emerald-50 rounded-[2.5rem] cursor-pointer transition-all group">
              <div className="relative">
                 <input 
                   type="checkbox" 
                   checked={checkedItems[idx] || false} 
                   onChange={() => setCheckedItems(prev => ({ ...prev, [idx]: !prev[idx] }))} 
                   className="w-10 h-10 rounded-2xl border-4 border-emerald-100 text-emerald-500 transition-all cursor-pointer focus:ring-0 peer" 
                 />
                 <Check className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
              </div>
              <span className={cn("text-2xl font-bold transition-all", checkedItems[idx] ? "text-emerald-600 line-through opacity-50" : "text-gray-700")}>{item}</span>
            </label>
          ))}
          
          <AnimatePresence>
            {isAllChecked && (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0, y: 20 }} 
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="mt-10 bg-gradient-to-br from-emerald-500 to-teal-400 p-12 rounded-[5rem] text-center text-white space-y-8 shadow-[0_20px_50px_rgba(16,185,129,0.3)] relative overflow-hidden"
              >
                  <Sparkles className="absolute top-8 left-8 w-16 h-16 opacity-20 animate-pulse" />
                  <Sparkles className="absolute bottom-8 right-8 w-16 h-16 opacity-20 animate-pulse delay-100" />
                  <div className="relative z-10 space-y-8">
                    <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center mx-auto shadow-2xl border-[12px] border-white/20 animate-bounce">
                      <Trophy className="w-20 h-20 text-chinese-gold" />
                    </div>
                    <div className="space-y-4">
                       <h5 className="text-5xl font-black italic">เก่งที่สุดเลย! ✨</h5>
                       <p className="text-2xl font-bold opacity-90 max-w-lg mx-auto leading-relaxed">เด็กๆ เรียนเนื้อหาบทความสำเร็จแล้ว พร้อมที่จะไปรับภารกิจสุดท้ายหรือยัง?</p>
                    </div>
                    <ChineseButton variant="gold" size="lg" className="rounded-3xl px-16 py-10 text-2xl shadow-2xl" onClick={() => { window.scrollTo({ top: 0, behavior: 'instant' }); navigate('/lesson/8'); }}>
                       ไปทำกิจกรรมบที่ 8 ต่อเลย! <ChevronRight className="ml-3 w-8 h-8" />
                    </ChineseButton>
                  </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Navigation Buttons */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-chinese-red rounded-full" />
          <h4 className="text-2xl font-black text-gray-900 uppercase">ทบทวนกิจกรรมอื่นๆ</h4>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
           {[
             { label: "ฝึกฟังอีกครั้ง", target: ActivityType.LISTENING, icon: <Volume2 className="w-6 h-6" />, color: "bg-orange-500" },
             { label: "ฝึกพูดอีกครั้ง", target: ActivityType.SPEAKING, icon: <Sparkles className="w-6 h-6" />, color: "bg-emerald-500" },
             { label: "ฝึกอ่านอีกครั้ง", target: ActivityType.READING, icon: <BookOpen className="w-6 h-6" />, color: "bg-blue-500" },
             { label: "ฝึกเขียนอีกครั้ง", target: ActivityType.WRITING, icon: <Zap className="w-6 h-6" />, color: "bg-purple-500" },
             { label: "ฝึกพินอินอีกครั้ง", target: ActivityType.PINYIN, icon: <Star className="w-6 h-6" />, color: "bg-chinese-gold" },
             { label: "เล่นเกมหรรษา", target: ActivityType.FUN, icon: <Gamepad2 className="w-6 h-6" />, color: "bg-pink-500" },
           ].map((btn, i) => (
             <button 
              key={`nav-7-summary-${i}`}
              onClick={() => {
                setActiveActivity(btn.target);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={cn(
                "p-8 rounded-[2.5rem] text-white font-black flex flex-col items-center justify-center gap-3 shadow-xl hover:scale-105 active:scale-95 transition-all text-lg",
                btn.color
              )}
             >
                {btn.icon}
                {btn.label}
             </button>
           ))}
        </div>
      </section>
    </div>
  );
};

const SummaryLesson8 = ({ lesson, setActiveActivity, speak }: { lesson: any, setActiveActivity: (type: ActivityType) => void, speak: (t: string, r?: number) => void }) => {
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const navigate = useNavigate();
  const items = [
    "ฉันบอกชื่อกิจกรรมต่างๆ เป็นภาษาจีนได้",
    "ฉันพูดประโยค 学袋鼠，跳一跳 ได้",
    "ฉันบอกความสามารถได้ด้วย 会 และ 不会",
    "ฉันอ่านคำพินอินที่มีเสียงเบา/สั้นได้",
    "ฉันเขียนตัวอักษร 站 走 爬 飞 ได้"
  ];

  const isAllChecked = Object.values(checkedItems).filter(Boolean).length === items.length;

  return (
    <div className="space-y-12 pb-20">
      <div className="bg-chinese-red p-8 rounded-4xl text-white shadow-lg relative overflow-hidden">
        <h3 className="text-3xl font-black mb-2 uppercase tracking-tight">สรุปบทเรียน (SUMMARY)</h3>
        <p className="font-bold opacity-90 italic">บทที่ {lesson.id}: {lesson.title}</p>
        <Trophy className="w-48 h-48 absolute -right-12 -bottom-12 text-white/10 rotate-12" />
      </div>

      <SummaryDetails data={{
        learned: [
          "เรียนคำศัพท์ท่าทาง เช่น 坐, 站, 走, 跳, 跑, 爬, 游, 飞",
          "เรียนคำศัพท์สัตว์ เช่น 乌龟, 袋鼠, 企鹅, 小马",
          "เรียนการบอกว่าทำสิ่งใดได้ด้วย 会 และ ไม่ได้ด้วย 不会"
        ],
        listening: [
          "ฟังคำศัพท์ท่าทางและสัตว์",
          "ฟังประโยค 学袋鼠，跳一跳。",
          "ฟังประโยคบอกความสามารถ เช่น 你会坐，不会站。"
        ],
        speaking: [
          "ฝึกพูดและทำท่าทางประกอบ",
          "ฝึกประโยค 学 + สัตว์ + กริยา一กริยา",
          "ฝึกถามตอบว่าใครทำอะไรได้ด้วย 谁会...？"
        ],
        fun: [
          "จับคู่พินอินกับคำศัพท์ท่าทาง",
          "เกมเลียนแบบสัตว์และพูดประโยค",
          "เกมจัดกลุ่มสัตว์ตามความสามารถ"
        ],
        reading: [
          "อ่านเรื่องสั้นเกี่ยวกับการเติบโตและความสามารถ",
          "อ่านประโยค 你会坐，不会站。",
          "ฝึกตอบคำถามด้วย 会 และ 不会"
        ],
        writing: [
          "ฝึกเขียน 站, 走, 爬, 飞",
          "เติมเส้นขีดที่หายไปในตัวอักษรจีน",
          "ฝึกคัด 走 และ 飞"
        ],
        pinyin: [
          "ฝึกอ่านคำที่มีเสียงเบา/เสียงสั้น",
          "อ่านคำศัพท์ เช่น bózi, ěrduo, dùzi, zhuōzi",
          "ฝึกอ่านประโยคที่มี ma, le, ba, de, zi"
        ]
      }} />

      <section className="space-y-8">
        <div className="flex items-center gap-4">
           <div className="w-3 h-10 bg-emerald-500 rounded-full shadow-lg" />
           <h4 className="text-2xl font-black text-gray-900 uppercase tracking-tight">เช็กความสำเร็จ 🎯</h4>
        </div>
        <div className="bg-white p-10 rounded-[4rem] border-4 border-emerald-50 shadow-2xl space-y-4">
          {items.map((item, idx) => (
            <label key={idx} className="flex items-center gap-6 p-6 hover:bg-emerald-50 rounded-[2.5rem] cursor-pointer transition-all group">
              <div className="relative">
                 <input 
                   type="checkbox" 
                   checked={checkedItems[idx] || false} 
                   onChange={() => setCheckedItems(prev => ({ ...prev, [idx]: !prev[idx] }))} 
                   className="w-10 h-10 rounded-2xl border-4 border-emerald-100 text-emerald-500 transition-all cursor-pointer focus:ring-0 peer" 
                 />
                 <Check className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
              </div>
              <span className={cn("text-2xl font-bold transition-all", checkedItems[idx] ? "text-emerald-600 line-through opacity-50" : "text-gray-700")}>{item}</span>
            </label>
          ))}
          
          <AnimatePresence>
            {isAllChecked && (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0, y: 20 }} 
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="mt-10 bg-gradient-to-br from-emerald-500 to-teal-400 p-12 rounded-[5rem] text-center text-white space-y-8 shadow-[0_20px_50px_rgba(16,185,129,0.3)] relative overflow-hidden"
              >
                  <Sparkles className="absolute top-8 left-8 w-16 h-16 opacity-20 animate-pulse" />
                  <Sparkles className="absolute bottom-8 right-8 w-16 h-16 opacity-20 animate-pulse delay-100" />
                  <div className="relative z-10 space-y-8">
                    <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center mx-auto shadow-2xl border-[12px] border-white/20 animate-bounce">
                      <Trophy className="w-20 h-20 text-chinese-gold" />
                    </div>
                    <div className="space-y-4">
                       <h5 className="text-5xl font-black italic">เก่งที่สุดเลย! ✨</h5>
                       <p className="text-2xl font-bold opacity-90 max-w-lg mx-auto leading-relaxed">เด็กๆ เรียนเนื้อหาบทที่ 8 สำเร็จแล้ว พร้อมที่จะไปรับภารกิจสุดท้ายหรือยัง?</p>
                    </div>
                    <ChineseButton variant="gold" size="lg" className="rounded-3xl px-16 py-10 text-2xl shadow-2xl" onClick={() => { window.scrollTo({ top: 0, behavior: 'instant' }); navigate('/lesson/8'); }}>
                       ไปทำภารกิจสุดท้ายกันเลย! <ChevronRight className="ml-3 w-8 h-8" />
                    </ChineseButton>
                  </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-chinese-red rounded-full" />
          <h4 className="text-2xl font-black text-gray-900 uppercase">ทบทวนกิจกรรมอื่นๆ</h4>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
           {[
             { label: "ฝึกฟังอีกครั้ง", target: ActivityType.LISTENING, icon: <Volume2 className="w-6 h-6" />, color: "bg-orange-500" },
             { label: "ฝึกพูดอีกครั้ง", target: ActivityType.SPEAKING, icon: <Sparkles className="w-6 h-6" />, color: "bg-emerald-500" },
             { label: "ฝึกอ่านอีกครั้ง", target: ActivityType.READING, icon: <BookOpen className="w-6 h-6" />, color: "bg-blue-500" },
             { label: "ฝึกเขียนอีกครั้ง", target: ActivityType.WRITING, icon: <Zap className="w-6 h-6" />, color: "bg-purple-500" },
             { label: "ฝึกพินอินอีกครั้ง", target: ActivityType.PINYIN, icon: <Star className="w-6 h-6" />, color: "bg-chinese-gold" },
             { label: "เล่นเกมหรรษา", target: ActivityType.FUN, icon: <Gamepad2 className="w-6 h-6" />, color: "bg-pink-500" },
           ].map((btn, i) => (
             <button 
              key={`nav-8-summary-${i}`}
              onClick={() => {
                setActiveActivity(btn.target);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={cn(
                "p-8 rounded-[2.5rem] text-white font-black flex flex-col items-center justify-center gap-3 shadow-xl hover:scale-105 active:scale-95 transition-all text-lg",
                btn.color
              )}
             >
                {btn.icon}
                {btn.label}
             </button>
           ))}
        </div>
      </section>
    </div>
  );
};

const FunLesson8 = ({ lesson, speak }: { lesson: any, speak: (t: string) => void }) => {
  const funData = lesson.activities.find((a: any) => a.type === 'fun_content');
  const [matchAnswers, setMatchAnswers] = useState<Record<string, string>>({});
  const [activeCategory, setActiveCategory] = useState(funData.grouping.categories[0]);

  return (
    <div className="space-y-12 pb-20">
      <div className="bg-gradient-to-r from-pink-500 to-rose-400 p-8 rounded-4xl text-white shadow-lg relative overflow-hidden">
         <div className="relative z-10 flex items-center gap-6">
            <ThreeDContainer color="purple" size="lg" className="hidden md:flex">
               <Gamepad2 size={48} />
            </ThreeDContainer>
            <div>
               <h3 className="text-3xl font-black leading-tight mb-2 uppercase tracking-tight">กิจกรรมหรรษา (FUN)</h3>
               <p className="text-pink-100 font-bold italic text-lg uppercase tracking-wider">บทที่ {lesson.id}: {lesson.title}</p>
            </div>
         </div>
         <Gamepad2 className="w-48 h-48 absolute -right-12 -bottom-12 text-white/10 rotate-12" />
      </div>

      <section className="bg-white p-12 rounded-[4rem] border-4 border-pink-50 shadow-2xl space-y-10">
         <div className="text-center space-y-4">
            <h4 className="text-3xl font-black text-gray-900 uppercase">กิจกรรมที่ 1: เลือกพินอินให้ตรงกับคำศัพท์</h4>
            <p className="text-pink-600 font-bold">ฝึกจับคู่คำศัพท์ท่าทางกับพินอินที่ถูกต้อง</p>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {funData.matchPairs.map((pair: any, i: number) => (
               <div key={`fun-8-match-${i}`} className="bg-white p-6 rounded-3xl border-2 border-gray-100 shadow-xl space-y-4 text-center group">
                  <p className="text-5xl font-chinese font-black text-gray-900">{pair.zh}</p>
                  <div className="grid grid-cols-2 gap-2">
                     {[pair.py, "shì", "ma", "de"].sort().slice(0, 2).map((opt, idx) => (
                        <button 
                          key={idx}
                          onClick={() => setMatchAnswers(prev => ({ ...prev, [pair.zh]: opt }))}
                          className={cn(
                            "py-2 rounded-xl font-bold transition-all",
                            matchAnswers[pair.zh] === opt ? (opt === pair.py ? "bg-emerald-500 text-white" : "bg-red-500 text-white") : "bg-pink-50 text-pink-600 hover:bg-pink-500 hover:text-white"
                          )}
                        >
                          {opt}
                        </button>
                     ))}
                  </div>
               </div>
            ))}
         </div>
      </section>

      <section className="bg-pink-50 p-10 rounded-[4rem] border-4 border-white shadow-xl space-y-10 text-center">
         <div className="space-y-4">
            <div className="inline-block p-4 bg-white rounded-full shadow-lg animate-bounce">
               <Sparkles className="text-pink-500 w-10 h-10" />
            </div>
            <h4 className="text-3xl font-black text-pink-900">กิจกรรมที่ 2: เกมฉันเป็นสัตว์อะไร</h4>
            <p className="text-lg font-bold text-pink-600 italic">ฟังประโยคแล้วทำท่าทางประกอบตามสัตว์ต่างๆ</p>
         </div>
         <div className="space-y-6 max-w-3xl mx-auto">
            {funData.mimicRhyme.map((line: any, i: number) => (
               <div key={`mimic-8-line-${i}`} className="bg-white/80 p-8 rounded-[3rem] shadow-xl border-4 border-pink-100 space-y-4 hover:scale-105 transition-all">
                  <p className="text-3xl font-chinese font-black leading-tight uppercase tracking-widest">{line.zh}</p>
                  <p className="text-xl font-bold text-pink-500 italic uppercase tracking-wider">{line.py}</p>
                  <p className="text-gray-500 font-bold italic">{line.th}</p>
                  <button onClick={() => speak(line.zh)} className="px-8 py-3 bg-pink-500 text-white rounded-2xl font-black shadow-lg hover:bg-pink-600 active:scale-95 transition-all flex items-center gap-2 mx-auto">
                     <Volume2 /> ฟังเสียงและฝึกพูด
                  </button>
               </div>
            ))}
         </div>
      </section>

      <section className="bg-white p-12 rounded-[4rem] border-4 border-pink-50 shadow-2xl space-y-10">
         <div className="text-center space-y-2">
            <h4 className="text-3xl font-black text-gray-900 uppercase">กิจกรรมที่ 3: เกมจัดกลุ่มคำศัพท์ (CATEGORIES)</h4>
            <p className="text-pink-600 font-bold italic">ใครทำอะไรได้บ้าง? มาจัดกลุ่มสัตว์ให้ถูกต้องกันเถอะ!</p>
         </div>
         
         <div className="flex flex-wrap justify-center gap-3">
            {funData.grouping.categories.map((cat: string) => (
               <button 
                 key={cat}
                 onClick={() => setActiveCategory(cat)}
                 className={cn(
                   "px-6 py-3 rounded-2xl font-black transition-all shadow-md",
                   activeCategory === cat ? "bg-pink-500 text-white scale-110" : "bg-pink-50 text-pink-500 hover:bg-pink-100"
                 )}
               >
                 {cat}
               </button>
            ))}
         </div>

         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {funData.grouping.animals.filter((a: any) => a.cat === activeCategory).map((a: any, i: number) => (
               <motion.div 
                 key={`group-animal-8-${i}`}
                 initial={{ scale: 0.8, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 className="bg-pink-50 p-6 rounded-3xl border-2 border-pink-100 text-center space-y-3 shadow-xl hover:border-pink-300 transition-all group"
               >
                  <p className="text-4xl font-chinese font-black text-gray-900 group-hover:text-pink-600">{a.zh}</p>
                  <p className="text-sm font-bold text-pink-400 italic leading-tight">{a.py}</p>
                  <button onClick={() => speak(a.zh)} className="w-8 h-8 bg-white text-pink-500 rounded-full flex items-center justify-center mx-auto shadow-sm">
                     <Volume2 size={14} />
                  </button>
               </motion.div>
            ))}
         </div>

         <div className="bg-pink-50/50 p-8 rounded-4xl space-y-6">
            <p className="font-black text-pink-800 text-xl">ลองฝึกถามตอบดูนะ!</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {funData.grouping.questions.map((q: any, i: number) => (
                  <div key={`group-q-8-${i}`} className="bg-white p-6 rounded-3xl shadow-md border-2 border-pink-100 space-y-3">
                     <p className="text-2xl font-chinese font-black text-gray-900 uppercase">{q.zh}</p>
                     <p className="text-pink-500 font-bold italic text-sm">{q.py}</p>
                     <p className="text-gray-400 font-bold text-xs italic">{q.th}</p>
                     <button onClick={() => speak(q.zh)} className="w-full py-2 bg-pink-50 text-pink-600 rounded-xl font-black text-xs hover:bg-pink-500 hover:text-white transition-all">ฟังเสียงถาม</button>
                  </div>
               ))}
            </div>
         </div>
      </section>
    </div>
  );
};

const PinyinLesson8 = ({ lesson, speak, pinyinSpeak }: { lesson: any, speak: (t: string) => void, pinyinSpeak: (t: string) => void }) => {
  const pinyinData = lesson.activities.find((a: any) => a.type === 'pinyin_short_tone');
  if (!pinyinData) return null;

  return (
    <div className="space-y-12 pb-20">
      <div className="bg-gradient-to-r from-chinese-gold to-yellow-400 p-8 rounded-4xl text-white shadow-lg relative overflow-hidden">
         <div className="relative z-10 flex items-center gap-6">
            <ThreeDContainer color="gold" size="lg" className="hidden md:flex">
               <Star size={48} />
            </ThreeDContainer>
            <div>
               <h3 className="text-3xl font-black leading-tight mb-2 uppercase tracking-tight">กิจกรรมฝึกพินอิน (PINYIN)</h3>
               <p className="text-yellow-100 font-bold italic text-lg uppercase tracking-wider">บทที่ {lesson.id}: {lesson.title}</p>
            </div>
         </div>
         <Star className="w-48 h-48 absolute -right-12 -bottom-12 text-white/10 rotate-12" />
      </div>

      <section className="bg-white p-10 rounded-[4rem] border-4 border-chinese-gold/5 shadow-2xl space-y-8">
         <div className="flex items-center gap-4">
           <div className="w-3 h-10 bg-chinese-gold rounded-full shadow-lg" />
           <h4 className="text-2xl font-black text-gray-900 uppercase tracking-tight">{pinyinData.intro}</h4>
         </div>
         <div className="bg-yellow-50 p-8 rounded-3xl border-2 border-dashed border-yellow-200">
            <p className="text-lg font-bold text-yellow-700 leading-relaxed italic">{pinyinData.description}</p>
         </div>
         
         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {pinyinData.vocab.map((v: any, i: number) => (
               <div key={`pinyin-8-vocab-${i}`} className="bg-white p-6 rounded-[2.5rem] border-2 border-gray-50 shadow-xl space-y-4 hover:border-chinese-gold transition-all text-center group">
                  <div className="w-16 h-16 bg-yellow-50 rounded-2xl flex items-center justify-center mx-auto mb-2 text-3xl group-hover:scale-110 transition-transform">🏷️</div>
                  <div className="space-y-1">
                     <p className="text-3xl font-chinese font-black text-gray-900">{v.zh}</p>
                     <p className="text-lg font-mono font-black text-chinese-gold-dark">{v.py}</p>
                     <p className="text-gray-400 font-bold italic text-xs">{v.th}</p>
                  </div>
                  <button onClick={() => speak(v.speak || v.zh)} className="w-full py-2 bg-yellow-50 text-yellow-700 rounded-xl font-black text-xs hover:bg-chinese-gold hover:text-white transition-all shadow-sm">ฟังเสียง</button>
               </div>
            ))}
         </div>
      </section>

      <section className="space-y-8">
         <div className="flex items-center gap-4">
           <div className="w-3 h-10 bg-chinese-gold rounded-full shadow-lg" />
           <h4 className="text-2xl font-black text-gray-900 uppercase tracking-tight">กิจกรรมที่ 2: อ่านประโยคให้ถูกต้อง</h4>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pinyinData.sentences.map((s: any, i: number) => (
               <div key={`pinyin-8-sentence-${i}`} className="bg-white p-8 rounded-[3rem] border-4 border-chinese-gold/10 flex items-center justify-between gap-6 shadow-xl hover:border-chinese-gold transition-all group">
                  <div className="space-y-2">
                     <p className="text-3xl font-chinese font-black text-gray-900 leading-tight uppercase tracking-tight group-hover:text-chinese-gold-dark transition-colors">{s.zhActual || s.zh}</p>
                     <p className="text-xl font-bold text-chinese-gold italic tracking-wider">{s.py}</p>
                     <p className="text-gray-400 font-bold italic text-sm">{s.th}</p>
                  </div>
                  <button onClick={() => speak(s.zhActual || s.zh)} className="w-16 h-16 bg-yellow-50 text-yellow-700 rounded-[1.8rem] flex items-center justify-center hover:bg-chinese-gold hover:text-white transition-all shadow-inner active:scale-95">
                     <Volume2 className="w-8 h-8" />
                  </button>
               </div>
            ))}
         </div>
      </section>
    </div>
  );
};

const WritingLesson8 = ({ lesson, speak }: { lesson: any, speak: (t: string) => void }) => {
  const writingData = lesson.activities.find((a: any) => a.type === 'writing_tasks');
  const [fillAnswers, setFillAnswers] = useState<Record<number, string>>({});

  if (!writingData) return null;

  return (
    <div className="space-y-12 pb-20">
      <div className="bg-gradient-to-r from-purple-500 to-fuchsia-400 p-8 rounded-4xl text-white shadow-lg relative overflow-hidden">
         <div className="relative z-10 flex items-center gap-6">
            <ThreeDContainer color="purple" size="lg" className="hidden md:flex">
               <Zap size={48} />
            </ThreeDContainer>
            <div>
               <h3 className="text-3xl font-black leading-tight mb-2 uppercase tracking-tight">กิจกรรมการฝึกเขียน (WRITING)</h3>
               <p className="text-purple-100 font-bold italic text-lg uppercase tracking-wider">บทที่ {lesson.id}: {lesson.title}</p>
            </div>
         </div>
         <Zap className="w-48 h-48 absolute -right-12 -bottom-12 text-white/10 rotate-12" />
      </div>

      <section className="space-y-8">
        <div className="flex items-center gap-4">
           <div className="w-3 h-10 bg-purple-500 rounded-full shadow-lg" />
           <h4 className="text-2xl font-black text-gray-900 uppercase tracking-tight">กิจกรรมที่ 1: อ่านแล้วเขียนตัวอักษรจีน</h4>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
           {writingData.chars.map((c: any, i: number) => (
              <div key={`writing-8-char-${i}`} className="bg-white p-8 rounded-[3rem] border-4 border-purple-50 shadow-xl space-y-6 text-center hover:border-purple-300 transition-all group">
                 <div className="aspect-square bg-gray-50 rounded-3xl border-4 border-dashed border-gray-100 flex items-center justify-center relative overflow-hidden">
                    <span className="text-[8rem] font-chinese opacity-[0.03] absolute">{c.char}</span>
                    <span className="text-7xl font-chinese font-black text-chinese-red relative z-10">{c.char}</span>
                 </div>
                 <div>
                    <p className="text-2xl font-bold text-purple-600 italic tracking-widest">{c.pinyin}</p>
                    <p className="text-gray-400 font-bold italic">{c.translation}</p>
                 </div>
                 <button onClick={() => speak(c.char)} className="w-full py-3 bg-purple-50 text-purple-600 rounded-2xl font-black shadow-sm flex items-center justify-center gap-2 hover:bg-purple-500 hover:text-white transition-all">
                    <Volume2 size={16} /> ฟังเสียง
                 </button>
              </div>
           ))}
        </div>
      </section>

      <section className="bg-purple-50 p-10 rounded-[4rem] border-4 border-white shadow-xl space-y-8">
         <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md">
              <Sparkles className="w-6 h-6 text-purple-500" />
           </div>
           <h4 className="text-2xl font-black text-purple-800 uppercase tracking-tight">กิจกรรมที่ 2: เขียนเส้นขีดที่หายไป</h4>
         </div>
         <div className="bg-white p-10 rounded-[3rem] flex flex-wrap justify-center gap-8">
            {writingData.missingStrokes.map((char: string, i: number) => (
               <div key={`missing-8-${i}`} className="space-y-4 text-center">
                  <div className="w-32 h-32 bg-gray-50 rounded-[2.5rem] border-4 border-dashed border-purple-200 flex items-center justify-center text-6xl font-chinese font-black text-chinese-red group cursor-pointer hover:border-purple-500 transition-all">
                     <span className="opacity-30">{char}</span>
                  </div>
                  <button onClick={() => speak(char)} className="px-4 py-1 bg-purple-100 text-purple-600 rounded-full font-bold text-xs uppercase tracking-widest">Listen</button>
               </div>
            ))}
         </div>
      </section>

      <section className="space-y-8">
         <div className="flex items-center gap-4">
           <div className="w-3 h-10 bg-purple-500 rounded-full shadow-lg" />
           <h4 className="text-2xl font-black text-gray-900 uppercase tracking-tight">กิจกรรมที่ 3: สังเกตส่วนประกอบตัวอักษร</h4>
         </div>
         <p className="text-lg font-bold text-purple-600 italic">ระบายสีส่วนประกอบที่เหมือนกันในแต่ละคู่</p>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {writingData.colorPairs.map((pair: any, i: number) => (
               <div key={`pair-8-${i}`} className="bg-white p-10 rounded-[4rem] border-4 border-purple-50 shadow-2xl flex items-center justify-center gap-10 hover:border-purple-300 transition-all group">
                  <div className="space-y-2 text-center">
                     <p className="text-7xl font-chinese font-black text-gray-900 leading-none group-hover:text-purple-600">{pair.a}</p>
                     <button onClick={() => speak(pair.a)} className="text-[10px] bg-purple-50 px-2 rounded-full font-bold text-purple-400">Speak</button>
                  </div>
                  <div className="w-px h-16 bg-purple-100 rotate-12" />
                  <div className="space-y-2 text-center">
                     <p className="text-7xl font-chinese font-black text-gray-900 leading-none group-hover:text-purple-600">{pair.b}</p>
                     <button onClick={() => speak(pair.b)} className="text-[10px] bg-purple-50 px-2 rounded-full font-bold text-purple-400">Speak</button>
                  </div>
               </div>
            ))}
         </div>
      </section>

      <section className="bg-purple-50 p-10 rounded-[4rem] border-4 border-white shadow-xl space-y-8">
         <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md">
              <Zap className="w-6 h-6 text-purple-500" />
           </div>
           <h4 className="text-2xl font-black text-purple-800 uppercase tracking-tight">กิจกรรมที่ 4: เขียนลำดับขีดตามลายเส้น</h4>
         </div>
         <div className="space-y-8">
            {writingData.copyTasks.map((task: any, i: number) => (
               <div key={`copy-8-${i}`} className="bg-white p-10 rounded-[4rem] shadow-xl border-4 border-purple-50 space-y-8">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <p className="text-4xl font-chinese font-black text-chinese-red">{task.char}</p>
                        <div>
                           <p className="text-xl font-bold text-purple-600 italic leading-none">{task.phrase}</p>
                           <p className="text-sm font-bold text-gray-400 italic">ความหมาย: {task.th}</p>
                        </div>
                     </div>
                     <button onClick={() => speak(task.char)} className="w-12 h-12 bg-purple-50 text-purple-500 rounded-full flex items-center justify-center shadow-inner">
                        <Volume2 size={24} />
                     </button>
                  </div>
                  <div className="flex flex-wrap gap-4">
                     {Array.from({ length: 9 }).map((_, idx) => (
                        <div key={`copy-grid-8-${i}-${idx}`} className="w-20 h-20 bg-gray-50 rounded-[1.5rem] border-4 border-dashed border-gray-100 flex items-center justify-center text-4xl font-chinese font-black text-gray-100">
                           {task.char}
                        </div>
                     ))}
                  </div>
               </div>
            ))}
         </div>
      </section>
    </div>
  );
};

const ReadingLesson8 = ({ lesson, speak }: { lesson: any, speak: (t: string) => void }) => {
  const storyData = lesson.activities.find((a: any) => a.type === 'reading_story');
  const [answers, setAnswers] = useState<Record<number, string | null>>({});

  if (!storyData) return null;

  return (
    <div className="space-y-12 pb-20">
      <div className="bg-gradient-to-r from-blue-500 to-cyan-400 p-8 rounded-4xl text-white shadow-lg relative overflow-hidden">
         <div className="relative z-10 flex items-center gap-6">
            <ThreeDContainer color="blue" size="lg" className="hidden md:flex">
               <BookOpen size={48} />
            </ThreeDContainer>
            <div>
               <h3 className="text-3xl font-black leading-tight mb-2 uppercase tracking-tight">กิจกรรมการฝึกอ่าน (READING)</h3>
               <p className="text-blue-100 font-bold italic text-lg uppercase tracking-wider">บทที่ {lesson.id}: {lesson.title}</p>
            </div>
         </div>
         <BookOpen className="w-48 h-48 absolute -right-12 -bottom-12 text-white/10 rotate-12" />
      </div>

      <div className="bg-white p-12 rounded-[4rem] border-4 border-blue-50 shadow-2xl space-y-10 relative group">
         <div className="text-center space-y-2 border-b-2 border-blue-50 pb-8">
            <h4 className="text-5xl font-chinese font-black text-gray-900 leading-tight uppercase tracking-widest">{storyData.titleZh}</h4>
            <p className="text-xl font-bold text-blue-500 italic uppercase italic tracking-wider">ฟังเสียงเรื่องสั้นแล้วอ่านตาม</p>
         </div>

         <div className="space-y-8 max-w-4xl mx-auto">
            {storyData.story.map((item: any, i: number) => (
               <motion.div 
                 key={`reading-8-story-${i}`}
                 initial={{ opacity: 0, y: 10 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 transition={{ delay: i * 0.1 }}
                 className="space-y-3 p-6 rounded-3xl hover:bg-blue-50 transition-colors group/item"
               >
                  <div className="flex items-start gap-4">
                     <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0 mt-1">{i + 1}</span>
                     <div className="space-y-2 flex-grow">
                        <p className="text-3xl font-chinese font-black text-gray-900 leading-relaxed uppercase tracking-tight group-hover/item:text-blue-600 transition-colors">{item.zh}</p>
                        <p className="text-xl font-bold text-blue-500 italic tracking-wider">{item.py}</p>
                        <p className="text-gray-500 font-bold italic leading-relaxed">{item.th}</p>
                     </div>
                     <button onClick={() => speak(item.zh)} className="p-4 bg-white text-blue-500 rounded-2xl shadow-sm border-2 border-blue-50 opacity-0 group-hover/item:opacity-100 transition-all active:scale-95">
                        <Volume2 size={24} />
                     </button>
                  </div>
               </motion.div>
            ))}
         </div>
      </div>

      <section className="space-y-8">
        <div className="flex items-center gap-4">
           <div className="w-3 h-10 bg-blue-500 rounded-full shadow-lg" />
           <h4 className="text-2xl font-black text-gray-900 uppercase tracking-tight">กิจกรรมที่ 1: ตอบคำถามจากเนื้อเรื่อง</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {storyData.questions.map((q: any, i: number) => (
              <div key={`reading-8-q-${i}`} className="bg-white p-10 rounded-[4rem] border-4 border-blue-50 shadow-2xl space-y-8 group">
                 <div className="space-y-3">
                    <p className="text-3xl font-chinese font-black text-gray-900 leading-tight uppercase group-hover:text-blue-600 transition-colors">{q.qZh}</p>
                    <p className="text-xl font-bold text-blue-400 italic font-mono">{q.qPy}</p>
                    <p className="text-gray-400 font-bold italic flex items-center gap-2">
                       <HelpCircle size={16} /> {q.qTh}
                    </p>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    {["会", "不会"].map((opt) => (
                       <button 
                         key={opt}
                         onClick={() => setAnswers(prev => ({ ...prev, [i]: opt }))}
                         className={cn(
                           "py-5 rounded-3xl font-chinese font-black text-2xl border-4 transition-all shadow-md active:translate-y-1",
                           answers[i] === opt ? (opt === q.answer ? "bg-emerald-500 text-white border-emerald-600" : "bg-red-500 text-white border-red-600") : "bg-white border-gray-100 text-gray-400 hover:border-blue-500 hover:text-blue-500"
                         )}
                       >
                         {opt === "会" ? "会 (ได้)" : "不会 (ไม่ได้)"}
                       </button>
                    ))}
                 </div>
              </div>
           ))}
        </div>
      </section>

      <section className="bg-blue-50 p-10 rounded-[4rem] border-4 border-white shadow-xl space-y-8">
         <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md">
              <Star className="w-6 h-6 text-blue-500" />
           </div>
           <h4 className="text-2xl font-black text-blue-800 uppercase tracking-tight">ศัพท์เสริม (VOCAB PLUS)</h4>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {storyData.extraVocab.map((v: any, i: number) => (
               <div key={`extra-vocab-8-${i}`} className="bg-white p-8 rounded-[2.5rem] border-2 border-blue-200 shadow-sm flex items-center gap-6 group hover:translate-x-2 transition-all">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
                     {i === 0 ? "👂" : i === 1 ? "📖" : "💡"}
                  </div>
                  <div>
                     <p className="text-3xl font-chinese font-black text-gray-900 group-hover:text-blue-600 transition-colors">{v.word}</p>
                     <p className="text-lg font-bold text-blue-500 italic leading-none">{v.pinyin}</p>
                     <p className="text-gray-400 font-bold text-sm italic">{v.translation}</p>
                  </div>
               </div>
            ))}
         </div>
      </section>
    </div>
  );
};

const SpeakingLesson8 = ({ lesson, speak, setActiveActivity }: { lesson: any, speak: (t: string, r?: number) => void, setActiveActivity: (a: ActivityType) => void }) => {
  const mimicData = lesson.activities.find((a: any) => a.type === 'speaking_mimic');
  const [randomIdx, setRandomIdx] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const shuffleQA = () => {
    setRandomIdx(Math.floor(Math.random() * mimicData.qaPairs.length));
    setShowResult(false);
  };

  return (
    <div className="space-y-12 pb-20">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-400 p-8 rounded-4xl text-white shadow-lg relative overflow-hidden">
         <div className="relative z-10 flex items-center gap-6">
            <ThreeDContainer color="emerald" size="lg" className="hidden md:flex">
               <Sparkles size={48} />
            </ThreeDContainer>
            <div>
               <h3 className="text-3xl font-black leading-tight mb-2 uppercase tracking-tight">กิจกรรมการฝึกพูด (SPEAKING)</h3>
               <p className="text-emerald-100 font-bold italic text-lg uppercase tracking-wider">บทที่ {lesson.id}: {lesson.title}</p>
            </div>
         </div>
         <Sparkles className="w-48 h-48 absolute -right-12 -bottom-12 text-white/10 rotate-12" />
      </div>

      <section className="space-y-8">
        <div className="flex items-center gap-4">
           <div className="w-3 h-10 bg-emerald-500 rounded-full shadow-lg" />
           <h4 className="text-2xl font-black text-gray-900 uppercase tracking-tight">กิจกรรมที่ 1: ฟังเสียงประโยคแล้วพูดตาม พร้อมทำท่าทางประกอบ</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {mimicData.items.map((item: any, i: number) => (
              <motion.div 
                key={`speak-8-item-${i}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="bg-white p-10 rounded-[4rem] border-4 border-emerald-50 shadow-2xl flex flex-col items-center text-center space-y-6 hover:border-emerald-300 transition-all group"
              >
                 <div className="w-24 h-24 bg-emerald-50 rounded-3xl flex items-center justify-center text-6xl shadow-inner group-hover:scale-110 transition-transform">
                    {item.action.split(' ')[0]}
                 </div>
                 <div className="space-y-2">
                    <p className="text-3xl font-chinese font-black text-gray-900 uppercase leading-tight group-hover:text-emerald-600 transition-colors uppercase">{item.text}</p>
                    <p className="text-xl font-bold text-emerald-500 italic">{item.pinyin}</p>
                    <p className="text-gray-400 font-bold italic">{item.translation}</p>
                 </div>
                 <div className="py-2 px-6 bg-emerald-100 text-emerald-700 rounded-full text-xs font-black uppercase tracking-[0.2em] italic">
                    Action: {item.action.split(' ').slice(1).join(' ')}
                 </div>
                 <button 
                   onClick={() => speak(item.text)}
                   className="w-full py-4 bg-emerald-500 text-white rounded-[1.8rem] font-black shadow-[0_8px_0_0_#059669] hover:shadow-[0_4px_0_0_#059669] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-3 text-lg"
                 >
                   <Volume2 /> ฟังเสียงและพูดตาม
                 </button>
              </motion.div>
           ))}
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex items-center gap-4">
           <div className="w-3 h-10 bg-emerald-500 rounded-full shadow-lg" />
           <h4 className="text-2xl font-black text-gray-900 uppercase tracking-tight">กิจกรรมที่ 2: จับคู่ ดูภาพแล้วพูดถามตอบ พร้อมทำท่าทางประกอบ</h4>
        </div>
        <div className="bg-white p-16 rounded-[5rem] border-4 border-emerald-50 shadow-2xl text-center space-y-12 overflow-hidden relative group">
           <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 group-hover:rotate-0 transition-all duration-1000">
              <Gamepad2 size={200} />
           </div>
           
           <div className="space-y-4 max-w-lg mx-auto relative z-10">
              <div className="bg-emerald-50 border-2 border-emerald-100 p-6 rounded-3xl space-y-1">
                 <p className="text-emerald-400 text-xs font-black uppercase tracking-[0.3em]">Example Pattern</p>
                 <p className="text-3xl font-chinese font-black text-emerald-800 uppercase">学袋鼠。 跳一跳。</p>
                 <p className="text-gray-400 text-sm font-bold italic">ทำท่าเหมือนจิงโจ้ กระโดดสักหน่อย</p>
              </div>
           </div>

           <AnimatePresence mode="wait">
              <motion.div 
                key={randomIdx}
                initial={{ scale: 0.9, opacity: 0, rotate: -2 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 1.1, opacity: 0, rotate: 2 }}
                className="inline-block p-12 bg-emerald-50 rounded-[4rem] border-8 border-white shadow-2xl relative"
              >
                  <ThreeDContainer color="emerald" size="lg" className="mx-auto scale-150 mb-10">
                    <Sparkles />
                  </ThreeDContainer>

                  <div className="space-y-4">
                     <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border-2 border-emerald-100 flex flex-col items-center gap-2 min-w-[300px]">
                        <p className="text-6xl font-chinese font-black text-emerald-600 uppercase tracking-[0.2em]">学{mimicData.qaPairs[randomIdx].animal}。</p>
                        <p className="text-3xl font-chinese font-black text-gray-800 uppercase tracking-[0.1em]">{mimicData.qaPairs[randomIdx].action}一{mimicData.qaPairs[randomIdx].action}。</p>
                        <p className="text-xl font-bold text-emerald-400 font-mono italic tracking-widest mt-2 uppercase">{mimicData.qaPairs[randomIdx].pinyin}</p>
                     </div>
                  </div>
              </motion.div>
           </AnimatePresence>

           <div className="flex flex-wrap justify-center gap-6 mt-12 relative z-10">
              <button 
                onClick={() => speak(`学${mimicData.qaPairs[randomIdx].animal}。${mimicData.qaPairs[randomIdx].action}一${mimicData.qaPairs[randomIdx].action}。`)} 
                className="flex items-center gap-3 px-12 py-5 bg-emerald-50 text-emerald-600 rounded-[2rem] font-black border-2 border-emerald-100 hover:bg-emerald-100 transition-all shadow-md active:scale-95 text-xl"
              >
                 <Volume2 className="w-8 h-8" /> ฟังเสียง
              </button>
              <button 
                onClick={shuffleQA} 
                className="flex items-center gap-3 px-12 py-5 bg-emerald-500 text-white rounded-[2.2rem] font-black shadow-[0_10px_0_0_#059669] hover:shadow-[0_5px_0_0_#059669] active:shadow-none active:translate-y-1 transition-all text-xl"
              >
                 <RefreshCw className="w-8 h-8" /> สุ่มท่าทาง
              </button>
              <button 
                onClick={() => setShowResult(true)} 
                className={cn("flex items-center gap-3 px-12 py-5 rounded-[2rem] font-black shadow-xl transition-all text-xl", showResult ? "bg-emerald-100 text-emerald-600" : "bg-white border-2 border-gray-100 text-gray-500")}
              >
                 <CheckCircle2 className="w-8 h-8" /> {showResult ? "เก่งมาก!" : "พูดพร้อมทำท่าแล้ว"}
              </button>
           </div>
        </div>
      </section>
    </div>
  );
};

const ListeningLesson8 = ({ lesson, speak }: { lesson: any, speak: (t: string) => void }) => {
  const listeningData = lesson.activities.find((a: any) => a.type === 'listening_sentences');

  return (
    <div className="space-y-12 pb-20">
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 p-8 rounded-4xl text-white shadow-lg relative overflow-hidden">
         <div className="relative z-10 flex items-center gap-6">
            <ThreeDContainer color="orange" size="lg" className="hidden md:flex">
               <Volume2 size={48} />
            </ThreeDContainer>
            <div>
               <h3 className="text-3xl font-black leading-tight mb-2 uppercase tracking-tight">กิจกรรมการฟัง (LISTENING)</h3>
               <p className="text-orange-100 font-bold italic text-lg uppercase tracking-wider">บทที่ {lesson.id}: {lesson.title}</p>
            </div>
         </div>
         <Volume2 className="w-48 h-48 absolute -right-12 -bottom-12 text-white/10 rotate-12" />
      </div>

      <div className="bg-orange-50/50 p-6 rounded-3xl border-2 border-orange-100 flex items-center gap-4">
        <div>
           <p className="text-lg font-black text-orange-900 leading-tight italic">คำสั่ง: ฟังเสียงคำศัพท์แล้วพูดตาม</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {lesson.vocabulary.map((v: any, i: number) => (
          <motion.div 
            key={`listen-8-vocab-${i}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-[2.5rem] border-2 border-gray-50 shadow-xl hover:shadow-2xl hover:border-orange-500 transition-all text-center space-y-4 group relative overflow-hidden flex flex-col items-center"
          >
            <div className="flex justify-center mb-2">
              <ThreeDContainer color="orange" size="md">
                {v.icon}
              </ThreeDContainer>
            </div>
            <div>
              <p className="text-3xl font-chinese font-black text-gray-900 leading-none group-hover:text-orange-600 transition-colors uppercase">{v.word}</p>
              <p className="text-lg font-bold text-orange-600 italic mt-1">{v.pinyin}</p>
              <p className="text-gray-400 font-bold italic text-[10px] uppercase truncate w-full">{v.translation.split(' (')[0]}</p>
            </div>
            <button 
              onClick={() => speak(v.word)}
              className="w-full py-3 bg-orange-500 text-white rounded-[1.2rem] font-black shadow-[0_4px_0_0_#ea580c] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-2 mt-auto"
            >
              <Volume2 size={16} /> <span className="text-xs">ฟังเสียง</span>
            </button>
          </motion.div>
        ))}
      </div>

      <section className="space-y-8 mt-12">
        <div className="flex items-center gap-4">
           <div className="w-3 h-10 bg-orange-500 rounded-full shadow-lg shadow-orange-200" />
           <h4 className="text-2xl font-black text-gray-900 uppercase tracking-tight">คำศัพท์สัตว์เพิ่มเติม</h4>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
           {listeningData.extraVocab.map((v: any, i: number) => (
              <div key={`extra-vocab-8-${i}`} className="bg-white p-6 rounded-3xl border-2 border-orange-50 flex flex-col items-center gap-2 shadow-md hover:border-orange-300 transition-all group">
                 <span className="text-4xl group-hover:scale-110 transition-transform">{v.icon}</span>
                 <div className="text-center">
                    <p className="text-xl font-chinese font-black text-gray-800">{v.word}</p>
                    <p className="text-[10px] font-bold text-orange-400 italic leading-none">{v.pinyin}</p>
                    <p className="text-[10px] text-gray-400 font-bold italic">{v.translation}</p>
                 </div>
                 <button onClick={() => speak(v.word)} className="p-2 bg-orange-50 text-orange-500 rounded-full hover:bg-orange-500 hover:text-white transition-all shadow-inner">
                    <Volume2 size={14} />
                 </button>
              </div>
           ))}
        </div>
      </section>

      <section className="space-y-8 mt-12">
        <div className="flex items-center gap-4">
           <div className="w-3 h-10 bg-orange-500 rounded-full shadow-lg shadow-orange-200" />
           <h4 className="text-2xl font-black text-gray-900 uppercase tracking-tight">ฟังประโยคการเคลื่อนไหว</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {listeningData.items.map((item: any, i: number) => (
             <div key={`listen-8-extra-${i}`} className="bg-white p-10 rounded-[4rem] border-4 border-orange-50 flex items-center justify-between gap-6 shadow-2xl hover:border-orange-300 transition-all group overflow-hidden relative">
                <div className="absolute top-0 left-0 w-2 h-full bg-orange-500" />
                <div className="space-y-3">
                   <p className="text-4xl font-chinese font-black text-gray-900 group-hover:text-orange-600 transition-colors uppercase leading-tight">{item.text}</p>
                   <p className="text-2xl font-bold text-orange-500 italic tracking-widest">{item.pinyin}</p>
                   <p className="text-gray-500 font-bold italic text-lg leading-relaxed">{item.translation}</p>
                </div>
                <button 
                  onClick={() => speak(item.speakChinese || item.text)}
                  className="w-20 h-20 bg-orange-50 text-orange-600 rounded-[2.5rem] flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all shadow-inner active:scale-95 shrink-0"
                >
                  <Volume2 className="w-10 h-10" />
                </button>
             </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const ListeningLesson9 = ({ lesson, speak }: { lesson: any, speak: (t: string) => void }) => {
  const listeningData = lesson.activities.find((a: any) => a.type === 'listening_sentences');

  return (
    <div className="space-y-12 pb-20">
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 p-8 rounded-4xl text-white shadow-lg relative overflow-hidden">
         <div className="relative z-10 flex items-center gap-6">
            <ThreeDContainer color="orange" size="lg" className="hidden md:flex">
               <Volume2 size={48} />
            </ThreeDContainer>
            <div>
               <h3 className="text-3xl font-black leading-tight mb-2 uppercase tracking-tight">กิจกรรมการฟัง (LISTENING)</h3>
               <p className="text-orange-100 font-bold italic text-lg uppercase tracking-wider">บทที่ {lesson.id}: {lesson.title}</p>
            </div>
         </div>
         <Volume2 className="w-48 h-48 absolute -right-12 -bottom-12 text-white/10 rotate-12" />
      </div>

      <div className="bg-orange-50/50 p-6 rounded-3xl border-2 border-orange-100 flex items-center gap-4">
        <div>
           <p className="text-lg font-black text-orange-900 leading-tight italic">คำสั่ง: ฟังเสียงคำศัพท์แล้วพูดตาม</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {lesson.vocabulary.map((v: any, i: number) => (
          <motion.div 
            key={`listen-9-vocab-${i}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-[2.5rem] border-2 border-gray-50 shadow-xl hover:shadow-2xl hover:border-orange-500 transition-all text-center space-y-4 group relative overflow-hidden flex flex-col items-center"
          >
            <div className="flex justify-center mb-2">
              <ThreeDContainer color="orange" size="md">
                <span className="text-4xl">{v.icon}</span>
              </ThreeDContainer>
            </div>
            <div>
              <p className="text-3xl font-chinese font-black text-gray-900 leading-none group-hover:text-orange-600 transition-colors uppercase">{v.word}</p>
              <p className="text-lg font-bold text-orange-600 italic mt-1">{v.pinyin}</p>
              <p className="text-gray-400 font-bold italic text-[10px] uppercase truncate w-full">{v.translation}</p>
            </div>
            <button 
              onClick={() => speak(v.word)}
              className="w-full py-3 bg-orange-500 text-white rounded-[1.2rem] font-black shadow-[0_4px_0_0_#ea580c] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-2 mt-auto"
            >
              <Volume2 size={16} /> <span className="text-xs">ฟังเสียง</span>
            </button>
          </motion.div>
        ))}
      </div>

      {listeningData && (
        <section className="space-y-8 mt-12">
          <div className="flex items-center gap-4">
             <div className="w-3 h-10 bg-orange-500 rounded-full shadow-lg shadow-orange-200" />
             <h4 className="text-2xl font-black text-gray-900 uppercase tracking-tight">ฝึกฟังประโยค</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {listeningData.items.map((item: any, i: number) => (
               <div key={`listen-9-extra-${i}`} className="bg-white p-10 rounded-[4rem] border-4 border-orange-50 flex items-center justify-between gap-6 shadow-2xl hover:border-orange-300 transition-all group overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-2 h-full bg-orange-500" />
                  <div className="space-y-3">
                     <p className="text-4xl font-chinese font-black text-gray-900 group-hover:text-orange-600 transition-colors leading-tight uppercase">{item.text}</p>
                     <p className="text-2xl font-bold text-orange-500 italic tracking-widest">{item.pinyin}</p>
                     <p className="text-gray-500 font-bold italic text-lg leading-relaxed">{item.translation}</p>
                  </div>
                  <button 
                    onClick={() => speak(item.text)}
                    className="w-20 h-20 bg-orange-50 text-orange-600 rounded-[2.5rem] flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all shadow-inner active:scale-95 shrink-0"
                  >
                    <Volume2 className="w-10 h-10" />
                  </button>
               </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

const SpeakingLesson9 = ({ lesson, speak, setActiveActivity }: { lesson: any, speak: (t: string, r?: number) => void, setActiveActivity: (a: ActivityType) => void }) => {
  const mimicData = lesson.activities.find((a: any) => a.type === 'speaking_mimic');
  const [randomIdx, setRandomIdx] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const shuffleQA = () => {
    setRandomIdx(Math.floor(Math.random() * mimicData.qaPairs.length));
    setShowResult(false);
  };

  return (
    <div className="space-y-12 pb-20">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-400 p-8 rounded-4xl text-white shadow-lg relative overflow-hidden">
         <div className="relative z-10 flex items-center gap-6">
            <ThreeDContainer color="emerald" size="lg" className="hidden md:flex">
               <Sparkles size={48} />
            </ThreeDContainer>
            <div>
               <h3 className="text-3xl font-black leading-tight mb-2 uppercase tracking-tight">กิจกรรมการฝึกพูด (SPEAKING)</h3>
               <p className="text-emerald-100 font-bold italic text-lg uppercase tracking-wider">บทที่ {lesson.id}: {lesson.title}</p>
            </div>
         </div>
         <Sparkles className="w-48 h-48 absolute -right-12 -bottom-12 text-white/10 rotate-12" />
      </div>

      <section className="space-y-8">
        <div className="flex items-center gap-4">
           <div className="w-3 h-10 bg-emerald-500 rounded-full shadow-lg" />
           <h4 className="text-2xl font-black text-gray-900 uppercase tracking-tight">กิจกรรมที่ 1: ฟังเสียงประโยคแล้วพูดตาม จากนั้นพูดตอบคำถาม</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {mimicData.items.map((item: any, i: number) => (
              <motion.div 
                key={`speak-9-item-${i}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="bg-white p-10 rounded-[4rem] border-4 border-emerald-50 shadow-2xl flex flex-col items-center text-center space-y-6 hover:border-emerald-300 transition-all group"
              >
                 <div className="w-24 h-24 bg-emerald-50 rounded-3xl flex items-center justify-center text-6xl shadow-inner group-hover:scale-110 transition-transform">
                    {i === 0 ? "🙋" : i === 1 ? "🪢" : i === 2 ? "🏓" : "🏃"}
                 </div>
                 <div className="space-y-2">
                    <p className="text-3xl font-chinese font-black text-gray-900 leading-tight group-hover:text-emerald-600 transition-colors uppercase">{item.text}</p>
                    <p className="text-xl font-bold text-emerald-500 italic">{item.pinyin}</p>
                    <p className="text-gray-400 font-bold italic">{item.translation}</p>
                 </div>
                 <button 
                   onClick={() => speak(item.text)}
                   className="w-full py-4 bg-emerald-500 text-white rounded-[1.8rem] font-black shadow-[0_8px_0_0_#059669] hover:shadow-[0_4px_0_0_#059669] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-3 text-lg"
                 >
                   <Volume2 /> ฟังเสียงและพูดตาม
                 </button>
              </motion.div>
           ))}
        </div>

        <div className="bg-emerald-50 p-8 rounded-4xl space-y-6">
          <h5 className="text-xl font-black text-emerald-800">คำถามฝึกตอบ:</h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             {mimicData.questions.map((q: any, i: number) => (
               <div key={`speak-q-9-${i}`} className="bg-white p-6 rounded-3xl border-2 border-emerald-100 shadow-sm space-y-3">
                  <p className="text-2xl font-chinese font-black uppercase">{q.zh}</p>
                  <p className="text-sm font-bold text-emerald-500 italic">{q.py}</p>
                  <p className="text-xs text-gray-400 font-bold italic">{q.th}</p>
                  <button onClick={() => speak(q.zh)} className="w-full py-2 bg-emerald-50 text-emerald-600 rounded-xl font-black text-xs hover:bg-emerald-500 hover:text-white transition-all">ฟังคำถาม</button>
               </div>
             ))}
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex items-center gap-4">
           <div className="w-3 h-10 bg-emerald-500 rounded-full shadow-lg" />
           <h4 className="text-2xl font-black text-gray-900 uppercase tracking-tight">กิจกรรมที่ 2: จับคู่ ดูภาพแล้วพูดถามตอบ</h4>
        </div>
        <div className="bg-white p-16 rounded-[5rem] border-4 border-emerald-50 shadow-2xl text-center space-y-12 overflow-hidden relative group">
           <AnimatePresence mode="wait">
              <motion.div 
                key={randomIdx}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.1, opacity: 0 }}
                className="inline-block p-12 bg-emerald-50 rounded-[4rem] border-8 border-white shadow-2xl relative"
              >
                  <div className="space-y-6">
                     <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border-2 border-emerald-100 flex flex-col items-center gap-4 min-w-[350px]">
                        <div className="text-6xl mb-2">👤</div>
                        <p className="text-4xl font-chinese font-black text-emerald-800 uppercase tracking-wider">{mimicData.qaPairs[randomIdx].name} / {mimicData.qaPairs[randomIdx].animal}</p>
                        <p className="text-xl font-bold text-emerald-400 font-mono italic tracking-widest">{mimicData.qaPairs[randomIdx].pinyin}</p>
                     </div>
                     <div className="bg-white/50 p-6 rounded-3xl border border-emerald-100 text-left space-y-2">
                        <p className="font-chinese font-black text-gray-700 uppercase">{mimicData.qaPairs[randomIdx].name}最喜欢什么比赛？</p>
                        <p className="font-chinese font-black text-emerald-600 uppercase">{lesson.id === 9 ? (mimicData.qaPairs[randomIdx].name === '娜娜' || mimicData.qaPairs[randomIdx].name === '凯特' ? '她' : '他') : ''}最喜欢{mimicData.qaPairs[randomIdx].zh}比赛。</p>
                     </div>
                  </div>
              </motion.div>
           </AnimatePresence>

           <div className="flex flex-wrap justify-center gap-6 mt-12 relative z-10">
              <button 
                onClick={() => speak(`${mimicData.qaPairs[randomIdx].name}最喜欢什么比赛？`)} 
                className="flex items-center gap-3 px-10 py-4 bg-emerald-50 text-emerald-600 rounded-[2rem] font-black border-2 border-emerald-100 hover:bg-emerald-100 transition-all shadow-md active:scale-95"
              >
                 <Volume2 className="w-6 h-6" /> ฟังคำถาม
              </button>
              <button 
                onClick={shuffleQA} 
                className="flex items-center gap-3 px-12 py-5 bg-emerald-500 text-white rounded-[2.2rem] font-black shadow-[0_10px_0_0_#059669] hover:shadow-[0_5px_0_0_#059669] active:shadow-none active:translate-y-1 transition-all text-xl"
              >
                 <RefreshCw className="w-8 h-8" /> สุ่มคนและกีฬา
              </button>
              <button 
                onClick={() => setShowResult(true)} 
                className={cn("flex items-center gap-3 px-10 py-4 rounded-[2rem] font-black shadow-xl transition-all", showResult ? "bg-emerald-100 text-emerald-600" : "bg-white border-2 border-gray-100 text-gray-500")}
              >
                 <CheckCircle2 className="w-6 h-6" /> {showResult ? "เก่งมาก!" : "พูดถามตอบแล้ว"}
              </button>
           </div>
        </div>
      </section>
    </div>
  );
};

const ListeningLesson2 = ({ lesson, speak, setActiveActivity }: { lesson: any, speak: (t: string) => void, setActiveActivity: (a: ActivityType) => void }) => {
  const vocabIcons: Record<string, string> = {
    "天气": "☁️",
    "晴天": "☀️",
    "阴天": "☁️",
    "下雪": "❄️",
    "刮风": "🌬️",
    "冷": "🥶",
    "热": "🥵",
    "下雨": "🌧️",
    "动物园": "🦁"
  };

  const extraSentences = [
    { zh: "明天天气怎么样？", py: "Míngtiān tiānqì zěnmeyàng?", th: "พรุ่งนี้อากาศเป็นอย่างไร" },
    { zh: "明天下雨，天气不好。", py: "Míngtiān xià yǔ, tiānqì bù hǎo.", th: "พรุ่งนี้ฝนตก อากาศไม่ดี" },
    { zh: "星期天不下雨，也不热。", py: "Xīngqītiān bú xià yǔ, yě bú rè.", th: "วันอาทิตย์ฝนไม่ตก และก็ไม่ร้อน" }
  ];

  return (
    <div className="space-y-12 pb-20">
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 p-8 rounded-4xl text-white shadow-lg relative overflow-hidden">
         <div className="relative z-10">
            <h3 className="text-3xl font-black leading-tight mb-2">กิจกรรมการฟัง (LISTENING)</h3>
            <p className="text-orange-100 font-bold">บทที่ 2: {lesson.title} {lesson.translation.split(' (')[0]}</p>
            <div className="mt-4 bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/30 inline-block font-bold">
              คำสั่ง: ฟังเสียงคำศัพท์แล้วพูดตาม
            </div>
         </div>
         <Volume2 className="w-48 h-48 absolute -right-12 -bottom-12 text-white/10 rotate-12" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lesson.vocabulary.map((v: any, idx: number) => (
          <motion.div 
            key={`listening-vocab-2-${idx}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-3xl border-2 border-gray-100 shadow-sm hover:border-orange-500 transition-all group flex flex-col items-center text-center space-y-4"
          >
            <div className="w-24 h-24 bg-orange-50 rounded-2xl flex items-center justify-center text-5xl group-hover:scale-110 transition-transform">
              {v.icon || "🔊"}
            </div>
            <div>
              <h4 className="text-3xl font-chinese font-black text-gray-900">{v.word}</h4>
              <p className="text-orange-600 font-bold tracking-widest">{v.pinyin}</p>
              <p className="text-gray-400 font-bold text-sm mt-1">{v.translation.split(' (')[0]}</p>
            </div>
            <button 
              onClick={() => speak(v.word)}
              className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black shadow-lg hover:scale-105 active:scale-95 transition-all w-full justify-center"
            >
              <Volume2 className="w-5 h-5" />
              ฟังเสียง
            </button>
          </motion.div>
        ))}
      </div>

      <div className="space-y-6 pt-10">
        <div className="flex items-center gap-3">
          <Volume2 className="w-6 h-6 text-orange-500" />
          <h4 className="text-2xl font-black text-gray-900">ฟังประโยคเพิ่มเติม</h4>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {extraSentences.map((s, i) => (
            <div key={`extra-s-2-${i}`} className="bg-white p-6 rounded-3xl border-2 border-orange-50 flex items-center justify-between gap-4 shadow-sm hover:border-orange-300 transition-all">
              <div className="space-y-1">
                <p className="text-2xl font-chinese font-black text-gray-900">{s.zh}</p>
                <p className="text-sm font-bold text-orange-500">{s.py}</p>
                <p className="text-xs text-gray-400 font-bold">{s.th}</p>
              </div>
              <button 
                onClick={() => speak(s.zh)}
                className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all shadow-md active:scale-95"
              >
                <Volume2 className="w-6 h-6" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center pt-10">
        <ChineseButton 
          variant="gold" 
          size="lg" 
          className="text-xl px-12 py-8 rounded-3xl"
          onClick={() => setActiveActivity(ActivityType.SPEAKING)}
        >
          ไปต่อกิจกรรมฝึกพูด (Next)
          <ChevronRight className="w-6 h-6 ml-2" />
        </ChineseButton>
      </div>
    </div>
  );
};

const ReadingLesson9 = ({ lesson, speak, setActiveActivity }: { lesson: any, speak: (t: string, r?: number) => void, setActiveActivity: (a: ActivityType) => void }) => {
  const storyData = lesson.activities.find((a: any) => a.type === 'reading_story');
  const [answers, setAnswers] = useState<Record<number, string | null>>({});

  if (!storyData) return null;

  return (
    <div className="space-y-12 pb-20">
      <div className="bg-gradient-to-r from-blue-500 to-cyan-400 p-8 rounded-4xl text-white shadow-lg relative overflow-hidden">
         <div className="relative z-10 flex items-center gap-6">
            <ThreeDContainer color="blue" size="lg" className="hidden md:flex">
               <BookOpen size={48} />
            </ThreeDContainer>
            <div>
               <h3 className="text-3xl font-black leading-tight mb-2 uppercase tracking-tight">กิจกรรมการฝึกอ่าน (READING)</h3>
               <p className="text-blue-100 font-bold italic text-lg uppercase tracking-wider">บทที่ {lesson.id}: {lesson.title}</p>
            </div>
         </div>
         <BookOpen className="w-48 h-48 absolute -right-12 -bottom-12 text-white/10 rotate-12" />
      </div>

      <div className="bg-white p-12 rounded-[4rem] border-4 border-blue-50 shadow-2xl space-y-10 relative group">
         <div className="text-center space-y-2 border-b-2 border-blue-50 pb-8">
            <h4 className="text-5xl font-chinese font-black text-gray-900 leading-tight uppercase tracking-widest">{storyData.titleZh}</h4>
            <p className="text-xl font-bold text-blue-500 italic uppercase tracking-wider">ฟังเสียงเรื่องสั้นแล้วอ่านตาม</p>
         </div>

         <div className="space-y-8 max-w-4xl mx-auto">
            {storyData.story.map((item: any, i: number) => (
               <motion.div 
                 key={`reading-9-story-${i}`}
                 initial={{ opacity: 0, y: 10 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 transition={{ delay: i * 0.1 }}
                 className="space-y-3 p-6 rounded-3xl hover:bg-blue-50 transition-colors group/item"
               >
                  <div className="flex items-start gap-4">
                     <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0 mt-1">{i + 1}</span>
                     <div className="space-y-2 flex-grow">
                        <p className="text-3xl font-chinese font-black text-gray-900 leading-relaxed group-hover/item:text-blue-600 transition-colors">{item.zh}</p>
                        <p className="text-xl font-bold text-blue-500 italic tracking-wider">{item.py}</p>
                        <p className="text-gray-500 font-bold italic leading-relaxed">{item.th}</p>
                     </div>
                     <button onClick={() => speak(item.zh)} className="p-4 bg-white text-blue-500 rounded-2xl shadow-sm border-2 border-blue-50 opacity-0 group-hover/item:opacity-100 transition-all active:scale-95">
                        <Volume2 size={24} />
                     </button>
                  </div>
               </motion.div>
            ))}
         </div>
      </div>

      <section className="space-y-8">
        <div className="flex items-center gap-4">
           <div className="w-3 h-10 bg-blue-500 rounded-full shadow-lg" />
           <h4 className="text-2xl font-black text-gray-900 uppercase tracking-tight">กิจกรรมที่ 1: ตอบคำถาม ✓ หรือ X จากเนื้อเรื่อง</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {storyData.questions.map((q: any, i: number) => (
              <div key={`reading-9-q-${i}`} className="bg-white p-10 rounded-[4rem] border-4 border-blue-50 shadow-2xl space-y-8 group">
                 <div className="space-y-3">
                    <p className="text-3xl font-chinese font-black text-gray-900 leading-tight uppercase group-hover:text-blue-600 transition-colors">{q.qZh}</p>
                    <p className="text-xl font-bold text-blue-400 italic">{q.qPy}</p>
                    <p className="text-gray-400 font-bold italic flex items-center gap-2">
                       <HelpCircle size={16} /> {q.qTh}
                    </p>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    {["✓", "X"].map((opt) => (
                       <button 
                         key={opt}
                         onClick={() => setAnswers(prev => ({ ...prev, [i]: opt }))}
                         className={cn(
                           "py-5 rounded-3xl font-chinese font-black text-2xl border-4 transition-all shadow-md active:translate-y-1",
                           answers[i] === opt ? (opt === q.answer ? "bg-emerald-500 text-white border-emerald-600" : "bg-red-500 text-white border-red-600") : "bg-white border-gray-100 text-gray-400 hover:border-blue-500 hover:text-blue-500"
                         )}
                       >
                         {opt}
                       </button>
                    ))}
                 </div>
              </div>
           ))}
        </div>
      </section>

      <section className="space-y-8">
         <div className="flex items-center gap-4">
            <div className="w-3 h-10 bg-blue-500 rounded-full shadow-lg" />
            <h4 className="text-2xl font-black text-gray-900 uppercase tracking-tight">กิจกรรมที่ 2: อ่านประโยคแล้วเลือกภาพที่ถูกต้อง</h4>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {storyData.imageMatch.map((m: any, i: number) => (
               <div key={`reading-9-match-${i}`} className="bg-white p-8 rounded-[3rem] border-2 border-blue-50 shadow-lg space-y-4 hover:border-blue-300 transition-all group">
                  <div className="aspect-video bg-blue-50 rounded-2xl flex items-center justify-center text-5xl group-hover:scale-105 transition-transform">
                     {i === 0 ? "⚽" : i === 1 ? "🏃" : i === 2 ? "🏓" : i === 3 ? "🏀" : "🏐"}
                  </div>
                  <div className="space-y-1">
                     <p className="text-2xl font-chinese font-black text-gray-900 uppercase">{m.zh}</p>
                     <p className="text-lg font-bold text-blue-500 italic uppercase">{m.py}</p>
                     <p className="text-gray-400 font-bold italic text-sm">{m.th}</p>
                  </div>
                  <button onClick={() => speak(m.zh)} className="w-full py-2 bg-blue-50 text-blue-600 rounded-xl font-black shadow-inner">ฟังเสียง</button>
               </div>
            ))}
         </div>
      </section>
    </div>
  );
};

const WritingLesson9 = ({ lesson, speak }: { lesson: any, speak: (t: string) => void }) => {
  const writingData = lesson.activities.find((a: any) => a.type === 'writing_tasks');
  const [fillAnswers, setFillAnswers] = useState<Record<number, string>>({});
  const [markedComps, setMarkedComps] = useState<Record<string, string[]>>({});

  if (!writingData) return null;

  const toggleComp = (char: string, comp: string) => {
    setMarkedComps(prev => {
      const current = prev[char] || [];
      if (current.includes(comp)) {
        return { ...prev, [char]: current.filter(c => c !== comp) };
      }
      return { ...prev, [char]: [...current, comp] };
    });
  };

  return (
    <div className="space-y-12 pb-20">
      <div className="bg-gradient-to-r from-purple-500 to-fuchsia-400 p-8 rounded-4xl text-white shadow-lg relative overflow-hidden">
         <div className="relative z-10 flex items-center gap-6">
            <ThreeDContainer color="purple" size="lg" className="hidden md:flex">
               <Zap size={48} />
            </ThreeDContainer>
            <div>
               <h3 className="text-3xl font-black leading-tight mb-2 uppercase tracking-tight">กิจกรรมการฝึกเขียน (WRITING)</h3>
               <p className="text-purple-100 font-bold italic text-lg uppercase tracking-wider">บทที่ {lesson.id}: {lesson.title}</p>
            </div>
         </div>
         <Zap className="w-48 h-48 absolute -right-12 -bottom-12 text-white/10 rotate-12" />
      </div>

      <section className="space-y-8">
        <div className="flex items-center gap-4">
           <div className="w-3 h-10 bg-purple-500 rounded-full shadow-lg" />
           <h4 className="text-2xl font-black text-gray-900 uppercase tracking-tight">กิจกรรมที่ 1: อ่านแล้วเขียนตัวอักษรจีน</h4>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
           {writingData.chars.map((c: any, i: number) => (
              <div key={`writing-9-char-${i}`} className="bg-white p-8 rounded-[3rem] border-4 border-purple-50 shadow-xl space-y-6 text-center hover:border-purple-300 transition-all group">
                 <div className="aspect-square bg-gray-50 rounded-3xl border-4 border-dashed border-gray-100 flex items-center justify-center relative overflow-hidden">
                    <span className="text-[8rem] font-chinese opacity-[0.03] absolute">{c.char}</span>
                    <span className="text-7xl font-chinese font-black text-chinese-red relative z-10">{c.char}</span>
                 </div>
                 <div>
                    <p className="text-2xl font-bold text-purple-600 italic tracking-widest">{c.pinyin}</p>
                    <p className="text-gray-400 font-bold italic">{c.translation}</p>
                 </div>
                 <button onClick={() => speak(c.char)} className="w-full py-3 bg-purple-50 text-purple-600 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-purple-500 hover:text-white transition-all">
                    <Volume2 size={16} /> ฟังเสียง
                 </button>
              </div>
           ))}
        </div>
      </section>

      <section className="bg-purple-50 p-10 rounded-[4rem] border-4 border-white shadow-xl space-y-8">
         <div className="flex items-center gap-4">
            <div className="w-3 h-10 bg-purple-500 rounded-full" />
            <h4 className="text-2xl font-black text-purple-800 uppercase tracking-tight">กิจกรรมที่ 2: วงกลมตัวอักษรจีนที่หายไป</h4>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {writingData.missingBlanks.map((b: any, i: number) => (
               <div key={`writing-9-blank-${i}`} className="bg-white p-8 rounded-[3rem] shadow-xl border-2 border-purple-100 space-y-6 group">
                  <div className="text-center space-y-2">
                     <p className="text-4xl font-chinese font-black tracking-widest">{b.full}</p>
                     <p className="text-lg font-bold text-purple-500 italic tracking-widest">{b.py}</p>
                     <p className="text-gray-400 font-bold italic text-sm">{b.th}</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-2xl text-center">
                    <p className="text-3xl font-chinese font-black text-gray-400">{b.text}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                     {b.opts.map((opt: string) => (
                        <button 
                          key={opt}
                          onClick={() => setFillAnswers(prev => ({ ...prev, [i]: opt }))}
                          className={cn(
                            "py-3 rounded-xl font-chinese font-black text-2xl transition-all shadow-md",
                            fillAnswers[i] === opt ? (opt === b.ans ? "bg-emerald-500 text-white" : "bg-red-500 text-white") : "bg-white text-gray-500 hover:bg-purple-100"
                          )}
                        >
                          {opt}
                        </button>
                     ))}
                  </div>
                  <button onClick={() => speak(b.full)} className="w-full py-2 bg-purple-50 text-purple-600 rounded-xl font-black text-sm uppercase">ฟังประโยคเต็ม</button>
               </div>
            ))}
         </div>
      </section>

      <section className="space-y-8">
         <div className="flex items-center gap-4">
            <div className="w-3 h-10 bg-purple-500 rounded-full shadow-lg" />
            <h4 className="text-2xl font-black text-gray-900 uppercase tracking-tight">กิจกรรมที่ 3: วงกลมส่วนประกอบของตัวอักษรจีน</h4>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {writingData.componentsMatch.map((item: any, i: number) => (
               <div key={`comp-9-${i}`} className="bg-white p-10 rounded-[4rem] border-4 border-purple-50 shadow-2xl text-center space-y-8 hover:border-purple-300 transition-all group">
                  <div className="relative">
                    <span className="text-8xl font-chinese font-black text-gray-900 group-hover:text-purple-600 transition-colors uppercase">{item.char}</span>
                  </div>
                  <div className="flex justify-center gap-4">
                     {item.comps.map((comp: string) => (
                        <button 
                          key={comp}
                          onClick={() => toggleComp(item.char, comp)}
                          className={cn(
                             "w-20 h-20 rounded-2xl font-chinese font-black text-3xl transition-all shadow-lg flex items-center justify-center border-4",
                             markedComps[item.char]?.includes(comp) ? "bg-emerald-500 text-white border-emerald-600 scale-110" : "bg-white text-gray-400 border-gray-100 hover:border-purple-200"
                          )}
                        >
                           {comp}
                        </button>
                     ))}
                  </div>
               </div>
            ))}
         </div>
      </section>

      <section className="bg-purple-50 p-10 rounded-[4rem] border-4 border-white shadow-xl space-y-8">
         <div className="flex items-center gap-4">
            <div className="w-3 h-10 bg-purple-500 rounded-full shadow-lg" />
            <h4 className="text-2xl font-black text-purple-800 uppercase tracking-tight">กิจกรรมที่ 4: เขียนลำดับขีดตามลายเส้น</h4>
         </div>
         <div className="space-y-10">
            {writingData.copyTasks.map((task: any, i: number) => (
               <div key={`copy-9-${i}`} className="bg-white p-10 rounded-[4rem] shadow-xl border-4 border-purple-50 space-y-8">
                  <div className="flex items-center justify-between border-b-2 border-dashed border-purple-100 pb-6">
                     <div className="flex items-center gap-6">
                        <p className="text-6xl font-chinese font-black text-chinese-red">{task.char}</p>
                        <div className="space-y-1">
                           <p className="text-2xl font-bold text-purple-600 italic tracking-widest leading-none uppercase">{task.phrase}</p>
                           <p className="text-gray-400 font-bold italic text-sm">ความหมาย: {task.th}</p>
                        </div>
                     </div>
                     <button onClick={() => speak(task.char)} className="w-16 h-16 bg-purple-50 text-purple-500 rounded-[2rem] flex items-center justify-center shadow-inner active:scale-95 transition-all">
                        <Volume2 size={32} />
                     </button>
                  </div>
                  <div className="flex flex-wrap gap-4">
                     {Array.from({ length: 9 }).map((_, idx) => (
                        <div key={`copy-grid-9-${i}-${idx}`} className="w-24 h-24 bg-gray-50 rounded-[2rem] border-4 border-dashed border-gray-100 flex items-center justify-center text-6xl font-chinese font-black text-gray-100 transition-all hover:border-purple-200">
                           {task.char}
                        </div>
                     ))}
                  </div>
               </div>
            ))}
         </div>
      </section>
    </div>
  );
};

const PinyinLesson9 = ({ lesson, speak, pinyinSpeak, pinyinSequenceSpeak, playingText }: { lesson: any, speak: (t: string, r?: number) => void, pinyinSpeak: (py: string, r?: number) => void, pinyinSequenceSpeak: (list: string[], r?: number) => Promise<void>, playingText: string }) => {
  const pinyinData = lesson.activities.find((a: any) => a.type === 'pinyin_erhua');
  if (!pinyinData) return null;

  return (
    <div className="space-y-12 pb-20">
      <div className="bg-gradient-to-r from-chinese-gold to-yellow-400 p-8 rounded-4xl text-white shadow-lg relative overflow-hidden">
         <div className="relative z-10 flex items-center gap-6">
            <ThreeDContainer color="gold" size="lg" className="hidden md:flex">
               <Star size={48} />
            </ThreeDContainer>
            <div>
               <h3 className="text-3xl font-black leading-tight mb-2 uppercase tracking-tight">กิจกรรมฝึกพินอิน (PINYIN)</h3>
               <p className="text-yellow-100 font-bold italic text-lg uppercase tracking-wider">บทที่ {lesson.id}: {lesson.title}</p>
            </div>
         </div>
         <Star className="w-48 h-48 absolute -right-12 -bottom-12 text-white/10 rotate-12" />
      </div>

      <section className="bg-white p-10 rounded-[4rem] border-4 border-chinese-gold/5 shadow-2xl space-y-8">
         <div className="flex items-center gap-4">
            <div className="w-3 h-10 bg-chinese-gold rounded-full shadow-lg" />
            <h4 className="text-2xl font-black text-gray-900 uppercase tracking-tight">กิจกรรมที่ 1: {pinyinData.intro}</h4>
         </div>
         <div className="bg-yellow-50 p-8 rounded-3xl border-2 border-dashed border-yellow-200">
            <p className="text-lg font-bold text-yellow-700 leading-relaxed italic">{pinyinData.description}</p>
         </div>
         
         <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {pinyinData.vocab.map((v: any, i: number) => (
               <div key={`pinyin-9-vocab-${i}`} className="bg-white p-8 rounded-[3rem] border-2 border-gray-50 shadow-xl space-y-4 hover:border-chinese-gold transition-all text-center group">
                  <div className="w-16 h-16 bg-yellow-50 rounded-2xl flex items-center justify-center mx-auto mb-2 text-3xl group-hover:scale-110 transition-transform">🏷️</div>
                  <div className="space-y-1">
                     <p className="text-4xl font-chinese font-black text-gray-900 uppercase">{v.zh}</p>
                     <p className="text-xl font-mono font-black text-chinese-gold-dark">{v.py}</p>
                     <p className="text-gray-400 font-bold italic text-sm">{v.th}</p>
                  </div>
                  <button onClick={() => speak(v.zh)} className="w-full py-2 bg-yellow-50 text-yellow-700 rounded-xl font-black text-xs hover:bg-chinese-gold hover:text-white transition-all shadow-sm">ฟังเสียง</button>
               </div>
            ))}
         </div>
      </section>

      <section className="space-y-8">
         <div className="flex items-center gap-4">
            <div className="w-3 h-10 bg-chinese-gold rounded-full shadow-lg" />
            <h4 className="text-2xl font-black text-gray-900 uppercase tracking-tight">กิจกรรมที่ 2: อ่านประโยคคำคล้องจอง</h4>
         </div>
         <div className="bg-white p-12 rounded-[4rem] border-4 border-chinese-gold/10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12">
               <Music size={150} className="text-chinese-gold" />
            </div>
            <div className="space-y-10 max-w-2xl mx-auto relative z-10">
               {pinyinData.rhyme.map((line: any, i: number) => (
                  <div key={`pinyin-9-rhyme-${i}`} className="text-center space-y-3 group/line">
                     <p className="text-4xl font-chinese font-black text-gray-900 group-hover/line:text-chinese-gold transition-colors uppercase tracking-widest">{line.zh}</p>
                     <p className="text-2xl font-bold text-chinese-gold italic tracking-widest">{line.py}</p>
                     <p className="text-gray-400 font-bold italic">{line.th}</p>
                     <button onClick={() => speak(line.zh)} className="p-3 bg-yellow-50 text-chinese-gold rounded-2xl hover:bg-chinese-gold hover:text-white transition-all shadow-sm mx-auto flex items-center gap-2">
                        <Volume2 size={20} />
                     </button>
                  </div>
               ))}
            </div>
         </div>
      </section>
    </div>
  );
};

const FunLesson9 = ({ lesson, speak, setActiveActivity }: { lesson: any, speak: (t: string, r?: number) => void, setActiveActivity: (a: ActivityType) => void }) => {
  const funData = lesson.activities.find((a: any) => a.type === 'fun_content');
  const [matchAnswers, setMatchAnswers] = useState<Record<string, string>>({});

  if (!funData) return null;

  return (
    <div className="space-y-12 pb-20">
      <div className="bg-gradient-to-r from-pink-500 to-rose-400 p-8 rounded-4xl text-white shadow-lg relative overflow-hidden">
         <div className="relative z-10 flex items-center gap-6">
            <ThreeDContainer color="purple" size="lg" className="hidden md:flex">
               <Gamepad2 size={48} />
            </ThreeDContainer>
            <div>
               <h3 className="text-3xl font-black leading-tight mb-2 uppercase tracking-tight">กิจกรรมหรรษา (FUN)</h3>
               <p className="text-pink-100 font-bold italic text-lg uppercase tracking-wider">บทที่ {lesson.id}: {lesson.title}</p>
            </div>
         </div>
         <Gamepad2 className="w-48 h-48 absolute -right-12 -bottom-12 text-white/10 rotate-12" />
      </div>

      <section className="bg-white p-12 rounded-[4rem] border-4 border-pink-50 shadow-2xl space-y-10">
         <div className="text-center space-y-4">
            <h4 className="text-3xl font-black text-gray-900 uppercase">กิจกรรมที่ 1: เลือกพินอินให้ตรงกับภาพ</h4>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {funData.matchPairs.map((pair: any, i: number) => (
               <div key={`fun-9-match-${i}`} className="bg-white p-6 rounded-3xl border-2 border-gray-100 shadow-xl space-y-4 text-center group">
                  <div className="text-5xl mb-2">{i === 0 ? "🙋" : i === 1 ? "🏓" : i === 2 ? "🚶" : "🏃"}</div>
                  <p className="text-2xl font-chinese font-black text-gray-900 uppercase">{pair.zh}</p>
                  <div className="grid grid-cols-2 gap-2">
                     {pair.opts.map((opt: string) => (
                        <button 
                          key={opt}
                          onClick={() => setMatchAnswers(prev => ({ ...prev, [pair.zh]: opt }))}
                          className={cn(
                            "py-2 rounded-xl font-bold transition-all text-sm",
                            matchAnswers[pair.zh] === opt ? (opt === pair.py ? "bg-emerald-500 text-white" : "bg-red-500 text-white") : "bg-pink-50 text-pink-600 hover:bg-pink-500 hover:text-white"
                          )}
                        >
                          {opt}
                        </button>
                     ))}
                  </div>
               </div>
            ))}
         </div>
      </section>

      <section className="bg-pink-50 p-10 rounded-[4rem] border-4 border-white shadow-xl space-y-10 text-center">
         <div className="space-y-4">
            <h4 className="text-3xl font-black text-pink-900">กิจกรรมที่ 2: เกมทายท่าทาง (CHARADES)</h4>
            <p className="text-lg font-bold text-pink-600 italic uppercase">ให้ตัวแทนออกมาทำท่าทาง แล้วเพื่อนๆ ทายเป็นภาษาจีน</p>
         </div>
         <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {funData.charades.map((item: any, i: number) => (
               <div key={`fun-9-charade-${i}`} className="bg-white p-6 rounded-[2rem] shadow-md border-2 border-pink-100 space-y-2">
                  <p className="text-4xl font-chinese font-black text-gray-900 uppercase">{item.zh}</p>
                  <p className="text-pink-500 font-bold italic text-[10px] items-center">{item.py}</p>
                  <button onClick={() => speak(item.zh)} className="w-full py-1 bg-pink-50 text-pink-600 rounded-lg text-[10px] font-black uppercase">ฟังเฉลย</button>
               </div>
            ))}
         </div>
      </section>

      <section className="bg-white p-12 rounded-[4rem] border-4 border-pink-50 shadow-2xl space-y-10">
         <div className="text-center space-y-2">
            <h4 className="text-3xl font-black text-gray-900 uppercase">กิจกรรมที่ 3: เกมสวมบทบาทเป็นนักข่าวรักษาสุขภาพ</h4>
            <p className="text-pink-600 font-bold italic uppercase">ใช้แอปพลิเคชันอัดวิดีโอสัมภาษณ์เพื่อนๆ เกี่ยวกับการแข่งขันกีฬาที่ชอบ</p>
         </div>
         <div className="max-w-2xl mx-auto space-y-6">
            {funData.interview.map((line: any, i: number) => (
               <div key={`fun-9-int-${i}`} className="bg-pink-50 p-6 rounded-[2.5rem] border-2 border-pink-100 flex items-center gap-6 shadow-sm group hover:translate-x-2 transition-all">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm">
                     {line.speaker === 'A' ? "🎤" : "😊"}
                  </div>
                  <div>
                     <p className="text-2xl font-chinese font-black text-gray-900 uppercase">{line.zh}</p>
                     <p className="text-pink-500 font-bold italic text-sm">{line.py}</p>
                     <p className="text-gray-400 font-bold italic text-[10px]">{line.th}</p>
                  </div>
                  <button onClick={() => speak(line.zh)} className="ml-auto p-3 bg-white text-pink-500 rounded-xl hover:bg-pink-500 hover:text-white transition-all shadow-sm">
                     <Volume2 size={18} />
                  </button>
               </div>
            ))}
         </div>
      </section>
    </div>
  );
};

const SummaryLesson9 = ({ lesson, setActiveActivity, speak }: { lesson: any, setActiveActivity: (type: ActivityType) => void, speak: (t: string, r?: number) => void }) => {
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const navigate = useNavigate();
  const items = [
    "ฉันบอกชื่อกีฬาต่างๆ ในรายการแข่งขันได้",
    "ฉันพูดชื่อนักเรียนหรือสัตว์คู่กับกีฬาที่ชอบได้",
    "ฉันอ่านประโยค 娜娜参加接力赛。 ได้",
    "ฉันรู้หลักการของ '儿化音' และอ่านได้แคล่วคล่อง",
    "ฉันเขียนตัวอักษร 赛 参加 队 场 ได้"
  ];

  const isAllChecked = Object.values(checkedItems).filter(Boolean).length === items.length;
  const [showChallenge, setShowChallenge] = useState(false);

  if (showChallenge) {
    return <ChallengeLesson9 lesson={lesson} speak={speak} />;
  }

  return (
    <div className="space-y-12 pb-20">
      <div className="bg-chinese-red p-8 rounded-4xl text-white shadow-lg relative overflow-hidden">
        <h3 className="text-3xl font-black mb-2 uppercase tracking-tight">สรุปบทเรียน (SUMMARY)</h3>
        <p className="font-bold opacity-90 italic">บทที่ {lesson.id}: {lesson.title}</p>
        <Trophy className="w-48 h-48 absolute -right-12 -bottom-12 text-white/10 rotate-12" />
      </div>

      <section className="space-y-8">
        <div className="flex items-center gap-4">
           <div className="w-3 h-10 bg-emerald-500 rounded-full shadow-lg" />
           <h4 className="text-2xl font-black text-gray-900 uppercase tracking-tight">เช็กความสำเร็จ 🎯</h4>
        </div>
        <div className="bg-white p-10 rounded-[4rem] border-4 border-emerald-50 shadow-2xl space-y-4">
          {items.map((item, idx) => (
            <label key={idx} className="flex items-center gap-6 p-6 hover:bg-emerald-50 rounded-[2.5rem] cursor-pointer transition-all group">
              <div className="relative">
                 <input 
                   type="checkbox" 
                   checked={checkedItems[idx] || false} 
                   onChange={() => setCheckedItems(prev => ({ ...prev, [idx]: !prev[idx] }))} 
                   className="w-10 h-10 rounded-2xl border-4 border-emerald-100 text-emerald-500 transition-all cursor-pointer focus:ring-0 peer" 
                 />
                 <Check className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
              </div>
              <span className={cn("text-2xl font-bold transition-all", checkedItems[idx] ? "text-emerald-600 line-through opacity-50" : "text-gray-700")}>{item}</span>
            </label>
          ))}
          
          <AnimatePresence>
            {isAllChecked && (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0, y: 20 }} 
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="mt-10 bg-gradient-to-br from-emerald-500 to-teal-400 p-12 rounded-[5rem] text-center text-white space-y-8 shadow-[0_20px_50px_rgba(16,185,129,0.3)] relative overflow-hidden"
              >
                  <Sparkles className="absolute top-8 left-8 w-16 h-16 opacity-20 animate-pulse" />
                  <Sparkles className="absolute bottom-8 right-8 w-16 h-16 opacity-20 animate-pulse delay-100" />
                  <div className="relative z-10 space-y-8">
                    <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center mx-auto shadow-2xl border-[12px] border-white/20 animate-bounce">
                      <Trophy className="w-20 h-20 text-chinese-gold" />
                    </div>
                    <div className="space-y-4">
                       <h5 className="text-5xl font-black italic">บทเรียนสุดท้ายแล้วนะ! ✨</h5>
                       <p className="text-2xl font-bold opacity-90 max-w-lg mx-auto leading-relaxed uppercase">เด็กๆ เรียนเนื้อหาบทที่ 9 สำเร็จแล้ว พร้อมที่จะไปรับภารกิจสุดท้ายของเล่มนี้หรือยัง?</p>
                    </div>
                    <ChineseButton variant="gold" size="lg" className="rounded-3xl px-16 py-10 text-2xl shadow-2xl" onClick={() => { window.scrollTo({ top: 0, behavior: 'instant' }); setShowChallenge(true); }}>
                       ไปทำภารกิจสุดท้ายกันเลย! <ChevronRight className="ml-3 w-8 h-8" />
                    </ChineseButton>
                  </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-chinese-red rounded-full" />
          <h4 className="text-2xl font-black text-gray-900 uppercase">ทบทวนกิจกรรมอื่นๆ</h4>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
           {[
             { label: "ฝึกฟังอีกครั้ง", target: ActivityType.LISTENING, icon: <Volume2 className="w-6 h-6" />, color: "bg-orange-500" },
             { label: "ฝึกพูดอีกครั้ง", target: ActivityType.SPEAKING, icon: <Sparkles className="w-6 h-6" />, color: "bg-emerald-500" },
             { label: "ฝึกอ่านอีกครั้ง", target: ActivityType.READING, icon: <BookOpen className="w-6 h-6" />, color: "bg-blue-500" },
             { label: "ฝึกเขียนอีกครั้ง", target: ActivityType.WRITING, icon: <Zap className="w-6 h-6" />, color: "bg-purple-500" },
             { label: "ฝึกพินอินอีกครั้ง", target: ActivityType.PINYIN, icon: <Star className="w-6 h-6" />, color: "bg-chinese-gold" },
             { label: "เล่นเกมหรรษา", target: ActivityType.FUN, icon: <Gamepad2 className="w-6 h-6" />, color: "bg-pink-500" },
           ].map((btn, i) => (
             <button 
              key={`nav-9-summary-${i}`}
              onClick={() => {
                setActiveActivity(btn.target);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={cn(
                "p-8 rounded-[2.5rem] text-white font-black flex flex-col items-center justify-center gap-3 shadow-xl hover:scale-105 active:scale-95 transition-all text-lg",
                btn.color
              )}
             >
                {btn.icon}
                {btn.label}
             </button>
           ))}
        </div>
      </section>
    </div>
  );
};

const ChallengeLesson9 = ({ lesson, speak }: { lesson: any, speak: (t: string, r?: number) => void }) => {
  const challengeData = lesson.activities.find((a: any) => a.type === 'final_challenge');
  const [answers, setAnswers] = useState<Record<number, string | null>>({});
  const [order, setOrder] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);

  if (!challengeData) return null;

  const handleOrderClick = (word: string) => {
    if (order.includes(word)) {
      setOrder(order.filter(w => w !== word));
    } else {
      setOrder([...order, word]);
    }
  };

  return (
    <div className="space-y-12 pb-20">
      <div className="bg-gradient-to-r from-chinese-red to-orange-600 p-8 rounded-4xl text-white shadow-lg relative overflow-hidden">
         <div className="relative z-10 flex items-center gap-6">
            <ThreeDContainer color="red" size="lg" className="hidden md:flex">
               <Trophy size={48} />
            </ThreeDContainer>
            <div>
               <h3 className="text-3xl font-black leading-tight mb-2 uppercase tracking-tight">กิจกรรมท้ายบท (FINAL CHALLENGE)</h3>
               <p className="text-orange-100 font-bold italic text-lg uppercase tracking-wider uppercase tracking-widest">บทที่ {lesson.id}: {lesson.title}</p>
            </div>
         </div>
         <Trophy className="w-48 h-48 absolute -right-12 -bottom-12 text-white/10 rotate-12" />
      </div>

      <section className="bg-white p-10 rounded-[4rem] border-4 border-chinese-red/5 shadow-2xl space-y-10">
         <div className="text-center space-y-4">
            <h4 className="text-3xl font-black text-gray-900 uppercase">ภารกิจที่ 1: ฟังเสียงแล้วเลือกคำศัพท์ที่ถูกต้อง</h4>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {challengeData.audioMatch.map((item: any, i: number) => (
               <div key={`challenge-9-audio-${i}`} className="bg-gray-50 p-8 rounded-[3rem] border-2 border-gray-100 flex items-center gap-8 shadow-sm">
                  <button onClick={() => speak(item.ans)} className="w-20 h-20 bg-chinese-red text-white rounded-[2.5rem] flex items-center justify-center shadow-lg hover:scale-105 transition-all outline-none">
                     <Volume2 size={32} />
                  </button>
                  <div className="grid grid-cols-2 gap-3 flex-grow">
                     {item.opts.map((opt: string) => (
                        <button 
                          key={opt}
                          onClick={() => setAnswers(prev => ({ ...prev, [i]: opt }))}
                          className={cn(
                            "py-4 rounded-2xl font-chinese font-black text-xl transition-all shadow-md",
                            answers[i] === opt ? (opt === item.ans ? "bg-emerald-500 text-white" : "bg-red-500 text-white") : "bg-white text-gray-500 hover:bg-chinese-red/10"
                          )}
                        >
                          {opt}
                        </button>
                     ))}
                  </div>
               </div>
            ))}
         </div>
      </section>

      <section className="bg-chinese-red/5 p-12 rounded-[4rem] border-4 border-white shadow-xl space-y-10">
         <div className="text-center space-y-4">
            <h4 className="text-3xl font-black text-chinese-red uppercase">ภารกิจที่ 2: เรียงคำให้เป็นประโยคที่ถูกต้อง</h4>
            <p className="text-xl font-bold font-chinese text-gray-600 tracking-widest">{challengeData.reorder.zh}</p>
         </div>
         
         <div className="bg-white p-8 rounded-[3rem] min-h-[120px] flex flex-wrap justify-center gap-4 border-4 border-dashed border-chinese-red/20">
            {order.map((word, i) => (
               <motion.button 
                 layoutId={`word-9-${word}`}
                 key={`ordered-9-${i}`}
                 onClick={() => handleOrderClick(word)}
                 className="px-6 py-3 bg-chinese-red text-white rounded-2xl font-chinese font-black text-2xl shadow-md uppercase"
               >
                 {word}
               </motion.button>
            ))}
         </div>

         <div className="flex flex-wrap justify-center gap-4">
            {challengeData.reorder.opts.filter(w => !order.includes(w)).map((word, i) => (
               <motion.button 
                 layoutId={`word-9-${word}`}
                 key={`opt-9-${i}`}
                 onClick={() => handleOrderClick(word)}
                 className="px-6 py-3 bg-white text-gray-900 border-2 border-gray-100 rounded-2xl font-chinese font-black text-2xl shadow-sm hover:border-chinese-red transition-all uppercase"
               >
                 {word}
               </motion.button>
            ))}
         </div>

         <div className="text-center">
            {order.length === challengeData.reorder.opts.length && (
               <p className={cn(
                 "text-2xl font-black italic",
                 order.join('') === challengeData.reorder.ans ? "text-emerald-500" : "text-chinese-red"
               )}>
                 {order.join('') === challengeData.reorder.ans ? "ยอดเยี่ยมมาก! 🎉" : "ลองใหม่อีกครั้งนะ"}
               </p>
            )}
         </div>
      </section>

      <section className="bg-white p-12 rounded-[4rem] border-4 border-chinese-red/5 shadow-2xl space-y-10">
         <div className="text-center space-y-4">
            <h4 className="text-3xl font-black text-gray-900 uppercase">ภารกิจที่ 3: ตอบคำถามจากรายการแข่งขัน</h4>
         </div>
         <div className="max-w-3xl mx-auto space-y-8">
            {challengeData.qa.map((item: any, i: number) => {
               const idx = i + 10; // offset index
               return (
                  <div key={`final-qa-9-${i}`} className="space-y-6 bg-gray-50 p-8 rounded-[3rem] border-2 border-dashed border-chinese-red/10">
                     <div className="space-y-2">
                        <p className="text-3xl font-chinese font-black text-gray-800 uppercase tracking-widest leading-relaxed">{item.qZh}</p>
                        <p className="text-lg font-bold text-chinese-red italic tracking-widest">{item.qPy}</p>
                        <p className="text-gray-400 font-bold italic text-sm">{item.qTh}</p>
                     </div>
                     <div className="grid grid-cols-3 gap-4">
                        {item.opts.map((opt: string) => (
                           <button 
                             key={opt}
                             onClick={() => setAnswers(prev => ({ ...prev, [idx]: opt }))}
                             className={cn(
                               "py-4 rounded-xl font-chinese font-black text-xl transition-all shadow-md",
                               answers[idx] === opt ? (opt === item.ans ? "bg-emerald-500 text-white" : "bg-red-500 text-white") : "bg-white text-gray-500 hover:bg-chinese-red/5"
                             )}
                           >
                             {opt}
                           </button>
                        ))}
                     </div>
                  </div>
               );
            })}
         </div>
      </section>

      <div className="flex justify-center pt-10">
         <ChineseButton variant="gold" size="lg" className="px-20 py-10 text-3xl rounded-[3rem] shadow-[0_20px_50px_rgba(255,215,0,0.3)] animate-pulse" onClick={() => setShowResult(true)}>
            ตรวจคำตอบทั้งหมด
         </ChineseButton>
      </div>

      <AnimatePresence>
        {showResult && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-2xl"
          >
             <div className="bg-white p-16 rounded-[5rem] max-w-2xl w-full text-center space-y-10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-chinese-red via-chinese-gold to-chinese-red" />
                <div className="w-48 h-48 bg-chinese-gold/10 rounded-full flex items-center justify-center mx-auto shadow-inner">
                   <Trophy className="w-24 h-24 text-chinese-gold" />
                </div>
                <div className="space-y-6">
                   <h5 className="text-6xl font-black italic text-gray-900 leading-tight">สำเร็จแล้ว! ✨</h5>
                   <p className="text-2xl font-bold text-gray-500 italic uppercase">เด็กๆ เรียนเนื้อหาบทพุทธาภิเษก เอ้ย! บทเรียนเล่มนี้จบแล้วนะ!</p>
                </div>
                <ChineseButton variant="primary" size="lg" className="w-full rounded-[2.5rem] py-8 text-2xl shadow-xl" onClick={() => setShowResult(false)}>
                   กลับหน้าบทเรียน
                </ChineseButton>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SpeakingLesson2 = ({ lesson, speak, setActiveActivity }: { lesson: any, speak: (t: string) => void, setActiveActivity: (a: ActivityType) => void }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [hasPracticed, setHasPracticed] = useState(false);
  const [randomTemp, setRandomTemp] = useState<string | null>(null);

  const DIALOGUE = [
    { zh: "娜娜，明天我们去动物园吧！", py: "Nàna, míngtiān wǒmen qù dòngwùyuán ba!", th: "นานะ พรุ่งนี้พวกเราไปสวนสัตว์กันเถอะ" },
    { zh: "明天下雨，天气不好。", py: "Míngtiān xià yǔ, tiānqì bù hǎo.", th: "พรุ่งนี้ฝนตก อากาศไม่ดี" },
    { zh: "星期天呢？天气怎么样？", py: "Xīngqītiān ne? Tiānqì zěnmeyàng?", th: "วันอาทิตย์ล่ะ อากาศเป็นอย่างไร" },
    { zh: "星期天不下雨，也不热。", py: "Xīngqītiān bú xià yǔ, yě bú rè.", th: "วันอาทิตย์ฝนไม่ตก อากาศก็ไม่ร้อน" }
  ];

  const temps = ["24°C", "15°C", "26°C", "35°C", "-15°C", "30°C", "10°C"];

  const handlePractice = () => setHasPracticed(true);
  const handleRandomTemp = () => setRandomTemp(temps[Math.floor(Math.random() * temps.length)]);

  useEffect(() => {
    setHasPracticed(false);
  }, [currentIdx]);

  return (
    <div className="space-y-12 pb-20">
      <div className="bg-emerald-500 p-8 rounded-4xl text-white shadow-lg">
        <h3 className="text-3xl font-black mb-2 uppercase tracking-tight">กิจกรรมการฝึกพูด (SPEAKING)</h3>
        <p className="font-bold opacity-90">บทที่ 2: {lesson.title}</p>
      </div>

      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-emerald-500 rounded-full" />
          <h4 className="text-2xl font-black text-gray-900">กิจกรรมที่ 1: ฟังเสียงประโยคแล้วพูดตาม</h4>
        </div>
        
        <div className="max-w-3xl mx-auto bg-white rounded-5xl border-4 border-emerald-100 shadow-2xl p-8 md:p-12 relative overflow-hidden">
          <div className="flex gap-2 justify-center mb-10">
            {DIALOGUE.map((_, i) => (
              <div key={`dot-2-${i}`} className={cn("h-2 rounded-full transition-all duration-500", i === currentIdx ? "w-8 bg-emerald-500" : "w-2 bg-emerald-100")}/>
            ))}
          </div>

          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h4 className="text-4xl md:text-5xl font-chinese font-black text-gray-900 leading-tight">{DIALOGUE[currentIdx].zh}</h4>
              <p className="text-lg md:text-xl font-bold text-emerald-600 tracking-widest">{DIALOGUE[currentIdx].py}</p>
              <p className="text-md text-gray-400 font-bold italic">{DIALOGUE[currentIdx].th}</p>
            </div>

            <div className="flex flex-col items-center gap-8 py-8">
              <button 
                onClick={() => speak(DIALOGUE[currentIdx].zh)}
                className="group flex items-center gap-3 px-10 py-6 bg-emerald-50 text-emerald-600 rounded-3xl border-2 border-emerald-100 font-black hover:bg-emerald-500 hover:text-white transition-all shadow-md active:scale-95 text-xl"
              >
                <Volume2 className="w-8 h-8 group-hover:animate-pulse" />
                ฟังเสียงต้นแบบ
              </button>

              <button 
                onClick={handlePractice}
                className={cn(
                  "w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-lg transition-all border-4 border-white",
                  hasPracticed ? "bg-emerald-600 scale-110" : "bg-emerald-500"
                )}
              >
                {hasPracticed ? <CheckCircle2 className="w-10 h-10 text-white" /> : <MessageCircle className="w-10 h-10 text-white" />}
              </button>
            </div>
          </div>

          <div className="flex justify-between mt-12">
            <button disabled={currentIdx === 0} onClick={() => setCurrentIdx(c => c - 1)} className="p-4 rounded-2xl bg-gray-50 text-gray-400 hover:bg-gray-100 font-black flex items-center gap-2"><ChevronLeft size={20} /> ก่อนหน้า</button>
            <button disabled={!hasPracticed || currentIdx === DIALOGUE.length - 1} onClick={() => setCurrentIdx(c => c + 1)} className={cn("px-8 py-4 text-white rounded-2xl font-black shadow-lg flex items-center gap-2", hasPracticed && currentIdx < DIALOGUE.length - 1 ? "bg-emerald-500" : "bg-gray-300")}>ถัดไป <ChevronRight size={20} /></button>
          </div>
        </div>
      </section>

      <section className="bg-emerald-50 p-8 rounded-4xl border-2 border-emerald-200 space-y-4">
        <div className="flex items-center gap-3 text-emerald-700">
          <Book className="w-6 h-6" />
          <h4 className="text-xl font-black">คำอธิบายไวยากรณ์</h4>
        </div>
        <p className="font-bold text-gray-700">คำว่า “吧” (ba) ใช้วางไว้ท้ายประโยค เพื่อแสดงการชักชวนหรือเสนอแนะ</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { zh: "我们吃饭吧！", th: "พวกเรากินข้าวกันเถอะ" },
            { zh: "我们去超市吧！", th: "พวกเราไปซูเปอร์มาร์เก็ตกันเถอะ" },
            { zh: "你睡觉吧！", th: "เธอนอนเถอะ" }
          ].map((g, i) => (
            <div key={`grammar-2-${i}`} className="bg-white p-4 rounded-2xl border border-emerald-100">
              <p className="text-xl font-chinese font-black text-gray-900">{g.zh}</p>
              <p className="text-sm text-gray-400 font-bold">{g.th}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-emerald-500 rounded-full" />
          <h4 className="text-2xl font-black text-gray-900">กิจกรรมที่ 2: จับคู่ ดูภาพแล้วพูดถามตอบ</h4>
        </div>
        <div className="bg-white p-10 rounded-5xl border-2 border-emerald-100 shadow-sm space-y-8 text-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4 text-left">
              <div className="p-4 bg-emerald-50 rounded-2xl border-l-4 border-emerald-500">
                <p className="text-base font-black text-emerald-800">A: 明天天气怎么样？</p>
                <p className="text-[10px] text-emerald-600 font-bold">Míngtiān tiānqì zěnmeyàng?</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-2xl border-l-4 border-blue-500">
                <p className="text-base font-black text-blue-800">B: 明天下雨。</p>
                <p className="text-[10px] text-blue-600 font-bold">Míngtiān xià yǔ.</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-2xl border-l-4 border-orange-500">
                <p className="text-base font-black text-orange-800">A: 热不热？</p>
                <p className="text-[10px] text-orange-600 font-bold">Rè bu rè?</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-2xl border-l-4 border-purple-500">
                <p className="text-base font-black text-purple-800">B: 不热。</p>
                <p className="text-[10px] text-purple-600 font-bold">Bú rè.</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className={cn(
                "w-48 h-48 mx-auto rounded-full flex flex-col items-center justify-center text-4xl font-black text-white shadow-xl transition-all animate-in zoom-in duration-500",
                randomTemp ? "bg-orange-500 scale-105" : "bg-gray-200"
              )}>
                {randomTemp ? (
                  <>
                    <TrendingUp className="w-10 h-10 mb-2" />
                    {randomTemp}
                  </>
                ) : (
                  <Sparkles className="w-12 h-12 text-gray-400" />
                )}
              </div>
              <button 
                onClick={handleRandomTemp}
                className="px-8 py-4 bg-emerald-500 text-white rounded-2xl font-black shadow-lg hover:scale-105 active:scale-95 transition-all"
              >
                สุ่มสภาพอากาศ 🎲
              </button>
              <p className="text-gray-400 font-bold italic text-sm">สุ่มอุณหภูมิแล้วลองฝึกตอบคำถาม B</p>
            </div>
          </div>
        </div>
      </section>

      <div className="flex justify-center pt-10">
        <button 
          onClick={() => setActiveActivity(ActivityType.READING)}
          className="bg-chinese-gold hover:bg-yellow-600 text-white text-xl px-12 py-8 rounded-3xl font-black flex items-center shadow-lg transition-all hover:scale-105 active:scale-95"
        >
          ไปต่อกิจกรรมฝึกอ่าน (Next)
          <ChevronRight className="w-6 h-6 ml-2" />
        </button>
      </div>
    </div>
  );
};

const ReadingLesson2 = ({ lesson, speak, setActiveActivity }: { lesson: any, speak: (t: string) => void, setActiveActivity: (a: ActivityType) => void }) => {
  const [completed, setCompleted] = useState<Record<number, boolean>>({});
  const [answers, setAnswers] = useState<Record<number, boolean | null>>({});
  
  const STORY = [
    { zh: "今天是10月18号，星期三。", py: "Jīntiān shì shí yuè shíbā hào, xīngqīsān.", th: "วันนี้คือวันที่ 18 ตุลาคม วันพุธ" },
    { zh: "今天北京的天气很好，是晴天，不冷也不热。", py: "Jīntiān Běijīng de tiānqì hěn hǎo, shì qíngtiān, bù lěng yě bú rè.", th: "วันนี้อากาศที่ปักกิ่งดีมาก เป็นวันฟ้าใส ไม่หนาวและไม่ร้อน" },
    { zh: "明天是10月19号，星期四。", py: "Míngtiān shì shí yuè shíjiǔ hào, xīngqīsì.", th: "พรุ่งนี้คือวันที่ 19 ตุลาคม วันพฤหัสบดี" },
    { zh: "明天北京的天气不好，是阴天，很冷。", py: "Míngtiān Běijīng de tiānqì bù hǎo, shì yīntiān, hěn lěng.", th: "พรุ่งนี้อากาศที่ปักกิ่งไม่ดี เป็นวันฟ้าครึ้ม หนาวมาก" }
  ];

  const VOCAB = [
    { zh: "暖和", py: "nuǎnhuo", th: "อบอุ่น" },
    { zh: "不好", py: "bù hǎo", th: "ไม่ดี" }
  ];

  const QUESTIONS = [
    { q: "今天星期几？", choices: ["星期二", "星期三"], correct: 1, th: "วันนี้วันอะไร" },
    { q: "明天是几月几号？", choices: ["10月19号", "11月19号"], correct: 0, th: "พรุ่งนี้วันที่เท่าไร" },
    { q: "今天北京的天气怎么样？", choices: ["不好", "很好"], correct: 1, th: "วันนี้อากาศปักกิ่งเป็นอย่างไร" }
  ];

  const completedCount = Object.values(completed).filter(Boolean).length;
  const isFinished = completedCount === STORY.length;

  const handleSpeak = (text: string) => {
    speakChinese(text, { rate: 0.8 });
  };

  return (
    <div className="space-y-12 pb-20">
      <div className="bg-blue-500 p-8 rounded-4xl text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-3xl font-black mb-2 uppercase tracking-tight">กิจกรรมฝึกอ่าน (READING)</h3>
          <p className="font-bold opacity-90">บทที่ 2: {lesson.title}</p>
          <div className="mt-4 bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/30 inline-block font-bold">
            คำสั่ง: ฟังเสียงเรื่องสั้นแล้วอ่านตาม
          </div>
        </div>
        <BookOpen className="w-48 h-48 absolute -right-12 -bottom-12 text-white/10 rotate-12" />
      </div>

      <section className="bg-white p-10 rounded-5xl border-4 border-blue-100 shadow-sm space-y-10">
        <div className="space-y-8">
          {STORY.map((item, idx) => (
            <motion.div 
              key={`story-2-${idx}`}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={cn(
                "flex gap-6 items-start p-6 rounded-3xl transition-all border-2",
                completed[idx] ? "bg-blue-50 border-blue-200" : "bg-white border-transparent"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center font-black shrink-0 transition-all shadow-md",
                completed[idx] ? "bg-blue-500 text-white" : "bg-blue-50 text-blue-500"
              )}>
                {idx + 1}
              </div>
              <div className="space-y-3 flex-1">
                <h4 className="text-3xl md:text-4xl font-chinese font-black text-gray-900 leading-tight">{item.zh}</h4>
                <p className="text-xl font-bold text-blue-600 tracking-wider font-mono">{item.py}</p>
                <p className="text-lg text-gray-400 font-bold italic">{item.th}</p>
              </div>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => { handleSpeak(item.zh); setCompleted(prev => ({ ...prev, [idx]: true })); }}
                  className="p-4 bg-blue-500 text-white rounded-2xl shadow-lg hover:scale-110 active:scale-95 transition-all"
                >
                  <Volume2 className="w-6 h-6" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="p-8 bg-blue-50 rounded-4xl border-2 border-blue-100">
          <h5 className="font-black text-blue-700 mb-4 flex items-center gap-2">
            <Star className="w-5 h-5" /> ศัพท์เสริม (Extra Vocabulary)
          </h5>
          <div className="grid grid-cols-2 gap-4">
            {VOCAB.map((v, i) => (
              <div key={`vocab-2-${i}`} className="bg-white p-4 rounded-2xl shadow-sm border border-blue-100 flex justify-between items-center">
                <div>
                  <p className="text-2xl font-chinese font-black text-gray-900">{v.zh}</p>
                  <p className="text-blue-500 font-bold text-sm tracking-widest">{v.py}</p>
                </div>
                <p className="font-black text-gray-400">{v.th}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-blue-500 rounded-full" />
          <h4 className="text-2xl font-black text-gray-900">คำถามอ่านตอบ: ตรวจสอบความเข้าใจ</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {QUESTIONS.map((q, idx) => (
            <div key={`q-2-${idx}`} className="bg-white p-8 rounded-4xl border-2 border-blue-50 shadow-sm space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-black text-blue-400 uppercase tracking-widest">Question {idx + 1}</span>
                <p className="text-2xl font-chinese font-black text-gray-900">{q.q}</p>
                <p className="text-sm text-gray-400 font-bold">({q.th})</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {q.choices.map((choice, cIdx) => (
                  <button 
                    key={cIdx} 
                    onClick={() => setAnswers(prev => ({ ...prev, [idx]: cIdx === q.correct }))}
                    className={cn(
                      "p-4 rounded-2xl border-2 font-black transition-all text-lg shadow-sm",
                      answers[idx] === null ? "bg-white border-gray-100 text-gray-600 hover:border-blue-500" :
                      (cIdx === q.correct ? "bg-emerald-500 border-emerald-500 text-white" : 
                       (answers[idx] === false && cIdx !== q.correct ? "bg-rose-500 border-rose-500 text-white" : "bg-gray-50 border-gray-100 text-gray-300 pointer-events-none"))
                    )}
                  >
                    {choice}
                  </button>
                ))}
              </div>
              {answers[idx] === true && <p className="text-emerald-500 font-black text-center text-sm animate-bounce">Correct! เก่งมาก!</p>}
              {answers[idx] === false && <p className="text-rose-500 font-black text-center text-sm">ลองใหม่อีกครั้งนะ</p>}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-blue-600 p-10 rounded-5xl text-white shadow-xl space-y-8 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <MapIcon className="w-8 h-8" />
            <h4 className="text-3xl font-black">กิจกรรม: วันนี้ในประเทศไทย (Weather in Thailand)</h4>
          </div>
          <p className="text-blue-100 font-bold mb-8">ลองนึกและเขียนสภาพอากาศของประเทศไทยวันนี้</p>
          
          <div className="space-y-10">
             <div className="bg-white/10 backdrop-blur-md p-8 rounded-4xl border border-white/20 space-y-6">
                <p className="text-2xl md:text-3xl font-chinese font-black">今天是<span className="border-b-4 border-chinese-gold px-4 mx-1 italic text-chinese-gold">___</span>月<span className="border-b-4 border-chinese-gold px-4 mx-1 italic text-chinese-gold">___</span>号，星期<span className="border-b-4 border-chinese-gold px-4 mx-1 italic text-chinese-gold">___</span>。</p>
                <p className="text-xl md:text-2xl font-chinese font-black">今天泰国的天气是<span className="border-b-4 border-chinese-gold px-8 mx-1 italic text-chinese-gold">________</span>。</p>
             </div>

             <div className="bg-white/10 backdrop-blur-md p-8 rounded-4xl border border-white/20 space-y-6">
                <p className="text-2xl md:text-3xl font-chinese font-black">明天是<span className="border-b-4 border-chinese-gold px-4 mx-1 italic text-chinese-gold">___</span>月<span className="border-b-4 border-chinese-gold px-4 mx-1 italic text-chinese-gold">___</span>号，星期<span className="border-b-4 border-chinese-gold px-4 mx-1 italic text-chinese-gold">___</span>。</p>
                <p className="text-xl md:text-2xl font-chinese font-black">明天的天气是<span className="border-b-4 border-chinese-gold px-8 mx-1 italic text-chinese-gold">________</span>。</p>
             </div>
          </div>
        </div>
        <Zap className="w-64 h-64 absolute -left-20 -bottom-20 text-white/10 rotate-12" />
      </section>

      <div className="flex justify-center pt-10">
        <button 
          onClick={() => setActiveActivity(ActivityType.WRITING)}
          className="bg-chinese-gold hover:bg-yellow-600 text-white text-xl px-12 py-8 rounded-3xl font-black flex items-center shadow-lg transition-all hover:scale-105 active:scale-95"
        >
          ไปต่อกิจกรรมฝึกเขียน (Next)
          <ChevronRight className="w-6 h-6 ml-2" />
        </button>
      </div>
    </div>
  );
};

const WritingLesson2 = ({ lesson, speak, setActiveActivity }: { lesson: any, speak: (t: string) => void, setActiveActivity: (a: ActivityType) => void }) => {
  const [quizResults, setQuizResults] = useState<Record<number, boolean | null>>({});

  const WRITING_CHARS = [
    { zh: "气", py: "qì", th: "อากาศ/ลมปราณ" },
    { zh: "热", py: "rè", th: "ร้อน" },
    { zh: "冷", py: "lěng", th: "หนาว" },
    { zh: "晴", py: "qíng", th: "ฟ้าใส" },
    { zh: "阴", py: "yīn", th: "ครึ้ม" },
    { zh: "雨", py: "yǔ", th: "ฝน" }
  ];

  const TF_QUIZ = [
    { text: "今天晴天。", correct: true },
    { text: "天气怎么样？", correct: true },
    { text: "明天不冷。", correct: true },
    { text: "明天不下雪。", correct: true },
    { text: "星期天下雨。", correct: true },
    { text: "今天很热。", correct: true }
  ];

  const MISSING_STROKES = [
    { word: "天气", th: "อากาศ" },
    { word: "晴天", th: "วันฟ้าใส" },
    { word: "阴天", th: "วันฟ้าครึ้ม" },
    { word: "不热", th: "ไม่ร้อน" },
    { word: "下雪", th: "หิมะตก" },
    { word: "下雨", th: "ฝนตก" }
  ];

  return (
    <div className="space-y-16 pb-20">
      <div className="bg-purple-500 p-8 rounded-4xl text-white shadow-lg relative overflow-hidden">
        <h3 className="text-3xl font-black mb-2 uppercase tracking-tight">กิจกรรมฝึกเขียน (WRITING)</h3>
        <p className="font-bold opacity-90">บทที่ 2: {lesson.title}</p>
        <Zap className="w-48 h-48 absolute -right-12 -bottom-12 text-white/10 rotate-12" />
      </div>

      <section className="space-y-6">
        <h4 className="text-2xl font-black text-gray-900 border-l-8 border-purple-500 pl-4">1. อ่านแล้วเขียนตัวอักษรจีน</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {WRITING_CHARS.map((c, i) => (
            <div key={`char-2-${i}`} className="bg-white p-6 rounded-4xl border-2 border-purple-100 shadow-sm space-y-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-2xl font-black text-purple-600 font-mono">{c.py}</p>
                  <p className="text-sm text-gray-400 font-bold">{c.th}</p>
                </div>
                <button 
                  onClick={() => speak(c.zh)}
                  className="p-3 bg-purple-50 text-purple-600 rounded-2xl hover:bg-purple-500 hover:text-white transition-all shadow-sm"
                >
                   <Volume2 className="w-5 h-5" />
                </button>
              </div>
              <div className="aspect-square bg-gray-50 rounded-3xl border-4 border-dashed border-gray-200 flex items-center justify-center relative group overflow-hidden">
                <span className="text-8xl font-chinese font-black text-gray-200 group-hover:text-purple-100 transition-colors">{c.zh}</span>
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  <div className="w-0.5 h-full bg-gray-400 absolute left-1/2" />
                  <div className="w-full h-0.5 bg-gray-400 absolute top-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6 bg-purple-50 p-8 rounded-5xl border-2 border-purple-100">
        <h4 className="text-2xl font-black text-gray-900 border-l-8 border-purple-500 pl-4">2. ประโยคเหล่านี้ประกอบจากคำที่เรียนได้หรือไม่?</h4>
        <p className="text-gray-500 font-bold px-4">เลือก ✓ หรือ X</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TF_QUIZ.map((q, i) => (
            <div key={`tf-2-${i}`} className="bg-white p-6 rounded-3xl flex justify-between items-center shadow-sm">
              <span className="text-2xl font-chinese font-black text-gray-800">{q.text}</span>
              <div className="flex gap-2">
                <button 
                  onClick={() => setQuizResults(prev => ({ ...prev, [i]: true === q.correct }))}
                  className={cn(
                    "w-12 h-12 rounded-2xl border-4 font-black transition-all",
                    quizResults[i] === true ? "bg-emerald-500 text-white border-emerald-500" : "bg-white border-gray-100 text-emerald-500 hover:border-emerald-500"
                  )}
                >✓</button>
                <button 
                   onClick={() => setQuizResults(prev => ({ ...prev, [i]: false === q.correct }))}
                   className={cn(
                    "w-12 h-12 rounded-2xl border-4 font-black transition-all",
                    quizResults[i] === false ? "bg-emerald-100 text-emerald-600 border-emerald-200" : "bg-white border-gray-100 text-rose-500 hover:border-rose-500"
                  )}
                >X</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h4 className="text-2xl font-black text-gray-900 border-l-8 border-purple-500 pl-4">3. เขียนเส้นขีดที่หายไป</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {MISSING_STROKES.map((m, i) => (
            <div key={`missing-2-${i}`} className="bg-white p-8 rounded-4xl border-2 border-purple-50 text-center space-y-4">
               <h5 className="text-4xl font-chinese font-black text-gray-900 border-b-4 border-dashed border-purple-100 pb-4 inline-block px-4">
                 {m.word === "天气" ? "天_ " : m.word === "晴天" ? "__" : m.word.split('').map(() => '_').join(' ')}
               </h5>
               <p className="font-bold text-gray-400">{m.word} ({m.th})</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-purple-600 p-10 rounded-5xl text-white shadow-xl space-y-8">
        <div className="flex items-center gap-3">
          <Layers className="w-8 h-8" />
          <h4 className="text-2xl font-black">4. เขียนคำศัพท์ที่ประกอบด้วยตัวอักษร "天"</h4>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
          {[
            { zh: "天气", py: "tiānqì", th: "อากาศ" },
            { zh: "晴天", py: "qíngtiān", th: "วันฟ้าใส" },
            { zh: "阴天", py: "īntiān", th: "วันฟ้าครึ้ม" },
            { zh: "明天", py: "míngtiān", th: "พรุ่งนี้" },
            { zh: "今天", py: "jīntiān", th: "วันนี้" },
            { zh: "星期天", py: "xīngqītiān", th: "วันอาทิตย์" }
          ].map((w, i) => (
            <div key={`word-t-2-${i}`} className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20">
               <p className="text-3xl font-chinese font-black">{w.zh}</p>
               <p className="text-purple-200 font-bold text-xs">{w.py}</p>
               <p className="text-xs font-bold text-white/60">{w.th}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h4 className="text-2xl font-black text-gray-900 border-l-8 border-purple-500 pl-4">5. เขียนลำดับขีดตามลายเส้น</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { zh: "风", id: "guā fēng", th: "ลมพัด" },
            { zh: "雨", id: "xià yǔ", th: "ฝนตก" }
          ].map((s, i) => (
            <div key={`stroke-2-${i}`} className="bg-white p-10 rounded-5xl border-2 border-purple-100 space-y-8">
              <div className="flex items-center gap-4 border-b-2 border-purple-50 pb-6">
                <span className="text-6xl font-chinese font-black text-chinese-red">{s.zh}</span>
                <div>
                   <p className="text-xl font-bold text-purple-600">{s.id}</p>
                   <p className="font-bold text-gray-400">{s.th}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                 {Array.from({ length: 6 }).map((_, j) => (
                   <div key={j} className="aspect-square bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center text-4xl font-chinese text-gray-200 select-none">
                     {s.zh}
                   </div>
                 ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-center pt-10">
        <button 
          onClick={() => setActiveActivity(ActivityType.PINYIN)}
          className="bg-chinese-gold hover:bg-yellow-600 text-white text-xl px-12 py-8 rounded-3xl font-black flex items-center shadow-lg transition-all hover:scale-105 active:scale-95"
        >
          ไปต่อกิจกรรมฝึกพินอิน (Next)
          <ChevronRight className="w-6 h-6 ml-2" />
        </button>
      </div>
    </div>
  );
};

const PinyinLesson2 = ({ 
  lesson, 
  pinyinSpeak, 
  pinyinSequenceSpeak, 
  setActiveActivity, 
  playingText 
}: { 
  lesson: any, 
  pinyinSpeak: (py: string, rate?: number) => void,
  pinyinSequenceSpeak: (list: string[], rate?: number) => void,
  setActiveActivity: (a: ActivityType) => void, 
  playingText: string | null 
}) => {
  const [progress, setProgress] = useState<Record<number, boolean>>({});
  const [completedVocab, setCompletedVocab] = useState<Record<number, boolean>>({});

  const TONE_SETS = [
    ["zhū", "chū", "shū", "zhá", "chá", "shá"],
    ["zhǎ", "chǎ", "shǎ", "zhí", "chí", "shí"],
    ["zhāo", "chāo", "shāo", "zháo", "cháo", "sháo"],
    ["zhuāng", "chuāng", "shuāng", "zhóu", "chóu", "shóu"],
    ["zhě", "chě", "shě", "zhì", "chì", "shì"],
    ["zhǔ", "chǔ", "shǔ", "zhà", "chà", "shà"],
    ["zhǎo", "chǎo", "shǎo", "zhòu", "chòu", "shòu"],
    ["zhǔn", "chǔn", "shǔn", "zhàng", "chàng", "shàng"]
  ];

  const WORDS = [
    { zh: "中国", py: "Zhōngguó", th: "ประเทศจีน" },
    { zh: "车站", py: "chēzhàn", th: "สถานีรถ" },
    { zh: "桌子", py: "zhuōzi", th: "โต๊ะ" },
    { zh: "开车", py: "kāichē", th: "ขับรถ" },
    { zh: "厨房", py: "chúfáng", th: "ห้องครัว" },
    { zh: "吃早饭", py: "chī zǎofàn", th: "กินอาหารเช้า" },
    { zh: "电视", py: "diànshì", th: "โทรทัศน์" },
    { zh: "上边", py: "shàngbian", th: "ด้านบน" },
    { zh: "书店", py: "shūdiàn", th: "ร้านหนังสือ" }
  ];

  const RHYME = [
    { zh: "大车拉小车，小车拉石头。", py: "Dà chē lā xiǎo chē, xiǎo chē lā shítou.", th: "รถใหญ่ลากรถเล็ก รถเล็กลากก้อนหิน" },
    { zh: "石头掉下来，砸了脚指头。", py: "Shítou diào xiàlái, zále jiǎozhǐtou.", th: "ก้อนหินตกลงมา ทับนิ้วเท้า" }
  ];

  const totalSections = 3;
  const completedCount = Object.values(progress).filter(Boolean).length;
  const isFinished = completedCount === totalSections;

  const handleSpeak = (text: string, rate: number = 0.8) => {
    pinyinSpeak(text, rate);
  };

  const handleSpeakRow = async (set: string[]) => {
    await pinyinSequenceSpeak(set, 0.75);
  };

  const getColorClass = (py: string) => {
    if (py.startsWith('zh')) return 'text-blue-500';
    if (py.startsWith('ch')) return 'text-emerald-500';
    if (py.startsWith('sh')) return 'text-purple-500';
    return 'text-gray-900';
  };

  return (
    <div className="space-y-12 pb-20 fade-slide-up">
      {/* Header Section */}
      <div className="bg-chinese-gold p-8 rounded-4xl text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-3xl font-black mb-2 uppercase tracking-tight">กิจกรรมฝึกพินอิน (PINYIN)</h3>
          <p className="font-bold opacity-90">บทที่ 2: {lesson.title} {lesson.translation?.split(' (')[0]}</p>
          <div className="mt-4 bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/30 inline-block font-bold">
            คำสั่งหลัก: ฟังเสียงพินอิน แล้วอ่านตาม
          </div>
        </div>
        <Star className="w-48 h-48 absolute -right-12 -bottom-12 text-white/10 rotate-12" />
      </div>

      {/* Progress Tracker */}
      <div className="flex flex-col items-center">
        <div className="w-full max-w-md bg-white border-4 border-chinese-gold/20 rounded-3xl p-6 shadow-sm">
          <div className="flex justify-between items-end mb-2 h-8">
            <span className="font-black text-chinese-gold-dark text-lg">ฝึกแล้ว {completedCount}/{totalSections}</span>
            {isFinished && (
              <motion.span 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                className="text-emerald-500 font-black text-sm"
              >
                เยี่ยมมาก! ฝึกพินอินบทที่ 2 ครบแล้ว ✨
              </motion.span>
            )}
          </div>
          <div className="h-4 bg-chinese-gold/10 rounded-full overflow-hidden border-2 border-chinese-gold/20">
            <motion.div 
              className="h-full bg-chinese-gold"
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / totalSections) * 100}%` }}
              transition={{ type: "spring", bounce: 0, duration: 0.8 }}
            />
          </div>
        </div>
      </div>

      {/* Section 1: ฝึกอ่านเสียง zh ch sh */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-blue-500 rounded-full" />
          <h4 className="text-2xl font-black text-gray-900">ฝึกอ่านเสียง zh ch sh</h4>
        </div>
        <div className="bg-white p-8 rounded-[3rem] border-2 border-gray-100 shadow-sm space-y-8">
          <div className="bg-blue-50 p-6 rounded-3xl border-2 border-dashed border-blue-100 text-center">
            <p className="text-blue-600 font-bold">สังเกตเสียงขึ้นต้น zh, ch, sh และวรรณยุกต์ให้ออกเสียงถูกต้อง</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {TONE_SETS.map((set, idx) => (
              <div key={`pinyin-set-2-${idx}`} className="space-y-4">
                <div className="flex justify-between items-center bg-gray-50/50 p-2 rounded-2xl">
                  <span className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">ชุดที่ {idx + 1}</span>
                  <button 
                    onClick={() => handleSpeakRow(set)}
                    className="px-4 py-1.5 bg-blue-500 text-white rounded-xl text-xs font-black hover:bg-blue-600 transition-all flex items-center gap-2"
                  >
                    <Volume2 className="w-3 h-3" />
                    ฟังทั้งแถว
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {set.map((py, pIdx) => (
                    <div key={`py-2-${idx}-${pIdx}`} className={cn(
                      "bg-white p-4 rounded-2xl border-2 border-gray-50 flex flex-col items-center gap-2 group hover:border-blue-200 transition-all transition-all duration-300",
                      playingText === py && "border-blue-500 ring-4 ring-blue-500/10 scale-105"
                    )}>
                      <span className={cn("text-2xl font-black", getColorClass(py))}>{py}</span>
                      <button 
                        onClick={() => handleSpeak(py, 0.75)}
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm",
                          playingText === py ? "bg-blue-500 text-white animate-pulse" : "bg-gray-50 text-gray-400 hover:bg-blue-500 hover:text-white"
                        )}
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center pt-4">
            <button 
              onClick={() => setProgress(prev => ({ ...prev, 1: true }))}
              className={cn(
                "px-10 py-4 rounded-3xl font-black transition-all shadow-lg text-white",
                progress[1] ? "bg-emerald-500" : "bg-blue-500 hover:scale-105"
              )}
            >
              {progress[1] ? "เสร็จแล้ว ✨" : "ทำเครื่องหมายว่าเสร็จแล้ว"}
            </button>
          </div>
        </div>
      </section>

      {/* Section 2: ฝึกอ่านคำศัพท์พินอิน */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-emerald-500 rounded-full" />
          <h4 className="text-2xl font-black text-gray-900">ฟังเสียงคำศัพท์แล้วอ่านตาม</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {WORDS.map((item, idx) => (
            <div key={`vocab-2-p-${idx}`} className={cn(
              "bg-white p-8 rounded-[2.5rem] border-2 transition-all space-y-6 relative overflow-hidden group",
              completedVocab[idx] ? "border-emerald-500 shadow-emerald-50 shadow-lg" : "border-gray-100 shadow-sm hover:border-chinese-gold/20"
            )}>
              {completedVocab[idx] && (
                <div className="absolute top-4 right-4 bg-emerald-500 text-white p-1 rounded-full">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              )}
              <div className="text-center space-y-2">
                <p className="text-3xl font-black text-chinese-gold">{item.py}</p>
                <p className="text-4xl font-chinese font-black text-gray-900">{item.zh}</p>
                <p className="text-gray-400 font-bold">{item.th}</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => handleSpeak(item.zh, 0.8)}
                  className="flex-1 py-3 bg-chinese-gold/5 text-chinese-gold rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-chinese-gold hover:text-white transition-all shadow-sm"
                >
                  <Volume2 className="w-4 h-4" />
                  ฟังเสียง
                </button>
                <button 
                  onClick={() => setCompletedVocab(prev => ({ ...prev, [idx]: true }))}
                  className={cn(
                    "flex-1 py-3 rounded-2xl font-black transition-all shadow-sm",
                    completedVocab[idx] ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-400 hover:bg-emerald-100"
                  )}
                >
                  อ่านแล้ว
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center pt-8">
          <button 
            onClick={() => setProgress(prev => ({ ...prev, 2: true }))}
            className={cn(
              "px-10 py-4 rounded-3xl font-black transition-all shadow-lg text-white",
              progress[2] ? "bg-emerald-500" : "bg-emerald-500 hover:scale-105"
            )}
          >
            {progress[2] ? "เสร็จแล้ว ✨" : "ทำเครื่องหมายว่าเสร็จแล้ว"}
          </button>
        </div>
      </section>

      {/* Section 3: คำสัมผัสอักษร */}
      <section className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-purple-500 rounded-full" />
          <h4 className="text-2xl font-black text-gray-900">คำสัมผัสอักษร</h4>
        </div>
        <div className="bg-white p-12 rounded-[3.5rem] border-4 border-chinese-gold/10 shadow-xl space-y-12 relative overflow-hidden">
           <Music className="w-32 h-32 absolute -right-8 -top-8 text-chinese-gold/5" />
           <div className="space-y-10 text-center relative z-10">
              {RHYME.map((line, i) => (
                <div key={`rhyme-2-${i}`} className="space-y-3 p-6 rounded-3xl hover:bg-chinese-gold/5 transition-colors group">
                  <h5 className="text-4xl md:text-5xl font-chinese font-black text-gray-900 tracking-wide group-hover:text-chinese-gold transition-colors">{line.zh}</h5>
                  <p className="text-xl font-mono font-black text-chinese-gold">{line.py}</p>
                  <p className="text-lg text-gray-400 font-bold italic">{line.th}</p>
                  <button 
                    onClick={() => handleSpeak(line.zh, 0.7)}
                    className="mt-4 px-6 py-2 bg-chinese-gold/10 text-chinese-gold rounded-full font-black text-sm mx-auto flex items-center gap-2 hover:bg-chinese-gold hover:text-white transition-all"
                  >
                    <Volume2 size={14} /> ฟังทีละบรรทัด
                  </button>
                </div>
              ))}
           </div>
           
           <div className="flex flex-col items-center gap-6 pt-10 border-t-2 border-gray-50">
             <button 
               onClick={() => handleSpeak(RHYME.map(r => r.zh).join(' '), 0.65)}
               className="w-full max-w-md py-6 bg-chinese-gold text-white rounded-3xl font-black text-xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
             >
               <Music className="w-8 h-8" /> ฟังทั้งหมด
             </button>
             <button 
              onClick={() => setProgress(prev => ({ ...prev, 3: true }))}
              className={cn(
                "px-12 py-4 rounded-2xl font-black transition-all shadow-md",
                progress[3] ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-400 hover:bg-chinese-gold hover:text-white"
              )}
             >
               {progress[3] ? "อ่านแล้ว ✓" : "ทำเครื่องหมายว่าเสร็จแล้ว"}
             </button>
           </div>
        </div>
      </section>

      {/* Navigation */}
      <div className="flex justify-center pt-10">
        <button 
          onClick={() => setActiveActivity(ActivityType.FUN)}
          className="bg-chinese-gold hover:bg-yellow-600 text-white text-xl px-12 py-8 rounded-3xl font-black flex items-center shadow-lg transition-all hover:scale-105 active:scale-95"
        >
          ไปต่อกิจกรรมแสนสนุก (Next)
          <ChevronRight className="w-6 h-6 ml-2" />
        </button>
      </div>
    </div>
  );
};

const FunLesson2 = ({ lesson, setActiveActivity }: { lesson: any, setActiveActivity: (a: ActivityType) => void }) => {
  const [matchedIds, setMatchedIds] = useState<number[]>([]);

  const ITEMS = [
    { id: 1, zh: "晴天", icon: "☀️", th: "แดดจ้า" },
    { id: 2, zh: "阴天", icon: "☁️", th: "มืดครึ้ม" },
    { id: 3, zh: "下雨", icon: "🌧️", th: "ฝนตก" },
    { id: 4, zh: "下雪", icon: "❄️", th: "หิมะตก" },
    { id: 5, zh: "热", icon: "🥵", th: "ร้อน" },
    { id: 6, zh: "冷", icon: "🥶", th: "หนาว" }
  ];

  return (
    <div className="space-y-12 pb-20">
      <div className="bg-pink-500 p-8 rounded-4xl text-white shadow-lg relative overflow-hidden">
        <h3 className="text-3xl font-black mb-2 uppercase tracking-tight">กิจกรรมหรรษา (FUN)</h3>
        <p className="font-bold opacity-90">บทที่ 2: {lesson.title}</p>
        <Gamepad2 className="w-48 h-48 absolute -right-12 -bottom-12 text-white/10 rotate-12" />
      </div>

      <div className="bg-white p-10 rounded-[3rem] border-2 border-pink-100 shadow-sm space-y-8">
        <h4 className="text-2xl font-black text-center text-gray-900">เกมจับคู่สภาพอากาศ 🌦️</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
           {ITEMS.map(item => (
             <motion.button 
               key={item.id}
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               className={cn(
                 "aspect-square rounded-3xl border-4 flex flex-col items-center justify-center gap-2 p-4 transition-all",
                 matchedIds.includes(item.id) ? "bg-emerald-50 border-emerald-400 opacity-50" : "bg-gray-50 border-gray-100 hover:border-pink-300"
               )}
               onClick={() => {
                 if (!matchedIds.includes(item.id)) setMatchedIds(prev => [...prev, item.id]);
               }}
             >
               <span className="text-4xl">{item.icon}</span>
               <span className="text-xl font-chinese font-black text-gray-900">{item.zh}</span>
               <span className="text-xs font-bold text-gray-400">{item.th}</span>
             </motion.button>
           ))}
        </div>
        
        {matchedIds.length === ITEMS.length && (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-emerald-500 p-8 rounded-4xl text-white text-center space-y-2">
             <Trophy className="w-12 h-12 mx-auto mb-2 animate-bounce" />
             <h5 className="text-2xl font-black">เก่งมาก! จับคู่ครบทุกอันแล้ว</h5>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const SummaryLesson2 = ({ lesson, setActiveActivity, speak }: { lesson: any, setActiveActivity: (type: ActivityType) => void, speak: (t: string, r?: number) => void }) => {
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  
  const checklist = [
    "ฉันฟังคำศัพท์สภาพอากาศได้",
    "ฉันพูดถามตอบเรื่องอากาศได้",
    "ฉันอ่านประโยค “今天天气怎么样？” ได้",
    "ฉันเขียนตัวอักษร 天 และ 雨 ได้",
    "ฉันออกเสียงพินอินสระ i u ü ได้ครบ 4 เสียง"
  ];

  return (
    <div className="space-y-12 pb-20">
      <div className="bg-chinese-red p-8 rounded-4xl text-white shadow-lg relative overflow-hidden">
        <h3 className="text-3xl font-black mb-2 uppercase tracking-tight">สรุปบทเรียน (SUMMARY)</h3>
        <p className="font-bold opacity-90 italic">บทที่ 2: {lesson.title}</p>
        <Trophy className="w-48 h-48 absolute -right-12 -bottom-12 text-white/10 rotate-12 animate-pulse" />
      </div>

      {/* เรียนอะไรมาบ้าง section */}
      <SummaryDetails data={{
        learned: [
          "เรียนคำศัพท์สภาพอากาศ เช่น 天气, 晴天, 阴天, 下雨, 下雪",
          "เรียนการถามอากาศด้วย 天气怎么样？",
          "เรียนการใช้ 不 และ 也不"
        ],
        listening: [
          "ฟังคำศัพท์เกี่ยวกับอากาศ",
          "ฟังประโยคเกี่ยวกับวันนี้และพรุ่งนี้",
          "ฟังประโยค 明天下雨，天气不好。"
        ],
        speaking: [
          "ฝึกถาม-ตอบว่าอากาศเป็นอย่างไร",
          "ฝึกพูดประโยค 星期天不下雨，也不热。",
          "ฝึกใช้ 吧 เพื่อชักชวน เช่น เราไปสวนสัตว์กันเถอะ!"
        ],
        fun: [
          "จับคู่คำจีนกับพินอินคำศัพท์อากาศ",
          "เกมทายท่าทางบอกสภาพอากาศ",
          "ดูพยากรณ์อากาศแล้วตอบคำถาม"
        ],
        reading: [
          "อ่านเรื่องสั้นเกี่ยวกับอากาศที่ปักกิ่ง",
          "อ่านข้อมูลวันที่ วันในสัปดาห์ และอุณหภูมิ",
          "ตอบคำถาม 今天星期几？天气怎么样？"
        ],
        writing: [
          "ฝึกเขียน 气, 热, 冷, 晴, 阴, 雨",
          "ตรวจว่าตัวอักษรจีนประกอบเป็นประโยคได้หรือไม่",
          "ฝึกคัด 风 และ 雨"
        ],
        pinyin: [
          "ฝึกอ่านเสียง zh ch sh",
          "อ่านคำศัพท์ เช่น Zhōngguó, chēzhàn, shūdiàn",
          "ฝึกพูดคำสัมผัสอักษรเกี่ยวกับ 大车 และ 石头"
        ]
      }} />

      <div className="bg-white p-10 rounded-[3rem] border-2 border-chinese-red/10 shadow-sm space-y-8">
        <h4 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          <BookOpen className="text-chinese-red" />
          สรุปคำศัพท์และประโยค
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="p-6 bg-orange-50 rounded-3xl border border-orange-100">
              <p className="font-black text-orange-600 mb-4">คำศัพท์ที่ต้องจำ</p>
              <div className="flex flex-wrap gap-2 text-sm">
                {lesson.vocabulary.map((v: any) => (
                  <span key={v.word} className="bg-white px-3 py-1 rounded-full font-bold border border-orange-200">{v.word} {v.pinyin}</span>
                ))}
              </div>
           </div>
           <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
              <p className="font-black text-emerald-600 mb-4">ประโยคที่ต้องพูดได้</p>
              <div className="space-y-4 text-sm font-bold">
                 <div className="flex items-center justify-between group">
                   <p>“今天天气怎么样？” (วันนี้อากาศเป็นอย่างไร?)</p>
                   <button onClick={() => speak("今天天气怎么样？")} className="p-2 bg-emerald-500/10 text-emerald-600 rounded-lg opacity-0 group-hover:opacity-100 transition-all"><Volume2 size={14} /></button>
                 </div>
                 <div className="flex items-center justify-between group">
                   <p>“今天晴天 / 阴天 / 下雨。”</p>
                   <button onClick={() => speak("今天晴天。")} className="p-2 bg-emerald-500/10 text-emerald-600 rounded-lg opacity-0 group-hover:opacity-100 transition-all"><Volume2 size={14} /></button>
                 </div>
                 <div className="flex items-center justify-between group">
                   <p>“不冷也不热。” (ไม่หนาวและไม่ร้อน)</p>
                   <button onClick={() => speak("不冷也不热。")} className="p-2 bg-emerald-500/10 text-emerald-600 rounded-lg opacity-0 group-hover:opacity-100 transition-all"><Volume2 size={14} /></button>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <section className="space-y-6">
        <div className="flex items-center gap-3"><div className="w-2 h-8 bg-emerald-500 rounded-full" /><h4 className="text-2xl font-black text-gray-900">เช็กความสำเร็จ 🎯</h4></div>
        <div className="bg-white p-10 rounded-[3.5rem] border-2 border-emerald-100 shadow-sm space-y-6">
           {checklist.map((item, idx) => (
             <label key={idx} className="flex items-center gap-4 p-4 hover:bg-emerald-50 rounded-3xl transition-colors cursor-pointer group">
               <input 
                 type="checkbox" 
                 checked={checkedItems[idx] || false}
                 onChange={() => setCheckedItems(prev => ({ ...prev, [idx]: !prev[idx] }))}
                 className="w-8 h-8 rounded-xl border-4 border-emerald-100 text-emerald-500 cursor-pointer"
               />
               <span className={cn("text-lg font-bold transition-all", checkedItems[idx] ? "text-emerald-600 line-through opacity-50" : "text-gray-700")}>{item}</span>
             </label>
           ))}
           
           <AnimatePresence>
             {Object.values(checkedItems).filter(Boolean).length === checklist.length && (
               <motion.div 
                 initial={{ scale: 0.8, opacity: 0, y: 20 }} 
                 animate={{ scale: 1, opacity: 1, y: 0 }}
                 className="mt-8 bg-gradient-to-br from-emerald-500 to-teal-400 p-10 rounded-[4rem] text-center text-white relative overflow-hidden shadow-2xl"
               >
                   <Sparkles className="absolute top-8 left-8 w-12 h-12 opacity-20" />
                   <Sparkles className="absolute bottom-8 right-8 w-12 h-12 opacity-20" />
                   <div className="relative z-10 space-y-6">
                     <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto shadow-2xl border-8 border-white/20 animate-bounce">
                       <Trophy className="w-16 h-16 text-chinese-gold" />
                     </div>
                     <div className="space-y-1">
                        <h5 className="text-4xl font-black italic">เก่งมากจ๊ะ! ✨</h5>
                        <p className="text-xl font-bold opacity-90 max-w-sm mx-auto">เด็กๆ เรียนเนื้อหาบทที่ 2 สำเร็จแล้ว พร้อมไปต่อหรือยัง?</p>
                     </div>
                     <ChineseButton variant="gold" size="lg" className="rounded-2xl px-12" onClick={() => setActiveActivity(ActivityType.FINAL)}>
                        ไปทำแบบทดสอบเลย! <ChevronRight className="ml-2" />
                     </ChineseButton>
                   </div>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-3 gap-4">
         {[
           { label: "กลับไปฟัง", target: ActivityType.LISTENING, color: "bg-orange-500" },
           { label: "กลับไปพูด", target: ActivityType.SPEAKING, color: "bg-emerald-500" },
           { label: "เริ่มแบบทดสอบ", target: ActivityType.FINAL, color: "bg-chinese-red" },
         ].map((btn, i) => (
           <button key={i} onClick={() => setActiveActivity(btn.target)} className={cn("p-6 rounded-3xl text-white font-black shadow-lg hover:scale-105 transition-all", btn.color)}>
              {btn.label}
           </button>
         ))}
      </section>
    </div>
  );
};

// --- Lesson 3 Specific Components ---

const ListeningLesson3 = ({ lesson, speak, setActiveActivity }: { lesson: any, speak: (t: string) => void, setActiveActivity: (a: ActivityType) => void }) => {
  const ICON_MAP: Record<string, any> = {
    "飞机": Plane,
    "火车": Train,
    "自行车": Bike,
    "公交车": Bus,
    "校车": School,
    "地铁": TramFront,
    "出租车": CarFront,
    "汽车": Car,
    "摩托车": Bike,
    "走路": Footprints
  };

  const sentences = [
    { zh: "你怎么去动物园？", py: "Nǐ zěnme qù dòngwùyuán?", th: "เธอไปสวนสัตว์อย่างไร" },
    { zh: "我坐公交车去。", py: "Wǒ zuò gōngjiāochē qù.", th: "ฉันนั่งรถโดยสารประจำทางไป" },
    { zh: "我骑自行车去。", py: "Wǒ qí zìxíngchē qù.", th: "ฉันขี่จักรยานไป" },
    { zh: "我走路去学校。", py: "Wǒ zǒulù qù xuéxiào.", th: "ฉันเดินไปโรงเรียน" }
  ];

  return (
    <div className="space-y-12 pb-20">
      <div className="bg-orange-500 p-8 rounded-4xl text-white shadow-lg relative overflow-hidden">
        <h3 className="text-3xl font-black mb-2 uppercase tracking-tight">กิจกรรมการฟัง (LISTENING)</h3>
        <p className="font-bold opacity-90">บทที่ 3: {lesson.title}</p>
        <Volume2 className="w-48 h-48 absolute -right-12 -bottom-12 text-white/10 rotate-12" />
      </div>

      <div className="bg-white p-8 rounded-4xl border-2 border-orange-100 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <Sparkles className="text-orange-500" />
          <h4 className="text-xl font-black text-gray-900">ฟังเสียงคำศัพท์แล้วพูดตาม</h4>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {lesson.vocabulary.slice(0, 12).map((v: any, i: number) => {
            const Icon = ICON_MAP[v.word] || Square;
            return (
              <motion.div 
                key={`vocab-3-${i}`}
                whileHover={{ y: -5 }}
                className="bg-gray-50 p-6 rounded-3xl border-2 border-transparent hover:border-orange-200 transition-all text-center space-y-4 group"
              >
                <div className="w-16 h-16 bg-white rounded-2xl mx-auto flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <Icon className="w-8 h-8 text-orange-500" />
                </div>
                <div>
                  <p className="text-3xl font-chinese font-black text-gray-900">{v.word}</p>
                  <p className="text-orange-600 font-bold italic text-sm">{v.pinyin}</p>
                  <p className="text-xs text-gray-400 font-bold">{v.translation.split(' (')[0]}</p>
                </div>
                <button 
                  onClick={() => speak(v.word)}
                  className="w-full py-2 bg-orange-500 text-white rounded-xl font-black text-xs shadow-md hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Volume2 size={14} /> ฟังเสียง
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="bg-orange-50 p-10 rounded-5xl border-4 border-dashed border-orange-200 space-y-8">
        <h4 className="text-2xl font-black text-orange-700 text-center">ฟังประโยคหรรษา</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sentences.map((s, i) => (
            <div key={`sent-3-${i}`} className="bg-white p-6 rounded-3xl flex justify-between items-center shadow-sm hover:shadow-md transition-shadow">
              <div className="space-y-1">
                <p className="text-2xl font-chinese font-black text-gray-800">{s.zh}</p>
                <p className="text-orange-600 font-bold text-sm italic">{s.py}</p>
                <p className="text-gray-400 font-bold text-xs">{s.th}</p>
              </div>
              <button 
                onClick={() => speak(s.zh)}
                className="p-4 bg-orange-100 text-orange-600 rounded-2xl hover:bg-orange-500 hover:text-white transition-all"
              >
                <Volume2 />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center pt-10">
        <button 
          onClick={() => setActiveActivity(ActivityType.SPEAKING)}
          className="bg-orange-600 hover:bg-orange-700 text-white text-xl px-12 py-8 rounded-3xl font-black flex items-center shadow-lg transition-all hover:scale-105 active:scale-95"
        >
          ไปต่อกิจกรรมฝึกพูด (Next)
          <ChevronRight className="w-6 h-6 ml-2" />
        </button>
      </div>
    </div>
  );
};

const SpeakingLesson3 = ({ lesson, speak, setActiveActivity }: { lesson: any, speak: (t: string) => void, setActiveActivity: (a: ActivityType) => void }) => {
  const [randomData, setRandomData] = useState({ person: "马丁", vehicle: "坐飞机", place: "北京" });
  const [hasPracticed, setHasPracticed] = useState<Record<string, boolean>>({});

  const PEOPLE = ["马丁", "姐姐", "爸爸", "哥哥", "妈妈"];
  const VEHICLES = [
    { zh: "坐飞机", py: "zuò fēijī" },
    { zh: "坐公交车", py: "zuò gōngjiāochē" },
    { zh: "坐出租车", py: "zuò chūzūchē" },
    { zh: "骑自行车", py: "qí zìxíngchē" },
    { zh: "坐地铁", py: "zuò dìtiě" }
  ];
  const PLACES = ["北京", "动物园", "超市", "学校", "上班"];

  const generateRandom = () => {
    const p = PEOPLE[Math.floor(Math.random() * PEOPLE.length)];
    const v = VEHICLES[Math.floor(Math.random() * VEHICLES.length)].zh;
    const l = PLACES[Math.floor(Math.random() * PLACES.length)];
    setRandomData({ person: p, vehicle: v, place: l === "上班" ? l : `去${l}` });
  };

  const dialogue = [
    { zh: "马丁，你去哪儿？", py: "Mǎdīng, nǐ qù nǎr?", th: "มาร์ติน ลูกจะไปไหนจ๊ะ" },
    { zh: "我去动物园。", py: "Wǒ qù dòngwùyuán.", th: "ผมจะไปสวนสัตว์ครับ" },
    { zh: "你怎么去？", py: "Nǐ zěnme qù?", th: "ลูกจะไปอย่างไรจ๊ะ" },
    { zh: "我坐公交车去。", py: "Wǒ zuò gōngjiāochē qù.", th: "ผมจะนั่งรถโดยสารประจำทางไปครับ" }
  ];

  return (
    <div className="space-y-16 pb-20">
      <div className="bg-emerald-500 p-8 rounded-4xl text-white shadow-lg relative overflow-hidden">
        <h3 className="text-3xl font-black mb-2 uppercase tracking-tight">กิจกรรมฝึกพูด (SPEAKING)</h3>
        <p className="font-bold opacity-90">บทที่ 3: {lesson.title}</p>
        <MessageCircle className="w-48 h-48 absolute -right-12 -bottom-12 text-white/10 rotate-12" />
      </div>

      <section className="space-y-8">
        <h4 className="text-2xl font-black text-gray-900 border-l-8 border-emerald-500 pl-4">1. ฟังเสียงประโยคแล้วพูดตาม</h4>
        <div className="bg-white p-10 rounded-5xl border-2 border-emerald-100 shadow-sm space-y-10">
          <div className="grid grid-cols-1 gap-6">
            {dialogue.map((d, i) => (
              <div key={i} className={cn(
                "flex items-start gap-4 p-6 rounded-3xl transition-all",
                i % 2 === 0 ? "bg-emerald-50 mr-12" : "bg-blue-50 ml-12 items-end flex-row-reverse"
              )}>
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black shadow-md", i % 2 === 0 ? "bg-emerald-500" : "bg-blue-500")}>
                  {i % 2 === 0 ? "A" : "B"}
                </div>
                <div className={i % 2 === 0 ? "text-left" : "text-right"}>
                  <p className="text-2xl font-chinese font-black text-gray-800">{d.zh}</p>
                  <p className="text-sm font-bold text-gray-400 italic mb-3">{d.py}</p>
                  <button 
                    onClick={() => speak(d.zh)}
                    className="px-4 py-2 bg-white rounded-xl border border-gray-100 flex items-center gap-2 hover:bg-emerald-500 hover:text-white transition-all text-sm font-black shadow-sm"
                  >
                    <Volume2 size={16} /> ฟังเสียง
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-emerald-600 p-8 rounded-4xl text-white space-y-6">
             <div className="flex items-center gap-3">
               <Sparkles className="w-6 h-6 animate-pulse" />
               <h5 className="text-xl font-black">คำถามฝึกตอบ:</h5>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { q: "马丁去哪儿？", a: "马丁去动物园。" },
                  { q: "马丁怎么去？", a: "马丁坐公交车去。" }
                ].map((item, i) => (
                  <div key={i} className="bg-white/10 p-6 rounded-2xl border border-white/20">
                    <p className="font-chinese text-2xl font-black mb-2">{item.q}</p>
                    <button 
                       onClick={() => setHasPracticed(prev => ({ ...prev, [`q-${i}`]: true }))}
                       className={cn("w-full py-3 rounded-xl font-black text-sm transition-all", hasPracticed[`q-${i}`] ? "bg-white text-emerald-600" : "bg-emerald-400 hover:bg-white hover:text-emerald-600")}
                    >
                      {hasPracticed[`q-${i}`] ? "ตอบแล้ว ✓" : "ฝึกตอบประโยค"}
                    </button>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <h4 className="text-2xl font-black text-gray-900 border-l-8 border-emerald-500 pl-4">2. จับคู่ ดูภาพแล้วพูดถามตอบ (สุ่มประโยค)</h4>
        <div className="bg-white p-12 rounded-5xl border-4 border-dashed border-emerald-100 shadow-xl space-y-12 text-center">
           <div className="grid grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="aspect-square bg-blue-50 rounded-4xl flex items-center justify-center border-4 border-blue-100">
                  <Users className="w-16 h-16 text-blue-500" />
                </div>
                <p className="text-3xl font-chinese font-black text-gray-900">{randomData.person}</p>
              </div>
              <div className="flex items-center justify-center">
                <div className="h-1 w-full bg-emerald-100 relative">
                  <ChevronRight className="absolute -right-2 -top-2.5 text-emerald-200" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="aspect-square bg-orange-50 rounded-4xl flex items-center justify-center border-4 border-orange-100">
                  <Bus className="w-16 h-16 text-orange-500" />
                </div>
                <p className="text-3xl font-chinese font-black text-gray-900">{randomData.vehicle}</p>
              </div>
           </div>

           <div className="bg-gray-50 p-10 rounded-4xl border-2 border-gray-100">
              <p className="text-5xl font-chinese font-black text-gray-900 leading-tight">
                {randomData.person}{randomData.vehicle}{randomData.place}。
              </p>
           </div>

           <div className="flex flex-wrap justify-center gap-4">
             <button onClick={() => speak(`${randomData.person}${randomData.vehicle}${randomData.place}`)} className="px-8 py-4 bg-emerald-50 text-emerald-600 rounded-2xl font-black hover:bg-emerald-100 transition-all flex items-center gap-2">
               <Volume2 /> ฟังเสียง
             </button>
             <button onClick={generateRandom} className="px-8 py-4 bg-emerald-500 text-white rounded-2xl font-black hover:bg-emerald-600 transition-all shadow-lg flex items-center gap-2">
               <RefreshCw className="animate-spin-slow" /> สุ่มประโยคใหม่
             </button>
             <button onClick={() => setHasPracticed(prev => ({ ...prev, random: true }))} className={cn("px-8 py-4 rounded-2xl font-black transition-all", hasPracticed.random ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-400 hover:bg-emerald-500 hover:text-white")}>
               พูดแล้ว ✓
             </button>
           </div>
        </div>
      </section>

      <div className="flex justify-center pt-10">
        <button 
          onClick={() => setActiveActivity(ActivityType.READING)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xl px-12 py-8 rounded-3xl font-black flex items-center shadow-lg transition-all hover:scale-105 active:scale-95"
        >
          ไปต่อกิจกรรมฝึกอ่าน (Next)
          <ChevronRight className="w-6 h-6 ml-2" />
        </button>
      </div>
    </div>
  );
};

// --- Generic Lesson Components for Lessons 2-9 ---

const FunLesson3 = ({ lesson, speak, setActiveActivity }: { lesson: any, speak: (t: string) => void, setActiveActivity: (a: ActivityType) => void }) => {
  const [matchedIds, setMatchedIds] = useState<number[]>([]);
  const [randomSentence, setRandomSentence] = useState("坐公交车去动物园。");
  const [surveyData, setSurveyData] = useState<Record<number, { name: string, method: string }>>({});
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  const TRAVEL_METHODS = [
    "走路 (เดิน)", 
    "坐公交车 (เมล์)", 
    "坐出租车 (แท็กซี่)", 
    "骑自行车 (จักรยาน)", 
    "坐地铁 (MRT)", 
    "坐电车 (BTS)"
  ];

  const MATCH_ITEMS = [
    { id: 1, zh: "飞机", py: "fēijī" },
    { id: 2, zh: "公交车", py: "gōngjiāochē" },
    { id: 3, zh: "地铁", py: "dìtiě" },
    { id: 4, zh: "火车", py: "huǒchē" },
    { id: 5, zh: "怎么", py: "zěnme" },
    { id: 6, zh: "走路", py: "zǒulù" },
    { id: 7, zh: "骑", py: "qí" },
    { id: 8, zh: "自行车", py: "zìxíngchē" }
  ];

  const GAME_SENTENCES = [
    "坐公交车去动物园。",
    "骑自行车去学校。",
    "坐火车去北京。",
    "坐出租车去医院。",
    "坐地铁去书店。",
    "骑摩托车去饭店。"
  ];



  const CHECKLIST = [
    "ฉันบอกวิธีเดินทางต่างๆ ได้",
    "ฉันจับคู่พินอินกับตัวอักษรได้",
    "ฉันสัมภาษณ์เพื่อนเรื่องการมาโรงเรียนได้",
    "ฉันอ่านประโยค '你怎么去...?' ได้"
  ];

  const generateGameSentence = () => {
    setRandomSentence(GAME_SENTENCES[Math.floor(Math.random() * GAME_SENTENCES.length)]);
  };

  return (
    <div className="space-y-16 pb-20">
      <div className="bg-pink-500 p-8 rounded-4xl text-white shadow-lg relative overflow-hidden">
        <h3 className="text-3xl font-black mb-2 uppercase tracking-tight">กิจกรรมหรรษา (FUN)</h3>
        <p className="font-bold opacity-90">บทที่ 3: {lesson.title}</p>
        <Gamepad2 className="w-48 h-48 absolute -right-12 -bottom-12 text-white/10 rotate-12" />
      </div>

      <section className="space-y-8">
        <h4 className="text-2xl font-black text-gray-900 border-l-8 border-pink-500 pl-4">1. เลือกพินอินให้ตรงกับคำศัพท์</h4>
        <div className="bg-white p-10 rounded-5xl border-2 border-pink-100 shadow-sm space-y-8">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {MATCH_ITEMS.map(item => (
               <button 
                key={item.id}
                onClick={() => { if (!matchedIds.includes(item.id)) setMatchedIds(prev => [...prev, item.id]); }}
                className={cn(
                  "p-6 rounded-3xl border-4 text-center transition-all",
                  matchedIds.includes(item.id) ? "bg-emerald-50 border-emerald-400" : "bg-gray-50 border-gray-100 hover:border-pink-300"
                )}
               >
                 <p className="text-2xl font-chinese font-black text-gray-900">{item.zh}</p>
                 <p className={cn("text-sm font-bold mt-2", matchedIds.includes(item.id) ? "text-emerald-500" : "text-gray-300")}>{item.py}</p>
               </button>
             ))}
           </div>
        </div>
      </section>

      <section className="space-y-8">
        <h4 className="text-2xl font-black text-gray-900 border-l-8 border-pink-500 pl-4">2. เกมยานพาหนะกับสถานที่</h4>
        <div className="bg-white p-12 rounded-5xl border-4 border-dashed border-pink-100 shadow-xl space-y-10 text-center">
           <div className="bg-pink-50 p-10 rounded-4xl border-2 border-pink-200">
              <p className="text-4xl font-chinese font-black text-pink-700">{randomSentence}</p>
           </div>
           <div className="flex justify-center gap-4">
             <button onClick={() => speak(randomSentence)} className="px-8 py-4 bg-pink-100 text-pink-600 rounded-2xl font-black hover:bg-pink-500 hover:text-white transition-all flex items-center gap-2 shadow-sm">
               <Volume2 /> ฟังเสียงครูพูด
             </button>
             <button onClick={generateGameSentence} className="px-8 py-4 bg-pink-500 text-white rounded-2xl font-black hover:bg-pink-600 transition-all shadow-lg flex items-center gap-2">
               <RotateCcw className="w-5 h-5" /> สุ่มประโยคใหม่
             </button>
           </div>
        </div>
      </section>

      <section className="space-y-8">
        <h4 className="text-2xl font-black text-gray-900 border-l-8 border-pink-500 pl-4">3. สัมภาษณ์เพื่อน 5 คน</h4>
        <div className="bg-white p-10 rounded-5xl border-2 border-pink-100 shadow-sm space-y-8">
           <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 space-y-2">
             <p className="font-bold text-emerald-800">ประโยคถาม: 你怎么来学校？ (เธอมาโรงเรียนอย่างไร)</p>
             <p className="font-bold text-emerald-800">ประโยคตอบ: 我走路来学校。 (ฉันเดินมาโรงเรียน)</p>
           </div>
           <div className="overflow-x-auto">
             <table className="w-full">
               <thead>
                 <tr>
                    <th className="p-4 text-left border-b-2 font-black text-gray-400 uppercase tracking-widest text-xs">ชื่อเพื่อน</th>
                    <th className="p-4 text-left border-b-2 font-black text-gray-400 uppercase tracking-widest text-xs">วิธีมาโรงเรียน</th>
                 </tr>
               </thead>
               <tbody>
                  {[...Array(5)].map((_, i) => (
                    <tr key={i} className="border-b border-gray-50">
                      <td className="p-4">
                        <input 
                          type="text" 
                          placeholder={`ชื่อเพื่อนคนที่ ${i+1}`}
                          className="w-full bg-gray-50 p-3 rounded-xl border border-transparent focus:border-pink-300 focus:bg-white outline-none transition-all font-bold"
                          value={surveyData[i]?.name || ""}
                          onChange={(e) => setSurveyData(prev => ({ ...prev, [i]: { ...prev[i], name: e.target.value } }))}
                        />
                      </td>
                      <td className="p-4">
                        <select 
                          className="w-full bg-gray-50 p-3 rounded-xl border border-transparent focus:border-pink-300 focus:bg-white outline-none transition-all font-bold"
                          value={surveyData[i]?.method || ""}
                          onChange={(e) => setSurveyData(prev => ({ ...prev, [i]: { ...prev[i], method: e.target.value } }))}
                        >
                          <option value="">เลือกวิธีเดินทาง</option>
                          {TRAVEL_METHODS.map(m => (
                            <option key={m} value={m}>{m}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
               </tbody>
             </table>
           </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-3"><div className="w-2 h-8 bg-emerald-500 rounded-full" /><h4 className="text-2xl font-black text-gray-900">4. Checklist 🎯</h4></div>
        <div className="bg-white p-8 rounded-4xl border-2 border-emerald-100 space-y-4 shadow-sm">
           {CHECKLIST.map((item, idx) => (
             <label key={idx} className="flex items-center gap-4 p-4 hover:bg-emerald-50 rounded-3xl transition-colors cursor-pointer group">
               <input 
                 type="checkbox" 
                 checked={checkedItems[idx] || false}
                 onChange={() => setCheckedItems(prev => ({ ...prev, [idx]: !prev[idx] }))}
                 className="w-8 h-8 rounded-xl border-4 border-emerald-100 text-emerald-500 cursor-pointer"
               />
               <span className={cn("text-lg font-bold transition-all", checkedItems[idx] ? "text-emerald-600 line-through opacity-50" : "text-gray-700 group-hover:text-emerald-600")}>{item}</span>
             </label>
           ))}
        </div>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-3 gap-4">
         {[
           { label: "กลับไปฟัง", target: ActivityType.LISTENING, color: "bg-orange-500" },
           { label: "กลับไปพูด", target: ActivityType.SPEAKING, color: "bg-emerald-500" },
           { label: "กลับไปอ่าน", target: ActivityType.READING, color: "bg-blue-500" },
           { label: "สรุป", target: ActivityType.FINAL, color: "bg-chinese-red" },
         ].map((btn, i) => (
           <button key={i} onClick={() => setActiveActivity(btn.target)} className={cn("p-6 rounded-3xl text-white font-black hover:scale-105 active:scale-95 transition-all shadow-md", btn.color)}>
              {btn.label}
           </button>
         ))}
      </section>
    </div>
  );
};

/* CORRUPTED SECTION
           { label: "กลับไปเ�        </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {set.map((py, pIdx) => (
                    <div key={`py-3-${idx}-${pIdx}`} className="bg-white p-4 rounded-2xl border-2 border-gray-50 flex flex-col items-center gap-2 group hover:border-blue-200 transition-all">
                      <span className={cn("text-2xl font-black", getColorClass(py))}>{py}</span>
                      <button 
                        onClick={() => handleSpeak(py, 0.75)}
                        className="w-8 h-8 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all shadow-sm"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center pt-4">
            <button 
              onClick={() => setProgress(prev => ({ ...prev, 1: true }))}
              className={cn(
                "px-10 py-4 rounded-3xl font-black transition-all shadow-lg text-white",
                progress[1] ? "bg-emerald-500" : "bg-blue-500 hover:scale-105"
              )}
            >
              {progress[1] ? "เสร็จแล้ว ✨" : "ทำเครื่องหมายว่าเสร็จแล้ว"}
            </button>
          </div>
        </div>
      </section>

      {/* Section 2: ฝึกอ่านคำศัพ�*/
const PinyinLesson3 = ({ 
  lesson, 
  pinyinSpeak, 
  pinyinSequenceSpeak, 
  setActiveActivity,
  playingText
}: { 
  lesson: any, 
  pinyinSpeak: (py: string, rate?: number) => void,
  pinyinSequenceSpeak: (list: string[], rate?: number) => void,
  setActiveActivity: (a: ActivityType) => void,
  playingText: string | null
}) => {
  const [progress, setProgress] = useState<Record<number, boolean>>({});
  const [completedVocab, setCompletedVocab] = useState<Record<number, boolean>>({});

  const TONE_SETS = [
    ["lā", "rā", "lú", "rú"],
    ["lǔ", "rǔ", "lù", "rù"],
    ["lāo", "ráo", "lǎo", "rǎo"],
    ["lòu", "ròu", "láng", "ráng"],
    ["lán", "rán", "lǎng", "rǎng"],
    ["luò", "ruò", "lēng", "rēng"],
    ["léng", "réng", "lóng", "róng"],
    ["lùn", "rùn"]
  ];

  const WORDS = [
    { zh: "很冷", py: "hěn lěng", th: "หนาวมาก" },
    { zh: "走路", py: "zǒulù", th: "เดิน" },
    { zh: "礼堂", py: "lǐtáng", th: "หอประชุม" },
    { zh: "中国人", py: "Zhōngguórén", th: "คนจีน" },
    { zh: "日本", py: "Rìběn", th: "ญี่ปุ่น" },
    { zh: "很热", py: "hěn rè", th: "ร้อนมาก" }
  ];

  const RHYME = [
    { zh: "小龙和小荣，今年都十六。", py: "Xiǎolóng hé Xiǎoróng, jīnnián dōu shíliù.", th: "เสี่ยวหลงกับเสี่ยวหรง ปีนี้อายุสิบหกทั้งคู่" },
    { zh: "小龙爱吃肉，小荣爱吃梨。", py: "Xiǎolóng ài chี ròu, Xiǎoróng ài chī lí.", th: "เสี่ยวหลงชอบกินเนื้อ เสี่ยวหรงชอบกินสาลี่" },
    { zh: "小龙不怕热，小荣不怕凉。", py: "Xiǎolóng bú pà rè, Xiǎoróng bú pà liáng.", th: "เสี่ยวหลงไม่กลัวร้อน เสี่ยวหรงไม่กลัวเย็น" }
  ];

  const totalSections = 3;
  const completedCount = Object.values(progress).filter(Boolean).length;
  const isFinished = completedCount === totalSections;

  const handleSpeak = (text: string, rate: number = 0.8) => {
    pinyinSpeak(text, rate);
  };

  const handleSpeakRow = async (set: string[]) => {
    await pinyinSequenceSpeak(set, 0.75);
  };

  const getColorClass = (py: string) => {
    if (py.startsWith('l')) return 'text-blue-500';
    if (py.startsWith('r')) return 'text-purple-500';
    return 'text-gray-900';
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Header Section */}
      <div className="bg-chinese-gold p-8 rounded-4xl text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-3xl font-black mb-2 uppercase tracking-tight">กิจกรรมฝึกพินอิน (PINYIN)</h3>
          <p className="font-bold opacity-90">บทที่ 3: {lesson.title} {lesson.translation.split(' (')[0]}</p>
          <div className="mt-4 bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/30 inline-block font-bold">
            คำสั่งหลัก: ฟังเสียงพินอิน แล้วอ่านตาม
          </div>
        </div>
        <Star className="w-48 h-48 absolute -right-12 -bottom-12 text-white/10 rotate-12" />
      </div>

      {/* Progress Tracker */}
      <div className="flex flex-col items-center">
        <div className="w-full max-w-md bg-white border-4 border-chinese-gold/20 rounded-3xl p-6 shadow-sm">
          <div className="flex justify-between items-end mb-2 h-8">
            <span className="font-black text-chinese-gold-dark text-lg">ฝึกแล้ว {completedCount}/{totalSections}</span>
            {isFinished && (
              <motion.span 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                className="text-emerald-500 font-black text-sm"
              >
                เยี่ยมมาก! ฝึกพินอินบทที่ 3 ครบแล้ว ✨
              </motion.span>
            )}
          </div>
          <div className="h-4 bg-chinese-gold/10 rounded-full overflow-hidden border-2 border-chinese-gold/20">
            <motion.div 
              className="h-full bg-chinese-gold"
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / totalSections) * 100}%` }}
              transition={{ type: "spring", bounce: 0, duration: 0.8 }}
            />
          </div>
        </div>
      </div>

      {/* Section 1: ฝึกอ่านเสียง l r */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-blue-500 rounded-full" />
          <h4 className="text-2xl font-black text-gray-900">ฝึกอ่านเสียง l r</h4>
        </div>
        <div className="bg-white p-8 rounded-[3rem] border-2 border-gray-100 shadow-sm space-y-8">
          <div className="bg-blue-50 p-6 rounded-3xl border-2 border-dashed border-blue-100 text-center">
            <p className="text-blue-600 font-bold">สังเกตเสียงขึ้นต้น l และ r แล้วออกเสียงให้ถูกต้อง</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {TONE_SETS.map((set, idx) => (
              <div key={`pinyin-set-3-${idx}`} className="space-y-4">
                <div className="flex justify-between items-center bg-gray-50/50 p-2 rounded-2xl">
                  <span className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">ชุดที่ {idx + 1}</span>
                  <button 
                    onClick={() => handleSpeakRow(set)}
                    className="px-4 py-1.5 bg-blue-500 text-white rounded-xl text-xs font-black hover:bg-blue-600 transition-all flex items-center gap-2"
                  >
                    <Volume2 className="w-3 h-3" />
                    ฟังทั้งแถว
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {set.map((py, pIdx) => (
                    <div key={`py-3-${idx}-${pIdx}`} className={cn(
                      "bg-white p-4 rounded-2xl border-2 border-gray-50 flex flex-col items-center gap-2 group hover:border-blue-200 transition-all transition-all duration-300",
                      playingText === py && "border-blue-500 ring-4 ring-blue-500/10 scale-105"
                    )}>
                      <span className={cn("text-2xl font-black", getColorClass(py))}>{py}</span>
                      <button 
                        onClick={() => handleSpeak(py, 0.75)}
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm",
                          playingText === py ? "bg-blue-500 text-white animate-pulse" : "bg-gray-50 text-gray-400 hover:bg-blue-500 hover:text-white"
                        )}
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center pt-4">
            <button 
              onClick={() => setProgress(prev => ({ ...prev, 1: true }))}
              className={cn(
                "px-10 py-4 rounded-3xl font-black transition-all shadow-lg text-white",
                progress[1] ? "bg-emerald-500" : "bg-blue-500 hover:scale-105"
              )}
            >
              {progress[1] ? "เสร็จแล้ว ✨" : "ทำเครื่องหมายว่าเสร็จแล้ว"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

const ReadingLesson3 = ({ lesson, speak, setActiveActivity }: { lesson: any, speak: (t: string) => void, setActiveActivity: (a: ActivityType) => void }) => {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [selectedImages, setSelectedImages] = useState<Record<number, string>>({});

  const TRUE_FALSE = [
    { q: "他坐飞机去学校。", th: "เขานั่งเครื่องบินไปโรงเรียน", correct: false },
    { q: "我走路去学校。", th: "ฉันเดินไปโรงเรียน", correct: true },
    { q: "老师骑自行车去北京。", th: "ครูขี่จักรยานไปปักกิ่ง", correct: false }
  ];

  const IMAGE_QUIZ = [
    { q: "爸爸开车去公司。", options: ["🚗", "🚲", "✈️", "🚇"], correct: "🚗" },
    { q: "你怎么去学校？", options: ["❓", "🏠", "🏫", "🚶"], correct: "❓" }
  ];

  return (
    <div className="space-y-12 pb-20">
      <div className="bg-blue-600 p-8 rounded-4xl text-white shadow-lg relative overflow-hidden">
        <h3 className="text-3xl font-black mb-2 uppercase tracking-tight">กิจกรรมฝึกอ่าน (READING)</h3>
        <p className="font-bold opacity-90">บทที่ 3: {lesson.title}</p>
        <Star className="w-48 h-48 absolute -right-12 -bottom-12 text-white/10 rotate-12" />
      </div>

      <section className="space-y-8">
        <h4 className="text-2xl font-black text-gray-900 border-l-8 border-blue-500 pl-4">1. อ่านแล้วเลือก ✓ หรือ X</h4>
        <div className="space-y-4">
          {TRUE_FALSE.map((q, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border-2 border-blue-50 flex items-center justify-between shadow-sm">
               <div>
                 <p className="text-2xl font-chinese font-black text-gray-800">{q.q}</p>
                 <p className="text-xs text-gray-400 font-bold">{q.th}</p>
               </div>
               <div className="flex gap-2">
                 <button 
                  onClick={() => setAnswers(prev => ({ ...prev, [i]: true === q.correct }))}
                  className={cn("w-12 h-12 rounded-2xl border-4 font-black transition-all", answers[i] === true ? "bg-emerald-500 border-emerald-500 text-white" : "border-gray-100 text-emerald-500 hover:border-emerald-500")}
                 >✓</button>
                 <button 
                  onClick={() => setAnswers(prev => ({ ...prev, [i]: false === q.correct }))}
                  className={cn("w-12 h-12 rounded-2xl border-4 font-black transition-all", answers[i] === false ? "bg-emerald-500 border-emerald-500 text-white" : "border-gray-100 text-rose-500 hover:border-rose-500")}
                 >X</button>
               </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <h4 className="text-2xl font-black text-gray-900 border-l-8 border-blue-500 pl-4">3. อ่านประโยคแล้วเลือกภาพที่ถูกต้อง</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {IMAGE_QUIZ.map((q, i) => (
            <div key={i} className="bg-white p-8 rounded-5xl border-2 border-blue-100 space-y-6 shadow-md">
               <p className="text-2xl font-chinese font-black text-gray-800 border-b-2 border-blue-50 pb-4">{q.q}</p>
               <div className="grid grid-cols-4 gap-3">
                 {q.options.map(opt => (
                   <button 
                    key={opt}
                    onClick={() => setSelectedImages(prev => ({ ...prev, [i]: opt }))}
                    className={cn(
                      "aspect-square rounded-2xl text-4xl flex items-center justify-center transition-all border-4",
                      selectedImages[i] === opt ? (opt === q.correct ? "bg-emerald-50 border-emerald-400" : "bg-rose-50 border-rose-400") : "bg-gray-50 border-transparent hover:border-blue-200"
                    )}
                   >
                     {opt}
                   </button>
                 ))}
               </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-center pt-10">
        <button 
          onClick={() => setActiveActivity(ActivityType.WRITING)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xl px-12 py-8 rounded-3xl font-black flex items-center shadow-lg transition-all hover:scale-105 active:scale-95"
        >
          ไปต่อกิจกรรมฝึกเขียน (Next)
          <ChevronRight className="w-6 h-6 ml-2" />
        </button>
      </div>
    </div>
  );
};

const WritingLesson3 = ({ lesson, speak, setActiveActivity }: { lesson: any, speak: (t: string) => void, setActiveActivity: (a: ActivityType) => void }) => {
  const [fillAnswers, setFillAnswers] = useState<Record<number, string>>({});

  const CHARS = [
    { zh: "飞", py: "fēi", th: "บิน" },
    { zh: "机", py: "jī", th: "เครื่อง" },
    { zh: "坐", py: "zuò", th: "นั่ง" },
    { zh: "骑", py: "qí", th: "ขี่" },
    { zh: "走", py: "zǒu", th: "เดิน" },
    { zh: "火", py: "huǒ", th: "ไฟ" },
    { zh: "地", py: "dì", th: "พื้นดิน" },
    { zh: "校", py: "xiào", th: "โรงเรียน" }
  ];

  const CIRCLE_QUIZ = [
    { q: "我坐飞__去中国。", py: "Wǒ zuò fēi__ qù Zhōngguó.", options: ["机", "几", "极"], correct: "机", th: "ฉันนั่งเครื่องบินไปประเทศจีน" },
    { q: "奶奶__路来我家。", py: "Nǎinai __ lù lái wǒ jiā.", options: ["去", "坐", "走"], correct: "走", th: "คุณย่าเดินมาบ้านฉัน" },
    { zh: "姐姐__火车去爷爷家。", py: "Jiějie __ huǒchē qù yéye jiā.", options: ["座", "生", "坐"], correct: "坐", th: "พี่สาวนั่งรถไฟไปบ้านคุณปู่" },
    { zh: "爸爸坐__铁去书店。", py: "Bàba zuò __tiě qù shūdiàn.", options: ["也", "地", "他"], correct: "地", th: "พ่อนั่งรถไฟฟ้าใต้ดินไปร้านหนังสือ" }
  ];

  const MISSING = ["飞机", "坐车", "走路", "校车", "地铁", "骑车"];

  return (
    <div className="space-y-16 pb-20">
      <div className="bg-purple-500 p-8 rounded-4xl text-white shadow-lg relative overflow-hidden">
        <h3 className="text-3xl font-black mb-2 uppercase tracking-tight">กิจกรรมฝึกเขียน (WRITING)</h3>
        <p className="font-bold opacity-90">บทที่ 3: {lesson.title}</p>
        <Zap className="w-48 h-48 absolute -right-12 -bottom-12 text-white/10 rotate-12" />
      </div>

      <section className="space-y-8">
        <h4 className="text-2xl font-black text-gray-900 border-l-8 border-purple-500 pl-4">1. อ่านแล้วเขียนตัวอักษรจีน</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {CHARS.map((c, i) => (
            <div key={i} className="bg-white p-6 rounded-4xl border-2 border-purple-50 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                   <p className="text-xl font-black text-purple-600">{c.py}</p>
                   <p className="text-xs text-gray-400 font-bold">{c.th}</p>
                </div>
                <button onClick={() => speak(c.zh)} className="p-2 bg-purple-50 text-purple-500 rounded-xl hover:bg-purple-500 hover:text-white transition-all">
                  <Volume2 size={16} />
                </button>
              </div>
              <div className="aspect-square bg-gray-50 rounded-3xl border-4 border-dashed border-gray-100 flex items-center justify-center text-7xl font-chinese text-gray-200 group relative cursor-pointer">
                 <span className="opacity-10 group-hover:opacity-100 transition-opacity">{c.zh}</span>
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-px h-full bg-gray-200" />
                    <div className="w-full h-px bg-gray-200" />
                 </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-8 bg-purple-50 p-10 rounded-5xl border-2 border-purple-100">
        <h4 className="text-2xl font-black text-gray-900 border-l-8 border-purple-500 pl-4">2. วงกลมตัวอักษรจีนที่หายไป</h4>
        <div className="space-y-6">
          {CIRCLE_QUIZ.map((q, i) => (
            <div key={i} className="bg-white p-8 rounded-4xl shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                 <div>
                   <p className="text-3xl font-chinese font-black text-gray-800 tracking-wider">{(q as any).q || (q as any).zh}</p>
                   <p className="text-purple-600 font-bold text-sm italic">{q.py}</p>
                   <p className="text-gray-400 font-bold text-xs">{q.th}</p>
                 </div>
              </div>
              <div className="flex gap-4">
                {q.options.map(opt => (
                  <button 
                    key={opt}
                    onClick={() => setFillAnswers(prev => ({ ...prev, [i]: opt }))}
                    className={cn(
                      "w-16 h-16 rounded-2xl border-4 text-2xl font-chinese font-black transition-all",
                      fillAnswers[i] === opt ? (opt === q.correct ? "bg-emerald-500 border-emerald-500 text-white" : "bg-rose-500 border-rose-500 text-white") : "bg-white border-gray-100 text-purple-600 hover:border-purple-300"
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <h4 className="text-2xl font-black text-gray-900 border-l-8 border-purple-500 pl-4">3. เขียนเส้นขีดที่หายไป</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {MISSING.map((m, i) => (
            <div key={i} className="bg-white p-8 rounded-4xl border-2 border-purple-50 text-center space-y-4">
               <h5 className="text-4xl font-chinese font-black text-gray-900 border-b-4 border-dashed border-purple-100 pb-4 px-4 inline-block tracking-widest">{m.split('').map(() => '_').join('')}</h5>
               <p className="font-bold text-gray-400">{m}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-purple-600 p-10 rounded-5xl text-white space-y-8 shadow-xl">
        <div className="flex items-center gap-3">
          <Layers className="w-8 h-8" />
          <h4 className="text-2xl font-black text-white">4. เขียนคำศัพท์ที่ประกอบด้วยตัวอักษร "车"</h4>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["火车", "汽车", "校车", "公交车", "出租车", "自行车", "摩托车"].map((w, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 text-center">
               <p className="text-3xl font-chinese font-black">{w}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <h4 className="text-2xl font-black text-gray-900 border-l-8 border-purple-500 pl-4">5. เขียนลำดับขีดตามลายเส้น</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {[
             { zh: "火", word: "火车", th: "รถไฟ" },
             { zh: "坐", word: "坐车", th: "นั่งรถ" }
           ].map((s, i) => (
             <div key={i} className="bg-white p-10 rounded-5xl border-2 border-purple-100 space-y-8">
               <div className="flex items-center gap-6 pb-6 border-b-2 border-purple-50">
                 <span className="text-8xl font-chinese font-black text-chinese-red">{s.zh}</span>
                 <div>
                   <p className="text-2xl font-black text-purple-600 font-mono">{s.word}</p>
                   <p className="font-bold text-gray-400">{s.th}</p>
                 </div>
               </div>
               <div className="grid grid-cols-3 gap-3">
                 {Array.from({ length: 9 }).map((_, j) => (
                   <div key={j} className="aspect-square bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100 flex items-center justify-center text-4xl font-chinese text-gray-200 select-none opacity-20">
                     {s.zh}
                   </div>
                 ))}
               </div>
             </div>
           ))}
        </div>
      </section>

      <div className="flex justify-center pt-10">
        <button 
          onClick={() => setActiveActivity(ActivityType.PINYIN)}
          className="bg-purple-600 hover:bg-purple-700 text-white text-xl px-12 py-8 rounded-3xl font-black flex items-center shadow-lg transition-all hover:scale-105 active:scale-95"
        >
          ไปต่อกิจกรรมฝึกพินอิน (Next)
          <ChevronRight className="w-6 h-6 ml-2" />
        </button>
      </div>
    </div>
  );
};

const SummaryLesson3 = ({ lesson, setActiveActivity, speak }: { lesson: any, setActiveActivity: (type: ActivityType) => void, speak: (t: string, r?: number) => void }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [p1Answers, setP1Answers] = useState<Record<number, boolean>>({});
  const [p2Step, setP2Step] = useState(0);
  const [p2CurrentWords, setP2CurrentWords] = useState<string[]>([]);
  const [p3RandomIdx, setP3RandomIdx] = useState(0);
  const [showResult, setShowResult] = useState(false);

  // Part 1 Data
  const VEHICLES = [
    { zh: "飞机", py: "fēijī", th: "เครื่องบิน" },
    { zh: "火车", py: "huǒchē", th: "รถไฟ" },
    { zh: "自行车", py: "zìxíngchē", th: "รถจักรยาน" },
    { zh: "公交车", py: "gōngjiāochē", th: "รถโดยสารประจำทาง" },
    { zh: "校车", py: "xiàochē", th: "รถโรงเรียน" },
    { zh: "地铁", py: "dìtiě", th: "รถไฟฟ้าใต้ดิน" },
    { zh: "出租车", py: "chūzūchē", th: "รถแท็กซี่" },
    { zh: "摩托车", py: "mótuōchē", th: "รถจักรยานยนต์" },
    { zh: "走路", py: "zǒulù", th: "เดิน" }
  ];

  // Part 2 Data
  const SENTENCES = [
    { 
      original: ["你", "怎么", "去", "动物园"], 
      correct: "你怎么去动物园？", 
      py: "Nǐ zěnme qù dòngwùyuán?", 
      th: "เธอไปสวนสัตว์อย่างไร" 
    },
    { 
      original: ["我", "坐", "公交车", "去"], 
      correct: "我坐公交车去。", 
      py: "Wǒ zuò gōngjiāochē qù.", 
      th: "ฉันนั่งรถเมล์ไป" 
    },
    { 
      original: ["他", "坐", "飞机", "去", "北京"], 
      correct: "他坐飞机去北京。", 
      py: "Tā zuò fēijī qù Běijīng.", 
      th: "เขานั่งเครื่องบินไปปักกิ่ง" 
    },
    { 
      original: ["我", "走路", "来", "学校"], 
      correct: "我走路来学校。", 
      py: "Wǒ zǒulù lái xuéxiào.", 
      th: "ฉันเดินมาโรงเรียน" 
    }
  ];

  // Part 3 Data
  const Q3 = "你怎么去学校？ (Nǐ zěnme qù xuéxiào?)";
  const A3 = [
    "我坐校车去学校。",
    "我骑自行车去学校。",
    "我坐公交车去学校。",
    "我走路去学校。",
    "我坐汽车去学校。"
  ];

  const handleWordClick = (word: string) => {
    const nextWords = [...p2CurrentWords, word];
    setP2CurrentWords(nextWords);
    if (nextWords.join('') === SENTENCES[p2Step].correct.replace(/[?.。]/g, '')) {
      // Correct! Show full sentence briefly then move on
      setTimeout(() => {
        if (p2Step < SENTENCES.length - 1) {
          setP2Step(p2Step + 1);
          setP2CurrentWords([]);
        } else {
          setStep(3);
        }
      }, 1000);
    }
  };

  const shuffleWords = (words: string[]) => {
    return [...words].sort(() => Math.random() - 0.5);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="bg-chinese-red p-10 rounded-4xl shadow-xl space-y-4 relative overflow-hidden text-white">
        <div className="relative z-10">
          <h2 className="text-4xl font-black font-chinese">กิจกรรมท้ายบท (FINAL CHALLENGE)</h2>
          <p className="text-xl font-bold opacity-80">บทที่ 3: {lesson.title}</p>
          <div className="mt-4 flex gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className={cn("h-2 w-12 rounded-full transition-all", step >= i ? "bg-white" : "bg-white/20")} />
            ))}
          </div>
        </div>
        <Trophy className="absolute -right-8 -bottom-8 opacity-20 w-64 h-64 text-white" />
      </div>

      {/* เรียนอะไรมาบ้าง section */}
      <SummaryDetails data={{
        learned: [
          "เรียนคำศัพท์ยานพาหนะ เช่น 飞机, 火车, 自行车, 公ากุรถ, 地铁",
          "เรียนการถามว่าไปอย่างไรด้วย 你怎么去？",
          "เรียนการบอกวิธีเดินทางด้วย 坐, 骑 และ 走路"
        ],
        listening: [
          "ฟังคำศัพท์ยานพาหนะและวิธีเดินทาง",
          "ฟังประโยค 我坐公交车去。",
          "ฟังคำถาม 你怎么去动物园？"
        ],
        speaking: [
          "ฝึกถาม-ตอบว่าไปที่ไหนและไปอย่างไร",
          "ฝึกประโยค 我去动物园。 我坐公交车去。",
          "ฝึกพูดประโยค 他坐飞机去北京。"
        ],
        fun: [
          "จับคู่พินอินกับคำศัพท์ยานพาหนะ",
          "เกมแตะบัตรคำยานพาหนะกับสถานที่",
          "สัมภาษณ์เพื่อนว่า 你怎么来学校？"
        ],
        reading: [
          "อ่านเรื่องสั้นเกี่ยวกับสมาชิกครอบครัวเดินทางไปเรียนและทำงาน",
          "อ่านประโยคแล้วเลือกภาพที่ถูกต้อง",
          "ฝึกตอบ ✓ หรือ X จากเนื้อเรื่อง"
        ],
        writing: [
          "ฝึกเขียน 飞, 机, 坐, 骑, 走, 火, 地, 校",
          "เติมตัวอักษรจีนที่หายไปในประโยค",
          "ฝึกคัด 火 และ 坐"
        ],
        pinyin: [
          "ฝึกแยกเสียง l และ r",
          "อ่านคำศัพท์ เช่น hěn lěng, zǒulù, Zhōngguórén",
          "ฝึกพูดคำสัมผัสอักษร 小龙和小荣"
        ]
      }} />

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="text-center space-y-2">
              <h3 className="text-3xl font-black text-gray-900 leading-tight">1. เลือกยานพาหนะให้ถูกต้อง</h3>
              <p className="text-lg font-bold text-gray-500">ฟังเสียงหรือดูคำศัพท์ แล้วเลือกยานพาหนะที่ถูกต้อง</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {VEHICLES.map((v, i) => (
                <div key={i} className="bg-white p-6 rounded-4xl border-2 border-chinese-red/5 shadow-sm hover:border-chinese-red/20 transition-all text-center space-y-4">
                  <div className="flex justify-between items-center px-4">
                    <span className="text-2xl font-chinese font-black text-gray-800">{v.zh}</span>
                    <button onClick={() => speak(v.zh)} className="p-2 bg-chinese-red/10 text-chinese-red rounded-xl hover:bg-chinese-red hover:text-white transition-all">
                      <Volume2 size={20} />
                    </button>
                  </div>
                  <p className="text-chinese-gold font-bold italic">{v.py}</p>
                  <button 
                    onClick={() => setP1Answers(prev => ({ ...prev, [i]: true }))}
                    className={cn(
                      "w-full py-4 rounded-2xl font-black transition-all",
                      p1Answers[i] ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-500 hover:bg-chinese-red hover:text-white"
                    )}
                  >
                    {p1Answers[i] ? "ถูกต้อง ✨" : "เลือก"}
                  </button>
                </div>
              ))}
            </div>
            <div className="flex justify-center pt-8">
              <button 
                disabled={Object.keys(p1Answers).length < 9}
                onClick={() => setStep(2)}
                className={cn(
                  "px-12 py-6 rounded-3xl font-black text-xl shadow-xl transition-all flex items-center gap-3",
                  Object.keys(p1Answers).length >= 9 ? "bg-chinese-red text-white hover:scale-105" : "bg-gray-200 text-gray-400 cursor-not-allowed"
                )}
              >
                กิจกรรมต่อไป <ChevronRight />
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="text-center space-y-2">
              <h3 className="text-3xl font-black text-gray-900 leading-tight">2. เรียงประโยคให้ถูกต้อง</h3>
              <p className="text-lg font-bold text-gray-500">กดคำภาษาจีนให้เรียงเป็นประโยคที่ถูกต้อง ({p2Step + 1}/{SENTENCES.length})</p>
            </div>
            <div className="max-w-3xl mx-auto bg-white p-10 rounded-5xl border-4 border-chinese-red/10 shadow-2xl space-y-10">
               <div className="min-h-[100px] flex flex-wrap justify-center items-center gap-4 border-b-4 border-dashed border-gray-100 pb-10">
                  {p2CurrentWords.map((word, i) => (
                    <motion.div 
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="px-6 py-3 bg-chinese-red text-white rounded-2xl text-2xl font-chinese font-black"
                    >
                      {word}
                    </motion.div>
                  ))}
               </div>
               <div className="flex flex-wrap justify-center gap-4">
                  {shuffleWords(SENTENCES[p2Step].original).map((word, i) => (
                    <button 
                      key={`${p2Step}-${i}`}
                      disabled={p2CurrentWords.includes(word)}
                      onClick={() => handleWordClick(word)}
                      className={cn(
                        "px-8 py-4 rounded-3xl text-2xl font-chinese font-black transition-all shadow-lg active:scale-95",
                        p2CurrentWords.includes(word) ? "bg-gray-100 text-gray-300 pointer-events-none" : "bg-white border-2 border-chinese-red/20 text-gray-900 hover:bg-chinese-red hover:text-white"
                      )}
                    >
                      {word}
                    </button>
                  ))}
               </div>
               {p2CurrentWords.length > 0 && (
                 <div className="flex justify-center">
                    <button onClick={() => setP2CurrentWords([])} className="flex items-center gap-2 text-chinese-red font-black hover:underline">
                      <RotateCcw size={20} /> เริ่มใหม่
                    </button>
                 </div>
               )}
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="text-center space-y-2">
              <h3 className="text-3xl font-black text-gray-900 leading-tight">3. พูดตอบคำถาม</h3>
              <p className="text-lg font-bold text-gray-500">อ่านคำถาม แล้วกดสุ่มคำตอบเพื่อฝึกพูด</p>
            </div>
            <div className="max-w-2xl mx-auto space-y-8">
              <div className="bg-white p-8 rounded-5xl border-2 border-chinese-red/10 shadow-sm space-y-4">
                 <p className="text-chinese-red font-black uppercase text-sm tracking-widest">Question (คำถาม)</p>
                 <h4 className="text-4xl font-chinese font-black text-gray-900">你怎么去学校？</h4>
                 <div className="flex items-center gap-4">
                   <button onClick={() => speak("你怎么去学校？")} className="px-6 py-2 bg-chinese-red/10 text-chinese-red rounded-full font-black text-sm flex items-center gap-2 hover:bg-chinese-red hover:text-white transition-all">
                     <Volume2 size={16} /> ฟังคำถาม
                   </button>
                 </div>
              </div>
              <div className="bg-chinese-red p-10 rounded-5xl text-white shadow-2xl relative overflow-hidden group">
                 <p className="font-black uppercase text-sm tracking-widest opacity-70 mb-4">Random Answer (สุ่มคำตอบ)</p>
                 <AnimatePresence mode="wait">
                   <motion.div 
                     key={p3RandomIdx}
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     className="space-y-6"
                   >
                     <p className="text-5xl font-chinese font-black leading-tight">{A3[p3RandomIdx]}</p>
                     <div className="flex flex-wrap gap-4 pt-4">
                        <button onClick={() => speak(A3[p3RandomIdx])} className="px-8 py-3 bg-white text-chinese-red rounded-2xl font-black flex items-center gap-2 hover:scale-105 transition-all shadow-lg">
                          <Volume2 /> ฟังคำตอบ
                        </button>
                        <button className="px-8 py-3 bg-chinese-gold text-white rounded-2xl font-black flex items-center gap-2 hover:scale-105 transition-all shadow-lg">
                          <Mic /> พูดแล้ว
                        </button>
                     </div>
                   </motion.div>
                 </AnimatePresence>
                 <button 
                  onClick={() => setP3RandomIdx((p3RandomIdx + 1) % A3.length)}
                  className="absolute right-6 top-6 p-4 bg-white/20 rounded-full hover:bg-white/40 transition-all text-white group-hover:rotate-180 duration-500"
                 >
                   <Shuffle />
                 </button>
              </div>
              <div className="flex justify-center pt-8">
                <button 
                  onClick={() => setStep(4)}
                  className="px-12 py-6 bg-emerald-500 text-white rounded-3xl font-black text-xl shadow-xl hover:scale-105 transition-all flex items-center gap-3"
                >
                  สิ้นสุดภารกิจ <CheckCircle2 />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-10 space-y-8"
          >
             <div className="relative inline-block">
               <motion.div 
                 animate={{ rotate: [0, 10, -10, 0] }}
                 transition={{ repeat: Infinity, duration: 2 }}
                 className="bg-chinese-gold p-10 rounded-full shadow-2xl relative z-10"
               >
                 <Trophy className="w-24 h-24 text-white" />
               </motion.div>
               <motion.div 
                 animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                 transition={{ repeat: Infinity, duration: 2 }}
                 className="absolute inset-0 bg-chinese-gold rounded-full blur-2xl"
               />
             </div>
             <div className="bg-white p-12 rounded-5xl border-2 border-chinese-red/10 shadow-sm max-w-2xl mx-auto space-y-6">
                <h3 className="text-4xl font-black text-gray-900">เก่งมาก! เรียนจบบทที่ 3 แล้ว ✨</h3>
                <p className="text-xl font-bold text-gray-500">คุณได้เรียนรู้เรื่องยานพาหนะและการบอกวิธีเดินทางแล้ว!</p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                   <button onClick={() => setStep(1)} className="px-8 py-4 bg-orange-500 text-white rounded-3xl font-black shadow-lg hover:scale-105 transition-all">กลับไปทบทวน</button>
                   <button onClick={() => window.location.href = "/"} className="px-8 py-4 bg-gray-500 text-white rounded-3xl font-black shadow-lg hover:scale-105 transition-all">กลับหน้าแรก</button>
                   <button onClick={() => { window.scrollTo({ top: 0, behavior: 'instant' }); navigate('/lesson/4'); }} className="px-8 py-4 bg-chinese-red text-white rounded-3xl font-black shadow-lg hover:scale-105 transition-all">{"ไปบทที่ 4 >"}</button>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PinyinLesson4 = ({ 
  lesson, 
  pinyinSpeak, 
  pinyinSequenceSpeak, 
  setActiveActivity,
  playingText
}: { 
  lesson: any, 
  pinyinSpeak: (py: string, rate?: number) => void,
  pinyinSequenceSpeak: (list: string[], rate?: number) => void,
  setActiveActivity: (a: ActivityType) => void,
  playingText: string | null
}) => {
  const [progress, setProgress] = useState<Record<number, boolean>>({});

  const TONE_SETS = [
    ["gā", "gá", "gǎ", "gà"],
    ["kā", "ká", "kǎ", "kà"],
    ["hā", "há", "hǎ", "hà"],
    ["gē", "gé", "gě", "gè"],
    ["kē", "ké", "kě", "kè"],
    ["hē", "hé", "hě", "hè"]
  ];

  const WORDS = [
    { zh: "哥哥", py: "gēge", th: "พี่ชาย" },
    { zh: "忙", py: "máng", th: "ยุ่ง" },
    { zh: "妈妈", py: "māma", th: "แม่" },
    { zh: "喝水", py: "hē shuǐ", th: "ดื่มน้ำ" },
    { zh: "苦", py: "kǔ", th: "ขม" },
    { zh: "渴", py: "kě", th: "หิว (น้ำ)" }
  ];

  return (
    <div className="space-y-16 pb-20">
      <div className="bg-chinese-gold p-8 rounded-4xl text-white shadow-lg relative overflow-hidden">
        <h3 className="text-3xl font-black mb-2 uppercase tracking-tight">ฝึกพินอิน (PINYIN) - g k h</h3>
        <p className="font-bold opacity-90">บทที่ 4: {lesson.title}</p>
        <Star className="w-48 h-48 absolute -right-12 -bottom-12 text-white/10 rotate-12" />
      </div>

      <section className="space-y-8">
        <h4 className="text-2xl font-black text-gray-900 border-l-8 border-chinese-gold pl-4">1. ฝึกอ่านออกเสียง g k h</h4>
        <div className="bg-white p-8 rounded-5xl border-2 border-chinese-gold/10 shadow-sm overflow-x-auto">
          <table className="w-full text-center">
            <tbody>
              {TONE_SETS.map((row, i) => (
                <tr key={i} className="hover:bg-chinese-gold/5 transition-colors group/row">
                  {row.map((cell, j) => (
                    <td key={j} className="p-4 border-b border-gray-50">
                      <button 
                        onClick={() => pinyinSpeak(cell)} 
                        className={cn(
                          "text-2xl font-mono font-black transition-colors rounded-xl p-2",
                          playingText === cell ? "text-chinese-gold bg-chinese-gold/10 scale-110" : "text-gray-700 hover:text-chinese-gold"
                        )}
                      >
                        {cell}
                      </button>
                    </td>
                  ))}
                  <td className="p-2 border-b border-gray-50 opacity-0 group-hover/row:opacity-100 transition-opacity">
                    <button 
                      onClick={() => pinyinSequenceSpeak(row)}
                      className="p-3 bg-chinese-gold text-white rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-md"
                    >
                      <Volume2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="flex justify-center pt-4">
        <button 
          onClick={() => setProgress(prev => ({ ...prev, 1: true }))}
          className={cn(
            "px-10 py-4 rounded-3xl font-black transition-all shadow-lg text-white",
            progress[1] ? "bg-emerald-500" : "bg-blue-500 hover:scale-105"
          )}
        >
          {progress[1] ? "เสร็จแล้ว ✨" : "ทำเครื่องหมายว่าเสร็จแล้ว"}
        </button>
      </div>
      
      <div className="flex justify-center pt-10">
        <button 
          onClick={() => setActiveActivity(ActivityType.FUN)}
          className="bg-chinese-gold hover:bg-yellow-600 text-white text-xl px-12 py-8 rounded-3xl font-black flex items-center shadow-lg transition-all hover:scale-105 active:scale-95"
        >
          ไปต่อกิจกรรมแสนสนุก (Next)
          <ChevronRight className="w-6 h-6 ml-2" />
        </button>
      </div>
    </div>
  );
};

const ReadingLesson4 = ({ lesson, speak, setActiveActivity }: { lesson: any, speak: (t: string) => void, setActiveActivity: (a: ActivityType) => void }) => {
  const [progress, setProgress] = useState<Record<number, boolean>>({});

  return (
    <div className="space-y-16 pb-20">
      <div className="bg-chinese-red p-8 rounded-4xl text-white shadow-lg relative overflow-hidden">
        <h3 className="text-3xl font-black mb-2 uppercase tracking-tight">ฝึกอ่าน (READING)</h3>
        <p className="font-bold opacity-90">บทที่ 4: {lesson.title}</p>
        <BookOpen className="w-48 h-48 absolute -right-12 -bottom-12 text-white/10 rotate-12" />
      </div>

      <section className="space-y-8">
        <h4 className="text-2xl font-black text-gray-900 border-l-8 border-chinese-red pl-4">ฝึกสนทนา (Dialogue)</h4>
        <div className="space-y-6">
          {lesson.dialogues.map((d: any, i: number) => (
            <div key={i} className="bg-white p-8 rounded-4xl border-2 border-chinese-red/5 shadow-sm hover:border-chinese-red/20 transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-chinese-red rounded-2xl flex items-center justify-center text-white font-black">{d.role[0]}</div>
                <span className="font-black text-gray-900">{d.role}</span>
              </div>
              <p className="text-4xl font-chinese font-black text-gray-900 mb-2">{d.text}</p>
              <p className="text-xl font-mono font-bold text-chinese-red mb-1">{d.pinyin}</p>
              <p className="text-lg text-gray-400 font-bold">{d.translation}</p>
              <button 
                onClick={() => speak(d.text)}
                className="mt-6 flex items-center gap-2 px-6 py-2 bg-chinese-red/10 text-chinese-red rounded-full font-black text-sm hover:bg-chinese-red hover:text-white transition-all"
              >
                <Volume2 size={16} /> ฟังเสียง
              </button>
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-center pt-8">
        <button 
          onClick={() => setActiveActivity(ActivityType.WRITING)}
          className="bg-chinese-gold hover:bg-yellow-600 text-white text-xl px-12 py-8 rounded-3xl font-black flex items-center shadow-lg transition-all hover:scale-105 active:scale-95"
        >
          ไปต่อกิจกรรมฝึกเขียน (Next)
          <ChevronRight className="w-6 h-6 ml-2" />
        </button>
      </div>
    </div>
  );
};

const WritingLesson4 = ({ lesson, speak, setActiveActivity }: { lesson: any, speak: (t: string) => void, setActiveActivity: (a: ActivityType) => void }) => {
  const [progress, setProgress] = useState<Record<number, boolean>>({});
  const completedCount = Object.values(progress).filter(Boolean).length;
  const isFinished = completedCount >= 4;

  const chars = ["爸", "妈", "医", "生"];
  const meanings = ["พ่อ", "แม่", "หมอ/การแพทย์", "เกิด/ชีวิต"];

  return (
    <div className="space-y-12 pb-20">
      <div className="bg-purple-500 p-8 rounded-4xl text-white shadow-lg relative overflow-hidden">
        <h3 className="text-3xl font-black mb-2 uppercase tracking-tight">กิจกรรมฝึกเขียน (WRITING)</h3>
        <p className="font-bold opacity-90">บทที่ 4: {lesson.title}</p>
        <Zap className="w-48 h-48 absolute -right-12 -bottom-12 text-white/10 rotate-12" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {chars.map((char, idx) => (
          <div key={idx} className="bg-white p-8 rounded-5xl border-2 border-purple-100 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-6xl font-chinese font-black text-gray-900">{char}</span>
                <p className="text-xl font-bold text-purple-600 mt-2">{meanings[idx]}</p>
              </div>
              <button onClick={() => speak(char)} className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center hover:bg-purple-600 hover:text-white transition-all shadow-sm">
                <Volume2 />
              </button>
            </div>
            <div className="p-10 bg-gray-50 rounded-4xl border-4 border-dashed border-gray-200 flex justify-center">
              <div className="relative w-32 h-32 bg-white border-2 border-gray-300 flex items-center justify-center text-7xl font-chinese text-gray-100">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-black border-t border-dashed" />
                  <div className="absolute left-1/2 top-0 bottom-0 w-px bg-black border-l border-dashed" />
                </div>
                {char}
              </div>
            </div>
            <button 
              onClick={() => setProgress(p => ({ ...p, [idx]: true }))}
              className={cn(
                "w-full py-4 rounded-2xl font-black transition-all shadow-sm",
                progress[idx] ? "bg-emerald-500 text-white" : "bg-purple-100 text-purple-600 hover:bg-purple-600 hover:text-white"
              )}
            >
              {progress[idx] ? "เขียนแล้ว ✨" : "ทำเครื่องหมายว่าเขียนแล้ว"}
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-center pt-8">
        <button 
          onClick={() => setActiveActivity(ActivityType.FINAL)}
          className="bg-chinese-gold hover:bg-yellow-600 text-white text-xl px-12 py-8 rounded-3xl font-black flex items-center shadow-lg transition-all hover:scale-105 active:scale-95"
        >
          สรุปบทเรียน (Summary)
          <ChevronRight className="w-6 h-6 ml-2" />
        </button>
      </div>
    </div>
  );
};

const SummaryLesson4 = ({ lesson, setActiveActivity, speak }: { lesson: any, setActiveActivity: (type: ActivityType) => void, speak: (t: string, r?: number) => void }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [p1Answers, setP1Answers] = useState<Record<number, boolean>>({});
  const [p2Answers, setP2Answers] = useState<Record<number, string>>({});
  const [p3RandomIdx, setP3RandomIdx] = useState(0);
  const [p3Toggle, setP3Toggle] = useState(false); // Toggle between dad and mom

  // Part 1 Data
  const JOBS = [
    { zh: "警察", py: "jǐngchá", th: "ตำรวจ" },
    { zh: "厨师", py: "chúshī", th: "พ่อครัว/แม่ครัว" },
    { zh: "司机", py: "sījī", th: "คนขับรถ" },
    { zh: "公务员", py: "gōngwùyuán", th: "ข้าราชการ" },
    { zh: "医生", py: "yīshēng", th: "หมอ" },
    { zh: "护士", py: "hùshi", th: "พยาบาล" },
    { zh: "职员", py: "zhíyuán", th: "พนักงานบริษัท" },
    { zh: "全职妈妈", py: "quánzhí māma", th: "แม่บ้าน" },
    { zh: "老师", py: "lǎoshī", th: "ครู" }
  ];

  // Part 2 Data
  const FILL_SENTENCES = [
    { q: "他是一名____。", a: "职员", py: "Tā shì yì míng zhíyuán.", th: "เขาเป็นพนักงานบริษัทหนึ่งคน" },
    { q: "她是一名____。", a: "老师", py: "Tā shì yì míng lǎoshī.", th: "เธอเป็นครูหนึ่งคน" },
    { q: "我爸爸是____。", a: "司机", py: "Wǒ bàba shì sījī.", th: "พ่อของฉันเป็นคนขับรถ" },
    { q: "我妈妈是一名____。", a: "全职妈妈", py: "Wǒ māma shì yì míng quánzhí māma.", th: "แม่ของฉันเป็นแม่บ้าน" },
    { q: "哥哥是一名____。", a: "警察", py: "Gēge shì yì míng jǐngchá.", th: "พี่ชายเป็นตำรวจหนึ่งคน" }
  ];

  // Part 3 Data
  const QSPEAK = [
    { q: "你爸爸做什么工作？", py: "Nǐ bàba zuò shénme gōngzuò?", th: "พ่อทำงานอะไร", role: "爸爸" },
    { q: "你妈妈做什么工作？", py: "Nǐ māma zuò shénme gōngzuò?", th: "แม่ทำงานอะไร", role: "妈妈" }
  ];
  
  const ANSWERS_LESSON4 = [
    "他是一名职员。",
    "她是一名老师。",
    "他是一名医生。",
    "她是一名护士。",
    "他是一名警察。"
  ];

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="bg-chinese-red p-10 rounded-4xl shadow-xl space-y-4 relative overflow-hidden text-white">
        <div className="relative z-10">
          <h2 className="text-4xl font-black font-chinese">กิจกรรมท้ายบท (FINAL CHALLENGE)</h2>
          <p className="text-xl font-bold opacity-80">บทที่ 4: {lesson.title}</p>
          <div className="mt-4 flex gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className={cn("h-2 w-12 rounded-full transition-all", step >= i ? "bg-white" : "bg-white/20")} />
            ))}
          </div>
        </div>
        <Trophy className="absolute -right-8 -bottom-8 opacity-20 w-64 h-64 text-white" />
      </div>

      {/* เรียนอะไรมาบ้าง section */}
      <SummaryDetails data={{
        learned: [
          "เรียนคำศัพท์อาชีพ เช่น 警察, 厨师, 司机, 医生, 护士, 职员",
          "เรียนการถามอาชีพด้วย 做什么工作？",
          "เรียนการบอกอาชีพด้วย 他/她是一名..."
        ],
        listening: [
          "ฟังคำศัพท์อาชีพ",
          "ฟังประโยค 他是一名职员。",
          "ฟังคำถาม 你爸爸做什么工作？"
        ],
        speaking: [
          "ฝึกถาม-ตอบเกี่ยวกับอาชีพของพ่อแม่",
          "ฝึกประโยค 他是一名警察。",
          "ฝึกพูดว่า 工作非常忙。"
        ],
        fun: [
          "จับคู่พินอินกับคำศัพท์อาชีพ",
          "ดูภาพแล้วตอบว่าแต่ละคนทำงานอะไร",
          "เกมแสดงท่าทางอาชีพแล้วให้เพื่อนทาย"
        ],
        reading: [
          "อ่านเรื่องสั้นเกี่ยวกับครอบครัวและอาชีพ",
          "อ่านประโยคแล้วเลือกภาพที่ถูกต้อง",
          "ตอบ ✓ หรือ X จากเรื่องอ่าน"
        ],
        writing: [
          "ฝึกเขียน 工, 作, 师, 员, 医",
          "เติมตัวอักษรจีนในคำศัพท์อาชีพ",
          "ฝึกคัด 工 และ 作"
        ],
        pinyin: [
          "ฝึกแยกเสียง zh/ch/sh กับ z/c/s",
          "อ่านคำศัพท์ เช่น zhíyuán, jǐngchá, chúshī",
          "ฝึกพูดคำสัมผัสอักษร 有个小孩子"
        ]
      }} />

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="text-center space-y-2">
              <h3 className="text-3xl font-black text-gray-900 leading-tight">1. เลือกอาชีพให้ถูกต้อง</h3>
              <p className="text-lg font-bold text-gray-500">ฟังเสียงหรือดูคำศัพท์ แล้วเลือกอาชีพที่ถูกต้อง</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {JOBS.map((j, i) => (
                <div key={i} className="bg-white p-6 rounded-4xl border-2 border-chinese-red/5 shadow-sm hover:border-chinese-red/20 transition-all text-center space-y-4">
                  <div className="flex justify-between items-center px-4">
                    <span className="text-2xl font-chinese font-black text-gray-800">{j.zh}</span>
                    <button onClick={() => speak(j.zh)} className="p-2 bg-chinese-red/10 text-chinese-red rounded-xl hover:bg-chinese-red hover:text-white transition-all">
                      <Volume2 size={20} />
                    </button>
                  </div>
                  <p className="text-chinese-gold font-bold italic">{j.py}</p>
                  <button 
                    onClick={() => setP1Answers(prev => ({ ...prev, [i]: true }))}
                    className={cn(
                      "w-full py-4 rounded-2xl font-black transition-all",
                      p1Answers[i] ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-500 hover:bg-chinese-red hover:text-white"
                    )}
                  >
                    {p1Answers[i] ? "ถูกต้อง ✨" : "เลือก"}
                  </button>
                </div>
              ))}
            </div>
            <div className="flex justify-center pt-8">
              <button 
                disabled={Object.keys(p1Answers).length < 9}
                onClick={() => setStep(2)}
                className={cn(
                  "px-12 py-6 rounded-3xl font-black text-xl shadow-xl transition-all flex items-center gap-3",
                  Object.keys(p1Answers).length >= 9 ? "bg-chinese-red text-white hover:scale-105" : "bg-gray-200 text-gray-400 cursor-not-allowed"
                )}
              >
                กิจกรรมต่อไป <ChevronRight />
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="text-center space-y-2">
              <h3 className="text-3xl font-black text-gray-900 leading-tight">2. เติมประโยคให้สมบูรณ์</h3>
              <p className="text-lg font-bold text-gray-500">เลือกคำศัพท์มาเติมในช่องว่างให้ถูกต้อง</p>
            </div>
            <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto">
              {FILL_SENTENCES.map((s, idx) => (
                <div key={idx} className="bg-white p-8 rounded-4xl border-2 border-chinese-red/5 shadow-sm space-y-6">
                  <div className="flex flex-wrap items-center gap-4 text-3xl font-chinese font-black text-gray-900">
                    <span>{s.q.split('____')[0]}</span>
                    <div className={cn(
                      "min-w-[120px] h-14 border-b-4 border-dashed border-chinese-red/30 flex items-center justify-center text-chinese-red",
                      p2Answers[idx] && "border-solid border-emerald-500 text-emerald-600"
                    )}>
                      {p2Answers[idx] || ""}
                    </div>
                    <span>{s.q.split('____')[1]}</span>
                  </div>
                  {p2Answers[idx] && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1 relative group/ans">
                      <p className="text-xl font-mono text-chinese-red">{s.py}</p>
                      <p className="text-lg text-gray-400">{s.th}</p>
                      <button 
                        onClick={() => speak(s.q.replace('____', s.a))}
                        className="absolute right-0 top-0 p-2 bg-chinese-red/10 text-chinese-red rounded-xl opacity-0 group-hover/ans:opacity-100 transition-all hover:bg-chinese-red hover:text-white"
                      >
                        <Volume2 size={16} />
                      </button>
                    </motion.div>
                  )}
                  {!p2Answers[idx] && (
                    <div className="flex flex-wrap gap-2 pt-4">
                      {["职员", "老师", "司机", "全职妈妈", "警察"].map(choice => (
                        <button 
                          key={choice}
                          onClick={() => {
                            if (choice === s.a) setP2Answers(v => ({ ...v, [idx]: choice }));
                            else {
                               // Shake effect could be here
                            }
                          }}
                          className="px-6 py-2 bg-gray-50 border-2 border-gray-100 rounded-2xl font-black hover:border-chinese-red transition-all"
                        >
                          {choice}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-center pt-8">
              <button 
                disabled={Object.keys(p2Answers).length < 5}
                onClick={() => setStep(3)}
                className={cn(
                  "px-12 py-6 rounded-3xl font-black text-xl shadow-xl transition-all flex items-center gap-3",
                  Object.keys(p2Answers).length >= 5 ? "bg-chinese-red text-white hover:scale-105" : "bg-gray-200 text-gray-400 cursor-not-allowed"
                )}
              >
                กิจกรรมต่อไป <ChevronRight />
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="text-center space-y-2">
              <h3 className="text-3xl font-black text-gray-900 leading-tight">3. พูดตอบคำถาม</h3>
              <p className="text-lg font-bold text-gray-500">อ่านคำถาม แล้วพูดตอบตามอาชีพที่สุ่มได้</p>
            </div>
            <div className="max-w-2xl mx-auto space-y-8">
              <div className="bg-white p-8 rounded-5xl border-2 border-chinese-red/10 shadow-sm space-y-4">
                 <p className="text-chinese-red font-black uppercase text-sm tracking-widest">Question ({p3Toggle ? "แม่" : "พ่อ"})</p>
                 <h4 className="text-4xl font-chinese font-black text-gray-900">
                   {p3Toggle ? "你妈妈做什么工作？" : "你爸爸做什么工作？"}
                 </h4>
                 <div className="flex gap-4">
                   <button onClick={() => speak(p3Toggle ? "你妈妈做什么工作？" : "你爸爸做什么工作？")} className="px-6 py-2 bg-chinese-red/10 text-chinese-red rounded-full font-black text-sm flex items-center gap-2 hover:bg-chinese-red hover:text-white transition-all">
                     <Volume2 size={16} /> ฟังคำถาม
                   </button>
                   <button onClick={() => setP3Toggle(!p3Toggle)} className="px-6 py-2 bg-chinese-gold text-white rounded-full font-black text-sm flex items-center gap-2 shadow-md">
                     <RefreshCw size={14} /> สลับถามพ่อ/แม่
                   </button>
                 </div>
              </div>
              <div className="bg-chinese-red p-10 rounded-5xl text-white shadow-2xl relative overflow-hidden group">
                 <p className="font-black uppercase text-sm tracking-widest opacity-70 mb-4">Random Result (สุ่มอาชีพ)</p>
                 <AnimatePresence mode="wait">
                   <motion.div 
                     key={`${p3Toggle}-${p3RandomIdx}`}
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     className="space-y-6"
                   >
                     <p className="text-5xl font-chinese font-black leading-tight">
                       {p3Toggle ? "她是一名" : "他是一名"}{JOBS[p3RandomIdx].zh}。
                     </p>
                     <div className="flex flex-wrap gap-4 pt-4">
                        <button onClick={() => speak(p3Toggle ? `她是一名${JOBS[p3RandomIdx].zh}。` : `他是一名${JOBS[p3RandomIdx].zh}。`)} className="px-8 py-3 bg-white text-chinese-red rounded-2xl font-black flex items-center gap-2 hover:scale-105 transition-all shadow-lg">
                          <Volume2 /> ฟังคำตอบ
                        </button>
                        <button className="px-8 py-3 bg-chinese-gold text-white rounded-2xl font-black flex items-center gap-2 hover:scale-105 transition-all shadow-lg">
                          <Mic /> พูดแล้ว
                        </button>
                     </div>
                   </motion.div>
                 </AnimatePresence>
                 <button 
                  onClick={() => setP3RandomIdx(Math.floor(Math.random() * JOBS.length))}
                  className="absolute right-6 top-6 p-4 bg-white/20 rounded-full hover:bg-white/40 transition-all text-white group-hover:rotate-180 duration-500"
                 >
                   <Shuffle />
                 </button>
              </div>
              <div className="flex justify-center pt-8">
                <button 
                  onClick={() => setStep(4)}
                  className="px-12 py-6 bg-emerald-500 text-white rounded-3xl font-black text-xl shadow-xl hover:scale-105 transition-all flex items-center gap-3"
                >
                  สิ้นสุดภารกิจ <CheckCircle2 />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-10 space-y-8"
          >
             <div className="relative inline-block">
               <motion.div 
                 animate={{ rotate: [0, 10, -10, 0] }}
                 transition={{ repeat: Infinity, duration: 2 }}
                 className="bg-chinese-gold p-10 rounded-full shadow-2xl relative z-10"
               >
                 <Trophy className="w-24 h-24 text-white" />
               </motion.div>
               <motion.div 
                 animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                 transition={{ repeat: Infinity, duration: 2 }}
                 className="absolute inset-0 bg-chinese-gold rounded-full blur-2xl"
               />
             </div>
             <div className="bg-white p-12 rounded-5xl border-2 border-chinese-red/10 shadow-sm max-w-2xl mx-auto space-y-6">
                <h3 className="text-4xl font-black text-gray-900">เก่งมาก! เรียนจบบทที่ 4 แล้ว ✨</h3>
                <p className="text-xl font-bold text-gray-500">คุณได้เรียนรู้เกี่ยวกับสมาชิกในครอบครัวและอาชีพต่างๆ แล้ว!</p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                   <button onClick={() => setStep(1)} className="px-8 py-4 bg-orange-500 text-white rounded-3xl font-black shadow-lg hover:scale-105 transition-all">กลับไปทบทวน</button>
                   <button onClick={() => window.location.href = "/"} className="px-8 py-4 bg-gray-500 text-white rounded-3xl font-black shadow-lg hover:scale-105 transition-all">กลับหน้าแรก</button>
                   <button onClick={() => { window.scrollTo({ top: 0, behavior: 'instant' }); navigate('/lesson/5'); }} className="px-8 py-4 bg-chinese-red text-white rounded-3xl font-black shadow-lg hover:scale-105 transition-all">{"ไปบทที่ 5 >"}</button>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FunLesson4 = ({ lesson, speak, setActiveActivity }: { lesson: any, speak: (t: string) => void, setActiveActivity: (a: ActivityType) => void }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center min-h-[600px] text-center space-y-8 bg-gradient-to-b from-chinese-gold/5 to-white rounded-4xl border-4 border-chinese-gold/10">
       <div className="relative">
          <div className="bg-chinese-gold text-white w-24 h-24 rounded-full flex items-center justify-center font-black animate-bounce shadow-lg text-5xl">
            🏆
          </div>
       </div>
       <div className="space-y-2 px-6">
         <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">ท้าทายคำศัพท์! (VOCAB CHALLENGE)</h2>
         <p className="text-lg md:text-xl font-bold text-chinese-gold-dark">สมาชิกในครอบครัวและอาชีพต่างๆ</p>
       </div>
       
       <div className="grid grid-cols-2 md:grid-cols-3 gap-6 p-6">
         {lesson.vocabulary.slice(0, 6).map((v: any, i: number) => (
           <button 
             key={i}
             onClick={() => speak(v.word)}
             className="w-32 h-32 bg-white rounded-3xl border-4 border-chinese-gold/20 flex flex-col items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl group"
           >
             <span className="text-3xl font-chinese font-black text-gray-800 group-hover:text-chinese-gold">{v.word}</span>
             <Volume2 className="text-chinese-gold opacity-40" size={20} />
           </button>
         ))}
       </div>
       
       <div className="flex flex-col items-center gap-6">
          <button 
            onClick={() => setActiveActivity(ActivityType.PINYIN)}
            className="bg-chinese-gold text-white text-xl px-16 py-6 rounded-3xl font-black shadow-xl hover:scale-105 transition-all"
          >
             ไปท้าทายพินอินต่อ! (NEXT)
          </button>
       </div>
    </div>
  );
};

const ListeningLesson5 = ({ lesson, speak }: { lesson: any, speak: (t: string) => void }) => {
  const vocabIcons: Record<string, string> = {
    "跑步": "🏃",
    "打电话": "📞",
    "上网": "🌐",
    "玩游戏": "🎮",
    "写作业": "📝",
    "洗衣服": "🧺",
    "学习": "📖",
    "看电视": "📺",
    "扫地": "🧹",
    "做饭": "🍳",
    "看书": "📚",
    "睡觉": "😴",
    "画画": "🎨",
    "游泳": "🏊",
    "弹钢琴": "🎹",
    "在": "⏳"
  };

  return (
    <div className="space-y-12 pb-20">
      <div className="bg-orange-500 p-8 rounded-4xl text-white shadow-lg relative overflow-hidden">
        <h3 className="text-3xl font-black mb-2 uppercase tracking-tight">กิจกรรมการฟัง (LISTENING)</h3>
        <p className="font-bold opacity-90">บทที่ 5: {lesson.title}</p>
        <Volume2 className="w-48 h-48 absolute -right-12 -bottom-12 text-white/10 rotate-12" />
      </div>

      <div className="bg-white p-8 rounded-4xl border-2 border-orange-100 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <Sparkles className="text-orange-500" />
          <h4 className="text-xl font-black text-gray-900">ฟังเสียงคำศัพท์แล้วพูดตาม</h4>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {lesson.vocabulary.map((v: any, i: number) => (
            <motion.div 
              key={`listen-5-${i}`}
              whileHover={{ y: -5 }}
              className="bg-gray-50 p-6 rounded-3xl border-2 border-transparent hover:border-orange-200 transition-all text-center space-y-4 group"
            >
              <div className="w-16 h-16 bg-white rounded-2xl mx-auto flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform text-4xl">
                {vocabIcons[v.word] || "🔊"}
              </div>
              <div>
                <p className="text-3xl font-chinese font-black text-gray-900">{v.word}</p>
                <p className="text-orange-600 font-bold italic text-sm">{v.pinyin}</p>
                <p className="text-xs text-gray-400 font-bold">{v.translation}</p>
              </div>
              <button 
                onClick={() => speak(v.word)}
                className="w-full py-3 bg-orange-500 text-white rounded-xl font-black text-sm shadow-md hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
              >
                <Volume2 size={16} /> ฟังเสียง
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const SpeakingLesson5 = ({ lesson, speak }: { lesson: any, speak: (t: string, r?: number) => void }) => {
  return (
    <div className="space-y-12 pb-20">
      <div className="bg-emerald-500 p-8 rounded-4xl text-white shadow-lg relative overflow-hidden">
         <div className="relative z-10">
            <h3 className="text-3xl font-black leading-tight mb-2">กิจกรรมการพูด (SPEAKING)</h3>
            <p className="text-emerald-100 font-bold">บทที่ 5: {lesson.title}</p>
         </div>
         <Mic className="w-48 h-48 absolute -right-12 -bottom-12 text-white/10 rotate-12" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lesson.vocabulary.slice(0, 9).map((v: any, i: number) => (
          <div key={`speak-5-${i}`} className="bg-white p-8 rounded-[2.5rem] border-2 border-gray-50 shadow-sm flex flex-col items-center gap-6 hover:border-emerald-200 transition-all">
            <div className="text-5xl font-black font-chinese text-gray-900">{v.word}</div>
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-600 mb-1">{v.pinyin}</p>
              <p className="text-gray-400 font-bold">{v.translation}</p>
            </div>
            <div className="flex gap-3 w-full">
              <button onClick={() => speak(v.word)} className="flex-1 py-4 bg-emerald-50 text-emerald-600 rounded-2xl font-black hover:bg-emerald-600 hover:text-white transition-all shadow-sm flex items-center justify-center gap-2">
                <Volume2 size={20} /> ฟัง
              </button>
              <button className="flex-1 py-4 bg-gray-50 text-gray-400 rounded-2xl font-black hover:bg-chinese-gold hover:text-white transition-all shadow-sm flex items-center justify-center gap-2">
                <Mic size={20} /> ฝึกพูด
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ReadingLesson5 = ({ lesson, speak, setActiveActivity }: { lesson: any, speak: (t: string) => void, setActiveActivity: (a: ActivityType) => void }) => {
  const [completed, setCompleted] = useState<Record<number, boolean>>({});
  
  const sentences = [
    { zh: "他在跑步。", py: "Tā zài pǎobù.", th: "เขากำลังวิ่งจ็อกกิงอยู่" },
    { zh: "妹妹在打电话。", py: "Mèimei zài dǎ diànhuà.", th: "น้องสาวกำลังโทรศัพท์อยู่" },
    { zh: "弟弟在上网。", py: "Dìdi zài shàngwǎng.", th: "น้องชายกำลังเล่นอินเทอร์เน็ตอยู่" },
    { zh: "爸爸在看电视。", py: "Bàba zài kàn diànshì.", th: "พ่อกำลังดูโทรทัศน์อยู่" },
    { zh: "妈妈在洗衣服。", py: "Māma zài xǐ yīfu.", th: "แม่กำลังซักผ้าอยู่" },
    { zh: "哥哥在写作业。", py: "Gēge zài xiě zuòyè.", th: "พี่ชายกำลังทำการบ้านอยู่" },
    { zh: "奶奶在扫地。", py: "Nǎinai zài sǎodì.", th: "ย่ากำลังกวาดบ้านอยู่" },
    { zh: "爷爷在看书。", py: "Yéye zài kàn shū.", th: "ปู่กำลังอ่านหนังสืออยู่" }
  ];

  const completedCount = Object.values(completed).filter(Boolean).length;
  const isFinished = completedCount === sentences.length;

  return (
    <div className="space-y-12 pb-20">
      <div className="bg-blue-500 p-8 rounded-4xl text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-3xl font-black mb-2 uppercase tracking-tight">กิจกรรมฝึกอ่าน (READING)</h3>
          <p className="font-bold opacity-90">บทที่ 5: {lesson.title}</p>
          <div className="mt-4 bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/30 inline-block font-bold">
            คำสั่ง: ฟังเสียงประโยคแล้วอ่านตาม
          </div>
        </div>
        <BookOpen className="w-48 h-48 absolute -right-12 -bottom-12 text-white/10 rotate-12" />
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="w-full max-w-md bg-white border-4 border-blue-100 rounded-3xl p-6 shadow-sm">
          <div className="flex justify-between items-end mb-2 h-8">
            <span className="font-black text-blue-600 text-lg">อ่านแล้ว {completedCount}/{sentences.length}</span>
            {isFinished && <span className="text-emerald-500 font-black text-sm">ยอดเยี่ยมมาก! ✨</span>}
          </div>
          <div className="h-4 bg-blue-50 rounded-full overflow-hidden border-2 border-blue-100">
            <motion.div 
              className="h-full bg-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / sentences.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sentences.map((item, idx) => (
          <motion.div 
            key={`reading-5-${idx}`}
            className={cn(
              "bg-white p-8 rounded-[2.5rem] border-4 transition-all relative overflow-hidden",
              completed[idx] ? "border-emerald-400 shadow-lg" : "border-blue-50 hover:border-blue-200"
            )}
          >
            <div className="mb-6">
              <span className="bg-blue-50 text-blue-400 w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm mb-4">{idx + 1}</span>
              <div className="min-h-[160px] flex flex-col justify-center">
                <h4 className="text-4xl font-chinese font-black text-gray-900 mb-2 leading-tight">{item.zh}</h4>
                <p className="text-xl font-bold text-blue-600 tracking-wider mb-2">{item.py}</p>
                <p className="text-gray-400 font-bold">{item.th}</p>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => { speak(item.zh); setCompleted(prev => ({ ...prev, [idx]: true })); }} className="flex-1 py-4 bg-blue-50 text-blue-600 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-blue-500 hover:text-white transition-all shadow-sm">
                <Volume2 className="w-5 h-5" /> ฟังเสียง
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center pt-10">
        <button 
          onClick={() => setActiveActivity(ActivityType.WRITING)}
          className="bg-chinese-gold hover:bg-yellow-600 text-white text-xl px-12 py-8 rounded-3xl font-black flex items-center shadow-lg transition-all"
        >
          ไปต่อกิจกรรมฝึกเขียน (Next)
          <ChevronRight className="w-6 h-6 ml-2" />
        </button>
      </div>
    </div>
  );
};

const WritingLesson5 = ({ lesson, speak, setActiveActivity }: { lesson: any, speak: (t: string) => void, setActiveActivity: (a: ActivityType) => void }) => {
  const [progress, setProgress] = useState<Record<number, boolean>>({});
  const completedCount = Object.values(progress).filter(Boolean).length;
  const isFinished = completedCount === 4;

  const characters = [
    { zh: "在", py: "zài", th: "กำลัง..." },
    { zh: "跑", py: "pǎo", th: "วิ่ง" },
    { zh: "打", py: "dǎ", th: "ตี/ทำสาย" },
    { zh: "书", py: "shū", th: "หนังสือ" }
  ];

  return (
    <div className="space-y-12 pb-20">
      <div className="bg-purple-500 p-8 rounded-4xl text-white shadow-lg relative overflow-hidden">
        <h3 className="text-3xl font-black mb-2 uppercase tracking-tight">กิจกรรมฝึกเขียน (WRITING)</h3>
        <p className="font-bold opacity-90">บทที่ 5: {lesson.title}</p>
        <Zap className="w-48 h-48 absolute -right-12 -bottom-12 text-white/10 rotate-12" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {characters.map((c, idx) => (
          <div key={`writing-5-${idx}`} className="bg-white p-8 rounded-[2.5rem] border-2 border-gray-100 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
               <div className="flex gap-4 items-center">
                  <div className="w-20 h-20 bg-purple-50 rounded-2xl flex items-center justify-center font-chinese text-5xl text-gray-900 border-2 border-purple-100">{c.zh}</div>
                  <div><p className="text-2xl font-black text-purple-600">{c.py}</p><p className="text-sm font-bold text-gray-400">{c.th}</p></div>
               </div>
               <button onClick={() => speak(c.zh)} className="w-10 h-10 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center shadow-sm"><Volume2 className="w-5 h-5" /></button>
            </div>
            <div className="flex justify-center p-4 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
               <div className="relative w-24 h-24 bg-white border-2 border-gray-200 rounded-md flex items-center justify-center font-chinese text-5xl overflow-hidden">
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-black border-t border-dashed" />
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-black border-l border-dashed" />
                  </div>
                  <span className="text-gray-100">{c.zh}</span>
               </div>
            </div>
            <button onClick={() => setProgress(prev => ({ ...prev, [idx]: true }))} className={cn("w-full py-4 rounded-2xl font-black transition-all", progress[idx] ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-400 hover:bg-purple-600 hover:text-white")}>
              {progress[idx] ? "เขียนแล้ว ✨" : "ฝึกเขียน"}
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-center pt-10">
        <button 
          onClick={() => setActiveActivity(ActivityType.PINYIN)}
          className="bg-chinese-gold hover:bg-yellow-600 text-white text-xl px-12 py-8 rounded-3xl font-black flex items-center shadow-lg transition-all"
        >
          ไปต่อกิจกรรมฝึกพินอิน (Next)
          <ChevronRight className="w-6 h-6 ml-2" />
        </button>
      </div>
    </div>
  );
};

const PinyinLesson5 = ({ 
  lesson, 
  speak,
  pinyinSpeak, 
  pinyinSequenceSpeak, 
  playingText 
}: { 
  lesson: any, 
  speak: (t: string) => void,
  pinyinSpeak: (py: string, rate?: number) => void,
  pinyinSequenceSpeak: (list: string[], rate?: number) => void,
  playingText: string | null 
}) => {
  const [progress, setProgress] = useState<Record<number, boolean>>({});
  
  const TONE_SETS = [
    ["pāo", "páo", "pǎo", "pào"],
    ["bā", "bá", "bǎ", "bà"],
    ["zā", "zá", "zǎ", "zà"],
    ["dā", "dá", "dǎ", "dà"]
  ];

  return (
    <div className="space-y-12 pb-20">
      <div className="bg-chinese-gold p-8 rounded-4xl text-white shadow-lg relative overflow-hidden">
        <h3 className="text-3xl font-black mb-2 uppercase tracking-tight">กิจกรรมฝึกพินอิน (PINYIN)</h3>
        <p className="font-bold opacity-90">บทที่ 5: {lesson.title}</p>
        <Star className="w-48 h-48 absolute -right-12 -bottom-12 text-white/10 rotate-12" />
      </div>

      <section className="space-y-6">
        <h4 className="text-2xl font-black text-gray-900 border-l-8 border-chinese-gold pl-4">ฝึกอ่านเสียงพินอิน</h4>
        <div className="bg-white p-8 rounded-5xl border-2 border-chinese-gold/10 shadow-sm overflow-x-auto">
          <table className="w-full text-center">
            <tbody>
              {TONE_SETS.map((row, i) => (
                <tr key={i} className="hover:bg-chinese-gold/5 transition-colors group/row">
                  {row.map((cell, j) => (
                    <td key={j} className="p-4 border-b border-gray-50">
                      <button 
                        onClick={() => pinyinSpeak(cell)} 
                        className={cn(
                          "text-2xl font-mono font-black transition-colors rounded-xl p-2",
                          playingText === cell ? "text-chinese-gold bg-chinese-gold/10 scale-110" : "text-gray-700 hover:text-chinese-gold"
                        )}
                      >
                        {cell}
                      </button>
                    </td>
                  ))}
                  <td className="p-2 border-b border-gray-50 opacity-0 group-hover/row:opacity-100 transition-opacity">
                    <button 
                      onClick={() => pinyinSequenceSpeak(row)}
                      className="p-3 bg-chinese-gold text-white rounded-2xl hover:scale-105 transition-all shadow-md"
                    >
                      <Volume2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-6">
        <h4 className="text-2xl font-black text-gray-900 border-l-8 border-chinese-gold pl-4">ฝึกอ่านคำศัพท์จากพินอิน</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lesson.vocabulary.slice(0, 4).map((v: any, i: number) => (
            <div key={`pinyin-v-5-${i}`} className="bg-white p-6 rounded-3xl border-2 border-gray-100 flex flex-col space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-5xl font-chinese font-black text-gray-900 leading-none">{v.word}</span>
                <button onClick={() => speak(v.word)} className="w-12 h-12 bg-chinese-gold/10 text-chinese-gold-dark rounded-full flex items-center justify-center"><Volume2 /></button>
              </div>
              <p className="text-xl font-bold text-chinese-gold-dark">{v.pinyin}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mark as done */}
      <div className="flex justify-center pt-8">
        <button 
          onClick={() => setProgress(prev => ({ ...prev, 1: true }))}
          className={cn("px-12 py-6 rounded-3xl font-black text-xl shadow-xl transition-all", progress[1] ? "bg-emerald-500 text-white" : "bg-chinese-gold text-white hover:scale-105")}
        >
          {progress[1] ? "เสร็จสิ้นกิจกรรม! ✨" : "ทำเครื่องหมายว่าเสร็จแล้ว"}
        </button>
      </div>
    </div>
  );
};

const FunLesson5 = ({ lesson, speak, setActiveActivity }: { lesson: any, speak: (t: string) => void, setActiveActivity: (a: ActivityType) => void }) => {
  const [completed, setCompleted] = useState<Record<number, boolean>>({});
  const totalSteps = 3;
  const completedCount = Object.values(completed).filter(Boolean).length;

  return (
    <div className="space-y-12 pb-20">
      <div className="bg-pink-500 p-8 rounded-4xl text-white shadow-lg relative overflow-hidden">
        <h3 className="text-3xl font-black mb-2 uppercase">กิจกรรมหรรษา (FUN)</h3>
        <p className="font-bold opacity-90">บทที่ 5: {lesson.title}</p>
        <Gamepad2 className="w-48 h-48 absolute -right-12 -bottom-12 text-white/10 rotate-12" />
      </div>

      <div className="flex flex-col items-center">
        <div className="w-full max-w-md bg-white border-4 border-pink-100 rounded-3xl p-6 shadow-sm text-center">
           <p className="font-black text-pink-600 mb-2">กิจกรรมคืบหน้า {completedCount}/{totalSteps}</p>
           <div className="h-4 bg-pink-50 rounded-full overflow-hidden border-2 border-pink-100">
             <motion.div className="h-full bg-pink-500" animate={{ width: `${(completedCount / totalSteps) * 100}%` }} />
           </div>
        </div>
      </div>

      <section className="space-y-6">
        <div className="flex items-center gap-3"><div className="w-2 h-8 bg-pink-500 rounded-full" /><h4 className="text-2xl font-black text-gray-900">1. เกมสุ่มกิจกรรมวันนี้</h4></div>
        <div className="bg-white p-10 rounded-[3rem] border-2 border-pink-100 shadow-sm text-center space-y-6">
           <div className="w-32 h-32 bg-pink-50 rounded-full flex items-center justify-center mx-auto text-5xl">🏃</div>
           <p className="text-xl font-bold text-gray-500 italic">"เขากำลังทำอะไร?"</p>
           <button onClick={() => { speak("他在跑步。"); setCompleted(p => ({...p, 1: true})); }} className="px-12 py-4 bg-pink-500 text-white rounded-2xl font-black shadow-lg hover:scale-105 transition-all">ลองสุ่มและตอบ</button>
        </div>
      </section>

      <div className="flex justify-center pt-10">
        <button 
          onClick={() => setActiveActivity(ActivityType.FINAL)}
          className="bg-chinese-gold hover:bg-yellow-600 text-white text-xl px-12 py-8 rounded-3xl font-black flex items-center shadow-lg transition-all"
        >
          สรุปบทเรียน (Next)
          <ChevronRight className="w-6 h-6 ml-2" />
        </button>
      </div>
    </div>
  );
};

const SummaryLesson5 = ({ lesson, setActiveActivity, speak }: { lesson: any, setActiveActivity: (type: ActivityType) => void, speak: (t: string, r?: number) => void }) => {
  const navigate = useNavigate();
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const items = [
    "ฉันบอกชื่อกิจกรรมต่างๆ เป็นภาษาจีนได้",
    "ฉันใช้คำว่า 在 (zài) เพื่อบอกสิ่งที่กำลังทำได้",
    "ฉันอ่านประโยคเกี่ยวกับสิ่งที่คนอื่นกำลังทำได้",
    "ฉันฟังและแยกเสียงพินอินบทนี้ได้",
    "ฉันเขียนตัวอักษรจีนสำคัญของบทนี้ได้"
  ];

  const isAllChecked = Object.values(checkedItems).filter(Boolean).length === items.length;

  return (
    <div className="space-y-12 pb-20">
      <div className="bg-chinese-red p-8 rounded-4xl text-white shadow-lg relative overflow-hidden">
        <h3 className="text-3xl font-black mb-2 uppercase tracking-tight">สรุปบทเรียน (SUMMARY)</h3>
        <p className="font-bold opacity-90">บทที่ 5: {lesson.title}</p>
        <Trophy className="w-48 h-48 absolute -right-12 -bottom-12 text-white/10 rotate-12" />
      </div>

      {/* เรียนอะไรมาบ้าง section */}
      <SummaryDetails data={{
        learned: [
          "เรียนคำศัพท์กิจกรรม เช่น 跑步, 打电话, 上网, 玩游戏, 写作业",
          "เรียนรูปประโยค คน + 在 + กิจกรรม",
          "เรียนการถามว่า “กำลังทำอะไร” ด้วย 在做什么？"
        ],
        listening: [
          "ฟังคำศัพท์กิจกรรมประจำวัน",
          "ฟังประโยค 他在跑步。妈妈在洗衣服。",
          "ฟังคำถาม 妈妈ใน做什么？"
        ],
        speaking: [
          "ฝึกถาม-ตอบว่าคนในครอบครัวกำลังทำอะไร",
          "ฝึกประโยค 我在学习。妹妹在玩游戏。",
          "ฝึกใช้ 在 เพื่อบอกการกระทำที่กำลังเกิดขึ้น"
        ],
        fun: [
          "จับคู่พินอินกับคำศัพท์กิจกรรม",
          "เกมทายท่าทาง “ฉันกำลังทำอะไร”",
          "ดูเวลาและภาพแล้วพูดถามตอบ"
        ],
        reading: [
          "อ่านเรื่องสั้นเกี่ยวกับกิจกรรมของครอบครัวในวันเสาร์",
          "อ่านตารางเวลา เช้า กลางวัน เย็น และกลางคืน",
          "ตอบ ✓ หรือ X จากเนื้อเรื่อง"
        ],
        writing: [
          "ฝึกเขียน 跑, 网, 玩, 写, 洗, 扫",
          "วง/ทำเครื่องหมายตัวอักษรจีนตามคำสั่ง",
          "ฝึกคัด 在 และ 写"
        ],
        pinyin: [
          "อ่านคำศัพท์พินอิน เช่น jiějie, xiě zuòyè, huà huà",
          "ฝึกอ่านคำที่มีเสียงใกล้เคียงจากบทก่อนหน้า",
          "ฝึกพูดคำสัมผัสอักษร 我学姐姐画花"
        ]
      }} />

      <section className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-3 h-10 bg-emerald-500 rounded-full" />
          <h4 className="text-3xl font-black text-gray-900 uppercase tracking-tight">เช็กความสำเร็จ 🎯</h4>
        </div>
        <div className="bg-white p-6 md:p-10 rounded-[3.5rem] border-2 border-emerald-100 shadow-sm space-y-4">
          {items.map((item, idx) => (
            <label key={idx} className="flex items-center gap-4 p-4 hover:bg-emerald-50 rounded-3xl cursor-pointer transition-all group">
              <input 
                type="checkbox" 
                checked={checkedItems[idx] || false} 
                onChange={() => setCheckedItems(prev => ({ ...prev, [idx]: !prev[idx] }))} 
                className="w-8 h-8 rounded-xl border-4 border-emerald-100 text-emerald-500 transition-all cursor-pointer focus:ring-0" 
              />
              <span className={cn("text-xl font-bold transition-all", checkedItems[idx] ? "text-emerald-600 line-through opacity-50" : "text-gray-700")}>{item}</span>
            </label>
          ))}
          
          <AnimatePresence>
            {isAllChecked && (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0, y: 20 }} 
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="mt-10 bg-gradient-to-br from-emerald-500 to-teal-400 p-12 rounded-[4rem] text-center text-white space-y-6 shadow-2xl relative overflow-hidden"
              >
                  <Sparkles className="absolute top-8 left-8 w-12 h-12 opacity-20 animate-pulse" />
                  <Sparkles className="absolute bottom-8 right-8 w-12 h-12 opacity-20 animate-pulse delay-100" />
                  <div className="relative z-10 space-y-6">
                    <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto shadow-2xl border-8 border-white/20 animate-bounce">
                      <Trophy className="w-16 h-16 text-chinese-gold" />
                    </div>
                    <div>
                       <h5 className="text-4xl font-black italic mb-2">เก่งมากจ๊ะ! ✨</h5>
                       <p className="text-xl font-bold opacity-90 max-w-md mx-auto leading-relaxed">เด็กๆ เรียนเนื้อหาบทที่ 5 ครบถ้วนแล้ว พร้อมจะไปบทต่อไปหรือยัง?</p>
                    </div>
                    <ChineseButton variant="gold" size="lg" className="rounded-2xl px-12 py-8 text-xl" onClick={() => { window.scrollTo({ top: 0, behavior: 'instant' }); navigate('/lesson/6'); }}>
                       ไปบทที่ 6 เลย! <ChevronRight className="ml-2" />
                    </ChineseButton>
                  </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};

const GenericListening = ({ lesson, speak }: { lesson: any, speak: (t: string) => void }) => {
  return (
    <div className="space-y-12 pb-20">
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 p-8 rounded-4xl text-white shadow-lg relative overflow-hidden">
         <div className="relative z-10 flex items-center gap-6">
            <ThreeDContainer color="orange" size="lg" className="hidden md:flex">
               <Volume2 size={48} />
            </ThreeDContainer>
            <div>
               <h3 className="text-3xl font-black leading-tight mb-2">กิจกรรมการฟัง (LISTENING)</h3>
               <p className="text-orange-100 font-bold italic text-lg uppercase tracking-wider">บทที่ {lesson.id}: {lesson.title}</p>
            </div>
         </div>
         <Volume2 className="w-48 h-48 absolute -right-12 -bottom-12 text-white/10 rotate-12" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {lesson.vocabulary.map((v: any, i: number) => (
            <motion.div 
              key={`gen-listen-${i}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-white p-8 rounded-[3rem] border-2 border-gray-50 shadow-xl hover:shadow-2xl hover:border-orange-500 transition-all text-center space-y-6 group relative overflow-hidden"
            >
              <div className="flex justify-center pt-2">
                <ThreeDContainer color="orange" size="md">
                  {v.icon || "🔊"}
                </ThreeDContainer>
              </div>
              <div className="space-y-2">
                <p className="text-4xl font-chinese font-black text-gray-900 leading-none">{v.word}</p>
                <p className="text-xl font-bold text-orange-600">{v.pinyin}</p>
                <div className="h-px w-12 bg-gray-100 mx-auto" />
                <p className="text-gray-400 font-bold italic">{v.translation.split(' (')[0]}</p>
              </div>
              <button 
                onClick={() => speak(v.word)}
                className="w-full py-4 bg-orange-500 text-white rounded-[1.5rem] font-black shadow-[0_6px_0_0_#ea580c] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-3"
              >
                <Volume2 size={24} /> 
                <span>ฟังเสียง</span>
              </button>
            </motion.div>
        ))}
      </div>

      <div className="bg-orange-50 p-10 rounded-[4rem] border-4 border-dashed border-orange-200 text-center space-y-4 relative overflow-hidden">
         <div className="relative z-10">
            <div className="text-7xl animate-bounce mb-4">✨</div>
            <h4 className="text-3xl font-black text-orange-800 italic uppercase">ยอดเยี่ยมมาก!</h4>
            <p className="text-orange-700 font-bold text-xl max-w-lg mx-auto">เด็กๆ ฝึกฟังให้ครบทุกคำนะจ๊ะ จะได้เก่งภาษาจีนเหมือน Nana และ Mading!</p>
         </div>
         {/* Decorative clay icons */}
         <div className="absolute top-4 left-4 text-4xl opacity-20 rotate-12">🎧</div>
         <div className="absolute bottom-4 right-4 text-4xl opacity-20 -rotate-12">⭐</div>
      </div>
    </div>
  );
};

const GenericSpeaking = ({ lesson, speak }: { lesson: any, speak: (t: string, r?: number) => void }) => {
  return (
    <div className="space-y-12 pb-20">
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-400 p-8 rounded-4xl text-white shadow-lg relative overflow-hidden">
         <div className="relative z-10 flex items-center gap-6">
            <ThreeDContainer color="emerald" size="lg" className="hidden md:flex">
               <Mic size={48} />
            </ThreeDContainer>
            <div>
               <h3 className="text-3xl font-black leading-tight mb-2 uppercase tracking-tight">กิจกรรมการพูด (SPEAKING)</h3>
               <p className="text-emerald-100 font-bold italic text-lg uppercase tracking-wider">บทที่ {lesson.id}: {lesson.title}</p>
            </div>
         </div>
         <Mic className="w-48 h-48 absolute -right-12 -bottom-12 text-white/10 rotate-12" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {lesson.vocabulary.slice(0, 8).map((v: any, i: number) => (
          <motion.div 
            key={`speak-gen-${i}`} 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-[3.5rem] border-2 border-gray-50 shadow-xl flex flex-col items-center gap-6 hover:shadow-2xl hover:border-emerald-500 transition-all group overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <Mascot type="panda" className="w-16 h-16 grayscale" />
            </div>
            <div className="flex justify-center pt-2">
              <ThreeDContainer color="emerald" size="md">
                {v.icon || "🗣️"}
              </ThreeDContainer>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl font-black font-chinese text-gray-900 leading-none">{v.word}</div>
              <p className="text-2xl font-bold text-emerald-600 italic tracking-wide">{v.pinyin}</p>
              <div className="h-0.5 w-8 bg-emerald-100 mx-auto rounded-full" />
              <p className="text-gray-400 font-bold italic">{v.translation.split(' (')[0]}</p>
            </div>
            <div className="flex flex-col gap-3 w-full">
              <button 
                onClick={() => speak(v.word)} 
                className="w-full py-4 bg-emerald-50 text-emerald-700 rounded-2xl font-black shadow-[0_4px_0_0_rgba(16,185,129,0.1)] hover:bg-emerald-100 transition-all flex items-center justify-center gap-3"
              >
                <Volume2 size={24} /> 
                <span>ฟังเสียงต้นแบบ</span>
              </button>
              <button className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black shadow-[0_6px_0_0_#059669] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-3">
                <Mic size={24} /> 
                <span>ลองพูดเองจ๊ะ!</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const GenericReading = ({ lesson, speak, setActiveActivity }: { lesson: any, speak: (t: string) => void, setActiveActivity: (a: ActivityType) => void }) => {
  const [completed, setCompleted] = useState<Record<number, boolean>>({});
  
  const displayItems = lesson.dialogues && lesson.dialogues.length > 0 ? lesson.dialogues : Array.from({ length: 6 }).map((_, i) => ({
    zh: "待添加",
    py: "dài tiānjiā",
    th: "รอเพิ่มเนื้อหา",
    role: "Role"
  }));

  const completedCount = Object.values(completed).filter(Boolean).length;
  const isFinished = completedCount === displayItems.length;

  return (
    <div className="space-y-12 pb-20">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-400 p-8 rounded-4xl text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex items-center gap-6">
           <ThreeDContainer color="blue" size="lg" className="hidden md:flex">
              <BookOpen size={48} />
           </ThreeDContainer>
           <div>
              <h3 className="text-3xl font-black leading-tight mb-2 uppercase tracking-tight">กิจกรรมฝึกอ่าน (READING)</h3>
              <p className="text-blue-100 font-bold italic text-lg uppercase tracking-wider">{lesson.dialogues && lesson.dialogues.length > 0 ? `บทที่ ${lesson.id}: ${lesson.title}` : `รอเพิ่มเนื้อหาของบทที่ ${lesson.id}`}</p>
           </div>
        </div>
        <BookOpen className="w-48 h-48 absolute -right-12 -bottom-12 text-white/10 rotate-12" />
      </div>

      <div className="flex flex-col items-center gap-6">
        <div className="w-full max-w-lg bg-white border-4 border-blue-50 rounded-[3rem] p-8 shadow-xl">
          <div className="flex justify-between items-end mb-4 h-8 px-4">
            <span className="font-black text-blue-600 text-xl flex items-center gap-2 italic">
               <ThreeDContainer color="blue" size="sm" className="scale-50 -ml-4">📖</ThreeDContainer>
               อ่านแล้ว {completedCount}/{displayItems.length}
            </span>
            {isFinished && <span className="text-emerald-500 font-black text-lg animate-bounce">เก่งมากจ๊ะ! ✨</span>}
          </div>
          <div className="h-6 bg-blue-50 rounded-full overflow-hidden border-4 border-white shadow-inner">
            <motion.div 
              className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / displayItems.length) * 100}%` }}
              transition={{ type: "spring", bounce: 0, duration: 0.8 }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {displayItems.map((item: any, idx: number) => (
          <motion.div 
            key={`gen-reading-${idx}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "bg-white p-8 rounded-[3.5rem] border-4 transition-all relative overflow-hidden group",
              completed[idx] ? "border-emerald-400 shadow-2xl scale-[1.02]" : "border-gray-50 hover:border-blue-300 shadow-xl"
            )}
          >
            {completed[idx] && (
               <div className="absolute top-0 right-0 p-4">
                  <ThreeDContainer color="emerald" size="sm">✅</ThreeDContainer>
               </div>
            )}
            
            <div className="flex items-start gap-6 mb-6">
              <RoleAvatar role={item.role || "Role"} />
              <div className="flex-1 space-y-3">
                <span className="text-blue-400 font-black text-[10px] uppercase tracking-[0.2em] bg-blue-50 px-3 py-1 rounded-full">{item.role || `Sentence ${idx+1}`}</span>
                <div className="min-h-[100px] flex flex-col justify-center">
                  <h4 className="text-3xl font-chinese font-black text-gray-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors uppercase">{item.text || item.zh}</h4>
                  <p className="text-xl font-bold text-blue-500 tracking-wider mb-2 italic">{item.pinyin || item.py}</p>
                  <p className="text-gray-500 font-bold italic leading-relaxed text-lg">{item.translation || item.th}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button 
                onClick={() => speak(item.text || item.zh)} 
                className="flex-1 py-5 bg-blue-50 text-blue-600 rounded-[1.8rem] font-black flex items-center justify-center gap-3 hover:bg-blue-600 hover:text-white transition-all shadow-[0_4px_0_0_rgba(59,130,246,0.1)] active:shadow-none active:translate-y-1"
              >
                <Volume2 className="w-6 h-6" /> ฟังเสียงต้นแบบ
              </button>
              <button 
                onClick={() => setCompleted(prev => ({ ...prev, [idx]: true }))} 
                className={cn(
                  "flex-1 py-5 rounded-[1.8rem] font-black transition-all shadow-xl active:scale-95 text-lg", 
                  completed[idx] ? "bg-emerald-500 text-white shadow-[0_6px_0_0_#059669]" : "bg-white border-2 border-gray-100 text-gray-500 hover:bg-gray-50"
                )}
              >
                {completed[idx] ? "อ่านเรียบร้อยแล้ว" : "เสร็จสิ้นจ๊ะ"}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const GenericWriting = ({ lesson, speak }: { lesson: any, speak: (t: string) => void }) => {
  const [progress, setProgress] = useState<Record<number, boolean>>({});
  const completedCount = Object.values(progress).filter(Boolean).length;
  const isFinished = completedCount === 4;

  const WritingGrid = ({ char, isTrace = false, isHeavy = false }: { char: string, isTrace?: boolean, isHeavy?: boolean }) => (
    <div className="relative w-28 h-28 bg-white border-4 border-gray-100 rounded-[2rem] flex items-center justify-center font-chinese text-6xl overflow-hidden shadow-inner">
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-400 border-t-2 border-dashed" />
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-400 border-l-2 border-dashed" />
      </div>
      <span className={cn(isHeavy ? "text-chinese-red font-black" : isTrace ? "text-gray-100" : "text-gray-900", "relative z-10 drop-shadow-sm")}>{char}</span>
    </div>
  );

  return (
    <div className="space-y-12 pb-20">
      <div className="bg-gradient-to-r from-purple-500 to-fuchsia-400 p-8 rounded-4xl text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex items-center gap-6">
           <ThreeDContainer color="purple" size="lg" className="hidden md:flex">
              <Zap size={48} />
           </ThreeDContainer>
           <div>
              <h3 className="text-3xl font-black leading-tight mb-2 uppercase tracking-tight">กิจกรรมฝึกเขียน (WRITING)</h3>
              <p className="text-purple-100 font-bold italic text-lg uppercase tracking-wider">บทที่ {lesson.id}: {lesson.title}</p>
           </div>
        </div>
        <Zap className="w-48 h-48 absolute -right-12 -bottom-12 text-white/10 rotate-12" />
      </div>

      <div className="flex flex-col items-center gap-6">
        <div className="w-full max-w-lg bg-white border-4 border-purple-50 rounded-[3rem] p-8 shadow-xl">
          <div className="flex justify-between items-end mb-4 h-8 px-4">
             <span className="font-black text-purple-600 text-xl flex items-center gap-2 italic">
                <ThreeDContainer color="purple" size="sm" className="scale-50 -ml-4">✍️</ThreeDContainer>
                ฝึกแล้ว {completedCount}/4
             </span>
             {isFinished && <span className="text-emerald-500 font-black text-lg animate-bounce">เก่งมากจ๊ะ! ✨</span>}
          </div>
          <div className="h-6 bg-purple-50 rounded-full overflow-hidden border-4 border-white shadow-inner">
            <motion.div 
               className="h-full bg-gradient-to-r from-purple-400 to-purple-600" 
               animate={{ width: `${(completedCount / 4) * 100}%` }} 
               transition={{ type: "spring", bounce: 0, duration: 0.8 }}
            />
          </div>
        </div>
      </div>

      <section className="space-y-8">
        <div className="flex items-center gap-4">
           <div className="w-3 h-10 bg-purple-500 rounded-full shadow-lg shadow-purple-200" />
           <h4 className="text-2xl font-black text-gray-900 uppercase tracking-tight">อ่านแล้วเขียนตัวอักษรจีน</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2].map((_, idx) => (
            <motion.div 
              key={`gen-writing-char-${idx}`} 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="bg-white p-8 rounded-[3.5rem] border-2 border-gray-50 shadow-xl space-y-6 hover:shadow-2xl transition-all"
            >
              <div className="flex justify-between items-start">
                 <div className="flex gap-6 items-center">
                    <ThreeDContainer color="purple" size="md">待</ThreeDContainer>
                    <div>
                       <p className="text-3xl font-black text-purple-600 italic">dài</p>
                       <p className="text-lg font-bold text-gray-400 italic">รอเพิ่มเนื้อหา</p>
                    </div>
                 </div>
                 <button onClick={() => speak("待")} className="w-14 h-14 bg-purple-50 text-purple-600 rounded-[1.5rem] flex items-center justify-center shadow-inner hover:bg-purple-100 transition-all">
                    <Volume2 className="w-6 h-6" />
                 </button>
              </div>
              <div className="flex justify-center p-8 bg-gray-50 rounded-[2.5rem] border-4 border-white shadow-inner">
                 <WritingGrid char="待" isTrace />
              </div>
              <button 
                onClick={() => setProgress(prev => ({ ...prev, [idx + 1]: true }))} 
                className={cn(
                   "w-full py-5 rounded-[1.8rem] font-black transition-all shadow-xl text-lg",
                   progress[idx + 1] ? "bg-emerald-500 text-white shadow-[0_6px_0_0_#059669]" : "bg-purple-500 text-white shadow-[0_6px_0_0_#9333ea] hover:shadow-[0_4px_0_0_#9333ea] active:shadow-none active:translate-y-1"
                )}
              >
                 {progress[idx + 1] ? "เขียนเรียบร้อยแล้ว!" : "ฉันเขียนเสร็จแล้วจ๊ะ"}
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex items-center gap-4">
           <div className="w-3 h-10 bg-chinese-gold rounded-full shadow-lg shadow-yellow-200" />
           <h4 className="text-2xl font-black text-gray-900 uppercase tracking-tight">วงกลมตัวอักษรจีนที่หายไป</h4>
        </div>
        <div className="bg-white p-12 rounded-[4rem] border-2 border-gray-50 shadow-xl text-center space-y-10 relative overflow-hidden">
          <Mascot type="panda" className="absolute -left-10 -bottom-10 opacity-10 -rotate-12" />
          <p className="text-5xl font-chinese font-black text-gray-900 tracking-widest bg-gray-50 py-10 rounded-[2.5rem] shadow-inner border-4 border-white">这里是 <span className="text-purple-500 underline decoration-dashed underline-offset-8">__</span> 。</p>
          <div className="grid grid-cols-3 gap-6">
            {["待", "ค", "ง"].map(o => (
              <button 
                key={`gen-writing-q-${o}`} 
                onClick={() => setProgress(prev => ({ ...prev, 3: true }))} 
                className="py-6 rounded-[2rem] border-4 border-gray-50 font-chinese text-4xl font-black bg-white hover:border-purple-300 hover:shadow-xl hover:translate-y-[-4px] transition-all"
              >
                 {o}
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const GenericPinyin = ({ 
  lesson, 
  speak,
  pinyinSpeak, 
  pinyinSequenceSpeak, 
  playingText 
}: { 
  lesson: any, 
  speak: (t: string) => void,
  pinyinSpeak: (py: string, rate?: number) => void,
  pinyinSequenceSpeak: (list: string[], rate?: number) => void,
  playingText: string | null 
}) => {
  const [progress, setProgress] = useState<Record<number, boolean>>({});
  const completedCount = Object.values(progress).filter(Boolean).length;
  const isFinished = completedCount === 3;

  return (
    <div className="space-y-12 pb-20">
      <div className="bg-gradient-to-r from-chinese-gold to-yellow-400 p-8 rounded-4xl text-white shadow-lg relative overflow-hidden text-red-900 border-4 border-chinese-gold-dark/20">
         <div className="relative z-10 flex items-center gap-6">
            <ThreeDContainer color="gold" size="lg" className="hidden md:flex">
               <Music size={48} />
            </ThreeDContainer>
            <div>
               <h3 className="text-3xl font-black leading-tight mb-2 uppercase tracking-tight">กิจกรรมฝึกพินอิน (PINYIN)</h3>
               <p className="text-red-800 font-bold italic text-lg uppercase tracking-wider">บทที่ {lesson.id}: {lesson.title}</p>
            </div>
         </div>
         <Star className="w-48 h-48 absolute -right-12 -bottom-12 text-white/20 rotate-12" />
      </div>

      <div className="flex flex-col items-center gap-6">
        <div className="w-full max-w-lg bg-white border-4 border-chinese-gold/20 rounded-[3rem] p-8 shadow-xl">
          <div className="flex justify-between items-end mb-4 h-8 px-4">
             <span className="font-black text-chinese-gold-dark text-xl flex items-center gap-2 italic">
                <ThreeDContainer color="gold" size="sm" className="scale-50 -ml-4">🎼</ThreeDContainer>
                ฝึกแล้ว {completedCount}/3
             </span>
             {isFinished && <span className="text-emerald-500 font-black text-lg animate-bounce">เก่งมากจ๊ะ! ✨</span>}
          </div>
          <div className="h-6 bg-chinese-gold/10 rounded-full overflow-hidden border-4 border-white shadow-inner">
            <motion.div 
               className="h-full bg-gradient-to-r from-chinese-gold to-yellow-600" 
               animate={{ width: `${(completedCount / 3) * 100}%` }} 
               transition={{ type: "spring", bounce: 0, duration: 0.8 }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <section className="space-y-6">
          <div className="flex items-center gap-4">
             <div className="w-2 h-8 bg-blue-500 rounded-full shadow-lg" />
             <h4 className="text-xl font-black text-gray-900 uppercase">ฝึกอ่านเสียงพินอิน</h4>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border-2 border-gray-50 shadow-xl flex items-center justify-between group hover:border-blue-400 transition-all">
             <span className="text-4xl font-black text-chinese-gold-dark drop-shadow-sm font-mono tracking-widest">dai</span>
             <button onClick={() => pinyinSpeak("dai")} className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[1.5rem] flex items-center justify-center hover:bg-blue-100 transition-all shadow-inner">
                <Volume2 className="w-8 h-8" />
             </button>
          </div>
          <button onClick={() => setProgress(prev => ({ ...prev, 1: true }))} className={cn("w-full py-5 rounded-[1.8rem] font-black transition-all shadow-xl text-lg", progress[1] ? "bg-emerald-500 text-white shadow-[0_6px_0_0_#059669]" : "bg-blue-500 text-white shadow-[0_6px_0_0_#2563eb]")}>
             {progress[1] ? "สำเร็จแล้ว!" : "ฉันอ่านได้แล้ว"}
          </button>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-4">
             <div className="w-2 h-8 bg-emerald-500 rounded-full shadow-lg" />
             <h4 className="text-xl font-black text-gray-900 uppercase">ฝึกอ่านคำศัพท์พินอิน</h4>
          </div>
          <div className="bg-white p-8 rounded-[3rem] border-2 border-gray-50 text-center space-y-4 shadow-xl group hover:border-emerald-400 transition-all">
            <p className="text-3xl font-black text-emerald-600 italic">dai tiānjiā</p>
            <p className="text-5xl font-chinese font-black text-gray-900 drop-shadow-sm">待添加</p>
            <p className="text-gray-400 font-bold italic">รอเพิ่มเนื้อหา</p>
            <div className="flex gap-3">
               <button onClick={() => speak("待添加")} className="flex-1 py-4 bg-emerald-50 text-emerald-600 rounded-2xl font-black flex items-center justify-center gap-2 shadow-inner hover:bg-emerald-100"><Volume2 className="w-5 h-5" /> ฟัง</button>
               <button onClick={() => setProgress(prev => ({ ...prev, 2: true }))} className={cn("flex-1 py-4 rounded-2xl font-black transition-all shadow-xl", progress[2] ? "bg-emerald-500 text-white shadow-[0_4px_0_0_#059669]" : "bg-gray-100 text-gray-400")}>{progress[2] ? "เก่งมาก!" : "อ่านแล้ว"}</button>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-4">
             <div className="w-2 h-8 bg-purple-500 rounded-full shadow-lg" />
             <h4 className="text-xl font-black text-gray-900 uppercase">พูดคำสัมผัสอักษร</h4>
          </div>
          <div className="bg-white p-8 rounded-[3rem] border-2 border-gray-50 shadow-xl text-center space-y-6 relative overflow-hidden group hover:border-purple-400 transition-all">
             <Mascot type="dragon" className="absolute -right-6 -bottom-6 w-20 h-20 opacity-10 -rotate-12 group-hover:scale-110 transition-transform" />
             <p className="text-xl font-bold text-gray-400 font-mono tracking-widest italic opacity-60">Dài tiānjiā, dài tiānjiā...</p>
             <button onClick={() => speak("待添加")} className="w-20 h-20 bg-purple-100 text-purple-700 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner hover:bg-purple-200 transition-all">
                <Volume2 className="w-10 h-10" />
             </button>
             <button onClick={() => setProgress(prev => ({ ...prev, 3: true }))} className={cn("w-full py-5 rounded-[1.8rem] font-black transition-all shadow-xl text-lg", progress[3] ? "bg-emerald-500 text-white shadow-[0_6px_0_0_#059669]" : "bg-purple-600 text-white shadow-[0_6px_0_0_#7c3aed]")}>
                {progress[3] ? "ยอดเยี่ยม!" : "ฉันพูดแล้วจ๊ะ"}
             </button>
          </div>
        </section>
      </div>
    </div>
  );
};

const GenericFun = ({ lesson, speak }: { lesson: any, speak: (t: string) => void }) => {
  const [progress, setProgress] = useState<Record<number, boolean>>({});
  const completedCount = Object.values(progress).filter(Boolean).length;
  const totalSections = 3;

  return (
    <div className="space-y-12 pb-20">
      <div className="bg-pink-500 p-8 rounded-4xl text-white shadow-lg relative overflow-hidden">
        <h3 className="text-3xl font-black mb-2 uppercase">กิจกรรมหรรษา (FUN)</h3>
        <p className="font-bold opacity-90">รอเพิ่มเนื้อหาของบทที่ {lesson.id}</p>
        <Gamepad2 className="w-48 h-48 absolute -right-12 -bottom-12 text-white/10 rotate-12" />
      </div>

      <div className="flex flex-col items-center">
        <div className="w-full max-w-md bg-white border-4 border-pink-100 rounded-3xl p-6 shadow-sm text-center">
           <p className="font-black text-pink-600 mb-2">ทำกิจกรรมคืบหน้า {completedCount}/{totalSections}</p>
           <div className="h-4 bg-pink-50 rounded-full overflow-hidden border-2 border-pink-100">
             <motion.div className="h-full bg-pink-500" animate={{ width: `${(completedCount / totalSections) * 100}%` }} />
           </div>
        </div>
      </div>

      <section className="space-y-6">
        <div className="flex items-center gap-3"><div className="w-2 h-8 bg-pink-500 rounded-full" /><h4 className="text-2xl font-black text-gray-900">1. เกมจับคู่ภาพกับคำศัพท์</h4></div>
        <div className="bg-white p-8 rounded-4xl border-2 border-pink-100 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-4">
           {Array.from({ length: 8 }).map((_, i) => (
             <div key={`gen-fun-match-${i}`} className="aspect-square bg-pink-50 rounded-2xl border-4 border-dashed border-pink-200 flex items-center justify-center font-black text-pink-300 text-3xl">?</div>
           ))}
        </div>
        <button onClick={() => setProgress(prev => ({ ...prev, 1: true }))} className="w-full py-4 bg-pink-500 text-white rounded-2xl font-black shadow-lg">ยืนยันการจับคู่</button>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-3"><div className="w-2 h-8 bg-blue-500 rounded-full" /><h4 className="text-2xl font-black text-gray-900">2. เกมสุ่มสถานที่แล้วพูดประโยค</h4></div>
        <div className="bg-white p-8 rounded-4xl border-2 border-blue-100 shadow-sm text-center space-y-6">
           <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mx-auto text-5xl animate-pulse">🎲</div>
           <p className="text-xl font-bold text-gray-400 italic">กดปุ่มเพื่อสุ่มประโยคฝึกพูด</p>
           <button onClick={() => setProgress(prev => ({ ...prev, 2: true }))} className="px-12 py-4 bg-blue-500 text-white rounded-2xl font-black shadow-lg">สุ่มและฝึกพูด</button>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-3"><div className="w-2 h-8 bg-emerald-500 rounded-full" /><h4 className="text-2xl font-black text-gray-900">3. เกมเรียงลำดับคำในประโยค</h4></div>
        <div className="bg-white p-8 rounded-4xl border-2 border-emerald-100 shadow-sm text-center space-y-8">
           <div className="flex flex-wrap gap-3 justify-center">
              {["คำที่ 1", "คำที่ 2", "คำที่ 3"].map(w => (
                <div key={`gen-fun-order-${w}`} className="px-6 py-3 bg-white border-2 border-emerald-100 rounded-xl font-bold text-emerald-600 shadow-sm">{w}</div>
              ))}
           </div>
           <div className="h-12 border-b-4 border-dashed border-emerald-50 w-full max-w-md mx-auto" />
           <button onClick={() => setProgress(prev => ({ ...prev, 3: true }))} className="px-12 py-4 bg-emerald-500 text-white rounded-2xl font-black shadow-lg">ตรวจสอบคำตอบ</button>
        </div>
      </section>
    </div>
  );
};

const GenericSummary = ({ lesson, setActiveActivity, speak }: { lesson: any, setActiveActivity: (type: ActivityType) => void, speak: (t: string, r?: number) => void }) => {
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const lesson6Summary = {
    learned: [
      "เรียนคำศัพท์คำตรงข้าม: 快 (kuài - เร็ว), 慢 (màn - ช้า), 大 (dà - ใหญ่), 小 (xiǎo - เล็ก), 多 (duō - มาก), 少 (shǎo - น้อย), 胖 (pàng - อ้วน), 瘦 (shòu - ผอม)",
      "เรียนคำศัพท์ยานพาหนะ: 飞机 (fēijī - เครื่องบิน), 火车 (huǒchē - รถไฟ)",
      "เรียนรูปประโยคการเปรียบเทียบ: (ยานพาหนะ) + (คำคุณศัพท์)",
      "เรียนการออกเสียงชื่อเมือง: 北京 (Běijīng - ปักกิ่ง), 上海 (Shànghǎi - เซี่ยงไฮ้)"
    ],
    listening: [
      "ฟังเสียงคำศัพท์คำคุณศัพท์และคำตรงข้าม",
      "ฟังประโยค 飞机快，火车慢。",
      "ฟังคำถาม 哪个快，哪个慢？"
    ],
    speaking: [
      "ฝึกพูดประโยคเปรียบเทียบ 飞机快，火车慢。",
      "ฝึกถาม-ตอบ 哪个快？哪个慢？",
      "ฝึกออกเสียงคำคุณศัพท์ 4 คู่ที่สำคัญ"
    ],
    fun: [
      "เกมจับคู่คำศัพท์คำตรงข้าม (เช่น 快 คู่กับ 慢)",
      "เกมสุ่มภาพยานพาหนะแล้วบอกคุณสมบัติ (เร็ว/ช้า)",
      "เกมเลือกคำศัพท์ให้ตรงกับภาพเมืองที่กำหนด"
    ],
    reading: [
      "อ่านประโยค 飞机快，火车慢。",
      "อ่านชื่อเมืองและยานพาหนะในบทเรียน",
      "อ่านประโยคสั้นๆ เกี่ยวกับการเปรียบเทียบสิ่งต่างๆ"
    ],
    writing: [
      "ฝึกเขียน 快, 慢, 大, 小",
      "กิจกรรมเติมคำคุณศัพท์ลงในช่องว่างให้ตรงกับภาพ",
      "คัดคำศัพท์ยานพาหนะ"
    ],
    pinyin: [
      "ฝึกอ่านพินอิน fēijī, huǒchē, Běijīng",
      "ฝึกแยกเสียงวรรณยุกต์ของคำว่า kuài และ màn",
      "ฝึกอ่านออกเสียงสระประสมในบทเรียน"
    ]
  };

  const items = lesson.id === 6 
    ? [
        "ฉันบอกชื่อยานพาหนะและคำคุณศัพท์ตรงข้ามเป็นภาษาจีนได้",
        "ฉันเปรียบเทียบความเร็วของสิ่งของได้",
        "ฉันอ่านและเขียนตัวอักษรจีนสำคัญของบทนี้ได้",
        "ฉันเข้าใจการออกเสียงชื่อเมืองสำคัญในจีน"
      ]
    : Array.from({ length: 5 }).map((_, i) => `ฉันเรียนรู้เนื้อหาบทที่ ${lesson.id} ส่วนที่ ${i+1} แล้ว`);

  const handleSpeak = (text: string) => {
    speak(text);
  };

  const isAllChecked = Object.values(checkedItems).filter(Boolean).length === items.length;

  return (
    <div className="space-y-12 pb-20">
      <div className="bg-chinese-red p-8 rounded-4xl text-white shadow-lg relative overflow-hidden">
        <h3 className="text-3xl font-black mb-2 uppercase tracking-tight">สรุปบทเรียน (SUMMARY)</h3>
        <p className="font-bold opacity-90">บทที่ {lesson.id}: {lesson.title}</p>
        <Trophy className="w-48 h-48 absolute -right-12 -bottom-12 text-white/10 rotate-12" />
      </div>

      {/* เรียนอะไรมาบ้าง section */}
      {lesson.id === 6 ? (
        <SummaryDetails data={lesson6Summary} />
      ) : (
        <SummaryDetails data={{
          learned: ["รอเพิ่มเนื้อหาของบทนี้"],
          listening: ["รอเพิ่มเนื้อหาของบทนี้"],
          speaking: ["รอเพิ่มเนื้อหาของบทนี้"],
          fun: ["รอเพิ่มเนื้อหาของบทนี้"],
          reading: ["รอเพิ่มเนื้อหาของบทนี้"],
          writing: ["รอเพิ่มเนื้อหาของบทนี้"],
          pinyin: ["รอเพิ่มเนื้อหาของบทนี้"]
        }} />
      )}

      <section className="space-y-6">
        <div className="flex items-center gap-3"><div className="w-2 h-8 bg-chinese-red rounded-full" /><h4 className="text-2xl font-black text-gray-900">1. คำศัพท์สำคัญ</h4></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {lesson.id >= 7 ? (
            <div className="bg-white p-8 rounded-3xl border-2 border-dashed border-gray-200 text-center col-span-full">
              <p className="text-gray-400 font-bold italic">รอเพิ่มคำศัพท์สำคัญของบทนี้</p>
            </div>
          ) : (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={`gen-sum-v-${i}`} className="bg-white p-4 rounded-3xl border-2 border-gray-50 text-center hover:border-chinese-red shadow-sm flex flex-col items-center">
                <p className="text-2xl font-chinese font-black text-gray-900 mb-1">待添加</p>
                <p className="text-xs font-bold text-chinese-red mb-1">dài tiānjiā</p>
                <button onClick={() => handleSpeak("待添加")} className="w-8 h-8 bg-chinese-red/10 text-chinese-red rounded-xl flex items-center justify-center"><Volume2 className="w-4 h-4" /></button>
              </div>
            ))
          )}
        </div>
      </section>

      {lesson.id >= 7 && (
        <section className="space-y-6">
          <div className="flex items-center gap-3"><div className="w-2 h-8 bg-chinese-gold rounded-full" /><h4 className="text-2xl font-black text-gray-900">2. รูปแบบประโยค</h4></div>
          <div className="bg-white p-8 rounded-3xl border-2 border-dashed border-gray-200 text-center">
            <p className="text-gray-400 font-bold italic">รอเพิ่มรูปแบบประโยคของบทนี้</p>
          </div>
        </section>
      )}

      {lesson.id >= 7 && (
        <section className="space-y-6">
          <div className="flex items-center gap-3"><div className="w-2 h-8 bg-blue-500 rounded-full" /><h4 className="text-2xl font-black text-gray-900">3. กิจกรรมสรุป</h4></div>
          <div className="bg-white p-8 rounded-3xl border-2 border-dashed border-gray-200 text-center">
            <p className="text-gray-400 font-bold italic">รอเพิ่มกิจกรรมสรุปของบทนี้</p>
          </div>
        </section>
      )}

      <section className="space-y-6">
        <div className="flex items-center gap-3"><div className="w-2 h-8 bg-emerald-500 rounded-full" /><h4 className="text-2xl font-black text-gray-900">{lesson.id >= 7 ? "4. เช็กความพร้อม" : "4. เช็กความพร้อม"}</h4></div>
        <div className="bg-white p-10 rounded-[3rem] border-2 border-emerald-100 shadow-sm space-y-6">
          {items.map((item, idx) => (
            <label key={`gen-check-${idx}`} className="flex items-center gap-4 p-4 hover:bg-emerald-50 rounded-3xl cursor-pointer">
              <input type="checkbox" checked={checkedItems[idx] || false} onChange={() => setCheckedItems(prev => ({ ...prev, [idx]: !prev[idx] }))} className="w-8 h-8 rounded-xl border-4 border-emerald-100 text-emerald-500 transition-all" />
              <span className={cn("text-lg font-bold transition-all", checkedItems[idx] ? "text-emerald-600 line-through opacity-50" : "text-gray-700")}>{item}</span>
            </label>
          ))}
          {isAllChecked && (
             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mt-8 bg-emerald-500 p-8 rounded-4xl text-center text-white space-y-2 shadow-xl ring-8 ring-emerald-50">
                <Trophy className="w-16 h-16 mx-auto mb-4 animate-bounce" />
                <h5 className="text-3xl font-black">พร้อมแล้ว!</h5>
                <p className="text-xl font-bold opacity-90">คุณเรียนบทเรียนนี้สำเร็จ</p>
             </motion.div>
          )}
        </div>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-3 gap-4">
         {[
           { label: "กลับไปฟัง", target: ActivityType.LISTENING, icon: <Bell className="w-5 h-5" />, color: "bg-orange-500" },
           { label: "กลับไปพูด", target: ActivityType.SPEAKING, icon: <Sparkles className="w-5 h-5" />, color: "bg-emerald-500" },
           { label: "สรุป", target: ActivityType.FINAL, icon: <Trophy className="w-5 h-5" />, color: "bg-chinese-red" },
         ].map((btn, i) => (
           <button key={`gen-nav-${i}`} onClick={() => setActiveActivity(btn.target)} className={cn("p-6 rounded-3xl text-white font-black flex items-center justify-center gap-3 shadow-lg hover:scale-105 active:scale-95 transition-all text-sm", btn.color)}>
              {btn.icon} {btn.label}
           </button>
         ))}
      </section>
    </div>
  );
};

const FinalReviewLesson = ({ lesson, speak }: { lesson: any, speak: (t: string, r?: number) => void }) => {
  const [completedUnits, setCompletedUnits] = useState<number[]>([]);
  const [activeUnit, setActiveUnit] = useState<number | null>(1);
  const [showGrandChallenge, setShowGrandChallenge] = useState(false);
  const [scores, setScores] = useState<Record<number, number>>({});
  
  // Progress tracking
  const overallProgress = (completedUnits.length / 9) * 100;

  const handleUnitComplete = (unitId: number) => {
    if (!completedUnits.includes(unitId)) {
      setCompletedUnits(prev => [...prev, unitId]);
    }
  };

  if (showGrandChallenge) {
    return <GrandChallenge onBack={() => setShowGrandChallenge(false)} speak={speak} />;
  }

  return (
    <div className="space-y-8 pb-20 fade-slide-up">
      {/* Header section */}
      <div className="bg-gradient-to-r from-chinese-red to-orange-500 p-10 rounded-[3rem] text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
           <div className="w-24 h-24 bg-white/20 rounded-4xl backdrop-blur-md flex items-center justify-center border-4 border-white/30 shadow-2xl shrink-0">
              <Trophy className="w-12 h-12 text-white" />
           </div>
           <div className="text-center md:text-left">
              <h2 className="text-4xl font-black mb-2 tracking-tight">กิจกรรมรวมทุกบทเรียน (FINAL REVIEW)</h2>
              <p className="text-white/80 font-bold text-lg max-w-2xl">รวมเกมทบทวนความรู้แสนสนุกจากบทที่ 1-9 มาทดสอบฝีมือกันเถอะ!</p>
           </div>
        </div>
        <Sparkles className="absolute -right-8 -top-8 w-64 h-64 text-white/5 rotate-12" />
      </div>

      {/* Progress Card */}
      <div className="bg-white p-8 rounded-4xl border-2 border-chinese-red/5 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 border-b-8">
        <div className="space-y-2 text-center md:text-left">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Review Progress</p>
           <h3 className="text-3xl font-black text-gray-900">ทบทวนไปแล้ว <span className="text-chinese-red">{completedUnits.length}</span> จาก 9 บทเรียน</h3>
        </div>
        <div className="flex items-center gap-6 w-full md:w-1/2">
           <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden border-2 border-gray-100 p-1">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${overallProgress}%` }}
                className="h-full bg-gradient-to-r from-chinese-red to-orange-500 rounded-full shadow-lg"
              />
           </div>
           <p className="text-2xl font-black text-chinese-red">{Math.round(overallProgress)}%</p>
        </div>
      </div>

      {/* Unit Cards */}
      <div className="grid grid-cols-1 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((u) => {
          const lData = LESSONS_DATA.find(l => l.id === u);
          const isCompleted = completedUnits.includes(u);
          const isActive = activeUnit === u;

          return (
            <motion.div 
              key={`review-unit-${u}`}
              className={cn(
                "bg-white rounded-[2.5rem] border-2 transition-all overflow-hidden",
                isActive ? "border-chinese-red shadow-2xl" : "border-gray-100 hover:border-chinese-red/20 border-b-8"
              )}
            >
              <div 
                className={cn(
                  "p-6 md:p-8 flex items-center justify-between cursor-pointer",
                  isActive ? "bg-chinese-red/5" : "bg-white"
                )}
                onClick={() => setActiveUnit(isActive ? null : u)}
              >
                <div className="flex items-center gap-6">
                  <div className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl transition-all",
                    isCompleted ? "bg-emerald-500 text-white" : (isActive ? "bg-chinese-red text-white" : "bg-gray-100 text-gray-400")
                  )}>
                    {isCompleted ? <CheckCircle2 className="w-8 h-8" /> : u}
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-gray-900">{lData?.translation.split(' (')[0]}</h4>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{lData?.title}</p>
                    <p className="text-[10px] items-center gap-1 font-bold text-chinese-red mt-1 flex">
                       <Sparkles className="w-3 h-3" /> กิจกรรมนี้มาจากบทเรียนที่ {u}
                    </p>
                  </div>
                </div>
                {isActive ? <X className="text-gray-400" /> : <ChevronRight className="text-gray-400" />}
              </div>

              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t-2 border-gray-50 bg-gray-50/50"
                  >
                    <div className="p-8">
                       <ReviewUnitContent unitId={u} speak={speak} onComplete={() => handleUnitComplete(u)} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Final Grand Challenge Button */}
      {completedUnits.length >= 9 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-10"
        >
          <button 
            onClick={() => setShowGrandChallenge(true)}
            className="w-full group bg-gradient-to-r from-indigo-600 to-indigo-400 p-1 rounded-[3rem] shadow-2xl relative overflow-hidden"
          >
            <div className="bg-white/90 backdrop-blur-sm m-1 p-10 rounded-[2.8rem] flex flex-col items-center gap-6 transition-all group-hover:bg-transparent group-hover:text-white">
               <div className="w-24 h-24 bg-indigo-100 rounded-4xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <Star className="w-12 h-12 text-indigo-600 group-hover:text-white group-hover:animate-spin-slow" />
               </div>
               <div className="text-center">
                  <h3 className="text-4xl font-black mb-2 tracking-tighter">Grand Review Challenge</h3>
                  <p className="text-indigo-600/60 font-bold text-xl group-hover:text-white/80">ทบทวนครบทั้ง 9 บทแล้ว! ท้าทายกับภารกิจสุดท้ายรวมบทที่ 1-9 ครั้งใหญ่!</p>
               </div>
               <ChineseButton variant="primary" size="lg" className="px-16 py-6 text-2xl shadow-xl">
                  เริ่มความท้าทาย (Start Now)
               </ChineseButton>
            </div>
            {/* Animated Stars */}
            <div className="absolute top-10 left-10 animate-bounce delay-100"><Sparkles className="text-indigo-300 w-8 h-8 opacity-20" /></div>
            <div className="absolute bottom-10 right-20 animate-pulse"><Sparkles className="text-white w-12 h-12 opacity-30" /></div>
          </button>
        </motion.div>
      )}
    </div>
  );
};

const ReviewUnitContent = ({ unitId, speak, onComplete }: { unitId: number, speak: (t: string) => void, onComplete: () => void }) => {
  const [step, setStep] = useState(1);
  const lData = LESSONS_DATA.find(l => l.id === unitId);
  const vocabulary = lData?.vocabulary || [];

  // Local scores
  const [g1Score, setG1Score] = useState(0);
  const [g2Score, setG2Score] = useState(0);

  const reset = () => {
    setStep(1);
    setG1Score(0);
    setG2Score(0);
  };

  const handleFinishStep = () => {
    if (step === 1) setStep(2);
    else onComplete();
  };

  // Helper patterns for unit activities
  const renderGame1 = () => {
    // Game 1: vocabulary matching usually
    const items = vocabulary.slice(0, 6);
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-4">
           <div className="flex items-center gap-2 bg-chinese-red/10 text-chinese-red px-4 py-2 rounded-xl text-xs font-bold font-chinese">
             <Layers className="w-4 h-4" /> กิจกรรม 1: จับคู่คำศัพท์ (Vocab Matching)
           </div>
        </div>
        
        <MatchingGame items={items} speak={speak} onScoreChange={setG1Score} onFinish={handleFinishStep} />
      </div>
    );
  };

  const renderGame2 = () => {
    // Game 2: sentence building or fill blanks
    return (
      <div className="space-y-6">
         <div className="flex items-center justify-between mb-4">
           <div className="flex items-center gap-2 bg-emerald-100 text-emerald-600 px-4 py-2 rounded-xl text-xs font-bold font-chinese">
             <MessageCircle className="w-4 h-4" /> กิจกรรม 2: ฝึกประโยค (Sentence Review)
           </div>
        </div>
        <SentenceGame unitId={unitId} speak={speak} onComplete={handleFinishStep} />
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {step === 1 ? renderGame1() : renderGame2()}
    </div>
  );
};

// Sub-components for Review Games
const MatchingGame = ({ items, speak, onScoreChange, onFinish }: { items: any[], speak: (t: string) => void, onScoreChange: (s: number) => void, onFinish: () => void }) => {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [shuffledChinese, setShuffledChinese] = useState<any[]>([]);
  const [shuffledThai, setShuffledThai] = useState<any[]>([]);

  useEffect(() => {
    setShuffledChinese([...items].sort(() => Math.random() - 0.5));
    setShuffledThai([...items].sort(() => Math.random() - 0.5));
  }, [items]);

  const handleChineseClick = (word: string) => {
    speak(word);
    setSelectedWord(word);
  };

  const handleThaiClick = (word: string) => {
    if (selectedWord === word) {
      const newMatched = [...matched, word];
      setMatched(newMatched);
      setSelectedWord(null);
      onScoreChange(newMatched.length);
      if (newMatched.length === items.length) {
        setTimeout(onFinish, 1000);
      }
    } else {
      setSelectedWord(null);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-8">
       <div className="space-y-4">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest text-center mb-4">เลือกคำศัพท์จีน</p>
          <div className="grid grid-cols-1 gap-3">
             {shuffledChinese.map(item => (
                <button
                  key={`match-zh-${item.word}`}
                  onClick={() => handleChineseClick(item.word)}
                  disabled={matched.includes(item.word)}
                  className={cn(
                    "p-4 rounded-2xl border-b-4 font-chinese font-black text-2xl transition-all shadow-sm",
                    matched.includes(item.word) ? "bg-emerald-50 text-emerald-300 border-emerald-100 opacity-50" :
                    selectedWord === item.word ? "bg-chinese-red text-white border-chinese-red-dark scale-105" : "bg-white text-gray-700 border-gray-100 hover:border-chinese-red/30"
                  )}
                >
                  {item.word}
                </button>
             ))}
          </div>
       </div>
       <div className="space-y-4">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest text-center mb-4">เลือกคำแปลไทย</p>
          <div className="grid grid-cols-1 gap-3">
             {shuffledThai.map(item => (
                <button
                  key={`match-th-${item.word}`}
                  onClick={() => handleThaiClick(item.word)}
                  disabled={matched.includes(item.word)}
                  className={cn(
                    "p-4 rounded-2xl border-b-4 font-bold text-lg transition-all shadow-sm h-full",
                    matched.includes(item.word) ? "bg-emerald-50 text-emerald-500 border-emerald-100 opacity-50 font-black italic" :
                    "bg-white text-gray-700 border-gray-100 hover:border-chinese-red/30"
                  )}
                >
                  {item.translation.split(' (')[0]}
                </button>
             ))}
          </div>
       </div>
    </div>
  );
};

const SentenceGame = ({ unitId, speak, onComplete }: { unitId: number, speak: (t: string) => void, onComplete: () => void }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userInput, setUserInput] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Sentences for each unit review (simplified subset)
  const sentencesByUnit: Record<number, {zh: string, words: string[], pinyin: string, th: string}[]> = {
    1: [{ zh: "这里是电影院。", words: ["这里", "是", "电影院", "。"], pinyin: "Zhèlǐ shì diànyǐngyuàn.", th: "ที่นี่คือโรงภาพยนตร์" }],
    2: [{ zh: "星期天不下雨。", words: ["星期天", "不", "下雨", "。"], pinyin: "Xīngqītiān bú xià yǔ.", th: "วันอาทิตย์ฝนไม่ตก" }],
    3: [{ zh: "你怎么去动物园？", words: ["你", "怎么", "去", "动物园", "？"], pinyin: "Nǐ zěnme qù dòngwùyuán?", th: "เธอไปสวนสัตว์อย่างไร" }],
    4: [{ zh: "他是一名职员。", words: ["他", "是", "一名", "职员", "。"], pinyin: "Tā shì yīmíng zhíyuán.", th: "เขาเป็นพนักงานบริษัท" }],
    5: [{ zh: "他在跑步。", words: ["他", "在", "跑步", "。"], pinyin: "Tā zài pǎobù.", th: "เขากำลังวิ่ง" }],
    6: [{ zh: "飞机快，火车慢。", words: ["飞机", "快", "，", "火车", "慢", "。"], pinyin: "Fēijī kuài, huǒchē màn.", th: "เครื่องบินเร็ว รถไฟช้า" }],
    7: [{ zh: "我的肚子疼。", words: ["我的", "肚子", "疼", "。"], pinyin: "Wǒ de dùzi téng.", th: "ฉันปวดท้อง" }],
    8: [{ zh: "学袋鼠，跳一跳。", words: ["学", "袋鼠", "，", "跳", "一", "跳", "。"], pinyin: "Xué dàishǔ, tiào yi tiào.", th: "ทำท่ากระโดดเหมือนจิงโจ้" }],
    9: [{ zh: "我最喜欢拔河比赛。", words: ["我", "最", "喜欢", "拔河", "比赛", "。"], pinyin: "Wǒ zuì xǐhuan báhé bǐsài.", th: "ฉันชอบการแข่งขันชักเย่อมากที่สุด" }]
  };

  const sentences = sentencesByUnit[unitId] || [];
  const current = sentences[currentIdx] || sentences[0];

  const handleWordClick = (word: string) => {
    setUserInput(prev => [...prev, word]);
  };

  const check = () => {
    const result = userInput.join('') === current.zh;
    setIsCorrect(result);
    if (result) {
      speak(current.zh);
      setTimeout(() => {
        if (currentIdx < sentences.length - 1) {
          setCurrentIdx(prev => prev + 1);
          setUserInput([]);
          setIsCorrect(null);
        } else {
          onComplete();
        }
      }, 2000);
    } else {
      setTimeout(() => {
        setUserInput([]);
        setIsCorrect(null);
      }, 1500);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
       <div className="bg-white p-10 rounded-4xl shadow-sm border-2 border-dashed border-emerald-200">
          <p className="text-4xl text-center font-bold text-emerald-600 mb-2 italic">"{current.th}"</p>
          <div className="flex flex-wrap justify-center gap-2 min-h-[60px] p-4 bg-emerald-50 rounded-2xl">
             {userInput.map((w, i) => (
                <motion.span 
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  key={`sentence-word-${i}`} 
                  className="px-4 py-2 bg-emerald-500 text-white rounded-xl font-chinese text-2xl font-black shadow-lg"
                >
                  {w}
                </motion.span>
             ))}
          </div>
       </div>

       <div className="flex flex-wrap justify-center gap-3">
          {current.words.sort(() => Math.random() - 0.5).map((w, i) => (
             <button
               key={`option-word-${i}`}
               onClick={() => handleWordClick(w)}
               disabled={userInput.includes(w) && current.words.filter(cw => cw === w).length === userInput.filter(uw => uw === w).length}
               className="px-6 py-3 bg-white border-b-4 border-gray-100 rounded-2xl font-chinese text-2xl font-black text-gray-700 hover:border-emerald-500 hover:text-emerald-500 transition-all active:translate-y-1 shadow-sm"
             >
               {w}
             </button>
          ))}
       </div>

       <div className="flex justify-center gap-4">
          <button 
            onClick={() => setUserInput([])} 
            className="px-8 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black uppercase text-xs"
          >
            ล้างคำตอบ (Clear)
          </button>
          <button 
            onClick={check} 
            disabled={userInput.length === 0}
            className="px-10 py-4 bg-emerald-500 text-white rounded-2xl font-black shadow-lg hover:scale-105 active:scale-95 transition-all text-lg"
          >
            ตรวจสอบ (Check)
          </button>
       </div>

       {isCorrect === true && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center font-black text-emerald-500 text-2xl flex items-center justify-center gap-2">
             <Trophy className="w-8 h-8" /> ยอดเยี่ยม! ประโยคนี้ถูกต้องแล้ว
          </motion.div>
       )}
       {isCorrect === false && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center font-black text-chinese-red text-2xl flex items-center justify-center gap-2">
             <X className="w-8 h-8" /> ยังเรียงลำดับไม่ถูกนะ ลองเล่นใหม่อีกครั้ง!
          </motion.div>
       )}
    </div>
  );
};

const GrandChallenge = ({ onBack, speak }: { onBack: () => void, speak: (t: string) => void }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  
  // Generate 18 questions randomly from Units 1-9
  const challengePool = useMemo(() => {
    const pool: any[] = [];
    [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(u => {
      const lesson = LESSONS_DATA.find(l => l.id === u);
      if (lesson) {
        // Add 2 vocab from each unit
        const v = lesson.vocabulary.slice(0, 5).sort(() => Math.random() - 0.5).slice(0, 2);
        v.forEach(item => {
           // Distractors from other units
           const distractors = LESSONS_DATA
            .filter(ld => ld.id !== u)
            .flatMap(ld => ld.vocabulary)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map(d => d.translation.split(' (')[0]);
           
           pool.push({
             type: 'vocab',
             unit: u,
             zh: item.word,
             ans: item.translation.split(' (')[0],
             options: [item.translation.split(' (')[0], ...distractors].sort(() => Math.random() - 0.5)
           });
        });
      }
    });
    return pool.sort(() => Math.random() - 0.5).slice(0, 18);
  }, []);

  const currentQ = challengePool[currentIdx];

  const handleAnswer = (ans: string) => {
    if (ans === currentQ.ans) {
      setScore(prev => prev + 1);
      speak(currentQ.zh || ans);
    }
    
    if (currentIdx < challengePool.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setFinished(true);
    }
  };

  if (finished) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center space-y-10 fade-slide-up">
         <div className="relative inline-block">
            <Trophy className="w-64 h-64 text-chinese-gold animate-bounce" />
            <Sparkles className="absolute -top-10 -right-10 w-20 h-20 text-chinese-gold animate-pulse" />
         </div>
         <div className="space-y-4">
            <h2 className="text-6xl font-black text-gray-900 leading-tight">ยอดเยี่ยมที่สุด! 🎉</h2>
            <p className="text-2xl font-bold text-gray-500 italic">คุณทบทวนครบทั้ง 9 บทแล้วและทำแบบทดสอบผ่านฉลุย!</p>
            <div className="text-chinese-red font-black text-4xl py-6 bg-chinese-red/5 rounded-3xl inline-block px-12">
               SCORE: {score} / {challengePool.length}
            </div>
         </div>
         <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <button onClick={() => window.location.href = '/lesson/1'} className="px-10 py-5 bg-chinese-red text-white rounded-[2rem] font-black shadow-xl hover:scale-105 active:scale-95 transition-all text-xl">
               กลับไปบทที่ 1
            </button>
            <button onClick={() => window.location.reload()} className="px-10 py-5 bg-emerald-500 text-white rounded-[2rem] font-black shadow-xl hover:scale-105 active:scale-95 transition-all text-xl">
               ทบทวนอีกครั้ง
            </button>
            <button onClick={onBack} className="px-10 py-5 bg-gray-600 text-white rounded-[2rem] font-black shadow-xl hover:scale-105 active:scale-95 transition-all text-xl">
               จบกิจกรรม
            </button>
         </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 fade-slide-up">
       <div className="flex items-center justify-between bg-white px-8 py-6 rounded-[2.5rem] border-2 border-indigo-100 shadow-xl border-b-8">
          <div className="flex items-center gap-4">
             <button onClick={onBack} className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400">
                <X className="w-6 h-6" />
             </button>
             <h3 className="text-xl font-black text-indigo-600">Grand Challenge</h3>
          </div>
          <div className="flex flex-col items-end">
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Mission Progress</p>
             <p className="text-xl font-black text-gray-900">{currentIdx + 1} / {challengePool.length}</p>
          </div>
       </div>

       <div className="bg-white rounded-[4rem] border-4 border-indigo-50 shadow-2xl p-8 md:p-16 relative overflow-hidden">
          <div className="absolute top-8 left-8 py-2 px-4 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2">
             <BookOpen className="w-4 h-4" /> มาจากบทเรียนที่ {currentQ.unit}
          </div>

          <div className="text-center space-y-12">
             <div className="space-y-6">
                <p className="text-xl font-bold text-gray-400 italic">เลือกความหมายที่ถูกต้อง</p>
                <h4 className="text-8xl md:text-9xl font-chinese font-black text-gray-900 animate-pulse-slow">{currentQ.zh}</h4>
                <button onClick={() => speak(currentQ.zh)} className="mx-auto w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all shadow-md">
                   <Volume2 className="w-8 h-8" />
                </button>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentQ.options.map((opt: string, i: number) => (
                   <button
                     key={`challenge-opt-${i}`}
                     onClick={() => handleAnswer(opt)}
                     className="p-6 bg-indigo-50/30 border-2 border-indigo-50 rounded-[2rem] font-bold text-xl text-indigo-900 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all active:scale-95 shadow-sm border-b-6 active:border-b-2"
                   >
                     {opt}
                   </button>
                ))}
             </div>
          </div>
       </div>
    </div>
  );
};

const VocabLibrary = ({ lesson, speak }: { lesson: any, speak: (t: string, r?: number) => void }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [activeLetter, setActiveLetter] = useState<string | null>(null);

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const filteredVocab = (lesson?.vocabulary || []).filter((v: any) => {
    const matchesSearch = 
      v.word.includes(searchTerm) || 
      v.pinyin.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (v.translation || "").includes(searchTerm);
    
    // Safely check pinyin[0]
    const pinyinChar = v.pinyin && v.pinyin[0] ? v.pinyin[0].toUpperCase() : "";
    const matchesLetter = activeLetter ? pinyinChar === activeLetter : true;
    
    return matchesSearch && matchesLetter;
  });

  return (
    <div className="space-y-8 pb-20 fade-slide-up">
      {/* Header section with instructions */}
      <div className="bg-chinese-red p-10 rounded-[3rem] text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex items-center gap-8">
           <div className="w-24 h-24 bg-white/20 rounded-4xl backdrop-blur-md flex items-center justify-center border-4 border-white/30 shadow-2xl">
              <Book className="w-12 h-12 text-white" />
           </div>
           <div>
              <h2 className="text-4xl font-black mb-2 tracking-tight">คลังคำศัพท์ (VOCAB LIBRARY)</h2>
              <p className="text- chinese-red-100 font-bold opacity-80 text-lg">รวบรวมคำศัพท์ทั้งหมดจากบทเรียนที่ 1-9 มาไว้ในที่เดียว</p>
           </div>
        </div>
        <Sparkles className="absolute -right-8 -top-8 w-64 h-64 text-white/5 rotate-12" />
        <BookOpen className="absolute right-10 bottom-6 w-32 h-32 text-white/10" />
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-8 rounded-4xl border-2 border-chinese-red/5 shadow-2xl space-y-8 sticky top-24 z-30 backdrop-blur-xl bg-white/90 border-b-8">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6 group-focus-within:text-chinese-red transition-colors" />
            <input 
              type="text"
              placeholder="ค้นหาคำศัพท์ พินอิน หรือความหมาย..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-5 bg-gray-50 border-2 border-transparent focus:border-chinese-red focus:bg-white rounded-[2rem] outline-none transition-all font-black text-lg shadow-inner"
            />
          </div>
          <div className="flex gap-2 p-2 bg-gray-50 rounded-3xl border-2 border-gray-100">
            <button 
              onClick={() => setViewMode("grid")}
              className={cn(
                "px-6 py-3 rounded-2xl transition-all font-black flex items-center gap-2", 
                viewMode === "grid" ? "bg-chinese-red text-white shadow-lg scale-105" : "text-gray-400 hover:text-chinese-red"
              )}
            >
              <LayoutGrid className="w-5 h-5" />
              การ์ด
            </button>
            <button 
              onClick={() => setViewMode("table")}
              className={cn(
                "px-6 py-3 rounded-2xl transition-all font-black flex items-center gap-2", 
                viewMode === "table" ? "bg-chinese-red text-white shadow-lg scale-105" : "text-gray-400 hover:text-chinese-red"
              )}
            >
              <Table className="w-5 h-5" />
              ตาราง
            </button>
          </div>
        </div>

        {/* A-Z Filter */}
        <div className="space-y-3">
          <h5 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
            <Filter className="w-3 h-3" />
            ตัวอักษรนำพินอิน (Pinyin Filter)
          </h5>
          <div className="flex overflow-x-auto no-scrollbar gap-2 pb-2 -mx-2 px-2">
            <button 
              onClick={() => setActiveLetter(null)}
              className={cn(
                "flex-shrink-0 min-w-[60px] h-12 rounded-2xl font-black text-sm transition-all border-b-6 active:translate-y-1 active:border-b-2",
                activeLetter === null 
                  ? "bg-chinese-red text-white border-chinese-red-dark shadow-lg ring-4 ring-chinese-red/10" 
                  : "bg-white text-gray-400 border-gray-100 hover:border-chinese-red/20"
              )}
            >
              ทั้งหมด
            </button>
            {alphabet.map(letter => (
              <button 
                key={letter}
                onClick={() => setActiveLetter(activeLetter === letter ? null : letter)}
                className={cn(
                  "flex-shrink-0 w-12 h-12 rounded-2xl font-black text-lg transition-all border-b-6 active:translate-y-1 active:border-b-2",
                  activeLetter === letter 
                    ? "bg-chinese-red text-white border-chinese-red-dark shadow-lg ring-4 ring-chinese-red/10" 
                    : "bg-white text-gray-400 border-gray-100 hover:border-chinese-red"
                )}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Rendering */}
      <AnimatePresence mode="wait">
        {viewMode === "grid" ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredVocab.map((v: any, i: number) => (
              <motion.div
                layout
                key={`vocab-grid-${v.word}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.01 }}
                className="bg-white p-8 rounded-[2.5rem] border-2 border-gray-100 shadow-xl hover:border-chinese-red transition-all group relative overflow-hidden flex flex-col items-center text-center hover:scale-[1.02] cursor-pointer"
                onClick={() => speak(v.word)}
              >
                {/* Chinese Ornament Background */}
                <div className="absolute top-2 right-2 w-20 h-20 bg-chinese-red/5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rotate-45">
                   <Sparkles className="w-10 h-10 text-chinese-red/20" />
                </div>

                <div className="mb-6 relative">
                   <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center text-5xl group-hover:bg-chinese-red/10 transition-colors shadow-inner border-2 border-transparent group-hover:border-chinese-red/20">
                    {v.icon || "💮"}
                  </div>
                  <div className="absolute -top-3 -right-3 bg-white px-2 py-1 rounded-lg shadow-sm border border-gray-100 text-[10px] font-black text-gray-400">
                    หน้า {v.page}
                  </div>
                </div>

                <div className="space-y-2 flex-1">
                  <h4 className="text-4xl font-chinese font-black text-gray-900 group-hover:text-chinese-red transition-colors">{v.word}</h4>
                  <div className="space-y-0.5">
                    <p className="text-xl font-bold text-chinese-red/70 tracking-widest">{v.pinyin}</p>
                    <p className="text-lg font-bold text-gray-400">{v.translation}</p>
                  </div>
                </div>

                <div className="mt-6 w-full pt-6 border-t-2 border-dashed border-gray-50">
                  <button 
                    className="w-full py-4 bg-chinese-red/5 text-chinese-red rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-chinese-red hover:text-white transition-all shadow-sm active:scale-95"
                  >
                    <Volume2 className="w-6 h-6" />
                    ฟังเสียงพื้นฐาน
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-5xl border-4 border-chinese-red/5 shadow-2xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b-4 border-gray-100">
                    <th className="px-10 py-6 font-black text-gray-400 uppercase tracking-widest text-xs">คำศัพท์ (Character)</th>
                    <th className="px-10 py-6 font-black text-gray-400 uppercase tracking-widest text-xs">พินอิน (Pinyin)</th>
                    <th className="px-10 py-6 font-black text-gray-400 uppercase tracking-widest text-xs">ความหมาย (Thai)</th>
                    <th className="px-10 py-6 font-black text-gray-400 uppercase tracking-widest text-xs">หน้า (Page)</th>
                    <th className="px-10 py-6 font-black text-gray-400 uppercase tracking-widest text-xs text-right">เสียง</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredVocab.map((v: any) => (
                    <tr key={`vocab-row-${v.word}`} className="hover:bg-chinese-red/[0.03] transition-colors group">
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-6">
                          <span className="text-3xl w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-sm">{v.icon || "💮"}</span>
                          <span className="text-4xl font-chinese font-black text-gray-900 group-hover:text-chinese-red transition-all">{v.word}</span>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <span className="font-bold text-chinese-red text-2xl tracking-[0.1em]">{v.pinyin}</span>
                      </td>
                      <td className="px-10 py-8">
                        <span className="text-xl text-gray-400 font-bold">{v.translation}</span>
                      </td>
                      <td className="px-10 py-8">
                        <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-400 px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest">
                          P. {v.page}
                        </div>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <button 
                          onClick={() => speak(v.word)}
                          className="w-14 h-14 bg-white border-2 border-gray-100 text-chinese-red rounded-2xl inline-flex items-center justify-center hover:bg-chinese-red hover:text-white transition-all shadow-lg active:scale-90"
                        >
                          <Volume2 className="w-8 h-8" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {filteredVocab.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-32 space-y-8 bg-white/40 backdrop-blur-md rounded-[5rem] border-4 border-dashed border-gray-200"
        >
          <div className="relative inline-block">
            <Search className="w-32 h-32 text-gray-200" />
            <X className="w-12 h-12 text-chinese-red absolute bottom-2 right-2" />
          </div>
          <div className="space-y-4">
             <h3 className="text-4xl font-black text-gray-400">ไม่พบคำศัพท์ที่ค้นหา...</h3>
             <p className="text-gray-400 font-bold uppercase tracking-widest">No results found for your search criteria</p>
          </div>
          <button 
            onClick={() => { setSearchTerm(""); setActiveLetter(null); }} 
            className="px-10 py-4 bg-chinese-red text-white rounded-3xl font-black text-lg shadow-xl hover:bg-chinese-red-dark transition-all hover:scale-105 active:scale-95"
          >
            ล้างการค้นหาทั้งหมด
          </button>
        </motion.div>
      )}
    </div>
  );
};

const LessonView = () => {
  const { id } = useParams();
  const lesson = LESSONS_DATA.find(l => l.id === parseInt(id || "1"));
  const navigate = useNavigate();
  const { lock, isLocked, safeAction } = useGlobalLock();
  
  const [activeActivity, setActiveActivity] = useState<ActivityType>(
    lesson?.id === 12 ? ActivityType.FINAL_REVIEW : (lesson?.id === 11 ? ActivityType.LIBRARY : (lesson?.isSpecial ? ActivityType.VOCABULARY : ActivityType.LISTENING))
  );
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [results, setResult] = useState<Record<number, boolean | null>>({});
  const [attempts, setAttempts] = useState<Record<number, number>>({});
  const [showHint, setShowHint] = useState<Record<number, boolean>>({});
  const [animatingQuestion, setAnimatingQuestion] = useState<{ id: number, type: 'correct' | 'wrong' } | null>(null);

  const quizQuestions = useMemo(() => {
    if (!lesson) return [];
    const items = lesson.isSpecial 
      ? Array.from({ length: lesson.vocabulary.length }, (_, i) => i + 1) 
      : [1, 2, 3, 4, 5];
      
    return items.map(q => {
      const vocabItem = lesson.vocabulary[(q - 1) % lesson.vocabulary.length];
      let options = [vocabItem.translation.split(' (')[0]];
      
      if (lesson.isSpecial) {
        // Pull 3 random wrong answers from the same lesson
        const otherVocabs = lesson.vocabulary.filter(v => v.word !== vocabItem.word);
        const distractors = [...otherVocabs]
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map(v => v.translation.split(' (')[0]);
        options = [...options, ...distractors].sort(() => Math.random() - 0.5);
      } else {
        options = ["ตัวเลือกที่ 1", "ตัวเลือกที่ 2", "ตัวเลือกที่ 3", "ตัวเลือกที่ 4"];
      }
      return { q, vocabItem, options };
    });
  }, [lesson]);

  const sounds = useMemo(() => ({
    click: new Audio("https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg"),
    correct: new Audio("https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg"),
    wrong: new Audio("https://actions.google.com/sounds/v1/cartoon/boing.ogg")
  }), []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id, activeActivity]);

  const playSound = useCallback((type: 'click' | 'correct' | 'wrong') => {
    if (isLocked) return;
    const s = sounds[type];
    if (!s) return;
    s.currentTime = 0;
    s.play().catch(() => {});
  }, [isLocked, sounds]);

  const handleAnswerChange = safeAction((questionId: number, value: string) => {
    playSound('click');
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  }, 500);

  const checkAnswer = safeAction((questionId: number) => {
    const selected = answers[questionId];
    if (!selected) return;

    const question = quizQuestions.find(item => item.q === questionId);
    if (!question) return;

    const isCorrect = selected === question.vocabItem.translation.split(' (')[0];
    setResult(prev => ({ ...prev, [questionId]: isCorrect }));
    setAnimatingQuestion({ id: questionId, type: isCorrect ? 'correct' : 'wrong' });
    setTimeout(() => setAnimatingQuestion(null), 500);

    if (isCorrect) {
      playSound('correct');
    } else {
      playSound('wrong');
      const newAttempts = (attempts[questionId] || 0) + 1;
      setAttempts(prev => ({ ...prev, [questionId]: newAttempts }));
      if (newAttempts >= 2) {
        setShowHint(prev => ({ ...prev, [questionId]: true }));
      }
    }
  }, 1000);

  const [playingText, setPlayingText] = useState<string | null>(null);
  const [isSpeakingRow, setIsSpeakingRow] = useState(false);

  const speak = (text: string, rate: number = 0.8) => {
    speakChinese(text, {
      rate,
      onStart: () => setPlayingText(text),
      onEnd: () => setPlayingText(null)
    });
  };

  const pinyinSpeak = (py: string, rate: number = 0.75) => {
    speakPinyin(py, {
      rate,
      onStart: () => setPlayingText(py),
      onEnd: () => setPlayingText(null)
    });
  };

  const pinyinSequenceSpeak = async (list: string[], rate: number = 0.75) => {
    setIsSpeakingRow(true);
    await speakPinyinSequence(list, rate, (py) => setPlayingText(py), () => setPlayingText(null));
    setIsSpeakingRow(false);
  };

  if (!lesson) return <div>Lesson not found</div>;

  const activities = lesson.id === 11 ? [
    { type: ActivityType.LIBRARY, label: "คลังคำศัพท์", icon: Book, color: "bg-chinese-red" }
  ] : lesson.isSpecial ? [
    { type: ActivityType.VOCABULARY, label: "คำศัพท์", icon: BookOpen, color: "bg-chinese-red" },
    { type: ActivityType.FINAL, label: "แบบทดสอบ", icon: Trophy, color: "bg-emerald-500" }
  ] : [
    { type: ActivityType.LISTENING, label: "ฟัง", icon: Bell, color: "bg-orange-500" },
    { type: ActivityType.SPEAKING, label: "พูด", icon: Sparkles, color: "bg-emerald-500" },
    { type: ActivityType.READING, label: "อ่าน", icon: BookOpen, color: "bg-blue-500" },
    { type: ActivityType.WRITING, label: "เขียน", icon: Zap, color: "bg-purple-500" },
    { type: ActivityType.PINYIN, label: "พินอิน", icon: Star, color: "bg-chinese-gold" },
    { type: ActivityType.FUN, label: "หรรษา", icon: Gamepad2, color: "bg-pink-500" },
    { type: ActivityType.FINAL, label: "สรุป", icon: Trophy, color: "bg-chinese-red" }
  ];

  const renderActivityContent = () => {
    switch (activeActivity) {
      case ActivityType.VOCABULARY:
        return (
          <div className="space-y-6 fade-slide-up">
            <div className="bg-chinese-red/5 p-8 rounded-4xl border-2 border-chinese-red/10">
               <h3 className="text-2xl font-black text-chinese-red mb-2">คำศัพท์ประจำบทเรียน (VOCABULARY)</h3>
               <p className="font-bold text-gray-500">เรียนรู้คำศัพท์และคำสั่งที่ใช้ในห้องเรียน</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lesson.vocabulary.map((v, i) => (
                <motion.div 
                  key={`vocab-list-${v.word}-${i}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={cn(
                    "bg-white p-6 rounded-3xl border-2 border-gray-100 shadow-sm hover:border-chinese-red transition-all group cursor-pointer smooth-card",
                    playingText === v.word && "border-chinese-red ring-4 ring-chinese-red/10"
                  )}
                  onClick={() => speak(v.word)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-4xl font-chinese font-black text-gray-900 group-hover:text-chinese-red transition-colors">{v.word}</span>
                    <button 
                      className={cn(
                        "w-10 h-10 bg-chinese-red/10 rounded-full flex items-center justify-center text-chinese-red hover:bg-chinese-red hover:text-white transition-all shadow-sm smooth-button",
                        playingText === v.word && "audio-pulse bg-chinese-red text-white"
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        speak(v.word);
                      }}
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-bold text-chinese-red/70">{v.pinyin}</p>
                    <p className="font-bold text-gray-400">{v.translation}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case ActivityType.LISTENING:
        {
          if (lesson.id === 1 || lesson.id === 2 || lesson.id === 3 || lesson.id === 5) {
            return (
              <div className="space-y-12 pb-20">
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-400 p-8 rounded-4xl text-white shadow-lg relative overflow-hidden">
                   <div className="relative z-10 flex items-center gap-6">
                      <ThreeDContainer color="orange" size="lg" className="hidden md:flex">
                         <Volume2 size={48} />
                      </ThreeDContainer>
                      <div>
                         <h3 className="text-3xl font-black leading-tight mb-2 uppercase tracking-tight">กิจกรรมการฟัง (LISTENING)</h3>
                         <p className="text-orange-100 font-bold italic text-lg uppercase tracking-wider">บทที่ {lesson.id}: {lesson.title} {lesson.translation.split(' (')[0]}</p>
                      </div>
                   </div>
                   <Volume2 className="w-48 h-48 absolute -right-12 -bottom-12 text-white/10 rotate-12" />
                </div>

                {/* Vocab Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {lesson.vocabulary.map((v: any, idx: number) => (
                    <motion.div 
                      key={`listening-vocab-${idx}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ y: -8 }}
                      className="bg-white p-8 rounded-[3rem] border-4 border-gray-50 shadow-xl hover:border-orange-300 transition-all group flex flex-col items-center text-center space-y-6"
                    >
                      <ThreeDContainer color="orange" size="lg">
                        <span className="text-5xl">{v.icon || "🔊"}</span>
                      </ThreeDContainer>
                      <div>
                        <h4 className="text-4xl font-chinese font-black text-gray-900 mb-1 group-hover:text-orange-600 transition-colors uppercase">{v.word}</h4>
                        <p className="text-orange-500 font-black tracking-[0.2em] italic text-lg">{v.pinyin}</p>
                        <p className="text-gray-400 font-bold italic mt-2">{v.translation.split(' (')[0]}</p>
                      </div>
                      <button 
                        onClick={() => speak(v.word)}
                        className="flex items-center gap-3 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-[1.8rem] font-black shadow-[0_6px_0_0_#c2410c] hover:shadow-[0_4px_0_0_#c2410c] active:shadow-none active:translate-y-1 transition-all w-full justify-center text-lg"
                      >
                        <Volume2 className="w-6 h-6" />
                        ฟังเสียงต้นแบบ
                      </button>
                    </motion.div>
                  ))}
                </div>

                {/* Additional Guidance Illustration Section */}
                <div className="bg-orange-50 p-8 rounded-4xl border-2 border-dashed border-orange-200 text-center space-y-4">
                  <div className="text-6xl animate-bounce">✨</div>
                  <h4 className="text-xl font-black text-orange-800">เยี่ยมมาก! ฝึกฟังให้ครบทุกคำนะจ๊ะ</h4>
                  <p className="text-orange-600 font-bold">ถ้านักเรียนพร้อมแล้ว ไปลองฝึกพูดกันต่อเลย!</p>
                </div>

                {/* Completion / Next Step */}
                <div className="flex justify-center pt-10">
                  <ChineseButton 
                    variant="gold" 
                    size="lg" 
                    className="text-xl px-12 py-8 rounded-3xl"
                    onClick={() => setActiveActivity(ActivityType.SPEAKING)}
                  >
                    ไปต่อกิจกรรมฝึกพูด (Next)
                    <ChevronRight className="w-6 h-6 ml-2" />
                  </ChineseButton>
                </div>
              </div>
            );
          }

          // Generic Listening for other lessons
          if (lesson.id === 2) {
            return <ListeningLesson2 lesson={lesson} speak={speak} setActiveActivity={setActiveActivity} />;
          }
          if (lesson.id === 3) {
            return <ListeningLesson3 lesson={lesson} speak={speak} setActiveActivity={setActiveActivity} />;
          }
          if (lesson.id === 5) {
            return <ListeningLesson5 lesson={lesson} speak={speak} />;
          }
          if (lesson.id === 8) return <ListeningLesson8 lesson={lesson} speak={speak} />;
          if (lesson.id === 9) return <ListeningLesson9 lesson={lesson} speak={speak} />;
          if ((lesson.id >= 4 && lesson.id <= 9) && lesson.id !== 5 && lesson.id !== 7 && lesson.id !== 8 && lesson.id !== 9) {
            return (
              <div className="space-y-12 pb-20">
                <GenericListening lesson={lesson} speak={speak} />
                <div className="flex justify-center pt-10">
                  <ChineseButton 
                    variant="gold" 
                    size="lg" 
                    className="text-xl px-12 py-8 rounded-3xl"
                    onClick={() => setActiveActivity(ActivityType.SPEAKING)}
                  >
                    ไปต่อกิจกรรมฝึกพูด (Next)
                    <ChevronRight className="w-6 h-6 ml-2" />
                  </ChineseButton>
                </div>
              </div>
            );
          }
          if (lesson.id === 7) return <ListeningLesson7 lesson={lesson} speak={speak} setActiveActivity={setActiveActivity} />;

          return (
            <div className="space-y-6">
              <div className="bg-orange-500 p-8 rounded-4xl text-white">
                <h3 className="text-2xl font-black mb-2">กิจกรรมการฟัง</h3>
                <p>ฟังและฝึกพูดตามคำศัพท์ในบทเรียน</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lesson.vocabulary.map((v, i) => (
                  <div key={`listen-generic-${i}`} className="bg-white p-6 rounded-3xl border-2 border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-black font-chinese">{v.word}</p>
                      <p className="text-sm font-bold text-orange-500">{v.pinyin}</p>
                    </div>
                    <button onClick={() => speak(v.word)} className="w-12 h-12 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center">
                      <Volume2 />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        }

      case ActivityType.SPEAKING:
        {
          if (lesson.id === 1) {
            const speakingActivity = lesson.activities.find(a => a.type === 'speaking');
            if (speakingActivity) {
              return <SpeakingLesson1 activity={speakingActivity} speak={speak} setActiveActivity={setActiveActivity} />;
            }
          }

          if (lesson.id === 2) {
            return <SpeakingLesson2 lesson={lesson} speak={speak} setActiveActivity={setActiveActivity} />;
          }
          if (lesson.id === 3) {
            return <SpeakingLesson3 lesson={lesson} speak={speak} setActiveActivity={setActiveActivity} />;
          }
          if (lesson.id === 5) {
            return <SpeakingLesson5 lesson={lesson} speak={speak} />;
          }
          if (lesson.id === 8) return <SpeakingLesson8 lesson={lesson} speak={speak} setActiveActivity={setActiveActivity} />;
          if (lesson.id === 9) return <SpeakingLesson9 lesson={lesson} speak={speak} setActiveActivity={setActiveActivity} />;
          if ((lesson.id >= 4 && lesson.id <= 9) && lesson.id !== 5 && lesson.id !== 7 && lesson.id !== 8 && lesson.id !== 9) {
            return (
              <div className="space-y-12 pb-20">
                <GenericSpeaking lesson={lesson} speak={speak} />
                <div className="flex justify-center pt-10">
                  <ChineseButton 
                    variant="gold" 
                    size="lg" 
                    className="text-xl px-12 py-8 rounded-3xl"
                    onClick={() => setActiveActivity(ActivityType.READING)}
                  >
                    ไปต่อกิจกรรมฝึกอ่าน (Next)
                    <ChevronRight className="w-6 h-6 ml-2" />
                  </ChineseButton>
                </div>
              </div>
            );
          }
          if (lesson.id === 7) return <SpeakingLesson7 lesson={lesson} speak={speak} setActiveActivity={setActiveActivity} />;

          return (
            <div className="space-y-12 pb-20">
              <div className="bg-emerald-500 p-8 rounded-4xl text-white shadow-lg relative overflow-hidden">
                 <div className="relative z-10">
                    <h3 className="text-3xl font-black leading-tight mb-2">กิจกรรมการพูด (SPEAKING)</h3>
                    <p className="text-emerald-100 font-bold">บทที่ {lesson.id}: {lesson.title}</p>
                 </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lesson.vocabulary.slice(0, 4).map((v, i) => (
                  <div key={`speak-gen-${i}`} className="bg-white p-6 rounded-3xl border-2 border-gray-100 flex flex-col items-center gap-4">
                    <p className="text-3xl font-black font-chinese">{v.word}</p>
                    <p className="text-emerald-600 font-bold">{v.pinyin}</p>
                    <button onClick={() => speak(v.word)} className="px-6 py-3 bg-emerald-50 text-emerald-600 rounded-xl font-black">
                      ฟังและฝึกพูด
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        }

      case ActivityType.READING:
        if (lesson.id === 1) {
          return <ReadingLesson1 lesson={lesson} setActiveActivity={setActiveActivity} />;
        }
        if (lesson.id === 2) {
          return <ReadingLesson2 lesson={lesson} speak={speak} setActiveActivity={setActiveActivity} />;
        }
        if (lesson.id === 3) {
          return <ReadingLesson3 lesson={lesson} speak={speak} setActiveActivity={setActiveActivity} />;
        }
        if (lesson.id === 4) {
          return <ReadingLesson4 lesson={lesson} speak={speak} setActiveActivity={setActiveActivity} />;
        }
        if (lesson.id === 5) {
          return <ReadingLesson5 lesson={lesson} speak={speak} setActiveActivity={setActiveActivity} />;
        }
        if (lesson.id === 8) return <ReadingLesson8 lesson={lesson} speak={speak} />;
        if (lesson.id === 9) return <ReadingLesson9 lesson={lesson} speak={speak} setActiveActivity={setActiveActivity} />;
        if (lesson.id >= 6 && lesson.id <= 9 && lesson.id !== 7 && lesson.id !== 8 && lesson.id !== 9) {
          return <GenericReading lesson={lesson} speak={speak} setActiveActivity={setActiveActivity} />;
        }
        if (lesson.id === 7) return <ReadingLesson7 lesson={lesson} speak={speak} />;
        return (
          <div className="space-y-6">
             <div className="bg-white p-12 rounded-4xl border-4 border-blue-100 shadow-sm text-center space-y-8">
               <div className="space-y-4">
                 <h2 className="text-8xl font-chinese font-black text-gray-900 leading-tight">{lesson.title}</h2>
                 <p className="text-2xl font-bold text-blue-500">{lesson.pinyin}</p>
                 <p className="text-xl font-bold text-gray-400">{lesson.translation}</p>
               </div>
               
               <div className="max-w-2xl mx-auto pt-8 border-t-2 border-blue-50 text-left">
                  <h4 className="font-black text-blue-600 mb-2 uppercase tracking-widest text-xs">Reading Context</h4>
                  <div className="space-y-4">
                    {lesson.dialogues.map((d, i) => (
                      <div key={`reading-d-${i}`} className="flex gap-2">
                        <span className="font-black text-blue-300">{i+1}.</span>
                        <p className="text-lg font-medium text-gray-700">{d.text} <span className="text-blue-400">({d.translation})</span></p>
                      </div>
                    ))}
                  </div>
               </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2].map(q => (
                  <div key={`reading-q-${q}`} className="bg-white p-6 rounded-3xl border-2 border-blue-50 shadow-sm">
                    <p className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-black">{q}</span>
                      คำถามท้ายกิจกรรม: เลือกความหมายที่ถูกต้อง
                    </p>
                    <div className="space-y-2">
                       {lesson.vocabulary.slice(0, 3).map((v, vIdx) => (
                         <button key={`reading-q-${q}-opt-${vIdx}`} className="w-full text-left p-4 rounded-xl border-2 border-gray-50 hover:border-blue-500 hover:bg-blue-50 transition-all font-bold">
                           {vIdx === 0 ? v.translation : `คำตอบอื่นๆ ${vIdx + 1}`}
                         </button>
                       ))}
                    </div>
                  </div>
                ))}
             </div>
          </div>
        );

      case ActivityType.WRITING:
        if (lesson.id === 1) {
          return <WritingLesson1 lesson={lesson} />;
        }
        if (lesson.id === 2) {
          return <WritingLesson2 lesson={lesson} speak={speak} setActiveActivity={setActiveActivity} />;
        }
        if (lesson.id === 3) {
          return <WritingLesson3 lesson={lesson} speak={speak} setActiveActivity={setActiveActivity} />;
        }
        if (lesson.id === 4) {
          return <WritingLesson4 lesson={lesson} speak={speak} setActiveActivity={setActiveActivity} />;
        }
        if (lesson.id === 5) {
          return <WritingLesson5 lesson={lesson} speak={speak} setActiveActivity={setActiveActivity} />;
        }
        if (lesson.id === 8) return <WritingLesson8 lesson={lesson} speak={speak} />;
        if (lesson.id === 9) return <WritingLesson9 lesson={lesson} speak={speak} />;
        if (lesson.id >= 6 && lesson.id <= 9 && lesson.id !== 7 && lesson.id !== 8 && lesson.id !== 9) {
          return <GenericWriting lesson={lesson} speak={speak} />;
        }
        if (lesson.id === 7) return <WritingLesson7 lesson={lesson} speak={speak} />;
        return (
          <div className="space-y-6">
             <div className="bg-purple-50 p-6 rounded-3xl border-2 border-purple-100 flex items-center gap-4">
                <div>
                   <h3 className="text-xl font-black text-gray-900 leading-tight">กิจกรรมฝึกเขียน (WRITING)</h3>
                   <p className="text-sm font-bold text-purple-600">ฝึกลากเส้นและเติมคำให้ถูกต้องนะเด็กๆ!</p>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {lesson.vocabulary.slice(0, 2).map((v, i) => (
                  <div key={`writing-v-${i}`} className="bg-white p-8 rounded-4xl border-2 border-purple-100 shadow-sm space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-purple-400 uppercase tracking-widest">Stroke Order</span>
                      <span className="text-2xl font-black text-chinese-red font-chinese">{v.word}</span>
                    </div>
                    <div className="aspect-square bg-gray-50 rounded-3xl border-4 border-dashed border-gray-200 flex items-center justify-center relative overflow-hidden">
                       <span className="text-[12rem] font-chinese opacity-[0.05] flex items-center justify-center">{v.word}</span>
                       <div className="absolute inset-0 flex items-center justify-center">
                         <motion.div 
                           animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                           transition={{ repeat: Infinity, duration: 2 }}
                           className="w-1 h-32 bg-purple-200 rounded-full rotate-45" 
                         />
                       </div>
                       <p className="absolute bottom-4 left-0 right-0 text-center text-[10px] font-black text-purple-300 uppercase tracking-[0.2em]">Practice Canvas</p>
                    </div>
                    <div className="flex gap-2">
                       {Array.from({ length: 4 }).map((_, idx) => (
                         <div key={`writing-v-${i}-stroke-${idx}`} className="flex-1 aspect-square border-2 border-gray-100 rounded-xl bg-gray-50/50 flex items-center justify-center text-gray-200">
                           {idx + 1}
                         </div>
                       ))}
                    </div>
                  </div>
                ))}
             </div>
             
             <div className="bg-white p-8 rounded-4xl border-2 border-purple-100 shadow-sm">
                <h4 className="font-black text-gray-900 mb-6 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-500" />
                  กิจกรรมเติมคำ (FILL IN THE BLANKS)
                </h4>
                <div className="bg-purple-50 p-8 rounded-3xl border-2 border-dashed border-purple-200 flex items-center justify-center gap-6 text-4xl font-chinese">
                  <span className="text-gray-400 leading-none">你</span>
                  <div className="w-20 h-20 border-4 border-purple-200 rounded-2xl bg-white flex items-center justify-center text-purple-300 shadow-inner">?</div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                   {["好", "爱", "吗", "您"].map((c, idx) => (
                     <button key={`fill-opt-${idx}-${c}`} className="py-4 bg-white rounded-2xl border-2 border-gray-100 font-chinese font-black text-2xl hover:bg-purple-600 hover:text-white hover:scale-105 transition-all shadow-sm">
                       {c}
                     </button>
                   ))}
                </div>
             </div>
          </div>
        );

      case ActivityType.PINYIN:
        if (lesson.id === 1) {
          return <PinyinLesson1 lesson={lesson} speak={speak} pinyinSpeak={pinyinSpeak} pinyinSequenceSpeak={pinyinSequenceSpeak} playingText={playingText} />;
        }
        if (lesson.id === 2) {
          return <PinyinLesson2 lesson={lesson} pinyinSpeak={pinyinSpeak} pinyinSequenceSpeak={pinyinSequenceSpeak} setActiveActivity={setActiveActivity} playingText={playingText} />;
        }
        if (lesson.id === 3) {
          return <PinyinLesson3 lesson={lesson} pinyinSpeak={pinyinSpeak} pinyinSequenceSpeak={pinyinSequenceSpeak} setActiveActivity={setActiveActivity} playingText={playingText} />;
        }
        if (lesson.id === 4) {
          return <PinyinLesson4 lesson={lesson} pinyinSpeak={pinyinSpeak} pinyinSequenceSpeak={pinyinSequenceSpeak} setActiveActivity={setActiveActivity} playingText={playingText} />;
        }
        if (lesson.id === 5) {
          return <PinyinLesson5 lesson={lesson} speak={speak} pinyinSpeak={pinyinSpeak} pinyinSequenceSpeak={pinyinSequenceSpeak} playingText={playingText} />;
        }
        if (lesson.id === 8) return <PinyinLesson8 lesson={lesson} speak={speak} pinyinSpeak={pinyinSpeak} />;
        if (lesson.id === 9) return <PinyinLesson9 lesson={lesson} speak={speak} pinyinSpeak={pinyinSpeak} pinyinSequenceSpeak={pinyinSequenceSpeak} playingText={playingText} />;
        if (lesson.id >= 6 && lesson.id <= 9 && lesson.id !== 7 && lesson.id !== 8 && lesson.id !== 9) {
          return <GenericPinyin lesson={lesson} speak={speak} pinyinSpeak={pinyinSpeak} pinyinSequenceSpeak={pinyinSequenceSpeak} playingText={playingText} />;
        }
        if (lesson.id === 7) return <PinyinLesson7 lesson={lesson} speak={speak} pinyinSpeak={pinyinSpeak} />;
        return (
          <div className="space-y-6">
            <div className="bg-chinese-gold/10 p-6 rounded-3xl border-2 border-chinese-gold/20 flex items-center gap-4">
               <div>
                  <h3 className="text-xl font-black text-gray-900 leading-tight">กิจกรรมฝึกพินอิน (PINYIN)</h3>
                  <p className="text-sm font-bold text-chinese-gold-dark">เชื่อมคำจีนกับพินอิน หรือเลือกให้ตรงเสียงอ่านนะ!</p>
               </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {lesson.vocabulary.slice(0, 4).map((v, i) => (
                 <div key={`pinyin-v-${i}`} className="bg-white p-6 rounded-3xl border-2 border-gray-100 flex flex-col space-y-4 shadow-sm hover:border-chinese-gold transition-colors">
                    <div className="flex items-center justify-between">
                       <span className="text-5xl font-chinese font-black text-gray-900 leading-none">{v.word}</span>
                       <button className="w-10 h-10 bg-chinese-gold/20 rounded-full flex items-center justify-center text-chinese-gold-dark font-black">
                         <Bell className="w-5 h-5" />
                       </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                       {[v.pinyin, "nǐ", "hǎo", "ma"].sort().slice(0, 3).map((py, idx) => (
                         <button key={`pinyin-v-${i}-opt-${idx}`} className="px-3 py-2 bg-gray-50 rounded-xl border-2 border-gray-100 font-bold text-xs md:text-sm text-gray-600 hover:border-chinese-gold hover:text-chinese-gold-dark transition-all">
                           {py}
                         </button>
                       ))}
                    </div>
                 </div>
               ))}
            </div>
            
            <div className="bg-white p-8 rounded-4xl border-2 border-chinese-gold/20 shadow-sm text-center">
              <p className="font-black text-gray-400 uppercase tracking-widest text-xs mb-4">Pinyin Matching Challenge</p>
              <div className="flex justify-center gap-8">
                <div className="space-y-4">
                  {lesson.vocabulary.slice(0, 3).map((v, i) => (
                    <div key={`pinyin-match-word-${i}`} className="w-24 h-12 bg-gray-50 rounded-xl border-2 border-gray-100 flex items-center justify-center font-chinese font-black text-xl">{v.word}</div>
                  ))}
                </div>
                <div className="space-y-4">
                  {lesson.vocabulary.slice(0, 3).map((v, i) => (
                    <div key={`pinyin-match-py-${i}`} className="w-24 h-12 bg-gray-50 rounded-xl border-2 border-gray-100 flex items-center justify-center font-bold text-chinese-gold-dark">{v.pinyin}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case ActivityType.FUN:
        if (lesson.id === 1) {
          return <FunLesson1 lesson={lesson} setActiveActivity={setActiveActivity} />;
        }
        if (lesson.id === 2) {
          return <FunLesson2 lesson={lesson} setActiveActivity={setActiveActivity} />;
        }
        if (lesson.id === 3) {
          return <FunLesson3 lesson={lesson} speak={speak} setActiveActivity={setActiveActivity} />;
        }
        if (lesson.id === 4) {
          return <FunLesson4 lesson={lesson} speak={speak} setActiveActivity={setActiveActivity} />;
        }
        if (lesson.id === 5) {
          return <FunLesson5 lesson={lesson} speak={speak} setActiveActivity={setActiveActivity} />;
        }
        if (lesson.id === 8) return <FunLesson8 lesson={lesson} speak={speak} />;
        if (lesson.id === 9) return <FunLesson9 lesson={lesson} speak={speak} setActiveActivity={setActiveActivity} />;
        if (lesson.id >= 6 && lesson.id <= 9 && lesson.id !== 7 && lesson.id !== 8 && lesson.id !== 9) {
          return <GenericFun lesson={lesson} speak={speak} />;
        }
        if (lesson.id === 7) return <FunLesson7 lesson={lesson} speak={speak} />;
        return (
          <div className="h-full flex flex-col items-center justify-center min-h-[500px] text-center space-y-8 bg-gradient-to-b from-pink-50 to-white rounded-4xl border-4 border-pink-100">
             <div className="relative">
                <div className="bg-pink-500 text-white w-20 h-20 rounded-full flex items-center justify-center font-black animate-bounce shadow-lg text-4xl">
                  🎮
                </div>
             </div>
             <div className="space-y-2 px-6">
               <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">กิจกรรมหรรษา (FUN)</h2>
               <p className="text-lg md:text-xl font-bold text-pink-600">เกมจับคู่คำศัพท์แสนสนุก ท้าทายความจำ!</p>
             </div>
             
             <div className="bg-white/50 p-8 rounded-3xl border-2 border-pink-100 grid grid-cols-3 md:grid-cols-4 gap-4">
               {Array.from({ length: 8 }).map((_, i) => (
                 <motion.div 
                   key={`fun-card-${i}`} 
                   whileHover={{ scale: 1.05, rotate: 2 }}
                   whileTap={{ scale: 0.95 }}
                   className="w-20 h-20 md:w-24 md:h-24 bg-pink-100 rounded-2xl border-4 border-pink-200 flex items-center justify-center text-3xl font-black text-pink-500 cursor-pointer shadow-inner"
                 >
                   ?
                 </motion.div>
               ))}
             </div>
             
             <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-2 bg-pink-500 text-white px-6 py-2 rounded-full font-black shadow-lg">
                   <Trophy className="w-5 h-5" />
                   High Score: 1,200
                </div>
                <ChineseButton variant="gold" size="lg" className="bg-pink-500 border-b-8 border-pink-700 hover:bg-pink-600 hover:border-pink-800 text-xl px-12 py-6">
                   เริ่มเล่นเลย (START)
                </ChineseButton>
                <p className="text-xs font-bold text-pink-400">ใช้เวลาไม่เกิน 5 นาที | รับสูงสุด 100 XP</p>
             </div>
          </div>
        );

      case ActivityType.FINAL:
        if (lesson.id === 1) {
          return <SummaryLesson1 lesson={lesson} setActiveActivity={setActiveActivity} speak={speak} />;
        }
        if (lesson.id === 2) {
          return <SummaryLesson2 lesson={lesson} setActiveActivity={setActiveActivity} speak={speak} />;
        }
        if (lesson.id === 3) {
          return <SummaryLesson3 lesson={lesson} setActiveActivity={setActiveActivity} speak={speak} />;
        }
        if (lesson.id === 4) {
          return <SummaryLesson4 lesson={lesson} setActiveActivity={setActiveActivity} speak={speak} />;
        }
        if (lesson.id === 5) {
          return <SummaryLesson5 lesson={lesson} setActiveActivity={setActiveActivity} speak={speak} />;
        }
        if (lesson.id === 8) return <SummaryLesson8 lesson={lesson} setActiveActivity={setActiveActivity} speak={speak} />;
        if (lesson.id === 9) return <SummaryLesson9 lesson={lesson} setActiveActivity={setActiveActivity} speak={speak} />;
        if (lesson.id >= 6 && lesson.id <= 9 && lesson.id !== 7 && lesson.id !== 8 && lesson.id !== 9) {
          return <GenericSummary lesson={lesson} setActiveActivity={setActiveActivity} speak={speak} />;
        }
        if (lesson.id === 7) return <SummaryLesson7 lesson={lesson} setActiveActivity={setActiveActivity} speak={speak} />;
        return (
          <div className="space-y-6">
             <div className={cn(
               "p-10 rounded-4xl shadow-xl space-y-4 relative overflow-hidden",
               lesson.isSpecial ? "bg-emerald-500" : "bg-chinese-red"
             )}>
                <div className="relative z-10">
                  <h2 className="text-4xl font-black font-chinese">
                    {lesson.isSpecial ? "แบบทดสอบ (UNIT QUIZ)" : "กิจกรรมท้ายบท (FINAL CHALLENGE)"}
                  </h2>
                  <p className="text-xl font-bold text-white/80">
                    {lesson.isSpecial ? "ทดสอบความเข้าใจคำสั่งในห้องเรียน (19 ข้อ)" : "สรุปความรู้: ฟัง พูด อ่าน เขียน (5 ข้อ)"}
                  </p>
                </div>
                <div className="absolute -right-8 -bottom-8 opacity-20 rotate-12">
                  <Trophy className="w-64 h-64 text-white" />
                </div>
             </div>

             <div className="space-y-4 max-w-4xl mx-auto">
                {quizQuestions.map(({ q, vocabItem, options }) => {
                  const isAnimating = animatingQuestion?.id === q;
                  const animType = animatingQuestion?.type;
                  
                  return (
                    <div 
                      key={`quiz-q-${q}`} 
                      className={cn(
                        "bg-white p-8 rounded-4xl border-2 border-gray-100 shadow-sm group hover:border-chinese-red transition-all",
                        isAnimating && animType === 'correct' && "success-pop ring-4 ring-emerald-500/20 border-emerald-500",
                        isAnimating && animType === 'wrong' && "shake-soft ring-4 ring-chinese-red/20 border-chinese-red"
                      )}
                    >
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-chinese-red/10 rounded-2xl flex items-center justify-center font-black text-chinese-red text-xl">
                          {q}
                        </div>
                        <div className="flex flex-col">
                          <div className="text-3xl mb-2">{vocabItem?.icon}</div>
                          <p className="text-xl font-black text-gray-800">
                            {lesson.isSpecial ? (
                              <span>{vocabItem.word} <span className="text-chinese-red/60 font-chinese ml-2">({vocabItem.pinyin})</span></span>
                            ) : (
                              q === 1 ? "ฟังเสียงแล้วเลือกพินอินที่ถูกต้อง" : 
                              q === 2 ? "คำนี้หมายถึงอะไร?" :
                              q === 3 ? "เติมคำในช่องว่างให้สมบูรณ์" :
                              q === 4 ? "เลือกพินอินสำหรับตัวจีนนี้" :
                              "สรุปใจความสำคัญของบทเรียน"
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {options.map((o, idx) => {
                           const isSelected = answers[q] === o;
                           return (
                             <label 
                               key={`quiz-q-${q}-opt-${idx}`} 
                               className={cn(
                                 "text-left p-6 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer group/opt",
                                 isSelected 
                                   ? "border-chinese-red bg-chinese-red/5 font-bold" 
                                   : "border-gray-50 hover:border-chinese-red/30 hover:bg-gray-50/50 font-bold"
                               )}
                             >
                               <input 
                                 type="radio" 
                                 name={`question-${q}`}
                                 value={o}
                                 checked={isSelected}
                                 onChange={() => handleAnswerChange(q, o)}
                                 className="sr-only" // Hidden but accessible
                               />
                               <span className={cn(
                                 "transition-colors",
                                 isSelected ? "text-chinese-red" : "text-gray-700"
                               )}>{o}</span>
                               <div className={cn(
                                 "w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center",
                                 isSelected 
                                   ? "border-chinese-red bg-chinese-red" 
                                   : "border-gray-200 group-hover/opt:border-chinese-red/50"
                               )}>
                                 {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                               </div>
                             </label>
                           );
                         })}
                      </div>

                      <div className="mt-6 flex flex-col items-start gap-4">
                        <button 
                          onClick={() => checkAnswer(q)}
                          disabled={!answers[q]}
                          className={cn(
                            "px-8 py-3 rounded-2xl font-black transition-all shadow-sm",
                            !answers[q] 
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                              : "bg-chinese-red text-white hover:bg-chinese-red/90"
                          )}
                        >
                          ตรวจคำตอบ (CHECK)
                        </button>

                        <AnimatePresence>
                          {results[q] === true && (
                            <motion.p 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="text-emerald-600 font-bold flex items-center gap-2"
                            >
                              <CheckCircle2 className="w-5 h-5" />
                              ถูกต้อง (CORRECT!)
                            </motion.p>
                          )}
                          {results[q] === false && (
                            <motion.p 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="text-chinese-red font-bold flex items-center gap-2"
                            >
                              <Zap className="w-5 h-5" />
                              ยังไม่ถูกนะ ลองอีกครั้ง!
                            </motion.p>
                          )}
                          {showHint[q] && vocabItem.hint && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-orange-50 border-2 border-orange-200 p-4 rounded-2xl w-full"
                            >
                              <p className="text-orange-700 font-bold flex items-center gap-2">
                                <Star className="w-5 h-5" />
                                คำใบ้ (HINT): {vocabItem.hint}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  );
                })}
             </div>

             <div className="bg-white p-10 rounded-4xl border-2 border-chinese-red/10 text-center space-y-6 shadow-sm">
                <div className="inline-flex items-center gap-2 bg-chinese-gold/20 text-chinese-gold-dark px-6 py-2 rounded-full font-black text-sm uppercase tracking-widest">
                  Result Preview
                </div>
                <div className="flex justify-center flex-wrap gap-8 py-4">
                   <div className="text-center">
                      <p className="text-4xl font-black text-chinese-red">
                        {quizQuestions.reduce((acc, { q }) => {
                          return results[q] === true ? acc + 1 : acc;
                        }, 0)} / {quizQuestions.length}
                      </p>
                      <p className="text-xs font-bold text-gray-400">Total Score</p>
                   </div>
                   <div className="text-center">
                      <p className={cn(
                         "text-4xl font-black",
                         Object.keys(results).length === quizQuestions.length ? "text-emerald-500" : "text-orange-500"
                       )}>
                         {Object.keys(results).length === quizQuestions.length ? "ผ่าน" : "ไม่สมบูรณ์"}
                       </p>
                      <p className="text-xs font-bold text-gray-400">Status</p>
                   </div>
                </div>
                <div className="max-w-md mx-auto">
                   <p className="text-sm font-bold text-gray-500 italic">"เก่งมากเลย! ลองทบทวนเรื่องการเขียนอีกสักนิดนะจ๊ะ!"</p>
                </div>
                <div className="pt-4">
                  <ChineseButton size="lg" variant="primary" className="px-16 py-6 text-2xl shadow-xl hover:scale-105 active:scale-95 transition-all">
                    <CheckCircle2 className="w-8 h-8" strokeWidth={3} />
                    ส่งคำตอบและสรุปผล
                  </ChineseButton>
                </div>
             </div>
          </div>
        );

      case ActivityType.LIBRARY:
        return <VocabLibrary lesson={lesson} speak={speak} />;

      case ActivityType.FINAL_REVIEW:
        return <FinalReviewLesson lesson={lesson} speak={speak} />;
    }
  };

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
        {/* Navigation Header */}
        <div className="flex flex-col md:flex-row items-center gap-6 justify-between bg-white p-6 rounded-4xl border-2 border-chinese-red/5 shadow-sm border-b-8">
          <div className="flex items-center gap-4">
             <button onClick={() => navigate('/')} className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-chinese-red hover:bg-chinese-red/5 transition-all active:scale-90">
                <ChevronLeft className="w-6 h-6" />
             </button>
             <div className="w-16 h-16 bg-chinese-red rounded-3xl flex items-center justify-center text-white font-black text-2xl shadow-lg font-chinese border-b-4 border-chinese-red-dark">
                {lesson.hideNumber ? (
                  <Sparkles className="w-8 h-8" />
                ) : (
                  lesson.id
                )}
             </div>
             <div>
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">{lesson.translation.split(' (')[0]}</h1>
                <p className="text-sm font-bold text-chinese-red uppercase tracking-widest leading-tight">{lesson.title} ({lesson.pinyin})</p>
             </div>
          </div>
          <div className="flex items-center gap-4 bg-gray-50 p-2 pr-6 rounded-full shadow-inner border border-gray-100">
             <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 flex items-center justify-center font-black text-emerald-600 bg-white shadow-sm text-sm">
               20%
             </div>
             <div className="hidden md:block">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Unit Progress</p>
                <div className="w-32 h-2.5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                   <div className="h-full bg-emerald-500 w-[20%] transition-all duration-1000" />
                </div>
             </div>
          </div>
        </div>

        {/* Activity Tab Menu */}
        <div className="flex overflow-x-auto no-scrollbar gap-3 pb-4 -mx-4 px-4 md:mx-0 md:px-0 scroll-smooth items-center">
          {activities.map((act) => (
            <button
              key={`nav-tab-${act.type}`}
              onClick={() => setActiveActivity(act.type)}
              className={cn(
                "flex-shrink-0 flex flex-col md:flex-row items-center gap-2 md:gap-3 px-6 py-3 rounded-3xl font-black text-sm transition-all border-b-6 active:translate-y-1 active:border-b-2 hover:translate-y-0.5 smooth-button group",
                activeActivity === act.type
                  ? cn(act.color, "text-white border-black/10 shadow-lg scale-105 ring-4 ring-white/50")
                  : "bg-white text-gray-400 border-gray-100 hover:bg-gray-50 hover:text-chinese-red"
              )}
            >
              <div className="relative overflow-hidden w-5 h-5">
                <act.icon className={cn(
                  "w-5 h-5 transition-transform duration-300", 
                  activeActivity === act.type ? "text-white" : "text-gray-300 group-hover:-translate-y-1"
                )} />
              </div>
              <span className="transition-transform duration-300 group-hover:translate-x-1">{act.label}</span>
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <main className="min-h-[600px] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeActivity}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {renderActivityContent()}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Action Footer */}
        <div className="flex justify-between items-center bg-white/50 backdrop-blur-md p-6 rounded-4xl border-2 border-gray-100 shadow-sm sticky bottom-8 z-40">
           <ChineseButton 
             variant="ghost" 
             onClick={safeAction(() => {
               const idx = activities.findIndex(a => a.type === activeActivity);
               if (idx > 0) setActiveActivity(activities[idx-1].type);
             })}
             disabled={activeActivity === activities[0].type || isLocked}
             className="border-2 border-gray-200"
           >
              <ChevronLeft className="w-5 h-5" />
              ก่อนหน้า
           </ChineseButton>
           
           <div className="flex gap-2">
             {activities.map(a => (
               <div key={`progress-dot-${a.type}`} className={cn(
                 "w-2 h-2 rounded-full transition-all duration-500",
                 activeActivity === a.type ? "w-8 bg-chinese-red" : "bg-gray-200"
               )} />
             ))}
           </div>

           <ChineseButton 
             variant="primary"
             onClick={safeAction(() => {
               const idx = activities.findIndex(a => a.type === activeActivity);
               if (idx < activities.length - 1) setActiveActivity(activities[idx+1].type);
             })}
             disabled={activeActivity === activities[activities.length-1].type || isLocked}
             className="px-8"
           >
              ถัดไป
              <ChevronRight className="w-5 h-5" />
           </ChineseButton>
        </div>
      </div>
    </PageTransition>
  );
};

const BackgroundDecorations = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-[0.03] select-none">
      <Sparkles className="absolute top-[10%] left-[5%] w-16 h-16 text-chinese-red gentle-float" />
      <Star className="absolute top-[25%] right-[10%] w-12 h-12 text-chinese-gold gentle-float" style={{ animationDelay: '-1s' }} />
      <Music className="absolute bottom-[25%] left-[10%] w-14 h-14 text-emerald-500 gentle-float" style={{ animationDelay: '-2s' }} />
      <Gamepad2 className="absolute bottom-[10%] right-[15%] w-18 h-18 text-purple-500 gentle-float" style={{ animationDelay: '-3.5s' }} />
      <div className="absolute top-[40%] left-[2%] text-7xl font-chinese gentle-float">中</div>
      <div className="absolute top-[60%] right-[3%] text-7xl font-chinese gentle-float" style={{ animationDelay: '-1.5s' }}>文</div>
      <div className="absolute top-[80%] left-[18%] text-7xl font-chinese gentle-float" style={{ animationDelay: '-4s' }}>龙</div>
      <div className="absolute top-[15%] left-[28%] text-7xl font-chinese gentle-float" style={{ animationDelay: '-0.5s' }}>福</div>
      <div className="absolute bottom-[5%] left-[45%] text-7xl font-chinese gentle-float" style={{ animationDelay: '-2.5s' }}>花</div>
    </div>
  );
};

export default function App() {
  return (
    <GlobalLockProvider>
      <AppContent />
    </GlobalLockProvider>
  );
}

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const xp = 250;
  const level = 1;

  return (
    <div className="min-h-screen bg-chinese-paper font-sans selection:bg-chinese-red selection:text-white flex flex-col relative overflow-hidden">
      <BackgroundDecorations />
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-20 left-[10%] w-64 h-32 cloud-pattern cloud-anim" />
        <div className="absolute top-60 right-[5%] w-80 h-40 cloud-pattern cloud-anim" style={{ animationDelay: '-5s' }} />
        <div className="absolute bottom-40 left-[15%] w-72 h-36 cloud-pattern cloud-anim" style={{ animationDelay: '-12s' }} />
      </div>

      <Header xp={xp} level={level} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex flex-1 overflow-hidden h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] relative">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 overflow-y-auto no-scrollbar relative bg-[#fdfaf5]">
          {/* Faded Cloud Background Pattern */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden">
             {Array.from({ length: 6 }).map((_, i) => (
               <div 
                 key={`app-cloud-bg-${i}`}
                 className="absolute w-[400px] h-[200px] cloud-pattern"
                 style={{
                   top: `${i * 20}%`,
                   left: i % 2 === 0 ? '-10%' : '70%',
                   transform: `rotate(${i % 2 === 0 ? 5 : -5}deg)`
                 }}
               />
             ))}
          </div>

          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<DashboardContent />} />
              <Route path="/lesson/:id" element={<LessonView />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>

      <AnimatePresence>
        {/* Floating Action Button for Mobile Chat / AI Helper */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-6 right-6 w-16 h-16 bg-chinese-red text-white rounded-full shadow-2xl flex items-center justify-center z-50 animate-pulse-slow border-4 border-white"
        >
          <Sparkles className="w-8 h-8 fill-white" />
        </motion.button>
      </AnimatePresence>
    </div>
  );
}
