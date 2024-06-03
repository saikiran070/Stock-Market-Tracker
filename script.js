const API_KEY = '6ATVXRU3TFQ0PUJC';
const STOCK_API_URL = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=${6ATVXRU3TFQ0PUJC}';
const NEWS_API_URL = `https://newsapi.org/v2/everything?q=stocks&apiKey=975db0d6e1b34bd9bac04f9232ba39fc`;

document.addEventListener('DOMContentLoaded', () => {
    fetchStockData();
    fetchNews();
});

async function fetchStockData() {
    try {
        const response = await fetch(STOCK_API_URL);
        const data = await response.json();
        displayStockData(data);
        displayChart(data);
    } catch (error) {
        console.error('Error fetching stock data:', error);
    }
}

function displayStockData(data) {
    const stockInfoDiv = document.getElementById('stock-info');
    const metaData = data['Meta Data'];
    const timeSeries = data['Time Series (5min)'];
    const latestTime = Object.keys(timeSeries)[0];
    const latestData = timeSeries[latestTime];

    stockInfoDiv.innerHTML = `
        <p><strong>Symbol:</strong> ${metaData['2. Symbol']}</p>
        <p><strong>Last Refreshed:</strong> ${metaData['3. Last Refreshed']}</p>
        <p><strong>Open:</strong> ${latestData['1. open']}</p>
        <p><strong>High:</strong> ${latestData['2. high']}</p>
        <p><strong>Low:</strong> ${latestData['3. low']}</p>
        <p><strong>Close:</strong> ${latestData['4. close']}</p>
        <p><strong>Volume:</strong> ${latestData['5. volume']}</p>
    `;
}

function displayChart(data) {
    const ctx = document.getElementById('stockChart').getContext('2d');
    const timeSeries = data['Time Series (5min)'];
    const labels = Object.keys(timeSeries).reverse();
    const prices = labels.map(time => timeSeries[time]['4. close']);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Stock Price',
                data: prices,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Time'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Price'
                    }
                }
            }
        }
    });
}

async function fetchNews() {
    try {
        const response = await fetch(NEWS_API_URL);
        const data = await response.json();
        displayNews(data.articles);
    } catch (error) {
        console.error('Error fetching news:', error);
    }
}

function displayNews(articles) {
    const newsArticlesDiv = document.getElementById('news-articles');
    newsArticlesDiv.innerHTML = articles.map(article => `
        <div>
            <h3>${article.title}</h3>
            <p>${article.description}</p>
            <a href="${article.url}" target="_blank">Read more</a>
        </div>
    `).join('');
}
