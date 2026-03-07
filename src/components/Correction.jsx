import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizStore } from './QuizStore';
import Button from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Progress } from '../ui/Progress';
import { AlertCircle, CheckCircle, RotateCcw, ArrowRight, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Correction() {
  const navigate = useNavigate();
  const {
    questions,
    correctionQuestions,
    currentQuestionIndex,
    correctionRounds,
    //score,
    startCorrection,
    completeCorrection,
    setQuestions,
    nextQuestion,
    updateCorrectionQuestion, // using the new store action
  } = useQuizStore();

  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [submittedAnswer, setSubmittedAnswer] = useState('');

  const currentQuestion = correctionQuestions[currentQuestionIndex];

  // Shuffle answers only when question changes
  const allAnswers = useMemo(() => {
    if (!currentQuestion) return [];
    return [currentQuestion.correct_answer, ...currentQuestion.incorrect_answers]
      .sort(() => Math.random() - 0.5);
  }, [currentQuestion?.question, currentQuestion?.correct_answer]);

  useEffect(() => {
    if (correctionQuestions.length === 0) {
      navigate('/results');
      return;
    }

    if (correctionRounds === 0) {
      startCorrection(correctionQuestions);
    }
  }, []);

  useEffect(() => {
    setSelectedAnswer('');
    setShowFeedback(false);
    setSubmittedAnswer('');
  }, [currentQuestionIndex]);

  const handleSubmitAnswer = () => {
    if (!selectedAnswer || showFeedback) return;

    setSubmittedAnswer(selectedAnswer);
    setShowFeedback(true);

    setTimeout(() => {
      const isCorrect = selectedAnswer === currentQuestion.correct_answer;

      // Update correction question in the store
      updateCorrectionQuestion(
        currentQuestion.originalIndex,
        selectedAnswer,
        isCorrect
      );

      // Update original questions array
      const updatedOriginalQuestions = questions.map((q) =>
        q.originalIndex === currentQuestion.originalIndex
          ? { ...q, isAnswered: true, userAnswer: selectedAnswer, isCorrect }
          : q
      );
      setQuestions(updatedOriginalQuestions);

      if (currentQuestionIndex + 1 < correctionQuestions.length) {
        // Move to next question in this round
        nextQuestion();
      } else {
        // Check all answers from the updated correctionQuestions in store
        const allCorrect = useQuizStore
          .getState()
          .correctionQuestions.every((q) => q.userAnswer === q.correct_answer);

        if (allCorrect) {
          completeCorrection();
          navigate('/results');
        } else {
          const stillIncorrect = useQuizStore
            .getState()
            .correctionQuestions.filter(
              (q) => q.userAnswer !== q.correct_answer
            );
          startCorrection(stillIncorrect);
        }
      }

      setShowFeedback(false);
    }, 2000);
  };

  const handleSkipToResults = () => {
    completeCorrection();
    navigate('/results');
  };

  if (!currentQuestion) {
    return (
      <div className='min-h-screen bg-gradient-to-r from-[#667eea] to-[#764ba2]'>
        <div className="container mx-auto px-4 py-8 text-center text-white">
          <p>Loading correction questions...</p>
        </div>
      </div>
    );
  }

  const progress =
    ((currentQuestionIndex + 1) / correctionQuestions.length) * 100;

  return (
    <div className='min-h-screen bg-gradient-to-r from-[#667eea] from-50% to-[#764ba2] to-50%'>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="flex items-center justify-center mb-4 space-x-2 text-white font-extrabold"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <RotateCcw className="w-5 h-5 text-white" />
            </motion.div>
            <h1>Practice Round {correctionRounds - 1}</h1>
          </motion.div>

          <motion.div 
            className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <AlertCircle className="w-4 h-4 text-orange-600" />
                </motion.div>
                <p className="text-sm text-orange-800">
                  Practice mode - no timer, scores don't change. Answer all
                  questions correctly to complete the quiz.
                </p>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleSkipToResults}
                  className="ml-4"
                >
                  <ArrowRight className="w-4 h-4 mr-1" />
                  Skip to Results
                </Button>
              </motion.div>
            </div>
          </motion.div>

          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-4">
              <span className='text-white font-bold'>Q{currentQuestion.originalIndex}</span>
              <span className="text-white font-bold">
                {currentQuestionIndex + 1} of {correctionQuestions.length} missed
                questions
              </span>
            </div>
          </div>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            style={{ originX: 0 }}
          >
            <Progress value={progress} className="h-3" />
          </motion.div>
        </motion.div>

        <Card className="mb-6 bg-white">
          <CardHeader className='mb-4'>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {currentQuestion.question}
              </CardTitle>
              <motion.div 
                className="flex flex-col items-center space-x-2 text-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <span className={`capitalize px-2 py-1 rounded-full text-xs ${
                  currentQuestion.difficulty === 'easy' 
                    ? 'bg-green-100 text-green-800' 
                    : currentQuestion.difficulty === 'medium'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-600 text-white'
                }`}>
                  {currentQuestion.difficulty}
                </span>
                <span className="capitalize text-gray-600 text-xs">
                  {currentQuestion.category.replace('Science: ', '').replace('Entertainment: ', '')}
                </span>
              </motion.div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {allAnswers.map((answer, index) => {
                let buttonClassName =
                  'flex w-full h-13 items-center justify-start';

                if (showFeedback) {
                  if (answer === currentQuestion.correct_answer) {
                    buttonClassName +=
                      ' !bg-green-500 !hover:bg-green-600 !text-white !border-green-500';
                  } else if (
                    answer === submittedAnswer &&
                    submittedAnswer !== currentQuestion.correct_answer
                  ) {
                    buttonClassName +=
                      ' !bg-red-500 !hover:bg-red-600 !text-white !border-red-500';
                  }
                } else if (selectedAnswer === answer) {
                  buttonClassName += ' bg-black text-white';
                }

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    whileHover={!showFeedback ? { scale: 1.02, x: 5 } : {}}
                    whileTap={!showFeedback ? { scale: 0.98 } : {}}
                  >
                    <motion.Button
                      key={index}
                      className={`h-auto text-sm rounded-lg p-4 border hover:bg-slate-500 ${buttonClassName}`}
                      onClick={() => !showFeedback && setSelectedAnswer(answer)}
                      disabled={showFeedback}
                      whileHover={{ scale: 1.05 }}
                    >
                      <span className='pr-1'>{String.fromCharCode(65 + index)}.</span>
                      {answer}
                      {showFeedback && answer === currentQuestion.correct_answer && (
                        <CheckCircle className="w-4 h-4 ml-auto text-white" />
                      )}
                      {showFeedback &&
                        answer === submittedAnswer &&
                        submittedAnswer !== currentQuestion.correct_answer && (
                          <XCircle className="w-4 h-4 ml-auto text-white" />
                        )}
                    </motion.Button>
                  </motion.div>
                );
              })}
            </div>
            {/* {currentQuestion.userAnswer && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-orange-600" />
                  <span className="text-sm">Your previous answer:</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {currentQuestion.userAnswer || 'No answer (time expired)'}
                </p>
              </div>
            )} */}
          </CardContent>
        </Card>

        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {/* Original Score: {score}/{questions.length} */}
          </div>
          <Button
            className='bg-black text-white hover:bg-slate-800'
            onClick={handleSubmitAnswer}
            disabled={!selectedAnswer || showFeedback}
          >
            {showFeedback ? 'Processing...' : 'Submit Answer'}
          </Button>
        </div>
      </div>
    </div>
  );
}