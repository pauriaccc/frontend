import Navbar from "./Navbar";
import Footer from "./Footer";
import logo from "../images/logo.png";
import { useMemo, useState } from "react";

function Quiz() {
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [questionCount, setQuestionCount] = useState(5);

    const [started, setStarted] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);

    async function generateQuiz(event) {
        event.preventDefault();
        setLoading(true);
        setError("");
        setQuiz(null);
        setStarted(false);
        setCurrentQuestionIndex(0);
        setSelectedAnswers({});
        setSubmitted(false);

        try {
            const res = await fetch(
                `http://localhost:8080/api/ai/quiz?count=${questionCount}`,
                {
                    credentials: "include"
                }
            );

            if (!res.ok) {
                throw new Error("Failed to generate quiz");
            }

            const data = await res.json();

            if (!data || !data.questions || data.questions.length === 0) {
                throw new Error("No quiz available.");
            }

            setQuiz(data);
            setStarted(true);
        } catch (err) {
            console.error(err);
            setError("Could not generate quiz.");
        } finally {
            setLoading(false);
        }
    }

    function handleSelectAnswer(option) {
        if (submitted) return;
        setSelectedAnswers((prev) => ({
            ...prev,
            [currentQuestionIndex]: option
        }));
    }

    function handleNext() {
        if (!quiz) return;

        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
        } else {
            setSubmitted(true);
        }
    }

    function handlePrevious() {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prev) => prev - 1);
        }
    }

    function handleRestart() {
        setQuiz(null);
        setStarted(false);
        setSelectedAnswers({});
        setCurrentQuestionIndex(0);
        setSubmitted(false);
        setError("");
    }

    const score = useMemo(() => {
        if (!quiz) return 0;

        return quiz.questions.reduce((total, question, index) => {
            return total + (selectedAnswers[index] === question.answer ? 1 : 0);
        }, 0);
    }, [quiz, selectedAnswers]);

    if (!started && !loading) {
        return (
            <>
                <Navbar />
                <div className="page-container">
                    <main className="main ai-page">
                        <div className="ai-lecturer-card quiz-start-lecturer-card">
                            <div className="ai-lecturer">
                                <img
                                    className="logoImage"
                                    src={logo}
                                    alt="Placement Pal Logo"
                                />
                                <div className="thinking-wrapper"></div>
                                <h1>Ready for a Quiz?</h1>
                                <h4>Generate a quiz from your saved notes.</h4>
                            </div>

                            <form className="search-response-container quiz-generate-form" onSubmit={generateQuiz}>
                                <select
                                    className="ai-input quiz-count-select"
                                    value={questionCount}
                                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                                >
                                    <option value={3}>3 Questions</option>
                                    <option value={5}>5 Questions</option>
                                    <option value={7}>7 Questions</option>
                                    <option value={10}>10 Questions</option>
                                </select>

                                <button className="submit-button" type="submit">
                                    Generate
                                </button>
                            </form>

                            {error && <p className="quiz-error">{error}</p>}
                        </div>
                    </main>
                    <Footer />
                </div>
            </>
        );
    }

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="page-container">
                    <main className="main ai-page">
                        <div className="ai-lecturer-card quiz-start-lecturer-card">
                            <div className="ai-lecturer">
                                <img
                                    className="logoImage thinking"
                                    src={logo}
                                    alt="Placement Pal Logo"
                                />
                                <div className="thinking-wrapper">
                                    <div className="thinking-dots">
                                        <div></div>
                                    </div>
                                </div>
                                <h1>Generating Quiz...</h1>
                                <h4>Building your questions now.</h4>
                            </div>
                        </div>
                    </main>
                    <Footer />
                </div>
            </>
        );
    }

    if (error || !quiz || !quiz.questions || quiz.questions.length === 0) {
        return (
            <>
                <Navbar />
                <div className="page-container">
                    <main className="main quiz-page">
                        <div className="quiz-shell">
                            <div className="quiz-status-card">
                                <p>{error || "No quiz available."}</p>
                                <div className="quiz-actions">
                                    <button className="submit-button" onClick={handleRestart}>
                                        Back
                                    </button>
                                </div>
                            </div>
                        </div>
                    </main>
                    <Footer />
                </div>
            </>
        );
    }

    if (submitted) {
        return (
            <>
                <Navbar />
                <div className="page-container">
                    <main className="main quiz-page">
                        <div className="quiz-shell">
                            <div className="quiz-result-card">
                                <h1 className="quiz-title">{quiz.title}</h1>
                                <h2 className="quiz-result-score">
                                    Score: {score} / {quiz.questions.length}
                                </h2>

                                <div className="quiz-review-list">
                                    {quiz.questions.map((question, index) => {
                                        const selected = selectedAnswers[index];
                                        const correct = question.answer;
                                        const isCorrect = selected === correct;

                                        return (
                                            <div className="quiz-review-card" key={index}>
                                                <p className="quiz-review-question">
                                                    {index + 1}. {question.question}
                                                </p>
                                                <p className={isCorrect ? "quiz-review-correct" : "quiz-review-wrong"}>
                                                    Your answer: {selected || "No answer"}
                                                </p>
                                                {!isCorrect && (
                                                    <p className="quiz-review-answer">
                                                        Correct answer: {correct}
                                                    </p>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="quiz-actions">
                                    <button className="dash-btn dash-btn-ghost" onClick={handleRestart}>
                                        New Quiz
                                    </button>
                                </div>
                            </div>
                        </div>
                    </main>
                    <Footer />
                </div>
            </>
        );
    }

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const selectedOption = selectedAnswers[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

    return (
        <>
            <Navbar />
            <div className="page-container">
                <main className="main quiz-page">
                    <div className="quiz-shell">
                        <div className="quiz-header-card">
                            <div>
                                <h1 className="quiz-title">{quiz.title}</h1>
                                <p className="quiz-subtitle">
                                    Question {currentQuestionIndex + 1} of {quiz.questions.length}
                                </p>
                            </div>

                            <div className="quiz-progress-text">
                                {Math.round(progress)}%
                            </div>
                        </div>

                        <div className="quiz-progress-bar">
                            <div
                                className="quiz-progress-fill"
                                style={{ width: `${progress}%` }}
                            />
                        </div>

                        <div className="quiz-card">
                            <h2 className="quiz-question">
                                {currentQuestion.question}
                            </h2>

                            <div className="quiz-options">
                                {currentQuestion.options.map((option) => (
                                    <button
                                        key={option}
                                        className={`quiz-option ${selectedOption === option ? "selected" : ""}`}
                                        onClick={() => handleSelectAnswer(option)}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="quiz-actions">
                            <button
                                className="dash-btn dash-btn-ghost"
                                onClick={handlePrevious}
                                disabled={currentQuestionIndex === 0}
                            >
                                Back
                            </button>

                            <button
                                className="submit-button"
                                onClick={handleNext}
                                disabled={!selectedOption}
                            >
                                {currentQuestionIndex === quiz.questions.length - 1 ? "Finish" : "Next"}
                            </button>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </>
    )
}
export default Quiz;