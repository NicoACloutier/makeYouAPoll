# Make You A Poll

A full-stack web application for poll creation, dissemination, and answering.

![The registration page.](/register.png?raw=true "The registration page.")
![The login page.](/login.png?raw=true "The login page.")
![The poll creation page.](/create.png?raw=true "The poll creation page.")
![An empty poll.](/empty.png?raw=true "An empty poll.")
![An unanswered poll.](/unanswered.png?raw=true "An unanswered poll.")
![An answered poll.](/full.png?raw=true "An answered poll.")
![A user page.](/user.png?raw=true "A user page.")
![The homepage.](/recent.png?raw=true "The homepage.")


## Running the application

To run the application natively requires Node.js, React, Express, and PostgreSQL. To run the application, you must run both the server and client portions.

### Running the client

To make sure you have all required dependencies, run the command `npm i` from the `client` directory. Once all of the packages are installed, you should be able to run `npm start` from this same directory to launch the client.

### Running the server

First, enter the commandline `psql` application and create tables as described in the tech stack database section. Then, edit the file entitled `pool.js` in the `server/src/routes` directory to contain the correct username, hostname, database name, password, and port. Following this, return to the `server` directory and run `npm i`. You should then be able to run `node index.js` to run the server.

## Tech stack

The web application uses Express with a React frontend and PostgreSQL server.

### Database

The database contains four relational tables. The `polls` table contains five columns: `poll_id` (`VARCHAR(50)`, `n_options` (`INTEGER`), `user_id` (`INTEGER`), `question` (`VARCHAR 200`), and `end_time` (`TIMESTAMP`). These columns refer to the unique identifier for the poll, the number of answers the poll has, the unique identifier for the user that created the poll, the question itself, and the time that the poll will expire, set by the user upon poll creation. The `answers` table contains 3 columns: `poll_id` (`VARCHAR(50)`), `answer_id` (`INTEGER`), `answer_text` (`VARCHAR(200)`). These refer to the unique identifier for the poll the answer is for, the index of the answer among the array of all answers for this poll, and the answer's text iself, respectively. The `users` table contains 5 columns: `user_id` (`SERIAL`), `salt` (`VARCHAR(20)`), `hash` (`VARCHAR(250)`), `email` (`VARCHAR(100)`), `name` (`VARCHAR(100)`). These refer to the unique identifier for the user, a random string of 20 characters generated to disassociate the hash from the password given, the result of a hashing function performed on the user's password with the salt appendend to the end, the user's email, and the user's username, respectively. The final table is the `entries` table, which contains the columns `poll_id` (`VARCHAR(50)`), `answer_id` (`INTEGER`), and `user_id` (`INTEGER`). These refer to the unique identifier of the poll a user has answered, the index of the answer they chose, and the unique identifier for the user.

## Project information

This project was started by [Nicolas Antonio Cloutier](mailto:nicocloutier1@gmail.com) in 2024. There are no additional contributors as of yet. If you have suggestions, issues, or additions, feel free to open an issue or pull request on the [GitHub page](https://github.com/NicoACloutier/makeYouAPoll). This project operates under the MIT license. Licensing information can be found in the file entitled `LICENSE` in this project's top-level directory.
