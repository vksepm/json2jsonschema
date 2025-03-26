document.addEventListener('DOMContentLoaded', function () {
    const jsonInput = document.getElementById('json-input');
    const jsonInputContainer = document.getElementById('json-input-container');
    const dragOverlay = document.getElementById('drag-overlay');
    const schemaOutput = document.getElementById('schema-output');
    const convertButton = document.getElementById('convert-button');
    const convertButtonMobile = document.getElementById('convert-button-mobile');
    const copyButton = document.getElementById('copy-button');
    const downloadButton = document.getElementById('download-button');
    const clearInputButton = document.getElementById('clear-input-button');
    const pasteButton = document.getElementById('paste-button');
    const formatButton = document.getElementById('format-button');
    const inputStatus = document.getElementById('input-status');
    const themeToggle = document.getElementById('theme-toggle');
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    const convertAction = document.getElementById('convert-action');

    // 初始化深色模式變數
    let darkMode = false;

    // 套用主題功能
    function applyTheme(isDark) {
        darkMode = isDark;

        // 更新圖示
        const icon = themeToggle.querySelector('i');
        if (isDark) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }

        // 更新 body 背景
        document.body.classList.toggle('bg-gray-900', isDark);
        document.body.classList.toggle('bg-slate-100', !isDark);

        // 更新卡片
        const cards = document.querySelectorAll('.bg-white, .bg-gray-800');
        cards.forEach(card => {
            card.classList.toggle('bg-gray-800', isDark);
            card.classList.toggle('bg-white', !isDark);
            card.classList.toggle('text-white', isDark);
        });

        // 更新標題
        const headings = document.querySelectorAll('h2, h3, label');
        headings.forEach(heading => {
            heading.classList.toggle('text-white', isDark);
            heading.classList.toggle('text-gray-800', !isDark);
        });

        // 更新編輯器
        const editors = document.querySelectorAll('.editor');
        editors.forEach(editor => {
            editor.classList.toggle('bg-gray-700', isDark);
            editor.classList.toggle('bg-gray-50', !isDark);
            editor.classList.toggle('text-white', isDark);
            editor.classList.toggle('text-gray-800', !isDark);
            editor.classList.toggle('border-gray-600', isDark);
            editor.classList.toggle('border-gray-300', !isDark);
        });

        // 更新轉換動作背景
        if (convertAction) {
            convertAction.classList.toggle('bg-gray-700', isDark);
            convertAction.classList.toggle('bg-gray-50', !isDark);
            convertAction.classList.toggle('border-gray-600', isDark);
            convertAction.classList.toggle('border-gray-200', !isDark);
        }

        // 儲存設定到 localStorage
        localStorage.setItem('darkMode', isDark ? 'true' : 'false');
    }

    // 初始化主題設定
    function initTheme() {
        // 檢查 localStorage 中的設定
        const savedTheme = localStorage.getItem('darkMode');

        if (savedTheme !== null) {
            // 使用已儲存的設定
            applyTheme(savedTheme === 'true');
        } else {
            // 檢查使用者系統偏好
            const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
            applyTheme(prefersDarkScheme.matches);

            // 監聽系統主題變更
            prefersDarkScheme.addEventListener('change', (e) => {
                applyTheme(e.matches);
            });
        }
    }

    // 初始化主題
    initTheme();

    // 切換暗黑模式
    themeToggle.addEventListener('click', () => {
        applyTheme(!darkMode);
    });

    // 顯示通知
    function showNotification(message, type = 'success') {
        notificationMessage.textContent = message;
        notification.classList.remove('hidden', 'bg-gray-800', 'bg-green-600', 'bg-red-600');

        if (type === 'success') {
            notification.classList.add('bg-green-600');
        } else if (type === 'error') {
            notification.classList.add('bg-red-600');
        } else {
            notification.classList.add('bg-gray-800');
        }

        notification.classList.add('fade-in');

        setTimeout(() => {
            notification.classList.add('hidden');
        }, 3000);
    }

    // 貼上功能
    pasteButton.addEventListener('click', async () => {
        try {
            const text = await navigator.clipboard.readText();
            insertPlainText(text);
            // 驗證輸入
            if (validateInput()) {
                // 在驗證成功後自動轉換 JSON 到 JSON Schema
                convertJsonToSchema();
                showNotification(`已成功貼上並轉換格式`);
            }
        } catch (err) {
            console.error('Failed to read clipboard contents: ', err);
            showNotification('無法訪問剪貼簿，請手動貼上內容', 'error');
        }
    });

    // 純文字插入功能
    function insertPlainText(text) {
        // 清除現有内容
        jsonInput.innerHTML = '';
        // 插入純文字
        const textNode = document.createTextNode(text);
        jsonInput.appendChild(textNode);

        // 嘗試格式化 JSON
        formatJson();
    }

    // 嘗試格式化 JSON (保留此函數作為向後兼容)
    function tryFormatJson() {
        return formatJson();
    }

    // 格式化 JSON 功能
    function formatJson() {
        try {
            const jsonText = jsonInput.textContent.trim();
            if (jsonText) {
                const jsonObj = JSON.parse(jsonText);
                const formattedJson = JSON.stringify(jsonObj, null, 2);
                jsonInput.textContent = formattedJson;
                highlightJsonInElement(jsonInput);
                inputStatus.innerHTML = '<span class="text-green-600"><i class="fas fa-check-circle mr-1"></i>已美化 JSON 格式</span>';
                return true;
            }
            return false;
        } catch (e) {
            inputStatus.innerHTML = `<span class="text-red-600"><i class="fas fa-exclamation-circle mr-1"></i>無效的 JSON: ${e.message}</span>`;
            return false;
        }
    }

    // 監聽輸入變化
    jsonInput.addEventListener('input', validateInput);

    // 驗證輸入的 JSON
    function validateInput() {
        try {
            const jsonText = jsonInput.textContent.trim();
            if (jsonText) {
                JSON.parse(jsonText);
                inputStatus.innerHTML = '<span class="text-green-600"><i class="fas fa-check-circle mr-1"></i>有效的 JSON</span>';
                convertButton.classList.add('pulse-animation');
                return true;
            } else {
                inputStatus.textContent = '';
                convertButton.classList.remove('pulse-animation');
                return false;
            }
        } catch (e) {
            inputStatus.innerHTML = `<span class="text-red-600"><i class="fas fa-exclamation-circle mr-1"></i>無效的 JSON: ${e.message}</span>`;
            convertButton.classList.remove('pulse-animation');
            return false;
        }
    }

    // 在元素中高亮顯示 JSON
    function highlightJsonInElement(element) {
        try {
            const jsonText = element.textContent;
            if (!jsonText.trim()) return;

            let highlighted = jsonText
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
                    let cls = 'json-number';
                    if (/^"/.test(match)) {
                        if (/:$/.test(match)) {
                            cls = 'json-key';
                        } else {
                            cls = 'json-string';
                        }
                    } else if (/true|false/.test(match)) {
                        cls = 'json-boolean';
                    } else if (/null/.test(match)) {
                        cls = 'json-null';
                    }
                    return '<span class="' + cls + '">' + match + '</span>';
                });

            element.innerHTML = highlighted;

            // 將光標移到末尾
            const range = document.createRange();
            const sel = window.getSelection();
            range.selectNodeContents(element);
            range.collapse(false);
            sel.removeAllRanges();
            sel.addRange(range);
        } catch (e) {
            // 忽略高亮錯誤
        }
    }

    // 高亮顯示 JSON
    function highlightJson(json, container) {
        let highlighted = JSON.stringify(json, null, 2)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
                let cls = 'json-number';
                if (/^"/.test(match)) {
                    if (/:$/.test(match)) {
                        cls = 'json-key';
                    } else {
                        cls = 'json-string';
                    }
                } else if (/true|false/.test(match)) {
                    cls = 'json-boolean';
                } else if (/null/.test(match)) {
                    cls = 'json-null';
                }
                return '<span class="' + cls + '">' + match + '</span>';
            });

        container.innerHTML = highlighted;
    }

    // 清空輸入
    clearInputButton.addEventListener('click', () => {
        jsonInput.textContent = '';
        schemaOutput.textContent = '';
        inputStatus.textContent = '';
        copyButton.disabled = true;
        downloadButton.disabled = true;
        convertButton.classList.remove('pulse-animation');
    });

    // 轉換 JSON 到 JSON Schema
    convertButton.addEventListener('click', () => {
        if (!validateInput()) {
            showNotification('請先輸入有效的 JSON', 'error');
            return;
        }

        convertJsonToSchema();
        showNotification('成功生成 JSON Schema！');
    });

    // 為移動版轉換按鈕添加事件監聽
    convertButtonMobile.addEventListener('click', () => {
        if (!validateInput()) {
            showNotification('請先輸入有效的 JSON', 'error');
            return;
        }

        convertJsonToSchema();
        showNotification('成功生成 JSON Schema！');
    });

    // 監聽貼上事件
    jsonInput.addEventListener('paste', (e) => {
        // 阻止默認貼上
        e.preventDefault();

        // 獲取純文字
        const text = (e.clipboardData || window.clipboardData).getData('text');

        // 插入純文字
        insertPlainText(text);

        // 驗證輸入
        setTimeout(validateInput, 0);
    });

    // 複製結果
    copyButton.addEventListener('click', () => {
        const schema = schemaOutput.textContent;
        if (!schema) return;

        navigator.clipboard.writeText(schema).then(() => {
            showNotification('已複製到剪貼簿！');
        }).catch(err => {
            showNotification('複製失敗：' + err, 'error');
        });
    });

    // 下載結果
    downloadButton.addEventListener('click', () => {
        const schema = schemaOutput.textContent;
        if (!schema) return;

        const blob = new Blob([schema], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'schema.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showNotification('已開始下載！');
    });

    // 拖曳檔案功能
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        jsonInputContainer.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    // 拖曳進入
    ['dragenter', 'dragover'].forEach(eventName => {
        jsonInputContainer.addEventListener(eventName, () => {
            dragOverlay.classList.remove('hidden');
        }, false);
    });

    // 拖曳離開
    ['dragleave', 'drop'].forEach(eventName => {
        jsonInputContainer.addEventListener(eventName, () => {
            dragOverlay.classList.add('hidden');
        }, false);
    });

    // 拖曳放下
    jsonInputContainer.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;

        if (files.length) {
            const file = files[0];

            // 檢查檔案類型
            if (file.type === 'application/json' || file.name.endsWith('.json')) {
                const reader = new FileReader();

                reader.onload = function (event) {
                    try {
                        // 讀取檔案內容
                        const fileContent = event.target.result;

                        // console.log('File content:', fileContent);

                        // 插入純文字
                        insertPlainText(fileContent);

                        // 驗證輸入
                        if (validateInput()) {
                            // 在驗證成功後自動轉換 JSON 到 JSON Schema
                            convertJsonToSchema();
                            showNotification(`已成功載入並轉換檔案：${file.name}`);
                        } else {
                            showNotification(`已成功載入檔案：${file.name}`);
                        }
                    } catch (error) {
                        showNotification(`無法讀取 JSON 檔案: ${error.message}`, 'error');
                    }
                };

                reader.onerror = function () {
                    showNotification('讀取檔案時發生錯誤', 'error');
                };

                reader.readAsText(file);
            } else {
                showNotification('請上傳 JSON 格式的檔案', 'error');
            }
        }
    }

    // 轉換函數 - JSON 到 JSON Schema
    function convertToJsonSchema(json) {
        const schema = {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: getType(json)
        };

        if (schema.type === 'object') {
            schema.properties = {};
            schema.required = [];

            Object.keys(json).forEach(key => {
                schema.properties[key] = getPropertySchema(json[key]);
                schema.required.push(key);
            });

            if (schema.required.length === 0) {
                delete schema.required;
            }
        } else if (schema.type === 'array' && json.length > 0) {
            // 檢測陣列中的項目類型
            const itemTypes = new Set(json.map(item => getType(item)));

            if (itemTypes.size === 1) {
                // 陣列中的所有項目都是相同類型
                const itemType = itemTypes.values().next().value;

                if (itemType === 'object' && json.length > 0) {
                    // 如果是物件陣列，嘗試找出共同屬性
                    schema.items = {
                        type: 'object',
                        properties: {},
                        required: []
                    };

                    // 收集第一個物件的所有屬性作為基準
                    const firstItem = json[0];
                    Object.keys(firstItem).forEach(key => {
                        schema.items.properties[key] = getPropertySchema(firstItem[key]);
                        schema.items.required.push(key);
                    });
                } else {
                    // 對於其他類型的陣列
                    schema.items = {
                        type: itemType
                    };
                }
            } else {
                // 陣列中有混合類型的項目
                schema.items = {};
            }
        }

        return schema;
    }

    // 獲取 JSON 值的類型
    function getType(value) {
        if (value === null) return 'null';
        if (Array.isArray(value)) return 'array';
        return typeof value;
    }

    // 獲取屬性的 schema
    function getPropertySchema(value) {
        const type = getType(value);
        const schema = { type: type === 'null' ? 'null' : type };

        if (type === 'object') {
            schema.properties = {};
            schema.required = [];

            Object.keys(value).forEach(key => {
                schema.properties[key] = getPropertySchema(value[key]);
                schema.required.push(key);
            });

            if (schema.required.length === 0) {
                delete schema.required;
            }
        } else if (type === 'array' && value.length > 0) {
            const itemType = getType(value[0]);

            if (itemType === 'object') {
                schema.items = {
                    type: 'object',
                    properties: {},
                    required: []
                };

                Object.keys(value[0]).forEach(key => {
                    schema.items.properties[key] = getPropertySchema(value[0][key]);
                    schema.items.required.push(key);
                });
            } else {
                schema.items = {
                    type: itemType
                };
            }
        }

        return schema;
    }

    // 添加一些初始動畫效果
    setTimeout(() => {
        document.querySelectorAll('.fade-in').forEach(el => {
            el.style.opacity = 1;
        });
    }, 100);

    // 美化 JSON
    formatButton.addEventListener('click', () => {
        formatJson();
    });

    // 新增一個函數來處理 JSON 到 JSON Schema 的轉換，這樣可以在多個地方重複使用
    function convertJsonToSchema() {
        const jsonText = jsonInput.textContent.trim();
        const json = JSON.parse(jsonText);
        const schema = convertToJsonSchema(json);

        // 高亮顯示結果
        highlightJson(schema, schemaOutput);

        // 啟用按鈕
        copyButton.disabled = false;
        downloadButton.disabled = false;

        // 添加動畫效果
        schemaOutput.classList.add('fade-in');
        setTimeout(() => {
            schemaOutput.classList.remove('fade-in');
        }, 500);
    }
});