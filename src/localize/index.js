import ru from '../localize/ru.json';

const locales = {
    'ru-RU': ru
}

export default function localizeFilter(key, type) {
    const locale = 'ru-RU';
    let result;
    if(type) {
        result = locales[locale][type + key];
    }
    if(!result) {
        result = locales[locale][key];
    }
    if(!result) {
        result = key;
    }
    return result;
}