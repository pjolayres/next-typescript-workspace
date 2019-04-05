import { Selector } from 'testcafe'; // first import testcafe selectors

const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

fixture('Getting Started').page(`${baseUrl}/`);

// then create a test and place your code there
test('Homepage title is correct', async t => {
  await t
    .expect(Selector('h1.title').innerText)
    .eql('Website Title');
});
