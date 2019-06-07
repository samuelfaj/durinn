import * as express from "express";
import {Request, Response, NextFunction} from "express";

import Durinn from "../durinn";

const router = express.Router();

router.get('/', function(req: Request, res: Response, next: NextFunction) {
    res.json(Durinn.name)
});


export default router;