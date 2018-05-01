# RoommateFinder [![Build Status](https://travis-ci.org/rikenshah/RoommateFinder.svg?branch=master)](https://travis-ci.org/rikenshah/RoommateFinder)

SEng 18 Project 2

### Abstract

In this work, we have surveyed and examined the problems of communication gap and trust issues faced by current graduate students despite having social media groups to bond with each other for finding potential roommates. We look into the existing solutions developed and analyze the code as well as results in great details and propose an improved solution to solve this problem. We also demonstrate the inefficiencies of existing solutions and how we can modify those to improve the overall results. At the same time, we also propose radically different attributes and features that will help in making the application more dynamic, scalable, feature-rich and user-friendly.  

### Steps to Install and Run (Developer Guide)

1. Make sure `Node.JS` is installed and is working in your machine. (Check using `node -v`).
2. Install `MongoDB` and start the server.
3. Clone the repo, using `git clone https://github.com/rikenshah/RoommateFinder`.
4. Change to that directory `cd RoommateFinder`.
5. Download node packages using `npm install && npm update`.
6. Add appropriate tokens in `.env`. The few things you will need are,
    ```
    SendBird_App_Id='Enter your sendbird app id here'
    SendBird_Api_Token='Enter your sendbird api token here'
    PORT=8080
    MONGO_CONNECTION_STRING='Enter your mongo db url'
    GOOGLE_CLIENT_ID='Enter your google client id here'
    GOOGLE_CLIENT_SECRET='Enter your google client secret here'
    GOOGLE_CALLBACK_URL='Enter your google callback url'
    ```
7. Start the application by typing `npm start`. This will start the server at `localhost:8080`.

### Use Cases

1. Recommendations
2. Chat
3. Personality API
4. Search

### Team Information

[Riken Shah](https://github.com/rikenshah)<br>
[Mateenrehan Shaikh](https://github.com/mateenrehan)<br>
[Himani Himani](https://github.com/hhimani)<br>
[Aaroh Gala](https://github.com/AarohGala)<br>

TA/Mentor : [Ken Tu](https://github.com/HuyTu7)<br>
Professor : [Tim Menzies](https://github.com/timm)<br>


