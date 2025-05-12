import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism"; // Or choose another theme

const MessageBox = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <ReactMarkdown
      components={{
        // Customize code block rendering
        code({ inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <SyntaxHighlighter
              style={dracula}
              language={match[1]}
              PreTag="div"
              {...props}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code
              className={`bg-gray-700 rounded p-1 text-sm ${
                isUser ? "bg-blue-400" : "bg-gray-800"
              }`}
              {...props}
            >
              {children}
            </code>
          );
        },
      }}
    >
      {message.content}
    </ReactMarkdown>
  );
};

export default MessageBox;
