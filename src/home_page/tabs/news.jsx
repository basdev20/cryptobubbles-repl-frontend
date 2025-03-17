import { useContext, useEffect, useState } from "react";
import SelectedElementsContext from "@/context/selected";
import axios from "axios"
import { Dot } from "lucide-react";

const News = () => {
    const { selectedTicker } = useContext(SelectedElementsContext);
    const [news, setNews] = useState(null);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_SERVER_BASE_URL}/ticker-news?ticker=${selectedTicker.ticker}`)
            .then((res) => {
                setNews(groupNewsByDate(res.data.results))
            }).catch(console.error)
    }, [])

    return (
        <div className="max-h-[250px] overflow-x-auto">
            {
                news ?
                    news.map((timeframe, index) =>
                        <>
                            <h2 key={`timeframe-s-${index}`} className="font-medium text-lg nunito-font mt-2">{timeframe.day} {timeframe.month}</h2>
                            <div className="bg-white w-full py-1 rounded-2xl mt-2">
                                {/* News will go here */}
                                {
                                    timeframe.news.map((_new, id) => <div key={`-new-${id}`} className="p-3 px-4">
                                        <div className="text-gray-500"> {selectedTicker.ticker} </div>
                                        <div className="flex justify-between">
                                            <div className="flex flex-col justify-between">
                                                <a href={_new.article_url} className="text-sm cursor-pointer font-medium">
                                                    {minimizeText(_new.title)}
                                                </a>
                                                <p className="text-gray-500 text-sm flex">{_new.time} <Dot /> {_new.author}</p>
                                            </div>
                                            <img className="size-20 rounded-2xl" src={_new.image_url} alt="" />
                                        </div>
                                    </div>
                                    )
                                }
                            </div>
                        </>
                    ) : ""
            }
        </div>
    );
}

function groupNewsByDate(newsList) {
    const groupedNews = {};
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    newsList.forEach(news => {
        const date = new Date(news.published_utc);
        const day = date.getDate();
        const month = monthNames[date.getMonth()]; // Get month name
        const year = date.getFullYear();
        // const time = date.toISOString().substr(11, 5); // Extract HH:MM format
        const key = `${year}-${month}-${day}`;

        if (!groupedNews[key]) {
            groupedNews[key] = {
                day,
                month,
                year,
                news: []
            };
        }

        groupedNews[key].news.push({
            title: news.title,
            description: news.description,
            author: news.author,
            article_url: news.article_url,
            image_url: news.image_url,
            tickers: news.tickers,
            keywords: news.keywords,
            time: date.toISOString().split('T')[1].substring(0, 5) // Extract HH:MM time format
        });
    });

    return Object.values(groupedNews);
}

function minimizeText(text, maxLength = 60) {
    return text.length > maxLength ? text.slice(0, maxLength).split(" ").slice(0, -1).join(" ") + "..." : text;
}


export default News;
