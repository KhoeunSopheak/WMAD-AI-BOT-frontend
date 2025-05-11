import React from "react";
import {
    Calculator,
    Languages,
    Brain,
    FlaskConical,
    PencilRuler,
    BookOpen
} from "lucide-react";
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
            className="flex border border-gray-300 rounded-xl overflow-hidden hover:bg-blue-100 transition-colors cursor-pointer w-full max-w-xl"
        >
            <div className="w-52 h-full flex items-center justify-center flex-shrink-0">
                {icon}
            </div>
            <div className="flex flex-col justify-center p-4 flex-1 overflow-hidden">
                <h3 className="font-medium text-[#1F72A6] text-lg truncate">{title}</h3>
                <p className="text-sm text-[#1F72A6] line-clamp-2">
                    {description}
                </p>
            </div>
        </div>
    );
};

export default function ServiceCategories() {
    const navigate = useNavigate();
    const educations = [
        {
            icon: <Calculator className="h-5 w-5 text-blue-500" />,
            title: "Mathematics",
            description: "Explore numbers, equations, and problem-solving skills.",
            iconColor: "bg-blue-500/10",
        },
        {
            icon: <Languages className="h-5 w-5 text-green-500" />,
            title: "Khmer",
            description: "Learn the Khmer language, literature, and writing.",
            iconColor: "bg-green-500/10",
        },
        {
            icon: <Brain className="h-5 w-5 text-blue-400" />,
            title: "Physics",
            description: "Understand motion, forces, energy, and the universe.",
            iconColor: "bg-blue-400/10",
        },
        {
            icon: <FlaskConical className="h-5 w-5 text-green-400" />,
            title: "Chemistry",
            description: "Study atoms, reactions, and the properties of matter.",
            iconColor: "bg-green-400/10",
        },
        {
            icon: <PencilRuler className="h-5 w-5 text-orange-400" />,
            title: "Art",
            description: "Express creativity through drawing, painting, and design.",
            iconColor: "bg-orange-400/10",
        },
        {
            icon: <BookOpen className="h-5 w-5 text-pink-500" />,
            title: "English",
            description: "Improve grammar, vocabulary, speaking, and writing skills.",
            iconColor: "bg-pink-500/10",
        },
    ];

    const vocations = [
        {
            icon: <img src={SoB} alt="soth" className="w-full h-full object-cover"/>,
            title: "School of Business (SoB)",
            description: "Management & Accounting, Sales, Human Resources",
            iconColor: "bg-blue-500/10",
        },
        {
            icon: <img src={WMAD} alt="soth" className="w-full h-full object-cover"/>,
            title: "Web mobile app development (WMAD)",
            description: "Full-stack development, Mobile app, Designer",
            iconColor: "bg-green-500/10",
        },
        {
            icon: <img src={Film} alt="soth" className="w-full h-full object-cover"/>,
            title: "Film School",
            description: "Cinematography, Post-production",
            iconColor: "bg-blue-400/10",
        },
        {
            icon: <img src={SoHT} alt="soth" className="w-full h-full object-cover"/>,
            title: "School of Hospitality and tourism (SoHT)",
            description: "Cooking and Pastry, Food & Beverage service, Front office, Housekeeping and Laundry, Hairdressing, Makeup",
            iconColor: "bg-green-400/10",
        },
        {
            icon: <img src={SoM} alt="soth" className="w-full h-full object-cover"/>,
            title: "School of Mechanical (SoM)",
            description: "Automotive",
            iconColor: "bg-orange-400/10",
        },
        {
            icon: <img src={SoC} alt="soth" className="w-full h-full object-cover"/>,
            title: "School of Contruction (SoC)",
            description: "Building maintenance, Electricity, Plumbing/air conditioning",
            iconColor: "bg-pink-500/10",
        },  
    ];



    const handleCategoryClick = async (categoryTitle) => {
        localStorage.setItem("selectedCategory", categoryTitle);
        navigate("/");
        // try {
        //     const response = await fetch("https://your-api-endpoint.com/categories", {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json",
        //         },
        //         body: JSON.stringify({ category: categoryTitle }),
        //     });

        //     if (!response.ok) {
        //         throw new Error("Failed to submit category");
        //     }

        //     const result = await response.json();
        //     console.log("Submitted successfully:", result);
        //     alert(`Submitted: ${categoryTitle}`);
        // } catch (error) {
        //     console.error("Error submitting category:", error);
        //     alert("Failed to submit category.");
        // }
    };

    return (
        <div className="p-6 min-h-screen flex flex-col items-center justify-center gap-10 bg-white rounded-xl">
            <h1 className="h-10 text-3xl text-[#1F72A6] font-bold">Categories</h1>
            <div className="max-w-4xl w-full">
                <div className="h-10 text-2xl text-[#1F72A6] font-bold">
                    <h1>Education</h1>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                    {educations.map((category, index) => (
                        <CategoryCard
                            key={index}
                            icon={category.icon}
                            title={category.title}
                            description={category.description}
                            count={category.count}
                            iconColor={category.iconColor}
                            onClick={handleCategoryClick}
                        />
                    ))}
                </div>
            </div>

            <div className="max-w-4xl w-full">
                <div className="h-10 text-2xl text-[#1F72A6] font-bold">
                    <h1>Vocational</h1>
                </div>
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
