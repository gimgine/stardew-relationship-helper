const Y="data:image/png;base64,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";export{Y as default};