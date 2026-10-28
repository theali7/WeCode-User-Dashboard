import "./account.css";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase, supabaseUrl, supabasePublishableKey } from "./supabase";
export function useAccount() {
    const [user, setUser] = useState<User | null>(null);
    const [recovery, setRecovery] = useState(false);
    useEffect(() => {
        let active = true;
        supabase.auth.getUser().then(({ data }) => { if (active)
            setUser(data.user); });
        const { data } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null);
            if (event === "PASSWORD_RECOVERY")
                setRecovery(true);
        });
        return () => { active = false; data.subscription.unsubscribe(); };
    }, []);
    return { user, recovery, setRecovery };
}
export default function Account({ user, lang, initialMode = "login", recovery = false, onRecovered, onContinue }: {
    initialMode?: "login" | "signup";
    user: User | null;
    lang: string;
    recovery?: boolean;
    onRecovered: () => void;
    onContinue: () => void;
}) {
    const ru = false;
    const [mode, setMode] = useState<"login" | "signup" | "reset">(initialMode);
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [name, setName] = useState("");
    const [path, setPath] = useState("front");
    const [level, setLevel] = useState("0");
    const [providers, setProviders] = useState({ google: false, github: false });
    useEffect(() => {
        const controller = new AbortController();
        fetch(`${supabaseUrl}/auth/v1/settings`, { headers: { apikey: supabasePublishableKey }, signal: controller.signal })
            .then(r => r.ok ? r.json() : Promise.reject()).then(d => setProviders({ google: !!d.external?.google, github: !!d.external?.github })).catch(() => { });
        return () => controller.abort();
    }, []);
    useEffect(() => {
        if (!user)
            return;
        let active = true;
        supabase.from("profiles").select("display_name,path_id,level").eq("id", user.id).maybeSingle().then(({ data, error }) => {
            if (!active)
                return;
            if (error)
                setError("Could not load your profile. Please try again.");
            if (data) {
                setName(data.display_name);
                setPath(data.path_id || "front");
                setLevel(String(data.level));
            }
            else
                setName(String(user.user_metadata?.display_name || user.user_metadata?.name || ""));
        });
        return () => { active = false; };
    }, [user?.id]);
    async function run(action: () => Promise<void>) {
        setBusy(true);
        setMessage("");
        setError("");
        try {
            await action();
        }
        catch (e) {
            const code = (e as {
                code?: string;
            }).code;
            const common: Record<string, string> = {};
            setError(common[code || ""] || (e instanceof Error ? e.message : "Connection error. Try again."));
        }
        finally {
            setBusy(false);
        }
    }
    function switchMode(value: typeof mode) { setMode(value); setMessage(""); setError(""); }
    return <div className="account-panel">
    {user && !recovery ? <>
      <p className="account-email">{user.email}</p>
      <form onSubmit={e => {
                e.preventDefault();
                void run(async () => {
                    const { error } = await supabase.from("profiles").upsert({ id: user.id, display_name: name.trim(), path_id: path, level: Number(level) });
                    if (error)
                        throw error;
                    setMessage("Profile saved.");
                });
            }}>
        <label>{"Name"}<input required maxLength={80} value={name} onChange={e => setName(e.target.value)} autoComplete="name"/></label>
        <label>{"Learning path"}<select value={path} onChange={e => setPath(e.target.value)}><option value="front">Frontend</option><option value="back">Python / backend</option></select></label>
        <label>{"Level"}<select value={level} onChange={e => setLevel(e.target.value)}>{(["Beginner", "Intermediate", "Advanced"]).map((v, i) => <option key={v} value={i}>{v}</option>)}</select></label>
        <button className="button" disabled={busy}>{busy ? "…" : "Save profile"}</button>
      </form>
      <button className="button button-secondary" onClick={onContinue}>{"Explore curriculum"}</button>
      <button className="account-link" disabled={busy} onClick={() => void run(async () => { const { error } = await supabase.auth.signOut(); if (error)
            throw error; })}>{"Sign out"}</button>
    </> : <>
      {!recovery && <>
        <div className="account-tabs"><button aria-pressed={mode === "login"} onClick={() => switchMode("login")}>{"Log in"}</button><button aria-pressed={mode === "signup"} onClick={() => switchMode("signup")}>{"Sign up"}</button></div>
        <div className="account-providers">{(["google", "github"] as const).map(provider => <button key={provider} className="button button-secondary" disabled={busy || !providers[provider]} onClick={() => void run(async () => {
                        const { error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: `${window.location.origin}/` } });
                        if (error)
                            throw error;
                    })}>{provider === "google" ? "Google" : "GitHub"}{!providers[provider] ? " · soon" : ""}</button>)}</div>
        <p className="account-divider">{"or with email"}</p>
      </>}
      <form onSubmit={e => {
                e.preventDefault();
                const values = new FormData(e.currentTarget);
                const email = String(values.get("email") || "").trim();
                const password = String(values.get("password") || "");
                void run(async () => {
                    if (recovery) {
                        const { error } = await supabase.auth.updateUser({ password });
                        if (error)
                            throw error;
                        onRecovered();
                        setMessage("Password updated.");
                        return;
                    }
                    if (mode === "reset") {
                        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/` });
                        if (error)
                            throw error;
                        setMessage("If an account exists, a recovery email will be sent.");
                        return;
                    }
                    if (mode === "signup") {
                        const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/`, data: { display_name: String(values.get("name") || "").trim() } } });
                        if (error)
                            throw error;
                        if (!data.session)
                            setMessage("Check your inbox and confirm your account using the email link.");
                    }
                    else {
                        const { error } = await supabase.auth.signInWithPassword({ email, password });
                        if (error)
                            throw error;
                    }
                });
            }}>
        {mode === "signup" && !recovery && <label>{"Name"}<input name="name" autoComplete="name" required maxLength={80}/></label>}
        {!recovery && <label>Email<input name="email" type="email" autoComplete="email" required maxLength={254}/></label>}
        {(mode !== "reset" || recovery) && <label>{"Password"}<input name="password" type="password" autoComplete={mode === "signup" || recovery ? "new-password" : "current-password"} minLength={mode === "signup" || recovery ? 8 : 1} required maxLength={128}/></label>}
        <button className="button" disabled={busy}>{busy ? "Please wait…" : recovery ? "Save password" : mode === "signup" ? "Create account" : mode === "reset" ? "Reset password" : "Log in"}</button>
      </form>
      {!recovery && <button className="account-link" onClick={() => switchMode(mode === "reset" ? "login" : "reset")}>{mode === "reset" ? "Back to login" : "Forgot password?"}</button>}
    </>}
    {error && <p role="alert" className="account-error">{error}</p>}
    {message && <p role="status" className="account-message">{message}</p>}
  </div>;
}
