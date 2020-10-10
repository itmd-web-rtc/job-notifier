function homeController() {
  
  return {
    index(req, res) {
      const fs = require('fs');
      fs.promises.readFile('Data.json', {encoding:"utf8"})
      .then(function(data) {
          res.render('index', { 'jobData': JSON.parse(data) });
      });
      


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
