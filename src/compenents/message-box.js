import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

const MessageBox = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div className={`text-sm ${isUser ? "text-white" : "text-gray-800"}`}>
      <ReactMarkdown
        components={{
          // Paragraph styling
          p: ({ node, ...props }) => (
            <p className="mb-4 last:mb-0" {...props} />
          ),
          
          // Headers styling
          h1: ({ node, ...props }) => (
            <h1 className="text-2xl font-bold mb-3 mt-4" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-xl font-bold mb-3 mt-4" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-lg font-bold mb-2 mt-3" {...props} />
          ),

          // List styling
          ul: ({ node, ...props }) => (
            <ul className="list-disc pl-5 mb-4" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal pl-5 mb-4" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="mb-1" {...props} />
          ),

          // Link styling
          a: ({ node, ...props }) => (
            <a 
              className="text-blue-500 hover:underline" 
              target="_blank" 
              rel="noopener noreferrer" 
              {...props} 
            />
          ),

          // Code block styling
          code({ inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            
            if (!inline && match) {
              return (
                <div className="my-2 rounded-md overflow-hidden">
                  <SyntaxHighlighter
                    style={dracula}
                    language={match[1]}
                    PreTag="div"
                    showLineNumbers={true}
                    wrapLines={true}
                    customStyle={{
                      margin: 0,
                      padding: "1rem",
                      backgroundColor: "#282A36",
                      fontSize: "0.85rem",
                    }}
                    {...props}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                </div>
              );
            }
            
            return (
              <code
                className={`font-mono text-xs px-1.5 py-0.5 rounded ${
                  isUser ? "bg-blue-700/30 text-blue-100" : "bg-gray-300 text-gray-800"
                }`}
                {...props}
              >
                {children}
              </code>
            );
          },

          // Blockquote styling
          blockquote: ({ node, ...props }) => (
            <blockquote 
              className={`border-l-4 pl-4 italic my-3 ${
                isUser ? "border-blue-400 bg-blue-900/20" : "border-gray-400 bg-gray-200"
              }`} 
              {...props} 
            />
          ),
        }}
      >
        {message.content}
      </ReactMarkdown>
    </div>
  );
};

export default MessageBox;