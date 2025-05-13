import React from "react";
import { useNavigate } from "react-router-dom";
import SoHT from "../assets/hotellerie-tourisme.png";
import SoB from "../assets/sob.jpg";
import Film from "../assets/film.png";
import SoM from "../assets/Mécanique Auto (2)-min.png";
import SoC from "../assets/contruction.png";
import WMAD from "../assets/SOB-Digital-9-sur-22.png";




const CategoryCard = ({ icon, title, description, onClick }) => {
    return (
        <div
            onClick={() => onClick(title)}
            className="flex border border-gray-300 rounded-xl overflow-hidden hover:shadow-xl transition-colors cursor-pointer w-full max-w-xl shadow-md"
        >
            <div className="w-52 h-full flex items-center justify-center flex-shrink-0">
                {icon}
            </div>
            <div className="flex flex-col justify-center p-4 flex-1 overflow-hidden ">
                <h3 className="font-medium text-black text-lg truncate">{title}</h3>
                <p className="text-sm text-black line-clamp-2">
                    {description}
                </p>
            </div>
        </div>
    );
};

export default function ServiceCategories() {
    const navigate = useNavigate();

    const vocations = [
        {
            icon: <img src={SoB} alt="soth" className="w-full h-full object-cover" />,
            title: "School of Business (SoB)",
            description: "Management & Accounting, Sales, Human Resources",
            iconColor: "bg-blue-500/10",
        },
        {
            icon: <img src={WMAD} alt="soth" className="w-full h-full object-cover" />,
            title: "Web mobile app development (WMAD)",
            description: "Full-stack development, Mobile app, Designer",
            iconColor: "bg-green-500/10",
        },
        {
            icon: <img src={Film} alt="soth" className="w-full h-full object-cover" />,
            title: "Film School",
            description: "Cinematography, Post-production",
            iconColor: "bg-blue-400/10",
        },
        {
            icon: <img src={SoHT} alt="soth" className="w-full h-full object-cover" />,
            title: "School of Hospitality and tourism (SoHT)",
            description: "Cooking and Pastry, Food & Beverage service, Front office, Housekeeping and Laundry, Hairdressing, Makeup",
            iconColor: "bg-green-400/10",
        },
        {
            icon: <img src={SoM} alt="soth" className="w-full h-full object-cover" />,
            title: "School of Mechanical (SoM)",
            description: "Automotive",
            iconColor: "bg-orange-400/10",
        },
        {
            icon: <img src={SoC} alt="soth" className="w-full h-full object-cover" />,
            title: "School of Contruction (SoC)",
            description: "Building maintenance, Electricity, Plumbing/air conditioning",
            iconColor: "bg-pink-500/10",
        },
    ];



    const handleCategoryClick = async (categoryTitle) => {
        localStorage.setItem("selectedCategory", categoryTitle);
        navigate(`/category/${categoryTitle}`);
    };

    return (
        <div className="p-6 min-h-full flex flex-col items-center justify-center gap-10 bg-white rounded-xl">
            <h1 className="h-10 text-3xl text-black font-bold">Categories Chat</h1>
            <div className="max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                    {vocations.map((category, index) => (
                        <CategoryCard
                            key={index}
                            icon={category.icon}
                            title={category.title}
                            description={category.description}
                            iconColor={category.iconColor}
                            onClick={handleCategoryClick}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
