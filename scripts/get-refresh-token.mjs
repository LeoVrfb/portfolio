/**
 * Script one-shot pour récupérer le refresh_token Google OAuth.
 *
 * Usage :
 *   1. Stoppe ton dev server Next.js si tourne (le script utilise le port 3000)
 *   2. Mets GOOGLE_CLIENT_ID et GOOGLE_CLIENT_SECRET dans .env.local
 *   3. node --env-file=.env.local scripts/get-refresh-token.mjs
 *   4. Le navigateur s'ouvre, tu autorises avec leohengebaert75@gmail.com
 *   5. Le terminal affiche le refresh_token, tu le colles dans .env.local
 *
 * À lancer une seule fois. Le refresh_token Google reste valide tant que
 * tu ne révoques pas l'accès depuis https://myaccount.google.com/permissions
 */

import http from "node:http"
import { exec } from "node:child_process"

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const REDIRECT_URI = "http://localhost:3000/api/auth/google/callback"
const SCOPES = ["https://www.googleapis.com/auth/calendar.events"]
const PORT = 3000

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error(
    "Manque GOOGLE_CLIENT_ID ou GOOGLE_CLIENT_SECRET. Ajoute-les dans .env.local et relance avec --env-file=.env.local"
  )
  process.exit(1)
}

const authUrl =
  "https://accounts.google.com/o/oauth2/v2/auth?" +
  new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: SCOPES.join(" "),
    access_type: "offline",
    prompt: "consent",
  }).toString()

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", `http://localhost:${PORT}`)

  if (url.pathname !== "/api/auth/google/callback") {
    res.statusCode = 404
    res.end("Not found")
    return
  }

  const code = url.searchParams.get("code")
  const error = url.searchParams.get("error")

  if (error) {
    res.statusCode = 400
    res.end(`OAuth error: ${error}`)
    console.error(`\nErreur OAuth Google : ${error}`)
    setTimeout(() => process.exit(1), 500)
    return
  }

  if (!code) {
    res.statusCode = 400
    res.end("Missing code")
    return
  }

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      }).toString(),
    })

    const tokens = await tokenRes.json()

    if (!tokenRes.ok || !tokens.refresh_token) {
      res.statusCode = 500
      res.end(`<pre>${JSON.stringify(tokens, null, 2)}</pre>`)
      console.error("\nÉchec récupération tokens :")
      console.error(tokens)
      console.error(
        "\nSi pas de refresh_token : va dans https://myaccount.google.com/permissions, révoque l'accès à 'Portfolio Leo Hengebaert', puis relance le script."
      )
      setTimeout(() => process.exit(1), 500)
      return
    }

    res.setHeader("Content-Type", "text/html; charset=utf-8")
    res.end(
      `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><title>OK</title>
<style>body{font-family:system-ui;background:#0a0a0a;color:#fff;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0}main{text-align:center;padding:2rem}h1{font-size:1.5rem;margin:0 0 .5rem}p{color:#aaa;margin:0}</style>
</head><body><main><h1>Refresh token récupéré.</h1><p>Tu peux fermer cet onglet et retourner dans ton terminal.</p></main></body></html>`
    )

    console.log("\n────────────────────────────────────────")
    console.log("Refresh token récupéré.")
    console.log("Colle cette ligne dans ton .env.local :")
    console.log("────────────────────────────────────────\n")
    console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`)
    console.log("\n────────────────────────────────────────\n")

    setTimeout(() => process.exit(0), 500)
  } catch (err) {
    res.statusCode = 500
    res.end("Internal error")
    console.error(err)
    setTimeout(() => process.exit(1), 500)
  }
})

server.listen(PORT, () => {
  console.log(`\nServeur lancé sur http://localhost:${PORT}`)
  console.log("Ouverture du navigateur pour l'autorisation Google...\n")
  exec(`open "${authUrl}"`)
})
