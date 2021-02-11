class Styles {
    // Returns a dummy iframe with no styles or content
    // This allows us to get default styles from the browser for an element
    static getStylesIframe() {
        if (typeof window.blankIframe != 'undefined') {
            return window.blankIframe;
        }

        window.blankIframe = document.createElement('iframe');
        document.body.appendChild(window.blankIframe);

        return window.blankIframe;
    }

    // Turns a CSSStyleDeclaration into a regular object, as all values become "" after a node is removed
    static getStylesObject(node, parentWindow) {
        const styles = parentWindow.getComputedStyle(node);
        let stylesObject = {};

        for (let i = 0; i < styles.length; i++) {
            const property = styles[i];
            stylesObject[property] = styles[property];
        }

        return stylesObject;
    }

    // Returns a styles object with the browser's default styles for the provided node
    static getDefaultStyles(node) {
        const iframe = Styles.getStylesIframe();
        const iframeDocument = iframe.contentDocument;
        const targetElement = iframeDocument.createElement(node.tagName);

        iframeDocument.body.appendChild(targetElement);
        const defaultStyles = Styles.getStylesObject(targetElement, iframe.contentWindow);

        targetElement.remove();

        return defaultStyles;
    }

    // Returns a styles object with only the styles applied by the user's CSS that differ from the browser's default styles
    static getUserStyles(node) {
        const defaultStyles = Styles.getDefaultStyles(node);
        const styles = Styles.getStylesObject(node, window);
        let userStyles = {};

        for (let property in defaultStyles) {
            if (styles[property] !== defaultStyles[property]) {
                userStyles[property] = styles[property];
            }
        }

        return userStyles;
    }
};
