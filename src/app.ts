import Server from './server';
import WebScraper from "./services/web-scraper";

const port = parseInt(process.env.PORT || '3000');

new WebScraper().start()

new Server().start(port)
  .then(port => console.log(`Running on port ${port}`))
  .catch(error => {
    console.log(error)
  });
