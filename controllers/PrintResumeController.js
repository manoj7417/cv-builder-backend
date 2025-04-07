const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const { User } = require('../models/userModel');

const printResumePath = path.join(__dirname, '..', 'resumeTemplate/resume.html');

const getExecutablePath = () => {
    // Try common Chrome locations first
    const paths = {
        win32: [
            'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
        ],
        darwin: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        linux: '/usr/bin/google-chrome-stable'
    };

    // Check if Chrome exists in any of the common locations
    if (paths[process.platform]) {
        for (const possiblePath of paths[process.platform]) {
            if (fs.existsSync(possiblePath)) {
                return possiblePath;
            }
        }
    }

    // Fallback to Puppeteer's bundled Chromium
    return undefined;
};

const printResume = async (request, reply) => {
    const userId = request.user._id;
    let browser = null;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return reply.code(404).send({ status: 'FAILURE', message: 'User not found' });
        }

        if (user.subscription.downloadCVTokens.credits < 1) {
            return reply.code(403).send({ status: 'FAILURE', message: 'Insufficient credits' });
        }

        const html = fs.readFileSync(printResumePath, 'utf8')
            .toString()
            .replace('{{content}}', request.body.html);

        const styledHtml = `
            <style>
                @page { margin: 10mm 0; }
                @page :first { margin-top: 0; }
                body { margin: 0; }
            </style>
            ${html}
        `;

        // Launch options with smart executable path detection
        const launchOptions = {
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--single-process'
            ],
            headless: 'new',
            executablePath: getExecutablePath()
        };

        // Debugging: Log the executable path being used
        console.log('Using browser executable at:', launchOptions.executablePath || 'puppeteer bundled');

        browser = await puppeteer.launch(launchOptions);
        const page = await browser.newPage();

        await page.setContent(styledHtml, {
            waitUntil: 'networkidle0',
            timeout: 30000
        });

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '10mm', bottom: '10mm' }
        });

        user.subscription.downloadCVTokens.credits -= 1;
        await user.save();

        return reply
            .header('Content-Type', 'application/pdf')
            .header('Content-Disposition', 'attachment; filename="resume.pdf"')
            .send(pdfBuffer);

    } catch (error) {
        console.error('PDF Generation Error:', error);
        return reply.code(500).send({
            status: 'ERROR',
            message: 'Failed to generate PDF',
            ...(process.env.NODE_ENV === 'development' && {
                debug: {
                    error: error.message,
                    platform: process.platform,
                    chromePath: getExecutablePath()
                }
            })
        });
    } finally {
        if (browser) {
            await browser.close().catch(e => console.error('Browser close error:', e));
        }
    }
};

module.exports = { printResume };