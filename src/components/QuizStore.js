import { create } from 'zustand';

const initialSettings = {
  categories: [],
  difficulty: 'all',
  type: 'both',
  numberOfQuestions: 10,
};

export const useQuizStore = create((set, get) => ({
  // Initial state
  settings: initialSettings,
  questions: [],
  currentQuestionIndex: 0,
  score: 0,
  timeRemaining: 60,
  isQuizActive: false,
  quizCompleted: false,
  correctionQuestions: [],
  correctionRounds: 0,
  startTime: 0,
  username: '',

  // Actions
  setSettings: (settings) => set({ settings }),

  setQuestions: (questions) => 
    set({ 
      questions: questions.map((q, index) => ({ ...q, originalIndex: index + 1 }))
    }),

  setUsername: (username) => set({ username }),
    
  startQuiz: () => set({
    isQuizActive: true,
    currentQuestionIndex: 0,
    score: 0,
    timeRemaining: 60,
    startTime: Date.now(),
    quizCompleted: false,
  }),

  answerQuestion: (answer, timeSpent) => {
    const state = get();
    const currentQuestion = state.questions[state.currentQuestionIndex];
    const isCorrect = answer === currentQuestion.correct_answer;

    const updatedQuestion = {
      ...currentQuestion,
      isAnswered: true,
      userAnswer: answer,
      isCorrect,
      timeSpent,
    };

  // Update the questions array
    const updatedQuestions = state.questions.map((q, index) =>
      index === state.currentQuestionIndex ? updatedQuestion : q
    );

    // If wrong or unanswered, add to correctionQuestions
    const updatedCorrections = isCorrect
      ? state.correctionQuestions
      : [...state.correctionQuestions, updatedQuestion];

    set({
      questions: updatedQuestions,
      score: isCorrect ? state.score + 1 : state.score,
      correctionQuestions: updatedCorrections,
    });
  },

  // Get next question 
  nextQuestion: () => {
    const state = get();
    set({
      currentQuestionIndex: state.currentQuestionIndex + 1,
      timeRemaining: 60,
    });
  },

  // Quiz countdown timer
  setTimeRemaining: (time) => set({ timeRemaining: time }),

  updateCorrectionQuestion: (originalIndex, userAnswer, isCorrect) =>
    set((state) => {
      const updatedCorrections = state.correctionQuestions.map((q) =>
        q.originalIndex === originalIndex
          ? { ...q, userAnswer, isCorrect, isAnswered: true }
          : q
      );
      return { correctionQuestions: updatedCorrections };
  }),
}))