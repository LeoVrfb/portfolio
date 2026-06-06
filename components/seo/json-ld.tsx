/**
 * Composant Server-Component qui rend un ou plusieurs schemas JSON-LD dans
 * la page sous forme de `<script type="application/ld+json">…</script>`.
 *
 * Pourquoi server-only :
 * - `dangerouslySetInnerHTML` accepte du JSON sérialisé côté serveur sans
 *   risque d'XSS (les schemas sont construits depuis des constantes typées).
 * - Pas de rerender côté client = pas de FOUC SEO, le crawler récupère le
 *   schema dès le 1er paint HTML.
 */

type JsonLdProps = {
  /** Un schema unique ou un tableau de schemas (rendus en plusieurs `<script>`). */
  data: object | object[];
};

export function JsonLd({ data }: JsonLdProps) {
  const schemas = Array.isArray(data) ? data : [data];
  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          // Sérialisation server-side pure : pas d'input utilisateur, pas
          // d'injection. Les schemas viennent de `lib/seo/json-ld.ts` typés.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
