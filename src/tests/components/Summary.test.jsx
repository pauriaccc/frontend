import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Summary from "../../components/Summary";

jest.mock("../../components/Navbar", () => () => <div>Navbar</div>);
jest.mock("../../components/Footer", () => () => <div>Footer</div>);
jest.mock("../../images/logo.png", () => "logo.png");
global.fetch = jest.fn();

beforeEach(() => {
    fetch.mockClear();
});

afterAll(() => {
    jest.restoreAllMocks();
});

test("renders summary page", () => {
    render(<Summary />);

    expect(screen.getByText("Congratulations!")).toBeInTheDocument();
    expect(
        screen.getByText(/Generate a PDF summarising your placement/i)
    ).toBeInTheDocument();
});

test("generates PDF successfully", async () => {
    fetch.mockResolvedValueOnce({
        ok: true,
        blob: async () => new Blob(["pdf"])
    });

    render(<Summary />);

    fireEvent.click(screen.getByText("Generate PDF"));

    expect(fetch).toHaveBeenCalledWith(
        "http://localhost:8080/api/ai/summary/pdf",
        expect.objectContaining({
            method: "POST",
            credentials: "include"
        })
    );
});

test("handles API failure", async () => {
    fetch.mockResolvedValueOnce({
        ok: false
    });

    render(<Summary />);

    fireEvent.click(screen.getByText("Generate PDF"));

    await waitFor(() => {
        expect(
            screen.getByText("Could not generate PDF.")
        ).toBeInTheDocument();
    });
});