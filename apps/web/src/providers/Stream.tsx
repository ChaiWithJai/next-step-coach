import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { useStream } from "@langchain/langgraph-sdk/react";
import { type Message } from "@langchain/langgraph-sdk";
import {
  uiMessageReducer,
  type UIMessage,
  type RemoveUIMessage,
} from "@langchain/langgraph-sdk/react-ui";
import { useQueryState } from "nuqs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LangGraphLogoSVG } from "@/components/icons/langgraph";
import { Label } from "@/components/ui/label";
import { ArrowRight, MessageSquare, Phone } from "lucide-react";
import { PasswordInput } from "@/components/ui/password-input";
import { getApiKey } from "@/lib/api-key";
import { useThreads } from "./Thread";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export type StateType = { messages: Message[]; ui?: UIMessage[] };

const useTypedStream = useStream<
  StateType,
  {
    UpdateType: {
      messages?: Message[] | Message | string;
      ui?: (UIMessage | RemoveUIMessage)[] | UIMessage | RemoveUIMessage;
    };
    CustomEventType: UIMessage | RemoveUIMessage;
  }
>;

type StreamContextType = ReturnType<typeof useTypedStream>;
const StreamContext = createContext<StreamContextType | undefined>(undefined);

async function sleep(ms = 4000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function checkGraphStatus(
  apiUrl: string,
  apiKey: string | null,
): Promise<boolean> {
  try {
    const res = await fetch(`${apiUrl}/info`, {
      ...(apiKey && {
        headers: {
          "X-Api-Key": apiKey,
        },
      }),
    });

    return res.ok;
  } catch (e) {
    console.error(e);
    return false;
  }
}

const StreamSession = ({
  children,
  apiKey,
  apiUrl,
  assistantId,
}: {
  children: ReactNode;
  apiKey: string | null;
  apiUrl: string;
  assistantId: string;
}) => {
  const [threadId, setThreadId] = useQueryState("threadId");
  const { getThreads, setThreads } = useThreads();
  const streamValue = useTypedStream({
    apiUrl,
    apiKey: apiKey ?? undefined,
    assistantId,
    threadId: threadId ?? null,
    onCustomEvent: (event, options) => {
      options.mutate((prev) => {
        const ui = uiMessageReducer(prev.ui ?? [], event);
        return { ...prev, ui };
      });
    },
    onThreadId: (id) => {
      setThreadId(id);
      // Refetch threads list when thread ID changes.
      // Wait for some seconds before fetching so we're able to get the new thread that was created.
      sleep().then(() => getThreads().then(setThreads).catch(console.error));
    },
  });

  useEffect(() => {
    checkGraphStatus(apiUrl, apiKey).then((ok) => {
      if (!ok) {
        toast.error("Failed to connect to LangGraph server", {
          description: () => (
            <p>
              Please ensure your graph is running at <code>{apiUrl}</code> and
              your API key is correctly set (if connecting to a deployed graph).
            </p>
          ),
          duration: 10000,
          richColors: true,
          closeButton: true,
        });
      }
    });
  }, [apiKey, apiUrl]);

  return (
    <StreamContext.Provider value={streamValue}>
      {children}
    </StreamContext.Provider>
  );
};

// Default values for the form
const DEFAULT_API_URL = "http://localhost:2024";
const DEFAULT_ASSISTANT_ID = "agent";

// Coaching features available - exported for use in other components
export const COACHING_FEATURES = [
  {
    id: "next-step-coach",
    title: "Next Step Coach",
    description:
      "Turn raw brain-dump notes about networking conversations into clear, actionable follow-up plans.",
    icon: MessageSquare,
    examples: [
      "Had coffee with Sarah from Acme Corp, she mentioned they're expanding their engineering team...",
      "Met John at the conference, he seemed interested when I mentioned our DevOps consulting...",
    ],
  },
  {
    id: "call-coach",
    title: "Call Coach",
    description:
      "Get expert AI feedback on your sales calls. Paste a transcript or describe what happened.",
    icon: Phone,
    examples: [
      "Here's the transcript from my discovery call with the VP of Sales...",
      "How should I have handled when they said the price was too high?",
    ],
  },
];

// Helper to get feature by ID
export function getFeatureById(id: string) {
  return COACHING_FEATURES.find((f) => f.id === id);
}

// Feature selector dashboard component
function FeatureSelector({
  onSelectFeature,
}: {
  onSelectFeature: (featureId: string) => void;
}) {
  return (
    <div className="flex flex-col min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="animate-in fade-in-0 zoom-in-95 flex flex-col gap-8 max-w-4xl w-full">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="text-4xl">🎯</div>
            <h1 className="text-3xl font-bold tracking-tight">
              Sales Coaching Suite
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl">
              AI-powered coaching to help you close more deals. Choose a tool to
              get started.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {COACHING_FEATURES.map((feature) => (
              <Card
                key={feature.id}
                className="cursor-pointer hover:shadow-lg transition-all hover:border-primary/50 hover:-translate-y-1"
                onClick={() => onSelectFeature(feature.id)}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                  <CardDescription className="text-base mt-2">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium mb-2">Try saying:</p>
                    <ul className="space-y-2">
                      {feature.examples.map((example, i) => (
                        <li key={i} className="italic text-xs bg-slate-100 p-2 rounded">
                          "{example}"
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* PIE Branding Footer */}
      <footer className="py-4 text-center text-sm text-muted-foreground border-t bg-white/50">
        <p>
          Made with ❤️ by{" "}
          <a
            href="https://princetonideaexchange.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary hover:underline"
          >
            Princeton Idea Exchange
          </a>
        </p>
      </footer>
    </div>
  );
}

export const StreamProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Get environment variables
  const envApiUrl: string | undefined = import.meta.env.VITE_API_URL;
  const envAssistantId: string | undefined = import.meta.env.VITE_ASSISTANT_ID;
  const envApiKey: string | undefined = import.meta.env.VITE_LANGSMITH_API_KEY;

  // Use URL params with env var fallbacks
  const [apiUrl, setApiUrl] = useQueryState("apiUrl", {
    defaultValue: envApiUrl || "",
  });
  const [assistantId, setAssistantId] = useQueryState("assistantId", {
    defaultValue: envAssistantId || "",
  });

  // For API key, use localStorage with env var fallback
  const [apiKey, _setApiKey] = useState(() => {
    const storedKey = getApiKey();
    return storedKey || envApiKey || "";
  });

  const setApiKey = (key: string) => {
    window.localStorage.setItem("lg:chat:apiKey", key);
    _setApiKey(key);
  };

  // Determine final values to use, prioritizing URL params then env vars
  const finalApiUrl = apiUrl || envApiUrl || DEFAULT_API_URL;
  const finalAssistantId = assistantId || envAssistantId;

  // If no assistant selected, show the feature selector dashboard
  if (!finalAssistantId) {
    return (
      <FeatureSelector
        onSelectFeature={(featureId) => {
          setApiUrl(finalApiUrl);
          setAssistantId(featureId);
        }}
      />
    );
  }

  // If we're missing apiUrl (shouldn't happen with defaults), show the form
  if (!finalApiUrl) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full p-4">
        <div className="animate-in fade-in-0 zoom-in-95 flex flex-col border bg-background shadow-lg rounded-lg max-w-3xl">
          <div className="flex flex-col gap-2 mt-14 p-6 border-b">
            <div className="flex items-start flex-col gap-2">
              <LangGraphLogoSVG className="h-7" />
              <h1 className="text-xl font-semibold tracking-tight">
                Agent Chat
              </h1>
            </div>
            <p className="text-muted-foreground">
              Welcome to Agent Chat! Before you get started, you need to enter
              the URL of the deployment and the assistant / graph ID.
            </p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();

              const form = e.target as HTMLFormElement;
              const formData = new FormData(form);
              const apiUrl = formData.get("apiUrl") as string;
              const assistantId = formData.get("assistantId") as string;
              const apiKey = formData.get("apiKey") as string;

              setApiUrl(apiUrl);
              setApiKey(apiKey);
              setAssistantId(assistantId);

              form.reset();
            }}
            className="flex flex-col gap-6 p-6 bg-muted/50"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="apiUrl">
                Deployment URL<span className="text-rose-500">*</span>
              </Label>
              <p className="text-muted-foreground text-sm">
                This is the URL of your LangGraph deployment. Can be a local, or
                production deployment.
              </p>
              <Input
                id="apiUrl"
                name="apiUrl"
                className="bg-background"
                defaultValue={apiUrl || DEFAULT_API_URL}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="assistantId">
                Assistant / Graph ID<span className="text-rose-500">*</span>
              </Label>
              <p className="text-muted-foreground text-sm">
                This is the ID of the graph (can be the graph name), or
                assistant to fetch threads from, and invoke when actions are
                taken.
              </p>
              <Input
                id="assistantId"
                name="assistantId"
                className="bg-background"
                defaultValue={assistantId || DEFAULT_ASSISTANT_ID}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="apiKey">LangSmith API Key</Label>
              <p className="text-muted-foreground text-sm">
                This is <strong>NOT</strong> required if using a local LangGraph
                server. This value is stored in your browser's local storage and
                is only used to authenticate requests sent to your LangGraph
                server.
              </p>
              <PasswordInput
                id="apiKey"
                name="apiKey"
                defaultValue={apiKey ?? ""}
                className="bg-background"
                placeholder="lsv2_pt_..."
              />
            </div>

            <div className="flex justify-end mt-2">
              <Button type="submit" size="lg">
                Continue
                <ArrowRight className="size-5" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <StreamSession apiKey={apiKey} apiUrl={apiUrl} assistantId={assistantId}>
      {children}
    </StreamSession>
  );
};

// Create a custom hook to use the context
export const useStreamContext = (): StreamContextType => {
  const context = useContext(StreamContext);
  if (context === undefined) {
    throw new Error("useStreamContext must be used within a StreamProvider");
  }
  return context;
};

export default StreamContext;
