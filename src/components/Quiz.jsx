import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizStore } from './QuizStore';
import Button from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Progress } from '../ui/Progress';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Quiz() {
  const navigate = useNavigate();
  const {
    questions,
    currentQuestionIndex,
    //score,
    timeRemaining,
    isQuizActive,
    quizCompleted,
    correctionQuestions,
    startQuiz,
    answerQuestion,
    nextQuestion,
    completeQuiz,
    setTimeRemaining
  } = useQuizStore();
  
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [showFeedback, setShowFeedback] = useState(false);
  const [submittedAnswer, setSubmittedAnswer] = useState('');
  const [timerStopped, setTimerStopped] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  // Current Question & Shuffled Answers so they don't change on every render
  const allAnswers = useMemo(() => {
    if (!currentQuestion) return [];
    return [currentQuestion.correct_answer, ...currentQuestion.incorrect_answers]
      .sort(() => Math.random() - 0.5);
  }, [currentQuestion?.question, currentQuestion?.correct_answer]);

  // Auto-Start Quiz
  useEffect(() => {
    if (!isQuizActive && questions.length > 0) {
      startQuiz();
    }
  }, []);

  // Handle navigation after quiz completion
  useEffect(() => {
    if (quizCompleted && !isQuizActive) {
      if (correctionQuestions.length > 0) {
        navigate('/correction');
      } else {
        navigate('/results');
      }
    }
  }, [quizCompleted, isQuizActive, correctionQuestions.length, navigate]);

  // Handles Timer on each quiz displayed
  useEffect(() => {
    if (!isQuizActive || timerStopped) return;

    const timer = setInterval(() => {
      setTimeRemaining(Math.max(0, timeRemaining - 1));
    }, 1000);

    if (timeRemaining === 0) {
      handleTimeUp();
    }

    return () => clearInterval(timer);
  }, [timeRemaining, isQuizActive, timerStopped]);

  // Resetting answer and timeRemaining Per Question
  useEffect(() => {
    setSelectedAnswer('');
    setQuestionStartTime(Date.now());
    setShowFeedback(false);
    setSubmittedAnswer('');
    setIsTimeUp(false);
    setTimerStopped(false);
  }, [currentQuestionIndex]);

  const handleTimeUp = () => {
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
    setSubmittedAnswer('');
    setShowFeedback(true);
    setIsTimeUp(true);
    
    // Record the answer as incorrect but don't automatically proceed
    answerQuestion('', timeSpent);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer || showFeedback) return;
    setTimerStopped(true);
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
    setSubmittedAnswer(selectedAnswer);
    setShowFeedback(true);
    
    // Show feedback for 2 seconds before enabling next question
    setTimeout(() => {
      answerQuestion(selectedAnswer, timeSpent);
    }, 200);
  };

  const handleManualNext = () => {
    setShowFeedback(false);
    handleNextQuestion();
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      nextQuestion();
    } else {
      completeQuiz();
    }
  };

  if (!currentQuestion) {
    return (
      <div className='min-h-screen bg-gradient-to-r from-[#667eea] to-[#764ba2]'>
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="max-w-md mx-auto">
            <h2 className="mb-4 text-white">No Quiz Available</h2>
            <p className="text-white mb-6">
              Please configure your quiz settings to get started.
            </p>
            <Button 
              className='bg-black text-white hover:bg-slate-500'
              onClick={() => navigate('/settings')}>
              Go to Settings
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className='min-h-screen bg-gradient-to-r from-[#667eea] to-[#764ba2]'>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-4">
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.span 
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full shadow-lg"
                whileHover={{ scale: 1.05 }}
              >
                Q{currentQuestion.originalIndex}
              </motion.span>
              <span className="text-white font-bold">
                {currentQuestionIndex + 1} of {questions.length}
              </span>
            </motion.div>
            <motion.div 
              className="flex items-center space-x-2"
              initial={{ x: 20 }}
              animate={{ x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* <Clock className="size-3" />
              <span className={`${timeRemaining <= 10 ? 'text-red-500' : ''} font-bold`}> */}
                {/* {String(Math.floor(timeRemaining / 60)).padStart(2, '0')}: */}
                {/* {String(timeRemaining % 60).padStart(2, '0')}
              </span> */}
              <motion.div
                animate={{ rotate: timeRemaining <= 10 ? [0, 10, -10, 0] : 0 }}
                transition={{ duration: 0.5, repeat: timeRemaining <= 10 ? Infinity : 0 }}
              >
                <Clock className={`w-5 h-5 ${timeRemaining <= 10 ? 'text-red-800' : 'text-white'}`} />
              </motion.div>
              <motion.span 
                className={`font-mono text-lg px-3 py-1 rounded-lg backdrop-blur-sm ${
                  timeRemaining == 0 ? 'bg-red-500/20 text-red-900':
                  timeRemaining <= 10 ? 'bg-red-500/30 text-red-900 animate-pulse'
                    : 'bg-white/20 text-white'
                }`}
              >
                {String(Math.floor(timeRemaining / 60)).padStart(2, '0')}:
                {String(timeRemaining % 60).padStart(2, '0')}
              </motion.span>
            </motion.div>
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

        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="mb-6 bg-white">
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between mb-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center space-x-3"
                >
                  <CardTitle className="text-lg">
                    {currentQuestion.question}
                  </CardTitle>
                </motion.div>
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
                <AnimatePresence>
                  {allAnswers.map((answer, index) => {
                    let buttonClassName = "flex w-full h-13 items-center justify-start";

                    if (showFeedback) {
                      // Show feedback colors
                      if (answer === currentQuestion.correct_answer) {
                        buttonClassName += " !bg-myGreen !hover:bg-green-600 !text-white !border-green-500";
                      } else if (
                        answer === submittedAnswer &&
                        submittedAnswer !== currentQuestion.correct_answer
                      ) {
                        buttonClassName += " !bg-myRed !hover:bg-red-600 !text-white !border-red-500";
                      }
                    } else if (selectedAnswer === answer) {
                      buttonClassName += " bg-black text-white"; // selected state
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
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {/* Score: {score}/{currentQuestionIndex + 1} */}
          </div>
          {showFeedback ? (
            <Button 
              className='bg-black text-white hover:bg-slate-800'
              onClick={handleManualNext}
            >
              {currentQuestionIndex + 1 === questions.length ? 'Finish Quiz' : 'Next Question'}
            </Button>
          ) : (
            <Button 
              className='bg-black text-white hover:bg-slate-800'
              onClick={handleSubmitAnswer} 
              disabled={!selectedAnswer}
            >
              Submit Answer
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}