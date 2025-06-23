import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getDataWithPagination } from "../fetchApi/getDataWithPagination";

export const useGetDataWithPagination = () => {
  const [searchParams] = useSearchParams();

  const filter = searchParams.get("filter") || "books";
  const search = searchParams.get("search") || "";
  const mode = searchParams.get("mode") || "everything";

  const filterObj: { title: string; author: string } = {
    title: "",
    author: "",
  };

  search.split(" ").forEach((pair) => {
    const [key, value] = pair.split(":");
    if (key === "title" || key === "author") {
      filterObj[key] = value;
    }
  });

  const page = Number(
    searchParams.get("page") && Number(searchParams.get("page")) > 0
      ? searchParams.get("page")
      : "1"
  );

  const { data, isLoading, isError } = useQuery({
    queryFn: () =>
      getDataWithPagination({ filter, search, page, mode, filterObj }),
    queryKey: ["data", filter, search, page, mode, filterObj],
  });

  return { data, isLoading, isError };
};
