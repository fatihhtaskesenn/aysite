import { supabase, isSupabaseConfigured } from './supabaseClient';

const LOCAL_STORAGE_KEY = 'ceyza_questions_cache';

// Mock initial questions for testing
const INITIAL_MOCK_QUESTIONS = [
  {
    id: 'q-1',
    name: 'Ahmet Yılmaz',
    contact_info: '0532 111 22 33',
    subject: 'Peşin Fiyatına Taksit Seçenekleri',
    question: 'Kredi kartı kullanmadan senetle veya mağazadan taksitle alışveriş yapabilir miyim?',
    status: 'pending',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'q-2',
    name: 'Zeynep Kaya',
    contact_info: 'zeynep@gmail.com',
    subject: 'Teslimat Süresi',
    question: 'Bursa içine beyaz eşya teslimatları kaç gün sürüyor? Kurulum ücretli mi?',
    status: 'answered',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];

const getLocalQuestions = () => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : INITIAL_MOCK_QUESTIONS;
  } catch (e) {
    return INITIAL_MOCK_QUESTIONS;
  }
};

const saveLocalQuestions = (questions) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(questions));
  } catch (e) {
    console.warn('LocalStorage quota exceeded for questions');
  }
};

/**
 * Müşteri Sorularını Getirir
 */
export async function fetchQuestions() {
  const localData = getLocalQuestions();

  if (!isSupabaseConfigured()) {
    return { data: localData, error: null };
  }

  try {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch questions error, fallback cache used:', error);
      return { data: localData, error: error.message };
    }

    if (data && data.length > 0) {
      saveLocalQuestions(data);
      return { data, error: null };
    }

    return { data: localData, error: null };
  } catch (err) {
    return { data: localData, error: null };
  }
}

/**
 * Yeni Müşteri Sorusu Ekle
 */
export async function createQuestion(questionData) {
  const newQuestion = {
    id: `q-${Date.now()}`,
    name: questionData.name,
    contact_info: questionData.contact_info,
    subject: questionData.subject || 'Genel Soru',
    question: questionData.question,
    status: 'pending',
    created_at: new Date().toISOString()
  };

  const currentLocal = getLocalQuestions();
  const updatedLocal = [newQuestion, ...currentLocal];
  saveLocalQuestions(updatedLocal);

  if (!isSupabaseConfigured()) {
    return { data: newQuestion, error: null };
  }

  try {
    const { data, error } = await supabase
      .from('questions')
      .insert([{
        name: questionData.name,
        contact_info: questionData.contact_info,
        subject: questionData.subject || 'Genel Soru',
        question: questionData.question,
        status: 'pending'
      }])
      .select()
      .single();

    if (error) {
      console.warn('Supabase create question error:', error);
      return { data: newQuestion, error: null };
    }

    return { data, error: null };
  } catch (err) {
    return { data: newQuestion, error: null };
  }
}

/**
 * Soru Durumunu Güncelle (Bekliyor / Yanıtlandı)
 */
export async function updateQuestionStatus(id, newStatus) {
  const currentLocal = getLocalQuestions();
  const updatedLocal = currentLocal.map(q => q.id === id ? { ...q, status: newStatus } : q);
  saveLocalQuestions(updatedLocal);

  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  try {
    await supabase
      .from('questions')
      .update({ status: newStatus })
      .eq('id', id);

    return { success: true };
  } catch (err) {
    return { success: true };
  }
}

/**
 * Müşteri Sorusunu Sil
 */
export async function deleteQuestion(id) {
  const currentLocal = getLocalQuestions();
  const updatedLocal = currentLocal.filter(q => q.id !== id);
  saveLocalQuestions(updatedLocal);

  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  try {
    await supabase
      .from('questions')
      .delete()
      .eq('id', id);

    return { success: true };
  } catch (err) {
    return { success: true };
  }
}
