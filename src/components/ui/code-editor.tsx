"use client";

// @ts-ignore
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// @ts-ignore
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import { ChevronDown, ChevronRight, Folder, FileText } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const MIN_FILETREE_WIDTH = 200;
const MAX_FILETREE_WIDTH = 600;

interface FileData {
  name: string;
  file_path: string;
  content: string;
  language?: string;
  highlightLines?: number[];
}

interface FolderNode {
  type: "folder";
  children: Record<string, TreeNode>;
}

interface FileNode {
  type: "file";
  name: string;
  path: string;
  content: string;
  language?: string;
  highlightLines?: number[];
}

type TreeNode = FolderNode | FileNode;

interface FileTreeProps {
  files: FileData[];
  activeFile: FileData | null;
  onFileSelect: (file: FileData) => void;
  architectureName: string;
  width: number;
}

interface CodeEditorProps {
  language: string;
  highlightLines?: number[];
  files: FileData[];
  architectureName: string;
}

const FileTree: React.FC<FileTreeProps> = ({
  files,
  activeFile,
  onFileSelect,
  architectureName,
  width,
}) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set([`/${architectureName}`])
  );

  const createFolderStructure = (
    files: FileData[]
  ): Record<string, TreeNode> => {
    const root: Record<string, TreeNode> = {};

    files.forEach((file) => {
      const parts = file.file_path
        .split("lib/majestic/arch/")
        .join("")
        .split("/");
      let current = root;

      parts.forEach((part, index) => {
        if (index === parts.length - 1) {
          // It's a file
          current[part] = {
            type: "file",
            name: file.name,
            path: file.file_path,
            content: file.content,
            language: file.language,
            highlightLines: file.highlightLines,
          };
        } else {
          // It's a directory
          if (!current[part] || current[part].type !== "folder") {
            current[part] = { type: "folder", children: {} };
          }
          current = (current[part] as FolderNode).children;
        }
      });
    });

    return root;
  };

  const toggleFolder = (path: string): void => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const renderTree = (
    node: Record<string, TreeNode>,
    path = "",
    level = 0
  ): React.ReactNode => {
    if (!node) return null;

    return Object.entries(node).map(([key, value]) => {
      const currentPath = `${path}/${key}`;
      const isExpanded = expandedFolders.has(currentPath);

      if (value.type === "folder") {
        return (
          <div key={currentPath}>
            <button
              className="flex items-center w-full hover:bg-zinc-800 rounded-s-lg px-2 py-1"
              onClick={() => toggleFolder(currentPath)}
              style={{ paddingLeft: `${level * 12}px` }}
            >
              {isExpanded ? (
                <ChevronDown size={14} />
              ) : (
                <ChevronRight size={14} />
              )}
              <Folder size={16} className="ml-1 mr-2" />
              <span className="text-sm">{key}</span>
            </button>
            {isExpanded && (
              <div>{renderTree(value.children, currentPath, level + 1)}</div>
            )}
          </div>
        );
      } else {
        const fileData: FileData = {
          name: value.name,
          file_path: value.path,
          content: value.content,
          language: value.language,
          highlightLines: value.highlightLines,
        };

        return (
          <button
            key={currentPath}
            className={`flex items-center w-full hover:bg-zinc-800 px-2 py-1 text-left rounded-s-lg ${
              value.path === activeFile?.file_path ? "bg-zinc-800" : ""
            }`}
            style={{ paddingLeft: `${level * 12}px` }}
            onClick={() => onFileSelect(fileData)}
          >
            <FileText size={16} className="ml-4 mr-2" />
            <span className="text-sm">{value.name}</span>
          </button>
        );
      }
    });
  };

  const folderStructure = createFolderStructure(files);

  return (
    <div
      style={{ width: `${width}px`, flexShrink: 0 }}
      className="pl-4 bg-zinc-900 border-r border-zinc-800 max-h-[720px] overflow-y-auto overflow-x-auto"
    >
      <div className="min-w-max">{renderTree(folderStructure)}</div>
    </div>
  );
};

const CodeEditor: React.FC<CodeEditorProps> = ({
  language,
  highlightLines = [],
  files = [],
  architectureName,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [activeFile, setActiveFile] = useState<FileData | null>(
    files[0] || null
  );
  const [fileTreeWidth, setFileTreeWidth] = useState(275);
  const [isDragging, setIsDragging] = useState(false);
  const dragHandleRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const dragStartXRef = useRef<number>(0);
  const initialWidthRef = useRef<number>(0);

  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    const editorRect = editorRef.current?.getBoundingClientRect();
    if (editorRect) {
      setIsDragging(true);
      document.body.style.cursor = "col-resize";
      // Store the initial mouse position relative to the editor
      dragStartXRef.current = e.clientX - editorRect.left;
      initialWidthRef.current = fileTreeWidth;
    }
  };

  const handleDrag = useCallback(
    (e: MouseEvent) => {
      if (isDragging && editorRef.current) {
        const editorRect = editorRef.current.getBoundingClientRect();

        const relativeX = e.clientX - editorRect.left;
        const deltaX = relativeX - dragStartXRef.current;
        const newWidth = initialWidthRef.current + deltaX;

        console.log(
          `RelativeX: ${relativeX}`,
          `DeltaX: ${deltaX}}`,
          `New Width: ${newWidth}`
        );

        if (newWidth >= MIN_FILETREE_WIDTH && newWidth <= MAX_FILETREE_WIDTH) {
          setFileTreeWidth(newWidth);
        }
      }
    },
    [isDragging]
  );

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    document.body.style.cursor = "default";
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleDrag);
      window.addEventListener("mouseup", handleDragEnd);
      return () => {
        window.removeEventListener("mousemove", handleDrag);
        window.removeEventListener("mouseup", handleDragEnd);
      };
    }
  }, [isDragging, handleDrag, handleDragEnd]);

  const copyToClipboard = async (): Promise<void> => {
    if (activeFile?.content) {
      await navigator.clipboard.writeText(activeFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      ref={editorRef}
      className="flex flex-row bg-zinc-900 rounded-lg overflow-hidden py-4 h-[480px] w-full"
    >
      <FileTree
        files={files}
        activeFile={activeFile}
        onFileSelect={setActiveFile}
        architectureName={architectureName}
        width={fileTreeWidth}
      />

      <div
        ref={dragHandleRef}
        className=" w-[1px] cursor-col-resize hover:bg-blue-500 hover:w-[4px] transition-colors duration-200 relative flex-shrink-0"
        onMouseDown={handleDragStart}
      >
        <div
          className={`absolute inset-0 ${
            isDragging ? "bg-blue-500 w-[4px]" : "bg-zinc-700 w-[1px]"
          } transition`}
        />
      </div>
      <div className="h-full min-w-[100px] flex-shrink-1 flex-grow overflow-y-auto">
        <button
          className="sticky top-0 float-right absolute bg-transparent hover:bg-zinc-800 transition-colors duration-300 rounded-lg mt-[12px] right-0 mr-[24px]"
          onClick={copyToClipboard}
        >
          {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
        </button>
        <div className="flex flex-col">
          <div className="flex px-4">
            <SyntaxHighlighter
              language={activeFile?.language || language}
              style={oneDark}
              customStyle={{
                margin: 0,
                padding: 0,
                background: "transparent",
                fontSize: "0.875rem",
                width: "100%",
                wordBreak: "break-word",
                whiteSpace: "pre-wrap",
                overflowWrap: "break-word",
              }}
              wrapLines={true}
              showLineNumbers={false}
              lineProps={(lineNumber: number) => ({
                style: {
                  backgroundColor: (
                    activeFile?.highlightLines || highlightLines
                  ).includes(lineNumber)
                    ? "rgba(255,255,255,0.1)"
                    : "transparent",
                  display: "block",
                  width: "100%",
                },
              })}
              PreTag="div"
            >
              {String(activeFile?.content || "")}
            </SyntaxHighlighter>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
