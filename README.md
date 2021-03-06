# Key Authority Service

This service is part of my master thesis on the decentralization of trust in digital content distribution using blockchain.

 The buyer is redirected to the delivery services from the merchant service. After being redirected, the ownership of the blockchain wallet needs to be verified.

The delivery service is composed of the back end, which stores the data and verifies the user, and the front end, which allows users to interact with the system. The service is implemented in TypeScript, React.ts components as a front end client and Express.ts, Web3.ts as a back end server. The front end communicates with the back end via REST API. 

The service requests the user to prove that they own a private key to the blockchain wallet by signing the random string. The front end sends back the signature to the back end, which verifies it. If the authentication was successful, the back end generates the JWT session token, which will be used for the authenticated calls to the back end, and the secured session is established.

In order to allow verified buyers accessing the content, the backend checks if the verified wallet owns a digital ERC20 token - access rights to the content after the positive verification buyer is allowed to accessing the content.


## Live Demo

https://www.youtube.com/watch?v=B4-gsvnvECI

## Getting Started

I use [lerna](https://github.com/lerna/lerna) to manage a monorepo of packages here. There are 2 packages: a [`backend`](https://github.com/amaurymartiny/login-with-metamask-demo/tree/master/packages/backend) which is a REST API written in Express, and a [`frontend`](https://github.com/amaurymartiny/login-with-metamask-demo/tree/master/packages/frontend) which is a React single-page application. It's really a demo, so I tried to use as few libraries as possible, and the most popular ones when possible.

The simplest way to get started is to launch the demo using Docker Compose. Alternatively you could launch docker the containers manually, or run the node services using yarn.

#### Launch the demo using Docker Compose:

```bash
docker-compose up -d
```

This will leave a the bakcend listening on `localhost:8000` and the frontend on `localhost:3000`.

#### Launching the demo using Docker:

Build and launch the backend:

```bash
cd backend
docker build -t login-backend .
docker run -d -p 8000:8000 login-backend
```

Build and launch the frontend:

```bash
cd frontend
docker build -t login-frontend .
docker run -d -p 3000:3000 login-frontend
```

You can then access the app on `localhost:3000`.

#### Start the demo using Yarn:

From the root folder of this repo, run

```bash
yarn install # Install the dependencies
yarn start # Will launch the frontend and the backend at the same time
```

The backend should be running on `localhost:8000`, and the frontend on `localhost:3000`.

Alternatively, you can start the frontend and the backend separately:

```bash
# Start the backend
cd packages/backend
yarn start

# Start the frontend
cd packages/frontend
yarn start
```

## Tests

Since this project is a demo, I haven't written any tests for it. Only code linting is performed, via prettier, which you can run using `yarn lint`.

## Thanks Amaury Martuny!

This repo was build based on [Amaury Martuny's tutorial](https://www.toptal.com/ethereum/one-click-login-flows-a-metamask-tutorial) on how to perform signature-based authentication.
