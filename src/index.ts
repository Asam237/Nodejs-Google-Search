import axios from "axios";
import cheerio from "cheerio";
import readline from "readline";

interface SearchResult {
  title: string;
  link: string;
}

const inquirer = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const text = "Nodejs Google Search by ASAM";
const styles = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  underscore: "\x1b[4m",
  blink: "\x1b[5m",
  reverse: "\x1b[7m",
  hidden: "\x1b[8m",
  fgBlack: "\x1b[30m",
  fgRed: "\x1b[31m",
  fgGreen: "\x1b[32m",
  fgYellow: "\x1b[33m",
  fgBlue: "\x1b[34m",
  fgMagenta: "\x1b[35m",
  fgCyan: "\x1b[36m",
  fgWhite: "\x1b[37m",
  bgBlack: "\x1b[40m",
  bgRed: "\x1b[41m",
  bgGreen: "\x1b[42m",
  bgYellow: "\x1b[43m",
  bgBlue: "\x1b[44m",
  bgMagenta: "\x1b[45m",
  bgCyan: "\x1b[46m",
  bgWhite: "\x1b[47m",
};

const styledText = `${styles.bright}${styles.fgBlue}${styles.bgWhite}${text}${styles.reset}`;

const files = [
  { Column1: "Liens", Column2: "All links" },
  { Column1: "PDF", Column2: "PDF File" },
  { Column1: "EXCEL", Column2: "Format Excel" },
  { Column1: "MP4", Column2: "All videos" },
];

console.log(`\n${styledText}`);

inquirer.question(
  "\nEnter the domain extension (com, net, cm, etc..): ",
  async (e) => {
    inquirer.question("Enter keyword: ", async (k) => {
      console.table(files);
      inquirer.question("Enter files: ", async (f) => {
        const searchGoogle = async (query: string): Promise<void> => {
          try {
            const response = await axios.get("https://www.google.com/search", {
              params: {
                q: query,
              },
              headers: {
                "User-Agent":
                  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
              },
            });
            const $ = cheerio.load(response.data);
            const results: SearchResult[] = [];
            $("h3").each((index, element) => {
              const title = $(element).text();
              const link = $(element).parent().attr("href");
              if (title && link) {
                results.push({ title, link: `https://www.google.com${link}` });
              }
            });

            results.forEach((result, index) => {
              let removeUrl = "https://www.google.com";
              console.log(`Result ${index + 1}:`);
              console.log(`Title: ${result.title}`);
              console.log(`Link: ${result.link.replace(removeUrl, "")}`);
              console.log("-----------------------------");
            });
          } catch (error) {
            console.error("Error making the search request:", error);
          }
        };

        switch (f) {
          case "0": {
            searchGoogle(`site:*.${e} intitle:${k}`);
            break;
          }
          case "1": {
            searchGoogle(`site:*.${e} intitle:${k} filetype:pdf`);
            break;
          }
          case "2": {
            searchGoogle(`site:*.${e} intitle:${k} filetype:excel`);
            break;
          }
          case "3": {
            searchGoogle(`site:*.${e} intitle:${k} filetype:mp4`);
            break;
          }
          default: {
            searchGoogle(`site:*.${e} intitle:${k}`);
            break;
          }
        }
      });
    });
  }
);
