const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Scraping trending repositories
  await page.goto('https://github.com/trending');
  const html = await page.content();
  const $ = cheerio.load(html);
  
  const repositories = [];
  $('.Box .Box-row').each((i, el) => {
    const title = $(el).find('.h3 a').text().trim();
    const description = $(el).find('.col-9.color-fg-muted.my-1.pr-4').text().trim();
    const url = 'https://github.com' + $(el).find('.h3 a').attr('href');
    // const stars = $(el).find('.Link--muted.d-inline-block.mr-3').text().trim();  
    // const forks = $(el).find('.Link--muted.d-inline-block.mr-3').text().trim();

    let stars = $(el).find('.octicon-star').parent().text().trim();  
    stars = stars.replace(/\n/g, '');

      
    let forks = $(el).find('.octicon-repo-forked').parent().text().trim();
    forks = forks.replace(/\n/g, '');


    const language = $(el).find('.d-inline-block.ml-0.mr-3').text().trim();  
    
    repositories.push({title, description, url, stars, forks, language});
  });
  
  // Scraping trending developers
  await page.goto('https://github.com/trending/developers?language=javascript');
  const html2 = await page.content();
  const $2 = cheerio.load(html2);
  
  const developers = [];
  $2('.Box .Box-row').each((i, el) => {
    const name = $(el).find('h1 a').text().trim();
    const username = $(el).find('.f4.text-normal.mb-1').text().trim();
    const repoName = $(el).find('.h4 a').text().trim();
    const repoDescription = $(el).find('.f6.color-fg-muted.mt-1').text().trim();
    
    developers.push({name, username, repoName, repoDescription});
  });
  
  // Storing the extracted data in a JSON object
  const data = {repositories, developers};
  
  console.log(data);
  
  await browser.close();
})();
