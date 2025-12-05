import * as React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { parseTranscript } from "@/lib/transcript-parser";
import { ArrowRight, FileText, Type } from "lucide-react";
import { cn } from "@/lib/utils";

type InputMode = "paste" | "upload";

interface CallCoachFormProps {
  onSubmit: (formattedMessage: string) => void;
  isSubmitting?: boolean;
}

export function CallCoachForm({
  onSubmit,
  isSubmitting = false,
}: CallCoachFormProps) {
  const [inputMode, setInputMode] = React.useState<InputMode>("paste");
  const [transcript, setTranscript] = React.useState("");
  const [notes, setNotes] = React.useState("");

  const isValid = transcript.trim().length > 0;

  const handleFileContent = (content: string, fileName: string) => {
    const parsed = parseTranscript(content, fileName);
    setTranscript(parsed);
  };

  const handleClearFile = () => {
    setTranscript("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    let formattedMessage = `**CALL TRANSCRIPT:**
${transcript.trim()}`;

    if (notes.trim()) {
      formattedMessage += `

**ADDITIONAL NOTES:**
${notes.trim()}`;
    }

    onSubmit(formattedMessage);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm">Call Transcript</Label>

        {/* Mode Toggle */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setInputMode("paste")}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md text-sm font-medium transition-colors",
              inputMode === "paste"
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80 text-muted-foreground"
            )}
          >
            <Type className="h-3.5 w-3.5" />
            Paste
          </button>
          <button
            type="button"
            onClick={() => setInputMode("upload")}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md text-sm font-medium transition-colors",
              inputMode === "upload"
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80 text-muted-foreground"
            )}
          >
            <FileText className="h-3.5 w-3.5" />
            Upload
          </button>
        </div>

        {/* Input Area */}
        {inputMode === "paste" ? (
          <Textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder={`Paste your call transcript here...

Sales Rep: Hi, thanks for taking the time to chat today.
Customer: Of course, I've been curious about your product.`}
            className="min-h-[120px] bg-background resize-none font-mono text-xs"
          />
        ) : (
          <FileUpload
            accept=".txt,.vtt,.srt"
            onFileContent={handleFileContent}
            onClear={handleClearFile}
          />
        )}

        {/* Show transcript preview when file is uploaded */}
        {inputMode === "upload" && transcript && (
          <div className="space-y-1">
            <Label className="text-muted-foreground text-xs">
              Preview:
            </Label>
            <div className="max-h-[80px] overflow-y-auto rounded-md border bg-muted/30 p-2">
              <pre className="text-xs font-mono whitespace-pre-wrap">
                {transcript.slice(0, 300)}
                {transcript.length > 300 && "..."}
              </pre>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="notes" className="text-sm">
          Notes{" "}
          <span className="text-muted-foreground font-normal">(optional)</span>
        </Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any context or specific moments you want feedback on..."
          className="min-h-[60px] bg-background resize-none text-sm"
        />
      </div>

      <Button
        type="submit"
        disabled={!isValid || isSubmitting}
        className="w-full"
      >
        {isSubmitting ? "Analyzing..." : "Get Call Feedback"}
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </form>
  );
}
