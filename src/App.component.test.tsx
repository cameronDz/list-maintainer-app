import { render, screen } from "@testing-library/react";
import { vi, beforeEach } from "vitest";
import App from "./App.component";

// Mock window.fetch
const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

describe("app tests", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it("has submit button", () => {
    render(<App />);
    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  });

  it("has load backup list button", () => {
    render(<App />);
    expect(screen.getByRole("button", { name: "Load Backup List" })).toBeInTheDocument();
  });
});
