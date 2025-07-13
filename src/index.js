"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = handler;
// import express from 'express';
const click_service_1 = require("./src/service/click-service");
require("dotenv/config");
// const app = express();
// const clickService = new ClickService();
function getPeriod() {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12)
        return 'Good Morning';
    if (hour >= 12 && hour < 18)
        return 'Good Afternoon';
    return 'Good Night';
}
// app.get('/', (req, res) => {
//   try {
//     const label = getPeriod();
//     res.json(`${label ?? "Hello"} Holder`)
//   }
//   catch (err) {
//     res.status(500).json({ error: `Dawn Holder!! Error: ${err}` })
//   }
// })
// app.get('/click/:id', async (req, res) => {
//   try {
//     const result = await clickService.execute(req.params.id);
//     res.json({ result });
//   } catch (err) {
//     res.status(500).json({ error: `${err}` });
//   }
// });
// export default app;
function handler(event) {
    return __awaiter(this, void 0, void 0, function* () {
        let data = event;
        if (typeof event.body === 'string')
            data = JSON.parse(event.body);
        let response;
        if (data.type === 'hello') {
            const label = getPeriod();
            response = `${label} Holder`;
        }
        else if (data.type === 'click') {
            const clickService = new click_service_1.ClickService();
            const result = yield clickService.execute(event.id);
            response = { result };
        }
        else {
            response = { error: 'type does not suported' };
        }
        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response)
        };
    });
}
