// frontend/src/components/Home.jsx
import React, { useCallback, useEffect, useState } from "react";
import "./styles/Home.css";
import { FaCalendar, FaSearch } from "react-icons/fa";
import { LuBadgePercent } from "react-icons/lu";
import PackageCard from "./PackageCard";
import { useNavigate } from "react-router";
import { GiWheat } from "react-icons/gi";

const Home = () => {
  const navigate = useNavigate();
  const [topPackages, setTopPackages] = useState([]);
  const [latestPackages, setLatestPackages] = useState([]);
  const [offerPackages, setOfferPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const getTopPackages = useCallback(async () => {
    try {
      setLoading(true);
      // Sort by dailyRentPrice as a proxy for "top" since no rating exists
      const res = await fetch(
        "/api/package/get-packages?sort=dailyRentPrice&order=asc&limit=8"
      );
      const data = await res.json();
      if (data?.success) {
        setTopPackages(data?.packages);
        setLoading(false);
      } else {
        setLoading(false);
        alert(data?.message || "Something went wrong!");
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, []);

  const getLatestPackages = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(
        "/api/package/get-packages?sort=createdAt&limit=8"
      );
      const data = await res.json();
      if (data?.success) {
        setLatestPackages(data?.packages);
        setLoading(false);
      } else {
        setLoading(false);
        alert(data?.message || "Something went wrong!");
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, []);

  const getOfferPackages = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(
        "/api/package/get-packages?sort=createdAt&offer=true&limit=6"
      );
      const data = await res.json();
      if (data?.success) {
        setOfferPackages(data?.packages);
        setLoading(false);
      } else {
        setLoading(false);
        alert(data?.message || "Something went wrong!");
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getTopPackages();
    getLatestPackages();
    getOfferPackages();
  }, [getTopPackages, getLatestPackages, getOfferPackages]);

  return (
    <div className="main w-full">
      <div className="w-full flex flex-col">
        <div className="backaground_image w-full"></div>
        <div className="top-part w-full gap-2 flex flex-col">
          <div className="flex justify-center items-center mb-2">
            <GiWheat className="text黄色-300 text-5xl mr-3" />
            <h1 className="text-white text-4xl text-center font-bold mb-2 font-serif tracking-wider">
              AGRI CONNECT
            </h1>
            <GiWheat className="text黄色-300 text-5xl ml-3 transform scale-x-flip" />
          </div>
          <h1 className="text-white text-sm text-center xsm:text-lg font-semibold">
            Connecting farmers, bridging gaps
          </h1>

          <div className="w-full flex justify-center items-center gap-2 mt-8">
            <div className="relative w-[230px] sm:w-2/5">
              <input
                type="text"
                className="rounded-lg outline-none w-full p-3 pl-10 border-2 border-green-200 bg-white bg-opacity-90 text-green-800 placeholder:text-green-600 font-medium focus:ring-2 focus:ring-yellow-400 transition-all"
                placeholder="Search for equipment..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600" />
            </div>
            <button
              onClick={() => navigate(`/search?searchTerm=${search}`)}
              className="bg-yellow-500 hover:bg-yellow-600 w-12 h-12 flex justify-center items-center text-xl font-bold rounded-full text-white shadow-lg hover:scale-95 transition-all duration-300"
            >
              Go
            </button>
          </div>

          <div className="w-[90%] max-w-xl mx-auto flex justify-center mt-10">
            <button
              onClick={() => navigate("/search?offer=true")}
              className="flex items-center justify-around gap-x-1 bg-green-700 text-white p-2 py-3 text-[8px] xxsm:text-sm sm:text-lg border-e border-green-500 rounded-s-full flex-1 hover:bg-green-600 transition-all duration-300 shadow-md"
            >
              Best Offers
              <LuBadgePercent className="text-2xl text-yellow-300" />
            </button>
            <button
              onClick={() => navigate("/search?sort=dailyRentPrice&order=asc")}
              className="flex items-center justify-around gap-x-1 bg-green-700 text-white p-2 py-3 text-[8px] xxsm:text-sm sm:text-lg border-x border-green-500 flex-1 hover:bg-green-600 transition-all duration-300 shadow-md"
            >
              Cheapest
              <FaCalendar className="text-2xl text-yellow-300" />
            </button>
            <button
              onClick={() => navigate("/search?sort=createdAt")}
              className="flex items-center justify-around gap-x-1 bg-green-700 text-white p-2 py-3 text-[8px] xxsm:text-sm sm:text-lg border-s border-green-500 rounded-e-full flex-1 hover:bg-green-600 transition-all duration-300 shadow-md"
            >
              Latest
              <FaCalendar className="text-2xl text-yellow-300" />
            </button>
          </div>
        </div>

        <div className="main p-6 flex flex-col gap-5">
          {loading && <h1 className="text-center text-2xl">Loading...</h1>}
          {!loading &&
            topPackages.length === 0 &&
            latestPackages.length === 0 &&
            offerPackages.length === 0 && (
              <h1 className="text-center text-2xl">No Equipment Yet!</h1>
            )}
          {!loading && topPackages.length > 0 && (
            <>
              <h1 className="text-2xl font-semibold">Cheapest Equipment</h1>
              <div className="grid 2xl:grid-cols-5 xlplus:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-2 my-3">
                {topPackages.map((packageData) => (
                  <PackageCard
                    key={packageData._id}
                    packageData={packageData}
                  />
                ))}
              </div>
            </>
          )}
          {!loading && latestPackages.length > 0 && (
            <>
              <h1 className="text-2xl font-semibold">Latest Equipment</h1>
              <div className="grid 2xl:grid-cols-5 xlplus:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-2 my-3">
                {latestPackages.map((packageData) => (
                  <PackageCard
                    key={packageData._id}
                    packageData={packageData}
                  />
                ))}
              </div>
            </>
          )}
          {!loading && offerPackages.length > 0 && (
            <>
              <h1 className="text-2xl font-semibold">Available Equipment</h1>
              <div className="grid 2xl:grid-cols-5 xlplus:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-2 my-3">
                {offerPackages.map((packageData) => (
                  <PackageCard
                    key={packageData._id}
                    packageData={packageData}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
