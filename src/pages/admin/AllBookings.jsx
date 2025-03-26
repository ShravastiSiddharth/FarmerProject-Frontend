import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Wheat, Tractor, ScanSearch, Leaf, Calendar, Trash2 } from 'lucide-react';

const AllBookings = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [currentBookings, setCurrentBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const getAllBookings = async () => {
    setCurrentBookings([]);
    try {
      setLoading(true);
      const res = await fetch(
        `/api/booking/get-currentBookings/${currentUser._id}?searchTerm=${searchTerm}`
      );
      const data = await res.json();
      console.log("GET ALL BOOKINGS: ", data);
      if (data?.success) {
        setCurrentBookings(data?.bookings);
        setLoading(false);
        setError(false);
      } else {
        setLoading(false);
        setError(data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllBookings();
  }, [searchTerm]);

  const handleCancel = async (id) => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/booking/cancel-booking/${id}/${currentUser._id}`,
        {
          method: "POST",
        }
      );
      const data = await res.json();
      if (data?.success) {
        setLoading(false);
        alert(data?.message);
        getAllBookings();
      } else {
        setLoading(false);
        alert(data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-green-700/10">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Wheat className="text-white w-10 h-10" />
            <h1 className="text-3xl font-bold text-white">Agricultural Bookings</h1>
          </div>
          <Tractor className="text-white w-12 h-12 opacity-70" />

    <div className="w-full flex justify-center">
      <div className="w-[95%] shadow-xl rounded-lg p-3 px-1 flex flex-col gap-2">
        {loading && <h1 className="text-center text-2xl">Loading...</h1>}
        {error && <h1 className="text-center text-2xl">{error}</h1>}
        <div className="w-full border-b-4 p-3">
          <input
            className="border rounded-lg p-2 mb-2"
            type="text"
            placeholder="Search Username or Email"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />

        </div>

        {/* Search Section */}
        <div className="p-6 bg-green-50 border-b border-green-100">
          <div className="relative">
            <ScanSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500" />
            <input
              className="w-full pl-12 pr-4 py-3 border border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-gray-700"
              type="text"
              placeholder="Search bookings by username or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-8 bg-red-50">
            <p className="text-2xl text-red-600">{error}</p>
          </div>
        )}

        {/* Bookings List */}
        {!loading && currentBookings && currentBookings.length > 0 ? (
          <div>
            {currentBookings.map((booking, i) => (
              <div 
                key={i} 
                className="p-6 border-b last:border-b-0 hover:bg-green-50 transition-colors duration-200 group"
              >

                <div className="flex items-center justify-between">
                  {/* Package Details */}
                  <div className="flex items-center space-x-6">
                    <Link to={`/package/${booking?.packageDetails?._id}`}>
                      <img
                        className="w-24 h-24 rounded-xl object-cover shadow-lg border-4 border-green-100 group-hover:scale-105 transition-transform"
                        src={booking?.packageDetails?.packageImages[0]}
                        alt="Package"
                      />
                    </Link>
                    <div>
                      <Link 
                        to={`/package/${booking?.packageDetails?._id}`} 
                        className="text-xl font-semibold text-green-800 hover:text-green-900 transition-colors"
                      >
                        {booking?.packageDetails?.packageName}
                      </Link>
                      <div className="flex items-center space-x-2 text-green-700 mt-2">
                        <Calendar className="w-5 h-5" />
                        <span className="text-gray-600">{booking?.date}</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Leaf className="w-5 h-5 text-green-500" />
                        <span className="text-gray-600">
                          {booking?.packageDetails?.userId.username}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="hidden md:block text-gray-700 space-y-1">
                    <p className="font-medium">{booking?.packageDetails?.userId.username}</p>
                    <p className="text-sm text-gray-600">{booking?.packageDetails?.userId.email}</p>
                    <p className="text-sm text-gray-600">{booking?.packageDetails?.userId.phone}</p>
                  </div>

                  {/* Cancel Button */}
                  <button
                    onClick={() => handleCancel(booking._id)}
                    className="bg-red-500 text-white px-5 py-2.5 rounded-lg hover:bg-red-600 transition-colors duration-300 flex items-center space-x-2 group"
                  >
                    <Trash2 className="w-5 h-5 group-hover:animate-bounce" />
                    <span>Cancel</span>
                  </button>
                </div>

                <Link to={`/package/${booking?.packageDetails?._id}`}>
                  <img
                    className="w-12 h-12"
                    src={booking?.packageDetails?.equipmentImages[0]}
                    alt="Equipment Image"
                  />
                </Link>
                <Link to={`/package/${booking?.packageDetails?._id}`}>
                  <p className="hover:underline">
                    {booking?.packageDetails?.equipmentName}{" "}
                  </p>
                </Link>
                <p>{booking?.packageDetails?.userId.username}</p>
                <p>{booking?.packageDetails?.userId.email}</p>
                <p>{booking?.packageDetails?.userId.phone}</p>
                <p>{booking?.date}</p>
                <button
                  onClick={() => {
                    handleCancel(booking._id);
                  }}
                  className="p-2 rounded bg-red-600 text-white hover:opacity-95"
                >
                  Cancel
                </button>

              </div>
            ))}
          </div>
        ) : (
          !loading && (
            <div className="text-center py-12 bg-green-50">
              <Wheat className="mx-auto w-16 h-16 text-green-600 mb-4" />
              <p className="text-xl text-gray-700">No bookings found</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default AllBookings;