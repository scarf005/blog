import { assertEquals } from "jsr:@std/assert"
import { isNakedCssDay } from "./naked_css.tsx"

Deno.test("isNakedCssDay() tests whether today is naked css day", () => {
	assertEquals(isNakedCssDay(new Date("2025-04-08T10:00:00Z")), true)
	assertEquals(isNakedCssDay(new Date("2025-04-08T09:59:59Z")), false)
	assertEquals(isNakedCssDay(new Date("2025-04-10T12:00:00Z")), true)
	assertEquals(isNakedCssDay(new Date("2025-04-10T12:00:01Z")), false)
})
