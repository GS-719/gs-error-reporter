export async function reportError(payload: any) {
    if (payload.type === "server"){
        await fetch(`${process.env.BASE_URL}/api/gs-error-reporter`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                payload
            }),
        });
    } else if (payload.type === "client") {
        await fetch('/api/gs-error-reporter', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                payload
            }),
        });
    }
}
