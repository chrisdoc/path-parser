const defaultCharacterSet = 'A-Za-zΑ-Ωα-ωίϊΐόάέύϋΰήώ0-9'

export const defaultOrConstrained = (match: string): string =>
    '(' +
    (match
        ? match.replace(/(^<|>$)/g, '')
        : `[${defaultCharacterSet}-_.~%':|=+\\*@]+`) +
    ')'

export type RegExpFactory = (match: any) => RegExp

export interface IRule {
    /* The name of the rule */
    name: string
    /* The regular expression used to find a token in a path definition */
    pattern: RegExp
    /* The derived regular expression to match a path */
    regex?: RegExp | RegExpFactory
}

const rules: IRule[] = [
    {
        name: 'url-parameter',
        pattern: new RegExp(
            `^:([${defaultCharacterSet}-_]*[${defaultCharacterSet}]{1})(<(.+?)>)?`
        ),
        regex: (match: RegExpMatchArray) =>
            new RegExp(defaultOrConstrained(match[2]))
    },
    {
        name: 'url-parameter-splat',
        pattern: new RegExp(
            `^\*([${defaultCharacterSet}-_]*[${defaultCharacterSet}]{1})`
        ),
        regex: /([^?]*)/
    },
    {
        name: 'url-parameter-matrix',
        pattern: new RegExp(
            `^;([${defaultCharacterSet}-_]*[${defaultCharacterSet}]{1})(<(.+?)>)?`
        ),
        regex: (match: RegExpMatchArray) =>
            new RegExp(';' + match[1] + '=' + defaultOrConstrained(match[2]))
    },
    {
        name: 'query-parameter',
        pattern: new RegExp(
            `^(?:\?|&)(?::)?([${defaultCharacterSet}-_]*[${defaultCharacterSet}]{1})`
        )
    },
    {
        name: 'delimiter',
        pattern: /^(\/|\?)/,
        regex: (match: RegExpMatchArray) => new RegExp('\\' + match[0])
    },
    {
        name: 'sub-delimiter',
        pattern: /^(!|&|-|_|\.|;)/,
        regex: (match: RegExpMatchArray) => new RegExp(match[0])
    },
    {
        name: 'fragment',
        pattern: new RegExp(`^([${defaultCharacterSet}]+)`),
        regex: (match: RegExpMatchArray) => new RegExp(match[0])
    }
]

export default rules
