import { render, screen } from "@testing-library/react";
import App from "./App.component";

describe("app tests", () => {
  it("has enter button", () => {
    render(<App />);
    expect(screen.getByRole("button", { name: "Enter" })).toBeInTheDocument();
  });

  it("has download button", () => {
    render(<App />);
    expect(screen.getByRole("button", { name: "Download list" })).toBeInTheDocument();
  });
});
