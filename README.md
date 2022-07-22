# NUS Orbital Project 2022 - Gather

A web app project for NUS's summer project Orbital (CP2106). Developed using the MERN (MongoDB, Express, React, Node) stack over Summer 2022 (May - Aug).

## Team Members

Tang Kyn-Han  
Lim Jun Hong, Don

## Website Link

https://main--orbital-gather.netlify.app/

## Documentation

https://docs.google.com/document/d/19zqN8dPkPoJ8vqAqu2n2_ZDLb4BeswQS9QnDeCeIlb0/edit?usp=sharing

## Running the application locally

### Step 1. Clone the repository

Fork the repository, then clone the repository locally by doing -

```sh
  git clone git@github.com:donljh/orbital22-gather.git
```

### Step 2. Install Dependencies

In the root folder, do npm install (to install concurrently)

```sh
npm install
```

Then, do npm run build, to collectively install all dependencies for both frontend/backend

```sh
npm run build
```

Alternatively, you can install the dependencies separately by doing cd client/server and doing npm install

### Step 3. Setup .env

To run the server you need to provide the `.env` variables

- Create a new .env file in the server folder
- Open the [.env.example] file in the server/config folder
- Copy the contents and paste it into the .env file with valid keys

### Step 4. Run the application

With everything properly set up, you should be good to go! From the root directory, do npm start to run both front/backend at once

Alternatively, you can run them separately by doing cd client/server and doing npm start

```sh
npm start
```
