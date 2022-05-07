Read the Project Specfications [here](https://docs.google.com/document/d/1zZjNk9cbNLz0mp_-YtyZxhMzUph97fVgCkSE4u2k5EA/edit?usp=sharing).

Add design docs in *images/*

## Instructions to setup and run project
Please view the ``README.md`` of the respective folders for ``client/`` and ``server/``


## Design Patterns
None, since I coded this, sadly, before the design pattern lectures started (or finished).

## Miscellaneous
As a quick run down here, the web application is built with React(Router) for the frontend, and NodeJS, MongoDB, and Express. The login is secured with using a JSONWebToken (jwt) stored on the user's local storage and API requests are only allowed if the user has a valid user jwt token and based on the person's jwt token can the person do anything; for example, a user can only delete their own respective posts. The purpose of using the local storage to store tokens was that if a user were to close the browser and open it up again, they can stay logged in during the same session. If a user were to logout, the token is then removed from the user's local storage.

For guests, a token is also given to a guest to specifically indicate that this is a guest and can only view certain features that are allowed for them. For example, guests cannot delete or create posts. If a guest were to try and make a comment, for example, they would be shown an error. Similarly, guests are not allowed to answer questions as it will redirect them back to the login page.

Although using an express-session for session storing was learned in class, I wanted to try storing sessions on the client side (it wasn't specified so I decided to try it here); there were other more secure ways for logging in like in-memory storing sessions, but time constraints, or deadlines, were also a large issue, too. 

Thanks to [visual-paradigm](https://online.visual-paradigm.com) for a great way to design UML diagrams.

