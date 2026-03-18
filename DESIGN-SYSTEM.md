# Design System - Convite de Casamento Interativo

Extraído do convite "Milena e Bento" (Convites da Madu) como referência base.

---

## 1. ESTRUTURA DE PÁGINAS (Flipbook - 5 páginas)

| Página | Conteúdo | Estilo Visual |
|--------|----------|---------------|
| 1 - Capa | Foto do casal + "Convidamos você para nosso casamento" + Nomes em script | Foto golden hour, texto sobre fundo branco semi-transparente no topo |
| 2 - Save the Date | Foto P&B do casal abraçados + "SAVE the DATE" + Data | Foto preto e branco, tipografia serif elegante |
| 3 - Convite Principal | Foto topo + Nomes dos pais + Nomes do casal + Data/Hora/Local | Layout vertical, ilustrações de lavanda, linhas divisórias finas |
| 4 - Menu Interativo | Foto do casal + 5 ícones clicáveis em card semi-circular | Ícones circulares lilás/lavanda com labels em script |
| 5 - Encerramento | Foto do casal de costas caminhando + "Esperamos por você" | Foto golden hour, texto script, ramo de lavanda decorativo |

---

## 2. PALETA DE CORES

### Cores Principais
```css
:root {
  /* Backgrounds */
  --bg-primary: #FFFFFF;                    /* Fundo das páginas */
  --bg-overlay: rgba(255, 255, 255, 0.9);   /* Overlay sobre fotos */
  --bg-soft: rgba(255, 255, 255, 0.7);      /* Cards translúcidos */
  --bg-muted: rgba(234, 233, 233, 0.44);    /* Fundo suave */
  --bg-flipbook: #3E545E;                   /* Fundo atrás do flipbook (dark teal) */
  --bg-frame: #E8C4B8;                      /* Borda rose gold do wrapper externo */

  /* Textos */
  --text-primary: #22262E;                  /* Texto principal (quase preto) */
  --text-dark: #101010;                     /* Texto títulos */
  --text-muted: #808080;                    /* Texto secundário */
  --text-light: #FFFFFF;                    /* Texto sobre foto escura */

  /* Accent / Decorativo */
  --accent-lavender: #B8A9C9;              /* Ícones e detalhes lavanda */
  --accent-lavender-light: #D4C8E2;        /* Hover/fundo dos ícones */
  --accent-purple: #7B6A8E;                /* Ilustrações de lavanda */
  --accent-gold: #C9A96E;                  /* Tons dourados das fotos sunset */
  --accent-rose: #E8C4B8;                  /* Rose gold - borda/frame */

  /* Sombras */
  --shadow-page: rgba(0, 0, 0, 0.2) 0px 0px 20px 0px;  /* Sombra das páginas */
  --shadow-controls: rgba(117, 117, 117, 0.71);          /* Controles do flipbook */
}
```

### Cores das Fotos (Mood Board)
- **Golden Hour**: Tons quentes de dourado (#C9A96E), âmbar, e luz solar
- **Preto e Branco**: Usado na página Save the Date para contraste elegante
- **Campo/Natureza**: Verdes suaves e amarelos dourados do trigo

---

## 3. TIPOGRAFIA

### Fontes
```css
/* Fonte principal do conteúdo */
font-family: 'Roboto', sans-serif;

/* Fonte para títulos/destaque (serif) */
font-family: 'Roboto Slab', serif;

/* Fonte script/caligráfica para nomes do casal */
/* No original: fonte caligráfica embutida no design (tipo Great Vibes, Tangerine ou Sacramento) */
/* Sugestão para replicar: */
font-family: 'Great Vibes', cursive;      /* Para nomes do casal */
font-family: 'Sacramento', cursive;        /* Alternativa */
font-family: 'Dancing Script', cursive;    /* Alternativa */
```

### Hierarquia Tipográfica
```css
/* Nomes do casal (script) */
.couple-names {
  font-family: 'Great Vibes', cursive;
  font-size: 48px; /* ~27px no flipbook comprimido */
  color: var(--text-primary);
  letter-spacing: 1px;
}

/* Subtítulos - "CONVIDAMOS VOCÊ PARA NOSSO CASAMENTO" */
.subtitle {
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 300;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--text-muted);
}

/* "SAVE the DATE" - Misto */
.save-the-date {
  font-family: 'Roboto Slab', serif;
  font-size: 36px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 4px;
  color: var(--text-dark);
}
.save-the-date .the {
  font-family: 'Great Vibes', cursive;
  font-size: 24px;
  font-weight: 400;
  text-transform: lowercase;
  font-style: italic;
}

/* Data - "20 . MARÇO . 2027" */
.date {
  font-family: 'Roboto', sans-serif;
  font-size: 18px;
  font-weight: 300;
  letter-spacing: 5px;
  text-transform: uppercase;
  color: var(--text-primary);
}

/* Nomes dos pais */
.parents-names {
  font-family: 'Roboto', sans-serif;
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--text-primary);
}

/* Labels dos ícones interativos */
.icon-label {
  font-family: 'Great Vibes', cursive;
  font-size: 14px;
  color: var(--text-primary);
}

/* Local e hora */
.venue {
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  font-weight: 400;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--text-primary);
}
```

---

## 4. COMPONENTES

### 4.1 Flipbook Container
```css
.flipbook-wrapper {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-flipbook);
  /* Background: foto do casal desfocada atrás do flipbook */
  background-size: cover;
  background-position: center;
  border: 12px solid var(--accent-rose); /* Borda rose gold */
}

.flipbook-page {
  width: 400px;   /* mobile-first, formato retrato */
  height: 710px;
  background: var(--bg-primary);
  box-shadow: var(--shadow-page);
  border-radius: 0px;
  overflow: hidden;
}
```

### 4.2 Página de Capa
```css
.cover-page {
  position: relative;
  background: var(--bg-primary);
}

.cover-photo {
  width: 100%;
  height: 85%;
  object-fit: cover;
  object-position: center;
}

.cover-text-overlay {
  position: absolute;
  top: 5%;
  left: 0;
  right: 0;
  text-align: center;
  background: linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 100%);
  padding: 20px;
}
```

### 4.3 Ícones Interativos (Página 4)
```css
.interactive-icons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  padding: 30px;
}

.icon-button {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: var(--accent-lavender-light);
  border: 2px solid var(--accent-lavender);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.icon-button:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 15px rgba(184, 169, 201, 0.4);
}

.icon-button svg {
  width: 32px;
  height: 32px;
  color: white;
}

/* Card semi-circular que contém os ícones */
.icons-card {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 45%;
  background: var(--bg-primary);
  border-radius: 50% 50% 0 0;
  padding-top: 30px;
  text-align: center;
}
```

### 4.4 Ícones disponíveis (5 seções interativas)
| Ícone | Seção | Descrição |
|-------|-------|-----------|
| Pin/Coração | Saiba como chegar | Abre mapa/localização |
| Presente | Para nos presentear | Lista de presentes |
| Casal/Coração | Confirmar Presença | RSVP / Formulário |
| Vestido/Terno | Dress Code | Orientações de vestuário |
| Alianças | Manual dos convidados | Regras e informações |

### 4.5 Divisores
```css
.divider {
  width: 60%;
  height: 1px;
  background-color: var(--text-muted);
  margin: 15px auto;
}

.divider-gold {
  width: 40%;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--accent-gold), transparent);
  margin: 15px auto;
}
```

### 4.6 Botão de Áudio
```css
.audio-toggle {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.4);
  border: none;
  color: white;
  cursor: pointer;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;
}

.audio-toggle:hover {
  background: rgba(0, 0, 0, 0.6);
}
```

### 4.7 Indicador "Puxe Aqui"
```css
.page-turn-hint {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 50px;
  height: 50px;
  /* Efeito de "orelha" dobrada da página */
  background: linear-gradient(135deg, transparent 50%, rgba(200, 200, 200, 0.5) 50%);
  cursor: pointer;
}

.page-turn-hint::after {
  content: 'PUXE AQUI';
  position: absolute;
  bottom: 8px;
  right: 5px;
  font-size: 8px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--text-muted);
  transform: rotate(-45deg);
}
```

---

## 5. ELEMENTOS DECORATIVOS

### Ilustrações de Lavanda
- Ramos de lavanda aquarelados posicionados nos cantos
- Cores: tons de roxo (#7B6A8E, #9B8BB4) com folhas verdes (#6B8E5A)
- Posições: canto superior direito e inferior esquerdo (diagonal)
- Estilo: aquarela delicada, semi-transparente

### Fotografia
- **Estilo**: Golden hour / Hora dourada
- **Cenário**: Campo aberto com trigo/grama alta
- **Tratamento**: Luz quente, tons dourados, levemente suavizado
- **P&B**: Usado na página 2 para contraste emocional
- **Background do flipbook**: Mesma foto da capa, desfocada e com overlay suave

---

## 6. INTERAÇÕES E ANIMAÇÕES

### Page Flip (Virar Página)
```css
/* Animação de virar página - CSS 3D */
.page-flip {
  transform-style: preserve-3d;
  transition: transform 0.6s ease-in-out;
  transform-origin: left center;
}

.page-flip.flipping {
  transform: rotateY(-180deg);
}

/* Sombra dinâmica durante a virada */
.page-flip::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to left, rgba(0,0,0,0.2), transparent);
  opacity: 0;
  transition: opacity 0.3s;
}

.page-flip.flipping::after {
  opacity: 1;
}
```

### Música de Fundo
- Autoplay com botão de mute/unmute
- Ícone de alto-falante no canto superior direito
- Música ambiente romântica

### Ícones Interativos
- Clique abre link externo ou modal
- Hover: scale(1.1) com sombra suave
- Transição: 0.3s ease

---

## 7. LAYOUT E ESPAÇAMENTO

### Grid do Convite Principal (Página 3)
```
┌─────────────────────────────┐
│         [FOTO CASAL]         │  40% da altura
│         (golden hour)        │
├─────────────────────────────┤
│    🌿 Lavanda decorativa 🌿  │
│                              │
│  "Com a bênção de seus pais" │  font: 12px, italic
│                              │
│  Pais Noiva    |   Pais Noivo│  font: 12px, uppercase
│                              │
│      Milena e Bento          │  font: 48px, script
│    ─────────────────         │  divider
│   "A REALIZAR-SE NO DIA"    │  font: 14px, uppercase
│    ═════════════════         │  divider dourado
│       20 | 03 | 2027        │  font: 36px, serif
│     Sábado, às 19h00        │  font: 18px
│    ─────────────────         │  divider
│  LOCAL: QUIOSQUE SOM DO MAR  │  font: 16px, uppercase
│                              │
│    🌿 Lavanda decorativa 🌿  │
└─────────────────────────────┘
```

### Espaçamentos Base
```css
:root {
  --spacing-xs: 8px;
  --spacing-sm: 16px;
  --spacing-md: 24px;
  --spacing-lg: 32px;
  --spacing-xl: 48px;
  --spacing-2xl: 64px;
}
```

---

## 8. RESPONSIVIDADE

O convite é mobile-first em formato retrato (portrait):
```css
/* Mobile (default) */
.flipbook-page {
  width: 100vw;
  max-width: 430px;
  height: 100vh;
  max-height: 800px;
}

/* Tablet */
@media (min-width: 768px) {
  .flipbook-page {
    width: 430px;
    height: 760px;
  }
}

/* Desktop - flipbook centralizado com background blur */
@media (min-width: 1024px) {
  .flipbook-wrapper {
    background: url('couple-photo-blurred.jpg') center/cover;
  }
  .flipbook-page {
    width: 430px;
    height: 760px;
    box-shadow: var(--shadow-page);
  }
}
```

---

## 9. TECNOLOGIAS UTILIZADAS NO ORIGINAL

| Tecnologia | Uso |
|-----------|-----|
| WordPress + Elementor | Página wrapper |
| Heyzine | Flipbook engine (iframe embed) |
| Canvas rendering | Renderização das páginas do PDF |
| CSS 3D Transforms | Efeito de virar página |
| Web Audio API | Música de fundo |

### Para o nosso convite (melhorias):
- **HTML/CSS/JS puro** ou **React/Next.js** (sem dependência de plataformas)
- **Turn.js** ou **StPageFlip** para efeito de virar página
- **Howler.js** para áudio
- **GSAP** para animações mais sofisticadas
- **Formulário RSVP** integrado (ao invés de link externo)
- **Contador regressivo** até o casamento
- **Galeria de fotos** do casal
