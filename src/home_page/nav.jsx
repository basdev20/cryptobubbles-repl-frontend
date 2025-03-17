import { useContext, useEffect, useState } from "react";
import TabsContext from "@/context/tabs";
import { FloatingTimeSelect } from "@/components/floating-time-select";
import { Progress } from "@/components/ui/progress"
import Logo from "@/assets/logo.png";

const Nav = () => {
    const { activeTab, setActiveTab, activeFilterTab, setActiveFilterTab, refresh, setRefresh } = useContext(TabsContext);
    const [progress, setProgress] = useState(0);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleFilterTabClick = (tab) => {
        setActiveFilterTab(tab);
    };
    const duration = 60000; // 1 minute in milliseconds
    const intervalTime = 50; // Update every 50ms

    useEffect(() => {
        let startTime = Date.now();
        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const newProgress = (elapsed / duration) * 100; // 100% progress

            if (newProgress >= 100) {
                // Run your code after reaching 100%
                console
                setRefresh((prevRefresh) => prevRefresh + 1); // Force re-render
                setProgress(0); // Reset progress
                startTime = Date.now(); // Reset start time to start the next cycle
            } else {
                setProgress(newProgress); // Update progress
            }
        }, intervalTime);

        // Clean up interval on component unmount
        return () => clearInterval(interval);
    }, [refresh]); 


    return (
        <div className="w-full relative">
            <nav className="max-w-screen-2xl shadow-sm text-white bg-white">
                <div className="px-4 py-2 mx-auto  lg:px-8">
                    <div className="container flex flex-wrap items-center justify-between mx-auto text-slate-800">
                        <a href="#" className="nunito-font mr-4 block cursor-pointer py-1.5 text-base text-slate-800 font-semibold center gap-2">
                            <img src={Logo} alt="" className="size-10" />
                            Stock Bubbles
                        </a>
                        <div className="hidden lg:block">
                            <ul className="flex flex-col gap-2 mt-2 mb-4 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
                                <li className="flex items-center p-1 text-sm gap-x-2 text-slate-600">
                                    {/* <a href="#" className="flex items-center">
                                    Placeholder
                                </a> */}
                                </li>
                            </ul>
                        </div>
                        <button className="relative ml-auto h-6 max-h-[40px] w-6 max-w-[40px] select-none rounded-lg text-center align-middle text-xs font-medium uppercase text-inherit transition-all hover:bg-transparent focus:bg-transparent active:bg-transparent disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none lg:hidden" type="button">
                            <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </span>
                        </button>
                    </div>
                </div>
                <div className="w-full">
                    <Progress value={progress} className="h-0.5 mt-0.5" />
                </div>
            </nav>
            <div className="tabs absolute right-1/2 transform translate-x-1/2 ">
                <div className="flex">
                    <ul className="flex border bg-white border-gray-200 rounded-xl rounded-t-none transition-all duration-300 -mb-px overflow-hidden">
                        {[
                            { id: 0, label: "S&P" },
                            { id: 1, label: "FTSE" },
                            // { id: 2, label: "SEE" }
                        ].map((tab) => (
                            <li key={tab.id}>
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleTabClick(tab.id);
                                    }}
                                    className={`inline-block py-3 px-6 text-gray-500 hover:text-gray-800 font-medium border-r border-gray-200 whitespace-nowrap transition-all duration-300 ${activeTab === tab.id
                                        ? "bg-indigo-50 text-blue-600"
                                        : ""
                                        }`}
                                    data-tab={tab.id}
                                    role="tab"
                                >
                                    {tab.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="tabs absolute left-4 lg:block hidden">
                <div className="flex">
                    <ul className="flex border bg-white border-gray-200 rounded-xl rounded-t-none transition-all duration-300 -mb-px overflow-hidden">
                        {[
                            { id: 0, label: "Day", name: "minute" },
                            { id: 1, label: "Week", name: "day" },
                            { id: 2, label: "Month", name: "week" },
                            { id: 3, label: "Year", name: "month" }
                        ].map((tab) => (
                            <li key={tab.id}>
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleFilterTabClick({ name: tab.name, label: tab.label, id: tab.id });
                                    }}
                                    className={`inline-block py-3 px-6 text-gray-500 hover:text-gray-800 font-medium border-r border-gray-200 whitespace-nowrap transition-all duration-300 ${activeFilterTab.id === tab.id ? "bg-indigo-50 text-blue-600" : ""
                                        }`}
                                    data-tab={tab.id}
                                    role="tab"
                                >
                                    {tab.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* hidden */}
            {/* component */}
            <div className="lg:hidden block">
                <FloatingTimeSelect />
            </div>

        </div>
    );
}

export default Nav;
