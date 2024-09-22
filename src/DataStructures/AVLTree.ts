/**
 * AVL Implementation
 * @author dalopezgu
 */

class MyNode<T> {
    key: T;
    height: number;
    left: MyNode<T> | null;
    right: MyNode<T> | null;

    constructor(key: T) {
        this.key = key;
        this.left = null;
        this.right = null;
        this.height = 1;
    }
}

class AVLTree<T> {
    root: (MyNode<T> | null) = null;
    private compare: (a: T, b: T) => number;

    constructor(compareFn: (a: T, b: T) => number){
        this.compare = compareFn;
    }

    // Obtener la altura de un nodo
    public height(node: MyNode<T> | null): number {
        return node === null ? 0 : node.height;
    }

    // Obtener el balance de un nodo
    public getBalance(node: MyNode<T> | null): number {
        return node === null ? 0 : this.height(node.left) - this.height(node.right);
    }

    // Rotación simple a la derecha
    private rotateRight(y: MyNode<T>): MyNode<T> {
        const x = y.left!;
        const T2 = x.right;

        // Realizar la rotación
        x.right = y;
        y.left = T2;

        // Actualizar alturas
        y.height = Math.max(this.height(y.left), this.height(y.right)) + 1;
        x.height = Math.max(this.height(x.left), this.height(x.right)) + 1;

        // Retornar nueva raíz
        return x;
    }

    // Rotación simple a la izquierda
    private rotateLeft(x: MyNode<T>): MyNode<T> {
        const y = x.right!;
        const T2 = y.left;

        // Realizar la rotación
        y.left = x;
        x.right = T2;

        // Actualizar alturas
        x.height = Math.max(this.height(x.left), this.height(x.right)) + 1;
        y.height = Math.max(this.height(y.left), this.height(y.right)) + 1;

        // Retornar nueva raíz
        return y;
    }

    // Insertar un nodo
    private insert(node: MyNode<T> | null, key: T): MyNode<T> {
        if (node === null) return new MyNode<T>(key);

        if (this.compare(key, node.key) < 0) {
            node.left = this.insert(node.left, key);
        } else if (this.compare(key, node.key) > 0) {
            node.right = this.insert(node.right, key);
        } else {
            return node; // No se permiten claves duplicados
        }

        node.height = 1 + Math.max(this.height(node.left), this.height(node.right));
        const balance = this.getBalance(node);

        // Casos de rotaciones para mantener el balance
        if (balance > 1 && key < node.left!.key) {
            return this.rotateRight(node);
        }

        if (balance < -1 && key > node.right!.key) {
            return this.rotateLeft(node);
        }

        if (balance > 1 && key > node.left!.key) {
            node.left = this.rotateLeft(node.left!);
            return this.rotateRight(node);
        }

        if (balance < -1 && key < node.right!.key) {
            node.right = this.rotateRight(node.right!);
            return this.rotateLeft(node);
        }

        return node;
    }

    // Encontrar el nodo con el valor mínimo en el árbol
    public minValueNode(node: MyNode<T>): MyNode<T> {
        let current = node;
        while (current.left !== null) {
            current = current.left;
        }
        return current;
    }

    // Eliminar un nodo
    private delete(node: MyNode<T> | null, key: T): MyNode<T> | null {
        if (node === null) return node;

        if (this.compare(key, node.key) < 0) {
            node.left = this.delete(node.left, key);
        } else if (this.compare(key, node.key) > 0) {
            node.right = this.delete(node.right, key);
        } else {
            if (node.left === null || node.right === null) {
                const temp = node.left !== null ? node.left : node.right;

                if (temp === null) {
                    return null;
                } else {
                    node = temp;
                }
            } else {
                const temp = this.minValueNode(node.right);
                node.key = temp.key;
                node.right = this.delete(node.right, temp.key);
            }
        }

        if (node === null) return node;

        node.height = 1 + Math.max(this.height(node.left), this.height(node.right));
        const balance = this.getBalance(node);

        if (balance > 1 && this.getBalance(node.left) >= 0) {
            return this.rotateRight(node);
        }

        if (balance > 1 && this.getBalance(node.left) < 0) {
            node.left = this.rotateLeft(node.left!);
            return this.rotateRight(node);
        }

        if (balance < -1 && this.getBalance(node.right) <= 0) {
            return this.rotateLeft(node);
        }

        if (balance < -1 && this.getBalance(node.right) > 0) {
            node.right = this.rotateRight(node.right!);
            return this.rotateLeft(node);
        }

        return node;
    }

    // Método para insertar un nodo desde la raíz
    public insertKey(key: T): void {
        this.root = this.insert(this.root, key);
    }

    // Método para eliminar un nodo desde la raíz
    public deleteKey(key: T): void {
        this.root = this.delete(this.root, key);
    }

    // Método para imprimir el árbol en orden
    private inOrder(node: MyNode<T> | null, result: T[] = []): T[] {
        if (node !== null) {
            this.inOrder(node.left, result);
            result.push(node.key);
            this.inOrder(node.right, result);
        }
        return result;
    }

    // Método para imprimir el árbol en orden desde la raíz
    public inOrderTraversal(): T[] {
        return this.inOrder(this.root);
    }

      // Método para buscar un valor
    public find(value: T): T | null {
        const n = this.findNode(this.root, value) ;
        if(n !== null){
            return n.key;
        } else {
            return null;
        }
    }

    private findNode(node: MyNode<T> | null, key: T): MyNode<T> | null {
        if (node === null) {
            return null;
        }

        if (this.compare(key, node.key) < 0) {
            return this.findNode(node.left, key);
        } else if (this.compare(key, node.key) > 0) {
            return this.findNode(node.right, key);
        } else {
            return node;
        }
    }

    public load(arr: T[]){
        arr.forEach((e) => this.insertKey(e));
    }
}

export default AVLTree;