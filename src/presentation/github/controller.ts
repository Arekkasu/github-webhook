import { Request, Response } from "express";
import { GithubService } from "../services/GithubService";
import { DiscordService } from "../services/discord.service";

export class GithubController {
  constructor(
    private readonly githubService = new GithubService(),
    private readonly discordService = new DiscordService(),
  ) {}

  webhookHandler = (req: Request, res: Response) => {
    //TIPADO ESTRICTO
    const githubEvent = req.header("x-github-event") ?? "uknown";

    const payload = req.body;
    let message: string = "";
    switch (githubEvent) {
      case "star":
        message = this.githubService.onStar(payload);
        break;
      case "issues":
        message = this.githubService.onIssue(payload);
        break;
      default:
        console.log("Unknown even");
    }
    this.discordService
      .notify(message)
      .then(() => res.status(202).send("Acepted Discord"))
      .catch(() => {
        res.status(500).send("Error Discord Message");
      });
  };
}
