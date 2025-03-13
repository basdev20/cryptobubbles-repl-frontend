import { useContext, useEffect, useState } from "react";
import Chart from "../popup/chart";
import SelectedElementsContext from "@/context/selected";
import MenuFilter from "../popup/menu-filter";
import axios from "axios"

const Overview = () => {
    const { selectedTicker } = useContext(SelectedElementsContext);
    const [price, setPrice] = useState(0)

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_SERVER_BASE_URL}/ticker-info?ticker=${selectedTicker.ticker}`)
            .then((res) => {
                setPrice(res.data.results[0].price)
            }).catch(console.error)
    }, [])

    return (
        <div>
            <h2 className="text-3xl font-bold">${Math.floor(price)}<span className="text-lg font-bold">{(price % 1).toFixed(2).slice(1)}</span></h2>

            <Chart selectedTicker={selectedTicker} />
            <div className="center">
                <MenuFilter />
            </div>

        </div>
    );
}

export default Overview;
