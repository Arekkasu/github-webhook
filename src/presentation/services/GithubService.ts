import { GithubIssuePayload } from "../../interface/github-issue";
import { GithubStarPayload } from "../../interface/github-starts";

export class GithubService {
  constructor() {}

  onStar(payload: GithubStarPayload): string {
    let message: string = "";
    const { action, sender, repository, starred_at } = payload;

    message = `user ${sender.login} ${action} star on ${repository.full_name}`;
    return message;
  }
  onIssue(payload: GithubIssuePayload): string {
    const { action, issue } = payload;
    if (action === "opened") {
      const message = `An issue was opened with this title ${issue.title} by ${issue.user.login}`;
      console.log({ message });
      return message;
    }
    if (action === "closed") {
      const message = `An issue was closed by ${issue.user.login}`;
      console.log({ message });
      return message;
    }
    if (action === "reopened") {
      const message = `An issue was reopened by ${issue.user.login}`;
      console.log({ message });
      return message;
    }
    return `Unhandled action for the issue event ${action}`;
  }
}
