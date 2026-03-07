import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizStore } from './QuizStore';
import Button from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Trophy, RotateCcw, Home, Target, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Results() {
  const navigate = useNavigate();
  const {
    questions,
    score,
    username,
    correctionRounds,
    settings,
    startTime,
    resetQuiz
  } = useQuizStore();

  useEffect(() => {
    if (questions.length === 0) {
      navigate('/');
      return;
    }

    // Save to leaderboard
    saveToLeaderboard();
  }, []);

  const saveToLeaderboard = () => {
    const entry = {
      username: username,
      score: score,
      totalQuestions: questions.length,
      date: new Date().toISOString(),
      correctionRounds: correctionRounds,
    };

    const existingEntries = JSON.parse(localStorage.getItem('quizLeaderboard') || '[]');
    const updatedEntries = [...existingEntries, entry];
    localStorage.setItem('quizLeaderboard', JSON.stringify(updatedEntries));
  };

  const handleNewQuiz = () => {
    resetQuiz();
    navigate('/settings');
  };

  const handleHome = () => {
    resetQuiz();
    navigate('/');
  };

  const scorePercentage = Math.round((score / questions.length) * 100);
  const correctedQuestions = questions.filter(q => 
    !q.isCorrect && q.userAnswer === q.correct_answer
  ).length;

  const getScoreColor = (percentage) => {
    if (percentage >= 81) return 'text-green-900';
    if (percentage >= 61) return 'text-green-400';
    if (percentage >= 41) return 'text-yellow-500';
    if (percentage >= 21) return 'text-orange-500';
    return 'text-red-500';
  };

  const getScoreBadgeVariant = (percentage) => {
    if (percentage >= 81) return 'default';
    if (percentage >= 61) return 'secondary';
    if (percentage >= 41) return 'mid';
    if (percentage >= 21) return 'primary';
    return 'destructive';
  };

  return (
    <div className='min-h-screen bg-gradient-to-r from-[#667eea] from-50% to-[#764ba2] to-50%'>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="flex items-center justify-center mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
          >
            <motion.div
              animate={{ 
                rotateY: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                repeatDelay: 3 
              }}
            >
              <Trophy className="w-12 h-12 text-primary mr-3" />
            </motion.div>
            <h1 className='text-white font-bold'>Quiz Complete!</h1>
          </motion.div>
          <p className="text-white font-bold">
            Great job, {username}! Here's how you performed.
          </p>
        </motion.div>
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <Card className='bg-white p-0 rounded-sm'>
            <CardHeader className="text-center bg-black p-3">
              <CardTitle className="flex items-center justify-center space-x-2">
                <Target className="w-5 h-5 text-white" />
                <span className='text-white font-bold'>Final Score</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center p-8">
              <div className={`text-4xl font-extrabold mb-2 ${getScoreColor(scorePercentage)}`}>
                {score}
              </div>
              <div className="text-2xl text-slate-800 mb-4">
                out of {questions.length}
              </div>
              <Badge variant={getScoreBadgeVariant(scorePercentage)} className="text-3xl font-bold px-4 mb-8 h-12">
                {scorePercentage}%
              </Badge>
            </CardContent>
            </Card>
          </motion.div>
          <AnimatePresence>
            {correctionRounds > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 1.6 }}
              >
                <Card className='bg-white p-0'>
                  <CardHeader className='bg-blue-500 rounded-md'>
                    <CardTitle className="flex items-center space-x-2 mb-4 p-4">
                      <RotateCcw className="w-5 h-5 text-white" />
                      <span className='font-bold text-white'>Practice Summary</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='p-4'>
                    <div className="space-y-3 mb-8">
                      <div className="flex justify-between items-center">
                        <span>Practice rounds completed:</span>
                        <span>{correctionRounds - 1}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm">All questions now answered correctly!</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
          >
            <Card className='p-0 bg-white'>
              <CardHeader className='bg-green-500 p-2 text-white'>
                <CardTitle className='font-bold mb-4'>Quiz Details</CardTitle>
              </CardHeader>
              <CardContent className='p-4'>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span>Categories:</span>
                    <span className="text-right text-sm">
                      {settings.categories.length} selected
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Difficulty:</span>
                    <span className="capitalize">{settings.difficulty}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Question type:</span>
                    <span className="capitalize">{settings.type}</span>
                  </div>
                  {/* <div className="flex justify-between items-center">
                    <span>Total time:</span>
                    <span>{Math.ceil((Date.now() - startTime) / 1000 / 60)} minutes</span>
                  </div> */}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="flex flex-col space-y-3 items-center">
              <Button 
                  onClick={() => navigate('/leaderboard')}
                  className='bg-black text-white hover:bg-slate-700 px-12'
              >
                  <Trophy className="w-4 h-4 mr-2" />
                  View Leaderboard
              </Button>
              
              <Button 
                  onClick={handleNewQuiz}
                  className='hover:bg-black/30 bg-black/70 text-white hover:text-white px-12'
              >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Take Another Quiz
              </Button>
              
              <Button 
                  className='hover:bg-black/30 bg-black/70 text-white hover:text-white px-12'
                  onClick={handleHome}
              >
                  <Home className="w-4 h-4 mr-2" />
                  Back to Home
              </Button>
          </div>
        </div>
      </div>
    </div>
  );
}