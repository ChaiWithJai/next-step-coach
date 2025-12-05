import * as React from "react";
import { Upload, X, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface FileUploadProps {
  accept?: string;
  onFileContent: (content: string, fileName: string) => void;
  onClear?: () => void;
  className?: string;
  disabled?: boolean;
}

interface FileInfo {
  name: string;
  size: number;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileUpload({
  accept = ".txt,.vtt,.srt",
  onFileContent,
  onClear,
  className,
  disabled = false,
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [fileInfo, setFileInfo] = React.useState<FileInfo | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFile = React.useCallback(
    (file: File) => {
      setError(null);

      // Validate file type
      const validExtensions = accept.split(",").map((ext) => ext.trim());
      const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;
      if (!validExtensions.includes(fileExtension)) {
        setError(`Invalid file type. Please upload ${accept} files.`);
        return;
      }

      // Read file content
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setFileInfo({ name: file.name, size: file.size });
        onFileContent(content, file.name);
      };
      reader.onerror = () => {
        setError("Failed to read file. Please try again.");
      };
      reader.readAsText(file);
    },
    [accept, onFileContent]
  );

  const handleDragOver = React.useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) {
        setIsDragOver(true);
      }
    },
    [disabled]
  );

  const handleDragLeave = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = React.useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (disabled) return;

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFile(files[0]);
      }
    },
    [disabled, handleFile]
  );

  const handleInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFile(files[0]);
      }
    },
    [handleFile]
  );

  const handleClear = React.useCallback(() => {
    setFileInfo(null);
    setError(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    onClear?.();
  }, [onClear]);

  const handleClick = React.useCallback(() => {
    if (!disabled) {
      inputRef.current?.click();
    }
  }, [disabled]);

  if (fileInfo) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 rounded-md border border-input bg-background p-2",
          className
        )}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted shrink-0">
          <FileText className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{fileInfo.name}</p>
          <p className="text-xs text-muted-foreground">
            {formatFileSize(fileInfo.size)}
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleClear}
          className="h-7 w-7 shrink-0"
        >
          <X className="h-3.5 w-3.5" />
          <span className="sr-only">Remove file</span>
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("space-y-1.5", className)}>
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "flex flex-col items-center justify-center gap-1.5 rounded-md border-2 border-dashed p-4 transition-colors cursor-pointer",
          isDragOver
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
          <Upload className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium">
            Drop file or click to browse
          </p>
          <p className="text-xs text-muted-foreground">
            {accept.replace(/\./g, "").toUpperCase()} files
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          disabled={disabled}
          className="sr-only"
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
