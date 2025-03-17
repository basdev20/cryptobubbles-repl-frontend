import { AreaSeries, createChart, LineSeries } from 'lightweight-charts';
import { useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import TabsContext from '@/context/tabs';

function formatTimestamp(dateStr) {
    let timestamp = Number(dateStr);

    if (timestamp > 1e10) {
        timestamp = Math.floor(timestamp / 1000);
    }

    const date = new Date(timestamp * 1000);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const Chart = (props) => {
    const chartContainer = useRef();
    const { selectedTicker } = props;
    const { activeChartFilterTab } = useContext(TabsContext);

    useEffect(() => {
        document.getElementById('container').replaceChildren();

        const chartOptions = {
            layout: {
                textColor: 'black',
                background: { type: 'solid', color: 'transparent' }, // Transparent background
            },
        };

        const chart = createChart(document.getElementById('container'), chartOptions);

        chart.applyOptions({
            leftPriceScale: { visible: true, borderVisible: false },
            rightPriceScale: { visible: false },
            timeScale: { borderVisible: false, visible: false },
            crosshair: {
                horzLine: { visible: false, labelVisible: false },
                vertLine: { visible: true, style: 0, width: 2, color: 'rgba(32, 38, 46, 0.1)', labelVisible: true },
            },
            grid: { vertLines: { visible: false }, horzLines: { visible: false } },
            height: 295
        });

        const series = chart.addSeries(AreaSeries, {
            topColor: '#2962FF',
            bottomColor: 'white',
            lineColor: '#2962FF',
            lineWidth: 2,
            crossHairMarkerVisible: false,
        });

        series.priceScale().applyOptions({
            scaleMargins: { top: 0.3, bottom: 0.25 },
        });

        axios.get(`${import.meta.env.VITE_SERVER_BASE_URL}/chart-data?ticker=${selectedTicker.ticker}&filter=${activeChartFilterTab.name}`)
            .then((res) => {
                const { results } = res.data;
                console.log(res.data)

                let data = results.map(item => ({
                    time: item.t,
                    value: parseFloat(item.o.toFixed(2)),
                }));

                series.setData(data);

                // Calculate extreme points (low and high)
                const minDataPoint = Math.min(...data.map(item => item.value));
                const maxDataPoint = Math.max(...data.map(item => item.value));

                const minData = data.find(item => item.value === minDataPoint);
                const maxData = data.find(item => item.value === maxDataPoint);

                // Add markers for extreme points
                const minMarker = chart.addSeries(LineSeries, { color: 'red', lineWidth: 2 });
                const maxMarker = chart.addSeries(LineSeries, { color: 'green', lineWidth: 2 });

                minMarker.setData([{ time: minData.time, value: minDataPoint }]);
                maxMarker.setData([{ time: maxData.time, value: maxDataPoint }]);

                // Automatically zoom to fit the data
                chart.timeScale().setVisibleRange({
                    from: results[0].t,
                    to: results[results.length - 1].t,
                });
            })
            .catch(console.error);

        const container = document.getElementById('container');

        const toolTipWidth = 100;
        const toolTipHeight = 80;
        const toolTipMargin = 15;

        const toolTip = document.createElement('div');
        toolTip.style = `width: 96px; height: 80px; position: absolute; display: none; padding: 8px; box-sizing: border-box; font-size: 12px; text-align: left; z-index: 1000; top: 12px; left: 12px; pointer-events: none; border: 1px solid; border-radius: 2px;font-family: -apple-system, BlinkMacSystemFont, 'Trebuchet MS', Roboto, Ubuntu, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;`;
        toolTip.style.background = 'white';
        toolTip.style.color = 'black';
        toolTip.style.borderColor = '#EEEEEE';
        container.appendChild(toolTip);
        container.querySelectorAll('a').forEach(a => a.remove());

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
                const dateStr = param.time;
                toolTip.style.display = 'block';
                const data = param.seriesData.get(series);
                const price = data.value;
                toolTip.innerHTML = `
                    <div>
                        <div style="color:#2962FF">
                            ${selectedTicker.ticker}
                        </div>
                        <div style="font-size: 15px; margin-top:1px; color:black">
                            $${Math.round(100 * price) / 100}
                        </div>
                        <div style="color: black">
                            ${formatTimestamp(dateStr)}
                        </div>
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

    }, [activeChartFilterTab]);

    return (
        <div ref={chartContainer} className='w-full h-[300px] relative' id='container'>
            {/* <div className='absolute bottom-9 w-full left-0 z-40 bg-gradient-to-t from-white to-transparent h-[90px]' id='tooltip'></div> */}
        </div>
    );
};

export default Chart;
