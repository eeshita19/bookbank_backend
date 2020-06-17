const defaultUrl = "https://judge0.p.rapidapi.com"
let apiUrl = defaultUrl
let wait = localStorageGetItem("wait") || false;
const pbUrl = "https://pb.judge0.com";
const check_timeout = 200;

let blinkStatusLine = ((localStorageGetItem("blink") || "true") === "true");
let editorMode = localStorageGetItem("editorMode") || "normal";
let redirectStderrToStdout = ((localStorageGetItem("redirectStderrToStdout") || "false") === "true");
let editorModeObject = null;

let fontSize = 14;
let MonacoVim;
let MonacoEmacs;
let layout;
let sourceEditor;
let stdinEditor;
let stdoutEditor;
let stderrEditor;
let compileOutputEditor;
let sandboxMessageEditor;

let isEditorDirty = false;
let currentLanguageId;

let $selectLanguage;
let $compilerOptions;
let $commandLineArguments;
let $insertTemplateBtn;
let $runBtn;
let $navigationMessage;
let $updates = $("#updates");
let $statusLine;

let timeStart;
let timeEnd;

let messagesData;

let layoutConfig = {
    settings: {
        showPopoutIcon: false,
        reorderEnabled: true
    },
    dimensions: {
        borderWidth: 3,
        headerHeight: 22
    },
    content: [{
        type: "row",
        content: [{
            type: "component",
            componentName: "source",
            title: "SOURCE",
            isClosable: false,
            componentState: {
                readOnly: false
            }
        }, {
            type: "column",
            content: [{
                type: "stack",
                content: [{
                    type: "component",
                    componentName: "stdin",
                    title: "STDIN",
                    isClosable: false,
                    componentState: {
                        readOnly: false
                    }
                }]
            }, {
                type: "stack",
                content: [{
                    type: "component",
                    componentName: "stdout",
                    title: "STDOUT",
                    isClosable: false,
                    componentState: {
                        readOnly: true
                    }
                }, {
                    type: "component",
                    componentName: "stderr",
                    title: "STDERR",
                    isClosable: false,
                    componentState: {
                        readOnly: true
                    }
                }, {
                    type: "component",
                    componentName: "compile output",
                    title: "COMPILE OUTPUT",
                    isClosable: false,
                    componentState: {
                        readOnly: true
                    }
                }, {
                    type: "component",
                    componentName: "sandbox message",
                    title: "SANDBOX MESSAGE",
                    isClosable: false,
                    componentState: {
                        readOnly: true
                    }
                }]
            }]
        }]
    }]
};

function encode(str) {
    return btoa(unescape(encodeURIComponent(str || "")));
}

function decode(bytes) {
    let escaped = escape(atob(bytes || ""));
    try {
        return decodeURIComponent(escaped);
    } catch {
        return unescape(escaped);
    }
}

function localStorageSetItem(key, value) {
    try {
        localStorage.setItem(key, value);
    } catch (ignorable) {}
}

function localStorageGetItem(key) {
    try {
        return localStorage.getItem(key);
    } catch (ignorable) {
        return null;
    }
}

function showMessages() {
    let width = $updates.offset().left - parseFloat($updates.css("padding-left")) -
        $navigationMessage.parent().offset().left - parseFloat($navigationMessage.parent().css("padding-left")) - 5;

    if (width < 200 || messagesData === undefined) {
        return;
    }

    let messages = messagesData["messages"];

    $navigationMessage.css("animation-duration", messagesData["duration"]);
    $navigationMessage.parent().width(width - 5);

    let combinedMessage = "";
    for (let i = 0; i < messages.length; ++i) {
        combinedMessage += `${messages[i]}`;
        if (i != messages.length - 1) {
            combinedMessage += "&nbsp".repeat(Math.min(200, messages[i].length));
        }
    }

    $navigationMessage.html(combinedMessage);
}

function loadMessages() {
    $.ajax({
        url: `https://minio.judge0.com/public/ide/messages.json?${Date.now()}`,
        type: "GET",
        headers: {
            "x-rapidapi-host": "judge0.p.rapidapi.com",
            "x-rapidapi-key": "b87c978454mshc0aeef14416bf63p1af4aejsn7b28b996f363",
            "content-type": "application/json",
            "accept": "application/json",
        },
        success: function (data, textStatus, jqXHR) {
            messagesData = data;
            showMessages();
        }
    });
}

function showError(title, content) {
    $("#site-modal #title").html(title);
    $("#site-modal .content").html(content);
    $("#site-modal").modal("show");
}

function handleError(jqXHR, textStatus, errorThrown) {
    showError(`${jqXHR.statusText} (${jqXHR.status})`, `<pre>${JSON.stringify(jqXHR, null, 4)}</pre>`);
}

function handleRunError(jqXHR, textStatus, errorThrown) {
    handleError(jqXHR, textStatus, errorThrown);
    $runBtn.removeClass("loading");
}

function handleResult(data) {
    timeEnd = performance.now();
    console.log("It took " + (timeEnd - timeStart) + " ms to get submission result.");

    let status = data.status;
    let stdout = decode(data.stdout);
    let stderr = decode(data.stderr);
    let compile_output = decode(data.compile_output);
    let sandbox_message = decode(data.message);
    let time = (data.time === null ? "-" : data.time + "s");
    let memory = (data.memory === null ? "-" : data.memory + "KB");

    $statusLine.html(`${status.description}, ${time}, ${memory}`);

    if (blinkStatusLine) {
        $statusLine.addClass("blink");
        setTimeout(() => {
            blinkStatusLine = false;
            localStorageSetItem("blink", "false");
            $statusLine.removeClass("blink");
        }, 3000);
    }

    stdoutEditor.setValue(stdout);
    stderrEditor.setValue(stderr);
    compileOutputEditor.setValue(compile_output);
    sandboxMessageEditor.setValue(sandbox_message);

    if (stdout !== "") {
        let dot = document.getElementById("stdout-dot");
        if (!dot.parentElement.classList.contains("lm_active")) {
            dot.hidden = false;
        }
    }
    if (stderr !== "") {
        let dot = document.getElementById("stderr-dot");
        if (!dot.parentElement.classList.contains("lm_active")) {
            dot.hidden = false;
        }
    }
    if (compile_output !== "") {
        let dot = document.getElementById("compile-output-dot");
        if (!dot.parentElement.classList.contains("lm_active")) {
            dot.hidden = false;
        }
    }
    if (sandbox_message !== "") {
        let dot = document.getElementById("sandbox-message-dot");
        if (!dot.parentElement.classList.contains("lm_active")) {
            dot.hidden = false;
        }
    }
    $runBtn.removeClass("loading");
}

function getIdFromURI() {
    let uri = location.search.substr(1).trim();
    return uri.split("&")[0];
}

function save() {
    let content = JSON.stringify({
        source_code: encode(sourceEditor.getValue()),
        language_id: $selectLanguage.val(),
        compiler_options: $compilerOptions.val(),
        command_line_arguments: $commandLineArguments.val(),
        stdin: encode(stdinEditor.getValue()),
        stdout: encode(stdoutEditor.getValue()),
        stderr: encode(stderrEditor.getValue()),
        compile_output: encode(compileOutputEditor.getValue()),
        sandbox_message: encode(sandboxMessageEditor.getValue()),
        status_line: encode($statusLine.html())
    });
    let filename = "judge0-ide.json";
    let data = {
        content: content,
        filename: filename
    };

    $.ajax({
        url: pbUrl,
        type: "POST",
        async: true,
        headers: {
            // "x-rapidapi-host": "judge0.p.rapidapi.com",
            // "x-rapidapi-key": "b87c978454mshc0aeef14416bf63p1af4aejsn7b28b996f363",
            "content-type": "application/json",
            "accept": "application/json",
        },
        data: data,
        success: function (data, textStatus, jqXHR) {
            if (getIdFromURI() != data["short"]) {
                window.history.replaceState(null, null, location.origin + location.pathname + "?" + data["short"]);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleError(jqXHR, textStatus, errorThrown);
        }
    });
}

function downloadSource() {
    let value = parseInt($selectLanguage.val());
    download(sourceEditor.getValue(), fileNames[value], "text/plain");
}

function loadSavedSource() {
    snippet_id = getIdFromURI();

    if (snippet_id.length == 36) {
        $.ajax({
            url: apiUrl + "/submissions/" + snippet_id + "?fields=source_code,language_id,stdin,stdout,stderr,compile_output,message,time,memory,status,compiler_options,command_line_arguments&base64_encoded=true",
            type: "GET",
            headers: {
                "x-rapidapi-host": "judge0.p.rapidapi.com",
                "x-rapidapi-key": "b87c978454mshc0aeef14416bf63p1af4aejsn7b28b996f363",
            },
            success: function (data, textStatus, jqXHR) {
                sourceEditor.setValue(decode(data["source_code"]));
                $selectLanguage.dropdown("set selected", data["language_id"]);
                $compilerOptions.val(data["compiler_options"]);
                $commandLineArguments.val(data["command_line_arguments"]);
                stdinEditor.setValue(decode(data["stdin"]));
                stdoutEditor.setValue(decode(data["stdout"]));
                stderrEditor.setValue(decode(data["stderr"]));
                compileOutputEditor.setValue(decode(data["compile_output"]));
                sandboxMessageEditor.setValue(decode(data["message"]));
                let time = (data.time === null ? "-" : data.time + "s");
                let memory = (data.memory === null ? "-" : data.memory + "KB");
                $statusLine.html(`${data.status.description}, ${time}, ${memory}`);
                changeEditorLanguage();
            },
            error: handleRunError
        });
    } else if (snippet_id.length == 4) {
        $.ajax({
            url: pbUrl + "/" + snippet_id + ".json",
            type: "GET",
            headers: {
                "x-rapidapi-host": "judge0.p.rapidapi.com",
                "x-rapidapi-key": "b87c978454mshc0aeef14416bf63p1af4aejsn7b28b996f363",
            },
            success: function (data, textStatus, jqXHR) {
                sourceEditor.setValue(decode(data["source_code"]));
                $selectLanguage.dropdown("set selected", data["language_id"]);
                $compilerOptions.val(data["compiler_options"]);
                $commandLineArguments.val(data["command_line_arguments"]);
                stdinEditor.setValue(decode(data["stdin"]));
                stdoutEditor.setValue(decode(data["stdout"]));
                stderrEditor.setValue(decode(data["stderr"]));
                compileOutputEditor.setValue(decode(data["compile_output"]));
                sandboxMessageEditor.setValue(decode(data["sandbox_message"]));
                $statusLine.html(decode(data["status_line"]));
                changeEditorLanguage();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                showError("Not Found", "Code not found!");
                window.history.replaceState(null, null, location.origin + location.pathname);
                loadRandomLanguage();
            }
        });
    } else {
        loadRandomLanguage();
    }
}

function run() {
    if (sourceEditor.getValue().trim() === "") {
        showError("Error", "Source code can't be empty!");
        return;
    } else {
        $runBtn.addClass("loading");
    }

    document.getElementById("stdout-dot").hidden = true;
    document.getElementById("stderr-dot").hidden = true;
    document.getElementById("compile-output-dot").hidden = true;
    document.getElementById("sandbox-message-dot").hidden = true;

    stdoutEditor.setValue("");
    stderrEditor.setValue("");
    compileOutputEditor.setValue("");
    sandboxMessageEditor.setValue("");

    let sourceValue = encode(sourceEditor.getValue());
    let stdinValue = encode(stdinEditor.getValue());
    let languageId = resolveLanguageId($selectLanguage.val());
    let compilerOptions = $compilerOptions.val();
    let commandLineArguments = $commandLineArguments.val();

    if (parseInt(languageId) === 44) {
        sourceValue = sourceEditor.getValue();
    }

    let data = {
        source_code: sourceValue,
        language_id: languageId,
        stdin: stdinValue,
        compiler_options: compilerOptions,
        command_line_arguments: commandLineArguments,
        redirect_stderr_to_stdout: redirectStderrToStdout
    };

    let sendRequest = data => {
        timeStart = performance.now();
        $.ajax({
            url: apiUrl + `/submissions?base64_encoded=true&wait=${wait}`,
            type: "POST",
            async: true,
            contentType: "application/json",
            data: JSON.stringify(data),
            headers: {
                "x-rapidapi-host": "judge0.p.rapidapi.com",
                "x-rapidapi-key": "b87c978454mshc0aeef14416bf63p1af4aejsn7b28b996f363",
                "content-type": "application/json",
                "accept": "application/json"
            },
            success: function (data, textStatus, jqXHR) {
                console.log(`Your submission token is: ${data.token}`);
                if (wait == true) {
                    handleResult(data);
                } else {
                    setTimeout(fetchSubmission.bind(null, data.token), check_timeout);
                }
            },
            error: handleRunError
        });
    }

    let fetchAdditionalFiles = false;
    if (parseInt(languageId) === 82) {
        if (sqliteAdditionalFiles === "") {
            fetchAdditionalFiles = true;
            $.ajax({
                url: `https://minio.judge0.com/public/ide/sqliteAdditionalFiles.base64.txt?${Date.now()}`,
                type: "GET",
                async: true,
                contentType: "text/plain",
                headers: {
                    "x-rapidapi-host": "judge0.p.rapidapi.com",
                    "x-rapidapi-key": "b87c978454mshc0aeef14416bf63p1af4aejsn7b28b996f363",
                },
                success: function (responseData, textStatus, jqXHR) {
                    sqliteAdditionalFiles = responseData;
                    data["additional_files"] = sqliteAdditionalFiles;
                    sendRequest(data);
                },
                error: handleRunError
            });
        } else {
            data["additional_files"] = sqliteAdditionalFiles;
        }
    }

    if (!fetchAdditionalFiles) {
        sendRequest(data);
    }
}

function fetchSubmission(submission_token) {
    $.ajax({
        url: apiUrl + "/submissions/" + submission_token + "?base64_encoded=true",
        type: "GET",
        async: true,
        headers: {
            "x-rapidapi-host": "judge0.p.rapidapi.com",
            "x-rapidapi-key": "b87c978454mshc0aeef14416bf63p1af4aejsn7b28b996f363",
        },
        success: function (data, textStatus, jqXHR) {
            if (data.status.id <= 2) { // In Queue or Processing
                setTimeout(fetchSubmission.bind(null, submission_token), check_timeout);
                return;
            }
            handleResult(data);
        },
        error: handleRunError
    });
}

function changeEditorLanguage() {
    monaco.editor.setModelLanguage(sourceEditor.getModel(), $selectLanguage.find(":selected").attr("mode"));
    currentLanguageId = parseInt($selectLanguage.val());
    $(".lm_title")[0].innerText = fileNames[currentLanguageId];
    apiUrl = resolveApiUrl($selectLanguage.val());
}

function insertTemplate() {
    currentLanguageId = parseInt($selectLanguage.val());
    sourceEditor.setValue(sources[currentLanguageId]);
    changeEditorLanguage();
}

function loadRandomLanguage() {
    let values = [];
    for (let i = 0; i < $selectLanguage[0].options.length; ++i) {
        values.push($selectLanguage[0].options[i].value);
    }
    $selectLanguage.dropdown("set selected", values[Math.floor(Math.random() * $selectLanguage[0].length)]);
    apiUrl = resolveApiUrl($selectLanguage.val());
    insertTemplate();
}

function resizeEditor(layoutInfo) {
    if (editorMode != "normal") {
        let statusLineHeight = $("#editor-status-line").height();
        layoutInfo.height -= statusLineHeight;
        layoutInfo.contentHeight -= statusLineHeight;
    }
}

function disposeEditorModeObject() {
    try {
        editorModeObject.dispose();
        editorModeObject = null;
    } catch (ignorable) {}
}

function changeEditorMode() {
    disposeEditorModeObject();

    if (editorMode == "vim") {
        editorModeObject = MonacoVim.initVimMode(sourceEditor, $("#editor-status-line")[0]);
    } else if (editorMode == "emacs") {
        let statusNode = $("#editor-status-line")[0];
        editorModeObject = new MonacoEmacs.EmacsExtension(sourceEditor);
        editorModeObject.onDidMarkChange(e => {
            statusNode.textContent = e ? "Mark Set!" : "Mark Unset";
        });
        editorModeObject.onDidChangeKey(function (str) {
            statusNode.textContent = str;
        });
        editorModeObject.start();
    }
}

function resolveLanguageId(id) {
    id = parseInt(id);
    return id;
}

function resolveApiUrl(id) {
    id = parseInt(id);
    return defaultUrl;
}

function editorsUpdateFontSize(fontSize) {
    sourceEditor.updateOptions({
        fontSize: fontSize
    });
    stdinEditor.updateOptions({
        fontSize: fontSize
    });
    stdoutEditor.updateOptions({
        fontSize: fontSize
    });
    stderrEditor.updateOptions({
        fontSize: fontSize
    });
    compileOutputEditor.updateOptions({
        fontSize: fontSize
    });
    sandboxMessageEditor.updateOptions({
        fontSize: fontSize
    });
}

function updateScreenElements() {
    let display = window.innerWidth <= 1200 ? "none" : "";
    $(".wide.screen.only").each(function (index) {
        $(this).css("display", display);
    });
}

$(window).resize(() => {
    layout.updateSize();
    updateScreenElements();
    showMessages();
});

$(document).ready(() => {
    updateScreenElements();

    $selectLanguage = $("#select-language");
    $selectLanguage.change(e => {
        if (!isEditorDirty) {
            insertTemplate();
        } else {
            changeEditorLanguage();
        }
    });

    $compilerOptions = $("#compiler-options");
    $commandLineArguments = $("#command-line-arguments");
    $commandLineArguments.attr("size", $commandLineArguments.attr("placeholder").length);

    $insertTemplateBtn = $("#insert-template-btn");
    $insertTemplateBtn.click(e => {
        if (isEditorDirty && confirm("Are you sure? Your current changes will be lost.")) {
            insertTemplate();
        }
    });

    $runBtn = $("#run-btn");
    $runBtn.click(e => {
        run();
    });

    $navigationMessage = $("#navigation-message span");
    $updates = $("#updates");

    $(`input[name="editor-mode"][value="${editorMode}"]`).prop("checked", true);
    $("input[name=\"editor-mode\"]").on("change", e => {
        editorMode = e.target.value;
        localStorageSetItem("editorMode", editorMode);

        resizeEditor(sourceEditor.getLayoutInfo());
        changeEditorMode();

        sourceEditor.focus();
    });

    $("input[name=\"redirect-output\"]").prop("checked", redirectStderrToStdout)
    $("input[name=\"redirect-output\"]").on("change", e => {
        redirectStderrToStdout = e.target.checked;
        localStorageSetItem("redirectStderrToStdout", redirectStderrToStdout);
    });

    $statusLine = $("#status-line");

    $("body").keydown(e => {
        let keyCode = e.keyCode || e.which;
        if (keyCode == 120) { // F9
            e.preventDefault();
            run();
        } else if (keyCode == 118) { // F7
            e.preventDefault();
            wait = !wait;
            localStorageSetItem("wait", wait);
            alert(`Submission wait is ${wait ? "ON. Enjoy" : "OFF"}.`);
        } else if (event.ctrlKey && keyCode == 83) { // Ctrl+S
            e.preventDefault();
            save();
        } else if (event.ctrlKey && keyCode == 107) { // Ctrl++
            e.preventDefault();
            fontSize += 1;
            editorsUpdateFontSize(fontSize);
        } else if (event.ctrlKey && keyCode == 109) { // Ctrl+-
            e.preventDefault();
            fontSize -= 1;
            editorsUpdateFontSize(fontSize);
        }
    });

    $("select.dropdown").dropdown();
    $(".ui.dropdown").dropdown();
    $(".ui.dropdown.site-links").dropdown({
        action: "hide",
        on: "hover"
    });
    $(".ui.checkbox").checkbox();
    $(".message .close").on("click", () => {
        $(this).closest(".message").transition("fade");
    });

    loadMessages();

    require(["vs/editor/editor.main", "monaco-vim", "monaco-emacs"], function (ignorable, MVim, MEmacs) {
        layout = new GoldenLayout(layoutConfig, $("#site-content"));

        MonacoVim = MVim;
        MonacoEmacs = MEmacs;

        layout.registerComponent("source", (container, state) => {
            sourceEditor = monaco.editor.create(container.getElement()[0], {
                automaticLayout: true,
                theme: "vs-dark",
                scrollBeyondLastLine: true,
                readOnly: state.readOnly,
                language: "cpp",
                minimap: {
                    enabled: false
                },
                rulers: [80, 120]
            });

            changeEditorMode();

            sourceEditor.getModel().onDidChangeContent(e => {
                currentLanguageId = parseInt($selectLanguage.val());
                isEditorDirty = sourceEditor.getValue() != sources[currentLanguageId];
            });

            sourceEditor.onDidLayoutChange(resizeEditor);
        });

        layout.registerComponent("stdin", (container, state) => {
            stdinEditor = monaco.editor.create(container.getElement()[0], {
                automaticLayout: true,
                theme: "vs-dark",
                scrollBeyondLastLine: false,
                readOnly: state.readOnly,
                language: "plaintext",
                minimap: {
                    enabled: false
                }
            });
        });

        layout.registerComponent("stdout", (container, state) => {
            stdoutEditor = monaco.editor.create(container.getElement()[0], {
                automaticLayout: true,
                theme: "vs-dark",
                scrollBeyondLastLine: false,
                readOnly: state.readOnly,
                language: "plaintext",
                minimap: {
                    enabled: false
                }
            });

            container.on("tab", tab => {
                tab.element.append("<span id=\"stdout-dot\" class=\"dot\" hidden></span>");
                tab.element.on("mousedown", e => {
                    e.target.closest(".lm_tab").children[3].hidden = true;
                });
            });
        });

        layout.registerComponent("stderr", (container, state) => {
            stderrEditor = monaco.editor.create(container.getElement()[0], {
                automaticLayout: true,
                theme: "vs-dark",
                scrollBeyondLastLine: false,
                readOnly: state.readOnly,
                language: "plaintext",
                minimap: {
                    enabled: false
                }
            });

            container.on("tab", tab => {
                tab.element.append("<span id=\"stderr-dot\" class=\"dot\" hidden></span>");
                tab.element.on("mousedown", e => {
                    e.target.closest(".lm_tab").children[3].hidden = true;
                });
            });
        });

        layout.registerComponent("compile output", (container, state) => {
            compileOutputEditor = monaco.editor.create(container.getElement()[0], {
                automaticLayout: true,
                theme: "vs-dark",
                scrollBeyondLastLine: false,
                readOnly: state.readOnly,
                language: "plaintext",
                minimap: {
                    enabled: false
                }
            });

            container.on("tab", tab => {
                tab.element.append("<span id=\"compile-output-dot\" class=\"dot\" hidden></span>");
                tab.element.on("mousedown", e => {
                    e.target.closest(".lm_tab").children[3].hidden = true;
                });
            });
        });

        layout.registerComponent("sandbox message", (container, state) => {
            sandboxMessageEditor = monaco.editor.create(container.getElement()[0], {
                automaticLayout: true,
                theme: "vs-dark",
                scrollBeyondLastLine: false,
                readOnly: state.readOnly,
                language: "plaintext",
                minimap: {
                    enabled: false
                }
            });

            container.on("tab", tab => {
                tab.element.append("<span id=\"sandbox-message-dot\" class=\"dot\" hidden></span>");
                tab.element.on("mousedown", e => {
                    e.target.closest(".lm_tab").children[3].hidden = true;
                });
            });
        });

        layout.on("initialised", () => {
            $(".monaco-editor")[0].appendChild($("#editor-status-line")[0]);
            if (getIdFromURI()) {
                loadSavedSource();
            } else {
                loadRandomLanguage();
            }
            $("#site-navigation").css("border-bottom", "1px solid black");
            sourceEditor.focus();
        });

        layout.init();
    });
});

// Template for different Sources
let cSource = "\
#include <stdio.h>\n\
\n\
int main(void) {\n\
    printf(\"hello, world\\n\");\n\
    return 0;\n\
}\n\
";

let cppSource = "\
#include <iostream>\n\
\n\
int main() {\n\
    std::cout << \"hello, world\" << std::endl;\n\
    return 0;\n\
}\n\
";

let javaSource = "\
public class Main {\n\
    public static void main(String[] args) {\n\
        System.out.println(\"hello, world\");\n\
    }\n\
}\n\
";

let javaScriptSource = "console.log(\"hello, world\");";

let kotlinSource = "\
fun main() {\n\
    println(\"hello, world\")\n\
}\n\
";

let phpSource = "\
<?php\n\
print(\"hello, world\\n\");\n\
?>\n\
";

let plainTextSource = "hello, world\n";

let pythonSource = "print(\"hello, world\")";

let rSource = "cat(\"hello, world\\n\")";

let rubySource = "puts \"hello, world\"";

let rustSource = "\
fn main() {\n\
    println!(\"hello, world\");\n\
}\n\
";

let sqliteSource = "\
-- On  IDE your SQL script is run on chinook database (https://www.sqlitetutorial.net/sqlite-sample-database).\n\
SELECT\n\
    Name, COUNT(*) AS num_albums\n\
FROM artists JOIN albums\n\
ON albums.ArtistID = artists.ArtistID\n\
GROUP BY Name\n\
ORDER BY num_albums DESC\n\
LIMIT 4;\n\
";
let sqliteAdditionalFiles = "";

let swiftSource = "\
import Foundation\n\
let name = readLine()\n\
print(\"hello, \\(name!)\")\n\
";

let typescriptSource = "console.log(\"hello, world\");";

let sources = {

    50: cSource,
    54: cppSource,
    62: javaSource,
    63: javaScriptSource,
    68: phpSource,
    43: plainTextSource,
    70: pythonSource,
    71: pythonSource,
    72: rubySource,
    73: rustSource,
    74: typescriptSource,
    78: kotlinSource,
    80: rSource,
    82: sqliteSource,
    83: swiftSource,
};

let fileNames = {

    50: "main.c",
    54: "main.cpp",
    62: "Main.java",
    63: "script.js",
    68: "script.php",
    43: "text.txt",
    70: "script.py",
    71: "script.py",
    72: "script.rb",
    73: "main.rs",
    74: "script.ts",
    78: "Main.kt",
    80: "script.r",
    82: "script.sql",
    83: "Main.swift",
};