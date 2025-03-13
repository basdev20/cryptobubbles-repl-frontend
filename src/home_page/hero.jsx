import axios from "axios";
import { useEffect, useState, useRef, useContext } from "react";
import * as d3 from 'd3';
import Tabs from "@/components/custom/Tabs";
import SelectedElementsContext from "@/context/selected";

import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog"

import TabsContext from "@/context/tabs";
import Overview from "./tabs/overview";


const Hero = () => {

    const { activeTab, setActiveTab, activeFilterTab, setActiveFilterTab } = useContext(TabsContext);
    const { selectedTicker, setSelectedTicker } = useContext(SelectedElementsContext);
    const [SandP500, setSandP500] = useState([])
    const [allData, setAllData] = useState([])

    const [dimensions, setDimensions] = useState({
        width: 0,
        height: 0,
    });
    const svgContainer = useRef();
    const [openStock, setOpenStock] = useState(false)

    useEffect(() => {
        let w = svgContainer.current.offsetWidth;
        let h = svgContainer.current.offsetHeight

        setSandP500([])

        axios.get(`${import.meta.env.VITE_SERVER_BASE_URL}/all-data`).then((res) => {
            const allData = res.data.all;
            setAllData(allData)

            let currentTrade = allData[activeTab == 0 ? 'sandp' : "ftse"][activeFilterTab == 0 ? 'day' : activeFilterTab == 1 ? 'week' : activeFilterTab == 2 ? 'month' : 'year']

            setSandP500(currentTrade);
            setSandP500(currentTrade.map((trade, index) => (
                { ...trade, id: index, avatar: "/imgs/avatar.png", x: Math.abs(Math.floor(Math.random() * (w - 50))), y: Math.abs(Math.floor(Math.random() * (h - 50))) }
            )));
        }).catch(console.error)





    }, [activeTab, activeFilterTab])

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
        if (SandP500.length) {
            const { width, height } = dimensions;

            d3.select("#svgContainer").selectAll("*").remove();

            const svg = d3.select("#svgContainer")
                .append("svg")
                .attr("width", "100%")
                .attr("height", "100%");

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
                        if (d.percentage == 0) {
                            // Nutral
                            return "rgb(171, 171, 171,0.1)"

                        } else if (d.percentage > 0) {
                            // Green
                            return "rgb(5, 247, 163,0.1)"
                        }
                        // Red
                        return "rgb(255, 10, 10, 0.3)"
                    })

                gradient.append("stop")
                    .attr("offset", "100%")
                    .attr("stop-color", () => {
                        if (d.percentage == 0) {
                            // Nutral
                            return "rgb(171, 171, 171,0.7)"

                        } else if (d.percentage > 0) {
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
                    setSelectedTicker(d.ticker)
                    setOpenStock(d)
                });

            let fake_width = width > 800 ? 800 : width

            node.append("circle")
                .attr("r", d => (fake_width * 0.002) * Math.pow(Math.abs(d.percentage), 0.7) + fake_width * 0.05)
                .attr("id", (d, i) => `bubble-${i}`)
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
                .attr("dy", "15") // Adjust text position below the avatar
                .attr("class", "nunito-font responsive-bubbles")
                .style("fill", "black")
                // .style("font-size", "12px")
                // Make text bold
                .text(d => d.ticker);
            node.append("text")
                .attr("text-anchor", "middle")
                .attr("dy", "25") // Adjust text position below the avatar
                .attr("class", "nunito-font responsive-bubbles")
                .style("fill", "black")
                // .style("font-size", "12px")
                // Make text bold
                .text(d => `${d.percentage}%`);


            const simulation = d3.forceSimulation(SandP500)
                .force("collide", d3.forceCollide()
                    .strength(.5) // Maximize repelling effect
                    .radius(d => {
                        const element = d3.select(`#bubble-${d.id}`);
                        const r = parseFloat(element.attr('r')) || 0;
                        return r; // Ensure at least 5px spacing
                    })
                    .iterations(50) // More iterations to refine positions
                )
                // .force("charge", d3.forceManyBody().strength(10)) // Pushes nodes apart
                .force("BoundaryForce", customBoundaryForce(50, width, height))
                .force("x", d3.forceX(width / 2).strength(0.005))
                .force("y", d3.forceY(height / 2).strength(0.005))

                .on("tick", () => {
                    node.attr("transform", d => `translate(${d.x}, ${d.y})`);
                });

            function customBoundaryForce(x0, width, height) {
                return function () {
                    SandP500.forEach((d) => {
                        const element = d3.select(`#bubble-${d.id}`);
                        // Extract the radius (r) from the SVG element
                        const r = parseFloat(element.attr('r')) || 0;

                        if (!d.x || !d.y || !d.vx || !d.vy) return;

                        // Apply boundary constraints with bounce effect and extra force

                        // Left boundary (considering the radius)
                        if (d.x < x0) {
                            d.x = r  // Adjust so the bubble stays at the left boundary
                            d.vx = Math.max(0, d.vx);  // Prevent further left movement
                            d.vx += 1.5;  // Apply extra force to push right when hitting left boundary
                        } else if (d.x + r > width) { // Right boundary (considering the radius)
                            d.x = width - r;  // Ensure bubble stays within the right boundary
                            d.vx = Math.min(0, d.vx); // Prevent further right movement
                            d.vx += 1.5;  // Apply extra force to push left when hitting right boundary
                        }

                        // Top boundary (considering the radius)
                        if (d.y - r < 0) {
                            d.y = r;  // Ensure bubble stays within the top boundary
                            d.vy = Math.max(0, d.vy);  // Prevent further upward movement
                            d.vy -= 1.5;  // Apply extra force to push down when hitting the top boundary
                        } else if (d.y + r > height) { // Bottom boundary (considering the radius)
                            d.y = height - r;  // Ensure bubble stays within the bottom boundary
                            d.vy = Math.min(0, d.vy);  // Prevent further downward movement
                            d.vy += 1.5;  // Apply extra force to push up when hitting the bottom boundary
                        }
                    });
                };
            }

            function dragstarted(event, d) {
                if (!event.active) simulation.alphaTarget(0.03).restart();
            }
            function dragged(event, d) {
                // Access the SVG element that corresponds to 'd'
                const element = d3.select(`#bubble-${d.id}`);
                if (d.id == 0) console.log(d)
                // Extract the radius (r) from the SVG element
                const r = parseFloat(element.attr('r')) || 0;  // Default to 0 if radius is not found
                // Apply boundary constraints
                const minX = r;  // Left boundary
                const maxX = width - r;  // Right boundary (subtract radius to prevent overflow)
                const minY = r;  // Top boundary
                const maxY = height - r;  // Bottom boundary (subtract radius to prevent overflow)

                // Update the position based on the drag event, but enforce boundaries
                d.fx = Math.max(minX, Math.min(maxX, event.x));
                d.fy = Math.max(minY, Math.min(maxY, event.y));

            }

            function dragended(event, d) {
                if (!event.active) simulation.alphaTarget(0.03);
                d.fx = null;
                d.fy = null;
            }
        }

    }, [SandP500])

    return (
        <div className="h-[90%]">
            <div ref={svgContainer} className="w-full h-full" id="svgContainer"></div>

            <div>
                <Dialog open={openStock} onOpenChange={() => setOpenStock(false)}>
                    <DialogContent className="w-full bg-[#f7f7f7]">
                        {/* Chart Section */}
                        <div>
                            <h2> <span className="font-medium">{selectedTicker}</span> . <span className="font-medium">Apple </span></h2>
                            <p className="text-sm">iPhones & Macs</p>

                        </div>
                        <div>
                            <Tabs tabs={[
                                { id: 0, label: "Overview", content: <Overview /> },
                                { id: 1, label: "Financials", content: <></> },
                                { id: 2, label: "News", content: <></> },
                            ]} />
                        </div>
                        {/*  */}


                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}



export default Hero;
