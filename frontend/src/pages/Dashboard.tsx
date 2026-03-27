import { useEffect, useState } from "react";
import { getTotaisPorPessoa, getTotaisPorCategoria } from "../api";
import type { TotaisPessoa, TotaisCategoria } from "../types";

const fmt = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const SaldoCell = ({ value }: { value: number }) => (
  <span
    className={`font-bold tabular-nums ${
      value >= 0 ? "text-emerald-400" : "text-red-400"
    }`}
  >
    {fmt(value)}
  </span>
);

function sum(arr: number[]) {
  return arr.reduce((a, b) => a + b, 0);
}

export default function Dashboard() {
  const [totaisPessoa, setTotaisPessoa] = useState<TotaisPessoa[]>([]);
  const [totaisCategoria, setTotaisCategoria] = useState<TotaisCategoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([getTotaisPorPessoa(), getTotaisPorCategoria()])
      .then(([p, c]) => {
        setTotaisPessoa(p);
        setTotaisCategoria(c);
      })
      .catch(() => setError("Falha ao carregar relatórios."))
      .finally(() => setLoading(false));
  }, []);


  const gtPReceitas = sum(totaisPessoa.map((r) => r.totalReceitas));
  const gtPDespesas = sum(totaisPessoa.map((r) => r.totalDespesas));
  const gtPSaldo = sum(totaisPessoa.map((r) => r.saldoLiquido));

  const gtCReceitas = sum(totaisCategoria.map((r) => r.totalReceitas));
  const gtCDespesas = sum(totaisCategoria.map((r) => r.totalDespesas));
  const gtCSaldo = sum(totaisCategoria.map((r) => r.saldoLiquido));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-1">
          Visão Geral
        </p>
        <h1
          className="text-3xl font-bold text-white"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Dashboard
        </h1>
      </div>

      {error && (
        <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#1a1d27] border border-white/5 rounded-2xl p-5">
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">
            Total Receitas
          </p>
          <p className="text-2xl font-bold text-emerald-400 tabular-nums">
            {fmt(gtPReceitas)}
          </p>
        </div>
        <div className="bg-[#1a1d27] border border-white/5 rounded-2xl p-5">
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">
            Total Despesas
          </p>
          <p className="text-2xl font-bold text-red-400 tabular-nums">
            {fmt(gtPDespesas)}
          </p>
        </div>
        <div className="bg-[#1a1d27] border border-white/5 rounded-2xl p-5">
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">
            Saldo Líquido
          </p>
          <p
            className={`text-2xl font-bold tabular-nums ${
              gtPSaldo >= 0 ? "text-violet-400" : "text-red-400"
            }`}
          >
            {fmt(gtPSaldo)}
          </p>
        </div>
      </div>

      {/* Totais por Pessoa */}
      <div className="bg-[#1a1d27] border border-white/5 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">
            Totais por Pessoa
          </h2>
        </div>

        {totaisPessoa.length === 0 ? (
          <div className="text-center py-12 text-slate-600">
            Sem dados disponíveis.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-widest px-6 py-3">
                    Pessoa
                  </th>
                  <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-widest px-6 py-3">
                    Receitas
                  </th>
                  <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-widest px-6 py-3">
                    Despesas
                  </th>
                  <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-widest px-6 py-3">
                    Saldo
                  </th>
                </tr>
              </thead>
              <tbody>
                {totaisPessoa.map((r, i) => (
                  <tr
                    key={r.pessoaNome}
                    className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors ${
                      i % 2 === 0 ? "" : "bg-white/[0.01]"
                    }`}
                  >
                    <td className="px-6 py-4 text-white font-medium">
                      {r.pessoaNome}
                    </td>
                    <td className="px-6 py-4 text-right text-emerald-400 tabular-nums">
                      {fmt(r.totalReceitas)}
                    </td>
                    <td className="px-6 py-4 text-right text-red-400 tabular-nums">
                      {fmt(r.totalDespesas)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <SaldoCell value={r.saldoLiquido} />
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-white/10 bg-white/[0.03]">
                  <td className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Total Geral
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-emerald-400 tabular-nums">
                    {fmt(gtPReceitas)}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-red-400 tabular-nums">
                    {fmt(gtPDespesas)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <SaldoCell value={gtPSaldo} />
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* Totais por Categoria */}
      <div className="bg-[#1a1d27] border border-white/5 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">
            Totais por Categoria
          </h2>
        </div>

        {totaisCategoria.length === 0 ? (
          <div className="text-center py-12 text-slate-600">
            Sem dados disponíveis.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-widest px-6 py-3">
                    Categoria
                  </th>
                  <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-widest px-6 py-3">
                    Receitas
                  </th>
                  <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-widest px-6 py-3">
                    Despesas
                  </th>
                  <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-widest px-6 py-3">
                    Saldo
                  </th>
                </tr>
              </thead>
              <tbody>
                {totaisCategoria.map((r, i) => (
                  <tr
                    key={r.categoriaDescricao}
                    className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors ${
                      i % 2 === 0 ? "" : "bg-white/[0.01]"
                    }`}
                  >
                    <td className="px-6 py-4 text-white font-medium">
                      {r.categoriaDescricao}
                    </td>
                    <td className="px-6 py-4 text-right text-emerald-400 tabular-nums">
                      {fmt(r.totalReceitas)}
                    </td>
                    <td className="px-6 py-4 text-right text-red-400 tabular-nums">
                      {fmt(r.totalDespesas)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <SaldoCell value={r.saldoLiquido} />
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-white/10 bg-white/[0.03]">
                  <td className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Total Geral
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-emerald-400 tabular-nums">
                    {fmt(gtCReceitas)}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-red-400 tabular-nums">
                    {fmt(gtCDespesas)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <SaldoCell value={gtCSaldo} />
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}