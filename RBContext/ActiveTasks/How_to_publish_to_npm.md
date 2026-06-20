# Configuring a React Bytes Component for Automated NPM Publishing

This guide explains how to prepare a component so it can be automatically packaged and published through the React Bytes publishing pipeline.

## Step 1: Add Publishing Metadata

Open the component's `.config.ts` file and define the NPM publishing metadata.

```ts
npmPackageName: "@reactbytes/component-name",
version: "1.0.0",
dependencies: {
  "some-package": "^1.0.0"
},
peerDependencies: {
  react: "^18.0.0"
}
```

### Supported Fields

| Field              | Description                                                |
| ------------------ | ---------------------------------------------------------- |
| `npmPackageName`   | Package name that will be published to NPM                 |
| `version`          | Version to publish                                         |
| `dependencies`     | Runtime dependencies installed automatically for consumers |
| `peerDependencies` | Required peer packages expected from the consuming project |

Example:

```ts
npmPackageName: "@reactbytes/blur-text",
version: "1.0.1",
dependencies: {
  "framer-motion": "^12.0.0"
}
```

---

## Step 2: Include Component Assets

If your component uses colocated CSS files, place them alongside the component source.

Example:

```
ShinyButton/
├── ShinyButton.tsx
├── ShinyButton.css [rarely used - most likely can be avoided]
└── ShinyButton.config.ts
```

The publishing pipeline automatically detects and injects local CSS into the generated bundle, so consumers do not need to import styles separately.

---

## Step 3: Verify Component Metadata

Ensure the component configuration contains:

* Name
* Description
* Installation metadata
* Usage examples
* Preset definitions (if applicable)
* Credits/author information

These fields are used to automatically generate the package README during publishing.

---

## Step 4: Run a Dry Run

Before publishing, execute:

```bash
npx tsx scripts/publish-pending.ts --dry-run
```

The script will:

1. Check whether the specified version already exists on NPM.
2. Skip components that are already published.
3. Build unpublished components using `tsup`.
4. Generate package metadata.
5. Generate README documentation.
6. Validate the package with `npm pack`.

---

## Step 5: Review Generated Output

Successful builds produce:

```text
index.js
index.mjs
index.d.ts
index.d.mts
README.md
package.json
```

Verify that:

* The package name is correct.
* The version is correct.
* Dependencies are listed correctly.
* README content is accurate.
* Type definitions are generated successfully.

---

## Step 6: Publish Through CI/CD

After the component configuration is merged into the repository:

1. Commit and push your changes.
2. Ensure the component version has not been published previously.
3. The GitHub Actions workflow will automatically:

   * Detect unpublished component versions.
   * Build the package.
   * Generate documentation.
   * Publish the package using the configured `NPM_TOKEN`.

No manual packaging or publishing steps are required.

---

## Publishing Checklist

Before submitting a component:

* [ ] `npmPackageName` defined
* [ ] `version` defined
* [ ] Dependencies declared correctly
* [ ] Peer dependencies declared correctly
* [ ] Component builds successfully
* [ ] Usage example included
* [ ] Description provided
* [ ] Dry run completed successfully
* [ ] Version number incremented for updates

Once these requirements are met, the component is ready for automated NPM publication.
