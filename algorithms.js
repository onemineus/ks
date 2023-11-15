class Frame {
    constructor(e, h) {
        this.elements = [];
        this.highlights = [];
        this.information = "";

        if (e != undefined && e.length) {
            this.elements = e;
        }

        if (h != undefined && h.length) {
            this.highlights = h;
        }
    }

    addHighlights(highlights) {
        for (const e of highlights) {
            this.highlights.push(e);
        }
    }

    addElements(elements) {
        for (const e of elements) {
            this.elements.push(e);
        }
    }
}

class Animation {
    constructor() {
        this.frames = [];
    }

    addFrame(frame) {
        const temp = JSON.parse(JSON.stringify(frame)); // Only store a copy
        this.frames.push(temp);
    }

    getFrames() {
        return this.frames;
    }
}

class Algorithms {
    static bubble(e, order) {
        let elements = e;
        let solution = new Animation();
        let swapped = false;

        for (let i = 0; i < elements.length; ++i) {
            swapped = false;
            for (let j = 0; j < elements.length - 1; ++j) {
                solution.addFrame(new Frame([], [j, j + 1]));

                if (order == "desc" ? elements[j] < elements[j + 1] : elements[j] > elements[j + 1]) {
                    swapped = true;

                    const temp = elements[j];
                    elements[j] = elements[j + 1];
                    elements[j + 1] = temp;

                    solution.addFrame(new Frame([j, j + 1], [j, j + 1]));
                }
            }

            if (!swapped) {
                break;
            }
        }
        return solution;
    }

    

    static insertion(e, order) {
        let elements = e;
        let solution = new Animation();

        for (let i = 1; i < elements.length; ++i) {
            let key = elements[i];
            let j = i - 1;

            solution.addFrame(new Frame([], [j, j + 1]));

            while (j >= 0 && (order == "desc" ? elements[j] < key : elements[j] > key)) {
                solution.addFrame(new Frame([], [j, j + 1]));
                elements[j + 1] = elements[j];
                solution.addFrame(new Frame([j, j + 1], [j, j + 1]));

                j = j - 1;
            }
            elements[j + 1] = key;
        }

        return solution;
    }

    static selection(e, order) {
        let elements = e;
        let solution = new Animation();

        for (let i = 0; i < elements.length - 1; ++i) {
            let current = i;

            solution.addFrame(new Frame([], [i, current]));

            let j = 0;
            for (j = i + 1; j < elements.length; ++j) {
                solution.addFrame(new Frame([], [i, j, current]));

                if (order == "desc" ? elements[j] > elements[current] : elements[j] < elements[current]) {
                    current = j;
                }
            }

            const temp = elements[current];
            elements[current] = elements[i];
            elements[i] = temp;

            solution.addFrame(new Frame([i, current], [j, current]));
        }

        return solution;
    }

    static shell(e, order) {
        let elements = e;
        const n = e.length;
        let solution = new Animation();

        for (let gap = parseInt(n / 2); gap > 0; gap = parseInt(gap / 2)) {
            for (let i = gap; i < n; ++i) {
                const temp = elements[i];
                let j;

                if (!isNaN(j - gap)) {
                    solution.addFrame(new Frame([], [i, j - gap]));
                }

                for (j = i; j >= gap && (order == "desc" ? elements[j - gap] < temp : elements[j - gap] > temp); j -= gap) {
                    solution.addFrame(new Frame([j, j - gap], [i, j - gap]));
                    elements[j] = elements[j - gap];
                    solution.addFrame(new Frame([], [j, j - gap]));
                }

                solution.addFrame(new Frame([], [j, i]));
                elements[j] = temp;
                solution.addFrame(new Frame([], [j, i]));
            }
        }

        return solution;
    }
    static merge(e) {
        let elements = e;
        let solution = new Animation();
        if (elements.length <= 1) {
            return solution;
        }

        const mid = Math.floor(elements.length / 2);
        const left = elements.slice(0, mid);
        const right = elements.slice(mid);

        solution.addFrame(new Frame([], [mid]));

        const leftSolution = Algorithms.merge(left);
        const rightSolution = Algorithms.merge(right);

        let i = 0,
            j = 0,
            k = 0;

        while (i < left.length && j < right.length) {
            solution.addFrame(new Frame([], [k]));

            if (left[i] < right[j]) {
                elements[k] = left[i];
                i++;
            } else {
                elements[k] = right[j];
                j++;
            }

            solution.addFrame(new Frame([i, j], [k]));
            k++;
        }

        while (i < left.length) {
            elements[k] = left[i];
            solution.addFrame(new Frame([], [k]));
            i++;
            k++;
        }

        while (j < right.length) {
            elements[k] = right[j];
            solution.addFrame(new Frame([], [k]));
            j++;
            k++;
        }

        return solution;
    }

    static quick(e, left = 0, right = e.length - 1) {
        let elements = e;
        let solution = new Animation();
        let index;

        if (elements.length > 1) {
            index = Algorithms.partition(elements, left, right);

            if (left < index - 1) {
                const leftPart = Algorithms.quick(elements, left, index - 1);
                solution = Animation.merge(solution, leftPart);
            }

            if (index < right) {
                const rightPart = Algorithms.quick(elements, index, right);
                solution = Animation.merge(solution, rightPart);
            }
        }

        return solution;
    }

    static partition(elements, left, right) {
        const pivot = elements[Math.floor((right + left) / 2)];
        let i = left;
        let j = right;

        while (i <= j) {
            while (elements[i] < pivot) {
                i++;
            }

            while (elements[j] > pivot) {
                j--;
            }

            if (i <= j) {
                const temp = elements[i];
                elements[i] = elements[j];
                elements[j] = temp;
                i++;
                j--;
            }
        }

        return i;
    }
   
}
