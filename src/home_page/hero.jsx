import axios from "axios";
import { useEffect, useState, useRef } from "react";
import * as d3 from 'd3';

const Hero = () => {

    const [currentStocksInfo, setCurrentStocksInfo] = useState({
        "Meta Data": {
            "1. Information": "Batch Stock Market Quotes",
            "2. Notes": "IEX Real-Time",
            "3. Time Zone": "US/Eastern"
        },
        "Stock Quotes": [
            {
                "1. symbol": "MSFT",
                "2. price": "119.1900",
                "3. volume": "10711735",
                "4. timestamp": "2019-04-09 14:39:53"
            },
            {
                "1. symbol": "AAPL",
                "2. price": "199.9100",
                "3. volume": "27681098",
                "4. timestamp": "2019-04-09 14:39:56"
            },
            {
                "1. symbol": "FB",
                "2. price": "177.1800",
                "3. volume": "14088849",
                "4. timestamp": "2019-04-09 14:39:50"
            }
        ]
    })
    const [previousStocksInfo, setPreviousStocksInfo] = useState({
        "Meta Data": {
            "1. Information": "Batch Stock Market Quotes",
            "2. Notes": "IEX Real-Time",
            "3. Time Zone": "US/Eastern"
        },
        "Stock Quotes": [
            {
                "1. symbol": "MSFT",
                "2. price": "119.1900",
                "3. volume": "10711735",
                "4. timestamp": "2019-04-09 14:39:53"
            },
            {
                "1. symbol": "AAPL",
                "2. price": "199.9100",
                "3. volume": "27681098",
                "4. timestamp": "2019-04-09 14:39:56"
            },
            {
                "1. symbol": "FB",
                "2. price": "177.1800",
                "3. volume": "14088849",
                "4. timestamp": "2019-04-09 14:39:50"
            }
        ]
    })
    const [dimensions, setDimensions] = useState({
        width: 0,
        height: 0,
    });
    const svgContainer = useRef()

    useEffect(() => {

        // Get the current height and width of the elment
        // that will be containinig the svg
        if (svgContainer.current) {
            setDimensions({
                width: svgContainer.current.offsetWidth,
                height: svgContainer.current.offsetHeight,
            });
        }

        // axios.get(`${import.meta.env.VITE_SERVER_BASE_URL}/stocks`).then(console.log).catch(console.error)
        console.log(currentStocksInfo["Stock Quotes"])

    }, []);

    useEffect(() => {
        const { width, height } = dimensions

        // append the svg object to the body of the page
        const svg = d3.select("#svgContainer")
            .append("svg")
            .attr("width", width)
            .attr("height", height)

        // create dummy data -> just one element per circle
        const data = [{ "name": "A" }, { "name": "B" }, { "name": "C" }, { "name": "D" }, { "name": "E" }, { "name": "F" }, { "name": "G" }, { "name": "H" }]

        // Initialize the circle: all located at the center of the svg area
        const node = svg.append("g")
            .selectAll("circle")
            .data(data)
            .join("circle")
            .attr("r", 50)
            .attr("cx", width / 2)
            .attr("cy", height / 2)
            .style("fill", "#19d3a2")
            .style("fill-opacity", 0.3)
            .attr("stroke", "#b3a2c8")
            .style("stroke-width", 4)
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended))


        // Features of the forces applied to the nodes:
        const simulation = d3.forceSimulation()
            .force("charge", d3.forceManyBody().strength(10)) // Weak repulsion
            .force("collide", d3.forceCollide().radius(10).strength(15)) // Ensures no overlap
            .force("x", d3.forceX(width / 2).strength(0.01)) // Keep general movement centered
            .force("y", d3.forceY(height / 2).strength(0.01)) // Keep general movement centered
            .velocityDecay(0.3) // Slows nodes down naturally over time


        /**
            
        */

        // Apply these forces to the nodes and update their positions.
        // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
        simulation
            .nodes(data)
            .on("tick", function (d) {
                node
                    .attr("cx", d => d.x)
                    .attr("cy", d => d.y)
                    .transition() // Add transition effect
                    .duration(1000) // Set duration of transition in milliseconds
                    .ease(d3.easeBounce) // Set easing function

            });


        // What happens when a circle is dragged?
        function dragstarted(event, d) {
            console.log("drag Started")
            if (!event.active) simulation.alphaTarget(0.03).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event, d) {
            console.log("draging ...")

            const damping = 0.01; // Adjust damping factor (lower = smoother)
            d.fx += (event.x - d.fx) * damping;
            d.fy += (event.y - d.fy) * damping;
        }

        function dragended(event, d) {
            console.log("drag Stopped")

            if (!event.active) simulation.alphaTarget(0.02);

            // Instead of stopping, transition to free movement using velocity
            d.vx = (event.x - d.x) * 0.1; // Capture some movement inertia
            d.vy = (event.y - d.y) * 0.1;

            d.fx = null;
            d.fy = null;
        }


    }, [dimensions])

    return (
        <div className="h-[80%]">
            <div ref={svgContainer} className="border w-full h-full" id="svgContainer"></div>
        </div>
    );
}

export default Hero;
