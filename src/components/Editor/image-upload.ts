import { createImageUpload } from "novel/plugins";
import { toast } from "sonner";
import { env } from "@/env";

const onUpload = (file: File) => {
  const form = new FormData();
  form.append("image", file);

  const promise = fetch(`${env.NEXT_PUBLIC_API_URL}/gallery/upload`, {
    method: "POST",
    credentials: "include",

    body: form,
  });

  return new Promise((resolve) => {
    toast.promise(
      promise.then(async (res) => {
        // Successfully uploaded image
        if (res.status === 200) {
          const { src } = (await res.json()) as any;
          // preload the image
          let image = new Image();
          image.src = src;
          image.onload = () => {
            resolve(src);
          };
          // No blob store configured
        } else if (res.status === 401) {
          resolve(file);
          throw new Error(
            "`BLOB_READ_WRITE_TOKEN` environment variable not found, reading image locally instead."
          );
          // Unknown error
        } else {
          throw new Error(`Error uploading image. Please try again.`);
        }
      }),
      {
        loading: "Uploading image...",
        success: "Image uploaded successfully.",
        error: (e) => e.message,
      }
    );
  });
};

export const uploadFn = createImageUpload({
  onUpload,
  validateFn: (file) => {
    if (!file.type.includes("image/")) {
      toast.error("File type not supported.");
      return false;
    } else if (file.size / 1024 / 1024 > 20) {
      toast.error("File size too big (max 20MB).");
      return false;
    }
    return true;
  },
});
