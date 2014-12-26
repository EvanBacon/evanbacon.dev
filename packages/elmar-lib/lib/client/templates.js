getTemplateHelper = function (tmpName, fnName) {
    var fn = null;

    return Template[tmpName].__helpers[' ' + fnName].call();
};