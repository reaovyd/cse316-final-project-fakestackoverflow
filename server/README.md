# Instructions To Start Server

## Description of Backend
The backend here has been built with using a non-relational database such as MongoDB and running it locally on mongodb://127.0.0.1:27017/fake_so as per instructed in the document. The backend has been built with Express and NodeJS where we used Express to build a RESTful API (although not documented) for the client side to interact with; it is, then, hosted on a NodeJS server on port 8000, or `http://localhost:8000` as per the instructions in the document.</br>

For authentication, we went with (it's really not secure to do this) storing tokens in the `local storage` in the browser. So, when the client-side needs to interact with the server side, a token is needed for each user and guest user (there is a specific token for guests). The token was given using the `jwt` library.  

## Getting started
To get started, please run ``npm install`` to install the required dependencies.

## Starting the server
Note that the server is hosted on port ``8000``. To get the server running, you can run ``npm run start`` or ``node server.js``.


