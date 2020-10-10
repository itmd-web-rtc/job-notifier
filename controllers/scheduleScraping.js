function scheduleScraping(){
    
    const fs = require('fs');         
    const siteUrl = "https://www.glassdoor.com/Job/jobs.htm?suggestCount=0&suggestChosen=false&clickSource=searchBtn&typedKeyword=&locT=C&locId=1128808&jobType=&context=Jobs&sc.keyword=Software+Engineer&dropdown=0";

    const puppeteer = require('puppeteer');

    data = [];
    (async () => {
      const browser = await puppeteer.launch({
        args: ['--disable-dev-shm-usage'],
        timeout: 0
      });


      const page = await browser.newPage();
      
      await page.goto(siteUrl);
      
      await getData(page)

      const pageNumber = await page.evaluate(() => document.querySelector('#ResultsFooter > .cell').innerText.slice(-2));
      
      // for(var i=0;i<3;i++){
      //   await page.click('.next')
      //   await page.waitForNavigation()
     
      // try {
      //   await page.waitForSelector('.modal_closeIcon')
      //   await page.click('.modal_closeIcon');
      //   await page.waitForNavigation()
      // } catch (error) {
      //   console.log("The element didn't appear.")
      // }
      //   await getData(page)
      // }   
      
      console.log(data.sort((a, b) => parseInt(a.id) - parseInt(b.id)));
      console.log(pageNumber);
      // add data to file
      
      

      fs.promises.writeFile('Data.json', JSON.stringify(data), {encoding: 'utf8'}).then((err) => { 
        if (err) throw err;
        console.log('Data Saved!');
      })

      await page.close();
      await browser.close();
    })();

    async function getData(page){
      const id = await page.evaluate(() => Array.from(document.querySelectorAll('.react-job-listing'), element => element.getAttribute("data-id")));
      const title = await page.evaluate(() => Array.from(document.querySelectorAll('.react-job-listing > div > .jobHeader'), element => element.innerText));
      const pos = await page.evaluate(() => Array.from(document.querySelectorAll('.react-job-listing > div > .jobInfoItem'), element => element.innerText));
      const loc = await page.evaluate(() => Array.from(document.querySelectorAll('.d-flex > .loc'), element => element.innerText));
      id.forEach((ele, i) => {
        data.push({
          id: id[i],
          title: title[i],
          position: pos[i],
          location: loc[i]
        });
      });
    }

}

module.exports = scheduleScraping