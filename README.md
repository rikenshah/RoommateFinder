# RoommateFinder [![Build Status](https://travis-ci.org/rikenshah/RoommateFinder.svg?branch=master)](https://travis-ci.org/rikenshah/RoommateFinder)

SEng 18 Project 2

### Abstract

In this work, we have surveyed and examined the problems of communication gap and trust issues faced by current graduate students despite having social media groups to bond with each other for finding potential roommates. We look into the existing solutions developed and analyze the code as well as results in great details and propose an improved solution to solve this problem. We also demonstrate the inefficiencies of existing solutions and how we can modify those to improve the overall results. At the same time, we also propose radically different attributes and features that will help in making the application more dynamic, scalable, feature-rich and user-friendly.  

### Access the Application

The application can be accessed from [here](https://findmeroommate.herokuapp.com/).

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

#### Recommendations

To give recommendations of the potential roommates to a user who is searching for one, we have used combination of K-means-clustering and k-nearest-neighbours algorithm. The goal of the combination algorithm was to reduce latency by increasing the performance of the system when the number of users in the system increases. The computational overhead can be significantly reduced by using such combination algorithm.

#### Chat

The application has an inbuilt chat where the users can chat with one another and can also do a group chat. The chat will help in easy communication between the roommates and the group chat will help if more than two roommates want to chat with one another.

#### Personality API

The magicsauce API takes in a text (which corresponds to the summary section of user profile) and gives various personality parameters like agreeableness, neuroticism, openness, etc. This values enables us to go beyond the user input while providing them appropriate recommendations.

#### Search
User can  search  across parameters   like   drinking   habits,   smoking   habits,   petfriendly,  visitor  friendly  etc.   We  also  made  it  optional  to skip  few  fields  and  fill  some.   As per your filtering criteria, the search queries will be dynamically created and results will be fetched.


### Team Information

[Riken Shah](https://github.com/rikenshah)<br>
[Mateenrehan Shaikh](https://github.com/mateenrehan)<br>
[Himani Himani](https://github.com/hhimani)<br>
[Aaroh Gala](https://github.com/AarohGala)<br>

TA/Mentor : [Ken Tu](https://github.com/HuyTu7)<br>
Professor : [Tim Menzies](https://github.com/timm)<br>


