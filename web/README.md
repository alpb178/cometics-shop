# 🌟 Next.js Multilingual Blog Template

Welcome to our cutting-edge Next.js Multilingual Blog Template! This powerful and flexible template is designed to help you create stunning, multilingual blogs with ease.

## ✨ Features

- 🌐 Multilingual support (English and French)
- 📱 Fully responsive design
- 🎨 Customizable themes
- 🖼️ Image optimization
- 🔍 SEO-friendly
- 🚀 Fast performance with Next.js

## 🚀 Getting Started

1. Clone this repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local` and update the variables
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Analítica del grupo

El storefront manda al hub de CORPSC sus páginas vistas y sus clics con el
tracker compartido del grupo, que vive en `corpsc-hub/tracker` y se copia a
`lib/hub-tracker/` con `pnpm sync` (esa carpeta no se edita a mano: lo comprueba
su `integrity.test.ts`). `components/analytics/site-analytics.tsx` fija lo propio
de esta tienda —zonas privadas y rutas con id— y `app/api/hub-track` reenvía con
la clave. Es independiente de `PageTracker`, que sigue alimentando el panel de
esta tienda.

Dos variables en `.env.local` (sin ellas la ruta no envía nada, que es lo que se
quiere en local):

```
HUB_URL=https://hub.corpsc.com/api
HUB_API_KEY=   # se emite en el hub, Ajustes → Proyectos, y se enseña una vez
```

La clave **nunca** puede ir en una variable `NEXT_PUBLIC_`: quien la tenga puede
escribir métricas de este proyecto.

## 🛠️ Customization

- Modify `config.ts` to change language settings
- Update `next.config.mjs` for advanced configurations
- Add your own MDX files in the `blog` page directly

## 🤝 Contributing

We welcome contributions! Please see our [contributing guidelines](link-to-contributing-guidelines) for more information.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<footer>
<p align="center">
  Made by <a href="https://aceternity.com">Aceternity</a><br>
  Powered by <a href="https://nextjs.org/">Next.js</a> | <a href="https://tailwindcss.com/">Tailwind CSS</a> | <a href="https://framer.com/motion">Framer Motion</a> | <a href="https://ui.aceternity.com">Aceternity UI</a>
</p>
</footer>

++ Deploy
