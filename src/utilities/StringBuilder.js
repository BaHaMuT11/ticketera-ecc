class StringBuilder {
    constructor(initialValue = "") {
        this.strings = [initialValue];
    }

    append(value) {
        this.strings.push(value);
        return this;
    }

    appendLine(value) {
        this.strings.push("\n", value);
        return this;
    }

    prepend(value) {
        this.strings.unshift(value);
        return this;
    }

    insertAt(index, value) {
        this.strings.splice(index, 0, value);
        return this;
    }

    toString() {
        return this.strings.join("");
    }

    clear() {
        this.strings = [];
        return this;
    }
}