import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Wheat, Star, ScanSearch } from 'lucide-react';

const RatingsReviews = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showMoreBtn, setShowMoreBtn] = useState(false);

  const getPackages = async () => {
    setPackages([]);
    try {
      setLoading(true);
      let url =
        filter === "most" //most rated
          ? `/api/package/get-packages?searchTerm=${search}&sort=packageTotalRatings`
          : `/api/package/get-packages?searchTerm=${search}&sort=packageRating`; //all
      const res = await fetch(url);
      const data = await res.json();
      if (data?.success) {
        setPackages(data?.packages);
        setLoading(false);
      } else {
        setLoading(false);
        alert(data?.message || "Something went wrong!");
      }
      if (data?.packages?.length > 8) {
        setShowMoreBtn(true);
      } else {
        setShowMoreBtn(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPackages();
  }, [filter, search]);

  const onShowMoreSClick = async () => {
    const numberOfPackages = packages.length;
    const startIndex = numberOfPackages;
    let url =
      filter === "most" //most rated
        ? `/api/package/get-packages?searchTerm=${search}&sort=packageTotalRatings&startIndex=${startIndex}`
        : `/api/package/get-packages?searchTerm=${search}&sort=packageRating&startIndex=${startIndex}`; //all
    const res = await fetch(url);
    const data = await res.json();
    if (data?.packages?.length < 9) {
      setShowMoreBtn(false);
    }
    setPackages([...packages, ...data?.packages]);
  };

  const renderStarRating = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, index) => (
          <Star 
            key={index} 
            className={`w-5 h-5 ${
              index < Math.floor(rating) 
                ? 'text-yellow-500 fill-current' 
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-gray-600">({rating.toFixed(1)})</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-green-700/10">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Wheat className="text-white w-10 h-10" />
            <h1 className="text-3xl font-bold text-white">Agricultural Ratings & Reviews</h1>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="p-6 bg-green-50 border-b border-green-100">
          <div className="relative mb-4">
            <ScanSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500" />
            <input
              className="w-full pl-12 pr-4 py-3 border border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-gray-700"
              type="text"
              placeholder="Search packages"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filter Options */}
          <div className="flex justify-center space-x-4">
            <button
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                filter === "all" 
                  ? "bg-green-600 text-white" 
                  : "bg-green-100 text-green-700 hover:bg-green-200"
              }`}
              onClick={() => setFilter("all")}
            >
              All Packages
            </button>
            <button
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                filter === "most" 
                  ? "bg-green-600 text-white" 
                  : "bg-green-100 text-green-700 hover:bg-green-200"
              }`}
              onClick={() => setFilter("most")}
            >
              Most Rated
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-600"></div>
          </div>
        )}

        {/* Packages List */}
        <div className="p-6">
          {packages && packages.length > 0 ? (
            packages.map((pack, i) => (
              <div
                key={i}
                className="border-b last:border-b-0 p-4 flex items-center justify-between hover:bg-green-50 transition-colors duration-200"
              >
                <Link to={`/package/ratings/${pack._id}`} className="flex items-center space-x-4">
                  <img
                    src={pack?.packageImages[0]}
                    alt="Package"
                    className="w-24 h-24 rounded-xl object-cover shadow-lg border-4 border-green-100"
                  />
                  <div>
                    <p className="text-xl font-semibold text-green-800 hover:text-green-900">
                      {pack?.packageName}
                    </p>
                  </div>
                </Link>

                <div className="flex items-center space-x-2">
                  {renderStarRating(pack?.packageRating)}
                  <span className="text-gray-500">
                    ({pack?.packageTotalRatings} reviews)
                  </span>
                </div>
              </div>
            ))
          ) : (
            !loading && (
              <div className="text-center py-12 bg-green-50">
                <Wheat className="mx-auto w-16 h-16 text-green-600 mb-4" />
                <p className="text-xl text-gray-700">No Ratings Available!</p>
              </div>
            )
          )}

          {/* Show More Button */}
          {showMoreBtn && (
            <div className="text-center mt-6">
              <button
                onClick={onShowMoreSClick}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors duration-300"
              >
                Show More Packages
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RatingsReviews;