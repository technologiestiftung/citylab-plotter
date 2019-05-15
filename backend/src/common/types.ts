import express = require('express');

export type AsyncRoute = (request: express.Request, response: express.Response) => Promise<void>;
