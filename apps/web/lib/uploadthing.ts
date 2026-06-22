import { generateReactHelpers } from "@uploadthing/react";
import type { UploadRouter } from "@jamroom/api/uploadthing";
import { API_URL } from "./api";

export const { useUploadThing, uploadFiles } = generateReactHelpers<UploadRouter>({
  url: `${API_URL}/api/uploadthing`,
});
