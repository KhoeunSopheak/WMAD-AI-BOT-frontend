import { useState, useEffect } from "react";
import { LoaderPinwheel } from "lucide-react";
import UserStatsChart from "../compenents/Chart";

export default function DashboardSection() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading)
    return (
      <div className="w-full h-full flex justify-center items-center">
        <div className="flex flex-col items-center">
          <LoaderPinwheel className="animate-spin" />
          <p className="mt-4 font-semibold">Loading, please wait...</p>
        </div>
      </div>
    );

  return (
    <div className="space-y-2 p-6 h-full">
      <UserStatsChart />
    </div>
  );
}
