# OBP Style
Compile a common CSS framework and APP information (webmanifest, JSON-LD, icons) for consistency across all web products.

### Configuration
Copy `config.js.example` to `config.js` and edit app and organisational information.

Copy `favicon.png.example` to `favicon.png` or use your own (high resolution) PNG image.

Edit sass variables in `./src/sass/common/{_theme.scss,_variables.scss}`.

### Compile
All files will be output to `./dist`. The directory structure will be:

```markdown
- dist/
  - css/
  - fonts/
  - icons/
```

#### With docker
```
docker run --rm -v /path/to/obp-style/dist:/src/dist openbookpublishers/obp-style
```

#### With npm
```
npm install
npm run build
```
or
```
npm install
gulp
```

### JSON-LD information
To be included using:
```
<script type="application/ld+json" src="./app-ld.json">
