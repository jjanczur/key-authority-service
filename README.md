# Login with MetaMask

This repo was build based on [Amaury Martuny's repo](https://github.com/amaurymartiny/login-with-metamask-demo) and his tutorial on how to perform signature-based authentication.

<!-- [![Build Status](https://travis-ci.org/amaurymartiny/login-with-metamask-demo.svg?branch=master)](https://travis-ci.org/amaurymartiny/login-with-metamask-demo)
[![David (backend)](<https://img.shields.io/david/amaurymartiny/login-with-metamask-demo.svg?label=deps%20(backend)&path=packages/backend>)](https://david-dm.org/amaurymartiny/login-with-metamask-demo?path=packages/backend)
[![David (frontend)](<https://img.shields.io/david/amaurymartiny/login-with-metamask-demo.svg?label=deps%20(frontend)&path=packages/frontend>)](https://david-dm.org/amaurymartiny/login-with-metamask-demo?path=packages/frontend)
[![](https://img.shields.io/badge/Buy%20me%20a%20tree-%F0%9F%8C%B3-lightgreen)](https://offset.earth/amaurymartiny) -->


## Live Demo



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
docker build -t login-front .
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
