import Nav from "./home_page/nav";
import Hero from "./home_page/hero";
import TabsContext from "./context/tabs";
import SelectedElementsContext from "./context/selected";
import { useState } from "react";

function App() {

  const [activeTab, setActiveTab] = useState(0);
  const [activeFilterTab, setActiveFilterTab] = useState({ id: 0, name: "day", label: "Day" });
  const [activeChartFilterTab, setActiveChartFilterTab] = useState({ id: 0, name: "hour", label: "1H" });
  const [selectedTicker, setSelectedTicker] = useState(null)

  return (
    <div className="h-screen w-full">
      <TabsContext.Provider value={{ activeTab, setActiveTab, activeFilterTab, setActiveFilterTab, activeChartFilterTab, setActiveChartFilterTab }}>
        <Nav />

        <SelectedElementsContext.Provider value={{selectedTicker, setSelectedTicker}}>
          <Hero />
        </SelectedElementsContext.Provider>
      </TabsContext.Provider>
    </div>
  )
}

export default App
