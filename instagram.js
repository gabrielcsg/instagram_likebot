const puppeteer = require('puppeteer');

const BASE_URL = 'https://instagram.com/';
const TAG_URL = (tag) => `${BASE_URL}explore/tags/${tag}`
const POSTS_COUNT = 5;

const instagram = {
  browser: null,
  page: null,

  initialize: async () => {
    instagram.browser = await puppeteer.launch({ headless: false });

    instagram.page = await instagram.browser.newPage();
  },

  login: async (username, password) => {
    await instagram.page.goto(BASE_URL, { waitUntil: 'networkidle2' });
    await instagram.page.waitFor(1000);

    // escreve o username e password | write username and password
    await instagram.page.type('input[name="username"', username, { delay: 50 });
    await instagram.page.type('input[name="password"', password, { delay: 50 });

    // clica no botão de logar | click on the login url button
    let loginButton = await instagram.page.$x('//div[contains(text(), "Entrar")]');
    await loginButton[0].click();

    await instagram.page.waitFor(2000);

    // cancela o modal de notificação | cancel modal notifications
    let dimiss = await instagram.page.$x('//button[contains(text(), "Agora não")]');
    if (dimiss && dimiss.length) await dimiss[0].click();

    // debugger;
  },

  likeTagsProcess: async (tags = []) => {
    for (let tag of tags) {
      await instagram.page.goto(TAG_URL(tag), { waitUntil: 'networkidle2' });
      await instagram.page.waitFor(1000);

      let posts = await instagram.page.$$('article > div:nth-child(3) img');

      // para cada tag percorre os posts (até o máximo setado no POSTS_COUNT) e dá like
      for (let i = 0; i < POSTS_COUNT; i++) {
        let post = posts[i];

        await post.click();
        await instagram.page.waitFor(2000);

        let isLikable = await instagram.page.$$('button svg[aria-label="Curtir"]');
        if (isLikable && isLikable.length) await isLikable[0].click();

        await instagram.page.waitFor(2000);

        let closeModalButton = await instagram.page.$$('button svg[aria-label="Fechar"]');
        await closeModalButton[0].click();
      }
      
      await instagram.page.waitFor(3000);
    }
  }
}

module.exports = instagram;
