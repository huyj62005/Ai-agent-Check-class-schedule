/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { ScheduleResults } from "../ScheduleResults";
import { getScheduleByDate } from "../../tools/scheduletools";
import { getSchedule } from "../../tools/scheduletools";
import { useEffect, useRef, useState, memo } from "react";
import vegaEmbed from "vega-embed";
import { useLiveAPIContext } from "../../contexts/LiveAPIContext";
import {
  FunctionDeclaration,
  LiveServerToolCall,
  Modality,
  Type,
} from "@google/genai";

const declaration: FunctionDeclaration = {
  name: "render_altair",
  description: "Displays an altair graph in json format.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      json_graph: {
        type: Type.STRING,
        description:
          "JSON STRING representation of the graph to render. Must be a string, not a json object",
      },
    },
    required: ["json_graph"],
  },
};

const scheduleDecl: FunctionDeclaration = {
  name: "get_schedule",
  description:
    'Get the user class schedule for "today", "tomorrow", or a date (YYYY-MM-DD). Return lessons with start/end/subject/teacher/room.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      when: {
        type: Type.STRING,
        description:
          'Either "today", "tomorrow", or a date in YYYY-MM-DD format (e.g. 2026-02-26). Timezone Asia/Bangkok (UTC+7).',
      },
    },
    required: ["when"],
  },
};

function AltairComponent() {
  const [scheduleTitle, setScheduleTitle] = useState<string>("");
  const [scheduleLessons, setScheduleLessons] = useState<any[]>([]);
  const [jsonString, setJSONString] = useState<string>("");
  const { client, setConfig, setModel } = useLiveAPIContext();

  useEffect(() => {
    setModel("models/gemini-2.5-flash-native-audio-preview-12-2025");
    setConfig({
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: "Aoede" } },
      },
      systemInstruction: {
        parts: [
          {
            text:'You are my helpful assistant. When I ask about my class schedule, you MUST call the "get_schedule" tool with { when: "today" | "tomorrow" | "YYYY-MM-DD" } then answer using the returned lessons. When I ask for a graph call "render_altair".',          },
        ],
      },
      tools: [
        // there is a free-tier quota for search
        { googleSearch: {} },
        { functionDeclarations: [declaration, scheduleDecl] },
      ],
    });
  }, [setConfig, setModel]);

  useEffect(() => {
    const onToolCall = (toolCall: LiveServerToolCall) => {
  if (!toolCall.functionCalls?.length) return;

  // 1) render_altair (giữ nguyên)
  const altairFc = toolCall.functionCalls.find((x) => x.name === declaration.name);
  if (altairFc) {
    const str = (altairFc.args as any).json_graph;
    setJSONString(str);
  }
  // Build functionResponses for ALL calls
  const functionResponses = toolCall.functionCalls.map((fc) => {
  let output: any = { success: true };

  if (fc.name === "get_schedule") {
    const when = (fc.args as any)?.when as string;
  const { date, lessons } = getSchedule(when);

  // ✅ set UI box
  setScheduleTitle(`Lịch học ${when} (${date})`);
  setScheduleLessons(lessons);

  output = { date, lessons };
}

  return {
    response: { output },
    id: fc.id,
    name: fc.name,
    };
  });

  // Send tool response back so the model can talk using your data
  setTimeout(() => client.sendToolResponse({ functionResponses }), 50);
};
    client.on("toolcall", onToolCall);
    return () => {
      client.off("toolcall", onToolCall);
    };
  }, [client]);

  const embedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (embedRef.current && jsonString) {
      console.log("jsonString", jsonString);
      vegaEmbed(embedRef.current, JSON.parse(jsonString));
    }
  }, [embedRef, jsonString]);
  return (
  <div>
    <div className="vega-embed" ref={embedRef} />

    {/* ✅ Box xanh lịch học */}
    {scheduleTitle && (
      <ScheduleResults
        title={scheduleTitle}
        lessons={scheduleLessons}
      />
    )}
  </div>
);
}

export const Altair = memo(AltairComponent);
