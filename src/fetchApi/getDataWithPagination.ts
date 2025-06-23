import axios from "axios";
import { BASE_URL, ITEMS_PER_PAGE } from "../constants";
import { getStringParams, type StringParams } from "../utils/helper";

export const getDataWithPagination = async ({
  filter,
  search,
  page,
  mode,
  filterObj,
}: {
  filter: string;
  search: string;
  page: number;
  mode: string;
  filterObj: { title: string; author: string };
}) => {
  // let url = "https://openlibrary.org/search.json?";
  // const offset = (page - 1) * NUMBER_ITEM_IN_A_PAGE;

  // if (filterObj.author && filterObj.title) {
  //   url += `title=${filterObj.title}&offset=${offset}&limit=${NUMBER_ITEM_IN_A_PAGE}&author=${filterObj.author}`;
  // } else {
  //   if (filter === "books") {
  //     url += `title=${search}&offset=${offset}&limit=${NUMBER_ITEM_IN_A_PAGE}`;
  //   } else if (filter === "authors") {
  //     url += `author=${search}&offset=${offset}&limit=${NUMBER_ITEM_IN_A_PAGE}`;
  //   }
  // }

 
  const offset = (page - 1) * ITEMS_PER_PAGE;

  const arrStringParams: StringParams[] = [
    {
      key: "offset",
      value: offset.toString(),
      setNew: true,
    },
    {
      key: "limit",
      value: ITEMS_PER_PAGE.toString(),
      setNew: true,
    },
  ];

  if (filterObj.author && filterObj.title) {
    arrStringParams.push({
      key: "title",
      value: filterObj.title,
      setNew: true,
    });

    arrStringParams.push({
      key: "author",
      value: filterObj.author,
      setNew: true,
    });
  } else {
    if (filter === "books") {
      arrStringParams.push({
        key: "title",
        value: search,
        setNew: true,
      });
    } else if (filter === "authors") {
      arrStringParams.push({
        key: "author",
        value: search,
        setNew: true,
      });
    }
  }
  arrStringParams.push({
    key: "mode",
    value: mode,
    setNew: true,
  });

  arrStringParams.push({
    key: "has_fulltext",
    value: "true",
    setNew: mode === "everything" ? false : true,
  });

  const params = getStringParams(arrStringParams);

  const url = `${BASE_URL}/search.json?${params}`;
  try {
    const res = await axios.get(url);

    const { docs, numFound } = res.data;

    return { docs, numFound };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("error message: ", error.message);
      throw new Error(error.message);
    } else {
      console.log("unexpected error: ", error);
    }
    return [];
  }
};
