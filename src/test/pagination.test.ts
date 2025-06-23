/* eslint-disable @typescript-eslint/no-explicit-any */
import { getDataWithPagination } from "../fetchApi/getDataWithPagination";
import axios from "axios";
import { ITEMS_PER_PAGE } from "../constants";

// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

interface ApiResponse {
  data: {
    docs: any[];
    numFound: number;
  };
}

describe("getDataWithPagination", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch books with title filter", async () => {
    const mockResponse: ApiResponse = {
      data: {
        docs: [{ title: "Test Book", author_name: ["Test Author"] }],
        numFound: 1,
      },
    };
    mockedAxios.get.mockResolvedValueOnce(mockResponse);

    const result = await getDataWithPagination({
      filter: "books",
      search: "test",
      page: 1,
      mode: "everything",
      filterObj: { title: "test", author: "" },
    });

    expect(mockedAxios.get).toHaveBeenCalledWith(
      `https://openlibrary.org/search.json?offset=0&limit=${ITEMS_PER_PAGE}&title=test&mode=everything`
    );
    expect(result).toEqual({
      docs: mockResponse.data.docs,
      numFound: mockResponse.data.numFound,
    });
  });

  it("should fetch authors data", async () => {
    const mockResponse: ApiResponse = {
      data: {
        docs: [{ name: "Test Author", work_count: 5 }],
        numFound: 1,
      },
    };
    mockedAxios.get.mockResolvedValueOnce(mockResponse);

    const result = await getDataWithPagination({
      filter: "authors",
      search: "test",
      page: 1,
      mode: "everything",

      filterObj: { title: "", author: "test" },
    });

    expect(mockedAxios.get).toHaveBeenCalledWith(
      `https://openlibrary.org/search.json?offset=0&limit=${ITEMS_PER_PAGE}&author=test&mode=everything`
    );
    expect(result).toEqual({
      docs: mockResponse.data.docs,
      numFound: mockResponse.data.numFound,
    });
  });

  it("should handle combined title and author filters", async () => {
    const mockResponse: ApiResponse = {
      data: {
        docs: [{ title: "Test Book", author_name: ["Test Author"] }],
        numFound: 1,
      },
    };
    mockedAxios.get.mockResolvedValueOnce(mockResponse);

    const result = await getDataWithPagination({
      filter: "books",
      search: "",
      page: 1,
      mode: "everything",

      filterObj: { title: "test", author: "author" },
    });

    expect(mockedAxios.get).toHaveBeenCalledWith(
      `https://openlibrary.org/search.json?offset=0&limit=${ITEMS_PER_PAGE}&title=test&author=author&mode=everything`
    );
    expect(result).toEqual({
      docs: mockResponse.data.docs,
      numFound: mockResponse.data.numFound,
    });
  });

  it("should handle error cases", async () => {
    const errorMessage = "Network Error";
    mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));

    const result = await getDataWithPagination({
      filter: "books",
      search: "test",
      page: 1,
      mode: "everything",

      filterObj: { title: "", author: "" },
    });

    expect(result).toEqual([]);
  });

  it("should handle pagination offset", async () => {
    const mockResponse: ApiResponse = {
      data: {
        docs: [],
        numFound: 0,
      },
    };
    mockedAxios.get.mockResolvedValueOnce(mockResponse);

    await getDataWithPagination({
      filter: "books",
      search: "test",
      page: 3,
      mode: "everything",

      filterObj: { title: "", author: "" },
    });

    const expectedOffset = (3 - 1) * ITEMS_PER_PAGE;
    expect(mockedAxios.get).toHaveBeenCalledWith(
      `https://openlibrary.org/search.json?offset=${expectedOffset}&limit=${ITEMS_PER_PAGE}&title=test&mode=everything`
    );
  });
});
