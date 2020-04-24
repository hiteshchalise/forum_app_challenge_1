import React, { useState } from "react";
import { Editor, EditorState, RichUtils } from "draft-js";
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
            </div>
            <big>hehe</big>
            <small>small</small>
            The <abbr title="World Health Organization">WHO</abbr> was founded in 1948.<em>Emphasized text</em> <p>He named his car <i>The lightning</i>, because it was very fast.</p> <p>This text contains <sup>superscript</sup> text.</p>
            <br />
            <blockquote >
                For 50 years, WWF has been protecting the future of nature. The world's leading conservation organization, WWF works in 100 countries and is supported by 1.2 million members in the United States and close to 5 million globally.
            </blockquote>

            akka
        </div>
    )
}

export default MyEditor;