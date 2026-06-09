#!/usr/bin/env bash
# seo-audit.sh — Audit SEO de toutes les URLs du sitemap.
# Usage : ./scripts/seo-audit.sh [domain]
# Ex    : ./scripts/seo-audit.sh https://leohengebaert.fr

DOMAIN="${1:-https://leohengebaert.fr}"
SITEMAP="$DOMAIN/sitemap.xml"
UA_BOT="Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"

echo "=== Audit SEO : $DOMAIN ==="
echo

URLS=$(curl -fsSL -A "$UA_BOT" "$SITEMAP" | grep -oE '<loc>[^<]+</loc>' | sed -e 's|<loc>||g' -e 's|</loc>||g')
TOTAL=$(echo "$URLS" | wc -l | tr -d ' ')
echo "Sitemap contient $TOTAL URLs"
echo

ERRORS=0
WARNINGS=0
RESULTS=""

# Header
printf "%-55s %5s %5s %5s %5s %5s %5s\n" "URL" "HTTP" "Title" "Desc" "H1" "JLD" "Canon"
printf "%.0s-" {1..90}; echo

for URL in $URLS; do
  PATH_PART=$(echo "$URL" | sed "s|$DOMAIN||")
  PATH_DISPLAY="${PATH_PART:-/}"
  [ ${#PATH_DISPLAY} -gt 53 ] && PATH_DISPLAY="${PATH_DISPLAY:0:50}..."

  HTML=$(curl -fsSL -A "$UA_BOT" "$URL" 2>/dev/null || echo "")
  HTTP=$(curl -s -o /dev/null -w "%{http_code}" -A "$UA_BOT" "$URL")

  TITLE_LEN=$(echo "$HTML" | grep -oE '<title>[^<]+</title>' | head -1 | sed 's/<[^>]*>//g' | wc -c | tr -d ' ')
  [ "$TITLE_LEN" -gt 0 ] && TITLE_LEN=$((TITLE_LEN - 1))

  DESC=$(echo "$HTML" | grep -oE '<meta[^>]*name="description"[^>]*content="[^"]*"' | head -1 | grep -oE 'content="[^"]*"' | sed 's/content="//;s/"$//')
  DESC_LEN=${#DESC}

  H1_COUNT=$(echo "$HTML" | grep -oE '<h1[^>]*>' | wc -l | tr -d ' ')

  JLD_COUNT=$(echo "$HTML" | grep -c 'application/ld+json' || true)

  CANON=$(echo "$HTML" | grep -oE '<link[^>]*rel="canonical"[^>]*href="[^"]*"' | head -1 | grep -oE 'href="[^"]*"' | sed 's/href="//;s/"$//')

  # Status indicators
  HTTP_OK=$([ "$HTTP" = "200" ] && echo "OK" || echo "$HTTP")
  TITLE_OK=$([ "$TITLE_LEN" -ge 30 ] && [ "$TITLE_LEN" -le 70 ] && echo "OK" || echo "$TITLE_LEN")
  DESC_OK=$([ "$DESC_LEN" -ge 110 ] && [ "$DESC_LEN" -le 165 ] && echo "OK" || echo "$DESC_LEN")
  H1_OK=$([ "$H1_COUNT" = "1" ] && echo "OK" || echo "$H1_COUNT!")
  JLD_OK=$([ "$JLD_COUNT" -ge 1 ] && echo "$JLD_COUNT" || echo "0!")
  CANON_OK=$([ -n "$CANON" ] && echo "OK" || echo "NO!")

  # Count errors
  [ "$HTTP" != "200" ] && ERRORS=$((ERRORS + 1))
  [ "$H1_COUNT" != "1" ] && ERRORS=$((ERRORS + 1))
  [ "$JLD_COUNT" -lt 1 ] && ERRORS=$((ERRORS + 1))
  [ -z "$CANON" ] && ERRORS=$((ERRORS + 1))
  ([ "$TITLE_LEN" -lt 30 ] || [ "$TITLE_LEN" -gt 70 ]) && WARNINGS=$((WARNINGS + 1))
  ([ "$DESC_LEN" -lt 110 ] || [ "$DESC_LEN" -gt 165 ]) && WARNINGS=$((WARNINGS + 1))

  printf "%-55s %5s %5s %5s %5s %5s %5s\n" "$PATH_DISPLAY" "$HTTP_OK" "$TITLE_OK" "$DESC_OK" "$H1_OK" "$JLD_OK" "$CANON_OK"
done

echo
echo "=== Bilan ==="
echo "Total URLs    : $TOTAL"
echo "Erreurs       : $ERRORS"
echo "Avertissements: $WARNINGS  (titre/description hors fourchette recommandee)"
echo
echo "Legende :"
echo "  HTTP   : 200 attendu"
echo "  Title  : longueur 30-70 chars (sinon affiche la longueur)"
echo "  Desc   : longueur 110-165 chars"
echo "  H1     : exactement 1 (! = anormal)"
echo "  JLD    : nombre de blocs JSON-LD (0! = aucun)"
echo "  Canon  : presence de <link rel=canonical>"
