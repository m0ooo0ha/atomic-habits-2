"use client";
import React, { useState, useEffect, useCallback } from 'react';

export default function AtomicHabitsPro() {
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showWelcome, setShowWelcome] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [habits, setHabits] = useState([]);
  const [notes, setNotes] = useState('');
  const [mood, setMood] = useState(null);
  const [moodHistory, setMoodHistory] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [newHabit, setNewHabit] = useState({ name: '', categories: [], cue: '', identity: '', twoMinuteVersion: '', reminderTime: '' });
  const [editingHabit, setEditingHabit] = useState(null);
  const [activeTab, setActiveTab] = useState('today');
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [celebrateId, setCelebrateId] = useState(null);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  const categories = {
    'مهني': { color: '#3b82f6', emoji: '💼' },
    'مالي': { color: '#10b981', emoji: '💰' },
    'عقلي': { color: '#8b5cf6', emoji: '🧠' },
    'جسدي': { color: '#ef4444', emoji: '💪' },
    'روحي': { color: '#f59e0b', emoji: '✨' },
    'إبداعي': { color: '#ec4899', emoji: '🎨' },
    'اجتماعي': { color: '#06b6d4', emoji: '👥' },
    'تعليمي': { color: '#6366f1', emoji: '📚' },
  };

  const moods = [
    { id: 1, emoji: '😄', label: 'ممتاز', color: '#10b981' },
    { id: 2, emoji: '🙂', label: 'جيد', color: '#3b82f6' },
    { id: 3, emoji: '😐', label: 'عادي', color: '#f59e0b' },
    { id: 4, emoji: '😔', label: 'سيء', color: '#ef4444' },
  ];

  const quotes = [
    { quote: "لا ترتقِ إلى مستوى أهدافك، بل تنحدر إلى مستوى أنظمتك", tip: "ركّز على النظام" },
    { quote: "كل فعل هو تصويت للشخص الذي تريد أن تصبحه", tip: "الأفعال تبني الهوية" },
    { quote: "العادات هي الفائدة المركبة لتحسين الذات", tip: "1% يومياً = 37x سنوياً" },
    { quote: "اجعلها واضحة، جذابة، سهلة، مُرضية", tip: "القوانين الأربعة" },
    { quote: "لا تفوّت مرتين أبداً. يوم سيء أفضل من يوم ضائع", tip: "الاستمرارية > الكمال" },
    { quote: "قانون الدقيقتين: صغّر العادة حتى تصبح سهلة جداً", tip: "ابدأ بدقيقتين" },
    { quote: "البيئة هي اليد الخفية التي تشكل سلوكك", tip: "صمم بيئتك للنجاح" },
    { quote: "المحترفون يلتزمون بالجدول. الهواة ينتظرون التحفيز", tip: "كن محترفاً" },
    { quote: "الهوية تتغير من خلال الأدلة المتراكمة", tip: "الأدلة تبني الهوية" },
    { quote: "نقطة التحول: النتائج تتأخر ثم تنفجر فجأة", tip: "استمر!" },
  ];

  const days = ['س', 'ح', 'ن', 'ث', 'ر', 'خ', 'ج'];
  const fullDays = ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];
  const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

  const getTodayIndex = () => { const d = new Date().getDay(); return d === 6 ? 0 : d + 1; };
  const getDateKey = (date = new Date()) => date.toISOString().split('T')[0];
  const todayIndex = getTodayIndex();
  const todayName = fullDays[todayIndex];
  const today = new Date();

  const theme = {
    bg: darkMode ? '#0f172a' : '#f8fafc',
    bgGradient: darkMode ? 'linear-gradient(180deg, #0f172a, #1e293b)' : 'linear-gradient(180deg, #f8fafc, #e0e7ff)',
    card: darkMode ? '#1e293b' : '#ffffff',
    text: darkMode ? '#f1f5f9' : '#1e293b',
    textSecondary: darkMode ? '#94a3b8' : '#64748b',
    border: darkMode ? '#334155' : '#e2e8f0',
    inputBg: darkMode ? '#334155' : '#f8fafc',
  };

  const saveData = useCallback((key, data) => {
    if (typeof window !== 'undefined') {
      try { localStorage.setItem(key, JSON.stringify(data)); } catch(e) {}
    }
  }, []);

  const loadData = useCallback((key, def) => {
    if (typeof window !== 'undefined') {
      try { const d = localStorage.getItem(key); return d ? JSON.parse(d) : def; } catch(e) { return def; }
    }
    return def;
  }, []);

  useEffect(() => {
    if (user) {
      setHabits(loadData('habits_' + user.email, []));
      setNotes(loadData('notes_' + user.email, ''));
      setMoodHistory(loadData('moodHistory_' + user.email, []));
      setDarkMode(loadData('darkMode_' + user.email, false));
    }
  }, [user, loadData]);

  useEffect(() => { if (user) saveData('habits_' + user.email, habits); }, [habits, user, saveData]);
  useEffect(() => { if (user) saveData('notes_' + user.email, notes); }, [notes, user, saveData]);
  useEffect(() => { if (user) saveData('darkMode_' + user.email, darkMode); }, [darkMode, user, saveData]);

  useEffect(() => {
    if (!user || habits.length === 0) return;
    const lastDate = loadData('lastDate_' + user.email, null);
    const todayKey = getDateKey();
    if (lastDate && lastDate !== todayKey) {
      setHabits(prev => prev.map(h => {
        let ns = h.streak || 0, nm = h.missedDays || 0;
        if (!h.completedToday) { nm++; if (nm >= 2) { ns = 0; nm = 0; } } else { nm = 0; }
        const wp = [...(h.weekProgress || [0,0,0,0,0,0,0])]; wp[todayIndex] = 0;
        return { ...h, completedToday: false, streak: ns, missedDays: nm, weekProgress: wp };
      }));
    }
    saveData('lastDate_' + user.email, todayKey);
  }, [user, habits.length, loadData, saveData, todayIndex]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const handleAuth = () => {
    setError('');
    if (isLogin) {
      if (email.trim() && password) {
        const u = { name: email.split('@')[0], email: email.trim().toLowerCase() };
        setUser(u);
        const saved = loadData('habits_' + u.email, null);
        if (!saved || saved.length === 0) {
          setHabits([
            { id: 1, name: 'قراءة 20 صفحة', categories: ['تعليمي', 'عقلي'], streak: 8, bestStreak: 15, totalCompleted: 45, completedToday: false, missedDays: 0, cue: 'بعد صلاة الفجر', identity: 'قارئ نهم', twoMinuteVersion: 'قراءة صفحة واحدة', reminderTime: '06:00', weekProgress: [1,1,0,1,1,1,0] },
            { id: 2, name: 'تمارين رياضية', categories: ['جسدي', 'عقلي'], streak: 5, bestStreak: 21, totalCompleted: 60, completedToday: false, missedDays: 0, cue: 'بعد الاستيقاظ', identity: 'شخص رياضي', twoMinuteVersion: 'ارتداء ملابس الرياضة', reminderTime: '07:00', weekProgress: [1,0,1,1,1,0,0] },
            { id: 3, name: 'مراجعة الميزانية', categories: ['مالي', 'مهني'], streak: 12, bestStreak: 12, totalCompleted: 30, completedToday: true, missedDays: 0, cue: 'قبل النوم', identity: 'مدير مالي', twoMinuteVersion: 'فتح التطبيق', reminderTime: '22:00', weekProgress: [1,1,1,1,1,1,1] },
          ]);
        }
      } else { setError('يرجى إدخال البريد وكلمة المرور'); }
    } else {
      if (!name.trim()) { setError('يرجى إدخال الاسم'); return; }
      if (!email.trim()) { setError('يرجى إدخال البريد'); return; }
      if (!password || password.length < 6) { setError('كلمة المرور: 6 أحرف على الأقل'); return; }
      setUser({ name: name.trim(), email: email.trim().toLowerCase() });
      setHabits([]); setShowWelcome(true);
    }
  };

  const toggleHabit = (id) => {
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const was = h.completedToday;
        const wp = [...(h.weekProgress || [0,0,0,0,0,0,0])]; wp[todayIndex] = was ? 0 : 1;
        let ns = h.streak || 0, nb = h.bestStreak || 0, nt = h.totalCompleted || 0;
        if (!was) {
          ns++; nt++; if (ns > nb) nb = ns;
          setCelebrateId(id); setTimeout(() => setCelebrateId(null), 1500);
          setCurrentQuoteIndex(p => (p + 1) % quotes.length);
          if (typeof window !== 'undefined' && navigator.vibrate) navigator.vibrate([50, 30, 100]);
        } else { ns = Math.max(0, ns - 1); nt = Math.max(0, nt - 1); }
        return { ...h, completedToday: !was, streak: ns, bestStreak: nb, totalCompleted: nt, weekProgress: wp, missedDays: !was ? 0 : h.missedDays };
      }
      return h;
    }));
  };

  const toggleCategory = (cat, edit = false) => {
    if (edit && editingHabit) {
      const c = editingHabit.categories || [];
      setEditingHabit({ ...editingHabit, categories: c.includes(cat) ? c.filter(x => x !== cat) : [...c, cat] });
    } else {
      const c = newHabit.categories || [];
      setNewHabit({ ...newHabit, categories: c.includes(cat) ? c.filter(x => x !== cat) : [...c, cat] });
    }
  };

  const addHabit = () => {
    if (newHabit.name && newHabit.categories.length && newHabit.cue && newHabit.identity) {
      setHabits(p => [...p, { ...newHabit, id: Date.now(), streak: 0, bestStreak: 0, totalCompleted: 0, completedToday: false, missedDays: 0, weekProgress: [0,0,0,0,0,0,0] }]);
      setNewHabit({ name: '', categories: [], cue: '', identity: '', twoMinuteVersion: '', reminderTime: '' });
      setShowAddModal(false); setSuccess('🎉 تم إضافة العادة!'); setTimeout(() => setSuccess(''), 4000);
    }
  };

  const updateHabit = () => {
    if (editingHabit && editingHabit.name && editingHabit.categories && editingHabit.categories.length) {
      setHabits(p => p.map(h => h.id === editingHabit.id ? { ...h, ...editingHabit } : h));
      setEditingHabit(null); setShowEditModal(false); setSelectedHabit(null);
      setSuccess('✅ تم التحديث'); setTimeout(() => setSuccess(''), 3000);
    }
  };

  const deleteHabit = (id) => { setHabits(p => p.filter(h => h.id !== id)); setSelectedHabit(null); };

  const saveMood = (m) => {
    setMood(m);
    const h = [...moodHistory.filter(x => x.date !== getDateKey()), { date: getDateKey(), mood: m }];
    setMoodHistory(h); saveData('moodHistory_' + user.email, h);
  };

  const exportData = () => {
    const d = { habits, notes, moodHistory };
    const b = new Blob([JSON.stringify(d, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(b);
    a.download = 'atomic-habits-' + getDateKey() + '.json'; a.click();
    setSuccess('💾 تم التصدير'); setTimeout(() => setSuccess(''), 3000);
  };

  const importData = (e) => {
    const f = e.target.files[0];
    if (f) {
      const r = new FileReader();
      r.onload = (ev) => {
        try {
          const d = JSON.parse(ev.target.result);
          if (d.habits) setHabits(d.habits);
          if (d.notes) setNotes(d.notes);
          setSuccess('✅ تم الاستيراد');
        } catch { setError('خطأ'); }
        setTimeout(() => { setSuccess(''); setError(''); }, 3000);
      };
      r.readAsText(f);
    }
  };

  const cc = habits.filter(h => h.completedToday).length;
  const ts = habits.reduce((a, h) => a + (h.streak || 0), 0);
  const cr = habits.length ? Math.round((cc / habits.length) * 100) : 0;
  const tc = habits.reduce((a, h) => a + (h.totalCompleted || 0), 0);
  const bs = Math.max(0, ...habits.map(h => h.bestStreak || 0));
  const wr = habits.length ? Math.round(habits.reduce((a, h) => a + (h.weekProgress ? h.weekProgress.filter(p => p).length : 0), 0) / (habits.length * 7) * 100) : 0;
  const atRisk = habits.filter(h => h.missedDays === 1 && !h.completedToday);
  const cq = quotes[currentQuoteIndex];

  const getColor = (c) => c && c[0] && categories[c[0]] ? categories[c[0]].color : '#6366f1';
  const getGrad = (c) => {
    if (!c || !c.length) return 'linear-gradient(135deg, #6366f1, #818cf8)';
    const c1 = categories[c[0]] ? categories[c[0]].color : '#6366f1';
    const c2 = c[1] && categories[c[1]] ? categories[c[1]].color : c1;
    return 'linear-gradient(135deg, ' + c1 + ', ' + c2 + 'cc)';
  };

  if (showWelcome && user) {
    return (
      <div style={{ minHeight: '100vh', background: theme.bgGradient, fontFamily: 'Tajawal, sans-serif', direction: 'rtl', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap" rel="stylesheet" />
        <div style={{ maxWidth: '400px', width: '100%', background: theme.card, borderRadius: '28px', boxShadow: '0 25px 60px rgba(0,0,0,0.15)', padding: '36px 28px', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎯</div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: '900', color: theme.text, marginBottom: '10px' }}>مرحباً {user.name}!</h1>
          <div style={{ background: darkMode ? '#1e3a5f' : '#eff6ff', borderRadius: '16px', padding: '16px', marginBottom: '20px', textAlign: 'right' }}>
            <p style={{ fontSize: '0.9rem', fontWeight: '700', color: darkMode ? '#93c5fd' : '#1e40af', marginBottom: '8px' }}>💡 {cq.quote}</p>
            <p style={{ fontSize: '0.8rem', color: darkMode ? '#60a5fa' : '#3b82f6' }}>{cq.tip}</p>
          </div>
          <div style={{ background: darkMode ? '#422006' : '#fef3c7', borderRadius: '14px', padding: '14px', marginBottom: '24px' }}>
            <p style={{ fontSize: '0.85rem', color: darkMode ? '#fcd34d' : '#92400e', fontWeight: '600' }}>🔑 القاعدة الذهبية: لا تفوّت مرتين متتاليتين!</p>
          </div>
          <button onClick={() => { setShowWelcome(false); setShowAddModal(true); }} style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #3b82f6, #6366f1)', border: 'none', borderRadius: '16px', color: '#fff', fontSize: '1rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', marginBottom: '12px' }}>✨ أضف عادتك الأولى</button>
          <button onClick={() => setShowWelcome(false)} style={{ background: 'none', border: 'none', color: theme.textSecondary, cursor: 'pointer', fontFamily: 'inherit' }}>تخطي</button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', background: theme.bgGradient, fontFamily: 'Tajawal, sans-serif', direction: 'rtl', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap" rel="stylesheet" />
        <div style={{ width: '100%', maxWidth: '380px' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>⚛️</div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '900', color: theme.text }}>عادات ذرية</h1>
            <p style={{ color: theme.textSecondary, fontSize: '0.9rem' }}>تغييرات صغيرة • نتائج استثنائية</p>
          </div>
          <div style={{ background: theme.card, borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.12)', padding: '24px' }}>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '18px', background: theme.inputBg, padding: '5px', borderRadius: '12px' }}>
              <button onClick={() => { setIsLogin(true); setError(''); }} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', background: isLogin ? theme.card : 'transparent', color: isLogin ? '#3b82f6' : theme.textSecondary }}>دخول</button>
              <button onClick={() => { setIsLogin(false); setError(''); }} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', background: !isLogin ? theme.card : 'transparent', color: !isLogin ? '#3b82f6' : theme.textSecondary }}>حساب جديد</button>
            </div>
            <form onSubmit={e => { e.preventDefault(); handleAuth(); }}>
              {!isLogin && <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="الاسم" style={{ width: '100%', padding: '14px', background: theme.inputBg, border: '2px solid ' + theme.border, borderRadius: '12px', fontSize: '1rem', fontFamily: 'inherit', color: theme.text, marginBottom: '12px' }} />}
              <input type="text" value={email} onChange={e => setEmail(e.target.value)} placeholder="البريد" dir="ltr" style={{ width: '100%', padding: '14px', background: theme.inputBg, border: '2px solid ' + theme.border, borderRadius: '12px', fontSize: '1rem', fontFamily: 'inherit', color: theme.text, textAlign: 'left', marginBottom: '12px' }} />
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="كلمة المرور" dir="ltr" style={{ width: '100%', padding: '14px', background: theme.inputBg, border: '2px solid ' + theme.border, borderRadius: '12px', fontSize: '1rem', fontFamily: 'inherit', color: theme.text, textAlign: 'left', marginBottom: '16px' }} />
              {error && <div style={{ marginBottom: '12px', padding: '10px', background: '#fef2f2', borderRadius: '10px', color: '#ef4444', fontSize: '0.85rem' }}>⚠️ {error}</div>}
              <button type="submit" style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #3b82f6, #6366f1)', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '1rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>{isLogin ? '🚀 دخول' : '✨ إنشاء'}</button>
            </form>
            {isLogin && <p style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.75rem', color: theme.textSecondary }}>💡 أي بريد + كلمة مرور</p>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: theme.bgGradient, fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap" rel="stylesheet" />
      <style>{`@keyframes pulse{0%,100%{box-shadow:0 6px 25px rgba(59,130,246,0.35)}50%{box-shadow:0 6px 40px rgba(59,130,246,0.55)}}@keyframes celebrate{0%,100%{transform:scale(1)}50%{transform:scale(1.2) rotate(5deg)}}@keyframes confetti{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(-100px) rotate(720deg);opacity:0}}@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}`}</style>
      
      {success && <div style={{ position: 'fixed', top: '16px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000, background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', padding: '12px 24px', borderRadius: '50px', fontWeight: '700', boxShadow: '0 8px 25px rgba(16,185,129,0.4)' }}>{success}</div>}
      {atRisk.length > 0 && <div style={{ position: 'fixed', top: success ? '65px' : '16px', left: '50%', transform: 'translateX(-50%)', zIndex: 999, background: '#f59e0b', color: 'white', padding: '10px 20px', borderRadius: '50px', fontWeight: '700', fontSize: '0.8rem', animation: 'shake 0.5s ease' }}>⚠️ {atRisk.length} عادة معرضة للكسر!</div>}

      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '16px' }}>
        <header style={{ padding: '12px 0 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <h1 style={{ fontSize: '1.2rem', fontWeight: '900', color: theme.text }}>أهلاً {user.name} 👋</h1>
              <p style={{ fontSize: '0.75rem', color: theme.textSecondary }}>{todayName}، {today.getDate()} {months[today.getMonth()]}</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setDarkMode(!darkMode)} style={{ padding: '10px', background: theme.card, border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '1rem' }}>{darkMode ? '☀️' : '🌙'}</button>
              <button onClick={() => setShowSettingsModal(true)} style={{ padding: '10px', background: theme.card, border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '1rem' }}>⚙️</button>
            </div>
          </div>

          <div style={{ background: theme.card, borderRadius: '14px', padding: '12px', marginBottom: '12px' }}>
            <p style={{ fontSize: '0.8rem', fontWeight: '700', color: theme.text, marginBottom: '8px' }}>كيف حالك اليوم؟</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '6px' }}>
              {moods.map(m => (
                <button key={m.id} onClick={() => saveMood(m.id)} style={{ flex: 1, padding: '8px', background: mood === m.id ? m.color : theme.inputBg, border: mood === m.id ? 'none' : '2px solid ' + theme.border, borderRadius: '10px', cursor: 'pointer', transform: mood === m.id ? 'scale(1.05)' : 'scale(1)' }}>
                  <div style={{ fontSize: '1.2rem' }}>{m.emoji}</div>
                  <div style={{ fontSize: '0.6rem', color: mood === m.id ? '#fff' : theme.textSecondary, fontWeight: '600' }}>{m.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)', borderRadius: '18px', padding: '18px', color: '#fff', boxShadow: '0 12px 30px rgba(59,130,246,0.3)', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ position: 'relative', width: '75px', height: '75px' }}>
                <svg width="75" height="75" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="37.5" cy="37.5" r="32" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="6" />
                  <circle cx="37.5" cy="37.5" r="32" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeDasharray={cr * 2.01 + ' 201'} />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: '900' }}>{cr}%</div>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.85rem', marginBottom: '8px' }}>{cc === habits.length && habits.length ? '🎉 أنجزت الكل!' : cc + '/' + habits.length + ' عادات'}</p>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 8px', borderRadius: '6px', fontSize: '0.7rem' }}>🔥{ts}</span>
                  <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 8px', borderRadius: '6px', fontSize: '0.7rem' }}>⭐{tc}</span>
                  <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 8px', borderRadius: '6px', fontSize: '0.7rem' }}>🏆{bs}</span>
                  <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 8px', borderRadius: '6px', fontSize: '0.7rem' }}>📊{wr}%</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ background: theme.card, borderRadius: '12px', padding: '12px' }}>
            <p style={{ fontSize: '0.85rem', fontWeight: '700', color: theme.text, marginBottom: '4px' }}>💡 {cq.quote}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ fontSize: '0.7rem', color: theme.textSecondary }}>{cq.tip}</p>
              <button onClick={() => setCurrentQuoteIndex(p => (p + 1) % quotes.length)} style={{ background: 'none', border: 'none', color: '#3b82f6', fontSize: '0.65rem', cursor: 'pointer', fontFamily: 'inherit' }}>التالي←</button>
            </div>
          </div>
        </header>

        <div style={{ display: 'flex', gap: '4px', marginBottom: '14px', background: theme.card, padding: '4px', borderRadius: '12px' }}>
          {[{ id: 'today', icon: '📅', label: 'اليوم' }, { id: 'stats', icon: '📊', label: 'إحصائيات' }, { id: 'laws', icon: '📖', label: 'القوانين' }, { id: 'notes', icon: '📝', label: 'دفتري' }].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ flex: 1, padding: '10px 4px', background: activeTab === t.id ? 'linear-gradient(135deg, #3b82f6, #6366f1)' : 'transparent', border: 'none', borderRadius: '10px', color: activeTab === t.id ? '#fff' : theme.textSecondary, fontSize: '0.7rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>
              <span style={{ fontSize: '0.9rem' }}>{t.icon}</span> {activeTab === t.id && t.label}
            </button>
          ))}
        </div>

        <div style={{ paddingBottom: '100px' }}>
          {activeTab === 'today' && (
            <div>
              {!habits.length ? (
                <div style={{ background: theme.card, borderRadius: '20px', padding: '40px 24px', textAlign: 'center' }}>
                  <div style={{ fontSize: '3.5rem', marginBottom: '12px' }}>🌱</div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: theme.text, marginBottom: '8px' }}>ابدأ رحلتك</h3>
                  <button onClick={() => setShowAddModal(true)} style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #3b82f6, #6366f1)', border: 'none', borderRadius: '12px', color: '#fff', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>✨ أضف عادتك الأولى</button>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '12px', background: theme.card, borderRadius: '12px', padding: '10px' }}>
                    {days.map((d, i) => {
                      const dc = habits.length ? habits.filter(h => h.weekProgress && h.weekProgress[i]).length / habits.length : 0;
                      return (
                        <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                          <div style={{ fontSize: '0.65rem', color: i === todayIndex ? '#3b82f6' : theme.textSecondary, marginBottom: '4px', fontWeight: i === todayIndex ? '800' : '600' }}>{d}</div>
                          <div style={{ height: '28px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: dc ? 'linear-gradient(135deg, rgba(59,130,246,' + (0.3+dc*0.7) + '), rgba(139,92,246,' + (0.3+dc*0.7) + '))' : theme.inputBg, color: dc ? '#fff' : theme.textSecondary, fontWeight: '700', fontSize: '0.6rem', border: i === todayIndex ? '2px solid #3b82f6' : 'none' }}>
                            {dc >= 1 ? '✓' : dc ? Math.round(dc * 100) + '%' : '·'}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {habits.map((h, idx) => (
                    <div key={h.id} onClick={() => setSelectedHabit(h)} style={{ background: theme.card, borderRadius: '16px', padding: '14px', marginBottom: '10px', boxShadow: h.completedToday ? '0 6px 20px ' + getColor(h.categories) + '20' : '0 2px 8px rgba(0,0,0,0.04)', border: h.completedToday ? '2px solid ' + getColor(h.categories) : '2px solid ' + theme.border, borderRight: h.missedDays === 1 && !h.completedToday ? '4px solid #f59e0b' : undefined, cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
                      {celebrateId === h.id && [0,1,2,3,4,5,6,7,8,9].map(i => <div key={i} style={{ position: 'absolute', top: '50%', left: '50%', width: '8px', height: '8px', background: ['#3b82f6','#10b981','#f59e0b','#ec4899'][i%4], borderRadius: '50%', animation: 'confetti 1s ease-out forwards', transform: 'rotate(' + (i*36) + 'deg) translateX(' + (20+i*3) + 'px)' }} />)}
                      {h.missedDays === 1 && !h.completedToday && <div style={{ position: 'absolute', top: '6px', left: '6px', background: '#f59e0b', color: '#fff', fontSize: '0.55rem', padding: '2px 5px', borderRadius: '4px', fontWeight: '700' }}>⚠️ لا تفوّت!</div>}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button onClick={e => { e.stopPropagation(); toggleHabit(h.id); }} style={{ width: '48px', height: '48px', borderRadius: '14px', background: h.completedToday ? getGrad(h.categories) : theme.inputBg, border: h.completedToday ? 'none' : '2px solid ' + getColor(h.categories) + '40', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, animation: celebrateId === h.id ? 'celebrate 0.6s ease' : 'none' }}>
                          {h.completedToday ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg> : <span style={{ fontSize: '1.3rem' }}>{categories[h.categories && h.categories[0]] ? categories[h.categories[0]].emoji : '⚛️'}</span>}
                        </button>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h3 style={{ fontSize: '0.9rem', fontWeight: '700', color: h.completedToday ? getColor(h.categories) : theme.text, textDecoration: h.completedToday ? 'line-through' : 'none', marginBottom: '3px' }}>{h.name}</h3>
                          <div style={{ display: 'flex', gap: '3px', marginBottom: '4px', flexWrap: 'wrap' }}>
                            {(h.categories || []).map(c => <span key={c} style={{ fontSize: '0.55rem', padding: '2px 5px', background: categories[c] ? categories[c].color + '15' : '#6366f115', color: categories[c] ? categories[c].color : '#6366f1', borderRadius: '4px', fontWeight: '700' }}>{categories[c] ? categories[c].emoji : '⚛️'}{c}</span>)}
                          </div>
                          <p style={{ fontSize: '0.7rem', color: theme.textSecondary }}>⏰{h.cue}</p>
                          {h.twoMinuteVersion && !h.completedToday && <p style={{ fontSize: '0.65rem', color: '#f59e0b', marginTop: '2px', fontWeight: '600' }}>⚡ {h.twoMinuteVersion}</p>}
                          <div style={{ display: 'flex', gap: '2px', marginTop: '6px' }}>
                            {(h.weekProgress || [0,0,0,0,0,0,0]).map((d, i) => <div key={i} style={{ flex: 1, height: '4px', borderRadius: '2px', background: d ? getGrad(h.categories) : theme.border, position: 'relative' }}>{i === todayIndex && <div style={{ position: 'absolute', top: '-3px', left: '50%', transform: 'translateX(-50%)', width: '3px', height: '3px', background: '#3b82f6', borderRadius: '50%' }} />}</div>)}
                          </div>
                        </div>
                        <div style={{ textAlign: 'center', padding: '8px 10px', background: darkMode ? '#422006' : 'linear-gradient(135deg, #fef3c7, #fde68a)', borderRadius: '12px', flexShrink: 0 }}>
                          <div style={{ fontSize: '0.95rem', fontWeight: '900', color: '#d97706' }}>🔥{h.streak || 0}</div>
                          <div style={{ fontSize: '0.5rem', color: '#92400e' }}>أفضل:{h.bestStreak || 0}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          {activeTab === 'stats' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '12px' }}>
                {[{ l: 'العادات', v: habits.length, i: '📋', c: '#3b82f6' }, { l: 'اليوم', v: cc, i: '✅', c: '#10b981' }, { l: 'السلاسل', v: ts, i: '🔥', c: '#f59e0b' }, { l: 'الإنجازات', v: tc, i: '⭐', c: '#8b5cf6' }, { l: 'أفضل سلسلة', v: bs, i: '🏆', c: '#ec4899' }, { l: 'الأسبوع', v: wr + '%', i: '📊', c: '#06b6d4' }].map((s, i) => (
                  <div key={i} style={{ background: theme.card, borderRadius: '14px', padding: '14px', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.6rem', marginBottom: '4px' }}>{s.i}</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: '900', color: s.c }}>{s.v}</div>
                    <div style={{ fontSize: '0.65rem', color: theme.textSecondary }}>{s.l}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: theme.card, borderRadius: '14px', padding: '14px' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: theme.text, marginBottom: '10px' }}>🎯 أداء العادات</h4>
                {habits.map(h => {
                  const r = h.weekProgress ? Math.round(h.weekProgress.filter(p => p).length / 7 * 100) : 0;
                  return (
                    <div key={h.id} style={{ marginBottom: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: '600', color: theme.text }}>{h.name}</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: getColor(h.categories) }}>{r}%</span>
                      </div>
                      <div style={{ height: '6px', background: theme.inputBg, borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: r + '%', height: '100%', background: getGrad(h.categories), borderRadius: '3px' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'laws' && (
            <div>
              <div style={{ background: theme.card, borderRadius: '16px', padding: '16px', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: theme.text, marginBottom: '14px' }}>🔄 حلقة العادة</h3>
                {[{ n: 1, t: 'الإشارة', l: 'واضحة', c: '#3b82f6', i: '👁️' }, { n: 2, t: 'الرغبة', l: 'جذابة', c: '#10b981', i: '💎' }, { n: 3, t: 'الاستجابة', l: 'سهلة', c: '#f59e0b', i: '🎯' }, { n: 4, t: 'المكافأة', l: 'مُرضية', c: '#ec4899', i: '🏆' }].map((law, i) => (
                  <div key={i} style={{ padding: '12px', background: law.c + '10', borderRadius: '12px', marginBottom: i < 3 ? '8px' : 0, border: '1px solid ' + law.c + '20' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, ' + law.c + ', ' + law.c + 'bb)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>{law.i}</div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: theme.text }}>{law.t}</h4>
                          <span style={{ fontSize: '0.55rem', padding: '2px 6px', background: law.c + '20', color: law.c, borderRadius: '4px', fontWeight: '700' }}>{law.l}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ background: 'linear-gradient(135deg, #fef3c7, #fde68a)', borderRadius: '16px', padding: '16px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#92400e', marginBottom: '10px' }}>🔑 لا تفوّت مرتين</h4>
                <p style={{ fontSize: '0.8rem', color: '#78350f', lineHeight: 1.6 }}>الجميع يخطئ. الفرق هو سرعة العودة. فوّت يوماً؟ لا بأس. لكن لا تفوّت يومين متتاليين أبداً.</p>
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div>
              <div style={{ background: theme.card, borderRadius: '16px', overflow: 'hidden' }}>
                <div style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.2rem' }}>📝</span>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#fff' }}>دفتر التأملات</h3>
                </div>
                <div style={{ padding: '4px', background: darkMode ? '#1e293b' : 'repeating-linear-gradient(#fff, #fff 27px, #e0e7ff 28px)' }}>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="اكتب أفكارك..." style={{ width: '100%', minHeight: '250px', padding: '14px', border: 'none', fontSize: '0.9rem', lineHeight: '28px', color: theme.text, background: 'transparent', resize: 'none', fontFamily: 'inherit' }} />
                </div>
                <div style={{ padding: '10px 14px', background: theme.inputBg, borderTop: '1px solid ' + theme.border, display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.7rem', color: theme.textSecondary }}>{notes.length} حرف</span>
                  <span style={{ fontSize: '0.7rem', color: theme.textSecondary }}>💾 محفوظ</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <button onClick={() => setShowAddModal(true)} style={{ position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', padding: '14px 28px', background: 'linear-gradient(135deg, #3b82f6, #6366f1)', border: 'none', borderRadius: '50px', color: '#fff', fontSize: '0.9rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 8px 30px rgba(59,130,246,0.4)', display: 'flex', alignItems: 'center', gap: '6px', animation: 'pulse 2s ease-in-out infinite', zIndex: 50 }}>
          <span style={{ fontSize: '1.1rem' }}>+</span> عادة جديدة
        </button>
g, border: '2px solid ' + theme.border, borderRadius: '10px', fontSize: '0.95rem', fontFamily: 'inherit', color: theme.text, marginBottom: '16px' }} />
              <button onClick={updateHabit} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', border: 'none', borderRadius: '14px', color: '#fff', fontSize: '1rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>✅ حفظ</button>
            </div>
          </div>
        )}

        {selectedHabit && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }} onClick={() => setSelectedHabit(null)}>
            <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '380px', background: theme.card, borderRadius: '24px', padding: '24px 20px', maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ width: '70px', height: '70px', background: getGrad(selectedHabit.categories), borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '2rem', boxShadow: '0 12px 30px ' + getColor(selectedHabit.categories) + '30' }}>
                {selectedHabit.completedToday ? '✓' : categories[selectedHabit.categories && selectedHabit.categories[0]] ? categories[selectedHabit.categories[0]].emoji : '⚛️'}
              </div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: '900', textAlign: 'center', marginBottom: '8px', color: theme.text }}>{selectedHabit.name}</h2>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '12px', flexWrap: 'wrap' }}>
                {(selectedHabit.categories || []).map(c => <span key={c} style={{ fontSize: '0.7rem', padding: '4px 8px', background: categories[c] ? categories[c].color + '15' : '#6366f115', color: categories[c] ? categories[c].color : '#6366f1', borderRadius: '8px', fontWeight: '700' }}>{categories[c] ? categories[c].emoji : '⚛️'}{c}</span>)}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
                <span style={{ background: darkMode ? '#422006' : '#fef3c7', padding: '6px 12px', borderRadius: '10px', fontWeight: '700', color: '#d97706', fontSize: '0.8rem' }}>🔥{selectedHabit.streak || 0}</span>
                <span style={{ background: darkMode ? '#1e3a5f' : '#eff6ff', padding: '6px 12px', borderRadius: '10px', fontWeight: '700', color: '#3b82f6', fontSize: '0.8rem' }}>🏆{selectedHabit.bestStreak || 0}</span>
                <span style={{ background: darkMode ? '#14532d' : '#ecfdf5', padding: '6px 12px', borderRadius: '10px', fontWeight: '700', color: '#10b981', fontSize: '0.8rem' }}>⭐{selectedHabit.totalCompleted || 0}</span>
              </div>
              <div style={{ background: theme.inputBg, borderRadius: '14px', padding: '14px', marginBottom: '14px' }}>
                <div style={{ marginBottom: '10px' }}><span style={{ fontSize: '0.7rem', color: theme.textSecondary }}>⏰ الإشارة</span><p style={{ fontSize: '0.9rem', fontWeight: '700', color: theme.text }}>{selectedHabit.cue}</p></div>
                <div style={{ marginBottom: '10px' }}><span style={{ fontSize: '0.7rem', color: theme.textSecondary }}>🪞 الهوية</span><p style={{ fontSize: '0.9rem', fontWeight: '700', color: theme.text }}>{selectedHabit.identity}</p></div>
                {selectedHabit.twoMinuteVersion && <div style={{ background: darkMode ? '#422006' : '#fef3c7', borderRadius: '8px', padding: '8px' }}><span style={{ fontSize: '0.7rem', color: '#92400e' }}>⏱️ ابدأ بـ:</span><p style={{ fontSize: '0.85rem', fontWeight: '700', color: '#d97706' }}>{selectedHabit.twoMinuteVersion}</p></div>}
                {selectedHabit.reminderTime && <div style={{ marginTop: '10px' }}><span style={{ fontSize: '0.7rem', color: theme.textSecondary }}>🔔 التذكير</span><p style={{ fontSize: '0.9rem', fontWeight: '700', color: theme.text }}>{selectedHabit.reminderTime}</p></div>}
              </div>
              {selectedHabit.missedDays === 1 && !selectedHabit.completedToday && (
                <div style={{ background: darkMode ? '#78350f' : '#fef3c7', borderRadius: '10px', padding: '10px', marginBottom: '12px', textAlign: 'center' }}>
                  <p style={{ fontSize: '0.85rem', fontWeight: '700', color: '#d97706' }}>⚠️ لا تفوّت مرتين!</p>
                </div>
              )}
              <button onClick={() => { toggleHabit(selectedHabit.id); setSelectedHabit(null); }} style={{ width: '100%', padding: '14px', marginBottom: '10px', background: selectedHabit.completedToday ? theme.inputBg : getGrad(selectedHabit.categories), border: selectedHabit.completedToday ? '2px solid ' + theme.border : 'none', borderRadius: '14px', color: selectedHabit.completedToday ? theme.textSecondary : '#fff', fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>{selectedHabit.completedToday ? 'إلغاء' : '✓ تم!'}</button>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => { setEditingHabit({...selectedHabit}); setShowEditModal(true); setSelectedHabit(null); }} style={{ flex: 1, padding: '12px', background: darkMode ? '#422006' : '#fef3c7', border: 'none', borderRadius: '12px', color: '#d97706', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>✏️ تعديل</button>
                <button onClick={() => { if(confirm('حذف؟')) deleteHabit(selectedHabit.id); }} style={{ flex: 1, padding: '12px', background: darkMode ? '#450a0a' : '#fef2f2', border: 'none', borderRadius: '12px', color: '#ef4444', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>🗑️ حذف</button>
              </div>
            </div>
          </div>
        )}

        {showSettingsModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }} onClick={() => setShowSettingsModal(false)}>
            <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '380px', background: theme.card, borderRadius: '24px', padding: '24px 20px' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: '900', marginBottom: '20px', textAlign: 'center', color: theme.text }}>⚙️ الإعدادات</h2>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', background: theme.inputBg, borderRadius: '12px', marginBottom: '10px' }}>
                <p style={{ fontSize: '0.9rem', fontWeight: '700', color: theme.text }}>🌙 الوضع المظلم</p>
                <button onClick={() => setDarkMode(!darkMode)} style={{ width: '50px', height: '28px', borderRadius: '14px', border: 'none', background: darkMode ? '#3b82f6' : theme.border, cursor: 'pointer', position: 'relative' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '11px', background: '#fff', position: 'absolute', top: '3px', left: darkMode ? '25px' : '3px', transition: 'left 0.3s' }} />
                </button>
              </div>
              <button onClick={exportData} style={{ width: '100%', padding: '14px', background: theme.inputBg, border: 'none', borderRadius: '12px', marginBottom: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.3rem' }}>💾</span>
                <span style={{ fontSize: '0.9rem', fontWeight: '700', color: theme.text }}>تصدير البيانات</span>
              </button>
              <label style={{ width: '100%', padding: '14px', background: theme.inputBg, border: 'none', borderRadius: '12px', marginBottom: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.3rem' }}>📥</span>
                <span style={{ fontSize: '0.9rem', fontWeight: '700', color: theme.text }}>استيراد البيانات</span>
                <input type="file" accept=".json" onChange={importData} style={{ display: 'none' }} />
              </label>
              <button onClick={() => { setUser(null); setHabits([]); setNotes(''); setShowSettingsModal(false); }} style={{ width: '100%', padding: '14px', background: darkMode ? '#450a0a' : '#fef2f2', border: 'none', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.3rem' }}>🚪</span>
                <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#ef4444' }}>تسجيل الخروج</span>
              </button>
              <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.75rem', color: theme.textSecondary }}>عادات ذرية v2.0 ⚛️</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
