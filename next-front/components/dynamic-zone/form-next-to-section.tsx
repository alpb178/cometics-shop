"use client";

import { motion } from "framer-motion";
import { MapPin, MessageCircle, Send, Sparkles } from "lucide-react";
import Link from "next/link";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "../button/Button";
import { TextInput } from "../form/text-input/TextInput";
import ViewMap from "../map/ViewMap";
import { socials } from "./socials";

export function FormNextToSection({
  heading,
  sub_heading,
  form,
  social_networks
}: {
  heading: string;
  sub_heading: string;
  form: any;
  section: any;
  social_networks: any;
}) {
  const lat = process.env.NEXT_PUBLIC_LAT;
  const lng = process.env.NEXT_PUBLIC_LNG;
  const address = process.env.NEXT_PUBLIC_ADDRESS;

  const getValidationRules = (input: any) => {
    const rules: Record<string, any> = {};
    if (input.required) {
      rules.required = {
        value: true,
        message: `${input.label || input.name} es requerido`
      };
    }
    if (input.type === "email") {
      rules.pattern = {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Correo electrónico inválido"
      };
    }
    if (input.type === "tel") {
      rules.pattern = {
        value: /^[\+]?[1-9][\d]{0,15}$/,
        message: "Número de teléfono inválido"
      };
    }
    return rules;
  };

  const methods = useForm();

  const onSubmit = (data: {
    name: string;
    email: string;
    comments: string;
  }) => {
    const message = `Hola, mi nombre es ${data.name}.${
      data.email ? ` Pueden escribirme a ${data.email}.` : ""
    }${data.comments ? ` Quisiera añadir: "${data.comments}".` : ""}`;

    window.open(
      `https://wa.me/${
        process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
      }?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <section className="relative w-full py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-10 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 bg-pink-100 rounded-full">
            <Sparkles className="w-4 h-4 text-pink-600" />
            <span className="text-xs md:text-sm font-semibold text-pink-700 uppercase tracking-wider">
              Estamos para ayudarte
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {heading}
          </h2>
          {sub_heading && (
            <p className="max-w-2xl mx-auto text-base md:text-lg text-gray-600 leading-relaxed">
              {sub_heading}
            </p>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8">
          {/* Form card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-3 bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-10"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-lg shadow-pink-500/30">
                <Send className="w-5 h-5" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                Envíanos un mensaje
              </h3>
            </div>

            <FormProvider {...methods}>
              <form
                className="space-y-5"
                onSubmit={methods.handleSubmit(onSubmit as any)}
              >
                {form?.inputs?.map((input: any) => {
                  if (input?.type === "submit") {
                    return (
                      <Button
                        key={input?.name}
                        className="w-full text-white rounded-xl py-3 px-4"
                        variant="outline"
                        label="Enviar por WhatsApp"
                        type="submit"
                      />
                    );
                  }
                  if (input?.type === "textarea") {
                    return (
                      <TextInput
                        key={input?.name}
                        as="textarea"
                        name={input.name}
                        label={input.label}
                        placeholder={input.placeholder}
                        required={input.required}
                        validation={getValidationRules(input)}
                        className="rounded-xl border-2 !border-gray-200 focus:!border-pink-500"
                      />
                    );
                  }
                  return (
                    <TextInput
                      key={input?.name}
                      name={input.name}
                      type={input.type}
                      label={input.label}
                      placeholder={input.placeholder}
                      required={input.required}
                      validation={getValidationRules(input)}
                      className="!rounded-xl border-2 !border-gray-200 focus:!border-pink-500"
                    />
                  );
                })}
              </form>
            </FormProvider>

            {social_networks?.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-100">
                <p className="text-sm text-gray-500 mb-4">
                  También puedes encontrarnos en:
                </p>
                <div className="flex items-center gap-4">
                  {social_networks.map((social: any) => (
                    <Link
                      href={social.link.URL}
                      target="_blank"
                      key={social.alias}
                      className="flex items-center justify-center w-11 h-11 rounded-full bg-gray-50 hover:bg-pink-50 border border-gray-200 hover:border-pink-200 transition-colors"
                      aria-label={social.name}
                    >
                      {socials[social.name as keyof typeof socials]?.icon}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Info cards + map */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2 space-y-4"
          >
            <Link
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
              target="_blank"
              className="flex items-start gap-4 p-5 md:p-6 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-xl bg-white/20 backdrop-blur">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-base md:text-lg mb-1">
                  WhatsApp directo
                </h4>
                <p className="text-sm text-white/90">
                  Respondemos en minutos
                </p>
              </div>
            </Link>

            {address && (
              <div className="flex items-start gap-4 p-5 md:p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
                <div className="flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-xl bg-pink-50 text-pink-600">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-base md:text-lg text-gray-900 mb-1">
                    Visítanos
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {address}
                  </p>
                </div>
              </div>
            )}

            <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
              <ViewMap
                lat={Number(lat)}
                lng={Number(lng)}
                address={address || ""}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
