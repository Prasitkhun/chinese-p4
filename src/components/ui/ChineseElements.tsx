import { cn } from "../../lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, Star } from "lucide-react";

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration' | 'onDrag' | 'onDragEnd' | 'onDragEnter' | 'onDragExit' | 'onDragLeave' | 'onDragOver' | 'onDragStart' | 'onDrop'> {
  variant?: "primary" | "secondary" | "gold" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function ChineseButton({ 
  className, 
  variant = "primary", 
  size = "md",
  children,
  ...props 
}: ButtonProps) {
  const variants = {
    primary: "bg-chinese-red text-white shadow-[0_4px_0_0_#b91c1c] hover:shadow-[0_2px_0_0_#b91c1c] active:shadow-none",
    secondary: "bg-blue-500 text-white shadow-[0_4px_0_0_#1d4ed8]",
    gold: "bg-chinese-gold text-red-900 shadow-[0_4px_0_0_#d4af37] border-2 border-chinese-gold-dark",
    ghost: "bg-white/50 backdrop-blur-sm border-2 border-gray-200 text-gray-700 hover:bg-gray-50"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-xl font-bold"
  };

  return (
    <motion.button 
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        "rounded-2xl font-sans flex items-center justify-center gap-2 smooth-button",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}

type ChineseCardProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration' | 'onDrag' | 'onDragEnd' | 'onDragEnter' | 'onDragExit' | 'onDragLeave' | 'onDragOver' | 'onDragStart' | 'onDrop'> & { 
  title?: string;
  icon?: any;
  variant?: "default" | "gold" | "red";
};

export function ChineseCard({ className, children, title, icon: Icon, variant = "default", ...props }: ChineseCardProps) {
  const variants = {
    default: "bg-white border-chinese-red/10",
    gold: "bg-gradient-to-br from-chinese-gold/20 to-white border-chinese-gold-dark/20",
    red: "bg-gradient-to-br from-chinese-red to-red-700 text-white border-0"
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn("rounded-[2.5rem] border-4 shadow-xl overflow-hidden relative group p-6 smooth-card", variants[variant], className)} 
      {...props}
    >
      {title && (
        <div className="flex items-center gap-3 mb-4 transition-transform group-hover:translate-x-1">
          {Icon && <div className={cn("p-2 rounded-xl transition-all group-hover:scale-110", variant === 'red' ? "bg-white/20 text-white" : "bg-chinese-red/5 text-chinese-red")}><Icon className="w-5 h-5" /></div>}
          <h3 className={cn("text-xl font-bold font-sans transition-colors", variant === 'red' ? "text-white" : "text-gray-900 group-hover:text-chinese-red")}>{title}</h3>
        </div>
      )}
      <div className="relative z-10 transition-all duration-300">
        {children}
      </div>
      <div className={cn("absolute top-0 right-0 w-24 h-24 rounded-full -mr-12 -mt-12 transition-all duration-500 group-hover:scale-150 group-hover:rotate-45", variant === 'red' ? "bg-white/10" : "bg-chinese-red/5")} />
    </motion.div>
  );
}

export function ThreeDContainer({ 
  children, 
  className, 
  color = "orange",
  size = "md"
}: { 
  children: React.ReactNode, 
  className?: string, 
  color?: "orange" | "blue" | "red" | "emerald" | "gold" | "purple",
  size?: "sm" | "md" | "lg"
}) {
  const colors = {
    orange: "from-orange-400 to-orange-500 shadow-orange-200",
    blue: "from-blue-400 to-blue-500 shadow-blue-200",
    red: "from-rose-400 to-rose-500 shadow-rose-200",
    emerald: "from-emerald-400 to-emerald-500 shadow-emerald-200",
    gold: "from-yellow-400 to-yellow-500 shadow-yellow-200",
    purple: "from-purple-400 to-purple-500 shadow-purple-200",
  };

  const sizes = {
    sm: "w-12 h-12 text-2xl",
    md: "w-20 h-20 text-4xl",
    lg: "w-32 h-32 text-6xl"
  };

  return (
    <div className={cn(
      "relative group flex items-center justify-center shrink-0",
      className
    )}>
      {/* 3D Base Shadow */}
      <div className={cn(
        "absolute inset-0 translate-y-2 translate-x-1 blur-lg opacity-40 rounded-3xl transition-transform group-hover:translate-y-3 group-hover:opacity-50",
        colors[color].split(' ').pop()?.replace('shadow-', 'bg-') || "bg-gray-200"
      )} />
      
      {/* 3D Front Face */}
      <motion.div 
        whileHover={{ y: -4, rotateY: 10, rotateX: -5 }}
        whileTap={{ y: 2, scale: 0.95 }}
        className={cn(
          "relative z-10 rounded-[2rem] bg-gradient-to-br flex items-center justify-center border-4 border-white/40 shadow-inner overflow-hidden gentle-float",
          colors[color],
          sizes[size]
        )}
      >
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
        <span className="relative z-10 drop-shadow-lg">{children}</span>
      </motion.div>
    </div>
  );
}

export function SidebarItem({ 
  unitNum, 
  title, 
  chineseTitle, 
  isActive, 
  isCompleted, 
  onClick,
  hideNumber,
  icon: CustomIcon
}: { 
  unitNum: number, 
  title: string, 
  chineseTitle: string, 
  isActive: boolean, 
  isCompleted: boolean,
  onClick: () => void,
  hideNumber?: boolean,
  icon?: any
}) {
  return (
    <motion.button
      whileHover={{ 
        x: 5,
        backgroundColor: isActive ? "rgba(185, 28, 28, 1)" : "rgba(255, 255, 255, 0.8)",
      }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "w-full text-left p-3 md:p-4 rounded-3xl flex items-center gap-3 md:gap-4 transition-all border-2 relative overflow-hidden group",
        isActive 
          ? "bg-chinese-red text-white border-chinese-red shadow-[0_0_20px_rgba(185,28,28,0.3)] z-10" 
          : "bg-white/50 border-transparent hover:border-chinese-red/20 text-gray-700"
      )}
    >
      {/* Ripple/Active Highlight Effect */}
      {isActive && (
        <motion.div
          layoutId="activeGlow"
          className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none"
        />
      )}

      <motion.div 
        variants={{
          hover: { rotate: [0, -10, 10, 0] }
        }}
        transition={{ duration: 0.3 }}
        className={cn(
          "w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-2xl flex items-center justify-center font-black text-lg md:text-xl font-chinese",
          isActive ? "bg-white text-chinese-red shadow-inner" : (isCompleted ? "bg-emerald-100 text-emerald-600" : "bg-chinese-red/10 text-chinese-red")
        )}
      >
        <motion.span
          whileHover={{ rotate: [0, -15, 15, 0] }}
          transition={{ repeat: Infinity, duration: 0.5 }}
          className="flex items-center justify-center"
        >
          {hideNumber ? (CustomIcon ? <CustomIcon className="w-6 h-6" /> : "★") : unitNum}
        </motion.span>
      </motion.div>
      <div className="min-w-0 flex-1">
        <p className={cn("text-[9px] font-black uppercase tracking-tighter truncate opacity-70", isActive ? "text-white" : "text-gray-400")}>
          {isCompleted ? "✓ เรียนแล้ว" : (hideNumber ? "Special" : `Unit ${unitNum}`)}
        </p>
        <p className="font-bold text-[13px] truncate leading-tight">{title}</p>
        <p className={cn("text-[11px] font-chinese truncate", isActive ? "text-chinese-gold" : "text-chinese-red/60")}>{chineseTitle}</p>
      </div>
      {isCompleted && !isActive && (
        <CheckCircle2 className="w-5 h-5 ml-auto text-emerald-500 shrink-0" />
      )}
      {isActive && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="ml-auto"
        >
          <Star className="w-5 h-5 text-chinese-gold fill-chinese-gold shrink-0" />
        </motion.div>
      )}
    </motion.button>
  );
}

export function UnitInfo({ concept, focus }: { concept: string[], focus: string[] }) {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-chinese-red/5 rounded-3xl border-2 border-chinese-red/10">
        <h4 className="text-sm font-black text-chinese-red uppercase tracking-wider mb-2 flex items-center gap-2">
          <Star className="w-4 h-4 fill-chinese-red" />
          Key Concept
        </h4>
        <ul className="text-sm text-gray-700 space-y-1 font-medium">
          {concept.map((c, i) => <li key={`concept-${i}`}>• {c}</li>)}
        </ul>
      </div>
      <div className="p-4 bg-chinese-gold/5 rounded-3xl border-2 border-chinese-gold/10">
        <h4 className="text-sm font-black text-chinese-gold-dark uppercase tracking-wider mb-2 flex items-center gap-2">
          <Star className="w-4 h-4 fill-chinese-gold" />
          Vocabulary Focus
        </h4>
        <ul className="text-sm text-gray-700 space-y-1 font-medium">
          {focus.map((f, i) => <li key={`focus-${i}`}>• {f}</li>)}
        </ul>
      </div>
    </div>
  );
}

export function Mascot({ type = "panda", className }: { type?: "panda" | "dragon", className?: string }) {
  const images = {
    panda: "https://www.svgrepo.com/show/435165/panda.svg",
    dragon: "https://www.svgrepo.com/show/396263/dragon.svg"
  };

  return (
    <motion.img 
      animate={{ 
        y: [0, -8, 0],
        rotate: [0, 1, -1, 0]
      }}
      transition={{ 
        repeat: Infinity, 
        duration: 3,
        ease: "easeInOut" 
      }}
      src={images[type]} 
      alt="Mascot"
      className={cn("w-32 h-32 object-contain drop-shadow-md", className)}
      referrerPolicy="no-referrer"
    />
  );
}
