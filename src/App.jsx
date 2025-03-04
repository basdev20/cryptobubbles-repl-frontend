import Nav from "./home_page/nav";
import Hero from "./home_page/hero";
import TabsContext from "./context/tabs";
import { useState } from "react";

function App() {

  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="h-screen w-full">
      <TabsContext.Provider value={{ activeTab, setActiveTab }}>
        <Nav />
        <Hero />
      </TabsContext.Provider>
    </div>
  )
}

export default App
