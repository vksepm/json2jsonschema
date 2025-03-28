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

    // Celebration message list
    const celebrationMessages = [
        { emoji: "🎉", message: "Awesome! Perfect conversion!" },
        { emoji: "✨", message: "Wow! Conversion successful!" },
        { emoji: "🚀", message: "JSON Schema generation complete!" },
        { emoji: "💯", message: "Perfect conversion success!" },
        { emoji: "🏆", message: "Your JSON Schema is ready!" },
        { emoji: "🥳", message: "Perfect! JSON Schema is ready!" },
        { emoji: "💪", message: "Powerful conversion, perfect result!" },
        { emoji: "🌟", message: "A shining JSON Schema is born!" },
        { emoji: "🔥", message: "Hot JSON Schema fresh out of the oven!" },
        { emoji: "👍", message: "Perfect conversion, it's that simple!" },
        { emoji: "🎯", message: "Accurate hit! JSON Schema generated successfully!" },
        { emoji: "⚡", message: "Lightning-fast conversion speed!" },
        { emoji: "🧙‍♂️", message: "JSON Schema conversion magic complete!" },
        { emoji: "🌈", message: "Beautiful JSON Schema is ready!" },
        { emoji: "🤩", message: "Amazing conversion result!" },
        { emoji: "🎁", message: "A gift for you: a perfect JSON Schema!" },
        { emoji: "🌞", message: "Bright JSON Schema future!" }
    ];

    // Initialize dark mode variable
    let darkMode = false;

    // Add keyboard event listener - Execute conversion when Ctrl+Enter is pressed
    document.addEventListener('keydown', function (e) {
        // Check if Ctrl+Enter (Windows) or Command+Enter (Mac) is pressed
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            // Prevent default behavior (like newline in some editors)
            e.preventDefault();

            // Check if input is valid
            if (validateInput()) {
                // Execute conversion
                convertJsonToSchema();
                createFireworks();
                showCelebrationMessage();
            } else {
                showNotification('Please enter valid JSON first', 'error');
            }
        }
    });

    // Apply theme functionality
    function applyTheme(isDark) {
        darkMode = isDark;

        // Update icon
        const icon = themeToggle.querySelector('i');
        if (isDark) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }

        // Update body background
        document.body.classList.toggle('bg-gray-900', isDark);
        document.body.classList.toggle('bg-slate-100', !isDark);

        // Update cards
        const cards = document.querySelectorAll('.bg-white, .bg-gray-800');
        cards.forEach(card => {
            card.classList.toggle('bg-gray-800', isDark);
            card.classList.toggle('bg-white', !isDark);
            card.classList.toggle('text-white', isDark);
        });

        // Update headings
        const headings = document.querySelectorAll('h2, label');
        headings.forEach(heading => {
            heading.classList.toggle('text-white', isDark);
            heading.classList.toggle('text-gray-800', !isDark);
        });

        // Update editors
        const editors = document.querySelectorAll('.editor');
        editors.forEach(editor => {
            editor.classList.toggle('bg-gray-700', isDark);
            editor.classList.toggle('bg-gray-50', !isDark);
            editor.classList.toggle('text-white', isDark);
            editor.classList.toggle('text-gray-800', !isDark);
            editor.classList.toggle('border-gray-600', isDark);
            editor.classList.toggle('border-gray-300', !isDark);
        });

        // Update convert action background
        if (convertAction) {
            convertAction.classList.toggle('bg-gray-700', isDark);
            convertAction.classList.toggle('bg-gray-50', !isDark);
            convertAction.classList.toggle('border-gray-600', isDark);
            convertAction.classList.toggle('border-gray-200', !isDark);
        }

        // Save settings to localStorage
        localStorage.setItem('darkMode', isDark ? 'true' : 'false');
    }

    // Initialize theme settings
    function initTheme() {
        // Check settings in localStorage
        const savedTheme = localStorage.getItem('darkMode');

        if (savedTheme !== null) {
            // Use saved settings
            applyTheme(savedTheme === 'true');
        } else {
            // Check user system preference
            const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
            applyTheme(prefersDarkScheme.matches);

            // Listen for system theme changes
            prefersDarkScheme.addEventListener('change', (e) => {
                applyTheme(e.matches);
            });
        }
    }

    // Initialize theme
    initTheme();

    // Toggle dark mode
    themeToggle.addEventListener('click', () => {
        applyTheme(!darkMode);
    });

    // Add function to create fireworks effect
    function createFireworks() {
        const colors = [
            '#FF5252', '#FF4081', '#E040FB', '#7C4DFF',
            '#536DFE', '#448AFF', '#40C4FF', '#18FFFF',
            '#64FFDA', '#69F0AE', '#B2FF59', '#EEFF41',
            '#FFFF00', '#FFD740', '#FFAB40', '#FF6E40'
        ];

        // Create fireworks count based on screen size
        const fireworksCount = window.innerWidth < 768 ? 3 : 5;

        for (let i = 0; i < fireworksCount; i++) {
            createSingleFirework(colors);
        }
    }

    function createSingleFirework(colors) {
        // Create firework container
        const firework = document.createElement('div');
        firework.className = 'firework';
        document.body.appendChild(firework);

        // Randomly position firework within window
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * (window.innerHeight * 0.6);  // Mainly in the upper 60% area
        firework.style.left = `${x}px`;
        firework.style.top = `${y}px`;

        // Create firework particles
        const particleCount = Math.floor(Math.random() * 20) + 30; // 30-50 particles

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'firework-particle';

            // Random color
            const color = colors[Math.floor(Math.random() * colors.length)];
            particle.style.background = color;

            // Random movement direction and distance
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 100 + 50;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;

            particle.style.setProperty('--tx', `${tx}px`);
            particle.style.setProperty('--ty', `${ty}px`);

            firework.appendChild(particle);
        }

        // Remove element after firework is complete
        setTimeout(() => {
            document.body.removeChild(firework);
        }, 1500);
    }

    // Show celebration message
    function showCelebrationMessage() {
        // Randomly select one from the message list
        const celebration = celebrationMessages[Math.floor(Math.random() * celebrationMessages.length)];

        // Create celebration message element
        const messageEl = document.createElement('div');
        messageEl.className = 'celebration-message';
        messageEl.innerHTML = `<span class="celebration-emoji">${celebration.emoji}</span>${celebration.message}`;

        // Add to page
        document.body.appendChild(messageEl);

        // Set remove timer
        setTimeout(() => {
            document.body.removeChild(messageEl);
        }, 3000);
    }

    // Show notification
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

    // Paste functionality
    pasteButton.addEventListener('click', async () => {
        try {
            const text = await navigator.clipboard.readText();
            insertPlainText(text);
            // Validate input
            if (validateInput()) {
                // Automatically convert JSON to JSON Schema after validation success
                convertJsonToSchema();
                createFireworks();
                showCelebrationMessage();
            }
        } catch (err) {
            console.error('Failed to read clipboard contents: ', err);
            showNotification('Unable to access clipboard, please paste content manually', 'error');
        }
    });

    // Insert plain text functionality
    function insertPlainText(text) {
        // Clear existing content
        jsonInput.innerHTML = '';
        // Insert plain text
        const textNode = document.createTextNode(text);
        jsonInput.appendChild(textNode);

        // Try formatting JSON
        formatJson();
    }

    // Try formatting JSON (kept for backward compatibility)
    function tryFormatJson() {
        return formatJson();
    }

    // Format JSON functionality
    function formatJson() {
        try {
            const jsonText = jsonInput.textContent.trim();
            if (jsonText) {
                const jsonObj = JSON.parse(jsonText);
                const formattedJson = JSON.stringify(jsonObj, null, 2);
                jsonInput.textContent = formattedJson;
                highlightJsonInElement(jsonInput);
                inputStatus.innerHTML = '<span class="text-green-600"><i class="fas fa-check-circle mr-1"></i>JSON format beautified</span>';
                return true;
            }
            return false;
        } catch (e) {
            inputStatus.innerHTML = `<span class="text-red-600"><i class="fas fa-exclamation-circle mr-1"></i>Invalid JSON: ${e.message}</span>`;
            return false;
        }
    }

    // Listen for input changes
    jsonInput.addEventListener('input', validateInput);

    // Validate input JSON
    function validateInput() {
        try {
            const jsonText = jsonInput.textContent.trim();
            if (jsonText) {
                JSON.parse(jsonText);
                inputStatus.innerHTML = '<span class="text-green-600"><i class="fas fa-check-circle mr-1"></i>Valid JSON</span>';
                convertButton.classList.add('pulse-animation');
                return true;
            } else {
                inputStatus.textContent = '';
                convertButton.classList.remove('pulse-animation');
                return false;
            }
        } catch (e) {
            inputStatus.innerHTML = `<span class="text-red-600"><i class="fas fa-exclamation-circle mr-1"></i>Invalid JSON: ${e.message}</span>`;
            convertButton.classList.remove('pulse-animation');
            return false;
        }
    }

    // Highlight JSON in element
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

            // Move cursor to the end
            const range = document.createRange();
            const sel = window.getSelection();
            range.selectNodeContents(element);
            range.collapse(false);
            sel.removeAllRanges();
            sel.addRange(range);
        } catch (e) {
            // Ignore highlight error
        }
    }

    // Highlight JSON
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

    // Clear input
    clearInputButton.addEventListener('click', () => {
        jsonInput.textContent = '';
        schemaOutput.textContent = '';
        inputStatus.textContent = '';
        copyButton.disabled = true;
        downloadButton.disabled = true;
        convertButton.classList.remove('pulse-animation');
    });

    // Convert JSON to JSON Schema
    convertButton.addEventListener('click', () => {
        if (!validateInput()) {
            showNotification('Please enter valid JSON first', 'error');
            return;
        }

        convertJsonToSchema();
        createFireworks();
        showCelebrationMessage();
    });

    // Add event listener for mobile conversion button
    convertButtonMobile.addEventListener('click', () => {
        if (!validateInput()) {
            showNotification('Please enter valid JSON first', 'error');
            return;
        }

        convertJsonToSchema();
        createFireworks();
        showCelebrationMessage();
    });

    // Listen for paste events
    jsonInput.addEventListener('paste', (e) => {
        // Prevent default paste
        e.preventDefault();

        // Get plain text
        const text = (e.clipboardData || window.clipboardData).getData('text');

        // Insert plain text
        insertPlainText(text);

        // Validate input
        setTimeout(() => {
            // Validate input
            if (validateInput()) {
                // Automatically convert JSON to JSON Schema after validation success
                convertJsonToSchema();
                createFireworks();
                showCelebrationMessage();
            }
        }, 0);
    });

    // Copy result
    copyButton.addEventListener('click', () => {
        const schema = schemaOutput.textContent;
        if (!schema) return;

        navigator.clipboard.writeText(schema).then(() => {
            showNotification('Copied to clipboard!');
        }).catch(err => {
            showNotification('Copy failed: ' + err, 'error');
        });
    });

    // Download result
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

        showNotification('Download started!');
    });

    // Drag and drop functionality
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        jsonInputContainer.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    // Drag enter
    ['dragenter', 'dragover'].forEach(eventName => {
        jsonInputContainer.addEventListener(eventName, () => {
            dragOverlay.classList.remove('hidden');
        }, false);
    });

    // Drag leave
    ['dragleave', 'drop'].forEach(eventName => {
        jsonInputContainer.addEventListener(eventName, () => {
            dragOverlay.classList.add('hidden');
        }, false);
    });

    // Drag drop
    jsonInputContainer.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;

        if (files.length) {
            const file = files[0];

            // Check file type
            if (file.type === 'application/json' || file.name.endsWith('.json')) {
                const reader = new FileReader();

                reader.onload = function (event) {
                    try {
                        // Read file content
                        const fileContent = event.target.result;

                        // console.log('File content:', fileContent);

                        // Insert plain text
                        insertPlainText(fileContent);

                        // Validate input
                        if (validateInput()) {
                            // Automatically convert JSON to JSON Schema after validation success
                            convertJsonToSchema();
                            createFireworks();
                            showCelebrationMessage();
                        } else {
                            showNotification(`File loaded successfully: ${file.name}`);
                        }
                    } catch (error) {
                        showNotification(`Unable to read JSON file: ${error.message}`, 'error');
                    }
                };

                reader.onerror = function () {
                    showNotification('Error occurred while reading the file', 'error');
                };

                reader.readAsText(file);
            } else {
                showNotification('Please upload a JSON format file', 'error');
            }
        }
    }

    // Conversion function - JSON to JSON Schema
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
            // Detect item types in array
            const itemTypes = new Set(json.map(item => getType(item)));

            if (itemTypes.size === 1) {
                // All items in the array are of the same type
                const itemType = itemTypes.values().next().value;

                if (itemType === 'object' && json.length > 0) {
                    // If it's an object array, try to find common properties
                    schema.items = {
                        type: 'object',
                        properties: {},
                        required: []
                    };

                    // Collect all non-null object's properties
                    const allProperties = new Set();
                    const validObjects = json.filter(item => item !== null && typeof item === 'object');

                    if (validObjects.length > 0) {
                        // First collect all properties
                        validObjects.forEach(item => {
                            Object.keys(item).forEach(key => {
                                if (item[key] !== null) {
                                    allProperties.add(key);
                                }
                            });
                        });

                        // Then create schema for each property
                        allProperties.forEach(key => {
                            // Find the first valid item that contains this property and is not null
                            const validItem = validObjects.find(item => item[key] !== null);
                            if (validItem) {
                                schema.items.properties[key] = getPropertySchema(validItem[key]);
                                schema.items.required.push(key);
                            }
                        });
                    }
                } else {
                    // For other types of arrays
                    schema.items = {
                        type: itemType
                    };
                }
            } else {
                // Mixed types of items in the array
                schema.items = {};
            }
        }

        return schema;
    }

    // Get JSON value type
    function getType(value) {
        if (value === null) return 'null';
        if (Array.isArray(value)) return 'array';
        return typeof value;
    }

    // Get property schema
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

    // Add some initial animation effects
    setTimeout(() => {
        document.querySelectorAll('.fade-in').forEach(el => {
            el.style.opacity = 1;
        });
    }, 100);

    // Beautify JSON
    formatButton.addEventListener('click', () => {
        formatJson();
    });

    // Add a function to handle JSON to JSON Schema conversion for reuse
    function convertJsonToSchema() {
        const jsonText = jsonInput.textContent.trim();
        const json = JSON.parse(jsonText);
        const schema = convertToJsonSchema(json);

        // Highlight result
        highlightJson(schema, schemaOutput);

        // Enable buttons
        copyButton.disabled = false;
        downloadButton.disabled = false;

        // Add animation effect
        schemaOutput.classList.add('fade-in');
        setTimeout(() => {
            schemaOutput.classList.remove('fade-in');
        }, 500);
    }

    // Define multiple JSON examples
    const jsonExamples = [
        // Example 1: User profile
        {
            id: "usr12345",
            firstName: "John",
            lastName: "Smith",
            email: "john.smith@example.com",
            age: 28,
            address: {
                street: "123 Main Street",
                city: "New York",
                state: "NY",
                zipCode: "10001",
                country: "USA"
            },
            phoneNumbers: [
                {
                    type: "home",
                    number: "212-555-1234"
                },
                {
                    type: "work",
                    number: "646-555-5678"
                }
            ],
            isActive: true,
            registrationDate: "2023-04-15T10:30:00Z"
        },
        // Example 2: Product catalog item
        {
            productId: "prod-8793",
            name: "Wireless Bluetooth Headphones",
            description: "Premium noise-cancelling headphones with 30-hour battery life",
            price: 149.99,
            currency: "USD",
            category: "Electronics",
            tags: ["audio", "wireless", "bluetooth", "headphones"],
            specifications: {
                brand: "SoundMaster",
                model: "HD-2000",
                color: "Black",
                weight: "250g",
                dimensions: {
                    height: "18cm",
                    width: "15cm",
                    depth: "8cm"
                },
                batteryLife: "30 hours"
            },
            inStock: true,
            availableColors: ["black", "silver", "blue"],
            ratings: {
                average: 4.7,
                count: 253
            }
        },
        // Example 3: Blog post
        {
            postId: "article-4567",
            title: "10 Tips for Effective Time Management",
            slug: "10-tips-effective-time-management",
            author: {
                id: "auth-789",
                name: "Emma Wilson",
                bio: "Productivity expert and bestselling author",
                avatar: "https://example.com/avatars/emma-wilson.jpg"
            },
            publishDate: "2024-02-18T09:15:30Z",
            lastModified: "2024-02-20T14:22:10Z",
            content: "Time management is essential for achieving your goals...",
            excerpt: "Learn how to maximize your productivity with these proven time management strategies.",
            categories: ["Productivity", "Self-improvement"],
            tags: ["time management", "productivity", "planning", "habits"],
            featuredImage: "https://example.com/images/time-management.jpg",
            status: "published",
            comments: [
                {
                    id: "comment-123",
                    author: "David Chen",
                    content: "Great article! I especially liked the point about setting priorities.",
                    date: "2024-02-19T10:45:12Z"
                }
            ],
            viewCount: 1243,
            likeCount: 87
        },
        // Example 4: Recipe information
        {
            recipeId: "recipe-567",
            title: "Classic Chocolate Chip Cookies",
            difficulty: "easy",
            prepTime: 15,
            cookTime: 12,
            totalTime: 27,
            servings: 24,
            ingredients: [
                {
                    name: "all-purpose flour",
                    amount: 2.25,
                    unit: "cups"
                },
                {
                    name: "butter",
                    amount: 1,
                    unit: "cup"
                },
                {
                    name: "granulated sugar",
                    amount: 0.75,
                    unit: "cup"
                },
                {
                    name: "brown sugar",
                    amount: 0.75,
                    unit: "cup"
                },
                {
                    name: "large eggs",
                    amount: 2,
                    unit: "count"
                },
                {
                    name: "vanilla extract",
                    amount: 1,
                    unit: "teaspoon"
                },
                {
                    name: "chocolate chips",
                    amount: 2,
                    unit: "cups"
                }
            ],
            instructions: [
                "Preheat oven to 375°F (190°C).",
                "Combine flour, baking soda, and salt in a small bowl.",
                "Beat butter, granulated sugar, and brown sugar in a large mixing bowl.",
                "Add eggs one at a time, then stir in vanilla.",
                "Gradually beat in flour mixture.",
                "Stir in chocolate chips.",
                "Drop by rounded tablespoon onto ungreased baking sheets.",
                "Bake for 9 to 11 minutes or until golden brown."
            ],
            nutritionFacts: {
                calories: 150,
                fat: 7,
                carbs: 22,
                protein: 2,
                sugar: 15
            },
            tags: ["dessert", "baking", "cookies", "chocolate"]
        },
        // Example 5: Weather data
        {
            location: {
                city: "London",
                country: "United Kingdom",
                coordinates: {
                    latitude: 51.5074,
                    longitude: -0.1278
                },
                timezone: "Europe/London"
            },
            currentWeather: {
                timestamp: "2024-03-25T14:30:00Z",
                temperature: {
                    current: 12.5,
                    feelsLike: 11.2,
                    min: 8.3,
                    max: 14.1,
                    unit: "celsius"
                },
                humidity: 65,
                windSpeed: 18.5,
                windDirection: "SW",
                pressure: 1012,
                visibility: 9.7,
                uvIndex: 3,
                condition: {
                    main: "Cloudy",
                    description: "Partly cloudy with occasional showers",
                    icon: "cloud-rain"
                },
                precipitation: {
                    probability: 40,
                    intensity: "light"
                }
            },
            forecast: [
                {
                    date: "2024-03-26",
                    sunrise: "05:48:00",
                    sunset: "18:32:00",
                    temperature: {
                        min: 7.2,
                        max: 13.8,
                        unit: "celsius"
                    },
                    condition: "Sunny"
                },
                {
                    date: "2024-03-27",
                    sunrise: "05:46:00",
                    sunset: "18:34:00",
                    temperature: {
                        min: 6.5,
                        max: 12.1,
                        unit: "celsius"
                    },
                    condition: "Rainy"
                }
            ],
            alerts: [
                {
                    type: "Wind Advisory",
                    severity: "moderate",
                    description: "Strong winds expected between 14:00 and 20:00",
                    issuedAt: "2024-03-25T08:00:00Z",
                    expiresAt: "2024-03-25T21:00:00Z"
                }
            ]
        }
    ];

    // Insert a random JSON example from the examples array into the editor
    function insertRandomJsonExample() {
        const randomIndex = Math.floor(Math.random() * jsonExamples.length);
        const randomExample = jsonExamples[randomIndex];
        const formattedJson = JSON.stringify(randomExample, null, 2);
        insertPlainText(formattedJson);
    }

    // Insert a random example on initialization instead of a fixed simple example
    insertRandomJsonExample();
});