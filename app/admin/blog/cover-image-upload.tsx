
"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, LoaderCircle, Trash2, Upload } from "lucide-react";

export type CoverImageValue = {
  assetId: string;
  url: string;
};

type CoverImageUploadProps = {
  value: CoverImageValue | null;
  onChange: (value: CoverImageValue | null) => void;
};

export default function CoverImageUpload({
  value,
  onChange,
}: CoverImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  async function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    // Allow selecting the same file again after an upload.
    event.target.value = "";

    if (!file) return;

    setError("");

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setError("Choose a JPEG, PNG, or WebP image.");
      return;
    }

    if (file.size === 0 || file.size > 5 * 1024 * 1024) {
      setError("Choose an image no larger than 5 MB.");
      return;
    }

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }

    const localPreview = URL.createObjectURL(file);
    previewUrlRef.current = localPreview;
    setPreviewUrl(localPreview);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/blog/upload-image", {
        method: "POST",
        body: formData,
        cache: "no-store",
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.success || !result.asset?.id || !result.asset?.url) {
        throw new Error(result?.error || "Unable to upload this image.");
      }

      onChange({
        assetId: result.asset.id,
        url: result.asset.url,
      });
      setPreviewUrl("");
    } catch (err) {
      setPreviewUrl("");
      setError(
        err instanceof Error ? err.message : "Unable to upload this image.",
      );
    } finally {
      setUploading(false);
    }
  }

  function removeImage() {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }

    setPreviewUrl("");
    setError("");
    onChange(null);
  }

  const displayedUrl = previewUrl || value?.url || "";

  return (
    <section className="rounded-2xl border border-line bg-white p-4 sm:p-5">
      <div>
        <h2 className="font-semibold text-indigo-deep">Cover image</h2>
        <p className="mt-1 text-sm leading-5 text-ink/65">
          Upload a JPEG, PNG, or WebP image. Maximum file size: 5 MB.
        </p>
      </div>

      {displayedUrl ? (
        <div className="mt-4 overflow-hidden rounded-xl border border-line">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={displayedUrl}
            alt="Blog cover preview"
            className="aspect-video w-full bg-paper object-cover"
          />
          {previewUrl && (
            <p className="border-t border-line px-3 py-2 text-xs text-ink/60">
              Local preview — uploading image…
            </p>
          )}
        </div>
      ) : (
        <div className="mt-4 flex aspect-video flex-col items-center justify-center rounded-xl border border-dashed border-line bg-paper p-6 text-center">
          <ImagePlus size={32} className="text-ink/40" />
          <p className="mt-3 text-sm text-ink/65">
            No cover image selected
          </p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        disabled={uploading}
        className="sr-only"
        aria-label="Choose a cover image"
      />

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-deep px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo disabled:cursor-not-allowed disabled:opacity-60"
        >
          {uploading ? (
            <LoaderCircle size={16} className="animate-spin" />
          ) : (
            <Upload size={16} />
          )}
          {uploading
            ? "Uploading…"
            : value
              ? "Replace image"
              : "Choose image"}
        </button>

        {value && (
          <button
            type="button"
            onClick={removeImage}
            disabled={uploading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm font-medium text-ink transition hover:border-red-300 hover:text-red-700 disabled:opacity-60"
          >
            <Trash2 size={16} />
            Remove
          </button>
        )}
      </div>

      {error && (
        <p role="alert" className="mt-3 text-sm text-red-700">
          {error}
        </p>
      )}
    </section>
  );
      }
      
