import React, { useState } from "react";
import { Editor, EditorState, RichUtils } from "draft-js";
import "./style/myEditor.css"
import { useEffect } from "react";

const MyEditor = (props) => {
    const [editorState, setEditorState] = useState(
        EditorState.createEmpty()
    );

    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderlined, setIsUnderlined] = useState(false);
    const [isStrikethrough, setIsStrikethrough] = useState(false);


    useEffect(() => {
        const currentFocus = editorState.getSelection().getFocusKey()
        const inlineStyle = editorState.getCurrentInlineStyle(currentFocus);
        setIsBold(inlineStyle.has("BOLD"))
        setIsItalic(inlineStyle.has("ITALIC"))
        setIsUnderlined(inlineStyle.has("UNDERLINE"))
        setIsStrikethrough(inlineStyle.has("STRIKETHROUGH"))
    }, [editorState])

    const handleBold = () => {
        setIsBold(!isBold);
        setEditorState(RichUtils.toggleInlineStyle(editorState, 'BOLD'))
    }

    const handleItalic = () => {
        setIsItalic(!isItalic);
        setEditorState(RichUtils.toggleInlineStyle(editorState, 'ITALIC'))
    }

    const handleUnderlined = () => {
        setIsUnderlined(!isUnderlined);
        setEditorState(RichUtils.toggleInlineStyle(editorState, 'UNDERLINE'))
    }

    const handleStrikethrough = () => {
        setIsStrikethrough(!isStrikethrough);
        setEditorState(RichUtils.toggleInlineStyle(editorState, 'STRIKETHROUGH'))
    }

    return (
        <div className="editor-container">
            <div className="main-section">
                <Editor editorState={editorState} onChange={setEditorState} />
            </div>
            <div className="footer-section">
                <button onClick={handleBold} className={isBold ? "active" : "default"}>B</button>
                <button onClick={handleItalic} className={isItalic ? "active" : "default"} style={{ fontStyle: "italic" }}>i</button>
                <button onClick={handleUnderlined} className={isUnderlined ? "active" : "default"}><u>U</u></button>
                <button onClick={handleStrikethrough} className={isStrikethrough ? "active" : "default"}><s>S</s></button>
            </div>
        </div>
    )
}

export default MyEditor;