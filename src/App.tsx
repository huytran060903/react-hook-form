import { useEffect, useState } from "react";
import Header from "./components/Header.tsx";
import Heading from "./components/Heading.tsx";
import Search from "./components/Search.tsx";
import { CiSearch } from "react-icons/ci";
import { useSearchParams } from "react-router-dom";
import { useGetDataWithPagination } from "./features/useGetDataWithPagination.ts";
import Item, { type Author, type Book } from "./components/Item.tsx";
import Pagination from "./components/Pagination.tsx";
import { useForm, type SubmitHandler } from "react-hook-form";
import { updateFormData, type Inputs } from "./store/store.ts";
import { useDispatch, useSelector } from "react-redux";
const App = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [curFilter, setCurFilter] = useState(
    searchParams.get("filter") || "books"
  );

  const dataInput = useSelector((state: Inputs) => state.search);
  const [typeBook, setTypeBook] = useState(
    searchParams.get("mode") || "everything"
  );

  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<Inputs>();

  const { search } = watch();

  const { data, isLoading, isError } = useGetDataWithPagination();

  const onSubmit: SubmitHandler<Inputs> = () => {
    setSearchParams({
      filter: curFilter.toLowerCase(),
      search: dataInput,
      page: "1",
      mode: typeBook,
    });
  };
  const handleChangeTypeBook = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTypeBook(e.target.value);
    setSearchParams((searchParams) => {
      searchParams.set("mode", e.target.value);
      return searchParams;
    });
  };

  //Update every value change
  useEffect(() => {
    dispatch(updateFormData({ search }));
  }, [search, dispatch]);

  useEffect(() => {
    setValue("search", searchParams.get("search") || "");
  }, [searchParams, setValue]);

  return (
    <div className="w-full p-0 m-0 box-border flex flex-col">
      <Heading />
      <div className="px-8 py-3" style={{ backgroundColor: "#e1dcc5" }}>
        <Header />
        <div className="flex flex-col bg-white px-4 py-8 rounded-lg">
          <Search curFilter={curFilter} setFilter={setCurFilter} />
          <form
            className="flex items-center gap-5 mt-2"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="border-[1px] border-slate-400 rounded-md flex items-center relative">
              <input
                {...register("search", {
                  required: "Search is required",
                  minLength: {
                    value: 1,
                    message: "Search must be at least 1 characters",
                  },
                  maxLength: {
                    value: 30,
                    message: "Search must be not exceed 30 characters",
                  },
                })}
                placeholder="Search"
                className="outline-none w-72 px-4 py-2"
              />
              <button type="submit">
                <CiSearch size={30} className="text-slate-600" />
              </button>
              {errors.search && (
                <p className="absolute text-red-500 top-10 left-1">
                  {errors.search.message}
                </p>
              )}
            </div>
            {curFilter === "books" && (
              <>
                <div className="flex items-center gap-2">
                  <input
                    value="everything"
                    checked={typeBook === "everything"}
                    onChange={handleChangeTypeBook}
                    name="type_book"
                    type="radio"
                  />
                  <label>Everything</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    name="type_book"
                    checked={typeBook === "ebooks"}
                    onChange={handleChangeTypeBook}
                    value="ebooks"
                    type="radio"
                  />
                  <label>Ebooks</label>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
      {search && (
        <div className="px-8 py-3 grid grid-cols-12 gap-3">
          {!isLoading &&
            !isError &&
            !Array.isArray(data) &&
            data?.numFound > 0 && (
              <p className="col-span-12 my-3">Found: {data?.numFound} </p>
            )}
          {isLoading ? (
            <div className="col-span-12 text-center">Loading</div>
          ) : data && !Array.isArray(data) && data.docs && data?.numFound ? (
            data.docs.map((item: Author | Book, index: number) => (
              <Item key={index} book={curFilter === "books"} item={item} />
            ))
          ) : (
            <p className="text-center w-full">Not found </p>
          )}
        </div>
      )}
      <div className="flex justify-end w-full">
        {!isLoading &&
          !isError &&
          !Array.isArray(data) && search &&
          (data?.numFound as number) > 0 && (
            <Pagination count={data?.numFound} />
          )}
      </div>
    </div>
  );
};

export default App;
