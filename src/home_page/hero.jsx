import axios from "axios";
import { useEffect, useState, useRef } from "react";
import * as d3 from 'd3';
import forceBoundary from "d3-force-boundary"
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
        const r = 70


        const svg = d3.select("#svgContainer")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        // Create dummy data -> just one element per circle
        console.log(Math.abs(Math.floor(Math.random() * (width - (r * 2)))))
        const data = [
            { name: "A", x: Math.abs(Math.floor(Math.random() * (height - (r * 2)))), y: Math.abs(Math.floor(Math.random() * (width - (r * 2)))) },
            { name: "A", x: Math.abs(Math.floor(Math.random() * (height - (r * 2)))), y: Math.abs(Math.floor(Math.random() * (width - (r * 2)))) },
            { name: "A", x: Math.abs(Math.floor(Math.random() * (height - (r * 2)))), y: Math.abs(Math.floor(Math.random() * (width - (r * 2)))) },
            { name: "A", x: Math.abs(Math.floor(Math.random() * (height - (r * 2)))), y: Math.abs(Math.floor(Math.random() * (width - (r * 2)))) },
            { name: "A", x: Math.abs(Math.floor(Math.random() * (height - (r * 2)))), y: Math.abs(Math.floor(Math.random() * (width - (r * 2)))) },
            { name: "A", x: Math.abs(Math.floor(Math.random() * (height - (r * 2)))), y: Math.abs(Math.floor(Math.random() * (width - (r * 2)))) },
            { name: "A", x: Math.abs(Math.floor(Math.random() * (height - (r * 2)))), y: Math.abs(Math.floor(Math.random() * (width - (r * 2)))) },
            { name: "B", x: Math.abs(Math.floor(Math.random() * (height - (r * 2)))), y: Math.abs(Math.floor(Math.random() * (width - (r * 2)))) },
            { name: "C", x: Math.abs(Math.floor(Math.random() * (height - (r * 2)))), y: Math.abs(Math.floor(Math.random() * (width - (r * 2)))) },
            { name: "D", x: Math.abs(Math.floor(Math.random() * (height - (r * 2)))), y: Math.abs(Math.floor(Math.random() * (width - (r * 2)))) },
            { name: "E", x: Math.abs(Math.floor(Math.random() * (height - (r * 2)))), y: Math.abs(Math.floor(Math.random() * (width - (r * 2)))) },
            { name: "F", x: Math.abs(Math.floor(Math.random() * (height - (r * 2)))), y: Math.abs(Math.floor(Math.random() * (width - (r * 2)))) },
            { name: "G", x: Math.abs(Math.floor(Math.random() * (height - (r * 2)))), y: Math.abs(Math.floor(Math.random() * (width - (r * 2)))) },
            { name: "H", x: Math.abs(Math.floor(Math.random() * (height - (r * 2)))), y: Math.abs(Math.floor(Math.random() * (width - (r * 2)))) }
        ];

        // Filter
        // Define radial gradient for a bubble-like effect
        const defs = svg.append("defs");

        const gradient = defs.append("radialGradient")
            .attr("id", "bubbleGradient")
            .attr("cx", "50%")
            .attr("cy", "50%")
            .attr("r", "80%");

        gradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "rgba(255, 255, 255, 0.9)");

        gradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "#d1d1d1");

        gradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "rgba(25, 211, 162, 0.3)");

        // Add blur effect
        const filter = defs.append("filter")
            .attr("id", "bubbleBlur");

        filter.append("feGaussianBlur")
            .attr("stdDeviation", .5);

        // Initialize the circles: all located at the center of the SVG area
        const node = svg.append("g")
            .selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("r", r)
            .attr("cx", width / 2)
            .attr("cy", height / 2)
            .style("fill", "url(#bubbleGradient)") // Gradient effect
            .attr("filter", "url(#bubbleBlur)") // Soft blur
            .attr("stroke", "rgba(255, 255, 255, 0.8)") // Light edge stroke
            .style("stroke-width", 2)
            .style("opacity", 0.8) // Semi-transparent bubbles
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended)
            );


        // Define force simulation
        const simulation = d3.forceSimulation(data)
            .force("center", d3.forceCenter(width / 2, height / 2)) // Attraction to the center
            .force("boundary", forceBoundary(20, 20, width, height))
            .force("charge", d3.forceManyBody().strength(1)) // Nodes attract each other
            .force("collide", d3.forceCollide().strength(0.1).radius(100).iterations(1)) // Prevents overlap
            .on("tick", () => {
                node.attr("cx", d => d.x)
                    .attr("cy", d => d.y);
            });


        // Drag functions
        function dragstarted(event, d) {
            if (!event.active) simulation.alphaTarget(0.03).restart();
            // d.fx = d.x;
            // d.fy = d.y;
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



    }, [dimensions])

    return (
        <div className="h-[80%]">
            <div ref={svgContainer} className="border w-full h-full" id="svgContainer"></div>
        </div>
    );
}

export default Hero;
