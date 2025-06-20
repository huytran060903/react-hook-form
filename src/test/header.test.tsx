import { render, screen, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import Header from "../components/Header";
import "@testing-library/jest-dom";

describe("Header Component", () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const renderHeader = () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </QueryClientProvider>
    );
  };

  beforeEach(() => {
    queryClient.clear();
  });

  it("should render search input", () => {
    renderHeader();
    const searchInput = screen.getByPlaceholderText(/search/i);
    expect(searchInput).toBeInTheDocument();
  });

  it("should update input value when typing", () => {
    renderHeader();
    const searchInput = screen.getByPlaceholderText(/search/i);

    fireEvent.change(searchInput, { target: { value: "test search" } });

    expect(searchInput).toHaveValue("test search");
  });

  it("should clear input when clicking clear button", () => {
    renderHeader();
    const searchInput = screen.getByPlaceholderText(/search infinite load/i);

    fireEvent.change(searchInput, { target: { value: "test search" } });
    const clearButton = screen.getByTestId("search-container");

    fireEvent.mouseLeave(clearButton);

    expect(searchInput).toHaveValue("");
  });

  it("should show loading state while fetching", async () => {
    renderHeader();
    const searchInput = screen.getByPlaceholderText(/search infinite load/i);

    fireEvent.change(searchInput, { target: { value: "test" } });

    const loadingElement = await screen.findByTestId("loading-state");
    expect(loadingElement).toBeInTheDocument();
  });

  it("should trigger search on enter key press", () => {
    renderHeader();
    const searchInput = screen.getByPlaceholderText(/search/i);

    fireEvent.change(searchInput, { target: { value: "test search" } });
    fireEvent.keyPress(searchInput, { key: "Enter", code: 13, charCode: 13 });
  });

  it("should show data not found", async () => {
    renderHeader();
    const searchInput = screen.getByPlaceholderText(/search infinite load/i);

    
    fireEvent.change(searchInput, { target: { value: "sdklasjdkask" } });

    const errorElement = await screen.findByTestId("data-notfound");
    expect(errorElement).toBeInTheDocument();
  });

  it('should handle select option change', () => {
  renderHeader();
  
  // Find the select element
  const selectElement = screen.getByRole('combobox');
  expect(selectElement).toBeInTheDocument();

  // Change select value
  fireEvent.change(selectElement, { target: { value: 'Title' } });
  
  // Verify new value is selected
  expect(selectElement).toHaveValue('Title');

  // Test other options
  fireEvent.change(selectElement, { target: { value: 'Author' } });
  expect(selectElement).toHaveValue('Author');

  fireEvent.change(selectElement, { target: { value: 'Text' } });
  expect(selectElement).toHaveValue('Text');
});
});
