import { NextStepCoachForm } from "./next-step-coach-form";
import { CallCoachForm } from "./call-coach-form";

const CUSTOM_FORM_FEATURES = ["next-step-coach", "call-coach"] as const;

type CustomFormFeature = (typeof CUSTOM_FORM_FEATURES)[number];

export function hasCustomForm(featureId: string): boolean {
  return CUSTOM_FORM_FEATURES.includes(featureId as CustomFormFeature);
}

interface FeatureFormProps {
  featureId: string;
  onSubmit: (formattedMessage: string) => void;
  isSubmitting?: boolean;
}

export function FeatureForm({
  featureId,
  onSubmit,
  isSubmitting = false,
}: FeatureFormProps) {
  switch (featureId) {
    case "next-step-coach":
      return (
        <NextStepCoachForm onSubmit={onSubmit} isSubmitting={isSubmitting} />
      );
    case "call-coach":
      return <CallCoachForm onSubmit={onSubmit} isSubmitting={isSubmitting} />;
    default:
      return null;
  }
}

export { NextStepCoachForm } from "./next-step-coach-form";
export { CallCoachForm } from "./call-coach-form";
