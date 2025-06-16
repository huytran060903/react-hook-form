import { fireEvent, render, screen } from "@testing-library/react";
import Item, { type Book, type Author } from "../components/Item";

import "@testing-library/jest-dom";
import Pagination from "../components/Pagination";
import { MemoryRouter } from "react-router-dom";
import Search from "../components/Search";
import App from "../App";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

describe("Item Component", () => {
  const mockBook: Book = {
    key: "/works/OL1234W",
    title: "Test Book",
    author_name: ["Test Author"],
    first_publish_year: 2023,
    edition_count: 2019,
    language: ["eng"],
  };

  const mockAuthor: Author = {
    key: "/authors/OL1234A",
    name: "Test Author",
    author_name: ["test1", "test2"],
    edition_count: 2019,
    first_publish_year: 2019,
    language: ["vietnamese", "english"],
    top_work: "Best Book",
  };

  it("should render book item correctly", () => {
    render(<Item item={mockBook} book={true} />);

    expect(
      screen.getByText((content) => content.includes(mockBook.title))
    ).toBeInTheDocument();
    expect(
      screen.getByText((content) => content.includes(mockBook.author_name[0]))
    ).toBeInTheDocument();
  });

  it("should render author item correctly", () => {
    render(<Item item={mockAuthor} book={false} />);

    expect(
      screen.getByText((content) => content.includes(mockAuthor.author_name[0]))
    ).toBeInTheDocument();
  });

  it("should apply correct styling based on type", () => {
    const { rerender } = render(<Item item={mockBook} book={true} />);

    expect(screen.getByTestId("item-container")).toHaveClass("book-item");

    rerender(<Item item={mockAuthor} book={false} />);
    expect(screen.getByTestId("item-container")).toHaveClass("author-item");
  });
});

describe("Pagination Component", () => {
  it("should render correct number of pages", () => {
    render(
      <MemoryRouter>
        <Pagination count={5} />
      </MemoryRouter>
    );

    expect(screen.getByTestId("current-page")).toBeInTheDocument();
  });

  it("should render correct number of pages", () => {
    render(
      <MemoryRouter>
        <Pagination count={20} />
      </MemoryRouter>
    );

    expect(screen.getByTestId("current-page")).toBeInTheDocument();
  });

  it("should render prev btn when we are in second page", () => {
    render(
      <MemoryRouter>
        <Pagination count={20} />
      </MemoryRouter>
    );

    const btnNext = screen.getByTestId("next-page");

    fireEvent.click(btnNext);
    const btnPrev = screen.getByTestId("previous-page");

    expect(btnPrev).toBeInTheDocument();
  });

  it("check class item filter", () => {
    const setFilter = jest.fn();
    render(
      <MemoryRouter>
        <Search curFilter="books" setFilter={setFilter} />
      </MemoryRouter>
    );

    expect(screen.getByText("Books")).toHaveClass("border-blue-500");
    expect(screen.getByText("Books")).toHaveClass("text-blue-500");
  });

  it("check class item filter when change value", () => {
    const queryClient = new QueryClient();
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <App />
          </MemoryRouter>
        </QueryClientProvider>
      </Provider>
    );

    const btnAuthorFilter = screen.getByText("Authors");

    expect(screen.getByText("Authors")).not.toHaveClass("border-blue-500");
    expect(screen.getByText("Authors")).not.toHaveClass("text-blue-500");

    fireEvent.click(btnAuthorFilter);

    expect(screen.getByText("Authors")).toHaveClass("border-blue-500");
    expect(screen.getByText("Authors")).toHaveClass("border-blue-500");
  });
});
