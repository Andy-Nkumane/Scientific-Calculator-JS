let mode = 'degrees'; // Default mode

function clearScreen() {
    document.getElementById("screen").value = "";
}

function appendToScreen(value) {
    document.getElementById("screen").value += value;
}

function deleteLast() {
    const currentExpression = document.getElementById("screen").value;
    // Check if the expression contains an opening bracket
    const openBracketIndex = currentExpression.lastIndexOf('(');

    if (openBracketIndex !== -1 && openBracketIndex === currentExpression.length - 1) {
        // Find the index of the last non-digit character before the opening bracket
        let lastNonDigitIndex = openBracketIndex - 1;
        while (lastNonDigitIndex >= 0 && isNaN(currentExpression[lastNonDigitIndex]) && currentExpression[lastNonDigitIndex] !== "(") {
            lastNonDigitIndex--;
        }

        // If a non-digit character is found, remove everything before the opening bracket except numbers
        if (lastNonDigitIndex !== -1) {
            document.getElementById("screen").value = currentExpression.slice(0, lastNonDigitIndex + 1) + currentExpression.slice(openBracketIndex + 1);
        } else {
            // If no non-digit character is found, remove the opening bracket and everything before it
            document.getElementById("screen").value = currentExpression.slice(openBracketIndex + 1);
        }
    } else {
        // If no opening bracket is found, simply remove the last character
        document.getElementById("screen").value = currentExpression.slice(0, -1);
    }
}

function calculate() {
    const expression = document.getElementById("screen").value;

    if (mode === 'degrees') {
        // Replace sin, cos, tan with their degree versions
        const degExpression = expression.replace(/Math.sin\(/g, 'sinDeg(')
            .replace(/Math.cos\(/g, 'cosDeg(')
            .replace(/Math.tan\(/g, 'tanDeg(');

        try {
            const func = new Function('sinDeg', 'cosDeg', 'tanDeg', `return ${degExpression};`);
            const result = func(
                x => Math.sin(x * Math.PI / 180),
                x => Math.cos(x * Math.PI / 180),
                x => Math.tan(x * Math.PI / 180)
            );
            document.getElementById("screen").value = result;
        } catch (error) {
            alert("Invalid expression");
            clearScreen();
        }
    } else {
        // No conversion needed for radians
        try {
            const result = new Function(`'use strict'; return (${expression})`)();
            document.getElementById("screen").value = result;
        } catch (error) {
            alert("Invalid expression");
            clearScreen();
        }
    }
}

function toggleMode() {
    if (mode === 'degrees') {
        mode = 'radians';
        document.getElementById("mode-toggle").innerText = "Degrees";
        document.getElementById("mode-indicator").innerText = "Mode: Radians";
    } else {
        mode = 'degrees';
        document.getElementById("mode-toggle").innerText = "Radians";
        document.getElementById("mode-indicator").innerText = "Mode: Degrees";
    }
}

// Initialize mode indicator
document.getElementById("mode-indicator").innerText = "Mode: Degrees";
