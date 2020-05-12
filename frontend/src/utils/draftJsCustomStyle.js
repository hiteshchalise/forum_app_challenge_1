export const styleMap = {
    'SUPERSCRIPT': {
        position: "relative",
        top: "-0.5em",
        fontSize: "80%"
    }
}

export const blockStyleFn = (contentBlock) => {
    const type = contentBlock.getType();
    if (type === 'blockquote') {
        return 'blockquote';
    } else if (type === 'header') {
        return 'header';
    }
}
