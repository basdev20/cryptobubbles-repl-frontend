import { AreaSeries, BarSeries, BaselineSeries, createChart } from 'lightweight-charts';
import { useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import TabsContext from '@/context/tabs';

// Lightweight Charts™ Example: Floating Tooltip
// https://tradingview.github.io/lightweight-charts/tutorials/how_to/tooltips

function formatTimestamp(dateStr) {
    let timestamp = Number(dateStr); // Ensure it's a number

    // Detect if the timestamp is in milliseconds (length > 10 means it's too large)
    if (timestamp > 1e10) {
        timestamp = Math.floor(timestamp / 1000); // Convert ms to seconds
    }

    const date = new Date(timestamp * 1000);

    // Manually format the date in local time
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');  // Month is 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;  // "YYYY-MM-DD HH:MM:SS"
}

const Chart = (props) => {
    const chartContainer = useRef();
    const { selectedTicker } = props;
    const { activeChartFilterTab } = useContext(TabsContext);

    useEffect(() => {

        // Clean container
        document.getElementById('container').replaceChildren();

        const chartOptions = {
            layout: {
                textColor: 'black',
                background: { type: 'solid', color: 'white' },
            },
        };

        /** @type {import('lightweight-charts').IChartApi} */
        const chart = createChart(document.getElementById('container'), chartOptions);

        chart.applyOptions({
            leftPriceScale: {
                visible: true,
                borderVisible: false,
            },
            rightPriceScale: {
                visible: false,
            },
            timeScale: {
                borderVisible: false,
            },
            crosshair: {
                horzLine: {
                    visible: false,
                    labelVisible: false,
                },
                vertLine: {
                    visible: true,
                    style: 0,
                    width: 2,
                    color: 'rgba(32, 38, 46, 0.1)',
                    labelVisible: false,
                },
            },
            // hide the grid lines
            grid: {
                vertLines: {
                    visible: false,
                },
                horzLines: {
                    visible: false,
                },
            },
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

        axios.get(`${import.meta.env.VITE_SERVER_BASE_URL}/chart-data?ticker=${selectedTicker}&filter=${activeChartFilterTab.name}`).then((res) => {
            const { results } = res.data;
            // console.log(results)
            let data = results.map(item => {
                return {

                    time: item.t, // Convert timestamp to YYYY-MM-DD
                    value: parseFloat(item.o.toFixed(2)) // Format value to 2 decimal places
                }
            });

            series.setData(data);

            // Automatically zoom to fit the data
            chart.timeScale().setVisibleRange({
                from: results[0].t, // Earliest timestamp
                to: results[results.length - 1].t // Latest timestamp
            });

        }).catch(console.error);

        const container = document.getElementById('container');

        const toolTipWidth = 100;
        const toolTipHeight = 80;
        const toolTipMargin = 15;

        // Create and style the tooltip html element
        const toolTip = document.createElement('div');
        toolTip.style = `width: 96px; height: 80px; position: absolute; display: none; padding: 8px; box-sizing: border-box; font-size: 12px; text-align: left; z-index: 1000; top: 12px; left: 12px; pointer-events: none; border: 1px solid; border-radius: 2px;font-family: -apple-system, BlinkMacSystemFont, 'Trebuchet MS', Roboto, Ubuntu, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;`;
        toolTip.style.background = 'white';
        toolTip.style.color = 'black';
        toolTip.style.borderColor = '#EEEEEE';
        container.appendChild(toolTip);
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
                const price = data.value;
                toolTip.innerHTML = `
                    <div>
                        <div style="color:#2962FF">
                            ${selectedTicker}
                        </div>
                        <div style="font-size: 15px; margin-top:1px; color:black">
                            $${Math.round(100 * price) / 100}
                        </div>
                        <div style="color: black">
                            ${formatTimestamp(dateStr)}
                        </div>
                    </div>`
                    ;

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

    }, [activeChartFilterTab])

    return (
        <div ref={chartContainer} className='w-full h-[300px] relative' id='container'>
            <div className='absolute bottom-9 w-full left-0 z-40 bg-gradient-to-t from-white to-transparent h-[90px]' id='tooltip'>
            </div>
        </div>

    );
}

export default Chart;
