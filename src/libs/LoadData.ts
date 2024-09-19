import fs from 'fs';
import Book from '../interfaces/Book.js';

function loadData(): Book[] {
    const data = fs.readFileSync("./data/MOCK_DATA.json", "utf8");
    const obj: Book[] = JSON.parse(data);
    
    return obj;
}

export default loadData;