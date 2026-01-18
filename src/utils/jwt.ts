export function base64url(str: string) {
    return btoa(str)
        .replace(/\+/, '-')
        .replace(/\=/, '')
}