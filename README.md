![myFlix Logo](public/img/myFlixLogo.png)
# Welcome to the myFlix API

![GitHub issues](https://img.shields.io/github/issues/eahowell/movie_api?color=yellow)
![GitHub Repo stars](https://img.shields.io/github/stars/eahowell/movie_api)
![GitHub forks](https://img.shields.io/github/forks/eahowell/movie_api)
![GitHub watchers](https://img.shields.io/github/watchers/eahowell/movie_api)

## 📖 Overview

 The client side of the myFlix app using React that's using the server-side [movie_api](https://github.com/eahowell/movie_api) (REST API and Database).  
 myFlix is a full-stack (MERN: MongoDB, Express, React, Node.js) single-page web application that serves as a movie database. Users can browse a curated list of movies with detailed information including descriptions, directors, and genre details. Registered users can create a profile, manage their account, and add movies to their favorites and watch lists.  

## 📎 Table of Contents
- [Welcome to the myFlix API](#welcome-to-the-myflix-api)
  - [📖 Overview](#-overview)
  - [📎 Table of Contents](#-table-of-contents)
  - [📺 Demo](#-demo)
  - [🛠️ Tech Stack](#️-tech-stack)
  - [🏎️ Getting Started](#️-getting-started)
    - [Prerequisites](#prerequisites)
  - [🔧 Installation](#-installation)
  - [⛓️ Dependencies](#️-dependencies)
    - [Core Dependencies](#core-dependencies)
    - [Dev Dependencies](#dev-dependencies)
  - [🔗 API Endpoints](#-api-endpoints)
      - [Retrieving ID's](#retrieving-ids)
      - [Interacting with the Users](#interacting-with-the-users)
      - [Interacting with Movies and Directors](#interacting-with-movies-and-directors)
  - [🪙 Authentication](#-authentication)
  - [🗄️ Database](#️-database)
  - [📂 Folder Structure](#-folder-structure)
  - [🤝 Contributing](#-contributing)
  - [🪪 License](#-license)
  - [✉️ Contact](#️-contact)


## 📺 Demo

- [Live myFlix Angular Frontend](https://eahowell.github.io/myFlix-Angular-client/welcome)
- [Live myFlix React Frontend](https://eahowell-myflix.netlify.app/)
- [Demo Video of React Frontend](https://www.loom.com/share/29a46cf2d8d64a64916970a9ffa01fd2?sid=ccd86a9f-8e26-4e9b-ab49-2ccfa9db7037)

  Test account:
    ```
    Username: testportfolio
    Password: 12345678 
    ```

[🔝](#welcome-to-the-myflix-api)
## 🛠️ Tech Stack

- **Language**: JavaScript (ES6+)
- **Runtime**: Node.js
- **Web Framework**: Express
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: Passport.js (Local & JWT strategies), JSON Web Tokens
- **Validation**: express-validator
- **Logging**: Morgan
- **Testing**: Jest, Supertest
- **Linting**: ESLint
- **Dev Tools**: Nodemon, Git, GitHub, Visual Studio Code  
  
[🔝](#welcome-to-the-myflix-api) 
## 🏎️ Getting Started
### Prerequisites

- Node.js (>= 14.x)
- npm (>= 6.x)
  
[🔝](#welcome-to-the-myflix-api)
## 🔧 Installation

  1. Clone the repository:
     ```bash
     git clone https://github.com/eahowell/movie_api.git
     cd movie_api
  2. Install dependencies:
      ```bash 
      npm install
      ```
  3. Start the development server:
      ```bash 
      npm run dev
      ```
[🔝](#welcome-to-the-myflix-api)  
## ⛓️ Dependencies
### Core Dependencies
- Bcrypt: ^5.1.1
- Body-Parser: ^1.20.2
- CORS: ^2.8.5
- dotenv: ^16.4.7
- Express: ^4.18.2
- Express-Validator: ^7.0.1
- JSONWebToken: ^9.0.2
- Lodash: ^4.17.21
- Method-Override: ^3.0.0
- Mongoose: ^8.2.1
- Morgan: ^1.10.0
- Passport: ^0.7.0
- Passport-JWT: ^4.0.1
- Passport-Local: ^1.0.0
- UUID: ^9.0.1
### Dev Dependencies

- ESlint: ^8.56.0
- Nodemon: ^3.0.3  
  
[🔝](#welcome-to-the-myflix-api)
## 🔗 API Endpoints

---

#### Retrieving ID's

<details>
 <summary><code>GET</code> <code><b>/genres/[Name]/id</b></code> <code>(returns the genreID from the genre name)</code></summary>

Parameters

> | Name | Type     | Data Type | Description           |
> | ---- | -------- | --------- | --------------------- |
> | Name | Required | String    | The name of the genre |

Responses

> | http code | content-type               | response                               |
> | --------- | -------------------------- | -------------------------------------- |
> | `200`     | `application/json`         | A JSON object holding the genreID      |
> | `400`     | `text/plain;charset=UTF-8` | "The genre " + Name + " was not found" |
> | `500`     | `text/plain;charset=UTF-8` | Description of the error               |

Example cURL

> ```javascript
>  curl -L GET "Content-Type: application/json" http://localhost:8080/genres/[Name]/id
> ```

</details>

<details>
 <summary><code>GET</code> <code><b>/actors/[Name]/id</b></code> <code>(returns the actorID from the actor name)</code></summary>

Parameters

> | Name | Type     | Data Type | Description           |
> | ---- | -------- | --------- | --------------------- |
> | Name | Required | String    | The name of the actor |

Responses

> | http code | content-type               | response                                    |
> | --------- | -------------------------- | ------------------------------------------- |
> | `200`     | `application/json`         | A JSON object holding the actorID           |
> | `400`     | `text/plain;charset=UTF-8` | "The actor " + actorName + " was not found" |
> | `500`     | `text/plain;charset=UTF-8` | Description of the error                    |

Example cURL

> ```javascript
>  curl -L GET "Content-Type: application/json" http://localhost:8080/actors/[Name]/id
> ```

</details>

<details>
  <summary><code>GET</code> <code><b>/directors/[Name]/id</b></code> <code>(returns the directorID from the director name)</code></summary>

Parameters

> | Name | Type     | Data Type | Description              |
> | ---- | -------- | --------- | ------------------------ |
> | Name | Required | String    | The name of the director |

Responses

> | http code | content-type               | response                                          |
> | --------- | -------------------------- | ------------------------------------------------- |
> | `200`     | `application/json`         | A JSON object holding the directorID              |
> | `400`     | `text/plain;charset=UTF-8` | "The director " + directorName + " was not found" |
> | `500`     | `text/plain;charset=UTF-8` | Description of the error                          |

Example cURL

> ```javascript
>  curl -L GET "Content-Type: application/json" http://localhost:8080/directors/[Name]/id
> ```

</details>

<details>
 <summary><code>GET</code> <code><b>/movies/[Movie Title]/id</b></code> <code>(returns the movieID from the movie title)</code></summary>

Parameters

> | Name        | Type     | Data Type | Description            |
> | ----------- | -------- | --------- | ---------------------- |
> | Movie Title | Required | String    | The title of the movie |

Responses

> | http code | content-type               | response                                |
> | --------- | -------------------------- | --------------------------------------- |
> | `200`     | `application/json`         | A JSON object holding the movieID       |
> | `400`     | `text/plain;charset=UTF-8` | "The movie " + title + " was not found" |
> | `500`     | `text/plain;charset=UTF-8` | Description of the error                |

Example cURL

> ```javascript
>  curl -L GET "Content-Type: application/json" http://localhost:8080/movies/[title]/id
> ```

</details>

<details>
  <summary><code>GET</code> <code><b>/users/[Username]/id</b></code> <code>(returns the userID from the username)</code></summary>

Parameters

> | Name     | Type     | Data Type | Description              |
> | -------- | -------- | --------- | ------------------------ |
> | Username | Required | String    | The username of the user |

Responses

> | http code | content-type               | response                                  |
> | --------- | -------------------------- | ----------------------------------------- |
> | `200`     | `application/json`         | A JSON object holding the userID          |
> | `400`     | `text/plain;charset=UTF-8` | "The user " + username + " was not found" |
> | `500`     | `text/plain;charset=UTF-8` | Description of the error                  |

Example cURL

> ```javascript
>  curl -L GET "Content-Type: application/json" http://localhost:8080/users/[Username]/id
> ```

</details>  

[🔝](#welcome-to-the-myflix-api)  

---

#### Interacting with the Users

<details>
  <summary><code>POST</code> <code><b>/users</b></code> <code>(allows new users to register)</code></summary>

Parameters

> None

Request Body

> A JSON object holding data about the user to add, structured like:
>
> ```json
> {
>   "Username": { type: String, required: true },
>   "Password": { type: String, required: true },
>   "Email": { type: String, required: true },
>   "Birthday": Date,
>   "FirstName": { type: String, required: true },
>   "LastName": { type: String, required: true }
> }
> ```

Responses

> | http code | content-type | response |
> | --------- | -------------------------- | ------------------------------------------------- |
> | `500` | `text/plain;charset=UTF-8` | Description of the error |
> | `422` | `application/json` | A JSON object holding an array of the validation errors |
> | `409` | `text/plain;charset=UTF-8` | username + " already exists" |
> | `201` | `application/json` | A JSON object holding data about the user that was added and including a userID, structured like: |
>
> ```json
> {
>   "Username": "String",
>   "Password": "String",
>   "Email": "String",
>   "FirstName": "String",
>   "LastName": "String",
>   "Birthday": Date,
>   "FavoriteMovies": [{ ObjectId }],
>   "ToWatch": [{ ObjectId }],
>   "_id": "String"
> }
> ```

Example cURL

> ```javascript
>  curl -L POST "Content-Type: application/json" http://localhost:8080/users
> ```

</details>

<details>
  <summary><code>POST</code> <code><b>/login</b></code> <code>(allows users to login)</code></summary>

Responses

> | http code | content-type | response |
> | --------- | -------------------------- | ------------------------------------------------- |
> | `500` | `text/plain;charset=UTF-8` | Description of the error |
> | `400` | `text/plain;charset=UTF-8` | Text response "Something is not right" |
> | `200` | `application/json` | A JSON object holding data about the user and the JWT token |

Example cURL

> ```javascript
>  curl -L POST "Content-Type: application/json" http://localhost:8080/login
> ```

</details>

<details>
  <summary><code>POST</code> <code><b>/validation</b></code> <code>(validate provided password)</code></summary>

Responses

> | http code | content-type | response |
> | --------- | -------------------------- | ------------------------------------------------- |
> | `500` | `text/plain;charset=UTF-8` | Description of the error |
> | `401` | `text/plain;charset=UTF-8` | Text response "Password was not correct" |
> | `404` | `text/plain;charset=UTF-8` | Text response "Username not found" |
> | `200` | `application/json` | true |

Example cURL

> ```javascript
>  curl -L POST "Content-Type: application/json" http://localhost:8080/validation
> ```

</details>

<details>
  <summary><code>GET</code> <code><b>/users</b></code> <code>(returns a list of all the users)</code></summary>

Parameters

> None

Responses

> | http code | content-type               | response                                          |
> | --------- | -------------------------- | ------------------------------------------------- |
> | `200`     | `application/json`         | A JSON object holding data about all of the users |
> | `500`     | `text/plain;charset=UTF-8` | Description of the error                          |

Example cURL

> ```javascript
>  curl -L GET "Content-Type: application/json" http://localhost:8080/users
> ```

</details>

<details>
  <summary><code>PUT</code> <code><b>/users/[Username]</b></code> <code>(allows users to update their user info)</code></summary>

Parameters

> | Name     | Type     | Data Type | Description              |
> | -------- | -------- | --------- | ------------------------ |
> | Username | Required | String    | The username of the user |

Request Body

> A JSON object holding data about the user to add, structured like:
>
> ```json
> {
>   "Username": "eahowell",
>   "Password": "Xyz123!",
>   "FirstName": "Liz",
>   "LastName": "Howell",
>   "Email": "eahowell@gmailx.com"
> }
> ```

Responses

> | http code | content-type               | response                                    |
> | --------- | -------------------------- | ------------------------------------------- |
> | `404`     | `text/plain;charset=UTF-8` | "Username " + username + " was not found"   |
> | `201`     | `application/json`         | A JSON object holding the updated user info |
> | `500`     | `text/plain;charset=UTF-8` | Description of the error                    |

Example cURL

> ```javascript
>  curl -L PUT "Content-Type: application/json" http://localhost:8080/users/[Username]
> ```

</details>

<details>
  <summary><code>GET</code> <code><b>/users/[Username]</b></code> <code>(returns the details of a specific user)</code></summary>

Parameters

> | Name     | Type     | Data Type | Description              |
> | -------- | -------- | --------- | ------------------------ |
> | Username | Required | String    | The username of the user |

Responses

> | http code | content-type               | response                                           |
> | --------- | -------------------------- | -------------------------------------------------- |
> | `200`     | `application/json`         | A JSON object holding data about the specific user |
> | `404`     | `text/plain;charset=UTF-8` | "Username " + username + " was not found"          |
> | `500`     | `text/plain;charset=UTF-8` | Description of the error                           |

Example cURL

> ```javascript
>  curl -L GET "Content-Type: application/json" http://localhost:8080/users/[Username]
> ```

</details>

<details>
  <summary><code>DELETE</code> <code><b>/users/[Username]</b></code> <code>(allows an existing user to delete their account)</code></summary>

Parameters

> | Name     | Type     | Data Type | Description              |
> | -------- | -------- | --------- | ------------------------ |
> | Username | Required | String    | The username of the user |

Responses

> | http code | content-type               | response                                                                  |
> | --------- | -------------------------- | ------------------------------------------------------------------------- |
> | `201`     | `application/json`         | A text message indicating the user was deregistered and removed as a user |
> | `404`     | `text/plain;charset=UTF-8` | "Username " + username + " was not found"                                 |
> | `500`     | `text/plain;charset=UTF-8` | Description of the error                                                  |

Example cURL

> ```javascript
>  curl -L GET "Content-Type: application/json" http://localhost:8080/users/[Username]
> ```

</details>

<details>
  <summary><code>PUT</code> <code><b>/users/[Username]/favorites/[MovieID]</b></code> <code>(allows users to add a movie to their *Favorites* list)</code></summary>

Parameters

> | Name     | Type     | Data Type | Description                  |
> | -------- | -------- | --------- | ---------------------------- |
> | Username | Required | String    | The username of the user     |
> | MovieID  | Required | String    | The \_id of the movie to add |

Responses

> | http code | content-type               | response                                    |
> | --------- | -------------------------- | ------------------------------------------- |
> | `201`     | `application/json`         | A JSON object holding the updated user data |
> | `404`     | `text/plain;charset=UTF-8` | "Username " + username + " was not found"   |
> | `500`     | `text/plain;charset=UTF-8` | Description of the error                    |

Example cURL

> ```javascript
>  curl -L PUT "Content-Type: application/json" http://localhost:8080/users/[Username]/favorities/[MovieID]
> ```

</details>

<details>
  <summary><code>PUT</code> <code><b>/users/[Username]/toWatch/[MovieID]</b></code> <code>(allows users to add a movie to their *To Watch* list)</code></summary>

Parameters

> | Name     | Type     | Data Type | Description                  |
> | -------- | -------- | --------- | ---------------------------- |
> | Username | Required | String    | The username of the user     |
> | MovieID  | Required | String    | The \_id of the movie to add |

Responses

> | http code | content-type               | response                                    |
> | --------- | -------------------------- | ------------------------------------------- |
> | `201`     | `application/json`         | A JSON object holding the updated user data |
> | `404`     | `text/plain;charset=UTF-8` | "Username " + username + " was not found"   |
> | `500`     | `text/plain;charset=UTF-8` | Description of the error                    |

Example cURL

> ```javascript
>  curl -L PUT "Content-Type: application/json" http://localhost:8080/users/[Username]/toWatch/[MovieID]
> ```

</details>

<details>
  <summary><code>DELETE</code> <code><b>/users/[Username]/favorites/[MovieID]</b></code> <code>(allows users to remove a movie from their *Favorites* list)</code></summary>

Parameters

> | Name     | Type     | Data Type | Description                     |
> | -------- | -------- | --------- | ------------------------------- |
> | Username | Required | String    | The username of the user        |
> | MovieID  | Required | String    | The \_id of the movie to remove |

Responses

> | http code | content-type               | response                                    |
> | --------- | -------------------------- | ------------------------------------------- |
> | `201`     | `application/json`         | A JSON object holding the updated user data |
> | `404`     | `text/plain;charset=UTF-8` | "Username " + username + " was not found"   |
> | `500`     | `text/plain;charset=UTF-8` | Description of the error                    |

Example cURL

> ```javascript
>  curl -L DELETE "Content-Type: application/json" http://localhost:8080/users/[Username]/favorities/[MovieID]
> ```

</details>

<details>
  <summary><code>DELETE</code> <code><b>/users/[Username]/toWatch/[MovieID]</b></code> <code>(allows users to remove a movie from their *To Watch* list)</code></summary>

Parameters

> | Name     | Type     | Data Type | Description                     |
> | -------- | -------- | --------- | ------------------------------- |
> | Username | Required | String    | The username of the user        |
> | MovieID  | Required | String    | The \_id of the movie to remove |

Responses

> | http code | content-type               | response                                    |
> | --------- | -------------------------- | ------------------------------------------- |
> | `201`     | `application/json`         | A JSON object holding the updated user data |
> | `404`     | `text/plain;charset=UTF-8` | "Username " + username + " was not found"   |
> | `500`     | `text/plain;charset=UTF-8` | Description of the error                    |

Example cURL

> ```javascript
>  curl -L DELETE "Content-Type: application/json" http://localhost:8080/users/[Username]/toWatch/[MovieID]
> ```

</details>

[🔝](#welcome-to-the-myflix-api)

---

#### Interacting with Movies and Directors

<details>
  <summary><code>GET</code> <code><b>/movies</b></code> <code>(returns a list of all the movies)</code></summary>

Parameters

> None

Responses

> | http code | content-type               | response                                           |
> | --------- | -------------------------- | -------------------------------------------------- |
> | `200`     | `application/json`         | A JSON object holding data about all of the movies |
> | `500`     | `text/plain;charset=UTF-8` | Description of the error                           |

Example cURL

> ```javascript
>  curl -L GET "Content-Type: application/json" http://localhost:8080/movies
> ```

</details>

<details>
  <summary><code>GET</code> <code><b>/movies/[Title]</b></code> <code>(returns the data of a specific movie)</code></summary>

Parameters

> | Name  | Type     | Data Type | Description            |
> | ----- | -------- | --------- | ---------------------- |
> | Title | Required | String    | The title of the movie |

Responses

> | http code | content-type               | response                                                          |
> | --------- | -------------------------- | ----------------------------------------------------------------- |
> | `500`     | `text/plain;charset=UTF-8` | Description of the error                                          |
> | `400`     | `text/plain;charset=UTF-8` | "The movie " + title + " was not found"                           |
> | `200`     | `application/json`         | A JSON object holding data about a specific movie in this format: |
>
> ```json
> {
>   "Genre": {
>     "Description": "Movies intended to elicit emotional responses from the audience, often featuring intense character    development and interpersonal conflicts.",
>     "Name": "Drama"
>   },
>   "Director": {
>     "Bio": "Boaz Yakin is an American filmmaker, screenwriter, and director known for his work on Remember the Titans and Fresh.",
>     "Birthday": "1966-06-20T05:00:00.000Z",
>     "Name": "Boaz Yakin"
>   },
>   "_id": "65ea3766ecc7df78687ec88f",
>   "Actors": ["Denzel Washington", "Will Patton", "Wood Harris"],
>   "Description": "A film based on the true story of a newly appointed African-American coach and his high school team on their first season as a racially integrated unit.",
>   "ImagePath": "image_url_here",
>   "Title": "Remember the Titans"
> }
> ```

Example cURL

> ```javascript
>  curl -L GET "Content-Type: application/json" http://localhost:8080/movies
> ```

</details>
<details>
  <summary><code>GET</code> <code><b>/directors</b></code> <code>(returns a list of all the directors)</code></summary>

Parameters

> None

Responses

> | http code | content-type               | response                                              |
> | --------- | -------------------------- | ----------------------------------------------------- |
> | `200`     | `application/json`         | A JSON object holding data about all of the directors |
> | `500`     | `text/plain;charset=UTF-8` | Description of the error                              |

Example cURL

> ```javascript
>  curl -L GET "Content-Type: application/json" http://localhost:8080/directors
> ```

</details>
<details>
  <summary><code>GET</code> <code><b>/directors/[Name]</b></code> <code>(returns the info of a specific director)</code></summary>

Parameters

> | Name | Type     | Data Type | Description              |
> | ---- | -------- | --------- | ------------------------ |
> | Name | Required | String    | The name of the director |

Responses

> | http code | content-type               | response                                                |
> | --------- | -------------------------- | ------------------------------------------------------- |
> | `500`     | `text/plain;charset=UTF-8` | Description of the error                                |
> | `400`     | `text/plain;charset=UTF-8` | "The director " + directorName + " was not found"       |
> | `200`     | `application/json`         | A JSON object holding data about the specific director. |
>
> ```json
> {
>   "_id_": "65ea58f9c4e85e82e09e8fa3",
>   "Name": "Christopher Nolan",
>   "Birthday": "1970-07-30T00:00:00.000Z",
>   "Deathday": null,
>   "Bio": "Christopher Edward Nolan is a British-American film director, producer, and screenwriter. He is known for his distinct filmmaking style, which often includes nonlinear narratives, complex plots, and philosophical themes. Nolan has directed several critically acclaimed and commercially successful films, including Inception, The Dark Knight Trilogy, and Interstellar."
> }
> ```

Example cURL

> ```javascript
>  curl -L GET "Content-Type: application/json" http://localhost:8080/directors/[Name]
> ```

</details>

<details>
  <summary><code>GET</code> <code><b>/genres</b></code> <code>(returns a list of all the genres)</code></summary>

Parameters

> None

Responses

> | http code | content-type               | response                                           |
> | --------- | -------------------------- | -------------------------------------------------- |
> | `200`     | `application/json`         | A JSON object holding data about all of the genres |
> | `500`     | `text/plain;charset=UTF-8` | Description of the error                           |

Example cURL

> ```javascript
>  curl -L GET "Content-Type: application/json" http://localhost:8080/genres
> ```

</details>

<details>
  <summary><code>GET</code> <code><b>/genres/[Genre]</b></code> <code>(returns the info of a specific genre)</code></summary>

Parameters

> | Name  | Type     | Data Type | Description                            |
> | ----- | -------- | --------- | -------------------------------------- |
> | Genre | Required | String    | The name of the genre you want info on |

Responses

> | http code | content-type               | response                                             |
> | --------- | -------------------------- | ---------------------------------------------------- |
> | `500`     | `text/plain;charset=UTF-8` | Description of the error                             |
> | `400`     | `text/plain;charset=UTF-8` | "The genre " + genre + " was not found"              |
> | `200`     | `application/json`         | A JSON object holding data about the specific genre. |
>
> ```json
> {
>   "_id": 6,
>   "Name": "Thriller",
>   "Description": "Movies characterized by intense excitement, suspense, and anticipation, often featuring plot twists and high stakes."
> }
> ```

Example cURL

> ```javascript
>  curl -L GET "Content-Type: application/json" http://localhost:8080/genres/[Genre]
> ```

</details>

<details>
  <summary><code>GET</code> <code><b>/actors/[Name]/movies</b></code> <code>(returns the movies a specific actor starred in)</code></summary>

Parameters

> | Name | Type     | Data Type | Description                                                    |
> | ---- | -------- | --------- | -------------------------------------------------------------- |
> | Name | Required | String    | The name of the actor your want to see the movies they were in |

Responses

> | http code | content-type               | response                                                |
> | --------- | -------------------------- | ------------------------------------------------------- |
> | `500`     | `text/plain;charset=UTF-8` | Description of the error                                |
> | `400`     | `text/plain;charset=UTF-8` | "The actor " + name + " was not found"                  |
> | `200`     | `application/json`         | A JSON object holding the movies the actor has been in: |
>
> ```json
> [
>   "The Lord of the Rings: The Fellowship of the Ring",
>   "Armageddon",
>   "The Strangers"
> ]
> ```

Example cURL

> ```javascript
>  curl -L GET "Content-Type: application/json" http://localhost:8080/actors/[Name]/movies
> ```

</details>

[🔝](#welcome-to-the-myflix-api)
## 🪙 Authentication  
- Uses LocalStrategy and JWTStrategy
- Users are authenticated with basic HTTP authentication and generating a JWT token for authenticating future requests
- JWTs are stored in `localStorage`.  
- Send as header:  `Authorization: Bearer <token>`   

[🔝](#welcome-to-the-myflix-api)
## 🗄️ Database
- myFlixDB is stored in MongoDB
- Collections include:
  - Users
  - Movies
  - Genres
  - Directors
  - Actors
 
[🔝](#welcome-to-the-myflix-api)
## 📂 Folder Structure
```text
movie_api/
├── public/
│   └── img/
│       └── myFlixLogo.png
├── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── moviesController.js
│   │   └── usersController.js
│   ├── middleware/
│   │   └── passport.js
│   ├── models/
│   │   ├── actor.js
│   │   ├── director.js
│   │   ├── genre.js
│   │   ├── movie.js
│   │   └── user.js
│   ├── routes/
│   │   ├── actors.js
│   │   ├── directors.js
│   │   ├── genres.js
│   │   ├── movies.js
│   │   └── users.js
│   ├── utils/
│   │   └── validators.js
│   └── index.js
├── tests/
│   ├── actors.test.js
│   ├── movies.test.js
│   └── users.test.js
├── .env
├── .gitignore
├── README.md
├── package.json
└── yarn.lock (or package-lock.json)
```   

[🔝](#welcome-to-the-myflix-api)

## 🤝 Contributing
1. Fork the repo  
2. Create a feature branch: `git checkout -b feature/your-feature-name`  
3. Commit your changes: `git commit -m "Add some feature"`  
4. Push to branch: `git push origin feature/your-feature-name`  
5. Open a pull request  
  
[🔝](#welcome-to-the-myflix-api)
## 🪪 License
- API uses ISC
  
[🔝](#welcome-to-the-myflix-api)
## ✉️ Contact

**Developer:** [Elizabeth Howell](ehowell.webdev@gmail.com)  
**Website:** [Portfolio](http://ehowell-dev.me/PortfolioWebsite/)  
**Twitter:** [ehowell_webdev](https://x.com/ehowell_webdev)  
**GitHub:** [eahowell](https://github.com/eahowell)
  
[🔝](#welcome-to-the-myflix-api)

---
 
Thank you for checking out myFlix! This application was developed as part of the Career Foundry Full-Stack Web Development Course to demonstrate skills in full-stack development, RESTful API design, authentication, and dynamic frontend rendering.
  
[🔝](#welcome-to-the-myflix-api)

[def]: #️-contact