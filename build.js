import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.resolve(__dirname, 'src');
const distDir = path.resolve(__dirname, 'dist');

// Função para minificar CSS
function minifyCSS(css) {
    return css
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\s+/g, ' ')
        .replace(/\s*([\{\}\:\;\,])\s*/g, '$1')
        .replace(/;}/g, '}')
        .trim();
}

// Concatena e resolve os @import do CSS em um único arquivo de produção
function bundleCSS(entryPath) {
    let cssContent = fs.readFileSync(entryPath, 'utf-8');
    const importRegex = /@import\s+url\(["']?([^"')]+)["']?\);/g;

    cssContent = cssContent.replace(importRegex, (match, relativeImportPath) => {
        const fullImportPath = path.resolve(path.dirname(entryPath), relativeImportPath);
        if (fs.existsSync(fullImportPath)) {
            return fs.readFileSync(fullImportPath, 'utf-8');
        }
        return match;
    });

    return minifyCSS(cssContent);
}

// Função para minificar JS
function minifyJS(js) {
    return js
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\/\/.*/g, '')
        .replace(/^\s+|\s+$/gm, '')
        .replace(/\n+/g, '\n')
        .trim();
}

// Função para minificar HTML
function minifyHTML(html) {
    return html
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/>\s+</g, '><')
        .replace(/\s{2,}/g, ' ')
        .trim();
}

function copyDirRecursive(src, dest) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDirRecursive(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

console.log('🚀 Iniciando Pipeline de Build da Arquitetura /src para /dist...');

// 1. Limpa/recria dist
if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });
fs.mkdirSync(path.join(distDir, 'pages'), { recursive: true });
fs.mkdirSync(path.join(distDir, 'assets', 'css'), { recursive: true });
fs.mkdirSync(path.join(distDir, 'assets', 'js'), { recursive: true });

// 2. Copia imagens
const imagesSrc = path.join(srcDir, 'assets', 'images');
if (fs.existsSync(imagesSrc)) {
    copyDirRecursive(imagesSrc, path.join(distDir, 'assets', 'images'));
}

// 3. Minifica HTMLs
const htmlFiles = [
    { src: path.join(srcDir, 'index.html'), dest: path.join(distDir, 'index.html'), name: 'index.html' },
    { src: path.join(srcDir, 'pages', 'projetos.html'), dest: path.join(distDir, 'pages', 'projetos.html'), name: 'pages/projetos.html' },
    { src: path.join(srcDir, 'pages', 'cadastro.html'), dest: path.join(distDir, 'pages', 'cadastro.html'), name: 'pages/cadastro.html' }
];

htmlFiles.forEach(({ src, dest, name }) => {
    if (fs.existsSync(src)) {
        const original = fs.readFileSync(src, 'utf-8');
        const minified = minifyHTML(original);
        fs.writeFileSync(dest, minified, 'utf-8');
        const red = ((1 - minified.length / original.length) * 100).toFixed(1);
        console.log(`✓ HTML Minificado: ${name} (Redução de ${red}%)`);
    }
});

// 4. Empacota e Minifica CSS
const cssEntry = path.join(srcDir, 'assets', 'css', 'style.css');
if (fs.existsSync(cssEntry)) {
    const bundledCSS = bundleCSS(cssEntry);
    fs.writeFileSync(path.join(distDir, 'assets', 'css', 'style.css'), bundledCSS, 'utf-8');
    console.log(`✓ CSS Modular Empacotado: dist/assets/css/style.css (${(bundledCSS.length / 1024).toFixed(2)} KB)`);
}

// 5. Minifica JS
const jsFiles = ['ui.js', 'cadastro.js'];
jsFiles.forEach(file => {
    const filePath = path.join(srcDir, 'assets', 'js', file);
    if (fs.existsSync(filePath)) {
        const original = fs.readFileSync(filePath, 'utf-8');
        const minified = minifyJS(original);
        fs.writeFileSync(path.join(distDir, 'assets', 'js', file), minified, 'utf-8');
        const red = ((1 - minified.length / original.length) * 100).toFixed(1);
        console.log(`✓ JS Minificado: assets/js/${file} (Redução de ${red}%)`);
    }
});

console.log('\n✨ Build profissional gerada com sucesso na pasta /dist!');
