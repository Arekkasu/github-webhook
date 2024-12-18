import { Envs } from "../../config/envs";

export class DiscordService {
  private readonly discordWebhookUrl = Envs.DISCORD_WEBHOOK_URL;
  constructor() {}

  async notify(message: string) {
    const body = {
      content: message,
      embeds: [
        {
          image: {
            url: "https://i.pinimg.com/736x/42/32/d4/4232d4097c635eafcbbcb8dfae19cb51.jpg",
          },
        },
      ],
    };
    const resp = await fetch(this.discordWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!resp.ok) {
      console.log("ERROR ENVIANDO EL MENSAJE");
      return false;
    }
    return true;
  }
}
