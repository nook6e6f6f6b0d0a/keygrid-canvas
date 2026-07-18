# Security

KeyGrid Canvas runs locally inside the Stream Deck plugin runtime.

- It makes no network requests.
- It collects no analytics or telemetry.
- It stores no credentials.
- It launches no external commands or applications.
- It does not read files outside its own packaged assets.

Report security issues privately to the repository owner instead of opening a
public issue with exploit details. Include the plugin version, operating
system, Stream Deck version, and a minimal reproduction when possible.

The generated `.streamDeckPlugin` package should be built from a tagged commit
using the checked-in lockfile and the official Stream Deck CLI.
