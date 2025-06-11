import React, { useEffect, useRef, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { IoIosQrScanner } from "react-icons/io";
import { RxHamburgerMenu } from "react-icons/rx";
import { useGetInfiniteLoad } from "../fetures/useGetInfiniteLoad";

const optionsType: string[] = [
  "All",
  "Title",
  "Author",
  "Text",
  "Subject",
  "Lists",
  "Advanced",
];

const Header = () => {
  const [curOption, setCurOption] = useState<string>("All");
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [curInp, setCurInp] = useState<string>("");
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetInfiniteLoad({ query: curInp });

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurOption(event.target.value);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );

    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }

    return () => {
      if (bottomRef.current) {
        observer.unobserve(bottomRef.current);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="flex items-center justify-between w-full  gap-10">
      <img
        className="w-32 h-16"
        src="https://openlibrary.org/static/images/openlibrary-logo-tighter.svg"
      />
      <span>My Book</span>
      <span>Browse</span>
      <div
        onMouseLeave={() => {
          setCurInp("");
        }}
        className="flex items-center rounded-lg bg-white border-black border-[1px] flex-1 relative"
      >
        <select
          value={curOption}
          onChange={handleChange}
          className="border-r-[1px] border-amber-100 py-2 px-2"
          style={{ backgroundColor: "#b0aba052" }}
        >
          {optionsType.map((optionItem) => (
            <option key={optionItem} value={optionItem}>
              {optionItem}
            </option>
          ))}
        </select>
        <input
          value={curInp}
          onChange={(e) => {
            setCurInp(e.target.value);
          }}
          className="bg-white p-2 flex-1 outline-none "
          placeholder="Search"
        />
        {/* Display load infinite */}
        <div
          className={`${
            curInp ? "block" : "hidden"
          } absolute bg-white top-11 border-[1px] rounded-lg p-2 max-h-52 overflow-y-auto left-0 right-0`}
        >
          {data?.pages.map((page, index) => (
            <React.Fragment key={index}>
              {page.authors.map((author: any) => (
                <div
                  key={author.key}
                  className="p-2 rounded border border-gray-300 shadow-sm"
                >
                  <p className="font-semibold">{author.name}</p>
                  <p className="text-sm text-gray-600">
                    Top work: {author.top_work ?? "N/A"}
                  </p>
                </div>
              ))}
            </React.Fragment>
          ))}
          {isFetchingNextPage && (
            <div className="w-full text-center">Loading...</div>
          )}
          <div ref={bottomRef} className="h-4" />
        </div>
        {/*  */}
        <CiSearch size={28} />
        <div className="border-l-[1px] pl-2 ml-2">
          <IoIosQrScanner size={28} />
        </div>
      </div>
      <button>Log In</button>
      <button className="bg-blue-400 py-2 px-4 rounded-lg text-white font-semibold">
        Sign Up
      </button>
      <RxHamburgerMenu />
    </div>
  );
};

export default Header;
