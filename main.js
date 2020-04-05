const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const apicache = require('apicache');

const app = express();
const port = 3000;
app.listen(port, () => console.log(`Server is listening on port: ${port}`));

const url = "https://covid19.saglik.gov.tr/";
const resultData = {
    totalNumberOfTest: 0,
    totalNumberOfCase: 0,
    totalNumberOfDeath: 0,
    totalNumberOfIntensiveCare: 0,
    totalNumberOfIntubated: 0,
    totalNumberOfRecovered: 0,

    numberOfTestToday: 0,
    numberOfCaseToday: 0,
    numberOfDeathToday: 0,
    numberOfRecoveredToday: 0
};

const cache = apicache.middleware;
const onlyStatus200 = (req, res) => res.statusCode === 200;
const cacheSuccesses = cache('5 minutes', onlyStatus200);

app.get('/tc-covid19', cacheSuccesses, (req, res) => {
    fetchData(url)
        .then((response) => {
            const html = response.data;
            const $ = cheerio.load(html);
            const statsTable = $('.card-body').first().find('.list-group li');

            resultData.totalNumberOfTest = $(statsTable[0]).find('span').eq(1).text().trim();
            resultData.totalNumberOfCase = $(statsTable[1]).find('span').eq(1).text().trim();
            resultData.totalNumberOfDeath = $(statsTable[2]).find('span').eq(1).text().trim();
            resultData.totalNumberOfIntensiveCare = $(statsTable[3]).find('span').eq(1).text().trim();
            resultData.totalNumberOfIntubated = $(statsTable[4]).find('span').eq(1).text().trim();
            resultData.totalNumberOfRecovered = $(statsTable[5]).find('span').eq(1).text().trim();

            resultData.numberOfTestToday = $(statsTable[6]).find('span').eq(1).text().trim();
            resultData.numberOfCaseToday = $(statsTable[7]).find('span').eq(1).text().trim();
            resultData.numberOfDeathToday = $(statsTable[8]).find('span').eq(1).text().trim();
            resultData.numberOfRecoveredToday = $(statsTable[9]).find('span').eq(1).text().trim();

            console.log(new Date(), 'resultData', resultData);
            res.json(resultData);
        }).catch((err) => {
        console.log('err', err);
        res.status(400).send('Invalid JSON string')
    });
});


async function fetchData(url) {
    console.log("Crawling data...");
    return await axios(url).catch((err) => console.log(err));
}