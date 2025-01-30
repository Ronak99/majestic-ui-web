"use client";
import React from "react";
// @ts-ignore
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// @ts-ignore
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { IconCheck, IconCopy } from "@tabler/icons-react";

type CodeBlockProps = {
  language: string;
  filename: string;
  highlightLines?: number[];
} & (
  | {
      code: string;
      tabs?: never;
    }
  | {
      code?: never;
      tabs: Array<{
        name: string;
        code: string;
        language?: string;
        highlightLines?: number[];
      }>;
    }
);

export const CodeBlock = ({
  language,
  filename,
  code,
  highlightLines = [],
  tabs = [],
}: CodeBlockProps) => {
  const [copied, setCopied] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState(0);

  const tabsExist = tabs.length > 0;

  const copyToClipboard = async () => {
    const textToCopy = tabsExist ? tabs[activeTab].code : code;
    if (textToCopy) {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const activeCode = tabsExist ? tabs[activeTab].code : code;
  const activeLanguage = tabsExist
    ? tabs[activeTab].language || language
    : language;
  const activeHighlightLines = tabsExist
    ? tabs[activeTab].highlightLines || []
    : highlightLines;

  return (
    <div className="h-full relative items-start justify-between w-full pb-4 rounded-lg bg-zinc-900 font-mono text-sm max-h-[720px] overflow-y-auto">
      <button
        className={`absolute bg-transparent hover:bg-zinc-800 transition-colors duration-300 p-2 rounded-lg ${
          tabsExist ? "mt-[55px]" : "mt-[12px]"
        } right-0 mr-[16px]`}
        onClick={copyToClipboard}
      >
        {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
      </button>
      <div className="flex flex-col">
        <div className="mb-4 bg-zinc-800">
          {tabsExist && (
            <div className="flex w-full  overflow-x-auto">
              {tabs.map((tab, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`pt-2 px-4 pb-2 text-xs transition-colors font-sans ${
                    activeTab === index
                      ? "text-white  bg-zinc-900"
                      : "text-zinc-400 hover:text-zinc-200 bg-zinc-800 hover:bg-zinc-700"
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex px-4">
          <SyntaxHighlighter
            language={activeLanguage}
            style={oneDark}
            customStyle={{
              margin: 0,
              padding: 0,
              background: "transparent",
              fontSize: "0.875rem", // text-sm equivalent
            }}
            wrapLines={true}
            showLineNumbers={false}
            // @ts-ignore
            lineProps={(lineNumber) => ({
              style: {
                backgroundColor: activeHighlightLines.includes(lineNumber)
                  ? "rgba(255,255,255,0.1)"
                  : "transparent",
                display: "block",
                width: "100%",
              },
            })}
            PreTag="div"
          >
            {String(activeCode)}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};
