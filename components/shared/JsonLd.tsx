/**
 * Server-component, вставляющий JSON-LD в DOM.
 * Сериализуем сами и экранируем `<` чтобы не вставился `</script>`.
 */
export function JsonLd({ data }: { data: unknown }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
