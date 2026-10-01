"use client";

import { DeleteMyDataButton } from "@/components/legal/DeleteMyDataButton";
import { useStore } from "@/store/useStore";

const LAST_UPDATED = "4 de septiembre de 2026";

function waLink(whatsapp: string, message: string): string {
  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;
}

export default function TerminosPage() {
  const storeInfo = useStore((s) => s.storeInfo);
  const contactWaLink = waLink(
    storeInfo.whatsapp,
    "Hola, tengo una consulta sobre mis datos personales."
  );
  const deletionWaLink = waLink(
    storeInfo.whatsapp,
    "Hola, quiero solicitar la eliminación de mis datos personales."
  );

  return (
    <div className="leaf-pattern min-h-screen">
      <div className="mx-auto max-w-3xl px-4 py-16 md:px-6">
        <div className="rounded-2xl border border-forest/10 bg-white px-7 py-7 shadow-sm">
          <p className="font-script text-xl text-leaf">Información legal</p>
          <h1 className="font-display mt-1 text-3xl font-bold text-forest md:text-4xl">
            Términos y Política de Privacidad
          </h1>
          <p className="mt-2 text-xs text-ink/45">
            Última actualización: {LAST_UPDATED}
          </p>
          <div className="mt-8 space-y-8 text-sm leading-relaxed text-ink/75">
            <section>
              <h2 className="mb-2 text-lg font-semibold text-forest">
                1. Responsable del tratamiento
              </h2>
              <p>
                {storeInfo.name} es responsable de los datos que recolecta
                este sitio. Puedes contactarnos{" "}
                <a
                  href={contactWaLink}
                  target="_blank"
                  rel="noreferrer"
                  className="underline hover:text-forest"
                >
                  por WhatsApp al {storeInfo.phone}
                </a>{" "}
                o al correo {storeInfo.email} para cualquier consulta
                relacionada con tus datos personales.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-forest">
                2. Qué datos recolectamos
              </h2>
              <p>
                Al realizar un pedido te pedimos nombre, teléfono, ciudad/zona
                y dirección de entrega, para poder coordinar el envío contigo
                por WhatsApp. Al participar en nuestra ruleta de descuentos te
                pedimos nombre, email, teléfono y, opcionalmente, tu fecha de
                nacimiento.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-forest">
                3. Para qué usamos tus datos
              </h2>
              <ul className="list-disc space-y-1 pl-5">
                <li>Coordinar y confirmar tu pedido por WhatsApp.</li>
                <li>
                  Enviarte promociones, novedades y descuentos, solo si diste
                  tu consentimiento explícito al participar en la ruleta.
                </li>
                <li>
                  Mejorar nuestro catálogo y atención al cliente en base a tus
                  compras.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-forest">
                4. Con quién compartimos tus datos (terceros)
              </h2>
              <ul className="list-disc space-y-1 pl-5">
                <li>
                  <span className="font-medium text-forest">WhatsApp / Meta:</span>{" "}
                  al enviar un pedido, tu nombre, teléfono, dirección y el
                  detalle de tu compra se envían como un mensaje de WhatsApp a
                  nuestro número de contacto. Esa conversación queda sujeta a
                  las políticas de privacidad de WhatsApp/Meta, fuera de
                  nuestro control directo.
                </li>
                <li>
                  <span className="font-medium text-forest">Google (reseñas):</span>{" "}
                  mostramos reseñas públicas de nuestro negocio obtenidas de
                  Google Places. Esto no envía ningún dato tuyo a Google; solo
                  leemos información pública ya publicada ahí.
                </li>
              </ul>
              <p className="mt-2">
                No vendemos tus datos a terceros ni los usamos con fines
                distintos a los descritos en este aviso.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-forest">
                5. Pagos
              </h2>
              <p>
                Este sitio no procesa pagos en línea. Todo pago se coordina y
                confirma directamente con nuestro equipo por WhatsApp, fuera
                de esta página.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-forest">
                6. Dónde se guardan tus datos
              </h2>
              <p>
                Tu carrito, tus pedidos y tu participación en la ruleta se
                guardan localmente en el navegador que usas (localStorage), no
                en un servidor central. Si borras los datos del sitio en tu
                navegador o usas otro dispositivo, esta información no estará
                disponible.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-forest">
                7. Tus derechos: acceso, corrección y eliminación
              </h2>
              <p>
                Puedes pedirnos en cualquier momento acceder, corregir o
                eliminar los datos que tengamos sobre ti. Como este sitio
                guarda tus datos localmente en tu propio navegador, también
                puedes eliminarlos tú mismo/a de inmediato con el botón de
                abajo:
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                <DeleteMyDataButton />
                <a
                  href={deletionWaLink}
                  target="_blank"
                  rel="noreferrer"
                  className="pop-glow inline-flex items-center text-sm font-medium text-leaf hover:text-forest"
                >
                  Solicitar eliminación por WhatsApp →
                </a>
              </div>
              <p className="mt-3 text-xs text-ink/55">
                Esto borra tu carrito, tu historial de pedidos y tu
                participación en la ruleta guardados en este navegador. No
                elimina mensajes que ya hayas enviado por WhatsApp: para eso,
                contáctanos y lo eliminaremos de nuestro lado manualmente en
                un plazo razonable.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-forest">
                8. Menores de edad
              </h2>
              <p>
                Este sitio no está dirigido a menores de 18 años. Si eres
                padre, madre o tutor y crees que un menor a tu cargo nos
                proporcionó datos personales (por ejemplo, al participar en la
                ruleta), contáctanos para eliminarlos.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-forest">
                9. Cambios y devoluciones
              </h2>
              <p>
                Cualquier cambio, devolución o reclamo sobre un pedido se
                coordina directamente con nuestro equipo por WhatsApp o los
                medios de contacto indicados en el pie de página.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-forest">
                10. Contacto
              </h2>
              <p>
                Si tienes preguntas sobre tus datos o este aviso,{" "}
                <a
                  href={contactWaLink}
                  target="_blank"
                  rel="noreferrer"
                  className="underline hover:text-forest"
                >
                  escríbenos por WhatsApp
                </a>{" "}
                o al correo {storeInfo.email}, también indicado en el pie de
                página del sitio.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
