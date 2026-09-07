# Casa de Pura Vida Sana

Plataforma front-end demo para la tienda de suplementos, vitaminas y productos naturales en La Paz, Bolivia.

## Stack

- Next.js 16 (App Router)
- Tailwind CSS v4
- Zustand + localStorage
- Lucide Icons
- qrcode.react

## Cómo correr

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Módulos

- `/` — Landing (hero, categorías, destacados, beneficios)
- `/catalogo` — Filtros, búsqueda y carrito
- `/inventario` — CRUD local de productos
- Checkout QR boliviano con temporizador, comprobante y WhatsApp
- Persistencia: `src/data/mockData.json` → Zustand → `localStorage`

## Paleta

| Token  | Hex     |
|--------|---------|
| Forest | `#184D28` |
| Leaf   | `#6EB43F` |
| Soft   | `#F2F8EE` |
| Ink    | `#1C241E` |
