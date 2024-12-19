import { Envs } from "../../config/envs";
import { NextFunction, Request, Response } from "express";
import * as crypto from "crypto";

const encoder = new TextEncoder();

async function verify_signature(
  secret: string,
  header: string,
  payload: string,
): Promise<boolean> {
  try {
    const parts = header.split("=");
    if (parts.length !== 2 || !parts[1]) {
      console.error("Invalid header format");
      return false; // Formato incorrecto.
    }

    const sigHex = parts[1];
    const algorithm: HmacImportParams = {
      name: "HMAC",
      hash: { name: "SHA-256" },
    };

    const keyBytes = encoder.encode(secret);
    const extractable = false;
    const key = await crypto.subtle.importKey(
      "raw",
      keyBytes,
      algorithm,
      extractable,
      ["sign", "verify"],
    );

    const sigBytes = hexToBytes(sigHex);
    const dataBytes = encoder.encode(payload);

    const isValid = await crypto.subtle.verify(
      algorithm.name,
      key,
      sigBytes,
      dataBytes,
    );

    return isValid;
  } catch (error) {
    console.error("Error verifying signature:", error);
    return false; // En caso de error, devuelve `false`.
  }
}

function hexToBytes(hex: string): Uint8Array {
  const len = hex.length / 2;
  const bytes = new Uint8Array(len);

  let index = 0;
  for (let i = 0; i < hex.length; i += 2) {
    const c = hex.slice(i, i + 2);
    const b = parseInt(c, 16);
    bytes[index] = b;
    index += 1;
  }

  return bytes;
}

export class GithubSha256Middleware {
  static verifySignature = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const xHubSignature = req.header("x-hub-signature-256");
    if (!xHubSignature) {
      res.status(400).send("Missing signature header");
      return;
    }

    const isValid = await verify_signature(
      Envs.SECRET,
      xHubSignature,
      JSON.stringify(req.body),
    );

    if (!isValid) {
      res.status(401).send("Unauthorized");
      return;
    }

    next();
  };
}
