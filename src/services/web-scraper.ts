import fetch from "node-fetch";
import format from "pg-format";
import { JSDOM } from "jsdom";
import Pool from "../config/db";
import { validKeys, keyValues } from "../utils";

class WebScraper {
  private BASE_URL = "https://tretton37.com/";
  private MEET_URL = "meet";

  public async start() {
    const ninjas = await this.getNinjas(this.BASE_URL + this.MEET_URL);
    const client = await Pool.connect();

    const validAttributes = [
      "id",
      "name",
      "city",
      "country",
      "imageFullUrl",
      "imagePortraitUrl",
      "text",
    ];
    const keys = validKeys(validAttributes, ninjas[0]);
    const values = ninjas.map((ninja) => keyValues(keys, ninja));

    const sql = format(
      `INSERT INTO users ( ${keys} ) VALUES %L
       ON CONFLICT DO NOTHING RETURNING *`,
      values
    );

    await client.query(sql);

    client.release();

    console.log("WebScraper: Updated users");
  }

  private async getNinjas(link: string) {
    const response = await fetch(link);
    const body = await response.text();
    const { document } = new JSDOM(body).window;
    const ninjas = Array.from(document.querySelectorAll(".ninja-summary"));

    const result = await Promise.all(
      ninjas
        .map((ninjaElement, idx) => {
          const infoElement = ninjaElement.querySelector(".contact-info h1 a");
          if (!infoElement) {
            throw new Error(`Missing .contact-info for idx ${idx}`);
          }

          const [name, countryCity] = Array.from(infoElement.childNodes).map(
            (child) => child.textContent
          );
          if (!name || !countryCity) {
            throw new Error(`Missing children of .contact-info for idx ${idx}`);
          }
          const [country, city] = countryCity.split(" ");

          const portraitElement = ninjaElement.querySelector(".portrait");
          if (!portraitElement) {
            throw new Error(`Missing portrait of .contact-info for idx ${idx}`);
          }
          const imagePortraitUrl = portraitElement.getAttribute("src");

          const getToKnowMeLink = infoElement.getAttribute("href");
          if (!getToKnowMeLink) {
            throw new Error(`Missing getToKnowMeLink for idx ${idx}`);
          }

          return {
            id: idx,
            name,
            city,
            country,
            imagePortraitUrl,
            getToKnowMeLink,
          };
        })
        .map(async ({ getToKnowMeLink, ...ninja }) => ({
          ...ninja,
          ...(await this.getUserData(getToKnowMeLink)),
        }))
    );

    return result;
  }

  private async getUserData(link: string) {
    const response = await fetch(this.BASE_URL + link);
    const body = await response.text();
    const { document } = new JSDOM(body).window;
    const ninjaElement = document.querySelector("article");
    if (!ninjaElement) {
      throw new Error(`Missing article for ${link}`);
    }

    const imageElement = ninjaElement.querySelector(".ninja-header image");
    if (!imageElement) {
      throw new Error(`Missing image for ${link}`);
    }
    const imageFullUrl = imageElement.getAttribute("xlink:href");

    const textElement = ninjaElement.querySelector(".main-ninja-text");
    if (!textElement) {
      throw new Error(`Missing text for ${link}`);
    }
    const text = textElement.innerHTML;

    return { imageFullUrl, text };
  }
}

export default WebScraper;
