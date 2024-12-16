import { Typography } from "@material-tailwind/react";
import React, { useContext } from "react";
import myContext from "../../context/data/myContext";
import headimg from "../../assets/headimg.jpg";
import { Link } from "react-router-dom";
import "./heroseciont.css"


function HeroSection() {
  const context = useContext(myContext);
  const { mode } = context;
  return (
    <section
      style={{ background: mode === "dark" ? "rgb(30, 41, 59)" : "#30336b" }}
    >
      {/* Hero Section  */}
      <div className="container mx-auto flex px-5 py-24 items-center justify-center flex-col">
        {/* Main Content  */}
        <main className="flex w-full justify-between items-center ">
          <div className=" right text-left">
            <h1 className="text-white text-left text-6xl font-semibold">
              The <span className="text-orange-500">Easiest Way</span> <br /> to
              Get Your New JOB{" "}
            </h1>
            <p className="text-gray-400 w-[80%] text-left text-[15px] mt-4">
              Our website has helped over 1,000+ students secure their dream
              jobs just last month. It’s not just a platform but a bridge
              connecting job seekers with top companies. Our mission is to
              provide every candidate with the perfect career opportunity that
              matches their skills and sets them on a path to a brighter future.
              If you’re looking for a job, visit our website today and take the
              first step toward your career success!
            </p>

            <Link to={"/allblogs"}  >
              <button className="px-6 mt-5 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                View All Jobs
              </button>
            </Link>
          </div>
          <div>
            <img className="w-[110rem]  rounded-lg" src={headimg} alt="img" />
          </div>
        </main>
      </div>
    </section>
  );
}

export default HeroSection;
