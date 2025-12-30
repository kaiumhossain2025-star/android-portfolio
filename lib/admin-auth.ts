export const ADMIN_SECRETS = {
    email: "s@s.com",
    password: "11112222", // In a real app, this should be an env var, but keeping rigid as requested
}

export function isSecretAdmin(email: string | null | undefined) {
    return email === ADMIN_SECRETS.email
}
