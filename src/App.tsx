import { useEffect, useState } from "react";
import Header from "./components/Header.tsx";
import Heading from "./components/Heading.tsx";
import Search from "./components/Search.tsx";
import { CiSearch } from "react-icons/ci";
import { useSearchParams } from "react-router-dom";
import { useGetDataWithPagination } from "./fetures/useGetDataWithPagination.ts";
import Item, { type Author, type Book } from "./components/Item.tsx";
import Pagination from "./components/Pagination.tsx";
import { useForm, type SubmitHandler } from "react-hook-form";
import { updateFormData, type Inputs } from "./store/store.ts";
import { useDispatch, useSelector } from "react-redux";
const App = () => {
  const [curFilter, setCurFilter] = useState("books");

  const dataInput = useSelector((state: Inputs) => state.search);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<Inputs>();

  const { search } = watch();

  const [, setSearchParams] = useSearchParams();

  const { data, isLoading, isError } = useGetDataWithPagination();

  const onSubmit: SubmitHandler<Inputs> = () => {
    setSearchParams({
      filter: curFilter.toLowerCase(),
      search: dataInput,
      page: "1",
    });
  };

  //Update every value change
  useEffect(() => {
    dispatch(updateFormData({ search }));
  }, [search, dispatch]);

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
                    value: 3,
                    message: "Search must be at least 3 characters",
                  },
                  maxLength: {
                    value: 20,
                    message: "Search must be not exceed 20 characters",
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
            <div className="flex items-center gap-2">
              <input name="type_book" defaultChecked type="radio" />
              <label>Everything</label>
            </div>
            <div className="flex items-center gap-2">
              <input name="type_book" type="radio" />
              <label>Ebooks</label>
            </div>
          </form>
        </div>
      </div>
      <div className="px-8 py-3 grid grid-cols-12">
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
      <div className="flex justify-end w-full">
        {!isLoading &&
          !isError &&
          !Array.isArray(data) &&
          (data?.numFound as number) > 0 && (
            <Pagination count={data?.numFound} />
          )}
      </div>
    </div>
  );
};

export default App;
