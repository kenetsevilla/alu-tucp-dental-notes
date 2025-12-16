import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';

import './Editor.css';
import Toolbar from './Toolbar'; 

const editorConfig = {
  namespace: 'MyEditor',
  theme: {
    heading: {
      h1: 'editor-heading-h1',
      h2: 'editor-heading-h2',
    },
    text: {
      bold: 'editor-text-bold',
      italic: 'editor-text-italic',
      underline: 'editor-text-underline',
      strikethrough: 'editor-text-strikethrough',
      underlineStrikethrough: 'editor-text-underlineStrikethrough',
      code: 'editor-text-code',
    },
  },
  onError(error: Error) {
    console.error(error);
  },
  nodes: [
    HeadingNode, 
    QuoteNode
  ]
};

export default function Editor() {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="lexical-editor-container">
        <Toolbar />
        <div className="lexical-editor-inner">
          <RichTextPlugin
            contentEditable={<ContentEditable className="lexical-editor-input" />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <TabIndentationPlugin />
        </div>
      </div>
    </LexicalComposer>
  );
}