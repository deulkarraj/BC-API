// Updated code with fixes
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const resultParagraph = document.getElementById('result');
let transcript = 'Operation Unsuccessful'; // Using let since this will be reassigned

let recognition;

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

startButton.addEventListener('click', startRecognition);
stopButton.addEventListener('click', stopRecognition);

function startRecognition() {
    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            resultParagraph.textContent = 'Listening...';
        };

        recognition.onresult = (event) => {
            // Using let for transcript since we're reassigning it
            transcript = event.results[event.results.length - 1][0].transcript;
            resultParagraph.textContent = transcript;
        };

        recognition.onerror = (event) => {
            console.error('Error occurred:', event.error);
        };

        recognition.start();
    } else {
        console.error('SpeechRecognition API is not supported in this browser.');
    }
}

async function stopRecognition() {
    if (recognition) {
        recognition.stop();
        await sendDataToBusinessCentral();
    }
}

// Updated Business Central integration functions
async function getAccessToken() {
    try {
        const tokenEndpoint = 'https://login.microsoftonline.com/12ee7ca7-ad23-44b5-afa6-4f2a2cbdea54/oauth2/v2.0/token';
        const data = Qs.stringify({  // Note: Using Qs instead of qs when loaded from CDN
            client_id: 'ba95a7b7-2c93-43c6-9ba4-7370a6b9a4b6',
            client_secret: 'aTO8Q~elnCZYRRI.uFtD3DDLeM9GlzdO_POjWbKK',
            scope: 'https://api.businesscentral.dynamics.com/.default',
            grant_type: 'client_credentials',
        });

        const response = await axios.post(tokenEndpoint, data, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        return response.data.access_token;
    } catch (error) {
        console.error('Error getting token:', error);
        throw error;
    }
}

async function sendDataToBusinessCentral() {
    try {
        
        const token = await getAccessToken();
        const endpoint = 'https://api.businesscentral.dynamics.com/v2.0/12ee7ca7-ad23-44b5-afa6-4f2a2cbdea54/Development/WS/CRONUS%20USA%2C%20Inc./Page/AudioToTextAPI'

        const data = {
            "TranscribedText":'dgyudgyugdyuafduyagsygduygyasgyfsag'
        }

        const response = await axios.patch(endpoint, data, {
            headers: {
                'Authorization': `Bearer ${token}`,
                // 'Authorization': 'Bearer ${token}',
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        });

        if (response.status === 200) {
            console.log('Data sent successfully!');
        } else {
            console.error('Failed to send data:', response.statusText);
        }
    } catch (error) {
        console.error('Error sending data:', error);
        throw error;
    }
}








































// const startButton = document.getElementById('startButton');
// const stopButton = document.getElementById('stopButton');
// const resultParagraph = document.getElementById('result');
// let transcript = 'Operation Unsuccessful';

// let recognition;

// startButton.addEventListener('click', startRecognition);
// stopButton.addEventListener('click', stopRecognition);

// const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

// function startRecognition() {
//     if (SpeechRecognition) {
//         recognition = new SpeechRecognition();
//         recognition.lang = 'en-US'; // Set the language for recognition

//         recognition.onstart = () => {
//             resultParagraph.textContent = 'Listening...';
//         };

//         recognition.onresult = (event) => {
//             transcript = event.results[event.results.length - 1][0].transcript;
//             // sendToAzureSpeechService(transcript);
//             resultParagraph.textContent = transcript; // Display the transcript directly
//         };

//         recognition.onerror = (event) => {
//             console.error('Error occurred:', event.error);
//         };

//         recognition.start();
//     } else {
//         console.error('SpeechRecognition API is not supported in this browser.');
//     }
// }

// async function stopRecognition() {
//     if (recognition) {
//         // recognition.stop();
//         await sendDataToBusinessCentral(transcript);
//     }
// }





// const axios = require('axios');
// const qs = require('qs');

// async function getAccessToken() {
//     const tokenEndpoint = 'https://login.microsoftonline.com/12ee7ca7-ad23-44b5-afa6-4f2a2cbdea54/oauth2/v2.0/token';
//     const data = qs.stringify({
//         client_id: 'af6c8435-f1cf-4d04-a0e7-4e389e6ff9a7',
//         client_secret: 'Nd18Q~5KT~2dpItaGnRz3iirpz4JypuDadf1mcLT',
//         scope: 'https://api.businesscentral.dynamics.com/.default',
//         grant_type: 'client_credentials',
//     });

//     const response = await axios.post(tokenEndpoint, data, {
//         // headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//          headers: { 'Content-Type': 'application/text' },
//     });

//     return response.data.access_token;
// }

// async function sendDataToBusinessCentral(data) {
//     const token = await getAccessToken();
//     const endpoint = 'https://api.businesscentral.dynamics.com/v2.0/12ee7ca7-ad23-44b5-afa6-4f2a2cbdea54/Development/WS/CRONUS%20USA%2C%20Inc./Codeunit/SpeechToText';

//     const response = await axios.patch(endpoint, data, {
//         headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json',
//         },
//     });

//     if (response.status === 200) {
//         console.log('Data sent successfully!');
//     } else {
//         console.error('Failed to send data:', response.statusText);
//     }
// }








































// const startButton = document.getElementById('startButton');
// const stopButton = document.getElementById('stopButton');
// const resultParagraph = document.getElementById('result');

// let recognition;

// startButton.addEventListener('click', startRecognition);
// stopButton.addEventListener('click', stopRecognition);

// const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

// function startRecognition() {
//     if (SpeechRecognition) {
//         recognition = new SpeechRecognition();
//         recognition.lang = 'en-US'; // Set the language for recognition

//         recognition.onstart = () => {
//             resultParagraph.textContent = 'Listening...';
//         };

//         recognition.onresult = (event) => {
//             const transcript = event.results[event.results.length - 1][0].transcript;
//             // sendToAzureSpeechService(transcript);
//             resultParagraph.textContent = transcript; // Display the transcript directly
//         };

//         recognition.onerror = (event) => {
//             console.error('Error occurred:', event.error);
//         };

//         recognition.start();
//     } else {
//         console.error('SpeechRecognition API is not supported in this browser.');
//     }
// }

// function stopRecognition() {
//     if (recognition) {
//         recognition.stop();
//     }
// }



























    // let recognition;
        // let finalTranscript = '';
        // const startButton = document.getElementById('startButton');
        // const stopButton = document.getElementById('stopButton');
        // const resultDiv = document.getElementById('result');

        // if ('webkitSpeechRecognition' in window) {
        //     recognition = new webkitSpeechRecognition();
        //     recognition.continuous = true;
        //     recognition.interimResults = true;

        //     recognition.onstart = () => {
        //         startButton.classList.add('recording');
        //         startButton.disabled = true;
        //         stopButton.disabled = false;
        //         resultDiv.innerHTML = 'Listening...';
        //     };

        //     recognition.onresult = (event) => {
        //         let interimTranscript = '';
        //         for (let i = event.resultIndex; i < event.results.length; i++) {
        //             const transcript = event.results[i][0].transcript;
        //             if (event.results[i].isFinal) {
        //                 finalTranscript += transcript + ' ';
        //             } else {
        //                 interimTranscript += transcript;
        //             }
        //         }
        //         resultDiv.innerHTML = finalTranscript + '<i style="color: #999">' + interimTranscript + '</i>';
        //     };

        //     recognition.onerror = (event) => {
        //         console.error('Speech recognition error:', event.error);
        //         stopRecording();
        //     };

        //     recognition.onend = () => {
        //         stopRecording();
        //     };

        //     startButton.onclick = () => {
        //         finalTranscript = '';
        //         recognition.start();
        //     };

        //     stopButton.onclick = () => {
        //         recognition.stop();
        //         // sendToBusinessCentral(finalTranscript);
        //     };

        //     function stopRecording() {
        //         startButton.classList.remove('recording');
        //         startButton.disabled = false;
        //         stopButton.disabled = true;
        //     }

        //     function sendToBusinessCentral(text) {
        //         // Replace with your Business Central endpoint
        //         const bcEndpoint = 'your-business-central-endpoint';
                
        //         fetch(bcEndpoint, {
        //             method: 'POST',
        //             headers: {
        //                 'Content-Type': 'application/json',
        //             },
        //             body: JSON.stringify({ recognizedText: text })
        //         })
        //         .then(response => response.json())
        //         .then(data => {
        //             console.log('Success:', data);
        //         })
        //         .catch((error) => {
        //             console.error('Error:', error);
        //         });
        //     }
        // } else {
        //     resultDiv.innerHTML = 'Speech recognition is not supported in this browser.';
        //     startButton.disabled = true;
        //     stopButton.disabled = true;
        // }




// function sendToAzureSpeechService(transcript) {
//     const apiKey = '30ed5e6dfb2e4239ad2ede908e996d1a'; // Replace with your actual key
//     const region = 'eastus'; // Replace with your actual region

//     const url = `https://eastus.stt.speech.microsoft.com/speech/v3.0/recognize?language=en-US`;
//     const headers = {
//         'Ocp-Apim-Subscription-Key': apiKey,
//         'Content-type': 'application/json'
//     };

//     const body = {
//         "audio": {
//             "content": transcript,
//             "format": "text/plain"
//         }
//     };

//     console.log('JSON data before sending:', body);

//     fetch(url, {
//         method: 'POST',
//         headers: headers,
//         body: JSON.stringify(body)
//     })
//     .then(response => response.json())
//     .then(data => {
//         const recognizedText = data.results[0].alternatives[0].transcript;
//         resultParagraph.textContent = recognizedText;
//     })
//     .catch(error => {
//         console.error('Error sending to Azure Speech Service:', error);
//     });
// }

