const puppeteer = require("puppeteer");
const { User } = require("../src/models/user.model");

let browser;
let page;

beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: "new",
    slowMo: 80,
  });

  page = await browser.newPage();
});

afterAll(async () => {
  await browser.close();
});

describe("Unit", () => {
  describe("Get All Users", () => {
    test("Result should be an instance of Array", async () => {
      const response = await page.goto("http://localhost/api/users", {
        waitUntil: "domcontentloaded",
      });
      await page.waitForSelector("body");
      // get the body of the page
      let content = await page
        .evaluate(() => document.body.textContent)
        .then((text) => {
          return text;
        });

      content = JSON.parse(content);

      expect(content).toBeInstanceOf(Array);
    });
  });
  describe("Create User", () => {
    test("XSS attack should be prevented", async () => {
      // user with email & pass containing XSS attack
      const user = {
        name: "<script>alert('xss')</script>",
        email: "hugo@gmail.com",
        password: "hugo1234",
      };

      // post data to the server
      const response = await page.goto("http://localhost/register", {
        waitUntil: "domcontentloaded",
      });
      await page.waitForSelector("body");
      await page.type('input[name="name"]', user.name);
      await page.type('input[name="email"]', user.email);
      await page.type('input[name="password"]', user.password);
      await page.click('input[type="submit"]');

      expect(content).toBeInstanceOf(Object);
    });
  });
});
