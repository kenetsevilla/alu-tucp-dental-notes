import { useCallback, useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  FORMAT_TEXT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  type LexicalEditor
} from "lexical";
import { $setBlocksType } from "@lexical/selection";
import {
  $createHeadingNode,
  $isHeadingNode,
  type HeadingTagType
} from "@lexical/rich-text";
import "./Toolbar.css";

const blockTypeToBlockName = {
  paragraph: "Normal",
  h1: "Heading 1",
  h2: "Heading 2",
  h3: "Heading 3",
};

export default function Toolbar() {
  const [editor] = useLexicalComposerContext();
  const [blockType, setBlockType] = useState<keyof typeof blockTypeToBlockName>("paragraph");
  const [showBlockOptionsDropDown, setShowBlockOptionsDropDown] = useState(false);

  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);

      if (elementDOM !== null) {
        if ($isHeadingNode(element)) {
          const tag = element.getTag();
          setBlockType(tag as keyof typeof blockTypeToBlockName);
        } else {
          const type = element.getType();
          if (type in blockTypeToBlockName) {
            setBlockType(type as keyof typeof blockTypeToBlockName);
          } else {
            setBlockType("paragraph");
          }
        }
      }

      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
      setIsCode(selection.hasFormat("code"));
    }
  }, [editor]);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor, updateToolbar]);

  const formatParagraph = () => {
    if (blockType !== "paragraph") {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createParagraphNode());
        }
      });
    }
    setShowBlockOptionsDropDown(false);
  };

  const formatHeading = (headingSize: HeadingTagType) => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode(headingSize));
        }
      });
    }
    setShowBlockOptionsDropDown(false);
  };

  return (
    <div className="lexical-toolbar">
      <div className="undo-redo-bar">
         <button onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)} className="toolbar-btn">Undo</button>
         <button onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)} className="toolbar-btn">Redo</button>
      </div>

      <div className="headings-bar">
        <button
          className="heading-btn"
          onClick={() => setShowBlockOptionsDropDown(!showBlockOptionsDropDown)}
        >
          {blockTypeToBlockName[blockType]} ▼
        </button>
        {showBlockOptionsDropDown && (
          <div className="heading-dropdown">
             <button className="item" onClick={formatParagraph}>Normal {blockType === "paragraph" && "✓"}</button>
             <button className="item" onClick={() => formatHeading("h1")}>Heading 1 {blockType === "h1" && "✓"}</button>
             <button className="item" onClick={() => formatHeading("h2")}>Heading 2 {blockType === "h2" && "✓"}</button>
             <button className="item" onClick={() => formatHeading("h3")}>Heading 3 {blockType === "h3" && "✓"}</button>
          </div>
        )}
      </div>

      <div className="tools-bar">
        <button
          className={`toolbar-btn bold ${isBold ? "active" : ""}`}
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
        >
          B
        </button>
        <button
          className={`toolbar-btn italic ${isItalic ? "active" : ""}`}
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
        >
          I
        </button>
        <button
          className={`toolbar-btn underline ${isUnderline ? "active" : ""}`}
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
        >
          U
        </button>
        <button
          className={`toolbar-btn strike ${isStrikethrough ? "active" : ""}`}
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")}
        >
          S
        </button>
        <button
          className={`toolbar-btn code ${isCode ? "active" : ""}`}
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code")}
        >
          &lt;/&gt;
        </button>
      </div>
    </div>
  );
}