import { useEffect, useState } from "react";
import {
    getPessoas,
    createPessoa,
    updatePessoa,
    deletePessoa,
} from "../api";
import type { Pessoa } from "../types";

export default function Pessoas() {
    const [pessoas, setPessoas] = useState<Pessoa[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [editingId, setEditingId] = useState<number | null>(null);
    const [nome, setNome] = useState("");
    const [idade, setIdade] = useState<number | "">("");

    const load = async () => {
        setLoading(true);
        try {
            setPessoas(await getPessoas());
        } catch {
            setError("Falha ao carregar pessoas.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const resetForm = () => {
        setEditingId(null);
        setNome("");
        setIdade("");
        setError(null);
    };

    const handleEdit = (p: Pessoa) => {
        setEditingId(p.id);
        setNome(p.nome);
        setIdade(p.idade);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Excluir esta pessoa?")) return;
        try {
            await deletePessoa(id);
            setSuccess("Pessoa excluída.");
            setTimeout(() => setSuccess(null), 2500);
            await load();
        } catch {
            setError("Falha ao excluir.");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nome.trim() || idade === "") return;
        setSaving(true);
        setError(null);
        try {
            if (editingId !== null) {
                await updatePessoa(editingId, { nome: nome.trim(), idade: Number(idade), id: editingId });
                setSuccess("Pessoa atualizada com sucesso!");
            } else {
                await createPessoa({ nome: nome.trim(), idade: Number(idade) });
                setSuccess("Pessoa cadastrada com sucesso!");
            }
            setTimeout(() => setSuccess(null), 2500);
            resetForm();
            await load();
        } catch {
            setError("Falha ao salvar pessoa.");
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
                    Pessoas
                </h1>
            </div>

            {/* Form */}
            <div className="bg-[#1a1d27] border border-white/5 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">
                        {editingId !== null ? "Editar Pessoa" : "Nova Pessoa"}
                    </h2>
                    {editingId !== null && (
                        <button
                            onClick={resetForm}
                            className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
                        >
                            Cancelar edição ✕
                        </button>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                    <input
                        type="text"
                        placeholder="Nome completo..."
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        className="flex-1 bg-[#0f1117] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500/60 transition-colors"
                        required
                    />
                    <input
                        type="number"
                        placeholder="Idade"
                        value={idade}
                        onChange={(e) =>
                            setIdade(e.target.value === "" ? "" : Number(e.target.value))
                        }
                        min={0}
                        max={150}
                        className="bg-[#0f1117] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500/60 transition-colors w-32"
                        required
                    />
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl transition-colors whitespace-nowrap"
                    >
                        {saving ? "Salvando..." : editingId !== null ? "Atualizar" : "Cadastrar"}
                    </button>
                </form>

                {error && (
                    <p className="mt-3 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">
                        {error}
                    </p>
                )}
                {success && (
                    <p className="mt-3 text-sm text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-lg px-4 py-2">
                        {success}
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
                        {pessoas.length} registro(s)
                    </span>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <div className="w-6 h-6 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
                    </div>
                ) : pessoas.length === 0 ? (
                    <div className="text-center py-16 text-slate-600">
                        Nenhuma pessoa cadastrada.
                    </div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-widest px-6 py-3">
                                    #
                                </th>
                                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-widest px-6 py-3">
                                    Nome
                                </th>
                                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-widest px-6 py-3">
                                    Idade
                                </th>
                                <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-widest px-6 py-3">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {pessoas.map((p, i) => (
                                <tr
                                    key={p.id}
                                    className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors ${i % 2 === 0 ? "" : "bg-white/[0.01]"
                                        } ${editingId === p.id ? "ring-1 ring-inset ring-violet-500/30" : ""}`}
                                >
                                    <td className="px-6 py-4 text-slate-600 text-sm">{p.id}</td>
                                    <td className="px-6 py-4 text-white font-medium">{p.nome}</td>
                                    <td className="px-6 py-4 text-slate-300">
                                        {p.idade} anos
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button
                                            onClick={() => handleEdit(p)}
                                            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20 hover:bg-violet-500/20 transition-colors"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(p.id)}
                                            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
                                        >
                                            Excluir
                                        </button>
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