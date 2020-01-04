import {Mummy} from "./Mummy";

export class Kindergarten {
     careBaby = (mummy: Mummy) => {
        console.log("喂宝宝吃水果");
        mummy.tell("喂宝宝吃水果");
        console.log("喂宝宝喝牛奶");
        mummy.tell("喂宝宝喝牛奶");
    }
}