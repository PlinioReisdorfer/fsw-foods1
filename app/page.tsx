import React from "react";
import Header from "@/components/ui/header";
import Search from "@/components/ui/search";
import CategoryList from "@/components/ui/category-list";

const Home = () => {
  return (
    <>
      <Header />
      <div className="px-5 pt-6">
        <Search />
      </div>

      <div className="px-5 pt-6">
        <CategoryList />
      </div>
    </>
  );
};

export default Home;
