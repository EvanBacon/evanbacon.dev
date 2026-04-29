/**
 * Flip an LDraw model upside-up by rotating 180° around the X axis at the
 * origin. Matches the script in `flip.ts` so server-side preflight and
 * client-side on-demand processing produce identical output.
 *
 * Position (x,y,z) -> (x,-y,-z); for type-1 transforms we negate rows 2 & 3
 * of the rotation matrix; for type-2/3/4/5 vertex lists we flip every vertex.
 */
export function flipLdr(src: string): string {
  return src
    .split("\n")
    .map((line) => {
      const trimmed = line.trimStart();
      const tokens = trimmed.split(/\s+/);
      const type = tokens[0];

      if (type === "1" && tokens.length >= 15) {
        const colour = tokens[1];
        const n = tokens.slice(2, 14).map(Number);
        const file = tokens.slice(14).join(" ");
        const [x, y, z, a, b, c, d, e, f, g, h, i] = n;
        return `1 ${colour} ${x} ${-y!} ${-z!} ${a} ${b} ${c} ${-d!} ${-e!} ${-f!} ${-g!} ${-h!} ${-i!} ${file}`;
      }

      const vertCount =
        type === "2" ? 2 : type === "3" ? 3 : type === "4" || type === "5" ? 4 : 0;
      if (vertCount && tokens.length >= 2 + vertCount * 3) {
        const colour = tokens[1];
        const coords: number[] = [];
        for (let v = 0; v < vertCount; v++) {
          coords.push(
            Number(tokens[2 + v * 3]),
            -Number(tokens[3 + v * 3]),
            -Number(tokens[4 + v * 3]),
          );
        }
        const rest = tokens.slice(2 + vertCount * 3).join(" ");
        return `${type} ${colour} ${coords.join(" ")}${rest ? " " + rest : ""}`;
      }

      return line;
    })
    .join("\n");
}
