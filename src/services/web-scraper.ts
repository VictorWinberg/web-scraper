import fetch from "node-fetch";
import { JSDOM } from "jsdom";

const baseUrl = "https://tretton37.com/";
const meetUrl = "meet";

async function getUserData(link: string) {
  const response = await fetch(baseUrl + link);
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

async function webScrape(link: string) {
  const response = await fetch(link);
  const body = await response.text();
  const { document } = new JSDOM(body).window;
  const ninjas = Array.from(document.querySelectorAll(".ninja-summary")).slice(
    0,
    5
  );

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
        ...(await getUserData(getToKnowMeLink)),
      }))
  );

  console.log(result[0]);
}

webScrape(baseUrl + meetUrl);
