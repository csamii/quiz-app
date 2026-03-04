import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Brain, Clock, Trophy, Target } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="px-4 py-8 w-full h-full min-h-screen bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white">
      <div className='max-w-4xl mx-auto'>
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Brain className="w-12 h-12 text-green-500 mr-3 animate-vibrate" />
            <h1 className="text-4xl">QuizQuest</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Test your knowledge across multiple categories with timed questions and instant corrections
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className='bg-white text-black'>
            <CardHeader className="text-center">
              <Card className='w-16 h-16 mx-auto mb-8 bg-destructive'>
                <Target className="w-8 h-8 text-white mx-auto mb-2" />
              </Card>
              <CardTitle className='font-bold'>Multiple Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className='text-lg text-center'>
                Choose from General Knowledge, Science, Mathematics, Sports, History, and Mythology
              </CardDescription>
            </CardContent>
          </Card>

          <Card className='bg-white text-black'>
            <CardHeader className="text-center">
              <Card className='w-16 h-16 mx-auto mb-8 bg-gradient-to-r from-[#667eea] to-[#764ba2]'>
              <Clock className="w-8 h-8 text-white mx-auto mb-2" />
              </Card>
              <CardTitle className='font-bold'>Timed Challenges</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className='text-lg text-center'>
                60 seconds per question with automatic progression and missed question tracking
              </CardDescription>
            </CardContent>
          </Card>

          <Card className='bg-white text-black'>
            <CardHeader className="text-center">
              <Card className='w-16 h-16 mx-auto mb-8 bg-destructive'>
              <Trophy className="w-8 h-8 text-white mx-auto mb-2" />
              </Card>
              <CardTitle className='font-bold'>Smart Corrections</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className='text-lg text-center'>
                Practice missed questions until perfect with unlimited correction rounds
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="text-center space-y-6">
          <Button 
            onClick={() => navigate('/settings')}
            className="px-8 py-4 text-sm bg-black hover:animate-vibrate text-white hover:bg-slate-500"
          >
            Start Quiz
          </Button>
          
          <div>
            <Button
              onClick={() => navigate('/leaderboard')}
              className="px-8 py-4 text-sm border border-slate-200 hover:bg-slate-500 hover:text-white "
            >
              🏆 View Leaderboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}