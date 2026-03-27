using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Gastos.Domain.Enums;

namespace Gastos.Domain.Entities
{
    public class Transacao
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required(ErrorMessage = "A descrição é obrigatória.")]
        [MaxLength(400, ErrorMessage = "A descrição não pode exceder 400 caracteres.")]
        public string Descricao { get; set; } = string.Empty;

        [Required]
        [Column(TypeName = "decimal(18,2)")] 
        public decimal Valor { get; set; }

        [Required]
        public TipoTransacao Tipo { get; set; }

        // Chaves Estrangeiras
        [Required]
        public int CategoriaId { get; set; }

        [Required]
        public int PessoaId { get; set; }

        // Propriedades de Navegação
        [ForeignKey("CategoriaId")]
        public virtual Categoria? Categoria { get; set; }

        [ForeignKey("PessoaId")]
        public virtual Pessoa? Pessoa { get; set; }
    }
}