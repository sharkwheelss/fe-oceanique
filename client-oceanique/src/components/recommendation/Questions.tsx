import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useRecommendation } from '../../context/RecommendationContext';
import { useI18n } from '../../context/I18nContext';

export interface Option {
    id: number;
    option_text: string;
    option_value: string;
}

export interface Questions {
    id: number;
    question: string;
    question_text?: string; // Alternative field name
    question_type: string;
    category: string;
    options: Option[];
}

function Questions() {
    const { t } = useI18n();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState<Questions[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Map<number, number[]>>(new Map());
    const [isLoading, setIsLoading] = useState(true);
    const [optionSliderIndex, setOptionSliderIndex] = useState(0); // For option slider
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { getAllQuestions, beachRecommendation } = useRecommendation();

    useEffect(() => {
        const loadQuestions = async () => {
            try {
                setIsLoading(true);
                const questionsData = await getAllQuestions();
                setQuestions(questionsData);
                console.log('questions:', questionsData);
            } catch (error) {
                console.error('Error loading questions:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadQuestions();
    }, []);

    // Reset slider when question changes
    useEffect(() => {
        setOptionSliderIndex(0);
    }, [currentQuestionIndex]);

    const handleOptionSelect = (questionId: number, optionId: number, isMultiple: boolean) => {
        const newAnswers = new Map(answers);
        const currentSelections = newAnswers.get(questionId) || [];

        if (isMultiple) {
            // Multiple choice - toggle selection
            if (currentSelections.includes(optionId)) {
                const filteredSelections = currentSelections.filter(id => id !== optionId);
                if (filteredSelections.length === 0) {
                    newAnswers.delete(questionId);
                } else {
                    newAnswers.set(questionId, filteredSelections);
                }
            } else {
                newAnswers.set(questionId, [...currentSelections, optionId]);
            }
        } else {
            // Single choice - replace selection
            newAnswers.set(questionId, [optionId]);
        }

        setAnswers(newAnswers);
    };

    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    // Function to collect all selected option IDs
    const getAllSelectedOptions = (): number[] => {
        const allOptions: number[] = [];
        answers.forEach((optionIds) => {
            allOptions.push(...optionIds);
        });
        return allOptions;
    };

    const handleNextQuestion = async () => {
        if (isLastQuestion) {
            // Submit answers and get recommendations
            setIsSubmitting(true);

            // Create a minimum loading time promise
            const minLoadingTime = new Promise(resolve => setTimeout(resolve, 2000));

            try {
                const userOptions = getAllSelectedOptions();
                console.log('Submitting user options:', userOptions);

                // Call the recommendation API and wait for both API and minimum time
                const [recommendationData] = await Promise.all([
                    beachRecommendation({ userOptions }),
                    minLoadingTime
                ]);

                console.log('Recommendation data:', recommendationData);

                // Navigate to result page
                navigate('/recommendation-result', {
                    state: {
                        recommendationData,
                        userOptions
                    }
                });
            } catch (error) {
                console.error('Error getting recommendations:', error);
                // Handle error - maybe show a toast or error message
            } finally {
                setIsSubmitting(false);
            }
        } else {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
            setOptionSliderIndex(0);
        }
    }

    const handleOptionSliderPrevious = () => {
        if (optionSliderIndex > 0) {
            setOptionSliderIndex(optionSliderIndex - 1);
        }
    };

    const handleOptionSliderNext = () => {
        const currentQuestion = questions[currentQuestionIndex];
        const maxVisibleOptions = 3;
        const maxSliderIndex = Math.max(0, (currentQuestion?.options?.length || 0) - maxVisibleOptions);

        if (optionSliderIndex < maxSliderIndex) {
            setOptionSliderIndex(optionSliderIndex + 1);
        }
    };

    // Loading animation component
    const LoadingSpinner = () => (
        <div className="relative w-16 h-16">
            {/* Outer rotating ring */}
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-400 border-r-purple-300 animate-spin"></div>
            {/* Inner blob shape */}
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-teal-400 via-blue-400 to-purple-500 animate-pulse"></div>
            {/* Inner highlight */}
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-white/40 to-transparent"></div>
        </div>
    );

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto p-6 flex justify-center items-center max-h-screen">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading questions...</p>
                </div>
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="max-w-4xl mx-auto p-6 flex justify-center items-center max-h-screen">
                <div className="text-center">
                    <p className="text-gray-600">No questions available.</p>
                </div>
            </div>
        );
    }

    // Show full-screen loading overlay when submitting
    if (isSubmitting) {
        return (
            <div className="fixed inset-0 bg-white z-50 flex flex-col justify-center items-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-8">
                        Hang tight, processing!
                    </h1>
                    <div className="flex justify-center mb-8">
                        <LoadingSpinner />
                    </div>
                    <p className="text-gray-600 text-lg">
                        We're finding the perfect recommendations for you...
                    </p>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];
    const hasAnsweredCurrentQuestion = currentQuestion && answers.has(currentQuestion.id);
    const questionText = currentQuestion?.question_text || currentQuestion?.question || '';
    const isMultipleChoice = currentQuestion?.question_type === 'multiple';

    // Calculate visible options for slider
    const maxVisibleOptions = 3;
    const itemWidth = 192; // w-48 = 192px
    const itemGap = 64; // gap-16 = 64px
    const itemTotalWidth = itemWidth + itemGap;
    const maxSliderIndex = Math.max(0, (currentQuestion?.options?.length || 0) - maxVisibleOptions);

    const canSlideLeft = optionSliderIndex > 0;
    const canSlideRight = optionSliderIndex < maxSliderIndex;

    return (
        <div className="max-w-4xl mx-auto">
            {/* Back button and progress indicator */}
            <div className="flex justify-between items-center mb-8">
                <button
                    className="flex items-center text-teal-500 font-medium"
                    onClick={() => window.history.back()}
                >
                    <span className="mr-2">←</span> {t('questions.back')}
                </button>
                <div className="text-gray-500">
                    {currentQuestionIndex + 1} of {questions.length} questions
                </div>
            </div>

            {/* Question */}
            <h1 className="text-3xl font-bold text-center mb-6">
                {questionText}
            </h1>

            {/* Selection Type Indicator */}
            <div className="flex justify-center mb-8">
                <div className={`inline-flex items-center px-6 py-3 rounded-full text-sm font-medium ${isMultipleChoice
                        ? 'bg-blue-50 border-2 border-blue-200 text-blue-700'
                        : 'bg-green-50 border-2 border-green-200 text-green-700'
                    }`}>
                    <div className={`w-4 h-4 rounded mr-3 flex items-center justify-center text-xs font-bold ${isMultipleChoice
                            ? 'bg-blue-500 text-white'
                            : 'bg-green-500 text-white'
                        }`}>
                        {isMultipleChoice ? '☑' : '●'}
                    </div>
                    <span>
                        {isMultipleChoice
                            ? t('questions.multiple')
                            : t('questions.single')
                        }
                    </span>
                </div>
            </div>

            {/* Options with slider */}
            <div className="flex items-center justify-center mb-12 gap-4">
                {/* Previous slider button */}
                <button
                    className={`p-3 rounded-full z-10 flex-shrink-0 ${canSlideLeft
                        ? 'bg-teal-500 text-white hover:bg-teal-600'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                    onClick={handleOptionSliderPrevious}
                    disabled={!canSlideLeft}
                >
                    ←
                </button>

                {/* Option cards container */}
                <div className="overflow-hidden" style={{ width: `${maxVisibleOptions * itemTotalWidth - itemGap}px` }}>
                    <div
                        className="flex gap-16 transition-transform duration-500 ease-in-out"
                        style={{ transform: `translateX(-${optionSliderIndex * itemTotalWidth}px)` }}
                    >
                        {currentQuestion?.options?.map(option => {
                            const isSelected = answers.get(currentQuestion.id)?.includes(option.id) || false;

                            return (
                                <div key={option.id} className="flex flex-col items-center flex-shrink-0">
                                    <div className="bg-white rounded-3xl shadow-md overflow-hidden mb-4 w-48 h-64">
                                        <img
                                            src={option.img}
                                            alt=""
                                            className="w-full h-full object-cover rounded-3xl"
                                            onError={(e) => {
                                                e.currentTarget.src = '/option-placeholder.jpg';
                                            }
                                            }
                                        />
                                    </div>

                                    <div className="text-center text-xl font-medium mb-2">
                                        {option.option_text}
                                    </div>
                                    <button
                                        className={`h-8 w-8 rounded-full flex items-center justify-center transition-all duration-200 ${isSelected
                                                ? isMultipleChoice
                                                    ? 'bg-blue-500 text-white shadow-md'
                                                    : 'bg-green-500 text-white shadow-md'
                                                : 'bg-gray-200 hover:bg-gray-300 border-2 border-gray-300'
                                            }`}
                                        onClick={() => handleOptionSelect(
                                            currentQuestion.id,
                                            option.id,
                                            isMultipleChoice
                                        )}
                                    >
                                        {isSelected && (isMultipleChoice ? '✓' : '●')}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Next slider button */}
                <button
                    className={`p-3 rounded-full z-10 flex-shrink-0 ${canSlideRight
                        ? 'bg-teal-500 text-white hover:bg-teal-600'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                    onClick={handleOptionSliderNext}
                    disabled={!canSlideRight}
                >
                    →
                </button>
            </div>

            {/* Next question button */}
            <div className="flex justify-between">
                <button
                    className="bg-red-500 text-white py-3 px-10 rounded-full font-medium hover:bg-red-600 transition-colors duration-300"
                    onClick={handlePrevQuestion}
                >
                    {t('questions.previous')}
                </button>
                <button
                    className={`py-3 px-10 rounded-full font-medium flex items-center ${hasAnsweredCurrentQuestion
                        ? 'bg-teal-500 text-white hover:bg-teal-600 transition-colors duration-300'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    onClick={handleNextQuestion}
                    disabled={!hasAnsweredCurrentQuestion}
                >
                    {isLastQuestion ? (
                        t('questions.submit')
                    ) : (
                        <>
                            {t('questions.next')} <span className="ml-2">→</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

export default Questions;