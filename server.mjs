import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import bodyParser from 'body-parser';

const CLIENT_ID = "Ov23liqjm1vU7RSIfN3J";
const CLIENT_SECRET = "598e9c61926358b240a0f08b5351ffb96c0514ad";

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/getAccessToken', async function (req, res) {
    const code = req.query.code;
    console.log("Received code: ", code);
    const params = new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code
    });

    try {
        const response = await fetch("https://github.com/login/oauth/access_token", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: params.toString()
        });
        const data = await response.json();
        console.log(data);
        res.json(data);
    } catch (error) {
        console.error("Error fetching access token: ", error);
        res.status(500).json({ error: 'Failed to fetch access token' });
    }
});

app.get('/getUserData', async function (req, res) {
    const authHeader = req.get("Authorization");
    console.log("Authorization header: ", authHeader);
    try {
        const response = await fetch("https://api.github.com/user", {
            method: "GET",
            headers: {
                "Authorization": authHeader,
                "Accept": "application/vnd.github.v3+json"
            }
        });
        const data = await response.json();
        console.log(data);
        res.json(data);
    } catch (error) {
        console.error("Error fetching user data: ", error);
        res.status(500).json({ error: 'Failed to fetch user data' });
    }
});

app.listen(4000, function () {
    console.log("CORS server is running on port 4000");
});
