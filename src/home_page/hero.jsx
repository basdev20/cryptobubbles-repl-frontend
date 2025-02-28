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
        const data = [
            { avatar: "/imgs/avatar.png", name: "Stock 1", colorAndSize_state: true, x: Math.abs(Math.floor(Math.random() * (height - (r * 2)))), y: Math.abs(Math.floor(Math.random() * (width - (r * 2)))) },
            { avatar: "/imgs/avatar.png", name: "Stock 2", colorAndSize_state: false, x: Math.abs(Math.floor(Math.random() * (height - (r * 2)))), y: Math.abs(Math.floor(Math.random() * (width - (r * 2)))) },
            { avatar: "/imgs/avatar.png", name: "Stock 3", colorAndSize_state: true, x: Math.abs(Math.floor(Math.random() * (height - (r * 2)))), y: Math.abs(Math.floor(Math.random() * (width - (r * 2)))) },
            { avatar: "/imgs/avatar.png", name: "Something", colorAndSize_state: false, x: Math.abs(Math.floor(Math.random() * (height - (r * 2)))), y: Math.abs(Math.floor(Math.random() * (width - (r * 2)))) },
            { avatar: "/imgs/avatar.png", name: "Hello World", colorAndSize_state: true, x: Math.abs(Math.floor(Math.random() * (height - (r * 2)))), y: Math.abs(Math.floor(Math.random() * (width - (r * 2)))) },
            { avatar: "/imgs/avatar.png", name: "Apple", colorAndSize_state: false, x: Math.abs(Math.floor(Math.random() * (height - (r * 2)))), y: Math.abs(Math.floor(Math.random() * (width - (r * 2)))) },
            { avatar: "/imgs/avatar.png", name: "Microsoft", colorAndSize_state: true, x: Math.abs(Math.floor(Math.random() * (height - (r * 2)))), y: Math.abs(Math.floor(Math.random() * (width - (r * 2)))) },
            { avatar: "/imgs/avatar.png", name: "Azure", colorAndSize_state: false, x: Math.abs(Math.floor(Math.random() * (height - (r * 2)))), y: Math.abs(Math.floor(Math.random() * (width - (r * 2)))) }
        ];

        // Filter
        // Define radial gradient for a bubble-like effect
        const defs = svg.append("defs");

        data.forEach((d, i) => {
            const gradient = defs.append("radialGradient")
                .attr("id", `bubbleGradient-${i}`)
                .attr("cx", "50%")
                .attr("cy", "50%")
                .attr("r", "80%");

            gradient.append("stop")
                .attr("offset", "0%")
                .attr("stop-color", "rgba(255, 255, 255, 0.9)");

            gradient.append("stop")
                .attr("offset", "100%")
                .attr("stop-color", d.colorAndSize_state ? "#d1d1d1" : "#db4242");

            gradient.append("stop")
                .attr("offset", "100%")
                .attr("stop-color", "rgba(25, 211, 162, 0.3)");
        });

        const filter = defs.append("filter")
            .attr("id", "bubbleBlur");

        filter.append("feGaussianBlur")
            .attr("stdDeviation", 0.5);

        const node = svg.append("g")
            .selectAll("g")
            .data(data)
            .enter()
            .append("g")
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended)
            );

        node.append("circle")
            .attr("r", d => (d.colorAndSize_state ? r : 40))
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
            .attr("y", -25); // Position above text with 15px margin

        node.append("text")
            .attr("text-anchor", "middle")
            .attr("dy", "20") // Adjust text position below the avatar
            .style("fill", "black")
            .style("font-size", "12px")
            .text(d => d.name);

        const simulation = d3.forceSimulation(data)
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("boundary", forceBoundary(20, 20, width - (r * 2), height - (r * 2)))
            .force("charge", d3.forceManyBody().strength(1))
            .force("collide", d3.forceCollide().strength(0.1).radius(80).iterations(1))
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



    }, [dimensions])

    return (
        <div className="h-[80%]">
            <div ref={svgContainer} className="w-full h-full" id="svgContainer"></div>
        </div>
    );
}

export default Hero;
