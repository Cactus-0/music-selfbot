const createTester = (regexp: RegExp) => (value: string) => regexp.test(value);
export const isURL = createTester(/^(http(s)?:\/\/.)?(www\.)?[\.-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/i);
