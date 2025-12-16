import { useCallback, useEffect, useState, useRef } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  FORMAT_TEXT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  INDENT_CONTENT_COMMAND,
  OUTDENT_CONTENT_COMMAND,
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  $createTextNode,
  $isElementNode,
  type ElementFormatType
} from "lexical";
import { 
  $setBlocksType,
  $patchStyleText,
  $getSelectionStyleValueForProperty
} from "@lexical/selection";
import {
  $createHeadingNode,
  $isHeadingNode,
  type HeadingTagType
} from "@lexical/rich-text";

import "./Toolbar.css";

// Icons
import undoIcon from "../assets/bx-undo.svg";
import redoIcon from "../assets/bx-redo.svg";
import revisionIcon from "../assets/bx-revision.svg";
import chevrondownIcon from "../assets/bxs-chevron-down.svg";
import lockopenIcon from "../assets/bxs-lock-open-alt.svg";
import lockclosedIcon from "../assets/bxs-lock-alt.svg";
import importIcon from "../assets/bx-import.svg";
import exportIcon from "../assets/bx-export.svg";
import highlightIcon from "../assets/bx-highlight.svg";
import colorIcon from "../assets/bx-font-color.svg";
import minusIcon from "../assets/bx-minus.svg";
import plusIcon from "../assets/bx-plus.svg";
import boldIcon from "../assets/bx-bold.svg";
import italicIcon from "../assets/bx-italic.svg";
import underlineIcon from "../assets/bx-underline.svg";
import strikethroughIcon from "../assets/bx-strikethrough.svg";
import codeIcon from "../assets/bx-code-alt.svg";
import clearformatIcon from "../assets/bxs-eraser.svg";

const blockTypeToBlockName = {
  paragraph: "Normal",
  h1: "Heading 1",
  h2: "Heading 2",
  h3: "Heading 3",
};

export default function Toolbar() {
  const [editor] = useLexicalComposerContext();
  const [blockType, setBlockType] = useState<keyof typeof blockTypeToBlockName>("paragraph");
  
  // Alignment State
  const [elementFormat, setElementFormat] = useState<ElementFormatType>("left");

  // Dropdown States
  const [showBlockOptionsDropDown, setShowBlockOptionsDropDown] = useState(false);
  const [showAlignDropDown, setShowAlignDropDown] = useState(false);

  // Formatting State
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);

  // Color State
  const [fontColor, setFontColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");

  // Font Size State
  const [fontSize, setFontSize] = useState("15px");
  const [isFontSizeInputActive, setIsFontSizeInputActive] = useState(false); 

  // Lock State
  const [isEditable, setIsEditable] = useState(() => editor.isEditable());

  // File Input Ref
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        if ($isElementNode(element)) {
          setElementFormat(element.getFormatType() || "left");
        }

        if ($isHeadingNode(element)) {
           setBlockType(element.getTag() as keyof typeof blockTypeToBlockName);
        } else {
           setBlockType(element.getType() as keyof typeof blockTypeToBlockName || "paragraph");
        }
      }
      
      // Update Buttons
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
      setIsCode(selection.hasFormat("code"));

      // Update Colors
      setFontColor($getSelectionStyleValueForProperty(selection, "color", "#000000"));
      setBgColor($getSelectionStyleValueForProperty(selection, "background-color", "#ffffff"));
      
      if (!isFontSizeInputActive) {
        setFontSize($getSelectionStyleValueForProperty(selection, "font-size", "15px"));
      }
    }
  }, [editor, isFontSizeInputActive]);

  useEffect(() => {
    const unregisterUpdate = editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });

    const unregisterEditable = editor.registerEditableListener((editable) => {
      setIsEditable(editable);
    });

    return () => {
      unregisterUpdate();
      unregisterEditable();
    };
  }, [editor, updateToolbar]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".headings-bar")) setShowBlockOptionsDropDown(false);
      if (!target.closest(".align-bar")) setShowAlignDropDown(false);
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

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

  const formatAlign = (alignType: ElementFormatType) => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, alignType);
    setShowAlignDropDown(false);
  };

  const onFontColorSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, { color: e.target.value });
      }
    });
  };

  const onBgColorSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, { "background-color": e.target.value });
      }
    });
  };

  const applyFontSize = (size: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, { "font-size": size });
      }
    });
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFontSize(val + "px");
  };

  const onFontSizeExit = (e: React.KeyboardEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>) => {
    if ('key' in e && e.key !== 'Enter') return;

    const isValueEmpty = fontSize === "" || fontSize === "px";

    if (isValueEmpty) {
      editor.getEditorState().read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const currentSize = $getSelectionStyleValueForProperty(selection, "font-size", "15px");
          setFontSize(currentSize);
        }
      });
    } else {
      applyFontSize(fontSize);
    }
    
    setIsFontSizeInputActive(false); 

    if ('key' in e && e.key === 'Enter') {
      editor.focus(); 
    }
  };

  const updateFontSize = (amount: number) => {
    const currentSize = parseInt(fontSize.replace("px", "") || "15", 10);
    const newSize = currentSize + amount;
    if (newSize > 5) { 
      const sizeStr = newSize + "px";
      setFontSize(sizeStr);
      applyFontSize(sizeStr);
    }
  };

  const exportState = () => {
    const editorState = editor.getEditorState();
    const jsonString = JSON.stringify(editorState.toJSON());
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "editor-state.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importState = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        try {
          const jsonState = JSON.parse(reader.result);
          const newEditorState = editor.parseEditorState(jsonState);
          editor.setEditorState(newEditorState);
        } catch (e) {
          console.error("Failed to load file", e);
          alert("Invalid JSON file");
        }
      }
    };
    reader.readAsText(file);
    event.target.value = ""; // Reset input
  };

  const clearFormatting = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, {
          color: null,
          "background-color": null,
          "font-family": null,
          "font-size": null,
        });

        const anchor = selection.anchor;
        const focus = selection.focus;
        const anchorNode = anchor.getNode();
        const focusNode = focus.getNode();

        const isSingleBlock = 
          anchorNode.getTopLevelElement()?.getKey() === 
          focusNode.getTopLevelElement()?.getKey();

        if (isSingleBlock) {
          const textContent = selection.getTextContent();
          const textNode = $createTextNode(textContent);
          textNode.setFormat(0); 
          textNode.setStyle("");
          selection.insertNodes([textNode]);
        } else {
          const formats: Array<"bold" | "italic" | "underline" | "strikethrough" | "code" | "subscript" | "superscript"> = [
            "bold", "italic", "underline", "strikethrough", "code", "subscript", "superscript"
          ];
          formats.forEach((format) => {
            if (selection.hasFormat(format)) {
              selection.formatText(format);
            } else {
              selection.formatText(format); 
              selection.formatText(format);
            }
          });
        }
      }
    });
  }, [editor]);

  return (
    <div className="lexical-toolbar">
      {/* Undo/Redo */}
      <div className="undo-redo-bar">
         <button onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)} className="toolbar-btn" disabled={!isEditable}>
          <img src={undoIcon} alt="Undo" />
         </button>
         <button onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)} className="toolbar-btn" disabled={!isEditable}>
          <img src={redoIcon} alt="Redo" />
         </button>
      </div>

      {/* Headings Dropdown */}
      <div className="headings-bar">
        <button
          className="heading-btn"
          onClick={() => setShowBlockOptionsDropDown(!showBlockOptionsDropDown)}
          disabled={!isEditable}
        >
          {blockTypeToBlockName[blockType]}
          <img src={chevrondownIcon} className="chevrondown" alt="Expand" />
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

      {/* Alignment Dropdown */}
      <div className="align-bar">
        <button
          className="heading-btn"
          onClick={() => setShowAlignDropDown(!showAlignDropDown)}
          disabled={!isEditable}
        >
          Align
          <img src={chevrondownIcon} className="chevrondown" alt="Expand" />
        </button>
        {showAlignDropDown && (
          <div className="heading-dropdown">
             {/* ADDED CHECKS BELOW */}
             <button className="item" onClick={() => formatAlign("left")}>Left Align {elementFormat === "left" && "✓"}</button>
             <button className="item" onClick={() => formatAlign("center")}>Center Align {elementFormat === "center" && "✓"}</button>
             <button className="item" onClick={() => formatAlign("right")}>Right Align {elementFormat === "right" && "✓"}</button>
             <button className="item" onClick={() => formatAlign("justify")}>Justify Align {elementFormat === "justify" && "✓"}</button>
             
             <div className="divider" style={{ borderTop: "3px solid black", margin: "4px 0", width: "100%", height: "1%"}}></div>
             <button className="item" onClick={() => { editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined); setShowAlignDropDown(false); }}>Outdent</button>
             <button className="item" onClick={() => { editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined); setShowAlignDropDown(false); }}>Indent</button>
          </div>
        )}
      </div>

      {/* Text Formatting Tools */}
      <div className="tools-bar">
        <button disabled={!isEditable} style={{ marginRight: "5%" }} className={`toolbar-btn bold ${isBold ? "active" : ""}`} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}>
          <img src={boldIcon} />
        </button>
        <button disabled={!isEditable} style={{ marginRight: "5%" }} className={`toolbar-btn italic ${isItalic ? "active" : ""}`} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}>
          <img src={italicIcon} />
        </button>
        <button disabled={!isEditable} style={{ marginRight: "5%" }} className={`toolbar-btn underline ${isUnderline ? "active" : ""}`} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}>
          <img src={underlineIcon} />
        </button>
        <button disabled={!isEditable} style={{ marginRight: "5%" }} className={`toolbar-btn strike ${isStrikethrough ? "active" : ""}`} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")}>
          <img src={strikethroughIcon} />
        </button>
        <button disabled={!isEditable} style={{ marginRight: "5%" }} className={`toolbar-btn code ${isCode ? "active" : ""}`} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code")}>
          <img src={codeIcon} />
        </button>
        <button disabled={!isEditable} style={{ marginRight: "5%" }} className="toolbar-btn" onClick={clearFormatting} title="Clear Formatting">
          <img src={clearformatIcon} />
        </button>
      </div>

      <div className="divider"></div>

      {/* Font Size Picker */}
      <div className="font-size-wrapper">
        <button 
          className="toolbar-btn font-btn" 
          onClick={() => updateFontSize(-1)}
          disabled={!isEditable}
          title="Decrease Font Size"
        >
          <img src={minusIcon} width="50%" />
        </button>
        
        <input 
          type="number" 
          className="font-size-input" 
          value={fontSize.replace("px", "")} 
          onChange={handleFontSizeChange}
          onFocus={() => setIsFontSizeInputActive(true)}
          onBlur={onFontSizeExit}
          onKeyDown={onFontSizeExit}
          disabled={!isEditable}
        />
        
        <button 
          className="toolbar-btn font-btn" 
          onClick={() => updateFontSize(1)}
          disabled={!isEditable}
          title="Increase Font Size"
        >
          <img src={plusIcon} width="50%" />
        </button>
      </div>

      <div className="divider"></div>

      {/* Color Pickers (Text & Background) */}
      <div className="color-bar">
        {/* Text Color */}
        <div className="color-picker-wrapper">
           <label htmlFor="font-color-picker" className="color-picker-label" title="Text Color">
              <span className="icon">
                <img src={colorIcon} width="70%" />
              </span>
              <span className="color-line" style={{ backgroundColor: fontColor }}></span>
           </label>
           <input 
              id="font-color-picker" 
              type="color" 
              className="hidden-color-input" 
              onChange={onFontColorSelect} 
              value={fontColor} 
              disabled={!isEditable}
           />
        </div>
        <button 
           className="reset-color-btn" 
           title="Reset Text Color"
           disabled={!isEditable}
           onClick={() => {
             editor.update(() => {
               const selection = $getSelection();
               if ($isRangeSelection(selection)) {
                 $patchStyleText(selection, { color: null }); 
               }
             });
             setFontColor("#000000"); 
           }}
        >
          <img src={revisionIcon} width="150%" />
        </button>

        <div className="divider"></div>

        {/* Background Color */}
        <div className="color-picker-wrapper">
           <label htmlFor="bg-color-picker" className="color-picker-label" title="Highlight Color">
              <span className="icon">
                <img src={highlightIcon} width="70%" />
              </span>
              <span className="color-line" style={{ backgroundColor: bgColor }}></span>
           </label>
           <input 
              id="bg-color-picker" 
              type="color" 
              className="hidden-color-input" 
              onChange={onBgColorSelect} 
              value={bgColor} 
              disabled={!isEditable}
           />
        </div>
        <button 
           className="reset-color-btn" 
           title="Reset Highlight"
           disabled={!isEditable}
           onClick={() => {
             editor.update(() => {
               const selection = $getSelection();
               if ($isRangeSelection(selection)) {
                 $patchStyleText(selection, { "background-color": null });
               }
             });
             setBgColor("#ffffff");
           }}
        >
          <img src={revisionIcon} width="150%" />
        </button>
      </div>

      <div className="divider"></div>

      {/* Import / Export */}
      <div className="actions-bar">
        <button className="toolbar-btn" onClick={exportState} title="Export JSON">
          <img src={exportIcon} />
        </button>
        <button className="toolbar-btn" onClick={() => fileInputRef.current?.click()} title="Import JSON" disabled={!isEditable}>
          <img src={importIcon} />
        </button>
        <input type="file" ref={fileInputRef} onChange={importState} style={{ display: "none" }} accept=".json"/>
      </div>

      <div className="divider"></div>

      {/* Read-Only Toggle */}
      <button 
        className={`toolbar-btn lock-btn ${!isEditable ? "active" : ""}`}
        onClick={() => editor.setEditable(!editor.isEditable())}
        title="Toggle Read-Only Mode"
      >
        {isEditable ? <img src={lockopenIcon} /> : <img src={lockclosedIcon} />}
      </button>

    </div>
  );
}