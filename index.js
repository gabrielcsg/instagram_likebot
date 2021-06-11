require('dotenv').config();
const instagram = require('./instagram');

(async () => {
  await instagram.initialize();
  await instagram.login(process.env.INSTA_USERNAME, process.env.INSTA_PASSWORD);

  const tags = process.env.INSTA_TAGS
    ? JSON.parse(process.env.INSTA_TAGS)
    : ['pictures'];

  await instagram.likeTagsProcess(tags);
})();
