const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const printResumePath = path.join(__dirname, '..', 'resumeTemplate/resume.html');

const printResume = async (request, reply) => {
    const htmlbody = request.body.html;
    const pageContent = fs.readFileSync(printResumePath, 'utf8').toString();
    const html = pageContent.replace('{{content}}', htmlbody);

    try {
        const executablePath = await chromium.executablePath || '/usr/bin/google-chrome-stable';

        const browser = await puppeteer.launch({
            args: chromium.args,
            executablePath,
            headless: chromium.headless,
        });
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });
        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
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
