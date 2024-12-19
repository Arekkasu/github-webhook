import express from "express";
import { Envs } from "./config/envs";
import { GithubController } from "./presentation/github/controller";
import { GithubSha256Middleware } from "./presentation/middleware/githubAuthorization.middleware";
(() => {
  main();
})();

function main() {
  const app = express();
  const controller = new GithubController();
  app.use(express.json());
  app.use(GithubSha256Middleware.verifySignature);
  app.post("/api/github", controller.webhookHandler);

  app.listen(Envs.PORT, () => {
    console.log("App running on", Envs.PORT);
  });
}
