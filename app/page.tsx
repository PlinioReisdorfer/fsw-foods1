import React from "react";
import Header from "@/components/ui/header";
import Search from "@/components/ui/search";

const Home = () => {
  return (
    <>
      <Header />
      <div className="px-5 pt-6">
        <Search />
      </div>
    </>
  );
};

export default Home;
