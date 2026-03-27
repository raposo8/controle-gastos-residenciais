export interface Pessoa {
  id: number;
  nome: string;
  idade: number;
}

export interface Categoria {
  id: number;
  descricao: string;
  finalidade: number; // 1=Despesa, 2=Receita, 3=Ambas
}

export interface Transacao {
  id: number;
  descricao: string;
  valor: number;
  tipo: number; // 1=Despesa, 2=Receita
  categoriaId: number;
  pessoaId: number;
  categoria?: Categoria;
  pessoa?: Pessoa;
}

export interface TotaisPessoa {
  pessoaNome: string;
  totalReceitas: number;
  totalDespesas: number;
  saldoLiquido: number;
}

export interface TotaisCategoria {
  categoriaDescricao: string;
  totalReceitas: number;
  totalDespesas: number;
  saldoLiquido: number;
}