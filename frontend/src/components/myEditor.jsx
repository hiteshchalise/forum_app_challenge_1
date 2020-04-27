import React, { useState } from "react";
import { Editor, EditorState, RichUtils, convertToRaw } from "draft-js";
import "./style/myEditor.css"
import { useEffect } from "react";


const styleMap = {
    'SUPERSCRIPT': {
        position: "relative",
        top: "-0.5em",
        fontSize: "80%"
    }
}

const blockStyleFn = (contentBlock) => {
    const type = contentBlock.getType();
    if (type === 'blockquote') {
        return 'blockquote';
    } else if (type === 'header') {
        return 'header';
    }
}


const MyEditor = (props) => {
    const [editorState, setEditorState] = useState(
        EditorState.createEmpty()
    );

    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderlined, setIsUnderlined] = useState(false);
    const [isStrikethrough, setIsStrikethrough] = useState(false);
    const [isCode, setIsCode] = useState(false);
    const [isSuperscript, setIsSuperscript] = useState(false);

    const [isBlockQuote, setIsBlockQuote] = useState(false);
    const [isHeader, setIsHeader] = useState(false);


    useEffect(() => {
        const currentFocus = editorState.getSelection().getFocusKey();
        const block = editorState.getCurrentContent().getBlockForKey(currentFocus);
        const inlineStyle = editorState.getCurrentInlineStyle(currentFocus);
        setIsBold(inlineStyle.has("BOLD"))
        setIsItalic(inlineStyle.has("ITALIC"))
        setIsUnderlined(inlineStyle.has("UNDERLINE"))
        setIsStrikethrough(inlineStyle.has("STRIKETHROUGH"))
        setIsCode(inlineStyle.has("CODE"))
        setIsSuperscript(inlineStyle.has("SUPERSCRIPT"))

        setIsBlockQuote(block.getType() === 'blockquote')
        setIsHeader(block.getType() === 'header')

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

    const handleCode = () => {
        setIsCode(!isCode);
        setEditorState(RichUtils.toggleInlineStyle(editorState, 'CODE'))
    }

    const handleSuperscript = () => {
        setIsSuperscript(!isSuperscript);
        setEditorState(RichUtils.toggleInlineStyle(editorState, 'SUPERSCRIPT'))
    }

    const handleBlockQuote = () => {
        setIsBlockQuote(!isBlockQuote);
        setEditorState(RichUtils.toggleBlockType(editorState, 'blockquote'))
    }

    const handleHeader = () => {
        setIsHeader(!isHeader);
        setEditorState(RichUtils.toggleBlockType(editorState, 'header'))
    }

    const handleSubmit = () => {
        console.log("submmit clicked")
        const currentContent = editorState.getCurrentContent();
        const content = JSON.stringify(convertToRaw(currentContent));
        if (!currentContent.hasText()) {
            console.log("Empty");
        } else {
            props.submitCB(content);
        }
    }

    return (
        <div className="editor-container">
            <div className="main-section">
                <Editor
                    editorState={editorState}
                    onChange={setEditorState}
                    customStyleMap={styleMap}
                    blockStyleFn={blockStyleFn}
                />
            </div>
            <div className="footer-section">
                <div className="toolbar">
                    <abbr title="Bold">
                        <button onClick={handleBold}
                            className={isBold ? "active" : "default"}>B</button>
                    </abbr>
                    <abbr title="Italic">
                        <button onClick={handleItalic}
                            className={isItalic ? "active" : "default"}
                            style={{ fontStyle: "italic" }}>i</button>
                    </abbr>
                    <abbr title="Underline">
                        <button onClick={handleUnderlined} className={isUnderlined ? "active" : "default"}><u>U</u></button>
                    </abbr>
                    <abbr title="Strikethrough">
                        <button onClick={handleStrikethrough} className={isStrikethrough ? "active" : "default"}><s>S</s></button>
                    </abbr>
                    <abbr title="Code">
                        <button onClick={handleCode} className={isCode ? "active" : "default"}><code>{"</>"}</code></button>
                    </abbr>
                    <abbr title="SuperScript">
                        <button onClick={handleSuperscript} className={isSuperscript ? "active" : "default"}>A<sup>A</sup></button>
                    </abbr>
                    <abbr title="BlockQuote">
                        <button onClick={handleBlockQuote} className={isBlockQuote ? "active" : "default"}><h2 >"</h2></button>
                    </abbr>
                    <abbr title="Header">
                        <button onClick={handleHeader} className={isHeader ? "active" : "default"}>H1</button>
                    </abbr>
                </div>
                <div className="submit">
                    <button onClick={handleSubmit}>Submit</button>
                </div>
            </div>

        </div>
    )
}

export default MyEditor;