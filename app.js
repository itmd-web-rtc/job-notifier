const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!!!!')
})

// This code is for testing the scraping must be restructured and organized
// 
// 

const siteUrl = "https://www.glassdoor.com/Job/jobs.htm?suggestCount=0&suggestChosen=false&clickSource=searchBtn&typedKeyword=software&locT=C&locId=1128808&jobType=&context=Jobs&sc.keyword=Software+Engineer&dropdown=0";

const axios = require('axios');
const cheerio = require('cheerio');

const fs = require('fs');

//access the site
const fetchData = async () => {
  const result = await axios.get(siteUrl);
  getData(result.data);
};


fetchData();


//Scrape the data from response
let getData = html => {
  data = [];
  const $ = cheerio.load(html);
  $('.react-job-listing').each((i, elm) => {
      data.push({
        id: $(elm).attr('data-id'),
        title: $(elm).find($('div > .jobHeader')).text(),
        position: $(elm).find($('div > .jobInfoItem')).text(),
        location: $(elm).find($('div > div >.loc')).text()
      })
  });
  console.log(data);

  // add data to file
  fs.writeFile('Data.json', JSON.stringify(data),'utf8', (err) => {
    // throws an error, you could also catch it here
    if (err) throw err;
    // success case, the file was saved
    console.log('Data Saved!');
  });

}
// ----END---------------------------
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})