FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
);

FilePond.setOptions({
    stylePanelAspectRatio: 256 / 256,
    imageResizeTargetWidth: 256,
    imageResizeTargetHeight: 256
});

FilePond.parse(document.body);