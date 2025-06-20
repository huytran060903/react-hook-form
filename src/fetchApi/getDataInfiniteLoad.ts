import axios from "axios";
import { BASE_URL, ITEMS_PER_PAGE } from "../constants";
import { getStringParams, type StringParams } from "../utils/helper";

export const getDataInfiniteLoad = async ({ pageParam = 1, query = "*" }) => {
  const offset = (pageParam - 1) * ITEMS_PER_PAGE;

  const arrStringParams: StringParams[] = [
    {
      key: "q",
      value: query,
      setNew: true,
    },
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

  const params = getStringParams(arrStringParams);

  const res = await axios.get(
    `${BASE_URL}/search/authors.json?${params.toString()}`
  );
  return {
    authors: res.data.docs,
    nextOffset: pageParam + ITEMS_PER_PAGE,
    hasMore: res.data.docs.length === ITEMS_PER_PAGE,
  };
};
