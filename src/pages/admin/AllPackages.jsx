import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  Tractor, 
  Wheat, 
  Layers, 
  ArrowDownWideNarrow, 
  Search, 
  PackageOpen, 
  Edit, 
  Trash2 
} from 'lucide-react';

const AllPackages = () => {
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
        filter === "offer" 
          ? `/api/package/get-packages?searchTerm=${search}&offer=true`
          : filter === "latest"
          ? `/api/package/get-packages?searchTerm=${search}&sort=createdAt`
          : filter === "top"
          ? `/api/package/get-packages?searchTerm=${search}&sort=packageRating`
          : `/api/package/get-packages?searchTerm=${search}`;
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

  const onShowMoreSClick = async () => {
    const numberOfPackages = packages.length;
    const startIndex = numberOfPackages;
    let url =
      filter === "offer"
        ? `/api/package/get-packages?searchTerm=${search}&offer=true&startIndex=${startIndex}`
        : filter === "latest"
        ? `/api/package/get-packages?searchTerm=${search}&sort=createdAt&startIndex=${startIndex}`
        : filter === "top"
        ? `/api/package/get-packages?searchTerm=${search}&sort=packageRating&startIndex=${startIndex}`
        : `/api/package/get-packages?searchTerm=${search}&startIndex=${startIndex}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data?.packages?.length < 9) {
      setShowMoreBtn(false);
    }
    setPackages([...packages, ...data?.packages]);
  };

  useEffect(() => {
    getPackages();
  }, [filter, search]);

  const handleDelete = async (packageId) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/package/delete-package/${packageId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      alert(data?.message);
      getPackages();
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-[#F4F9F4] min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-['Roboto']">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border border-green-100">
        {/* Agricultural Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Tractor className="w-10 h-10 stroke-white" />
              <h1 className="text-3xl font-bold">Agricultural Package Management</h1>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="p-6 bg-green-50 border-b border-green-100">
          <div className="flex justify-between items-center space-x-4">
            {/* Search Input */}
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search agricultural packages..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500" />
            </div>

            {/* Filter Buttons */}
            <div className="flex space-x-2">
              {[
                { id: "all", icon: PackageOpen, label: "All Packages" },
                { id: "offer", icon: Wheat, label: "Offers" },
                { id: "latest", icon: ArrowDownWideNarrow, label: "Latest" },
                { id: "top", icon: Layers, label: "Top Rated" }
              ].map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setFilter(id)}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                    filter === id
                      ? "bg-green-600 text-white"
                      : "bg-white text-green-700 border border-green-300 hover:bg-green-50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="text-center py-4 bg-green-50">
            <p className="text-green-600 animate-pulse">Harvesting packages...</p>
          </div>
        )}

        {/* Packages Grid */}
        <div className="p-6 bg-green-50">
          {packages.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pack) => (
                <div 
                  key={pack._id} 
                  className="bg-white border border-green-200 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                >
                  {/* Package Image */}
                  <div className="relative">
                    {pack?.packageImages && pack.packageImages[0] ? (
                      <img
                        src={pack.packageImages[0]}
                        alt={pack.packageName}
                        className="w-full h-48 object-cover rounded-t-xl"
                      />
                    ) : (
                      <div className="w-full h-48 bg-green-50 flex items-center justify-center rounded-t-xl">
                        <Wheat className="w-12 h-12 text-green-400" />
                      </div>
                    )}
                  </div>

                  {/* Package Details */}
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <Link to={`/package/${pack._id}`} className="flex-grow">
                        <h2 className="text-lg font-semibold text-green-800 hover:text-green-600 transition-colors">
                          {pack.packageName}
                        </h2>
                      </Link>

                      {/* Action Buttons */}
                      <div className="flex space-x-2 ml-4">
                        <Link to={`/profile/admin/update-package/${pack._id}`}>
                          <button 
                            disabled={loading}
                            className="text-green-600 hover:bg-green-100 p-2 rounded-full transition-colors"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                        </Link>
                        <button
                          disabled={loading}
                          onClick={() => handleDelete(pack._id)}
                          className="text-red-600 hover:bg-red-100 p-2 rounded-full transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-green-50">
              <p className="text-xl text-green-700">No agricultural packages found</p>
            </div>
          )}
        </div>

        {/* Load More Button */}
        {showMoreBtn && (
          <div className="text-center p-6 bg-green-50">
            <button
              onClick={onShowMoreSClick}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 mx-auto"
            >
              <Wheat className="w-5 h-5" />
              <span>Load More Packages</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllPackages;