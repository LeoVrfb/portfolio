// Petit serveur one-shot qui écoute le callback OAuth Google sur :3000
// et imprime le refresh_token dans le terminal.
// N'ouvre PAS de navigateur — l'utilisateur colle l'URL d'auth dans
// le navigateur de son choix (typiquement Chrome où il est déjà connecté).

import http from "node:http"

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const REDIRECT_URI = "http://localhost:3000/api/auth/google/callback"
const PORT = 3000

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("Manque GOOGLE_CLIENT_ID ou GOOGLE_CLIENT_SECRET")
  process.exit(1)
}

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
      setTimeout(() => process.exit(1), 500)
      return
    }

    res.setHeader("Content-Type", "text/html; charset=utf-8")
    res.end(
      `<!doctype html><html><body style="font-family:system-ui;background:#0a0a0a;color:#fff;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0"><main style="text-align:center;padding:2rem"><h1>OK — Token récupéré.</h1><p style="color:#aaa">Tu peux fermer cet onglet.</p></main></body></html>`
    )

    console.log("\n=====REFRESH_TOKEN_START=====")
    console.log(tokens.refresh_token)
    console.log("=====REFRESH_TOKEN_END=====\n")

    setTimeout(() => process.exit(0), 500)
  } catch (err) {
    res.statusCode = 500
    res.end("Internal error")
    console.error(err)
    setTimeout(() => process.exit(1), 500)
  }
})

server.listen(PORT, () => {
  console.log(`Serveur d'écoute prêt sur http://localhost:${PORT}`)
  console.log("En attente du callback OAuth...")
})
