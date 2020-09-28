function homeController() {
  return {
    index(req, res) {

      const siteUrl = "https://www.glassdoor.com/Job/jobs.htm?suggestCount=0&suggestChosen=false&clickSource=searchBtn&typedKeyword=&locT=C&locId=1128808&jobType=&context=Jobs&sc.keyword=Software+Engineer&dropdown=0";

      const fs = require('fs');

      const puppeteer = require('puppeteer');

      (async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(siteUrl);
        data = [];

        const id = await page.evaluate(() => Array.from(document.querySelectorAll('.react-job-listing'), element => element.getAttribute("data-id")));
        const title = await page.evaluate(() => Array.from(document.querySelectorAll('.react-job-listing > div > .jobHeader'), element => element.innerText));
        const pos = await page.evaluate(() => Array.from(document.querySelectorAll('.react-job-listing > div > .jobInfoItem'), element => element.innerText));
        const loc = await page.evaluate(() => Array.from(document.querySelectorAll('.d-flex > .loc'), element => element.innerText));
        
        for (var i = 0; i < id.length; i++) {
          data.push({
            id: id[i],
            title: title[i],
            position: pos[i],
            location: loc[i]
          });
        }

        const pageNumber = await page.evaluate(() => document.querySelector('#ResultsFooter > .cell').innerText.slice(-2));
        
        console.log(data.sort((a, b) => parseInt(a.id) - parseInt(b.id)));
        console.log(pageNumber);
        // add data to file
        fs.writeFile('Data.json', JSON.stringify(data), 'utf8', (err) => {
          // throws an error, you could also catch it here
          if (err) throw err;
          // success case, the file was saved
          console.log('Data Saved!');

          res.render('index', { 'jobData': data });
        });
        await browser.close();
      })();


      // //access the site
      // const fetchData = async () => {
      //   const result = await axios.get(siteUrl);
      //   getData(result.data);
      // };

      // //Scrape the data from response
      // let getData = html => {

      //   const $ = cheerio.load(html);
      //   $('.react-job-listing').each((i, elm) => {
      //     data.push({
      //       id: $(elm).attr('data-id'),
      //       title: $(elm).find($('div > .jobHeader')).text(),
      //       position: $(elm).find($('.jobInfoItem')).text(),
      //       location: $(elm).find($('div >.loc')).text()
      //     })
      //   });
      //   console.log(data);

      //   // add data to file
      //   fs.writeFile('Data.json', JSON.stringify(data), 'utf8', (err) => {
      //     // throws an error, you could also catch it here
      //     if (err) throw err;
      //     // success case, the file was saved
      //     console.log('Data Saved!');

      //     res.render('index', {'jobData' : data});
      //   });

      // }

      //function fetch the data from website
      // fetchData();


    }
  }
}

module.exports = homeController
