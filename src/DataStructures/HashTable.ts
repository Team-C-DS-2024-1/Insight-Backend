/**Implementación para Tablas Hash
 * @author Vaulentzc
 *Se utilizan listas simplemente enlazadas para manejar las colisiones*/

// Clase que representa un par clave-valor en la tabla hash.
class Entry<K, V> {
    constructor(private key: K, private value: V) {}

    public getKey(): K {
        return this.key; // Retorna la clave.
    }

    public getValue(): V {
        return this.value; // Retorna el valor.
    }

    public setValue(value: V): void {
        this.value = value; // Actualiza el valor.
    }
}

// Clase que representa un nodo en una lista enlazada simple.
class SinglyLinkedListNode<T> {
    public next: SinglyLinkedListNode<T> | null = null;

    constructor(public key: T) {}
}

// Clase que representa una lista enlazada simple.
class SinglyLinkedList<T> {
    public head: SinglyLinkedListNode<T> | null = null;

    // Método para añadir un nodo al final de la lista enlazada.
    public pushBack(key: T): void {
        const newNode = new SinglyLinkedListNode(key);
        if (!this.head) {
            this.head = newNode; // Si la lista está vacía, el nuevo nodo es la cabeza.
        } else {
            let current = this.head;
            while (current.next) { // Itera hasta el último nodo.
                current = current.next;
            }
            current.next = newNode; // Añade el nuevo nodo al final.
        }
    }

    // Método para eliminar un nodo de la lista enlazada.
    public delete(key: T): void {
        if (!this.head) return; // Si la lista está vacía, no hace nada.

        if (this.head.key === key) {
            this.head = this.head.next; // Si la cabeza es el nodo a eliminar, se elimina.
            return;
        }

        let current = this.head;
        while (current.next && current.next.key !== key) {
            current = current.next; // Itera hasta encontrar el nodo a eliminar.
        }

        if (current.next) {
            current.next = current.next.next; // Elimina el nodo saltándolo.
        }
    }
}

class HashTable<K extends string | number, V> {

    // Es la capacidad por defecto de la tabla hash.
    private static readonly DEFAULT_CAPACITY = 16;

    // Factor de carga para determinar cuándo redimensionar.
    private static readonly LOAD_FACTOR = 0.75;

    // Arreglo que representa la tabla hash, cada índice es una lista enlazada simple.
    private table: SinglyLinkedList<Entry<K, V>>[];

    // Mantiene el tamaño actual de la tabla (número de elementos).
    private _size: number;

    // Constructor que inicializa la tabla con una capacidad opcional, por defecto es 16.
    constructor(capacity: number = HashTable.DEFAULT_CAPACITY) {
        this.table = new Array<SinglyLinkedList<Entry<K, V>>>(capacity);
        this._size = 0;
    }

    // Método privado para obtener el índice en la tabla hash basado en la clave.
    private getIndex(key: K): number {
        const hashCode = this.hashCode(key); // Calcula el hash de la clave.
        return Math.abs(hashCode) % this.table.length; // Asegura que el índice esté dentro del rango.
    }

    // Método privado que calcula un código hash para la clave.
    private hashCode(key: K): number {
        if (typeof key === 'number') {
            return key; // Si la clave resulta ser un número, se usa directamente como hash.
        } else {
            let hash = 0;
            const keyString = key.toString(); // Se debe convertir la clave a string.
            for (let i = 0; i < keyString.length; i++) {
                const char = keyString.charCodeAt(i); // Obtiene el código de carácter de cada letra.
                hash = (hash << 5) - hash + char; // Operación de desplazamiento y suma para crear el hash.
                hash |= 0; // Convierte el hash a un entero de 32 bits.
            }
            return hash;
        }
    }

    // Método privado para obtener la lista enlazada en un índice específico de la tabla.
    private getList(index: number): SinglyLinkedList<Entry<K, V>> {
        if (!this.table[index]) {
            this.table[index] = new SinglyLinkedList<Entry<K, V>>(); // Crea una nueva lista si no existe.
        }
        return this.table[index];
    }

    // Método público para insertar o actualizar un valor en la tabla hash.
    public put(key: K, value: V): void {
        const index = this.getIndex(key); // Obtiene el índice para la clave.
        const list = this.getList(index); // Obtiene la lista enlazada correspondiente.

        const entry = this.findEntry(list, key); // Busca si ya existe un par clave-valor.
        if (entry) {
            entry.setValue(value); // Si existe, actualiza el valor.
        } else {
            list.pushBack(new Entry(key, value)); // Si no existe, añade un nuevo par clave-valor.
            this._size++; // Incrementa el tamaño de la tabla.

            // Verifica si se necesita redimensionar la tabla.
            if (this._size / this.table.length > HashTable.LOAD_FACTOR) {
                this.resize(this.table.length * 2); // Duplica la capacidad.
            }
        }
    }

    // Método privado para redimensionar la tabla hash.
    private resize(newCapacity: number): void {
        const oldTable = this.table;
        this.table = new Array<SinglyLinkedList<Entry<K, V>>>(newCapacity);
        this._size = 0; // Reinicia el tamaño, se volverá a calcular al reinsertar.

        for (const list of oldTable) { // Itera sobre cada lista en la tabla antigua.
            if (list) {
                let node = list.head;
                while (node) { // Itera sobre cada nodo en la lista enlazada.
                    const entry = node.key;
                    this.put(entry.getKey(), entry.getValue()); // Re-inserta el par clave-valor.
                    node = node.next;
                }
            }
        }
    }

    // Método público para obtener un valor asociado a una clave.
    public get(key: K): V | null {
        const index = this.getIndex(key); // Obtiene el índice para la clave.
        const list = this.getList(index); // Obtiene la lista enlazada correspondiente.

        const entry = this.findEntry(list, key); // Busca el par clave-valor.
        return entry ? entry.getValue() : null; // Retorna el valor o null si no se encuentra.
    }

    // Método público para eliminar un par clave-valor de la tabla hash.
    public remove(key: K): void {
        const index = this.getIndex(key); // Obtiene el índice para la clave.
        const list = this.getList(index); // Obtiene la lista enlazada correspondiente.

        const entry = this.findEntry(list, key); // Busca el par clave-valor.
        if (entry) {
            list.delete(entry); // Si existe, lo elimina de la lista.
            this._size--; // Decrementa el tamaño de la tabla.
        }
    }

    // Método público para verificar si una clave existe en la tabla hash.
    public containsKey(key: K): boolean {
        const index = this.getIndex(key); // Obtiene el índice para la clave.
        const list = this.getList(index); // Obtiene la lista enlazada correspondiente.

        return this.findEntry(list, key) !== null; // Retorna true si se encuentra la clave, false si no.
    }

    // Método público para verificar si la tabla hash está vacía.
    public isEmpty(): boolean {
        return this._size === 0;
    }

    // Método público para obtener el número de elementos en la tabla hash.
    public getSize(): number {
        return this._size;
    }

    // Método público para obtener todos los valores almacenados en la tabla hash.
    public getAllObjects(): V[] {
        const objects: V[] = [];
        for (const list of this.table) { // Itera sobre cada lista en la tabla.
            if (list) {
                let node = list.head;
                while (node) { // Itera sobre cada nodo en la lista enlazada.
                    objects.push(node.key.getValue()); // Añade el valor a la lista de objetos.
                    node = node.next;
                }
            }
        }
        return objects;
    }

    // Método público para editar el valor asociado a una clave existente.
    public editObject(key: K, newValue: V): void {
        const index = this.getIndex(key); // Obtiene el índice para la clave.
        const list = this.getList(index); // Obtiene la lista enlazada correspondiente.

        const entry = this.findEntry(list, key); // Busca el par clave-valor.
        if (entry) {
            entry.setValue(newValue); // Si existe, actualiza el valor.
        }
    }

    // Método público para obtener un conjunto con todas las claves de la tabla hash.
    public keySet(): Set<K> {
        const keySet: Set<K> = new Set<K>();
        for (const list of this.table) { // Itera sobre cada lista en la tabla.
            if (list) {
                let node = list.head;
                while (node) { // Itera sobre cada nodo en la lista enlazada.
                    keySet.add(node.key.getKey()); // Añade la clave al conjunto.
                    node = node.next;
                }
            }
        }
        return keySet;
    }

    // Método privado que busca un par clave-valor en una lista enlazada.
    private findEntry(list: SinglyLinkedList<Entry<K, V>>, key: K): Entry<K, V> | null {
        let node = list.head;
        while (node) { // Itera sobre cada nodo en la lista.
            if (node.key.getKey() === key) {
                return node.key; // Retorna el nodo si la clave coincide.
            }
            node = node.next;
        }
        return null; // Retorna null si no se encuentra la clave.
    }
}

export default HashTable;