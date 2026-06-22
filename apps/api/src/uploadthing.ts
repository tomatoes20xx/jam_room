import { createUploadthing, type FileRouter } from "uploadthing/server";

const f = createUploadthing();

/**
 * Room photo uploads. The client calls this via the uploadthing React helpers;
 * on completion we return url/key which the FE attaches to a room create/update.
 */
export const uploadRouter = {
  roomImage: f({ image: { maxFileSize: "8MB", maxFileCount: 8 } }).onUploadComplete(
    async ({ file }) => {
      return { url: file.ufsUrl, key: file.key };
    },
  ),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
