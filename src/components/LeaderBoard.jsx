import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/Table';
import { Trophy, Medal, Award, Home, ArrowLeft, Calendar, Target, RotateCcw, Crown, Star, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LeaderBoard() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const savedEntries = JSON.parse(localStorage.getItem('quizLeaderboard') || '[]');
    // Sort by score (descending), then by date (most recent first)
    const sortedEntries = savedEntries.sort((a, b) => {
      const scoreA = (a.score / a.totalQuestions) * 100;
      const scoreB = (b.score / b.totalQuestions) * 100;
      
      if (scoreB !== scoreA) {
        return scoreB - scoreA;
      }
      
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    
    setEntries(sortedEntries);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getScorePercentage = (score, total) => {
    return Math.round((score / total) * 100);
  };

  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return (
          <motion.div
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          >
            <Trophy className="w-6 h-6 text-yellow-500 drop-shadow-lg" />
          </motion.div>
        );
      case 1:
        return (
          <motion.div
            animate={{ y: [-2, 2, -2] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Medal className="w-5 h-5 text-gray-400" />
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          >
            <Award className="w-5 h-5 text-amber-600" />
          </motion.div>
        );
      default:
        return (
          <span className="w-6 h-6 flex items-center justify-center text-sm bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-bold">
            #{index + 1}
          </span>
        );
    }
  };

  const getScoreBadgeVariant = (percentage) => {
    if (percentage >= 80) return 'default';
    if (percentage >= 60) return 'secondary';
    return 'destructive';
  };

//   const clearLeaderboard = () => {
//     if (confirm('Are you sure you want to clear all leaderboard entries?')) {
//       localStorage.removeItem('quizLeaderboard');
//       setEntries([]);
//     }
//   };

  return (
    <div className='min-h-screen bg-gradient-to-r from-[#667eea] to-[#764ba2]'>
        <div className="container mx-auto py-8 max-w-4xl">
        <motion.div 
            className="flex items-center justify-between mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <div className="flex items-center">
            <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <Button  
                onClick={() => navigate('/')}
                className="mr-4 text-white hover:bg-white/20"
                >
                <ArrowLeft className="w-4 h-4" />
                </Button>
            </motion.div>
            <div className="flex items-center">
                <motion.div
                animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                }}
                transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    repeatDelay: 1 
                }}
                >
                <Trophy className="w-8 h-8 text-yellow-400 mr-3 drop-shadow-lg" />
                </motion.div>
                <h1 className="bg-gradient-to-r from-white to-yellow-100 bg-clip-text text-white text-lg font-bold">
                Leaderboard
                </h1>
                <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                <Crown className="w-6 h-6 text-yellow-300 ml-2" />
                </motion.div>
            </div>
            </div>
            
            {/* <AnimatePresence>
            {entries.length > 0 && (
                <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                >
                <Button  
                    onClick={clearLeaderboard}
                    className="bg-red-500/20 border-red-400/30 text-red-100 hover:bg-red-500/30"
                >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All
                </Button>
                </motion.div>
            )}
            </AnimatePresence> */}
        </motion.div>

        <AnimatePresence mode="wait">
            {entries.length === 0 ? (
            <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
            >
                <Card className="backdrop-blur-sm bg-white/95 border-white/30 shadow-xl p-0">
                <CardContent className="text-center py-12">
                    <motion.div
                    animate={{ 
                        y: [-10, 10, -10],
                        rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                        duration: 3, 
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    >
                    <Trophy className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                    </motion.div>
                    <h3 className="mb-2 text-gray-800">No quiz results yet</h3>
                    <p className="text-gray-600 mb-6">
                    Take your first quiz to appear on the leaderboard!
                    </p>
                    <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    >
                    <Button 
                        onClick={() => navigate('/settings')}
                        className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white shadow-lg"
                    >
                        🚀 Start Your First Quiz
                    </Button>
                    </motion.div>
                </CardContent>
                </Card>
            </motion.div>
            ) : (
            <motion.div
                key="leaderboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
            >
                <Card className="backdrop-blur-sm bg-white/95 border-white/30 shadow-2xl mx-2">
                <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    <CardTitle className="flex items-center justify-between p-3 rounded-md">
                    <span className="flex items-center font-bold">
                        <Star className="w-5 h-5 mr-2" />
                        All Quiz Results
                    </span>
                    <Badge className="bg-white/20 text-white bg-blue-500 text-sm">
                        {entries.length} total entries
                    </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50">
                                <TableHead className="w-20 text-center">Rank</TableHead>
                                <TableHead>Player</TableHead>
                                <TableHead className="text-center">Score</TableHead>
                                <TableHead className="text-center">Percentage</TableHead>
                                <TableHead className="text-center">Corrections</TableHead>
                                <TableHead className="text-right">Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <AnimatePresence>
                                {entries.map((entry, index) => {
                                  const percentage = getScorePercentage(entry.score, entry.totalQuestions);
                                  
                                  return (
                                      <motion.tr
                                      key={`${entry.username}-${entry.date}-${index}`}
                                      initial={{ opacity: 0, x: -20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      exit={{ opacity: 0, x: 20 }}
                                      transition={{ delay: index * 0.1 }}
                                      className={`border-b transition-colors hover:bg-gray-50 ${
                                          index < 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50' : ''
                                      }`}
                                      >
                                      <TableCell>
                                          <div className="flex items-center justify-center">
                                          {getRankIcon(index)}
                                          </div>
                                      </TableCell>
                                      <TableCell>
                                          <motion.div 
                                          className="flex items-center space-x-2"
                                          whileHover={{ x: 5 }}
                                          >
                                          <span className={`font-medium ${
                                              index === 0 ? 'text-yellow-700' :
                                              index === 1 ? 'text-gray-600' :
                                              index === 2 ? 'text-amber-700' :
                                              'text-gray-800'
                                          }`}>
                                              {entry.username}
                                          </span>
                                          {index === 0 && (
                                              <motion.div
                                              animate={{ rotate: [0, 360] }}
                                              transition={{ duration: 2, repeat: Infinity }}
                                              >
                                              <Crown className="w-4 h-4 text-yellow-500" />
                                              </motion.div>
                                          )}
                                          </motion.div>
                                      </TableCell>
                                      <TableCell className="text-center">
                                          <motion.div 
                                          className="flex items-center justify-center space-x-1"
                                          whileHover={{ scale: 1.05 }}
                                          >
                                          <Target className="w-4 h-4 text-blue-500" />
                                          <span className="font-semibold">{entry.score}/{entry.totalQuestions}</span>
                                          </motion.div>
                                      </TableCell>
                                      <TableCell className="text-center">
                                          <motion.div
                                          whileHover={{ scale: 1.1 }}
                                          >
                                          <Badge 
                                              variant={getScoreBadgeVariant(percentage)}
                                              className={`${
                                              percentage >= 80 ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                                              percentage >= 60 ? 'bg-gradient-to-r from-yellow-500 to-orange-600' :
                                              'bg-gradient-to-r from-red-500 to-pink-600'
                                              } text-white`}
                                          >
                                              🎯 {percentage}%
                                          </Badge>
                                          </motion.div>
                                      </TableCell>
                                      <TableCell className="text-center">
                                          {entry.correctionRounds > 0 ? (
                                          <motion.div 
                                              className="flex items-center justify-center space-x-1"
                                              whileHover={{ scale: 1.05 }}
                                          >
                                              <RotateCcw className="w-4 h-4 text-orange-500" />
                                              <span className="font-medium text-orange-600">{entry.correctionRounds}</span>
                                          </motion.div>
                                          ) : (
                                          <span className="text-gray-400">-</span>
                                          )}
                                      </TableCell>
                                      <TableCell className="text-right text-sm text-gray-500">
                                          <motion.div 
                                          className="flex items-center justify-end space-x-1"
                                          whileHover={{ scale: 1.02 }}
                                          >
                                          <Calendar className="w-4 h-4" />
                                          <span>{formatDate(entry.date)}</span>
                                          </motion.div>
                                      </TableCell>
                                      </motion.tr>
                                  );
                                })}
                            </AnimatePresence>
                        </TableBody>
                    </Table>
                    </div>
                </CardContent>
                </Card>
            </motion.div>
            )}
        </AnimatePresence>

        <motion.div 
            className="flex justify-center space-x-4 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
        >
            <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            >
            <Button 
                onClick={() => navigate('/settings')} 
                className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white shadow-lg"
            >
                Take New Quiz
            </Button>
            </motion.div>
            <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            >
            <Button 
                onClick={() => navigate('/')} 
                className="bg-black backdrop-blur-sm border-white/30 text-white hover:bg-black/20"
            >
                <Home className="w-4 h-4 mr-2" />
                Back to Home
            </Button>
            </motion.div>
        </motion.div>
        </div>
    </div>
  );
}