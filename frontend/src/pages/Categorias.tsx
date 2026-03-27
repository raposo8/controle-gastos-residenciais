import { useEffect, useState } from "react";
import { getCategorias, createCategoria } from "../api";
import type { Categoria } from "../types";

const FINALIDADE_LABEL: Record<number, string> = {
  1: "Despesa",
  2: "Receita",
  3: "Ambas",
};

const FINALIDADE_COLOR: Record<number, string> = {
  1: "text-red-400 bg-red-400/10 border border-red-400/20",
  2: "text-emerald-400 bg-emerald-400/10 border border-emerald-400/20",
  3: "text-violet-400 bg-violet-400/10 border border-violet-400/20",
};

export default function Categorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [descricao, setDescricao] = useState("");
  const [finalidade, setFinalidade] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setCategorias(await getCategorias());
    } catch {
      setError("Falha ao carregar categorias.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!descricao.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await createCategoria({ descricao: descricao.trim(), finalidade });
      setDescricao("");
      setFinalidade(1);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
      await load();
    } catch {
      setError("Falha ao criar categoria.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-1">
          Gestão
        </p>
        <h1
          className="text-3xl font-bold text-white"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Categorias
        </h1>
      </div>

      {/* Form */}
      <div className="bg-[#1a1d27] border border-white/5 rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-5">
          Nova Categoria
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Descrição da categoria..."
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="flex-1 bg-[#0f1117] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500/60 transition-colors"
            required
          />
          <select
            value={finalidade}
            onChange={(e) => setFinalidade(Number(e.target.value))}
            className="bg-[#0f1117] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500/60 transition-colors min-w-[160px]"
          >
            <option value={1}>Despesa</option>
            <option value={2}>Receita</option>
            <option value={3}>Ambas</option>
          </select>
          <button
            type="submit"
            disabled={saving}
            className="bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl transition-colors whitespace-nowrap"
          >
            {saving ? "Salvando..." : "Adicionar"}
          </button>
        </form>

        {error && (
          <p className="mt-3 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">
            {error}
          </p>
        )}
        {success && (
          <p className="mt-3 text-sm text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-lg px-4 py-2">
            Categoria criada com sucesso!
          </p>
        )}
      </div>

      {/* Table */}
      <div className="bg-[#1a1d27] border border-white/5 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">
            Listagem
          </h2>
          <span className="text-xs text-slate-600">
            {categorias.length} registro(s)
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
          </div>
        ) : categorias.length === 0 ? (
          <div className="text-center py-16 text-slate-600">
            Nenhuma categoria cadastrada.
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-widest px-6 py-3">
                  #
                </th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-widest px-6 py-3">
                  Descrição
                </th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-widest px-6 py-3">
                  Finalidade
                </th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((cat, i) => (
                <tr
                  key={cat.id}
                  className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors ${
                    i % 2 === 0 ? "" : "bg-white/[0.01]"
                  }`}
                >
                  <td className="px-6 py-4 text-slate-600 text-sm">{cat.id}</td>
                  <td className="px-6 py-4 text-white font-medium">
                    {cat.descricao}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        FINALIDADE_COLOR[cat.finalidade]
                      }`}
                    >
                      {FINALIDADE_LABEL[cat.finalidade]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}