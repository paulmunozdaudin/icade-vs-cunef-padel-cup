# ICADE vs CUNEF — Padel Cup

Landing para vender entradas del torneo de pádel **pareja ICADE 🆚 pareja CUNEF**
+ tardeo con DJ + 2 copas. Next.js 16 (App Router) + TypeScript + Tailwind CSS 4.
Sin dependencias extra: Stripe se usa vía su API REST.

## Arrancar en local

```bash
npm install
cp .env.local.example .env.local   # rellena lo que necesites
npm run dev                        # http://localhost:3000
```

## Lo que tienes que editar

Todo está en **`src/lib/padel/config.ts`**:

| Qué | Variable | Mientras no se defina |
| --- | --- | --- |
| Precio de la entrada | `TICKET_PRICE_EUR` (ej. `25`) | Se muestra "XX €" y el pago queda bloqueado |
| Fecha y hora | `EVENT.startsAt` (ISO, ej. `"2026-11-14T16:00:00+01:00"`) | "Añadir al calendario" desactivado |
| Lugar | `EVENT.venue` | No se muestra |

## Pagos con Stripe

1. Crea una cuenta en Stripe y copia la clave secreta.
2. Añade `STRIPE_SECRET_KEY` en Vercel (y `TICKET_PRICE_EUR` en `config.ts`).
3. Redespliega. El botón "Pagar y reservar mi plaza" pasa a abrir Stripe Checkout.

Flujo: formulario → resumen → `POST /api/checkout` (revalida los datos en el
servidor) → Stripe Checkout → `/confirmacion?session_id=…`, que **consulta a
Stripe** y solo muestra "🔥 Estás dentro" si el pago está hecho. Sin clave de
Stripe nunca se simula un pago.

Los datos de cada jugador (nombre, edad, universidad, pareja) se guardan como
`metadata` del pago en Stripe, así que Stripe es la lista oficial de inscritos.

## Parejas y cruces ICADE 🆚 CUNEF

Lógica en `src/lib/padel/pairing.ts`:

- **Pareja** = dos jugadores de la **misma universidad** que se han nombrado mutuamente
  (nombres comparados sin tildes ni mayúsculas).
- **Antes de cobrar**, si tu pareja ya compró por la otra universidad, la compra se
  bloquea (409) para que no exista una pareja mixta.
- **Cruces**: `buildMatchups` solo puede generar partidos pareja ICADE vs pareja CUNEF
  (está garantizado por los tipos).

Consulta el estado (parejas, quién espera a su pareja, incidencias y cruces):

```bash
curl -H "Authorization: Bearer $ADMIN_TOKEN" https://TU-DOMINIO/api/admin/pairs
```

## Desplegar en Vercel

1. En Vercel: **Add New… → Project → Import** este repositorio.
2. Framework: Next.js (se detecta solo). No hace falta tocar nada del build.
3. Añade las variables de `.env.local.example` y pulsa **Deploy**.

## Estructura

```
src/lib/padel/config.ts          Precio, fecha, lugar (editable)
src/lib/padel/registration.ts    Validación compartida cliente/servidor
src/lib/padel/pairing.ts         Parejas y cruces ICADE vs CUNEF
src/lib/padel/stripe.ts          Integración con Stripe Checkout
src/app/page.tsx                 Landing
src/app/confirmacion/page.tsx    Confirmación verificada con Stripe
src/app/api/checkout/route.ts    Crea el pago
src/app/api/admin/pairs/route.ts Parejas y cruces para la organización
src/components/padel/*           Navbar, Hero, RivalrySection, TournamentFormat,
                                 IncludedSection, AfterpartySection, HowItWorks,
                                 Pricing, Checkout, Confirmation, FAQ, FinalCta, Footer
```
