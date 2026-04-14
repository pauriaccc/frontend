import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AILecturer from "../../components/AILecturer";

jest.mock("../../components/Navbar", () => () => <div>Navbar</div>);
jest.mock("../../components/Footer", () => () => <div>Footer</div>);
jest.mock("../../images/logo.png", () => "logo.png");
global.fetch = jest.fn();

global.crypto = {
  randomUUID: () => "12345abcde",
};

beforeEach(() => {
  fetch.mockClear();
});

afterEach(() => {
  jest.clearAllMocks();
  jest.useRealTimers();
});

test("renders AI Lecturer page", () => {
  render(<AILecturer />);

  expect(screen.getByText("How Can I Help?")).toBeInTheDocument();
  expect(screen.getByText("Ask me To Explain Anything!")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Enter prompt...")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /send/i })).toBeDisabled();
});

test("sends prompt and displays AI response", async () => {
  fetch.mockResolvedValueOnce({
    text: async () => "This is a test AI response",
  });

  render(<AILecturer />);

  const input = screen.getByPlaceholderText("Enter prompt...");
  const button = screen.getByRole("button", { name: /send/i });

  fireEvent.change(input, { target: { value: "What is React?" } });
  fireEvent.click(button);

  expect(button).toBeDisabled();

  await waitFor(() => {
    expect(screen.getByText("This is a test AI response")).toBeInTheDocument();
  });

  expect(screen.getByText("Explanation")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
});

test("handles fetch failure", async () => {
  fetch.mockRejectedValueOnce(new Error("API failed"));

  render(<AILecturer />);

  const input = screen.getByPlaceholderText("Enter prompt...");
  const button = screen.getByRole("button", { name: /send/i });

  fireEvent.change(input, { target: { value: "Test prompt" } });
  fireEvent.click(button);

  await waitFor(() => {
    expect(
      screen.getByText("Failed to fetch message.")
    ).toBeInTheDocument();
  });
});

test("saves AI response to notepad", async () => {
  fetch.mockResolvedValueOnce({
    text: async () => "Saved response text",
  });

  fetch.mockResolvedValueOnce({});

  render(<AILecturer />);

  const input = screen.getByPlaceholderText("Enter prompt...");
  fireEvent.change(input, { target: { value: "Save this" } });

  fireEvent.click(screen.getByRole("button", { name: /send/i }));

  await waitFor(() => {
    expect(screen.getByText("Saved response text")).toBeInTheDocument();
  });

  fireEvent.click(screen.getByRole("button", { name: /save/i }));

  await waitFor(() => {
    expect(screen.getByText("Saved ✓")).toBeInTheDocument();
  });

  expect(fetch).toHaveBeenCalledWith(
    "http://localhost:8080/api/dictionaries/add",
    expect.objectContaining({
      method: "POST",
    })
  );
});