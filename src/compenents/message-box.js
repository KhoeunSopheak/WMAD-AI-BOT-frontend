import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

const MessageBox = ({ message }) => {
  const isUser = message.role === "user";

  // Normalize content
  const contentToRender =
    Array.isArray(message.content)
      ? message.content.filter(Boolean).join("\n\n")
      : typeof message.content === "string" && message.content.trim() !== ""
      ? message.content
      : "[No content]";

  // Custom markdown components
  const components = {
    p: ({ node, ...props }) => (
      <p className="mb-1 text-sm sm:text-base leading-relaxed text-gray-800 dark:text-gray-200">
        {props.children}
      </p>
    ),
    h1: ({ node, ...props }) => (
      <h1 className="text-2xl font-bold mb-3 mt-6 text-gray-900 dark:text-white">
        🧠 {props.children}
      </h1>
    ),
    h2: ({ node, ...props }) => (
      <h2 className="text-xl font-semibold mb-3 mt-5 text-gray-800 dark:text-white">
        📌 {props.children}
      </h2>
    ),
    h3: ({ node, ...props }) => (
      <h3 className="text-lg font-semibold mb-2 mt-4 text-gray-700 dark:text-white">
        💡 {props.children}
      </h3>
    ),
    ul: ({ node, ...props }) => (
      <ul className="list-disc pl-5 mb-4 text-sm text-gray-700 dark:text-gray-200">
        {props.children}
      </ul>
    ),
    ol: ({ node, ...props }) => (
      <ol className="list-decimal pl-5 mb-4 text-sm text-gray-700 dark:text-gray-200">
        {props.children}
      </ol>
    ),
    li: ({ node, ...props }) => <li className="mb-1">✅ {props.children}</li>,
    code: ({ node, inline, className, children, ...props }) => {
      const codeContent = String(children).trim();
      return inline ? (
        <code
          className="bg-gray-100 dark:bg-gray-800 text-[13px] px-1.5 py-0.5 rounded font-mono text-[#FF851B]"
          {...props}
        >
          {codeContent}
        </code>
      ) : (
        <SyntaxHighlighter
          language="javascript"
          style={dracula}
          PreTag="div"
          className="rounded-md text-sm overflow-x-auto"
        >
          {codeContent}
        </SyntaxHighlighter>
      );
    },
    a: ({ node, ...props }) => (
      <a
        className="text-blue-500 hover:underline hover:text-blue-600 transition-all"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        🔗 {props.children}
      </a>
    ),
    blockquote: ({ node, ...props }) => (
      <blockquote className="border-l-4 border-blue-400 pl-4 italic text-gray-600 dark:text-gray-300 bg-blue-50 dark:bg-gray-800 py-2 px-3 rounded-md my-3">
        💬 {props.children}
      </blockquote>
    ),
    strong: ({ node, ...props }) => (
      <strong className="font-semibold text-black dark:text-white">{props.children}</strong>
    ),
  };

  return (
    <div
      className={`max-w-3xl px-4 py-3 rounded-lg shadow-md mb-4 transition-all ${
        isUser
          ? "bg-gray-100"
          : "bg-gray-100 dark:bg-[#1e1e1e] text-gray-800 dark:text-gray-200"
      }`}
    >
      <ReactMarkdown components={components}>{contentToRender}</ReactMarkdown>
    </div>
  );
};

export default MessageBox;
