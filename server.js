const express = require('express');
const app = express();
const http = require('http');
exports.dotenv = require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');
const globalRoutes = require('./router/global')
const bodyParser = require('body-parser')

const port = process.env.PORT;
const hostname = process.env.HOST_NAME
const path = require('path')
// const httpServer = http.createServer(app)

const is_ssl = process.env.IS_SSL === 'true' || process.env.IS_SSL === '1' || process.env.IS_HTTPS === 'true' || process.env.IS_HTTPS === '1';
var fs = require('fs');


let Server;

if (is_ssl) {
    const https = require('https');
    var key = fs.readFileSync("./utilities/webkey.key");
    var cert = fs.readFileSync("./utilities/webcert.crt");
    var cacert = fs.readFileSync("./utilities/webca.crt");
    var options = {
        key: key,
        cert: cert,
        ca: cacert,
        requestCert: false,
        rejectUnauthorized: true
    };
    Server = https.createServer(options, app);
}
else {
    Server = http.createServer(app);
}


// const tokentest = require('./services/list_api/api').getJWTToken

app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb', extended: true }));



app.use('/static', express.static(path.join(__dirname, 'uploads')));

app.use('/', (req, res, next) => {
    let supportKey = req.headers['supportkey'];
    console.log("Requested Method : -", req.method, req.url, "public Ip :", req.connection.remoteAddress, "supportkey : ", supportKey);
    next();
})


app.use(cors({
    origin: "*"
}));
app.use(helmet());
app.disable('x-powered-by');


app.use('/', globalRoutes);

// Global express error handler to prevent crashing on route errors
app.use((err, req, res, next) => {
    console.error("Unhandled Route Error:", err);
    if (!res.headersSent) {
        res.status(500).json({ code: 500, message: "Internal server error" });
    }
});

// Process-level crash prevention
process.on('uncaughtException', (err) => {
    console.error(new Date(), 'Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error(new Date(), 'Unhandled Rejection at:', promise, 'reason:', reason);
});

Server.listen(port, hostname, async () => {
    console.log(`Server listening on http://${hostname}:${port}`);
    // let token = await tokentest();
    // console.log("token", token);
});
