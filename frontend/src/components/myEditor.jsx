import React, { useState } from "react";
import { Editor, EditorState, RichUtils } from "draft-js";
import "./style/myEditor.css"
import { useEffect } from "react";

const MyEditor = (props) => {
    const [editorState, setEditorState] = useState(
        EditorState.createEmpty()
    );

    const [isBold, setIsBold] = useState(false);

    useEffect(() => {
        const currentFocus = editorState.getSelection().getFocusKey()
        const inlineStyle = editorState.getCurrentInlineStyle(currentFocus);
        setIsBold(inlineStyle.has("BOLD"))
    }, [editorState])

    const handleBold = () => {
        setIsBold(!isBold);
        setEditorState(RichUtils.toggleInlineStyle(editorState, 'BOLD'))
    }

    return (
        <div className="editor-container">
            <div className="main-section">
                <Editor editorState={editorState} onChange={setEditorState} />
            </div>
            <div className="footer-section">
                <button onClick={handleBold} className={isBold ? "active" : "default"}>B</button>
            </div>
        </div>
    )
}

export default MyEditor;