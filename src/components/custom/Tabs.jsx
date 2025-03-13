import { useState, useRef, useEffect } from "react";

export default function Tabs({ tabs }) {
    const [activeTab, setActiveTab] = useState(0);
    const [tabWidth, setTabWidth] = useState(0);
    const [tabOffset, setTabOffset] = useState(0);
    const tabsRef = useRef([]);

    useEffect(() => {
        if (tabsRef.current[activeTab]) {
            setTabWidth(tabsRef.current[activeTab].offsetWidth);
            setTabOffset(tabsRef.current[activeTab].offsetLeft);
        }
    }, [activeTab]);

    // Set initial tab width and offset once elements are rendered
    useEffect(() => {
        if (tabsRef.current[0]) {
            setTabWidth(tabsRef.current[0].offsetWidth);
            setTabOffset(tabsRef.current[0].offsetLeft);
        }
    }, []);

    return (
        <>
            {/* Tab Headers */}
            <div className="relative w-fit flex rounded-lg p-1 text-black">
                {/* Background Highlight */}
                <div
                    className="absolute top-0 left-0 h-full bg-white dark:bg-darkPrimary rounded-lg transition-all duration-300"
                    style={{
                        width: `${tabWidth}px`,
                        transform: `translateX(${tabOffset}px)`,
                    }}
                />

                {tabs.map((tab, index) => (
                    <span
                        key={tab.id}
                        ref={(el) => (tabsRef.current[index] = el)}
                        onClick={() => setActiveTab(index)}
                        className={`relative z-10 px-4 py-2 text-center cursor-pointer text-sm font-medium transition-colors duration-300 ${
                            activeTab === index ? "text-black" : "text-gray-500 dark:hover:text-darkPrimary hover:text-primary"
                        }`}
                    >
                        {tab.label}
                    </span>
                ))}
            </div>

            {/* Tab Content */}
            <div className="p-4">
                {tabs.map((tab, index) => (
                    <div key={tab.id} className={activeTab === index ? "block" : "hidden"}>
                        {tab.content}
                    </div>
                ))}
            </div>
        </>
    );
};
