# Instructions To Start Server


## Getting started
To get started, please run ``npm install`` to install the required dependencies.

## Starting the server
Note that the server is hosted on port ``8000``. To get the server running, you can run ``npm run start`` or ``node server.js``; the server assumes that a MongoDB session is started on the specified URI in the document, which is `mongodb://127.0.0.1:27017/fake_so`.   

## Description of Backend
The backend here has been built with using a non-relational database such as MongoDB and running it locally on `mongodb://127.0.0.1:27017/fake_so` as per instructed in the document. The backend has been built with Express and NodeJS where we used Express to build a RESTful API (although not documented) for the client side to interact with; it is, then, hosted on a NodeJS server on port 8000, or `http://localhost:8000` as per the instructions in the document.</br>

For authentication, we went with storing tokens in the `local storage` in the browser. So, when the client-side needs to interact with the server side, a token is needed for each user and guest user (there is a specific token for guests). But, csrf attacks can always happenThe token was given using the `jwt` library.  

The ``config.js`` file holds the configurations for the server; although I do understand that a ``.env`` is the most common way to do it now, but wasn't sure if we were allowed to that or limited to it.   

Console output is shown each time from using `morgan` middleware which logs any CRUD request. 

As a simple way of detecting any unique validations in mongoose, a library like `mongoose-unique-validator` was simple enough to configure and easy to use to detect whether emails of users were unique or not.  






