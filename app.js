const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!!!!')
})

const siteUrl = "https://www.glassdoor.com/Job/jobs.htm?suggestCount=0&suggestChosen=false&clickSource=searchBtn&typedKeyword=software&locT=C&locId=1128808&jobType=&context=Jobs&sc.keyword=Software+Engineer&dropdown=0";

const axios = require('axios');
const cheerio = require('cheerio');

const fetchData = async () => {
  const result = await axios.get(siteUrl);
  getData(result.data);
};


fetchData();

let getData = html => {
  data = [];
  const $ = cheerio.load(html);
  $('.react-job-listing').each((i, elm) => {
      data.push({
        title: $(elm).find($('div > .jobHeader')).text(),
        position: $(elm).find($('div > .jobInfoItem')).text(),
        location: $(elm).find($('div > div >.loc')).text()
      })
  });
  console.log(data);
}

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})