import { useContext } from "react";
import Chart from "../popup/chart";
import SelectedElementsContext from "@/context/selected";

const Overview = () => {
    const { selectedTicker } = useContext(SelectedElementsContext);

    return (
        <div>
            <h2 className="text-3xl font-bold">$209<span className="text-lg font-bold">.45</span></h2>

            <Chart selectedTicker={selectedTicker} />
        </div>
    );
}

export default Overview;
