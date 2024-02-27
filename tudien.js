// Định nghĩa lớp Node để biểu diễn một nút trong cây AVL
class Node {
    constructor(key, value) {
        this.key = key;
        this.value = value;
        this.left = null;
        this.right = null;
        this.height = 1;
    }
}

// Định nghĩa lớp AVLTree để biểu diễn cây AVL
class AVLTree {
    constructor() {
        this.root = null;
    }

    // Tính chiều cao của một nút
    getHeight(node) {
        if (node === null) {
            return 0;
        }
        return node.height;
    }

    // Tính độ cân bằng của một nút
    getBalanceFactor(node) {
        if (node === null) {
            return 0;
        }
        return this.getHeight(node.left) - this.getHeight(node.right);
    }

    // Cập nhật chiều cao của một nút
    updateHeight(node) {
        if (node === null) {
            return;
        }
        node.height = Math.max(this.getHeight(node.left), this.getHeight(node.right)) + 1;
    }

    // Quay phải (right rotation) để cân bằng cây AVL
    rotateRight(z) {
        const y = z.left;
        const T3 = y.right;

        y.right = z;
        z.left = T3;

        this.updateHeight(z);
        this.updateHeight(y);

        return y;
    }

    // Quay trái (left rotation) để cân bằng cây AVL
    rotateLeft(z) {
        const y = z.right;
        const T2 = y.left;

        y.left = z;
        z.right = T2;

        this.updateHeight(z);
        this.updateHeight(y);

        return y;
    }

    // Thêm một từ mới vào cây AVL
    insert(key, value) {
        this.root = this.insertNode(this.root, key, value);
    }

    insertNode(node, key, value) {
        if (node === null) {
            return new Node(key, value);
        }

        if (key < node.key) {
            node.left = this.insertNode(node.left, key, value);
        } else if (key > node.key) {
            node.right = this.insertNode(node.right, key, value);
        } else {
            // Từ đã tồn tại trong từ điển, báo với người dùng sự tồn tại đó
            throw new Error("Từ đã tồn tại trong từ điển.");
        }

        this.updateHeight(node);

        const balanceFactor = this.getBalanceFactor(node);

        // Cân bằng cây AVL sau khi thêm nút
        if (balanceFactor > 1 && key < node.left.key) {
            return this.rotateRight(node);
        }

        if (balanceFactor < -1 && key > node.right.key) {
            return this.rotateLeft(node);
        }

        if (balanceFactor > 1 && key > node.left.key) {
            node.left = this.rotateLeft(node.left);
            return this.rotateRight(node);
        }

        if (balanceFactor < -1 && key < node.right.key) {
            node.right = this.rotateRight(node.right);
            return this.rotateLeft(node);
        }

        return node;
    }

    // Tìm kiếm nghĩa tiếng Việt của một từ tiếng Anh
    search(key) {
        const result = this.searchNode(this.root, key);
        return result ? result.value : null;
    }

    searchNode(node, key) {
        if (node === null || key === node.key) {
            return node;
        }

        if (key < node.key) {
            return this.searchNode(node.left, key);
        }

        return this.searchNode(node.right, key);
    }

    // Xóa một từ khỏi cây AVL
    delete(key) {
        this.root = this.deleteNode(this.root, key);
    }

    deleteNode(node, key) {
        if (node === null) {
            return null;
        }

        if (key < node.key) {
            node.left = this.deleteNode(node.left, key);
        } else if (key > node.key) {
            node.right = this.deleteNode(node.right, key);
        } else {
            if (node.left === null && node.right === null) {
                return null;
            } else if (node.left === null) {
                return node.right;
            } else if (node.right === null) {
                return node.left;
            } else {
                const successor = this.findMinNode(node.right);
                node.key = successor.key;
                node.value = successor.value;
                node.right = this.deleteNode(node.right, successor.key);
            }
        }

        this.updateHeight(node);

        const balanceFactor = this.getBalanceFactor(node);

        // Cân bằng cây AVL sau khi xóa nút
        if (balanceFactor > 1 && this.getBalanceFactor(node.left) >= 0) {
            return this.rotateRight(node);
        }

        if (balanceFactor > 1 && this.getBalanceFactor(node.left) < 0) {
            node.left = this.rotateLeft(node.left);
            return this.rotateRight(node);
        }

        if (balanceFactor < -1 && this.getBalanceFactor(node.right) <= 0) {
            return this.rotateLeft(node);
        }

        if (balanceFactor < -1 && this.getBalanceFactor(node.right) > 0) {
            node.right = this.rotateRight(node.right);
            return this.rotateLeft(node);
        }

        return node;
    }

    // Tìm nút có giá trị nhỏ nhất trong cây con phải
    findMinNode(node) {
        let current = node;
        while (current.left !== null) {
            current = current.left;
        }
        return current;
    }

    // Xuất toàn bộ từ điển ra tập tin
    exportDictionaryToFile(filename) {
        const fs = require("fs");
        const dictionary = {};

        this.inOrderTraversal(this.root, (node) => {
            dictionary[node.key] = node.value;
        });

        fs.writeFile(filename, JSON.stringify(dictionary, null, 2), (err) => {
            if (err) {
                console.error("Lỗi khi xuất từ điển ra tập tin:", err);
            } else {
                console.log("Từ điển đã được xuất ra tập tin thành công.");
            }
        });
    }

    // Duyệt cây theo thứ tự trung tố
    inOrderTraversal(node, callback) {
        if (node !== null) {
            this.inOrderTraversal(node.left, callback);
            callback(node);
            this.inOrderTraversal(node.right, callback);
        }
    }
}

// Sử dụng cây AVL để tạo từ điển Anh-Việt
const dictionary = new AVLTree();

// Thêm các từ vào từ điển
dictionary.insert("apple", "quả táo");
dictionary.insert("banana", "quả chuối");
dictionary.insert("cat", "con mèo");
dictionary.insert("dog", "con chó");

// Tìm kiếm từ và xuất kết quả ra tập tin
const searchWord = "cat";
const vietnameseMeaning = dictionary.search(searchWord);
if (vietnameseMeaning) {
    const filename = "dictionary.txt";
    const fs = require("fs");
    fs.writeFile(filename, `${searchWord}: ${vietnameseMeaning}`, (err) => {
        if (err) {
            console.error("Lỗi khi ghi từ điển ra tập tin:", err);
        } else {
            console.log(`Từ '${searchWord}' và nghĩa tiếng Việt đã được xuất ra tập tin '${filename}' thành công.`);
        }
    });
} else {
    console.log(`Không tìm thấy từ '${searchWord}' trong từ điển.`);
}

// Xóa một từ khỏi từ điển
const wordToDelete = "banana";
dictionary.delete(wordToDelete);
console.log(`Đã xóa từ '${wordToDelete}' khỏi từ điển.`);

// Xuất toàn bộ từ điển ra tập tin
dictionary.exportDictionaryToFile("dictionary.json");