import Nav from "./home_page/nav";
import Hero from "./home_page/hero";
import TabsContext from "./context/tabs";
import { useState } from "react";

function App() {

  const [activeTab, setActiveTab] = useState(0);
  const [activeFilterTab, setActiveFilterTab] = useState({ id: 0, filter: new Date().toISOString().split('T')[0], label: "Day" });

  return (
    <div className="h-screen w-full">
      <TabsContext.Provider value={{ activeTab, setActiveTab, activeFilterTab, setActiveFilterTab }}>
        <Nav />
        <Hero />
      </TabsContext.Provider>
    </div>
  )
}

export default App
