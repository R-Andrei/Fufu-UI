export function isNumber(n) {
    return !isNaN(parseFloat(n)) && !isNaN(n - 0);
}

export function parseDirection(direction) {
    switch (direction.toLowerCase()) {
        case 'north':
        case 'n':
            return 'n';

        default:
        case 'south':
        case 's':
            return 's';

        case 'west':
        case 'w':
            return 'w';

        case 'east':
        case 'e':
            return 'e';

        case 'northwest':
        case 'nw':
        case 'north-west':
            return 'nw';

        case 'northeast':
        case 'ne':
        case 'north-east':
            return 'ne';

        case 'southwest':
        case 'sw':
        case 'south-west':
            return 'sw';

        case 'southeast':
        case 'se':
        case 'south-east':
            return 'se';
    }
}