import fs, { NoParamCallback } from "fs";
import * as cheerio from "cheerio";
import request, { Response } from "request";

request("https://www.imdb.com/chart/moviemeter/?ref_=nv_mv_mpm", function(
  err: Error,
  res: Response,
  body: string
) {
  if (err) console.log("Error: " + err);

  let $ = cheerio.load(body);

  var lista = $(".lister-list tr").map(function() {
    var title: string = $(this)
      .find(".titleColumn a")
      .text();
    var rating: string = $(this)
      .find(".ratingColumn strong")
      .text();
    console.log(title + " " + rating);

    return {
      title,
      rating
    };
  });

  fs.writeFile(
    "./index.html",
    `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <title>Document</title>
    </head>
    <body style="background-color: black;">
      <ul>
        Títulos:
          ${lista.get().map(item => {
            return `<li style="color: chartreuse;">${item.title}</li>
            <li style="color: yellow;">Rating: ${item.rating}</li>`;
          })}
      </ul>
    </body>
  </html>`,
    function(err: Error | null): NoParamCallback | void {
      console.log("Funcionou", err);
    }
  );
});
