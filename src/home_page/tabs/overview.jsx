import { useContext } from "react";
import Chart from "../popup/chart";
import SelectedElementsContext from "@/context/selected";

const Overview = () => {
    const { selectedTicker } = useContext(SelectedElementsContext);

    return (
        <div>
            <Chart selectedTicker={selectedTicker} />
        </div>
    );
}

export default Overview;
