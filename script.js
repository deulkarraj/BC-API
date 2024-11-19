// // index.js

// Step 1: Configure MSAL.js
const msalConfig = {
    auth: {
        clientId: 'ba95a7b7-2c93-43c6-9ba4-7370a6b9a4b6', // Replace with your app's client ID
        authority: 'https://login.microsoftonline.com/12ee7ca7-ad23-44b5-afa6-4f2a2cbdea54', // Replace with your tenant ID or common
        // redirectUri: 'https://deulkarraj.github.io' // Your redirect URI
        // redirectUri: 'http://127.0.0.1:5500/index.html'
        redirectUri: 'https://businesscentral.dynamics.com/12ee7ca7-ad23-44b5-afa6-4f2a2cbdea54/Development?company=CRONUS%20USA%2C%20Inc.&node=00000000-6136-0000-1516-5400836bd2d2&page=89&dc=0&bookmark=17_pwAAAAJ7_0oAMAAwADAAMQAw'

        
    }
};

// Step 2: Create an instance of PublicClientApplication
const msalInstance = new msal.PublicClientApplication(msalConfig);

// Step 3: Define login request
const loginRequest = {
    scopes: ['https://api.businesscentral.dynamics.com/.default'] // Replace with your API scope
};

// Step 4: Add authentication and token retrieval logic
async function authenticateAndGetToken() {
    try {
        // Check if the user is already logged in
        const accounts = msalInstance.getAllAccounts();
        let accessToken = '';

        if (accounts.length > 0) {
            // Attempt to acquire token silently
            const silentRequest = {
                account: accounts[0],
                scopes: loginRequest.scopes
            };
            const silentResult = await msalInstance.acquireTokenSilent(silentRequest);
            accessToken = silentResult.accessToken;
        } else {
            // Prompt for login and acquire token
            const loginResponse = await msalInstance.loginPopup(loginRequest);
            const tokenRequest = {
                account: loginResponse.account,
                scopes: loginRequest.scopes
            };
            const tokenResponse = await msalInstance.acquireTokenSilent(tokenRequest);
            accessToken = tokenResponse.accessToken;
        }

        console.log('Access token retrieved:', accessToken);
        return accessToken;

    } catch (error) {
        console.error('Error during authentication/token acquisition:', error);
        throw new Error(`Failed to get access token: ${error.message}`);
    }
}

// Step 5: Modify the function to send data to Business Central
async function sendDataToBusinessCentral(transcript) {
    try {
        const token = await authenticateAndGetToken();
        
        const endpoint = `https://api.businesscentral.dynamics.com/v2.0/12ee7ca7-ad23-44b5-afa6-4f2a2cbdea54/Development/ODataV4/Company('CRONUS%20USA%2C%20Inc.')/AudioToTextAPI`;

        const data = {
            TranscribedText: transcript
        };

        const response = await axios.post(endpoint, data, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        if (response.status === 201) {
            console.log('Data sent successfully!');
            return response.data;
        } else {
            throw new Error(`Failed with status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error sending data to Business Central:', error);
        throw new Error('Failed to send data to Business Central');
    }
}

// Existing functions for handling SpeechRecognition remain unchanged
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const resultParagraph = document.getElementById('result');
let recognition;
let transcript = '';

startButton.addEventListener('click', startRecognition);
stopButton.addEventListener('click', stopRecognition);

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

function startRecognition() {
    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            resultParagraph.textContent = 'Listening...';
        };

        recognition.onresult = (event) => {
            transcript = event.results[event.results.length - 1][0].transcript;
            resultParagraph.textContent = transcript;
        };

        recognition.onerror = (event) => {
            console.error('Error occurred:', event.error);
            resultParagraph.textContent = `Error: ${event.error}`;
        };

        recognition.start();
    } else {
        console.error('SpeechRecognition API is not supported in this browser.');
        resultParagraph.textContent = 'Speech recognition not supported in this browser';
    }
}

const urlParams = new URLSearchParams(window.location.search);
const redirectUrl = urlParams.get('redirectUrl');

async function stopRecognition() {
    if (recognition) {
        recognition.stop();
        try {
            await sendDataToBusinessCentral(transcript);
            resultParagraph.textContent = 'Data sent successfully!';
            
            if (redirectUrl) {
                window.location.href = redirectUrl;  // Redirect back to the original page
            } else {
                console.error('No redirect URL provided.');
            }
        } catch (error) {
            console.error('Error sending data:', error);
            resultParagraph.textContent = `Error sending data: ${error.message}`;
        }
    }
}
