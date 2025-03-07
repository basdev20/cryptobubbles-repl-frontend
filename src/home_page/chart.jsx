import { AreaSeries, BarSeries, BaselineSeries, createChart } from 'lightweight-charts';
import { useEffect, useRef } from 'react';
import axios from 'axios';


// Lightweight Charts™ Example: Floating Tooltip
// https://tradingview.github.io/lightweight-charts/tutorials/how_to/tooltips

function convertNanosecondsToUTC(nanoseconds) {
    // Convert nanoseconds to milliseconds
    const milliseconds = nanoseconds / 1e6;

    // Create a Date object
    const date = new Date(milliseconds);

    // Format the date and time in UTC
    return date.toISOString().replace('T', ' ').replace('Z', ' UTC');
}


const Chart = (props) => {
    const chartContainer = useRef();
    const { selectedTicker } = props;
    useEffect(() => {

        const chartOptions = {
            layout: {
                textColor: 'black',
                background: { type: 'solid', color: 'white' },
            },
        };

        /** @type {import('lightweight-charts').IChartApi} */
        const chart = createChart(document.getElementById('container'), chartOptions);

        chart.applyOptions({
            crosshair: {
                horzLine: { visible: false, labelVisible: false },
                vertLine: { visible: true, labelVisible: false },
            },
            grid: {
                vertLines: { visible: false },
                horzLines: { visible: false },
            },
            rightPriceScale: {
                visible: false,
                borderVisible: false,
                entireTextOnly: true,
            },
            timeScale: {
                visible: false,
                handleScroll: false, // Disable dragging (scrolling) on time axis
                handleScale: false,  // Disable zooming on time axis
            },
            // priceScale: {
            //     position: 'left',
            //     handleScale: false,  // Disable zooming on price axis
            // },
            height: 250,
            // width: width,
        });

        const series = chart.addSeries(AreaSeries, {
            topColor: '#2962FF',
            bottomColor: 'rgba(41, 98, 255, 0.28)',
            lineColor: '#2962FF',
            lineWidth: 2,
            crossHairMarkerVisible: false,
        });
        series.priceScale().applyOptions({
            scaleMargins: {
                top: 0.3, // leave some space for the legend
                bottom: 0.25,
            },
        });

        axios.get(`${import.meta.env.VITE_SERVER_BASE_URL}/chart-data?ticker=${selectedTicker}`).then((res) => {
            const { values } = res.data.results;
            let data = values.map(item => ({
                time: new Date(item.timestamp).toISOString().split('T')[0], // Convert timestamp to YYYY-MM-DD
                value: parseFloat(item.value.toFixed(2)) // Format value to 2 decimal places
            }));

            series.setData(data);
        }).catch(console.error);

        const container = document.getElementById('container');

        const toolTipWidth = 80;
        const toolTipHeight = 80;
        const toolTipMargin = 15;

        // Create and style the tooltip html element
        const toolTip = document.createElement('div');
        toolTip.style = `width: 96px; height: 80px; position: absolute; display: none; padding: 8px; box-sizing: border-box; font-size: 12px; text-align: left; z-index: 1000; top: 12px; left: 12px; pointer-events: none; border: 1px solid; border-radius: 2px;font-family: -apple-system, BlinkMacSystemFont, 'Trebuchet MS', Roboto, Ubuntu, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;`;
        toolTip.style.background = 'white';
        toolTip.style.color = 'black';
        toolTip.style.borderColor = '#EEEEEE';
        // container.appendChild(toolTip);
        container.querySelectorAll('a').forEach(a => a.remove()); // remove the water mark

        // update tooltip
        chart.subscribeCrosshairMove(param => {
            if (
                param.point === undefined ||
                !param.time ||
                param.point.x < 0 ||
                param.point.x > container.clientWidth ||
                param.point.y < 0 ||
                param.point.y > container.clientHeight
            ) {
                toolTip.style.display = 'none';
            } else {
                // time will be in the same format that we supplied to setData.
                // thus it will be YYYY-MM-DD
                const dateStr = param.time;
                toolTip.style.display = 'block';
                const data = param.seriesData.get(series);
                const price = data.price !== undefined ? data.price : data.close;
                toolTip.innerHTML = `<div style="color: ${'#2962FF'}">Apple Inc.</div><div style="font-size: 24px; margin: 4px 0px; color: ${'white'}">
                    ${Math.round(100 * price) / 100}
                    </div><div style="color: ${'white'}">
                    ${dateStr}
                    </div>`;

                const coordinate = series.priceToCoordinate(price);
                let shiftedCoordinate = param.point.x - 50;
                if (coordinate === null) {
                    return;
                }
                shiftedCoordinate = Math.max(
                    0,
                    Math.min(container.clientWidth - toolTipWidth, shiftedCoordinate)
                );
                const coordinateY =
                    coordinate - toolTipHeight - toolTipMargin > 0
                        ? coordinate - toolTipHeight - toolTipMargin
                        : Math.max(
                            0,
                            Math.min(
                                container.clientHeight - toolTipHeight - toolTipMargin,
                                coordinate + toolTipMargin
                            )
                        );
                toolTip.style.left = shiftedCoordinate + 'px';
                toolTip.style.top = coordinateY + 'px';
            }
        });

        chart.timeScale().fitContent();

    }, [])

    return (
        <div ref={chartContainer} className='w-full h-[300px] relative' id='container'>
            <div className='absolute bottom-9 w-full left-0 z-40 bg-gradient-to-t from-white to-transparent h-[90px]' id='tooltip'>
            </div>
        </div>

    );
}

export default Chart;
