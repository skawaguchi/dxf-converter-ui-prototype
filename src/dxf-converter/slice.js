import { parse as parseValue } from './groupValues';

function hasMore(idx, lines) {
    return idx < lines.length && (idx === 0 || lines[idx - 1].trim() !== 'EOF');
}

export default function* slice(data) {
    const lines = data.split(/\r\n|\r|\n/g);

    for (let idx = 0; hasMore(idx, lines); idx += 2) {
        const code = parseInt(lines[idx], 10);
        const value = parseValue(code, lines[idx + 1]);

        yield {
            code,
            value
        };
    }
}
