# FareWell — working rules

## Never delete a file

Deletion is not available. Nothing in this project is ever removed with `rm`,
`git rm`, `git clean`, `rmdir`, or any equivalent — not a stale lock file, not a
build artefact, not a file that looks obviously disposable.

Instead, **move it to `bin/` at the base of the project**:

```bash
mv <path> "bin/$(basename <path>).$(date +%Y%m%d-%H%M%S)"
```

The timestamp suffix keeps repeated moves of the same name from colliding, and
makes it obvious when something was set aside. `bin/` is git-ignored, so it never
reaches a commit; Joé empties it himself when he is satisfied nothing is needed.

Why: a wrongly deleted file in this repo is unrecoverable, and "obviously
disposable" has been wrong before. A move costs nothing and is always reversible.

If a command fails with `Operation not permitted` on an unlink, that is this rule
being enforced by the sandbox — do not ask for delete permission, move the file
to `bin/` and carry on.

## Shared AI chat & SEO strategy

farewell.salon is one of three coordinated sites. Before changing page structure,
structured data, links to the partner sites, analytics events or anything for the chat
assistant, read `AI-SEO-STRATEGY.md` at the base of the project. It holds the rules that
bind this code and says where the full plan lives.
