/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "motion/react";
import React, { useState, useEffect } from "react";
import { db, auth } from './lib/firebase';
import { collection, addDoc, serverTimestamp, getDocFromServer, doc } from 'firebase/firestore';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
import { 
  CheckCircle2, 
  Users, 
  Zap, 
  Clock, 
  ArrowRight, 
  Star, 
  Search,
  Target,
  Brain,
  ShieldCheck,
  TrendingUp,
  LineChart,
  MessageSquare,
  Send,
  Sparkles,
  MousePointer2,
  BarChart3,
  Check,
  RefreshCw,
  Layout,
  ArrowLeft,
  Plus,
  ChevronRight,
  User,
  Mic,
  Wrench,
  Link2,
  Trophy,
  Menu,
  X
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

const stagger = {
  whileInView: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function App() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    telegram: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeCandidate, setActiveCandidate] = useState(0);
  const [activeView, setActiveView] = useState<"details" | "scores">("details");

  const toggleView = () => {
    setActiveView(prev => prev === "details" ? "scores" : "details");
  };

  const candidates = [
    {
      name: "Анна Иванова",
      phone: "—",
      status: "Завершено",
      progress: "Доп. вопросы",
      avgScore: "86.8",
      messages: "33",
      createdAt: "10 марта 2026 г. в 21:40",
      updatedAt: "10 марта 2026 г. в 21:40",
      scores: [
        { l: "ОБЩИЙ РЕЙТИНГ", v: "88%" },
        { l: "HARD SKILLS", v: "90%" },
        { l: "SOFT SKILLS", v: "85%" },
        { l: "КЕЙСЫ", v: "88%" },
        { l: "ОТВЕТСТВЕННОСТЬ", v: "80%" },
        { l: "ДОПОЛНИТЕЛЬНЫЕ ВОПРОСЫ", v: "90%" }
      ]
    },
    {
      name: "Илья Мельник",
      phone: "+7 (900) 555-44-33",
      status: "Отказ",
      progress: "Не прошел",
      avgScore: "32.5",
      messages: "12",
      createdAt: "12 марта 2026 г. в 15:30",
      updatedAt: "14 марта 2026 г. в 18:20",
      scores: [
        { l: "ОБЩИЙ РЕЙТИНГ", v: "32%" },
        { l: "HARD SKILLS", v: "25%" },
        { l: "SOFT SKILLS", v: "40%" },
        { l: "КЕЙСЫ", v: "30%" },
        { l: "ОТВЕТСТВЕННОСТЬ", v: "35%" },
        { l: "ДОПОЛНИТЕЛЬНЫЕ ВОПРОСЫ", v: "30%" }
      ]
    },
    {
      name: "Виктория Матросова",
      phone: "+7 (911) 222-11-00",
      status: "Завершено",
      progress: "Проверка СБ",
      avgScore: "78.2",
      messages: "24",
      createdAt: "12 марта 2026 г. в 10:15",
      updatedAt: "15 марта 2026 г. в 12:45",
      scores: [
        { l: "ОБЩИЙ РЕЙТИНГ", v: "79%" },
        { l: "HARD SKILLS", v: "75%" },
        { l: "SOFT SKILLS", v: "82%" },
        { l: "КЕЙСЫ", v: "78%" },
        { l: "ОТВЕТСТВЕННОСТЬ", v: "80%" },
        { l: "ДОПОЛНИТЕЛЬНЫЕ ВОПРОСЫ", v: "85%" }
      ]
    }
  ];

  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration. ");
        }
      }
    }
    testConnection();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const path = "leads";
    try {
      await addDoc(collection(db, path), {
        ...formData,
        createdAt: serverTimestamp()
      });
      setIsSubmitted(true);
      setFormData({ name: "", phone: "", telegram: "" });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    } finally {
      setIsSubmitting(false);
    }
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-cyan-500 selection:text-black antialiased overflow-x-hidden">
      {/* Background Tech Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid-white/[0.02] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.15)_0%,transparent_50%)]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-cyan-500/10 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tighter font-display text-white leading-none group cursor-default">
                GetProfi<span className="text-cyan-400">.ME</span>
                <span className="block h-0.5 w-0 group-hover:w-full bg-cyan-400 transition-all duration-300" />
              </span>
            </div>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden items-center gap-8 md:flex">
            {[
              { id: "features", label: "Преимущества" },
              { id: "how-it-works", label: "4D-Методология" },
              { id: "start", label: "Процесс" },
              { id: "results", label: "Результаты" }
            ].map((item) => (
              <a 
                key={item.id} 
                href={`#${item.id}`} 
                className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-cyan-400 transition-all"
              >
                {item.label}
              </a>
            ))}
            <motion.a 
              href="#test-drive" 
              whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(6, 182, 212, 0.6)" }}
              whileTap={{ scale: 0.95 }}
              className="rounded-lg bg-cyan-500 hover:bg-cyan-400 px-6 py-2 text-[10px] text-black hover:text-black font-black uppercase tracking-widest transition-colors shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:opacity-100"
            >
              НАЧАТЬ ПОИСК
            </motion.a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white p-4 -mr-4 flex items-center justify-center active:scale-90 transition-transform"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Nav Overlay */}
        <AnimatePresence mode="wait">
          {isMenuOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, staggerChildren: 0.05, delayChildren: 0.1 }}
              className="absolute top-full left-0 w-full md:hidden bg-slate-900 border-b border-white/5 overflow-hidden shadow-2xl z-50"
            >
              <div className="flex flex-col p-6 gap-2">
                {[
                  { name: "Преимущества", href: "#features" },
                  { name: "Методология", href: "#how-it-works" },
                  { name: "Процесс", href: "#start" },
                  { name: "Результаты", href: "#results" }
                ].map((item, i) => (
                  <motion.a 
                    key={item.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    href={item.href} 
                    onClick={() => setIsMenuOpen(false)}
                    className="text-lg font-medium text-slate-300 hover:text-white transition-colors py-3 border-b border-white/5 last:border-0"
                  >
                    {item.name}
                  </motion.a>
                ))}
                <motion.a 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25 }}
                  href="#test-drive" 
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full flex items-center justify-center rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black hover:text-black font-black uppercase tracking-widest mt-6 h-16 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all hover:scale-[1.02] active:scale-[0.98] hover:opacity-100"
                >
                  НАЧАТЬ ПОИСК
                </motion.a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main>
        {/* 1. Первый экран (Проблема и решение) - Premium Visual Hero */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden bg-slate-950 text-white">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(37,99,235,0.3)_0%,transparent_50%)]" />
          <div className="absolute inset-0 bg-grid-white/[0.02] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
          
          <div className="mx-auto max-w-7xl relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="text-left"
              >
                <Badge variant="outline" className="mb-8 border-cyan-500/30 bg-cyan-500/10 text-cyan-400 px-4 py-1.5 rounded-sm text-[10px] font-black tracking-[0.3em] uppercase">
                  <Sparkles className="h-3 w-3 mr-2 inline animate-pulse" /> ИНТЕЛЛЕКТУАЛЬНАЯ СИСТЕМА ПОДБОРА
                </Badge>
                
                <h1 className="text-[72px] font-black leading-[0.9] tracking-tighter mb-8 sm:mb-10 text-balance font-display uppercase">
                  Наймите <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-600">сотрудника мечты</span> <br /> 
                  без ручного пересмотра <br />
                  тысяч откликов
                </h1>
                
                <p className="text-xl sm:text-2xl text-slate-400 mb-12 max-w-xl leading-relaxed text-balance font-medium border-l-2 border-cyan-500/30 pl-6 italic">
                  Мы отфильтруем все отклики и покажем только тех кандидатов, с кем вам действительно стоит пообщаться. С вас — 9900 ₽. Через 3-4 дня мы проведем 50+ собеседований и отберем лучших кандидатов.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-5 mb-16">
                  <a 
                    href="#test-drive" 
                    className="inline-flex items-center justify-center bg-cyan-500 hover:bg-cyan-400 text-black hover:text-black rounded-xl h-16 px-10 text-sm font-black uppercase tracking-widest shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] transition-all hover:scale-[1.05] active:scale-[0.95] hover:opacity-100"
                  >
                    НАЧАТЬ ПОИСК <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                  <a 
                    href="#how-it-works" 
                    className="inline-flex items-center justify-center border border-white/10 bg-white/5 hover:bg-white/10 text-white hover:text-white rounded-xl h-16 px-10 text-sm font-black uppercase tracking-widest backdrop-blur-sm transition-all hover:scale-[1.05] active:scale-[0.95]"
                  >
                    КАК ЭТО РАБОТАЕТ?
                  </a>
                </div>
              </motion.div>

              {/* Dashboard Section */}
              <div className="relative mt-20 lg:mt-0 flex flex-col gap-6">
                {/* Candidate Selector */}
                <div className="flex justify-center lg:justify-start gap-2 z-30 overflow-x-auto no-scrollbar py-4 -my-4 px-4 -mx-4">
                  {candidates.map((c, i) => (
                    <motion.button
                      key={i}
                      onClick={() => setActiveCandidate(i)}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={cn(
                        "px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border relative group shrink-0",
                        activeCandidate === i 
                          ? "bg-cyan-500 border-cyan-400 text-black shadow-[0_0_15px_rgba(6,182,212,0.3)]" 
                          : "bg-slate-900/50 text-slate-500 hover:text-cyan-400 border-white/5 hover:border-cyan-500/30 backdrop-blur-md"
                      )}
                    >
                      {c.name}
                      {activeCandidate === i && (
                        <motion.div 
                          layoutId="activeTab"
                          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-cyan-400 rounded-full blur-[2px]"
                        />
                      )}
                    </motion.button>
                  ))}
                </div>

                <div className="grid gap-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeCandidate}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4 }}
                      className="flex flex-col gap-6"
                    >
                      {/* Block 1: Details */}
                      <motion.div 
                        whileHover={{ y: -5, scale: 1.01 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        className="bg-slate-900/80 backdrop-blur-xl border border-white/10 p-6 sm:p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group/card"
                      >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[100px] -z-10 group-hover/card:bg-cyan-500/10 transition-colors duration-500" />
                        
                        {/* Interactive Scanning Line */}
                        <motion.div 
                          initial={{ top: "-100%" }}
                          animate={{ top: "200%" }}
                          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent z-10 pointer-events-none"
                        />
                        
                        <div className="flex items-center justify-between mb-8">
                          <h3 className="text-xl font-black text-white font-display uppercase tracking-tight flex items-center gap-3">
                            <User className="h-5 w-5 text-cyan-400" />
                            Детали собеседования
                          </h3>
                          <div className="h-6 px-3 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[8px] font-black text-cyan-400 flex items-center uppercase tracking-widest animate-pulse">
                            Объективная оценка
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {[
                            { label: "КАНДИДАТ", value: candidates[activeCandidate].name },
                            { label: "ТЕЛЕФОН", value: candidates[activeCandidate].phone },
                            { label: "СТАТУС", value: candidates[activeCandidate].status, badge: true },
                            { label: "ПРОГРЕСС", value: candidates[activeCandidate].progress },
                            { label: "СРЕДНИЙ БАЛЛ", value: candidates[activeCandidate].avgScore, color: "cyan" },
                            { label: "СООБЩЕНИЙ", value: candidates[activeCandidate].messages },
                            { label: "ДАТА СОЗДАНИЯ", value: candidates[activeCandidate].createdAt },
                            { label: "ПОСЛЕДНЕЕ ОБНОВЛЕНИЕ", value: candidates[activeCandidate].updatedAt }
                          ].map((item, i) => (
                            <motion.div 
                              key={i} 
                              whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                              className={cn("p-4 rounded-xl bg-white/[0.03] border border-white/5 transition-colors", (i === 0 || i === 4) && "col-span-1 md:col-span-2")}
                            >
                              <div className="text-[8px] sm:text-[9px] font-bold uppercase text-slate-500 mb-1 tracking-widest">{item.label}</div>
                              <div className={cn(
                                "text-[11px] sm:text-xs font-black leading-tight uppercase",
                                item.badge ? (item.value === "Завершено" ? "text-cyan-400" : "text-red-400") : "text-white",
                                item.color === "cyan" && "text-cyan-400 text-lg sm:text-xl"
                              )}>
                                {item.value}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>

                      {/* Block 2: Scores Matrix */}
                      <motion.div 
                        whileHover={{ y: -5, scale: 1.01 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        className="bg-slate-900/80 backdrop-blur-xl border border-cyan-500/20 p-6 sm:p-8 rounded-[2rem] shadow-[0_0_50px_rgba(6,182,212,0.1)] relative overflow-hidden group/card"
                      >
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/5 blur-[100px] -z-10 group-hover/card:bg-cyan-500/10 transition-colors duration-500" />
                        
                        {/* Interactive Scanning Line */}
                        <motion.div 
                          initial={{ top: "-100%" }}
                          animate={{ top: "200%" }}
                          transition={{ duration: 5, repeat: Infinity, ease: "linear", delay: 1 }}
                          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent z-10 pointer-events-none"
                        />
                        
                        <h3 className="text-xl font-black text-white font-display uppercase tracking-tight mb-8 flex items-center gap-3">
                          <BarChart3 className="h-5 w-5 text-cyan-400" />
                          Оценки собеседования
                        </h3>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                          {candidates[activeCandidate].scores.map((s, i) => (
                            <motion.div 
                              key={i} 
                              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.05)" }}
                              className="p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-cyan-500/30 transition-all group/stat"
                            >
                              <div className="text-[8px] font-bold uppercase text-slate-500 mb-1 tracking-widest group-hover/stat:text-cyan-500/50 transition-colors">{s.l}</div>
                              <div className={cn(
                                "text-lg sm:text-xl font-black font-mono tracking-tighter",
                                parseInt(s.v) > 70 ? "text-cyan-400" :
                                parseInt(s.v) > 50 ? "text-amber-400" :
                                "text-red-400"
                              )}>
                                {s.v}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                        
                        <div className="p-6 rounded-2xl border border-cyan-500/30 bg-cyan-500/5 shadow-[0_0_30px_rgba(6,182,212,0.1)] flex justify-between items-center group-hover/card:shadow-[0_0_40px_rgba(6,182,212,0.2)] transition-all">
                          <div className="text-[10px] sm:text-[12px] font-black uppercase text-cyan-500/50 tracking-[0.2em]">СРЕДНИЙ БАЛЛ КАНДИДАТА</div>
                          <div className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-cyan-400 tracking-tighter">
                            {candidates[activeCandidate].avgScore}
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
        </section>
        <section id="features" className="py-32 lg:py-56 relative bg-slate-950">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
          <div className="mx-auto max-w-7xl px-6 relative">
            <div className="text-center mb-24">
              <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 mb-8 px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-[0.4em]">
                ВОЗМОЖНОСТИ ПЛАТФОРМЫ
              </Badge>
              <h2 className="text-[clamp(2rem,7vw,4rem)] font-black mb-8 uppercase tracking-tighter font-display leading-[0.95] text-white">
                Что вы <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-cyan-400">получаете</span>
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-xl font-medium border-t border-white/5 pt-8">
                Система берет на себя самую сложную работу, позволяя вам фокусироваться на финальном выборе, а не на фильтрации шума.
              </p>
            </div>
            
            <motion.div 
              className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
              variants={stagger}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
            >
              {[
                {
                  title: "10–15 лучших кандидатов",
                  desc: "Обработаем КАЖДЫЙ отклик, проведем 50-100 интервью и найдём настоящие самородки из тонны мусора и автооткликов.",
                  icon: Users,
                  color: "cyan"
                },
                {
                  title: "Сохраним 40 часов времени",
                  desc: "Вы тратите всего 30 минут на запуск. Особенно важно, если наймом занимаетесь лично вы.",
                  icon: Clock,
                  color: "slate"
                },
                {
                  title: "Честный бюджет",
                  desc: "Никаких скрытых платежей. Вы платите только за полностью пройденные интервью. В среднем: 1 собеседование = 80–100 ₽. Это делает качественный найм доступным для любого бизнеса.",
                  icon: TrendingUp,
                  color: "cyan"
                },
                {
                  title: "Закрытие за 7–8 дней",
                  desc: "Никаких месяцев ожидания. Система выдаёт оцифрованные досье на ВСЕХ кандидатов, прошедших интервью, пока наши конкуренты только начинают просмотр резюме.",
                  icon: Zap,
                  color: "slate"
                }
              ].map((item, i) => (
                <motion.div key={i} variants={fadeIn} className="group">
                  <Card className="h-full border border-white/5 bg-white/[0.02] backdrop-blur-3xl shadow-[0_0_50px_-12px_rgba(6,182,212,0.1)] transition-all hover:bg-white/[0.05] hover:border-cyan-500/30 rounded-[2rem] overflow-hidden">
                    <CardContent className="p-10">
                      <div className={cn(
                        "mb-8 flex h-14 w-14 items-center justify-center rounded-2xl transition-all group-hover:scale-110 duration-500",
                        item.color === "cyan" ? "bg-cyan-600 text-black shadow-xl shadow-cyan-500/20" : "bg-slate-800 text-white shadow-xl shadow-slate-900/20"
                      )}>
                        <item.icon className="h-7 w-7" />
                      </div>
                      <h3 className="text-xl font-black mb-4 leading-tight font-display uppercase tracking-tight">{item.title}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed font-medium">{item.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Strategic CTA 1 */}
            <motion.div 
              {...fadeIn} 
              className="mt-20 flex justify-center"
            >
              <a 
                href="#test-drive" 
                className="group relative inline-flex items-center justify-center bg-white/5 hover:bg-white/10 text-white rounded-2xl h-16 px-12 text-sm font-black uppercase tracking-[0.2em] transition-all hover:scale-105 border border-white/10 backdrop-blur-3xl overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-3">
                  ЗАПУСТИТЬ ПОДБОР <ChevronRight className="h-4 w-4 text-cyan-500 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </a>
            </motion.div>
          </div>
        </section>

        {/* 3. Как мы это делаем (Качество отбора 4D) */}
        <section id="how-it-works" className="py-32 lg:py-56 bg-slate-950 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(6,182,212,0.1)_0%,transparent_50%)]" />
          
          <div className="mx-auto max-w-7xl px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-24 items-center">
              <motion.div {...fadeIn}>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  ТЕХНОЛОГИЯ 4D-ОТБОРА
                </div>
                
                <h2 className="text-[clamp(2rem,7vw,4rem)] font-black mb-10 uppercase leading-[0.95] font-display tracking-tighter">
                  Как мы это делаем: <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-600">4D‑оценка</span>
                </h2>
                <p className="text-xl sm:text-2xl text-slate-400 mb-12 max-w-xl leading-relaxed text-balance font-medium border-l-2 border-cyan-500/30 pl-6 italic">
                  Мы не просто проводим тестирование, наша система проводит полноценное глубокое интервью уровня дорогого кадрового агентства.
                </p>

                <div className="mb-14 p-8 rounded-[2rem] bg-white/[0.03] border border-white/5 backdrop-blur-md relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                    <ShieldCheck className="h-20 w-20 text-cyan-500" />
                  </div>
                  
                  <h4 className="text-cyan-400 font-black uppercase tracking-[0.3em] text-[10px] mb-6 flex items-center gap-2">
                    <ShieldCheck className="h-3 w-3" /> КВАЛИФИКАЦИЯ
                  </h4>
                  <p className="text-white text-xl mb-8 font-black leading-tight uppercase font-display tracking-tight">
                    ЖЕСТКИЙ БАРЬЕР НА ВХОДЕ. <br />
                    <span className="text-slate-500">ОТСЕКАЕМ ШУМ ДО НАЧАЛА ИНТЕРВЬЮ</span>
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    {[
                      "МОЩНОСТЬ ПК",
                      "РЕЛЕВАНТНЫЙ ОПЫТ",
                      "ЧАСОВОЙ ПОЯС",
                      "ПОДХОДЯЩИЙ KPI"
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-slate-400 text-[11px] font-black uppercase tracking-tighter">
                        <div className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
                        {item}
                      </div>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-white/5">
                    <p className="text-[10px] text-cyan-400 font-black uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                       <Zap className="h-3 w-3" /> Экономика процесса
                    </p>
                    <p className="text-slate-400 text-xs leading-relaxed font-medium">
                      Ваш баланс интервью в полной сохранности. Списание происходит <span className="text-white font-bold italic">только за кандидатов, полностью прошедших 4D-собеседование</span>. Если соискатель не проходит первичный фильтр (например, из-за часового пояса), он даже не допускается до интервью — и вы не тратите ресурсы впустую.
                    </p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <h4 className="text-cyan-400 font-black uppercase tracking-widest text-[10px] mb-8 flex items-center gap-2">
                      <BarChart3 className="h-3 w-3" /> КЛЮЧЕВЫЕ МЕТРИКИ АНАЛИЗА
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-x-10 gap-y-12">
                      {[
                        { title: "Hard & Soft Skills", desc: "Проверяем реальные профессиональные навыки, опыт и личные качества кандидата.", icon: Brain },
                        { title: "Бизнес-логика", desc: "Даём практические задачи, чтобы увидеть, как кандидат мыслит и решает реальные проблемы.", icon: Target },
                        { title: "Ответственность и проактивность", desc: "Выявляем самостоятельность и способность брать ответственность за результат.", icon: ShieldCheck },
                        { title: "Мотивация и достигаторство", desc: "Оцениваем вовлечённость и проверяем, является ли кандидат настоящим «достигатором».", icon: TrendingUp }
                      ].map((item, i) => (
                        <div key={i} className="group">
                          <div className="flex gap-5 items-start">
                            <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 group-hover:bg-cyan-500 group-hover:text-black transition-all duration-300">
                              <item.icon className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-bold text-lg mb-2 uppercase tracking-tight font-display">{item.title}</h4>
                              <p className="text-slate-500 text-sm leading-relaxed font-medium">{item.desc}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Strategic CTA 2 */}
                    <motion.div 
                      {...fadeIn} 
                      className="mt-16 sm:mt-24"
                    >
                      <a 
                        href="#test-drive" 
                        className="group relative inline-flex items-center justify-center bg-cyan-600 hover:bg-cyan-500 text-black rounded-2xl h-16 px-12 text-sm font-black uppercase tracking-[0.2em] transition-all hover:scale-105 shadow-[0_20px_40px_-10px_rgba(6,182,212,0.3)]"
                      >
                        <span className="relative z-10 flex items-center gap-3">
                          ЗАБРАТЬ МОИ ОТКЛИКИ НА HH.RU <Trophy className="h-4 w-4 text-black group-hover:rotate-12 transition-transform" />
                        </span>
                      </a>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-slate-900/50 backdrop-blur-2xl border border-white/5 p-8 sm:p-16 rounded-[3rem] relative z-10 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-3xl" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-12">
                      <div className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_10px_#06b6d4]" />
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-500/50">СИСТЕМА ЖИВОГО ДИАЛОГА</span>
                    </div>
                    
                    <h3 className="text-3xl sm:text-4xl font-black mb-12 uppercase font-display leading-[1.1] tracking-tighter">
                      ГЛУБОКОЕ ПОГРУЖЕНИЕ <br />
                      <span className="text-slate-500">В ЛОГИКУ КАНДИДАТА</span>
                    </h3>

                    <div className="space-y-12">
                      {[
                        {
                          title: "Анализ мышления",
                          desc: "Интервью анализирует не только содержание ответа, но и логику, глубину и структуру мышления кандидата.",
                          icon: Brain
                        },
                        {
                          title: "Живая адаптация",
                          desc: "При необходимости платформа мгновенно уточняет детали и перестраивает ход беседы в реальном времени.",
                          icon: RefreshCw
                        },
                        {
                          title: "Максимальная точность",
                          desc: "Это обеспечивает глубокую и объективную оценку компетенций и поведенческих качеств без шаблонов.",
                          icon: CheckCircle2
                        }
                      ].map((item, i) => (
                        <div key={i} className="flex gap-8 group">
                          <div className="h-14 w-14 shrink-0 rounded-2xl bg-slate-950 border border-white/5 flex items-center justify-center text-cyan-400 group-hover:border-cyan-500 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all duration-500">
                            <item.icon className="h-6 w-6" />
                          </div>
                          <div>
                            <h4 className="text-lg font-black mb-2 text-white/90 font-display uppercase tracking-tight">{item.title}</h4>
                            <p className="text-slate-500 text-sm leading-relaxed font-medium">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Visual Connector Lines */}
                <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-24 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent hidden lg:block" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* 4. Запуск за 30 минут */}
        <section id="start" className="py-32 lg:py-48 bg-slate-950 text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
          <div className="mx-auto max-w-4xl px-6">
            <motion.div {...fadeIn} className="mb-20">
              <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 px-6 py-1.5 rounded-full mb-8">
                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-cyan-400">БЫСТРЫЙ СТАРТ</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black uppercase font-display tracking-tighter leading-none">
                Запуск за <span className="text-cyan-500">30</span> минут
              </h2>
            </motion.div>

            <div className="space-y-4">
              {[
                { 
                  title: "Регистрация", 
                  desc: "Личный кабинет за 1 минуту", 
                  icon: User 
                },
                { 
                  title: "Вакансия голосом", 
                  desc: "11 вопросов, вы наговариваете ответы → идеальная вакансия для HH.ru за 20 минут", 
                  icon: Mic 
                },
                { 
                  title: "Доработка", 
                  desc: "Система сама подбирает вопросы под компетенции, вы при необходимости добавляете свои", 
                  icon: Wrench 
                },
                { 
                  title: "Интеграция c HH.ru по API", 
                  desc: "1 минута и все отклики с Вашей учетной записи уже в системе GetProfi", 
                  icon: Link2 
                },
                { 
                  title: "Результат через 5–7 дней", 
                  desc: "Топ–10/15 финалистов с полным оцифрованным досье", 
                  icon: Trophy 
                }
              ].map((step, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="group bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-cyan-500/30 p-6 sm:px-10 sm:py-8 rounded-3xl transition-all duration-300 flex items-center gap-6 sm:gap-10"
                >
                  <div className="h-16 w-16 shrink-0 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-black transition-all duration-500">
                    <step.icon className="h-7 w-7 text-cyan-400 group-hover:text-black" />
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-xl sm:text-2xl font-black mb-1 font-display tracking-tight text-white uppercase">{step.title}</h4>
                    <p className="text-slate-500 text-sm sm:text-base font-medium leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Почему так быстро? */}
        <section className="py-32 lg:py-56 relative overflow-hidden bg-slate-950">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.05)_0%,transparent_50%)]" />
          <div className="mx-auto max-w-5xl px-6 text-center relative z-10">
            <motion.div {...fadeIn}>
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 mb-12 shadow-xl border border-cyan-500/20">
                <Zap className="h-10 w-10" />
              </div>
              <h2 className="text-[clamp(2.5rem,7vw,4rem)] font-black mb-10 uppercase tracking-tighter font-display leading-[0.95] text-white underline decoration-cyan-500/30 underline-offset-[12px]">ПОЧЕМУ ТАК БЫСТРО?</h2>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-slate-400 leading-relaxed text-balance font-medium border-b border-white/5 pb-12 italic">
                Основной поток откликов приходит в первые 2–3 дня. Система GetProfi одновременно проводит тысячи интервью. <br className="hidden sm:block" />
                Уже через <span className="text-cyan-400 font-black">5–7 дней</span> вы можете закрывать вакансии.
              </p>
            </motion.div>
          </div>
        </section>

        {/* 5. Ваш итог */}
        <section id="results" className="py-32 lg:py-56 bg-slate-950/50 relative">
          <div className="mx-auto max-w-7xl px-6 relative">
            <motion.div {...fadeIn} className="text-center mb-24">
              <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 mb-6 px-4 py-1 rounded-sm text-[10px] font-black uppercase tracking-[0.3em]">
                ЭФФЕКТИВНОСТЬ НАЙМА
              </Badge>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-8 uppercase tracking-tighter font-display text-white">Ваш <span className="text-cyan-500">результат</span></h2>
              <p className="text-slate-400 text-xl font-medium">Метрики, которые доказывают эффективность системы.</p>
            </motion.div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { label: "Скорость", value: "7 дней", icon: Zap, detail: "На полный цикл уже с финалистами" },
                { label: "Ваше участие", value: "30 мин", icon: Clock, detail: "Регистрация, коннект с HH.ru и бриф" },
                { label: "Качество", value: "Senior", icon: Star, detail: "Рекрутер без выходных и выгорания" },
                { label: "Стоимость", value: "7 тыс. ₽", icon: TrendingUp, detail: "Средняя стоимость закрытия одной вакансии" }
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  variants={fadeIn}
                  whileHover={{ y: -10 }}
                  className="bg-white/[0.02] p-12 rounded-[2.5rem] border border-white/5 shadow-2xl flex flex-col items-center text-center group transition-all duration-500 hover:bg-white/[0.05] hover:border-cyan-500/30"
                >
                  <div className="h-16 w-16 rounded-2xl bg-white/5 text-cyan-500 mb-8 flex items-center justify-center group-hover:bg-cyan-600 group-hover:text-black transition-all duration-500 group-hover:rotate-6">
                    <item.icon className="h-7 w-7" />
                  </div>
                  <p className="text-slate-500 text-[10px] uppercase font-black tracking-[0.3em] mb-4">{item.label}</p>
                  <p className="text-3xl font-black uppercase mb-3 font-display tracking-tight text-white">{item.value}</p>
                  <p className="text-cyan-500 font-bold text-xs uppercase tracking-widest">{item.detail}</p>
                </motion.div>
              ))}
            </div>


            <motion.div 
              {...fadeIn}
              className="mt-24 p-10 sm:p-16 rounded-[3rem] bg-slate-900 text-white relative overflow-hidden shadow-2xl border border-cyan-500/20"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-600/10 blur-[80px] rounded-full -mr-32 -mt-32" />
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-10 text-center md:text-left">
                <div className="h-24 w-24 shrink-0 rounded-2xl bg-cyan-600 flex items-center justify-center shadow-xl shadow-cyan-500/20">
                  <ShieldCheck className="h-12 w-12 text-black" />
                </div>
                <div>
                  <Badge className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-4 rounded-sm px-4 py-1 font-black uppercase tracking-[0.3em] text-[10px]">
                    ОБЯЗАТЕЛЬСТВА
                  </Badge>
                  <h3 className="text-3xl sm:text-4xl font-black uppercase mb-4 font-display tracking-tighter text-white">ГАРАНТИЯ 100% ВОЗВРАТА</h3>
                  <p className="text-slate-400 text-lg sm:text-xl font-medium leading-relaxed max-w-2xl border-l-2 border-cyan-500/30 pl-6 italic">
                    Если за 30 дней не будет результата — вернём деньги полностью. Без вопросов.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 6. Наша «фишка» (Умный бриф) */}
        <section className="py-32 lg:py-72 relative overflow-hidden bg-slate-950">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/10 blur-[160px] rounded-full pointer-events-none" />
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cyan-600/5 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="mx-auto max-w-7xl px-6 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="relative bg-slate-900/40 backdrop-blur-[100px] border border-white/10 rounded-[4rem] p-8 sm:p-16 lg:p-24 overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)]">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500/20 blur-[100px] rounded-full group-hover:bg-cyan-500/30 transition-colors duration-700" />
                
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24 relative z-10">
                  <div className="lg:w-[46%]">
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="inline-flex items-center gap-3 bg-cyan-500/10 border border-cyan-500/20 px-5 py-2 rounded-full mb-10"
                    >
                      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                      <span className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-400">ЭКСКЛЮЗИВНОЕ ПРЕДЛОЖЕНИЕ</span>
                    </motion.div>
                    
                    <h2 className="text-[40px] sm:text-[60px] font-black mb-8 uppercase leading-[0.9] tracking-tighter text-white">
                      ИНТОНАЦИОННОЕ <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-cyan-100 to-cyan-500">ОФОРМЛЕНИЕ</span> <br />
                      ВАКАНСИИ
                    </h2>
                    
                    <p className="text-[19px] text-slate-400 leading-relaxed mb-12 font-medium italic border-l-4 border-cyan-500/40 pl-8 max-w-lg">
                      Ваши предложения на HeadHunter перестанут быть шаблонными. Наша дообученная нейросеть создаёт «вкусные» описания вакансий под любую должность.
                    </p>
                    
                    <div className="grid gap-5">
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex items-start gap-6 group/item p-6 rounded-[2.5rem] bg-white/[0.01] border border-white/5 hover:bg-white/[0.03] hover:border-cyan-500/20 transition-all duration-500"
                      >
                        <div className="h-14 w-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                          <MessageSquare className="h-6 w-6 text-cyan-400" />
                        </div>
                        <div>
                          <p className="text-lg text-white font-black uppercase tracking-tight mb-2">ГЛУБОКИЕ ВОПРОСЫ</p>
                          <p className="text-sm text-slate-400 font-medium leading-relaxed">Система генерирует вопросы для выявления истинной мотивации.</p>
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex items-start gap-6 group/item p-6 rounded-[2.5rem] bg-white/[0.01] border border-white/5 hover:bg-white/[0.03] hover:border-cyan-500/20 transition-all duration-500"
                      >
                        <div className="h-14 w-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                          <Plus className="h-6 w-6 text-cyan-400" />
                        </div>
                        <div>
                          <p className="text-lg text-white font-black uppercase tracking-tight mb-2">ГОТОВАЯ ПУБЛИКАЦИЯ</p>
                          <p className="text-sm text-slate-400 font-medium leading-relaxed">Получаете пост, который выделяется на фоне серых вакансий.</p>
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  <div className="lg:w-[54%] w-full">
                    <div className="relative group/mockup">
                      <div className="absolute inset-0 bg-cyan-500/15 blur-[120px] rounded-full transform -rotate-12 translate-x-10 scale-95" />
                      
                      <div className="relative bg-[#0F172A]/80 backdrop-blur-3xl rounded-[4rem] p-4 sm:p-10 shadow-[0_50px_100px_-30px_rgba(0,0,0,0.8)] border border-white/10 overflow-hidden">
                        <div className="bg-slate-900/40 backdrop-blur-md rounded-[3rem] p-8 mb-8 border border-white/5 relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
                          <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                <ArrowLeft className="h-3 w-3 text-slate-500" />
                              </div>
                              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-500">МОИ ВАКАНСИИ</span>
                            </div>
                            <div className="flex gap-2">
                              {[1, 2, 3].map(i => <div key={i} className={cn("h-1.5 w-1.5 rounded-full", i === 3 ? "bg-cyan-500" : "bg-slate-800")} />)}
                            </div>
                          </div>
                          
                          <h4 className="text-[clamp(1.5rem,4vw,2.25rem)] font-black mb-4 uppercase tracking-tighter text-white">НОВАЯ ВАКАНСИЯ</h4>
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full border-2 border-cyan-500/30 flex items-center justify-center p-1">
                              <div className="w-full h-full rounded-full bg-cyan-400 animate-pulse" />
                            </div>
                            <p className="text-[10px] text-slate-400 font-bold leading-normal uppercase tracking-widest max-w-[280px]">
                              Сначала бриф: ассистент задаёт вопросы, вы отвечаете текстом или голосом.
                            </p>
                          </div>
                        </div>

                        <div className="px-6 mb-12">
                          <div className="flex items-center justify-between mb-6 overflow-x-auto no-scrollbar gap-8 pb-2">
                            {[
                               { l: "Бриф", a: true }, { l: "Публикация" }, { l: "Квиз" }, { l: "Дополнить" }, { l: "Формат" }
                            ].map((s, i) => (
                              <div key={i} className="flex flex-col items-center gap-3 shrink-0">
                                <div className={cn(
                                  "h-12 w-12 rounded-[1.25rem] flex items-center justify-center text-[11px] font-black border transition-all duration-500",
                                  s.a ? "bg-cyan-500 border-cyan-400 text-black shadow-[0_0_30px_rgba(6,182,212,0.4)]" : "bg-white/5 text-slate-700 border-white/5"
                                )}>
                                  {i + 1}
                                </div>
                                <span className={cn(
                                  "text-[9px] font-black uppercase tracking-widest",
                                  s.a ? "text-cyan-400" : "text-slate-800"
                                )}>{s.l}</span>
                              </div>
                            ))}
                          </div>
                          <div className="h-1 w-full bg-white/5 rounded-full">
                            <motion.div initial={{ width: 0 }} whileInView={{ width: "20%" }} className="h-full bg-cyan-500 rounded-full" />
                          </div>
                        </div>

                        <div className="bg-slate-900/60 rounded-[3.5rem] p-10 sm:p-12 border border-white/5 relative min-h-[380px] flex flex-col items-center justify-center text-center overflow-hidden">
                          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.05)_0%,transparent_70%)]" />
                          <div className="absolute -bottom-40 -left-20 w-80 h-80 bg-cyan-600/5 blur-[100px] rounded-full pointer-events-none" />
                          
                          <div className="relative z-10 space-y-12">
                            <motion.div 
                              animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
                              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                              className="relative"
                            >
                              <div className="absolute inset-0 bg-cyan-500/20 blur-2xl rounded-full" />
                              <div className="bg-gradient-to-br from-cyan-600 to-cyan-400 w-28 h-28 rounded-[3rem] flex items-center justify-center mx-auto shadow-[0_20px_40px_rgba(6,182,212,0.3)] border border-white/20 relative z-10">
                                <Brain className="h-14 w-14 text-black" />
                              </div>
                            </motion.div>
                            
                            <div className="space-y-4">
                              <h5 className="text-3xl font-black uppercase text-white tracking-tight">НАЧАТЬ БРИФ</h5>
                              <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.15em] max-w-[300px] mx-auto leading-relaxed">
                                Нажмите кнопку — ассистент задаст первый вопрос.
                              </p>
                            </div>

                            <Button className="bg-cyan-500 hover:bg-cyan-400 text-black hover:text-black rounded-[2rem] h-20 px-16 text-[13px] font-black uppercase tracking-[0.25em] transition-all shadow-[0_20px_50px_rgba(6,182,212,0.4)] border-t border-white/20">
                              СОЗДАТЬ ВАКАНСИЮ БЕСПЛАТНО <ChevronRight className="ml-3 h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="absolute -top-8 -right-8 hidden lg:block bg-slate-800/80 backdrop-blur-xl border border-white/10 p-5 rounded-3xl shadow-2xl z-20 w-64 rotate-6"
                      >
                        <div className="flex items-center gap-4 mb-3">
                          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                             <MessageSquare className="h-4 w-4" />
                          </div>
                          <span className="text-[9px] font-black text-white uppercase tracking-widest">A.I. Processing...</span>
                        </div>
                        <div className="space-y-2">
                          <div className="h-1 w-full bg-white/5 rounded-full" />
                          <div className="h-1 w-[80%] bg-white/5 rounded-full" />
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 7. Бесплатный тест-драйв */}
        <section id="test-drive" className="py-16 sm:py-32 lg:py-56 relative overflow-hidden bg-slate-950">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex flex-col lg:grid lg:grid-cols-12 gap-10 lg:gap-24 items-start">
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="lg:col-span-6 text-left w-full"
              >
                <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 mb-8 px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-[0.4em]">
                  ПОПРОБУЙТЕ БЕСПЛАТНО
                </Badge>
                <h2 className="text-[clamp(2.5rem,7vw,4.5rem)] font-black mb-6 sm:mb-10 uppercase leading-[0.95] font-display tracking-tighter text-white">
                  Убедитесь в <br className="hidden sm:block" /> <span className="text-cyan-500">результате</span>
                </h2>
                <p className="text-lg sm:text-2xl text-slate-400 mb-8 sm:mb-14 leading-relaxed max-w-lg font-medium border-l-2 border-cyan-500/50 pl-6">
                  Запустите GetProfi на ваших реальных откликах. Посмотрите, как нейросеть общается с кандидатами и какие досье она формирует.
                </p>
                <div className="bg-slate-900 text-white p-6 sm:p-12 rounded-[1.5rem] sm:rounded-[3rem] relative overflow-hidden group shadow-[0_30px_100px_rgba(6,182,212,0.1)] border border-cyan-500/20 text-left max-w-xl">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-600/10 blur-[80px] rounded-full -mr-24 -mt-24" />
                  <h3 className="text-xl sm:text-3xl font-black uppercase mb-6 font-display tracking-tight text-cyan-400">Первые 10 интервью — 0 ₽</h3>
                  <p className="text-slate-400 mb-10 text-base sm:text-lg leading-relaxed font-medium">Мы бесплатно просеем вашу базу, проведем 10 глубоких собеседований и выдадим оцифрованные досье на лучших кандидатов.</p>
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                      <Check className="h-5 w-5 sm:h-6 sm:w-6 text-black" />
                    </div>
                    <span className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-cyan-400 animate-pulse">Доступно прямо сейчас</span>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-6 w-full mt-12 lg:mt-0"
              >
                <div className="bg-slate-900 border border-cyan-500/10 p-5 sm:p-12 md:p-16 rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] max-w-xl mx-auto lg:mr-0 backdrop-blur-3xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-30" />
                  {isSubmitted ? (
                    <div className="text-center py-16">
                      <motion.div 
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="bg-cyan-500/20 text-cyan-400 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-[0_0_50px_rgba(6,182,212,0.2)]"
                      >
                        <CheckCircle2 className="h-12 w-12" />
                      </motion.div>
                      <h3 className="text-4xl font-black uppercase mb-6 font-display tracking-tight text-white">ЗАЯВКА ОТПРАВЛЕНА</h3>
                      <p className="text-slate-400 text-xl font-medium">Наш менеджер свяжется с вами в Telegram в ближайшее время для активации бесплатного доступа.</p>
                      <Button variant="outline" className="mt-12 rounded-xl px-10 h-14 font-black uppercase tracking-widest border-cyan-500/30 text-cyan-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all hover:scale-105" onClick={() => setIsSubmitted(false)}>ОТПРАВИТЬ ЕЩЕ РАЗ</Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6 text-left relative z-10">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="uppercase font-black text-[10px] tracking-[0.3em] text-cyan-400/50 ml-2">Как вас зовут?</Label>
                        <Input 
                          id="name" 
                          required 
                          className="rounded-xl border-white/10 h-14 sm:h-16 px-6 sm:px-8 focus-visible:ring-cyan-500 bg-white/[0.03] text-base sm:text-lg font-medium text-white placeholder:text-slate-700 focus:bg-white/[0.05] transition-all" 
                          placeholder="ВАШЕ ИМЯ"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="uppercase font-black text-[10px] tracking-[0.3em] text-cyan-400/50 ml-2">Телефон для связи</Label>
                        <Input 
                          id="phone" 
                          type="tel" 
                          required 
                          className="rounded-xl border-white/10 h-14 sm:h-16 px-6 sm:px-8 focus-visible:ring-cyan-500 bg-white/[0.03] text-base sm:text-lg font-medium text-white placeholder:text-slate-700 focus:bg-white/[0.05] transition-all" 
                          placeholder="НОМЕР ТЕЛЕФОНА"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="telegram" className="uppercase font-black text-[10px] tracking-[0.3em] text-cyan-400/50 ml-2">Ваш Telegram для доступа</Label>
                        <Input 
                          id="telegram" 
                          required 
                          className="rounded-xl border-white/10 h-14 sm:h-16 px-6 sm:px-8 focus-visible:ring-cyan-500 bg-white/[0.03] text-base sm:text-lg font-medium text-white placeholder:text-slate-700 focus:bg-white/[0.05] transition-all" 
                          placeholder="@НИКНЕЙМ"
                          value={formData.telegram}
                          onChange={(e) => setFormData({...formData, telegram: e.target.value})}
                        />
                      </div>
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full h-16 sm:h-20 bg-cyan-500 hover:bg-cyan-400 text-black hover:text-black rounded-xl text-lg sm:text-xl font-black uppercase tracking-[0.1em] shadow-[0_10px_30px_rgba(6,182,212,0.3)] hover:shadow-[0_10px_40px_rgba(6,182,212,0.5)] transition-all hover:scale-[1.02] active:scale-[0.98] mt-4 hover:opacity-100"
                      >
                        {isSubmitting ? "ОТПРАВКА..." : "ПОЛУЧИТЬ ДОСТУП БЕСПЛАТНО"}
                      </Button>
                      <p className="text-center text-[9px] text-white/30 font-bold uppercase tracking-widest mt-6">
                        Нажимая кнопку, вы соглашаетесь на обработку персональных данных
                      </p>
                    </form>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 8. Финальный призыв и контакты */}
        <footer className="py-32 bg-slate-950 text-white relative overflow-hidden">
          {/* Background Glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-cyan-600/10 blur-[120px] rounded-full -z-0" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/5 blur-[100px] rounded-full -z-0" />
          
          <div className="mx-auto max-w-7xl px-6 relative z-10">
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  КОНТАКТЫ
                </div>
                <h2 className="text-[clamp(1.75rem,6vw,4rem)] font-black mb-8 uppercase font-display tracking-tighter leading-[0.95]">
                  ОСТАЛИСЬ ВОПРОСЫ? <br className="hidden sm:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-600">ДАВАЙТЕ ОБСУДИМ</span>
                </h2>
                <p className="text-slate-400 text-xl font-medium leading-relaxed mb-12">
                  Пишите нам в любое время — мы ответим максимально оперативно, чтобы помочь настроить систему под ваши задачи.
                </p>
              </motion.div>

              <motion.a 
                href="https://t.me/Evgenii_Shelkoviy" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="group relative inline-flex items-center justify-center"
              >
                <div className="absolute -inset-1 bg-cyan-500 rounded-[2rem] blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                <div className="relative bg-cyan-500 text-black rounded-[1.5rem] sm:rounded-[2rem] h-16 sm:h-20 px-8 sm:px-12 text-lg sm:text-xl font-black uppercase tracking-wider inline-flex items-center shadow-2xl transition-all group-hover:bg-cyan-400 group-hover:text-black">
                  <Send className="mr-3 sm:mr-4 h-6 w-6 sm:h-7 sm:w-7" /> 
                  Написать в Telegram
                </div>
              </motion.a>
              
              <div className="mt-24 sm:mt-40 w-full pt-16 border-t border-white/5 flex justify-center items-center">
                <div className="flex flex-col items-center text-center">
                  <span className="text-3xl font-black font-display tracking-tighter text-white leading-none">
                    GetProfi<span className="text-cyan-500">.ME</span>
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 mt-2">Автономный рекрутинг</span>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
