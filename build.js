import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.resolve(__dirname, 'dist');

// Função para minificar CSS
function minifyCSS(css) {
    return css
        .replace(/\/\*[\s\S]*?\*\//g, '') // remove comentários
        .replace(/\s+/g, ' ')             // remove múltiplos espaços
        .replace(/\s*([\{\}\:\;\,])\s*/g, '$1') // remove espaços ao redor de símbolos
        .replace(/;}/g, '}')             // remove ponto e vírgula antes de fechar chave
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

// Função para minificar JS básico
function minifyJS(js) {
    return js
        .replace(/\/\*[\s\S]*?\*\//g, '') // remove comentários de bloco
        .replace(/\/\/.*/g, '')           // remove comentários de linha
        .replace(/^\s+|\s+$/gm, '')       // remove espaços no início e fim de linhas
        .replace(/\n+/g, '\n')           // remove linhas em branco
        .trim();
}

// Função para minificar HTML
function minifyHTML(html) {
    return html
        .replace(/<!--[\s\S]*?-->/g, '')  // remove comentários HTML
        .replace(/>\s+</g, '><')          // remove espaços entre tags
        .replace(/\s{2,}/g, ' ')          // condensa espaços
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

console.log('🚀 Iniciando processo de Build e Minificação Modular...');

// 1. Limpa/recria dist
if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });
fs.mkdirSync(path.join(distDir, 'css'), { recursive: true });
fs.mkdirSync(path.join(distDir, 'js'), { recursive: true });

// 2. Copia imagens
if (fs.existsSync(path.join(__dirname, 'imagem'))) {
    copyDirRecursive(path.join(__dirname, 'imagem'), path.join(distDir, 'imagem'));
}

// 3. Minifica HTMLs
const htmlFiles = ['index.html', 'projetos.html', 'cadastro.html'];
htmlFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        const original = fs.readFileSync(filePath, 'utf-8');
        const minified = minifyHTML(original);
        fs.writeFileSync(path.join(distDir, file), minified, 'utf-8');
        const red = ((1 - minified.length / original.length) * 100).toFixed(1);
        console.log(`✓ HTML Minificado: ${file} (Redução de ${red}%)`);
    }
});

// 4. Concatena Módulos CSS e Minifica
const cssPath = path.join(__dirname, 'css', 'style.css');
if (fs.existsSync(cssPath)) {
    const bundledAndMinifiedCSS = bundleCSS(cssPath);
    fs.writeFileSync(path.join(distDir, 'css', 'style.css'), bundledAndMinifiedCSS, 'utf-8');
    console.log(`✓ CSS Modular Empacotado e Minificado: dist/css/style.css (${(bundledAndMinifiedCSS.length / 1024).toFixed(2)} KB)`);
}

// 5. Minifica JS
const jsFiles = ['ui.js', 'cadastro.js'];
jsFiles.forEach(file => {
    const filePath = path.join(__dirname, 'js', file);
    if (fs.existsSync(filePath)) {
        const original = fs.readFileSync(filePath, 'utf-8');
        const minified = minifyJS(original);
        fs.writeFileSync(path.join(distDir, 'js', file), minified, 'utf-8');
        const red = ((1 - minified.length / original.length) * 100).toFixed(1);
        console.log(`✓ JS Minificado: ${file} (Redução de ${red}%)`);
    }
});

console.log('\n✨ Build de produção gerada com sucesso na pasta /dist!');
