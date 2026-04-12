import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Quiz from "../../components/Quiz";

jest.mock("../../components/Navbar", () => () => <div>Navbar</div>);
jest.mock("../../components/Footer", () => () => <div>Footer</div>);
jest.mock("../../images/logo.png", () => "logo.png");
global.fetch = jest.fn();

const mockQuiz = {
    title: "Sample Quiz",
    questions: [
        {
            question: "What is 2 + 2?",
            options: ["1", "2", "4", "5"],
            answer: "4"
        },
        {
            question: "Capital of France?",
            options: ["London", "Paris", "Rome", "Berlin"],
            answer: "Paris"
        }
    ]
};

beforeEach(() => {
    fetch.mockClear();
});

test("renders start screen", () => {
    render(<Quiz />);
    expect(screen.getByText("Ready for a Quiz?")).toBeInTheDocument();
});

test("generates quiz successfully", async () => {
    fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockQuiz
    });

    render(<Quiz />);

    fireEvent.click(screen.getByText("Generate"));

    expect(screen.getByText("Generating Quiz...")).toBeInTheDocument();

    await waitFor(() =>
        expect(screen.getByText("Sample Quiz")).toBeInTheDocument()
    );
});

test("selects an answer", async () => {
    fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockQuiz
    });

    render(<Quiz />);

    fireEvent.click(screen.getByText("Generate"));

    await waitFor(() =>
        expect(screen.getByText("What is 2 + 2?")).toBeInTheDocument()
    );

    fireEvent.click(screen.getByText("4"));

    expect(screen.getByText("4")).toBeInTheDocument();
});

test("navigates to next question", async () => {
    fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockQuiz
    });

    render(<Quiz />);

    fireEvent.click(screen.getByText("Generate"));

    await waitFor(() =>
        expect(screen.getByText("What is 2 + 2?")).toBeInTheDocument()
    );

    fireEvent.click(screen.getByText("4"));
    fireEvent.click(screen.getByText("Next"));

    expect(screen.getByText("Capital of France?")).toBeInTheDocument();
});

test("completes quiz and shows score", async () => {
    fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockQuiz
    });

    render(<Quiz />);

    fireEvent.click(screen.getByText("Generate"));

    await waitFor(() =>
        expect(screen.getByText("What is 2 + 2?")).toBeInTheDocument()
    );

    fireEvent.click(screen.getByText("4"));
    fireEvent.click(screen.getByText("Next"));

    await waitFor(() =>
        expect(screen.getByText("Capital of France?")).toBeInTheDocument()
    );

    fireEvent.click(screen.getByText("Paris"));
    fireEvent.click(screen.getByText("Finish"));

    await waitFor(() =>
        expect(screen.getByText(/Score:/)).toBeInTheDocument()
    );

    expect(screen.getByText(/2\s*\/\s*2/)).toBeInTheDocument();


});

test("handles API failure", async () => {
    fetch.mockResolvedValueOnce({
        ok: false
    });

    render(<Quiz />);

    fireEvent.click(screen.getByText("Generate"));

    await waitFor(() =>
        expect(screen.getByText("Could not generate quiz.")).toBeInTheDocument()
    );
});