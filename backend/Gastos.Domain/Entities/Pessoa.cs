using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Gastos.Domain.Entities
{
    public class Pessoa
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)] // Garante o valor único gerado automaticamente
        public int Id { get; set; }

        [Required(ErrorMessage = "O nome é obrigatório.")]
        [MaxLength(200, ErrorMessage = "O nome não pode exceder 200 caracteres.")]
        public string Nome { get; set; } = string.Empty;

        [Required]
        public int Idade { get; set; }

        // Propriedade de navegação
        public virtual ICollection<Transacao> Transacoes { get; set; } = new List<Transacao>();
    }
}