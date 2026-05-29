"use client";

import { useState, useTransition } from "react";
import { Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import type { Faq } from "@/lib/types";
import { createFaqAction, deleteFaqAction, updateFaqAction } from "./actions";

export function FaqManager({ faqs }: { faqs: Faq[] }) {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function run(fn: () => Promise<void>, after?: () => void) {
    setError(null);
    startTransition(async () => {
      try {
        await fn();
        after?.();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error");
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Preguntas frecuentes</h2>
        {!adding && (
          <button className="btn-primary" onClick={() => setAdding(true)}>
            <Plus className="h-4 w-4" />
            Nueva
          </button>
        )}
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      {adding && (
        <FaqEditor
          pending={pending}
          onCancel={() => setAdding(false)}
          onSave={(q, a) =>
            run(
              () => createFaqAction(q, a),
              () => setAdding(false)
            )
          }
        />
      )}

      <div className="card divide-y divide-neutral-100">
        {faqs.map((f) =>
          editingId === f.documentId ? (
            <div key={f.documentId} className="p-4">
              <FaqEditor
                pending={pending}
                initial={f}
                onCancel={() => setEditingId(null)}
                onSave={(q, a) =>
                  run(
                    () => updateFaqAction(f.documentId, q, a),
                    () => setEditingId(null)
                  )
                }
              />
            </div>
          ) : (
            <div
              key={f.documentId}
              className="flex items-start gap-3 px-4 py-3"
            >
              <div className="flex-1">
                <p className="font-medium">{f.question}</p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-neutral-500">
                  {f.answer}
                </p>
              </div>
              <button
                className="btn-secondary shrink-0"
                onClick={() => setEditingId(f.documentId)}
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                className="btn-danger shrink-0"
                disabled={pending}
                onClick={() => {
                  if (!window.confirm("¿Eliminar esta pregunta?")) return;
                  run(() => deleteFaqAction(f.documentId));
                }}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )
        )}
        {faqs.length === 0 && !adding && (
          <p className="px-4 py-8 text-center text-sm text-neutral-400">
            Aún no hay preguntas.
          </p>
        )}
      </div>
    </div>
  );
}

function FaqEditor({
  initial,
  pending,
  onSave,
  onCancel
}: {
  initial?: Faq;
  pending: boolean;
  onSave: (question: string, answer: string) => void;
  onCancel: () => void;
}) {
  const [question, setQuestion] = useState(initial?.question ?? "");
  const [answer, setAnswer] = useState(initial?.answer ?? "");

  return (
    <div className="card space-y-3 p-4">
      <input
        className="input"
        placeholder="Pregunta"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <textarea
        className="input resize-y"
        rows={3}
        placeholder="Respuesta"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />
      <div className="flex gap-2">
        <button
          className="btn-primary"
          disabled={pending}
          onClick={() => onSave(question, answer)}
        >
          {pending && <Loader2 className="h-4 w-4 animate-spin" />}
          Guardar
        </button>
        <button className="btn-secondary" onClick={onCancel}>
          <X className="h-4 w-4" />
          Cancelar
        </button>
      </div>
    </div>
  );
}
