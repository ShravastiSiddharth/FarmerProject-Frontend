// frontend/src/components/PackageCard.jsx
import { Link } from "react-router-dom";

const PackageCard = ({ packageData }) => {
  return (
    <Link to={`/package/${packageData._id}`} className="w-full">
      <div className="w-full bg-white border flex flex-col items-center p-3 rounded shadow-md overflow-hidden">
        <img
          className="w-full h-[220px] rounded border hover:scale-110 transition-all duration-300"
          src={packageData.equipmentImages[0]} // Base64 URL from backend
          alt={`${packageData.equipmentName} Image`}
        />
        <div className="w-full flex flex-col my-2">
          <p className="font-semibold text-lg capitalize w-[90%] xsm:w-[250px] truncate">
            {packageData.equipmentName}
          </p>
          <p className="text-green-700 text-lg capitalize">
            {packageData.location}
          </p>
          <p className="text-lg">Condition: {packageData.condition}</p>
          <div className="flex flex-wrap justify-between">
            <p className="font-medium text-green-700">
              ₹{packageData.dailyRentPrice}/day
            </p>
            {packageData.isAvailable ? (
              <span className="text-green-600 font-medium">Available</span>
            ) : (
              <span className="text-red-600 font-medium">Unavailable</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PackageCard;
