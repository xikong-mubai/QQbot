import { execSync } from "child_process";
import { join } from "path";

import { queue, Target } from "@mirai-bot/utils";
import MiraiBot from "@mirai-bot/core";
import { Queue } from "bull";

import { textify } from "./textify";

export async function saveImg(url: string, name: string, text?: string) {
  name = join("data", "MiraiApiHttp/images", name);
  execSync(`wget "${url}" -O ${name}`);
  if (text) {
    await textify(name, join("data", "MiraiApiHttp/images", text));
  }
}

let sendMsgQueue: Queue<{
  target: Target;
  msg: string;
}>;

export function getSendMsgQueue() {
  if (!sendMsgQueue) {
    sendMsgQueue = queue("sendMessage");

    sendMsgQueue.process(async (job) =>
      MiraiBot.getCurrentBot().send(job.data.target, job.data.msg)
    );
  }
  return sendMsgQueue;
}
