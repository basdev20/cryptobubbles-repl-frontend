import axios from "axios";
import { useEffect, useState, useRef, use } from "react";
import * as d3 from 'd3';
import forceBoundary from "d3-force-boundary"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import Chart from "./chart";
import SmallRadioSelector from "./menu-filter";
import MatrixDisplay from "./matrix-displayer";
import { useContext } from "react";
import TabsContext from "@/context/tabs";


function calculateTradePercentage(trades) {
    if (trades.length < 2) {
        throw new Error("At least two trades are required to calculate profit/loss.");
    }

    // Get the first and last trade prices
    let firstTradePrice = trades[trades.length - 1].price;
    let lastTradePrice = trades[0].price;

    // Calculate percentage change
    let percentageChange = ((lastTradePrice - firstTradePrice) / firstTradePrice) * 100;

    return percentageChange.toFixed(2);
}

const Hero = () => {

    const { activeTab, setActiveTab, activeFilterTab, setActiveFilterTab } = useContext(TabsContext);
    const [SandP500, setSandP500] = useState([])
    const [dimensions, setDimensions] = useState({
        width: 0,
        height: 0,
    });
    const svgContainer = useRef();
    const [openStock, setOpenStock] = useState(false)
    const r = 70;

    useEffect(() => {
        let w = svgContainer.current.offsetWidth;
        let h = svgContainer.current.offsetHeight

        setSandP500([])
        console.log(activeFilterTab)
        const eventSource = new EventSource(`${import.meta.env.VITE_SERVER_BASE_URL}/${activeTab === 0 ? "sandp" : "ftse" 
            }?timestamp=${activeFilterTab.filter}&range_type=${activeFilterTab.label}`);

        eventSource.onmessage = (event) => {
            console.log("Received data:", event.data);  // Debugging line

            try {
                const newTrade = JSON.parse(event.data);
                console.log("New trade received:", newTrade);
                // let trades = newTrade.trades;

                setSandP500((prev) => [
                    ...prev,
                    {
                        ...newTrade,
                        avatar: "/imgs/avatar.png",
                        x: Math.abs(Math.floor(Math.random() * (w - 50))),
                        y: Math.abs(Math.floor(Math.random() * (h - 50))),
                        // result: Math.floor(Math.random() * 101) - 50, // Random number between -50 and 50
                        // colorAndSize_state: Math.random() < 0.5 // Random true/false
                    }
                ]);
            } catch (err) {
                console.error("Error parsing SSE data:", err);
            }
        };

        eventSource.onerror = (error) => {
            console.error("SSE Error:", error);
            eventSource.close();
        };

        return () => {
            eventSource.close(); // Cleanup the event source when the component unmounts
        };
    }, [activeTab])

    useEffect(() => {

        // Get the current height and width of the elment
        // that will be containinig the svg
        if (svgContainer.current) {
            setDimensions({
                width: svgContainer.current.offsetWidth,
                height: svgContainer.current.offsetHeight,
                colorAndSize_state: true,
                result: -23
            });
        }

    }, []);



    useEffect(() => {
        const { width, height } = dimensions;

        d3.select("#svgContainer").selectAll("*").remove();
        const svg = d3.select("#svgContainer")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        // Create dummy data -> just one element per circle


        // Filter
        // Define radial gradient for a bubble-like effect
        const defs = svg.append("defs");

        SandP500.forEach((d, i) => {
            // the Gradient Circle
            const gradient = defs.append("radialGradient")
                .attr("id", `bubbleGradient-${i}`)
                .attr("cx", "50%")
                .attr("cy", "50%")
                .attr("r", "50%");

            // The margin of the white color in the gradient
            gradient.append("stop")
                .attr("offset", "85%")
                .attr("stop-color", () => {
                    if (calculateTradePercentage(d.trade.results) == 0) {
                        // Nutral
                        return "rgb(171, 171, 171,0.1)"

                    } else if (calculateTradePercentage(d.trade.results) > 0) {
                        // Green
                        return "rgb(5, 247, 163,0.1)"
                    }
                    // Red
                    return "rgb(255, 10, 10, 0.3)"
                })

            gradient.append("stop")
                .attr("offset", "100%")
                .attr("stop-color", () => {
                    if (calculateTradePercentage(d.trade.results) == 0) {
                        // Nutral
                        return "rgb(171, 171, 171,0.7)"

                    } else if (calculateTradePercentage(d.trade.results) > 0) {
                        // Green
                        return "rgb(5, 247, 163,0.7)"
                    }
                    // Red
                    return "rgb(255, 10, 10,0.7)"
                })

            // gradient.append("stop")
            //     .attr("offset", "100%")
            //     .attr("stop-color", "rgba(25, 211, 162, 0.3)");
        });

        const filter = defs.append("filter")
            .attr("id", "bubbleBlur");


        filter.append("feGaussianBlur")
            .attr("stdDeviation", 0.5);

        const node = svg.append("g")
            .selectAll("g")
            .data(SandP500)
            .enter()
            .append("g")
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended)
            )
            .on("click", function (event, d) {
                console.log("Node clicked:", d);
                setOpenStock(d)
            });

        node.append("circle")
            .attr("r", d => 20 * Math.sqrt(Math.abs(calculateTradePercentage(d.trade.results))) + 40)
            .style("fill", (d, i) => `url(#bubbleGradient-${i})`)
            .attr("filter", "url(#bubbleBlur)")
            .attr("stroke", "rgba(255, 255, 255, 0.8)")
            .style("stroke-width", 2)
            .style("opacity", 0.8);

        // Append avatar image above the text
        node.append("image")
            .attr("xlink:href", d => d.avatar) // Assuming 'avatar' contains the image URL
            .attr("width", 30)
            .attr("height", 30)
            .attr("x", -15) // Center the image
            .attr("y", -30); // Position above text with 15px margin

        node.append("text")
            .attr("text-anchor", "middle")
            .attr("dy", "20") // Adjust text position below the avatar
            .attr("class", "nunito-font")
            .style("fill", "black")
            // .style("font-size", "12px")
            .style("font-size", "14px") // Control font size
            // Make text bold
            .text(d => d.ticker);
        node.append("text")
            .attr("text-anchor", "middle")
            .attr("dy", "30") // Adjust text position below the avatar
            .attr("class", "nunito-font")
            .style("fill", "black")
            // .style("font-size", "12px")
            .style("font-size", "10px") // Control font size
            // Make text bold
            .text(d => `${calculateTradePercentage(d.trade.results)}%`);

        const simulation = d3.forceSimulation(SandP500)
            // .force("center", d3.forceCenter(width / 2, height / 2))
            // .force("boundary", forceBoundary(50, 50, width + (r * 2), height + 30).strength(0.001))
            .force("collide", d3.forceCollide().strength(0.1).radius(50))
            // .force("charge", d3.forceManyBody().strength(1))
            .on("tick", () => {
                node.attr("transform", d => `translate(${d.x}, ${d.y})`);
            });

        function dragstarted(event, d) {
            if (!event.active) simulation.alphaTarget(0.03).restart();
        }

        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(0.03);
            d.fx = null;
            d.fy = null;
        }

    }, [SandP500])

    return (
        <div className="h-[90%]">
            <div ref={svgContainer} className="w-full h-full" id="svgContainer"></div>


            <div>
                <Drawer open={openStock} onClose={() => setOpenStock(false)}>
                    {/* <DrawerTrigger asChild>
                        <button variant="outline">Open Stats</button>
                    </DrawerTrigger> */}
                    <DrawerContent>
                        <div className="w-full">
                            {/* <DrawerHeader>
                                <DrawerTitle>Stock Stats</DrawerTitle>
                                <DrawerDescription>All diffrente matix are available ...</DrawerDescription>
                            </DrawerHeader> */}
                            <div className="px-3 flex flex-col lg:flex-row items-center justify-center gap-4">
                                {/* Chart Section */}
                                <div className="w-full lg:w-1/2">
                                    <Chart />
                                </div>

                                {/* Matrix and Selector Section */}
                                <div className="w-full lg:w-1/2 h-full px-2 flex flex-col gap-4">
                                    <MatrixDisplay />
                                    <SmallRadioSelector />
                                </div>
                            </div>

                            {/* <DrawerFooter>
                                <DrawerClose asChild>
                                    <button variant="outline">Cancel</button>
                                </DrawerClose>
                            </DrawerFooter> */}
                        </div>
                    </DrawerContent>
                </Drawer>
            </div>
        </div>
    );
}

export default Hero;
