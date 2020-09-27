function homeController() {
  return {
    index(req, res) {

      const siteUrl = "https://www.glassdoor.com/Job/jobs.htm?suggestCount=0&suggestChosen=false&clickSource=searchBtn&typedKeyword=software&locT=C&locId=1128808&jobType=&context=Jobs&sc.keyword=Software+Engineer&dropdown=0";

      const axios = require('axios');
      const cheerio = require('cheerio');
      const fs = require('fs');

      data = [];
      //access the site
      const fetchData = async () => {
        const result = await axios.get(siteUrl);
        getData(result.data);
      };

      //Scrape the data from response
      let getData = html => {
        
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
        fs.writeFile('Data.json', JSON.stringify(data), 'utf8', (err) => {
          // throws an error, you could also catch it here
          if (err) throw err;
          // success case, the file was saved
          console.log('Data Saved!');
          
          res.render('index', {'jobData' : data});
        });

      }

      //function fetch the data from website
      fetchData();
    
      
    }
  }
}

module.exports = homeController
