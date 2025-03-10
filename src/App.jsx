import Nav from "./home_page/nav";
import Hero from "./home_page/hero";
import TabsContext from "./context/tabs";
import { useState } from "react";

function App() {

  const [activeTab, setActiveTab] = useState(0);
  const [activeFilterTab, setActiveFilterTab] = useState({ id: 0, name: "day", label: "Day" });
  const [activeChartFilterTab, setActiveChartFilterTab] = useState({ id: 0, name: "hour", label: "Hour", percentage: "0%" });

  return (
    <div className="h-screen w-full">
      <TabsContext.Provider value={{ activeTab, setActiveTab, activeFilterTab, setActiveFilterTab, activeChartFilterTab, setActiveChartFilterTab }}>
        <Nav />
        <Hero />
      </TabsContext.Provider>
    </div>
  )
}

export default App
