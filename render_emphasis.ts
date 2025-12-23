/**
 * # Example
 * ```ts
 * const title = renderEmphasis("The *Great* Adventure")
 * console.log(title) // The <em>Great</em> Adventure
 * ```
 */
export const renderEmphasis = (title: string) => title.replace(/\*([^*]+)\*/g, "<em>$1</em>")
