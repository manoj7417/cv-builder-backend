const fastify = require('fastify')({
    logger: false
});
fastify.register(require('@fastify/formbody'));
const path = require('path');
const DBConnection = require('./config/db');
const { apiKeyAuth } = require('./middlewares/auth');
const roleCheck = require('./middlewares/RoleBasedAccessControl');
const verifyJWT = require('./middlewares/verifyJwt');
const ResumeRoute = require('./routes/ResumeRoute');
const UserRoute = require('./routes/UserRoute');
const StripeRoute = require('./routes/StripeRoute');
const OpenaiRoute = require('./routes/OpenaiRoute');
const PrintResume = require('./routes/PrintResume');
const cors = require('@fastify/cors');
const cookie = require('@fastify/cookie');
const multer = require('fastify-multer');
const { webhook, razorpayWebhook } = require('./controllers/stripeController');
const AnalysisRoute = require('./routes/AnalysisRoute');
const SummaryRoute = require('./routes/SummaryRoute');
const EmailRoute = require('./routes/EmailRoute');
const BlogRoute = require('./routes/BlogRoute');
const PaymentRoute = require('./routes/PaymentRoute');
const NewsletterRoute = require('./routes/NewsLetterRoute');
const CoachRoute = require('./routes/CoachRoute');
const coachAuth = require('./middlewares/coachAuth');
const UploadRoute = require('./routes/UploadRoute');

require('dotenv').config();

// Register plugins
fastify.register(cookie);
// fastify.register(require('@fastify/swagger'), {
//     openapi: {
//         openapi: '3.0.0',
//         info: {
//             title: 'Test swagger',
//             description: 'Testing the Fastify swagger API',
//             version: '0.1.0'
//         },
//         servers: [
//             {
//                 url: `http://localhost:${process.env.PORT}/docs`,
//                 description: 'Development server'
//             }
//         ],
//         tags: [
//             { name: 'user', description: 'User related end-points' },
//             { name: 'code', description: 'Code related end-points' }
//         ],
//         components: {
//             securitySchemes: {
//                 apiKey: {
//                     type: 'apiKey',
//                     name: 'apiKey',
//                     in: 'header'
//                 }
//             }
//         },
//         externalDocs: {
//             url: 'https://swagger.io',
//             description: 'Find more info here'
//         }
//     }
// });

fastify.register(cors, {
    origin: [
        "http://localhost:3000",
        "http://localhost:3002",
        'https://careergenie-24.vercel.app',
        'https://career-genies-frontend.vercel.app',
        'https://testing-cg-frontend.vercel.app',
        "https://sea-turtle-app-2-e6fjt.ondigitalocean.app",
        "https://geniescareerhub.com"
    ],
    allowedHeaders: [
        "Content-Type",
        "Accept",
        "Authorization",
        "x-api-key",
        "Access-Control-Allow-Origin",
        "X-Requested-With",
        "Referer",
        "Origin",
        "Cache-Control",
        "X-CSRF-Token",
        "User-Agent",
        "Accept-Language"
    ],
    credentials: true,
    preflightContinue: true
});

fastify.decorate('verifyJWT', verifyJWT);
fastify.decorate('roleCheck', roleCheck);
fastify.decorate('coachAuth', coachAuth);
// fastify.decorate('coachRoleCheck',)

const storage = multer.memoryStorage();
fastify.register(multer.contentParser);

// Register the routes
fastify.register(UploadRoute , { prefix: '/api/upload', before: apiKeyAuth });
fastify.register(UserRoute, { prefix: '/api/user', before: apiKeyAuth });
fastify.register(ResumeRoute, { prefix: '/api/resume', before: apiKeyAuth });
fastify.register(OpenaiRoute, { prefix: '/api/openai', before: apiKeyAuth });
fastify.register(PrintResume, { prefix: "/api/print", before: apiKeyAuth });
fastify.register(StripeRoute, { prefix: "/api/stripe", before: apiKeyAuth });
fastify.register(AnalysisRoute, { prefix: "/api/analysis", before: apiKeyAuth });
fastify.register(SummaryRoute, { prefix: "/api/summary", before: apiKeyAuth });
fastify.register(EmailRoute, { prefix: "/api/message", before: apiKeyAuth });
fastify.register(BlogRoute, { prefix: "/api/blog", before: apiKeyAuth });
fastify.register(PaymentRoute, { prefix: "/api/payment", before: apiKeyAuth });
fastify.register(NewsletterRoute, { prefix: "/api/newsletter", before: apiKeyAuth });
fastify.register(CoachRoute, { prefix: "/api/coach", before: apiKeyAuth });

// Custom content type parser for webhook route
fastify.addContentTypeParser('application/json', { parseAs: 'buffer' }, function (req, body, done) {
    if (req.url === '/webhook') {
        req.rawBody = body;
        done(null, body);
    } else {
        done(null, JSON.parse(body));
    }
});

fastify.post("/webhook", webhook);

fastify.post("/webhookrazorpay", razorpayWebhook);

const start = async () => {
    try {
        await DBConnection();
        await fastify.listen({ port: process.env.PORT || 3009, host: '0.0.0.0' });
        fastify.log.info(`Server started on PORT ${fastify.server.address().port}`);
    } catch (error) {
        console.log(error);
        fastify.log.info("Server connection error");
    }
};

start();
