import { useEffect, useState } from "react";
import { getTransacoes, createTransacao, getCategorias, getPessoas } from "../api";
import type { Transacao, Categoria, Pessoa } from "../types";

const fmt = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function Transacoes() {
    const [transacoes, setTransacoes] = useState<Transacao[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [pessoas, setPessoas] = useState<Pessoa[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [descricao, setDescricao] = useState("");
    const [valor, setValor] = useState<number | "">("");
    const [tipo, setTipo] = useState<number>(1);
    const [categoriaId, setCategoriaId] = useState<number | "">("");
    const [pessoaId, setPessoaId] = useState<number | "">("");

    const load = async () => {
        setLoading(true);
        try {
            const [t, c, p] = await Promise.all([
                getTransacoes(),
                getCategorias(),
                getPessoas(),
            ]);
            setTransacoes(t);
            setCategorias(c);
            setPessoas(p);
        } catch (e: any){
            setError("Falha ao carregar dados: "+ e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const resetForm = () => {
        setDescricao("");
        setValor("");
        setTipo(1);
        setCategoriaId("");
        setPessoaId("");
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!descricao.trim() || valor === "" || categoriaId === "" || pessoaId === "")
            return;
        setSaving(true);
        setError(null);
        try {
            await createTransacao({
                descricao: descricao.trim(),
                valor: Number(valor),
                tipo,
                categoriaId: Number(categoriaId),
                pessoaId: Number(pessoaId),
            });
            setSuccess(true);
            setTimeout(() => setSuccess(false), 2500);
            resetForm();
            await load();
        } catch (e: any) {
            setError("Falha ao registrar transação: " + e.message);
            console.log(e);
        } finally {
            setSaving(false);
        }
    };

    const categoriasFiltradas = categorias.filter(
        (c) => c.finalidade === tipo || c.finalidade === 3
    );

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
                    Transações
                </h1>
            </div>

            {/* Form */}
            <div className="bg-[#1a1d27] border border-white/5 rounded-2xl p-6">
                <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-5">
                    Nova Transação
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Tipo toggle */}
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => { setTipo(1); setCategoriaId(""); }}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${tipo === 1
                                ? "bg-red-500/20 border-red-500/40 text-red-400"
                                : "bg-transparent border-white/10 text-slate-500 hover:border-white/20"
                                }`}
                        >
                            💸 Despesa
                        </button>
                        <button
                            type="button"
                            onClick={() => { setTipo(2); setCategoriaId(""); }}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${tipo === 2
                                ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                                : "bg-transparent border-white/10 text-slate-500 hover:border-white/20"
                                }`}
                        >
                            💰 Receita
                        </button>
                    </div>

                    {/* Row 1 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Descrição..."
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            className="bg-[#0f1117] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500/60 transition-colors"
                            required
                        />
                        <input
                            type="number"
                            placeholder="Valor (R$)"
                            value={valor}
                            onChange={(e) =>
                                setValor(e.target.value === "" ? "" : Number(e.target.value))
                            }
                            min={0.01}
                            step={0.01}
                            className="bg-[#0f1117] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500/60 transition-colors"
                            required
                        />
                    </div>

                    {/* Row 2 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <select
                            value={categoriaId}
                            onChange={(e) => setCategoriaId(Number(e.target.value))}
                            className="bg-[#0f1117] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500/60 transition-colors"
                            required
                        >
                            <option value="">Selecione uma categoria...</option>
                            {categoriasFiltradas.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.descricao}
                                </option>
                            ))}
                        </select>

                        <select
                            value={pessoaId}
                            onChange={(e) => setPessoaId(Number(e.target.value))}
                            className="bg-[#0f1117] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500/60 transition-colors"
                            required
                        >
                            <option value="">Selecione uma pessoa...</option>
                            {pessoas.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.nome}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl transition-colors"
                    >
                        {saving ? "Registrando..." : "Registrar Transação"}
                    </button>
                </form>

                {error && (
                    <p className="mt-3 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">
                        {error}
                    </p>
                )}
                {success && (
                    <p className="mt-3 text-sm text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-lg px-4 py-2">
                        Transação registrada com sucesso!
                    </p>
                )}
            </div>

            {/* Table */}
            <div className="bg-[#1a1d27] border border-white/5 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">
                        Histórico
                    </h2>
                    <span className="text-xs text-slate-600">
                        {transacoes.length} registro(s)
                    </span>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <div className="w-6 h-6 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
                    </div>
                ) : transacoes.length === 0 ? (
                    <div className="text-center py-16 text-slate-600">
                        Nenhuma transação registrada.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[640px]">
                            <thead>
                                <tr className="border-b border-white/5">
                                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-widest px-6 py-3">#</th>
                                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-widest px-6 py-3">Descrição</th>
                                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-widest px-6 py-3">Tipo</th>
                                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-widest px-6 py-3">Categoria</th>
                                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-widest px-6 py-3">Pessoa</th>
                                    <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-widest px-6 py-3">Valor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transacoes.map((t, i) => (
                                    <tr
                                        key={t.id}
                                        className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors ${i % 2 === 0 ? "" : "bg-white/[0.01]"
                                            }`}
                                    >
                                        <td className="px-6 py-4 text-slate-600 text-sm">{t.id}</td>
                                        <td className="px-6 py-4 text-white font-medium">{t.descricao}</td>
                                        <td className="px-6 py-4">
                                            {t.tipo === 1 ? (
                                                <span className="text-xs font-semibold px-3 py-1 rounded-full text-red-400 bg-red-400/10 border border-red-400/20">
                                                    Despesa
                                                </span>
                                            ) : (
                                                <span className="text-xs font-semibold px-3 py-1 rounded-full text-emerald-400 bg-emerald-400/10 border border-emerald-400/20">
                                                    Receita
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-slate-300 text-sm">
                                            {t.categoria?.descricao ?? `#${t.categoriaId}`}
                                        </td>
                                        <td className="px-6 py-4 text-slate-300 text-sm">
                                            {t.pessoa?.nome ?? `#${t.pessoaId}`}
                                        </td>
                                        <td
                                            className={`px-6 py-4 text-right font-semibold tabular-nums ${t.tipo === 1 ? "text-red-400" : "text-emerald-400"
                                                }`}
                                        >
                                            {t.tipo === 1 ? "- " : "+ "}
                                            {fmt(t.valor)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}