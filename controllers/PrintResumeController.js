const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const printResumePath = path.join(__dirname, '..', 'resumeTemplate', 'resume.html');

const printResume = async (request, reply) => {
  const htmlbody = request.body.html;
  const pageTemplate = fs.readFileSync(printResumePath, 'utf8').toString();
  const html = pageTemplate.replace('{{content}}', htmlbody);
  console.log(html);

  try {
    const cachePath = process.env.PUPPETEER_CACHE_DIR || path.resolve(__dirname, '..', '.cache/puppeteer');
    const chromePath = path.join(cachePath, 'chrome', 'latest', 'chrome-linux', 'chrome');
    console.log('Cache Path:', cachePath);
    console.log('Chrome Executable Path:', chromePath);

    // This log will help you verify if the path is correct
    const installLog = fs.readdirSync(path.join(cachePath, 'chrome', 'latest'));
    console.log('Installed Chrome Files:', installLog);

    if (!fs.existsSync(chromePath)) {
      throw new Error(`Chrome executable not found at ${chromePath}`);
    }

    const browser = await puppeteer.launch({
      executablePath: chromePath,
      headless: true,
    });
    const page = await browser.newPage();
    await page.setContent(html);
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
    });
    await browser.close();

    reply.header('Content-Type', 'application/pdf');
    reply.header('Content-Disposition', 'attachment; filename="generated.pdf"');
    reply.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating PDF:', error);
    reply.status(500).send('Error generating PDF');
  }
};

module.exports = { printResume };
