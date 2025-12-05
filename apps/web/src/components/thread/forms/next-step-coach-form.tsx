import * as React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight } from "lucide-react";

const RELATIONSHIP_TYPES = [
  { value: "customer", label: "Customer" },
  { value: "funder", label: "Funder / Investor" },
  { value: "candidate", label: "Candidate" },
  { value: "champion", label: "Champion / Advisor" },
] as const;

interface NextStepCoachFormProps {
  onSubmit: (formattedMessage: string) => void;
  isSubmitting?: boolean;
}

export function NextStepCoachForm({
  onSubmit,
  isSubmitting = false,
}: NextStepCoachFormProps) {
  const [relationshipType, setRelationshipType] = React.useState<string>("");
  const [goal, setGoal] = React.useState("");
  const [context, setContext] = React.useState("");

  const isValid = relationshipType && goal.trim() && context.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    const relationshipLabel = RELATIONSHIP_TYPES.find(
      (r) => r.value === relationshipType
    )?.label;

    const formattedMessage = `**RELATIONSHIP TYPE:** ${relationshipLabel}

**MY GOAL:** ${goal.trim()}

**WHAT HAPPENED:**
${context.trim()}`;

    onSubmit(formattedMessage);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="relationship-type" className="text-sm">
          Who do you need next steps on?
        </Label>
        <Select value={relationshipType} onValueChange={setRelationshipType}>
          <SelectTrigger id="relationship-type" className="h-9">
            <SelectValue placeholder="Select relationship type..." />
          </SelectTrigger>
          <SelectContent>
            {RELATIONSHIP_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="goal" className="text-sm">What&apos;s your goal for this relationship?</Label>
        <Input
          id="goal"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="e.g., Get them to schedule a demo, Close the deal..."
          className="bg-background h-9"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="context" className="text-sm">
          What happened? (brain dump everything)
        </Label>
        <Textarea
          id="context"
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="Had coffee with Sarah from Acme Corp. She mentioned they're expanding their engineering team..."
          className="min-h-[100px] bg-background resize-none text-sm"
        />
      </div>

      <Button
        type="submit"
        disabled={!isValid || isSubmitting}
        className="w-full"
      >
        {isSubmitting ? "Analyzing..." : "Get My Next Steps"}
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </form>
  );
}
