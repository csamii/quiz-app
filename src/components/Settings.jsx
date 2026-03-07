import { useState } from 'react';
import { useQuizStore } from './QuizStore';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card'
import { Checkbox } from '../ui/Checkbox';
import { Label } from '../ui/Label';
import { Select } from '../ui/Select';
import { RadioGroup, RadioGroupItem } from '../ui/RadioGroup';
import { Input } from '../ui/Input';
import { ArrowLeft, Loader2, Settings as SettingsIcon } from 'lucide-react';
import { motion } from 'framer-motion';


// Names of category and category_id
const CATEGORIES = [
    { id: '9', name: 'General Knowledge' },
    { id: '17', name: 'Science & Nature' },
    { id: '19', name: 'Mathematics' },
    { id: '21', name: 'Sports' },
    { id: '23', name: 'History' },
    { id: '20', name: 'Mythology' },
];

// Number of Questions
const difficultyOptions = [10, 20, 30, 40, 50];

const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
};

export default function Settings() {
    const navigate = useNavigate();
    const { setSettings, setQuestions, setUsername } = useQuizStore();
  
  // Independent local state - not dependent on store
    const [selectedCategories, setSelectedCategories] = useState(['9']);
    const [difficulty, setDifficulty] = useState('all');
    const [type, setType] = useState('both');
    const [numberOfQuestions, setNumberOfQuestions] = useState(10);
    const [username, setUsernameLocal] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // To add/remove the categoryId when checked
    const handleCategoryChange = (categoryId, checked) => {
        if (checked) {
            setSelectedCategories((prev) => [...prev, categoryId]);
        } else {
            setSelectedCategories((prev) =>
                prev.filter((id) => id !== categoryId)
            );
        }
    };

    // Fetch questions in asynchronous function
    const fetchQuestions = async () => {
        // Return if no checked category
        if (selectedCategories.length === 0) {
            alert('Please select at least one category');
            return;
        }

        // Return if Username not entered
        if (username.length <= 2) {
            alert('Username must be greater or equal to 3 letters');
            return;
        }

        setIsLoading(true);

        try {
            // Check for username and category selection before proceeding
            if (selectedCategories.length === 0) {
                alert('Please select at least one category');
                return;
            }

            if (selectedCategories.length > 3) {
                alert('Please do not select more than 4 categories at once');
                return;
            }

            if (username.trim().length < 3) {
                alert('Username must be at least 3 characters long');
                return;
            }

            setIsLoading(true);

            const allQuestions = [];
            const questionsPerCategory = Math.ceil(numberOfQuestions / selectedCategories.length);

            // Create an array of fetch promises
            const fetchPromises = selectedCategories.map((categoryId) => {
                const difficultyParam = difficulty === 'all' ? '' : `&difficulty=${difficulty}`;
                const typeParam = type === 'both' ? '' : `&type=${type === 'multiple choice' ? 'multiple' : 'boolean'}`;
                const url = `https://opentdb.com/api.php?amount=${questionsPerCategory}&category=${categoryId}${difficultyParam}${typeParam}`;
                return fetch(url);
            });

            // Wait for all promises to resolve in parallel
            const responses = await Promise.all(fetchPromises);
            const data = await Promise.all(responses.map((res) => res.json()));

            console.log(data)

            // Process the data from all categories
            data.forEach((d) => {
                if (d.response_code === 0 && d.results) {
                    allQuestions.push(
                        ...d.results.map((q) => ({
                            ...q,
                            question: decodeHtml(q.question),
                            correct_answer: decodeHtml(q.correct_answer),
                            category: decodeHtml(q.category),
                            incorrect_answers: q.incorrect_answers.map((ans) => decodeHtml(ans)),
                            isAnswered: false,
                            userAnswer: null,
                            isCorrect: false,
                            timeSpent: 0,
                        }))
                    );
                } else if (d.response_code !== 0) {
                    // Alert the user if a specific category fetch failed due to API limitations
                    console.warn("API Error Code:", d.response_code);
                    // You can add a more user-friendly alert here if needed
                }
            });

            // Check if more or enough questions were gathered. if more questions, slice the num of questions requested 
            const shuffledQuestions = allQuestions.sort(() => Math.random() - 0.5).slice(0, numberOfQuestions);

            if (shuffledQuestions.length < numberOfQuestions) {
                alert(`Note: Only ${shuffledQuestions.length} questions are available from your selected settings. Please try again with different settings.`);
            }

            // Save Quiz Settings to Global Store
            setSettings({ categories: selectedCategories, difficulty, type, numberOfQuestions });
            // Save the Actual Questions to Global Store
            setQuestions(shuffledQuestions);
            // Save the Username to Global Store
            setUsername(username);

            navigate('/quiz');

        } catch (error) {
            console.error('Error fetching questions:', error);
            alert('Error fetching questions. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const decodeHtml = (html) => {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    };

    return (
        <motion.div
            className="min-h-screen bg-gradient-to-r from-[#667eea] to-[#764ba2] dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="container mx-auto px-4 py-12 max-w-2xl">
                {/* Header */}
                <div className="flex items-center mb-10">
                <Button
                    onClick={() => navigate('/')}
                    className="mr-4 bg-black text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
                >
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <div className="flex items-center">
                    <SettingsIcon className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-2" />
                    <h1 className="text-2xl font-bold">Quiz Settings</h1>
                </div>
                </div>

                {/* Animated Section */}
                <motion.div
                className="space-y-6"
                initial="hidden"
                animate="visible"
                variants={{
                    visible: {
                    transition: { staggerChildren: 0.1 },
                    },
                }}
                >
                {/* Personal Information */}
                <motion.div variants={fadeUp}>
                    <Card className="bg-white dark:bg-gray-800 shadow-lg">
                    <CardHeader>
                        <CardTitle className="font-bold text-blue-600 dark:text-blue-400">
                        Personal Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Label htmlFor="username">Username</Label>
                        <Input
                        id="username"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsernameLocal(e.target.value)}
                        className="mt-2"
                        />
                    </CardContent>
                    </Card>
                </motion.div>

                {/* Categories */}
                <motion.div variants={fadeUp}>
                    <Card className="bg-white dark:bg-gray-800 shadow-lg">
                    <CardHeader>
                        <CardTitle className="font-bold text-blue-600 dark:text-blue-400">
                        Categories
                        </CardTitle>
                        <CardDescription>Select one up to three categories</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                        {CATEGORIES.map((category) => (
                            <Checkbox
                                key={category.id}
                                id={category.id}
                                label={category.name}
                                checked={selectedCategories.includes(category.id)}
                                onChange={(e) =>
                                    handleCategoryChange(category.id, e.target.checked)
                                }
                            />
                        ))}
                        </div>
                    </CardContent>
                    </Card>
                </motion.div>

                {/* Difficulty */}
                <motion.div variants={fadeUp}>
                    <Card className="bg-white dark:bg-gray-800 shadow-lg">
                    <CardHeader>
                        <CardTitle className="font-bold text-blue-600 dark:text-blue-400">
                        Difficulty
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <RadioGroup value={difficulty} onValueChange={setDifficulty}>
                        <RadioGroupItem value="easy" label="Easy" />
                        <RadioGroupItem value="medium" label="Medium" />
                        <RadioGroupItem value="hard" label="Hard" />
                        <RadioGroupItem value="all" label="All Difficulties" />
                        </RadioGroup>
                    </CardContent>
                    </Card>
                </motion.div>

                {/* Question Type */}
                <motion.div variants={fadeUp}>
                    <Card className="bg-white dark:bg-gray-800 shadow-lg">
                    <CardHeader>
                        <CardTitle className="font-bold text-blue-600 dark:text-blue-400">
                        Question Type
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <RadioGroup value={type} onValueChange={setType}>
                        <RadioGroupItem value="multiple choice" label="Multiple Choice" />
                        <RadioGroupItem value="true/false" label="True/False" />
                        <RadioGroupItem value="both" label="Both Types" />
                        </RadioGroup>
                    </CardContent>
                    </Card>
                </motion.div>

                {/* Number of Questions */}
                <motion.div variants={fadeUp}>
                    <Card className="bg-white dark:bg-gray-800 shadow-lg">
                    <CardHeader>
                        <CardTitle className="font-bold text-blue-600 dark:text-blue-400">
                        Number of Questions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Select
                        value={numberOfQuestions}
                        onChange={(e) =>
                            setNumberOfQuestions(parseInt(e.target.value))
                        }
                        className="mt-2"
                        >
                        <option value="" disabled>
                            Select number of questions
                        </option>
                        {difficultyOptions.map((option) => (
                            <option key={option} value={option}>
                            {option}
                            </option>
                        ))}
                        </Select>
                    </CardContent>
                    </Card>
                </motion.div>

                {/* Start Button */}
                <motion.div variants={fadeUp}>
                    <Button
                        onClick={() => {
                            if (!username.trim()) {
                                alert("Please enter your username before starting the quiz 😊");
                                return;
                            }
                            if (selectedCategories.length === 0) {
                                alert("Please select at least one category 🧠");
                                return;
                            }
                            fetchQuestions();
                        }}
                        disabled={isLoading}
                        className={`w-full py-3 bg-black/50 justify-center text-white font-semibold 
                                    dark:bg-blue-500 dark:hover:bg-blue-400 transition duration-300 ${!username.trim()
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-black'}
                                ${isLoading ? 'opacity-75' : ''}`}
                        >
                        {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Loading Questions...
                        </>
                    ) : (
                        'Start Quiz'
                    )}
                    </Button>
                </motion.div>
                </motion.div>
            </div>
        </motion.div>
    );
}