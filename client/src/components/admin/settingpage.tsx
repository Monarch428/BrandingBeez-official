import { useEffect, useMemo, useState } from "react";

type AuthTokenStatus = {
    accessToken?: string;
    email?: string;
    expiryDate?: number;
};

export function AuthApiConnectButton() {
    const [loading, setLoading] = useState(true);
    const [connected, setConnected] = useState(false);
    const [expired, setExpired] = useState(false);
    const [email, setEmail] = useState<string | null>(null);

    const statusText = useMemo(() => {
        if (loading) return "Checking Auth API status…";
        if (connected && email) return `Connected as ${email}`;
        if (expired) return "Expired — reconnect required";
        return "Not connected";
    }, [loading, connected, expired, email]);

    async function fetchStatus() {
        try {
            setLoading(true);

            const res = await fetch("/api/oauthapi/token", {
                credentials: "include",
                headers: { Accept: "application/json" },
            });

            if (!res.ok) {
                setConnected(false);
                setExpired(false);
                setEmail(null);
                return;
            }

            const data: AuthTokenStatus | null = await res.json();

            const now = Date.now();
            const hasEmail = !!data?.email;
            const hasAccessToken = !!data?.accessToken;
            const hasExpiry = typeof data?.expiryDate === "number";
            const isExpired = hasExpiry ? now >= (data!.expiryDate as number) : false;

            const isConnected =
                (hasAccessToken && hasEmail && !isExpired) || (hasEmail && !isExpired);

            setConnected(isConnected);
            setExpired(hasEmail && isExpired);
            setEmail(hasEmail ? (data!.email as string) : null);
        } catch {
            setConnected(false);
            setExpired(false);
            setEmail(null);
        } finally {
            setLoading(false);
        }
    }

    function handleConnect() {
        window.open("/api/oauthapi/login", "_blank", "noopener,noreferrer");
    }

    useEffect(() => {
        fetchStatus();

        const hasOauthParams =
            typeof window !== "undefined" &&
            (window.location.search.includes("code=") ||
                window.location.search.includes("oauth=connected"));

        if (hasOauthParams) {
            setTimeout(fetchStatus, 800);
        }
    }, []);

    if (loading) {
        return <p className="text-sm text-gray-500">{statusText}</p>;
    }

    return (
        <div className="space-y-2">
            {/* Status */}
            <div className="flex items-center gap-2 text-sm">
                <span
                    className={`h-2 w-2 rounded-full ${connected ? "bg-green-500" : expired ? "bg-yellow-500" : "bg-red-500"
                        }`}
                />
                <span className={connected ? "" : expired ? "text-yellow-700" : "text-gray-500"}>
                    {connected ? (
                        <>
                            Connected as <strong>{email}</strong>
                        </>
                    ) : expired ? (
                        "Expired — reconnect required"
                    ) : (
                        "Not connected"
                    )}
                </span>
            </div>

            {/* Button */}
            <button
                type="button"
                onClick={handleConnect}
                className={`px-4 py-2 rounded-md text-white text-sm font-medium ${connected
                    ? "bg-blue-600 hover:bg-blue-700"
                    : expired
                        ? "bg-yellow-600 hover:bg-yellow-700"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
            >
                {connected ? "Reconnect API" : expired ? "Reconnect API" : "Connect API"}
            </button>
        </div>
    );
}
